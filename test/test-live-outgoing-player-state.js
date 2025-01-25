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

const ip = require('internal-ip').v4.sync();



if (RouvyPacketMonitor && Cap) {

    console.log('Listening on: ', ip, JSON.stringify(Cap.findDevice(ip),null,4));
    
    // determine network interface associated with external IP address
    interface = Cap.findDevice(ip);
    // ... and setup monitor on that interface:
    const monitor = new RouvyPacketMonitor(interface)
    

    
    monitor.on('outgoingPlayerState', (playerState) => {
        console.log(playerState)
    })
    
    
    monitor.start()
}

