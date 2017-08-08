/*
https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/io.md
readline 模块提供了一个用于从 Readble 的 stream (例如 process.stdin) 中一次读取一行的接口. 
当然你也可以用来读取文件或者 net, http 的 stream
实现上, realine 在读取 TTY 的数据时, 是通过 input.on('keypress', onkeypress) 时发现用户按下了回车键来判断是新的 line 的, 
而读取一般的 stream 时, 则是通过缓存数据然后用正则 .test 来判断是否为 new line 的.
*/

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, 'test/1.txt'))
});

rl.on('line', function(line){
    console.log(line);
});