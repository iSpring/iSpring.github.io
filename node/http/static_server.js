/**
 * 用Node.js创建静态服务器
 * http://www.infoq.com/cn/news/2011/11/tyq-nodejs-static-file-server
 * https://github.com/JacksonTian/ping/blob/master/app.js
 */

//创建静态服务器，只允许读取asserts目录下的文件
var mime = require("./mime").types; //文件后缀名的MIME类型配置
var config = require("./config"); //缓存配置
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = "assets" + pathname;
    //通过path.exists()判断路径是否存在
    fs.stat(realPath, function (err, stats) {
        if (err) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            if (stats.isFile()) {
                //我们通过path.extname()来获取文件的后缀名。
                //由于extname返回值包含”.”，所以通过slice方法来剔除掉”.”，
                //对于没有后缀名的文件，我们一律认为是unknown。
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                var contentType = mime[ext] || "text/plain";
                response.writeHead(200, {
                    'Content-Type': contentType
                });

                //设置Last-Modified
                var lastModified = stats.mtime.toUTCString();//转换为UTC字符串
                response.setHeader("Last-Modified", lastModified);                

                //设置Expires和Cache-Control这两个和缓存相关的响应头
                //Cache-Control的优先级高于Expires，但有的浏览器不支持Cache-Control，这时采用Expires
                if (ext.match(config.Expires.fileMatch)) {
                    var expires = new Date();
                    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                    response.setHeader("Expires", expires.toUTCString());
                    response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                }

                var ifModifiedSince = "If-Modified-Since".toLowerCase();
                if (request.headers[ifModifiedSince] && lastModified === request.headers[ifModifiedSince]) {
                    //如果请求头中有if-modified-since，那么会进行判断if-modified-since是否与当前的lastModified相等
                    //如果相等就返回304表示未变化
                    response.writeHead(304, "Not Modified");
                    response.end();
                }else{
                    //发送实际的数据
                    response.setHeader('Content-Length', stats.size);
                    var stream = fs.createReadStream(realPath);
                    stream.pipe(response);
                    response.end();
                }
            } else {
                //不允许用户访问目录
                response.writeHead(403);
                response.end();
            }
        }
    });
});