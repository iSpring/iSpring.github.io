/**
 * 通过dgram.createSocket('udp4')创建udp服务器，
 * 还是通过dgram.createSocket('udp4')创建udp客户端，只不过客户端不需要bind端口
 */
//https://nodejs.org/api/dgram.html
const dgram = require('dgram');
const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
//通过client的send方法向UDP服务器发送message
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});