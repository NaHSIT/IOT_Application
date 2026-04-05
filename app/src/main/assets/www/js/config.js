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
    ]
};

// Common FontAwesome icons for the user to select
const COMMON_ICONS = [
    'fa-thermometer-half', 'fa-droplet', 'fa-wind', 'fa-water', 'fa-fire', 
    'fa-bolt', 'fa-lightbulb', 'fa-fan', 'fa-toggle-on', 'fa-toggle-off', 
    'fa-bell', 'fa-bullhorn', 'fa-plug', 'fa-power-off', 'fa-microchip', 
    'fa-server', 'fa-battery-full', 'fa-smog', 'fa-cloud', 'fa-sun',
    'fa-snowflake', 'fa-lock', 'fa-unlock', 'fa-video', 'fa-camera',
    'fa-door-open', 'fa-door-closed', 'fa-car-battery', 'fa-satellite-dish'
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

// UI Color mapping helpers
const COLOR_CLASSES = {
    'orange': { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100/50', fill: 'bg-orange-500' },
    'blue': { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100/50', fill: 'bg-blue-500' },
    'slate': { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100/50', fill: 'bg-slate-500' },
    'cyan': { bg: 'bg-cyan-50', text: 'text-cyan-500', border: 'border-cyan-100/50', fill: 'bg-cyan-500' },
    'teal': { bg: 'bg-teal-50', text: 'text-teal-500', border: 'border-teal-100/50', fill: 'bg-teal-500' },
    'yellow': { bg: 'bg-yellow-50', text: 'text-yellow-500', border: 'border-yellow-100/50', fill: 'bg-yellow-500' },
    'red': { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100/50', fill: 'bg-red-500' },
    'green': { bg: 'bg-green-50', text: 'text-green-500', border: 'border-green-100/50', fill: 'bg-green-500' },
    'purple': { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-100/50', fill: 'bg-purple-500' },
    'pink': { bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-100/50', fill: 'bg-pink-500' }
};
