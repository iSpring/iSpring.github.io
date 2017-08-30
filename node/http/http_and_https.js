//tcp连接负责监听basePort，在onTcpConnection中转发给httpPort或httpsPort
const net = require('net');//主要用于TCP处理
const http = require('http');
const https = require('https');
const fs = require('fs');

const basePort = 3000;
const httpPort = basePort + 1;
const httpsPort = basePort + 2;

//var app = express();
//app.use();

//此处的app也可以是express()的实例
function app(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write(req.url);
    res.end();
}

function onTcpConnection(tcpSocket) {
    tcpSocket.once('data', function (buf) {
        try {
            // A TLS handshake record starts with byte 22.
            // TLS/HTTPS连接第一个字节为22
            var port = (buf[0] === 22) ? httpsPort : httpPort;
            var proxySocket = net.createConnection(port, function () {
                try {
                    proxySocket.write(buf);
                    //将tcp连接转发给http(s)请求，并将其返回结果再次转发给tcp连接
                    //需要注意的是，由于tcpSocket已经通过data事件读取了一次buf，
                    //所以要调用proxySocket.write(buf)将buf写入proxySocket
                    tcpSocket.pipe(proxySocket).pipe(tcpSocket);
                } catch (err) {
                    console.error(err);
                }
            });

            proxySocket.on('error', function (e) {
                console.error('on tcp proxy error');
            });
        } catch (err) {
            console.error(err);
        }
    });

    tcpSocket.on('error', function () {
        console.error('on tcp error');
    });
}

//tcp连接负责监听basePort，在onTcpConnection中转发给httpPort或httpsPort
net.createServer({
    allowHalfOpen: true
}, onTcpConnection).listen(basePort);

http.createServer(app).listen(httpPort, function () {
    console.log(`listening http connection on port ${httpPort}`);
});

const options = {
    key: fs.readFileSync('./cakey.pem'),//私钥
    cert: fs.readFileSync('./cacert.pem')//公钥
};

https.createServer(options, app).listen(httpsPort, function () {
    console.log(`listening https connection on port ${httpsPort}`);
});