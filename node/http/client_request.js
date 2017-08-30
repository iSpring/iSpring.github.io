const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');

/*
可以用http.request(options, callback)发送POST请求，也可以发送GET请求，也可以指定headers等
如果请求地址是https，那么就需要使用https.request()，而且要设置options.protocol为https:
*/

//http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0?f=json
const postData = querystring.stringify({
    f: 'pjson'
});

console.log(`http.globalAgent.maxSockets:${http.globalAgent.maxSockets}`);//Infinity

const agent = new http.Agent({
    keepAlive: true,//default false
    keepAliveMsecs: 2000,//default 1000
    maxSockets: 100//default Infinity
});

//options.agent可设置也可以不设置，控制keepAlive等行为
const options = {
    protocol: 'http:',
    host: 'sampleserver6.arcgisonline.com',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    },
    path: '/arcgis/rest/services/SampleWorldCities/MapServer/0',
    agent: agent//http.globalAgent
};

//req是http.ClientRequest对象，是Writable Stream
const req = http.request(options, function(res){
    //res是http.IncommingMessage对象，是Readable Stream    
    
    /*
    //此处不设置编码，data事件中获得buffer对象
    //这种方式会将所有数据放在内存bufs中，然后最后合成一个大的Buffer，并生成string
    // res.setEncoding('utf8');
    let bufs = [];
    res.on('data', function(chunk){
        bufs.push(chunk);
    });
    res.on('end', function(){
        const allBuf = Buffer.concat(bufs);
        const content = allBuf.toString('utf8');
        console.log(content);
        console.log('-------------------------------------------------------');
    });
    */

    //以流的方式进行pipe
    const filePath = path.join(__dirname, '1.json');
    res.pipe(fs.createWriteStream(filePath));
});

req.on('error', function(e){
    console.error(e);
});

//通过req.write()方法写入数据
req.write(postData);

//最后需要调用req.end()方法
req.end();

//------------------------------------------------------------------------------------

//http.get()是对http.request()的简单包装，只能发送get请求，并且不需要手动调用req.end()方法
http.get('http://nodejs.org/dist/index.json', function (res) {
    //res是http.IncommingMessage对象，是Readable Stream
    console.log(res.statusCode);
    console.log(res.headers['content-type']);
    //给输入流指定编码方式，这样在data事件中得到的chunk就是string，而不是buffer
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', function (chunk) {
        rawData += chunk;
    });
    res.on('end', function () {
        try {
            const data = JSON.parse(rawData);
            const versions = data.map((item) => item.version);
            console.log(versions);
        } catch (e) {
            console.error(e);
        }
    });
    res.on('error', function (e) {
        console.error(e);
    });
});