const { time } = require('console');
const EventEmitter = require('events')

const PORT = 14325;

try {
  var Cap = require('cap').Cap;
  var decoders=require('cap').decoders, PROTOCOL=decoders.PROTOCOL
} catch (e) {
  throw new Error('Probably missing Npcap/libpcap')
}

const buffer = new Buffer.alloc(65535)

class RGTPacketMonitor extends EventEmitter {
  constructor (interfaceName) {
    super()
    this._cap = new Cap()
    this._linkType = null
    this._sequence = 0
    // this._tcpSeqNo = 0
    this._tcpAssembledLen = 0
    this._tcpBuffer = null
    if (interfaceName.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
      this._interfaceName = Cap.findDevice(interfaceName)
    } else {
      this._interfaceName = interfaceName
    }
    
  }
  
  start () {
    try {

      // INFO Rouvy.UI.Training.TrainingScreenController - Multiplayer server info has been set: "34.23.237.138:14325"

      this._linkType = this._cap.open(this._interfaceName, `udp port ${PORT}`, 10 * 1024 * 1024, buffer)
      this._cap.setMinBytes && this._cap.setMinBytes(0)
      this._cap.on('packet', this.processPacket.bind(this))
    } catch (e) {
      throw new Error('Error in cap.open - probably insufficient access rights')
    }
  }
  
  stop () {
    this._cap.close()
  }
  
  static deviceList () {
    return  Cap.deviceList()
  }
  
  _decodeOutgoing(buffer) {
    
    // console.log('in _decodeOutgoing')
    // console.log(buffer.byteLength)
    
    if (Buffer.isBuffer(buffer) && (buffer.byteLength == 28)) {

      try {
        var packetType = buffer.readUIntLE(0,1)
        // var packetNum = buffer.readUIntLE(1, 4)
        // var timestamp = buffer.readUIntLE(0, 6)
        // var value = buffer.readUIntLE(12,2)
        
        var packetnum = buffer.readUIntLE(1, 4)
        
        if (packetType == 1) {
          var msgType = buffer.readUIntLE(0x04, 2)
          var _length = buffer.readUIntLE(0x06, 4) // ??? 1 
          var _id = buffer.readUIntLE(0x08, 4) // ??
          var _time = buffer.readUIntLE(0x0c, 4) // alway 0 ??
          var riderStatus = buffer.readUIntLE(0x12, 1) // 0 = Prepared, 1 = Running, 2 = Paused, 3 = Finished, 4 = Disconnected
          var distance = buffer.readFloatLE(0x13, 4) // m
          var speed = buffer.readUIntLE(0x17, 2) / 10 // m/s
          var power = buffer.readUIntLE(0x19, 2)
          var cadence = buffer.readUIntLE(0x1b, 1)
          
          var rouvyPacket = null
        
          rouvyPacket = {
            state: {
              timestamp: Date.now(),
              packetnum: packetnum,
              msgType: msgType,
              // id: id,
              time: _time,
              riderStatus: riderStatus,
              distance: distance,
              speed: speed,
              speedKmh: speed * 3.6,
              power: power,
              cadence: cadence
            }
          }
          
          return rouvyPacket

        } else {
          return null
        }
        
      } catch (err) {
        log.debug('_decodeOutgoing error', err)
      }
      
    } 
  }
  
  
  
  processPacket () {
    
    
    if (this._linkType === 'ETHERNET') {
      let ret = decoders.Ethernet(buffer)
      
      
      if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
        // console.log(ret.info.type)
        ret = decoders.IPV4(buffer, ret.offset)
        // console.log(ret.info.protocol)
        if (ret.info.protocol === PROTOCOL.IP.UDP) {
          ret = decoders.UDP(buffer, ret.offset)
          try {
            if (ret.info.dstport === PORT) {
              // console.log(ret.info.dstport)
              try {
                // console.log(ret.offset, ret.offset + ret.info.length )
                let packet = this._decodeOutgoing(buffer.slice(ret.offset, ret.offset + ret.info.length ))
                if (packet && packet.state) {
                  this.emit('outgoingPlayerState', packet.state, ret.info.srcport, ret.info.srcaddr)
                }
              } catch (ex) {
              }
            }
          } catch (ex) {
          }
        } 
      } 
    }
  }
}


module.exports = RGTPacketMonitor

