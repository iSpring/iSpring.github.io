/**
 * 通过dgram.createSocket('udp4')创建udp服务器，与net.createServer(cb).listen()不同
 * 还是通过dgram.createSocket('udp4')创建udp客户端，只不过客户端不需要bind端口
 */

//https://nodejs.org/api/dgram.html
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

//UDP服务器收到message
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//此处是bind方法，不是listen
server.bind(41234);