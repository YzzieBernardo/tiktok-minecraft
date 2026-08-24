import { sendCommand } from './lcon.js';

export function runCommand(command) {
    sendCommand(command);
}

export function say(message) {
    sendCommand(`say ${message}`);
}

export function timeSet(time) {
    sendCommand(`time set ${time}`);
}

export function weather(type) {
    sendCommand(`weather ${type}`);
}