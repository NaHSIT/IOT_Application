/**
 * Data Model Configuration Manager
 * Manages the dynamic configuration of sensors and controls.
 */

const DEFAULT_DATA_MODEL = {
    sensors: [
        { id: 'temp', name: '温度', icon: 'fa-thermometer-half', color: 'orange', unit: '℃', cloudKey: 'Temp', min: 15, max: 32, dataType: 'float', step: 0.1 },
        { id: 'hum', name: '湿度', icon: 'fa-droplet', color: 'blue', unit: '%', cloudKey: 'Humi', min: 20, max: 80, dataType: 'float', step: 0.1 },
        { id: 'smoke', name: '烟雾浓度', icon: 'fa-wind', color: 'slate', unit: 'ppm', cloudKey: 'MQ2', min: 0, max: 100, dataType: 'int32', step: 1 },
        { id: 'water', name: '水位', icon: 'fa-water', color: 'cyan', unit: '%', cloudKey: 'Deep', min: 10, max: 90, dataType: 'float', step: 1 }
    ],
    controls: [
        { id: 'valve', name: '电磁阀', icon: 'fa-toggle-off', color: 'blue', cloudKey: 'Valve', dataType: 'bool', step: 1 },
        { id: 'fan', name: '排风扇', icon: 'fa-fan', color: 'cyan', cloudKey: 'Fun', dataType: 'bool', step: 1 },
        { id: 'led2', name: '报警灯', icon: 'fa-lightbulb', color: 'red', cloudKey: 'LED2', dataType: 'bool', step: 1 },
        { id: 'led1', name: '照明灯', icon: 'fa-lightbulb', color: 'yellow', cloudKey: 'LED1', dataType: 'bool', step: 1 },
        { id: 'buzzer', name: '蜂鸣器', icon: 'fa-bullhorn', color: 'orange', cloudKey: 'Buzzer', dataType: 'bool', step: 1 }
    ],
    videoData: []
};

// Common FontAwesome icons for the user to select
const COMMON_ICONS = [
    'fa-thermometer-half', 'fa-droplet', 'fa-wind', 'fa-water', 'fa-fire', 
    'fa-bolt', 'fa-lightbulb', 'fa-fan', 'fa-toggle-on', 'fa-toggle-off', 
    'fa-bell', 'fa-bullhorn', 'fa-plug', 'fa-power-off', 'fa-microchip', 
    'fa-server', 'fa-battery-full', 'fa-smog', 'fa-cloud', 'fa-sun',
    'fa-snowflake', 'fa-lock', 'fa-unlock', 'fa-video', 'fa-camera',
    'fa-door-open', 'fa-door-closed', 'fa-car-battery', 'fa-satellite-dish',
    'fa-users', 'fa-user', 'fa-eye', 'fa-car', 'fa-truck'
];

function getDataModel() {
    try {
        const saved = localStorage.getItem('iot_data_model');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading data model:', e);
    }
    return DEFAULT_DATA_MODEL;
}

function saveDataModel(model) {
    localStorage.setItem('iot_data_model', JSON.stringify(model));
}

// Helper to determine decimal places based on data type and step
function getDecimals(dataType, step) {
    if (dataType === 'int32') return 0;
    if (step === undefined || step === null) return 1;
    const stepStr = String(step);
    if (stepStr.includes('.')) {
        return stepStr.split('.')[1].length;
    }
    return 0;
}

// UI Color mapping helpers（对应 css/common.css 中的语义色板类）
const COLOR_CLASSES = {
    'orange': { bg: 'tile-orange', text: 'c-orange', chip: 'chip-orange', border: '', fill: 'fill-orange' },
    'blue': { bg: 'tile-blue', text: 'c-blue', chip: 'chip-blue', border: '', fill: 'fill-blue' },
    'slate': { bg: 'tile-slate', text: 'c-slate', chip: 'chip-slate', border: '', fill: 'fill-slate' },
    'cyan': { bg: 'tile-cyan', text: 'c-cyan', chip: 'chip-cyan', border: '', fill: 'fill-cyan' },
    'teal': { bg: 'tile-teal', text: 'c-teal', chip: 'chip-teal', border: '', fill: 'fill-teal' },
    'yellow': { bg: 'tile-yellow', text: 'c-yellow', chip: 'chip-yellow', border: '', fill: 'fill-yellow' },
    'red': { bg: 'tile-red', text: 'c-red', chip: 'chip-red', border: '', fill: 'fill-red' },
    'green': { bg: 'tile-green', text: 'c-green', chip: 'chip-green', border: '', fill: 'fill-green' },
    'purple': { bg: 'tile-purple', text: 'c-purple', chip: 'chip-purple', border: '', fill: 'fill-purple' },
    'pink': { bg: 'tile-pink', text: 'c-pink', chip: 'chip-pink', border: '', fill: 'fill-pink' }
};
