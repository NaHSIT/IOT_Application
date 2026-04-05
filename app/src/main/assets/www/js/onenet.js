/**
 * OneNet IoT Platform Service
 * 用于与 OneNet 云平台进行数据同步
 */

// 动态获取 OneNet 配置，如果未设置则使用默认的回退配置
function getOneNetConfig() {
    const userConfig = JSON.parse(localStorage.getItem('iot_onenet_config') || 'null');
    
    if (userConfig && userConfig.productId && userConfig.deviceName && userConfig.token) {
        return {
            PRODUCT_ID: userConfig.productId,
            DEVICE_NAME: userConfig.deviceName,
            TOKEN: userConfig.token,
            BASE_URL: 'https://iot-api.heclouds.com'
        };
    }
    // 返回空配置以触发拦截
    return {
        PRODUCT_ID: '', 
        DEVICE_NAME: '', 
        TOKEN: 'YOUR_TOKEN', 
        BASE_URL: 'https://iot-api.heclouds.com'
    };
}

class OneNetService {
    /**
     * 获取设备最新属性值 (物模型)
     * @returns {Promise<Object>} 返回处理后的数据对象
     */
    static async getLatestData() {
        const config = getOneNetConfig();
        try {
            // 如果配置未填写，提示用户
            if (config.TOKEN.includes('YOUR_')) {
                console.warn('OneNet Token is not configured. Using mock data for UI preview.');
                return this.getMockData();
            }

            console.log('Fetching OneNet data for:', config.DEVICE_NAME);
            
            const url = `${config.BASE_URL}/thingmodel/query-device-property?product_id=${config.PRODUCT_ID}&device_name=${config.DEVICE_NAME}`;
            
            // 调试用：记录请求信息
            console.log('OneNet Request URL:', url);
            console.log('OneNet Authorization:', config.TOKEN);

            // 同时获取设备在线状态
            const statusUrl = `${config.BASE_URL}/device/detail?product_id=${config.PRODUCT_ID}&device_name=${config.DEVICE_NAME}`;
            
            const [response, statusResponse] = await Promise.all([
                fetch(url, { method: 'GET', headers: { 'Authorization': config.TOKEN } }),
                fetch(statusUrl, { method: 'GET', headers: { 'Authorization': config.TOKEN } }).catch(e => null)
            ]);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Network Response Error:', response.status, errorText);
                
                // 常见错误处理
                if (response.status === 401) {
                    throw new Error('鉴权失败(401): 请检查 Token');
                } else if (response.status === 403) {
                    throw new Error('拒绝访问(403): 检查产品/设备名');
                } else if (response.status === 404) {
                    throw new Error('服务未找到(404): 检查 BASE_URL');
                } else if (response.status === 406) {
                    // 专门针对 406 错误，尝试显示 HTML 标题
                    const titleMatch = errorText.match(/<title>(.*?)<\/title>/i);
                    const title = titleMatch ? titleMatch[1] : '服务器拒绝请求(406)';
                    throw new Error(`连接失败: ${title}`);
                }
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('OneNet Raw Response:', result);

            if (result.code !== 0) {
                console.error('OneNet API Error:', result.code, result.msg);
                
                // OneNet 业务错误码处理
                if (result.code === 401 || result.msg.toLowerCase().includes('token')) {
                    throw new Error('Token 过期或格式错误');
                } else if (result.msg.includes('device not found')) {
                    throw new Error('找不到该设备');
                }
                throw new Error(`API错误(${result.code}): ${result.msg}`);
            }

            const data = {};
            if (result.data && Array.isArray(result.data)) {
                // 1. 将 OneNet 原始数据转换为键值对
                const rawData = {};
                result.data.forEach(item => {
                    let val = item.value;
                    // OneNet 返回的值可能全是字符串，这里做自动类型转换
                    if (val === 'true') {
                        val = true;
                    } else if (val === 'false') {
                        val = false;
                    } else if (!isNaN(val) && val !== '') {
                        val = Number(val);
                    }
                    rawData[item.identifier] = val;
                });
                
                // 2. 根据用户的动态数据模型配置，将数据转化为前端标准标识符
                const model = typeof getDataModel === 'function' ? getDataModel() : { sensors: [], controls: [] };
                
                model.sensors.forEach(s => {
                    if (rawData[s.cloudKey] !== undefined) data[s.id] = rawData[s.cloudKey];
                });
                model.controls.forEach(c => {
                    if (rawData[c.cloudKey] !== undefined) data[c.id] = rawData[c.cloudKey];
                });
                
                // 将最新数据缓存到 localStorage，避免页面切换时的闪烁和预设值问题
                // 合并现有缓存，保留可能存在的乐观更新状态
                const cachedData = JSON.parse(localStorage.getItem('iot_latest_data') || '{}');
                const controlLocks = JSON.parse(localStorage.getItem('iot_control_locks') || '{}');
                const now = Date.now();
                
                for (const key in data) {
                    // 如果该属性在最近 3 秒内被下发过控制指令，则忽略云端的旧状态（乐观更新锁）
                    if (controlLocks[key] && (now - controlLocks[key] < 3000)) {
                        data[key] = cachedData[key]; // 保持缓存中的乐观状态
                    }
                }
                
                const newData = { ...cachedData, ...data };
                localStorage.setItem('iot_latest_data', JSON.stringify(newData));

                // 保存历史数据用于图表展示
                let historyData = JSON.parse(localStorage.getItem('iot_history_data') || '[]');
                const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;
                const fullTimeStr = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${timeStr}:${new Date().getSeconds().toString().padStart(2, '0')}`;
                
                // 每分钟最多保存一条记录
                if (historyData.length === 0 || historyData[historyData.length - 1].time !== timeStr) {
                    historyData.push({
                        time: timeStr,
                        fullTime: fullTimeStr,
                        timestamp: Date.now(), // 存储精确时间戳方便查询
                        data: { ...data }
                    });
                    
                    // 限制历史记录最多保留 1440 条 (24小时 * 60分钟)
                    if (historyData.length > 1440) {
                        historyData.shift();
                    }
                    localStorage.setItem('iot_history_data', JSON.stringify(historyData));
                }
                
            } else {
                console.warn('OneNet: 成功获取数据但列表为空，可能设备未上报属性');
            }
            
            // 解析设备在线状态
            let isOnline = false;
            if (statusResponse && statusResponse.ok) {
                const statusResult = await statusResponse.json();
                if (statusResult.code === 0 && statusResult.data) {
                    // OneNet Studio API 中：status 字段表示设备状态（通常 1 表示在线，0 表示离线/未激活）
                    isOnline = statusResult.data.status == 1 || statusResult.data.status === '在线' || statusResult.data.status == 2;
                }
            }
            data._isOnline = isOnline;

            return data;
        } catch (error) {
            console.error('OneNet Fetch Catch:', error.message);
            
            // 如果是因为跨域导致无法获取 error 信息
            if (error.message === 'Failed to fetch') {
                throw new Error('网络请求被拦截(请重启APP生效)');
            }
            
            throw error; // 继续向外抛出，让 UI 捕获并显示
        }
    }

    /**
     * 提供模拟数据供开发预览 (当云端未连接时)
     */
    static getMockData() {
        const mockData = { _isMock: true };
        const model = typeof getDataModel === 'function' ? getDataModel() : { sensors: [], controls: [] };
        
        model.sensors.forEach(s => {
            const range = s.max - s.min;
            const mid = s.min + range / 2;
            const rawVal = mid + (Math.random() * (range * 0.2) - (range * 0.1));
            const decimals = typeof getDecimals === 'function' ? getDecimals(s.dataType, s.step) : 1;
            mockData[s.id] = Number(rawVal.toFixed(decimals));
        });
        model.controls.forEach(c => {
            if (c.dataType === 'int32') {
                mockData[c.id] = Math.floor(Math.random() * 100);
            } else if (c.dataType === 'float' || c.dataType === 'double') {
                const decimals = typeof getDecimals === 'function' ? getDecimals(c.dataType, c.step) : 2;
                mockData[c.id] = Number((Math.random() * 100).toFixed(decimals));
            } else if (c.dataType === 'string') {
                mockData[c.id] = "mock_str";
            } else {
                mockData[c.id] = Math.random() > 0.5;
            }
        });
        return mockData;
    }

    /**
     * 向设备下发属性设置 (物模型控制)
     * @param {Object} params 属性键值对，例如 {"valve": true}
     */
    static async setProperty(params) {
        const config = getOneNetConfig();
        try {
            // 将内部的属性名转换为用户配置的云端属性名
            const mappedParams = {};
            const model = typeof getDataModel === 'function' ? getDataModel() : { sensors: [], controls: [] };
            
            // 构建反向映射: appId -> cloudKey
            const reverseMap = {};
            model.controls.forEach(c => reverseMap[c.id] = c.cloudKey);
            model.sensors.forEach(s => reverseMap[s.id] = s.cloudKey);

            for (const key in params) {
                if (reverseMap[key]) {
                    mappedParams[reverseMap[key]] = params[key];
                } else {
                    // Fallback for non-mapped or direct keys
                    mappedParams[key] = params[key];
                }
            }

            // 新版 OneNet Studio 设置设备属性 API:
            // POST /thingmodel/set-device-property
            const response = await fetch(`${config.BASE_URL}/thingmodel/set-device-property`, {
                method: 'POST',
                headers: {
                    'Authorization': config.TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: config.PRODUCT_ID,
                    device_name: config.DEVICE_NAME,
                    params: mappedParams
                })
            });

            const result = await response.json();
            
            if (result.code === 0) {
                // 指令下发成功，进行乐观 UI 更新
                const cachedData = JSON.parse(localStorage.getItem('iot_latest_data') || '{}');
                const controlLocks = JSON.parse(localStorage.getItem('iot_control_locks') || '{}');
                const now = Date.now();
                
                for (const key in params) {
                    cachedData[key] = params[key];
                    controlLocks[key] = now; // 记录控制时间，3秒内忽略云端旧状态
                }
                
                localStorage.setItem('iot_latest_data', JSON.stringify(cachedData));
                localStorage.setItem('iot_control_locks', JSON.stringify(controlLocks));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('OneNet Studio Property Set Error:', error);
            return false;
        }
    }
}

// 导出配置和类 (如果环境支持 ES6 模块)
// if (typeof module !== 'undefined') {
//     module.exports = { ONENET_CONFIG, OneNetService };
// }
