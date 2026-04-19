try {
    console.log('Require: RouvyPacketMonitor')
    var RouvyPacketMonitor = require('../RouvyPacketMonitor.js')
    console.log('Create monitor')
} catch(e) {
    console.log(e)
}

try {
    var Cap = require('cap').Cap;
} catch(e) {
    console.log(e)
}

const { v4DefaultGateway } = require('network-default-gateway');
// Determine bind IP via network-default-gateway
let ip;
try {
    const defaultGateway = v4DefaultGateway();
} catch (e) {
    /** @type {any} */
    const err = e;
    console.log('Could not determine default gateway IP:', err?.message ?? err);
}

// wait for the default gateway promise to resolve
v4DefaultGateway().then((defaultGateway) => {
    ip = defaultGateway?.ip;
    if (!ip) {
        console.log('Could not determine default gateway IP');
    } else {
        console.log('Default gateway IP:', ip);
    }

    if (ip && RouvyPacketMonitor && Cap) {

        
        // determine network interface associated with external IP address
        interface = Cap.findDevice(ip);
        console.log('Listening on: ', ip, JSON.stringify(interface, null, 4));
        // ... and setup monitor on that interface:
        const monitor = new RouvyPacketMonitor(interface)
        

        
        monitor.on('outgoingPlayerState', (playerState) => {
            console.log(playerState)
        })
        
        
        monitor.start()
    }

}).catch((err) => {
    console.log('Error determining default gateway IP:', err);
})