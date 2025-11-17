# rouvy-packet-monitor


## Use

Install with

``
npm install <library address>
``

See an example in `test/test-live-outgoing-player-state.js`

**ESM and CommonJS Usage**
- **CommonJS (require):**

```javascript
// from an application that installs the package
const RouvyPacketMonitor = require('rouvy-packet-monitor')
// or when running locally during development
// const RouvyPacketMonitor = require('./RouvyPacketMonitor.js')

const monitor = new RouvyPacketMonitor(interfaceName)
monitor.start()
```

- **ESM (import):**

```javascript
// using native ESM imports
import RouvyPacketMonitor from 'rouvy-packet-monitor'
// or import the local ESM shim while developing:
// import RouvyPacketMonitor from './RouvyPacketMonitor.mjs'

const monitor = new RouvyPacketMonitor(interfaceName)
monitor.start()
```

- **Notes:**
	- The package includes an `exports` mapping in `package.json` so Node will resolve the proper entry for `import` vs `require`.
	- Simple smoke tests to verify both loading methods: `test/smoke-cjs.js` and `test/smoke-esm.mjs` have been added. 
		Run them locally with:

```powershell
node .\test\smoke-cjs.js
node .\test\smoke-esm.mjs
```

**Dynamic import and error handling (ESM)**

A dynamic `import()` rather than static import will allow you to catch errors, e.g. from missing npcap. Example:

```javascript
// in an ESM context (e.g. .mjs file or package with "type": "module")
async function startMonitor(ip) {
	try {
		const mod = await import('rouvy-packet-monitor')
		const RouvyPacketMonitor = mod.default ?? mod
		const monitor = new RouvyPacketMonitor(ip)
		monitor.start()
		return monitor
	} catch (err) {
		console.error('Failed to dynamically import rouvy-packet-monitor:', err)
		// handle gracefully: fallback, notify user, or rethrow
		throw err
	}
}

// Usage
startMonitor(ip).catch(() => process.exit(1))
```

Alternatively you can use `import('rouvy-packet-monitor').catch(err => { ... })` when you prefer promise-style handling.


## How to activate cap

The library intercepts the UDP sent from the Rouvy game client to the Rouvy game server.

You must make the following OS specific setup of your computer:


### Windows


You must install [Npcap](https://nmap.org/npcap/) with WinPcap compatibility on your PC.

This will let the application capture network traffic (from next time you start it).



### macOS

Your user must have access rights to enable capture of network traffic. You can enable it with the following command in Terminal (it will give your user read access to the network devices /dev/bpf*):

```
sudo chmod o+r /dev/bpf*
```

This will let the application capture network traffic (from next time you start it).


