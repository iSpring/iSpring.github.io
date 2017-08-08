//https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/io.md

/*
stdio (standard input output) 标准的输入输出流, 即输入流 (stdin), 输出流 (stdout), 错误流 (stderr) 三者. 
在 Node.js 中分别对应 process.stdin (Readable), process.stdout (Writable) 以及 process.stderr (Writable) 三个 stream.
*/

//如何同步的获取用户的输入?

/*
 * http://stackoverflow.com/questions/3430939/node-js-readsync-from-stdin
 * @mklement0
 */
var fs = require('fs');

var BUFSIZE = 256;
var buf = new Buffer(BUFSIZE);
var bytesRead;

var fd = ('win32' === process.platform) ? process.stdin.fd : fs.openSync('/dev/stdin', 'rs');//rs这个tag表示同步读取
bytesRead = 0;

try {
    bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
} catch (e) {
    if (e.code === 'EAGAIN') { // 'resource temporarily unavailable'
        // Happens on OS X 10.8.3 (not Windows 7!), if there's no
        // stdin input - typically when invoking a script without any
        // input (for interactive stdin input).
        // If you were to just continue, you'd create a tight loop.
        console.error('ERROR: interactive stdin input not supported.');
        process.exit(1);
    } else if (e.code === 'EOF') {
        // Happens on Windows 7, but not OS X 10.8.3:
        // simply signals the end of *piped* stdin input.
        return '';
    }
    throw e; // unexpected exception
}

if (bytesRead === 0) {
    // No more stdin input available.
    // OS X 10.8.3: regardless of input method, this is how the end 
    //   of input is signaled.
    // Windows 7: this is how the end of input is signaled for
    //   *interactive* stdin input.
    return '';
}
// Process the chunk read.

var content = buf.toString('utf8', 0, bytesRead);

console.log(content);