const http = require('http');
const querystring = require('querystring');

http.createServer(function(req, res){
    //req是http.IncomingMessage对象，有一些属性，方法比较少
    console.log(req.url);
    console.log(req.method);
    console.log(req.httpVersion);
    //req.statusCode和req.statusMessage只对于http.ClientRequest才有效
    //console.log(req.statusCode);
    //console.log(req.statusMessage);
    console.log(querystring.parse(req.url, true).query);
    //req.headers是一个请求头对象，里面的key一般是小写字母
    console.log(req.headers);
    console.log(req.headers['user-agent']);
    // console.log(req.rawHeaders); req.rawHeaders是一个一维数组，比较难用
    //通过req.socket获取socket对象

    /*
    // 定义了一个post变量，用于暂存请求体的信息
    var post = '';     
 
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
 
    // 在req的end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){
        //将post字符串转换成keyValue对象  
        post = querystring.parse(post);
        res.end(util.inspect(post));
    });*/

    //res是http.ServerResponse对象，有一些方法可以使用
    /*
    response.setHeader(name, value): 设置header，如果之前设置过会替代，value是string或string[],
    例如: response.setHeader('Content-Type', 'text/html'); 或 
    response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);


    When headers have been set with response.setHeader(), 
    they will be merged with any headers passed to response.writeHead(),
     with the headers passed to response.writeHead() given precedence.
    如果在调用了response.setHeader()之后又调用了response.writeHead()，那么后者会与前者merge
    // returns content-type = text/plain
    const server = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('X-Foo', 'bar');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok');
    });
    response.writeHead(statusCode[, statusMessage][, headers])
    response.writeHead()是一个大一统的方法设置响应头，该方法中statusCode必须设置。
    如果不调用response.writeHead()，可以给res.statusCode赋值设置状态码，
    给res.statusMessage赋值设置状态消息，用res.setHeader(name, value(s))挨个设置header。


    response.getHeader(name)用于读取之前设置的header
    Reads out a header that's already been queued but not sent to the client. Note that the name is case insensitive.
    const contentType = response.getHeader('content-type');


    response.getHeaderNames()用于返回之前设置的header的names，并且返回的name都是小写
    Returns an array containing the unique names of the current outgoing headers. All header names are lowercase.
    response.setHeader('Foo', 'bar');
    response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);
    const headerNames = response.getHeaderNames();
    // headerNames === ['foo', 'set-cookie']


    response.removeHeader(name)
    用于删除设置的header


    response.headersSent只读属性，用于判断响应头是否发送


    response.write(chunk[, encoding][, callback])
    用于写入内容，chunk为string或buffer


    response.end([data][, encoding][, callback])
    res.end()用于结束请求，将内容发送给客户端，end中可以发送最后的data，也可以不发送
    */

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('ok');
    //可以通过req.socket获取客户端的IP和port
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    res.end(`Your IP address is ${ip} and your source port is ${port}.`);

}).listen(3000);