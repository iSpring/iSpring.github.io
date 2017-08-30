//创建TCP服务器
//先启动server，然后在另一个终端启动client
//http://www.runoob.com/nodejs/nodejs-net-module.html
var net = require('net');

//类似于http.createServer(cb).listen()
var server = net.createServer(function(connection) { 
   console.log('client connected');
   connection.on('end', function() {
      console.log('客户端关闭连接');
   });
   //向客户端写入数据，不要调用end()方法，调用end()方法会导致断开连接
   connection.write('Hello World!\r\n');
   //connection.pipe(connection);
});
server.listen(8080, function() { 
  console.log('server is listening');
});