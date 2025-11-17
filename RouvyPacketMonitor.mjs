import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the existing CommonJS implementation and re-export for ESM consumers
const cjs = require('./RouvyPacketMonitor.js');

export default cjs;
export const RouvyPacketMonitor = cjs;
