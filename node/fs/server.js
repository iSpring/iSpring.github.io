const path = require('path');
const fs = require('fs');
const testDirPath = path.join(__dirname, 'test');

/*
获取文件或文件夹信息: fs.stat(path,[callback(err,stats)]); stats.isFile()、stats.isDirectory()
判断路径是否存在: fs.exists(path, callback)官方建议使用fs.stat()和fs.access()替代
创建文件夹: fs.mkdir(path[,mode],callback); mode - 设置目录权限，默认为 0777
读取文件夹下的子目录和子文件fileNames: fs.readdirSync(path)
删除文件夹: fs.rmdir(path,callback); 只能删除空文件夹，如果要删除文件夹下面的内容需要自己实现
删除文件: fs.unlink(path,callback);
重命名: fs.rename(oldPath, newPath, callback)
读取整个文件内容: fs.readFile(path[, options], callback),如果通过options指定encoding，那么得到string，否则得到buffer
覆盖写入文件内容: fs.writeFile(file, data[, options], callback)
追加写入文件内容: fs.appendFile(file, data[, options], callback)
打开文件获取数字类型的文件描述符: fs.open(path, flags[, mode], callback)
关闭文件描述符: fs.close(fd, callback)
根据文件描述符写入数据: fs.write(fd, buffer[, offset[, length[, position]]], callback)
根据文件描述符写入数据: fs.write(fd, string[, position[, encoding]], callback)
根据文件描述符读取数据: fs.read(fd, buffer, offset, length, position, callback)
buffer is the buffer that the data will be written to.
offset is the offset in the buffer to start writing at.
length is an integer specifying the number of bytes to read.
position is an integer specifying where to begin reading from in the file. 
If position is null, data will be read from the current file position.


Using fs.stat() to check for the existence of a file 
before calling fs.open(), fs.readFile() or fs.writeFile() is not recommended. 
Instead, user code should open/read/write the file directly 
and handle the error raised if the file is not available.
To check if a file exists without manipulating it afterwards, 
fs.access() is recommended.

fs.open(path,flags[,mode],[callback(err,data)]);
flag控制打开文件的行为：
r读取模式
w写入模式
r+和w+都表示读取写入模式
rs同步读取
rs+同步读取写入
*/


/*
删除目录及目录下的子文件和子目录
fs.rmdir()方法只能删除空目录
http://www.cnblogs.com/satisfysmy/p/6869815.html
*/
function rmDirAndSubs(testDirPath){
    var fileNames = fs.readdirSync(testDirPath);
    fileNames.forEach(function(fileName){
        var filePath = path.join(testDirPath, fileName);
        //获取是文件还是文件夹之类的信息
        var stats = fs.statSync(filePath);
        //stats.atime最后访问的时间
        //stats.mtime最后修改的时间
        //stats.ctime
        //stats.birthtime创建时间
        if(stats.isDirectory()){
            //删除文件夹
            // fs.rmdirSync(testDirPath);
            rmDirAndSubs(filePath);
        }else if(stats.isFile()){
            //删除文件
            fs.unlinkSync(filePath);
        }
    });
    //在删除了子文件夹和子文件之后，删除文件夹自身
    fs.rmdirSync(testDirPath);
}

//判断路径是否存在
if(fs.existsSync(testDirPath)){
    //获取是文件还是文件夹之类的信息
    const stat = fs.statSync(testDirPath);
    if(stat.isDirectory()){
        //删除文件夹
        rmDirAndSubs(testDirPath);
    }else if(stat.isFile()){
        //删除文件
        fs.unlinkSync(testDirPath);
    }
}

//创建目录
fs.mkdirSync(testDirPath);

//向新文件中写入内容
const testFilePath1 = path.join(testDirPath, '1.txt');
fs.writeFileSync(testFilePath1, '第一行文本', {
    encoding: 'utf8',//默认
    mode: 0o666,//默认
    flag: 'w'//默认
});//写入
fs.appendFileSync(testFilePath1, '\r\n第二行文本');//追加写入

//读取内容
var fileContent = fs.readFileSync(testFilePath1, {
    encoding: 'utf8',
    flag: 'r'//默认
});
console.log(fileContent);

//第二种读取内容的方式
//flag: r只读，r+可读可写，rs+同步读写，w只写
//获取文件描述符，通过文件描述符读取文件内容，与fs.readSync()相对的有fs.writeSync()
var fd = fs.openSync(testFilePath1, 'r');
var BUFSIZE = 1024;
var buf = Buffer.alloc(BUFSIZE);
var bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
fileContent = buf.toString('utf8', 0, bytesRead);
console.log(fileContent);


//文件拷贝
const testFilePath2 = path.join(testDirPath, '2.txt');
fs.createReadStream(testFilePath1).pipe(fs.createWriteStream(testFilePath2));

//创建快捷方式
const testFilePath3 = path.join(testDirPath, '3.txt');
fs.linkSync(testFilePath2, testFilePath3);