//创建客户端，连接TCP服务器
var net = require('net');
//通过net.connect()方法连接到TCP服务器
var client = net.connect({port: 8080}, function() {
   console.log('连接到服务器！');  
});
//client接收到来自于服务器的数据
client.on('data', function(data) {
   console.log(data.toString());
   //通过调用end()方法可以断开与服务器的连接，并触自己的end事件与服务器端对应connection的end事件
   client.end();
});
client.on('end', function() { 
   console.log('断开与服务器的连接');
});