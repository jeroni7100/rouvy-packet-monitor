# pg-rouvy-packet-monitor


## Use

Install with

``
npm install <library address>
``

See an example in `test/test-live-outgoing-player-state.js`

## How to activate cap

The library intercepts the UDP sent from the Rouvy game client to the Rouvy game server.

You must make the following OS specific setup of your computer:


### Windows


You must install [Npcap](https://nmap.org/npcap/) on your PC.

This will let the application capture network traffic (from next time you start it).



### macOS

Your user must have access rights to enable capture of network traffic. You can enable it with the following command in Terminal (it will give your user read access to the network devices /dev/bpf*):

```
sudo chmod o+r /dev/bpf*
```

This will let the application capture network traffic (from next time you start it).


