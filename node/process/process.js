/*
process.argv[0]是node.exe的文件位置，process.argv[1]是被执行文件的位置
[ 'C:\\Program Files\\nodejs\\node.exe',
  'E:\\GitHub\\iSpring.github.io\\node\\process\\child_process' ]

node process 100 --port 3000
[ 'C:\\Program Files\\nodejs\\node.exe',
  'E:\\GitHub\\iSpring.github.io\\node\\process\\process',
  '100',
  '--port',
  '3000' ]
*/
console.log(process.argv);

console.log(process.pid);

// console.log(process.title);

console.log(process.uptime());

//程序运行所在的目录
console.log(process.cwd());

/*
返回Node.js进程内存的使用情况，以字节为单位
heapTotal和heapUsed表示的是v8内存，external表示的是C++分配的内存，比如Buffer
The process.memoryUsage() method returns an object describing the memory usage of the Node.js process measured in bytes.
heapTotal and heapUsed refer to V8's memory usage. external refers to the memory usage of C++ objects bound to JavaScript objects managed by V8.
{ rss: 19079168,
  heapTotal: 7376896,
  heapUsed: 3306256,
  external: 1073750204 }
*/
//Buffer是通过C++分配的，不是v8，所以Buffer占用的是external内存
Buffer.alloc(1024 * 1024 * 1024);

console.log(process.memoryUsage());

/*
{
    key1: value1,
    key2: value2,
    ...
}
*/
// console.log(process.env);

//等价于process.argv[0]
console.log(process.execPath);


const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, p) => {
  unhandledRejections.set(p, reason);
});
process.on('rejectionHandled', (p) => {
  unhandledRejections.delete(p);
});

process.on('uncaughtException', (err) => {
  fs.writeSync(1, `Caught exception: ${err}\n`);
});

const http = require('http');
http.createServer(function(req, res){
    res.write(200);
    res.end('ok');
}).listen(3000);


//监听自身进程的exit事件，cluser.on('exit', cb)可以监听子进程的exit事件
process.on('exit', function(exitCode){
    console.log('exit ' + exitCode);
});

//SIGKILL和SIGSTOP不能监听，会直接退出。

//SIGTERM是kill命令发出的信号，Windows平台不支持SIGTERM，Windows平台会直接退出
// process.on('SIGTERM', function(){
//     console.log('SIGTERM');
// });

//在Windows下用Windows命令行执行node process，
//然后通过单击关闭按钮关闭该命令行
//会触发SIGHUP信号，输出SIGHUP，然后过几秒会自动关闭
process.on('SIGHUP', function(){
    console.log('SIGHUP');
});

//在Windows下用Windows命令行执行node process，
//然后在命令行中执行Ctrl + C
//会触发SIGINT信号，输出SIGINT，但是程序依然运行
process.on('SIGINT', function(){
    console.log('SIGINT');
});

/*
process.kill()方法用于kill掉指定的pid，可以指定可选的signal，默认为SIGTERM。
process.kill(pid[, signal])#
Added in: v0.0.6
pid <number> A process ID
signal <string> | <number> The signal to send, either as a string or number. Defaults to 'SIGTERM'.
The process.kill() method sends the signal to the process identified by pid.
*/

setTimeout(function(){
    //0表示成功退出，1表示失败
    // process.exit(1);
    //SIGTERM是默认的signal
    process.kill(process.pid, 'SIGTERM');
}, 1000);

/*
http://blog.csdn.net/yikai2009/article/details/8643818
信号  ( signal ) 机制是 UNIX 系统中最为古老的进程间通信机制，很多条件可以产生一个信号.

信号的产生：
          1，当用户按下某些按键时，产生信号.
          2，硬件异常产生信号：除数为 0 ，无效的存储访问等等.这些情况通常由硬件检测到，将其通知内核，
                然后内核产生适当的信号通知进程，例如，内核对正访问一个无效存储区的进程产生一个 SIGSEGV 信号.
          3，进程用 kill 函数 将信号发送给另一个进程.
          4，用户可用 kill 命令将信号发送给其他进程.

信号类型 - SIGHUP SIGINT  SIGKILL  SIGTERM  SIGCHLD  SIGSTOP：
          下面是几种常见的信号：
          SIGHUP ：从终端上发出的结束信号.
          SIGINT   ：来自键盘的中断信号 ( ctrl + c ) .
          SIGKILL ：该信号结束接收信号的进程 .
          SIGTERM：kill 命令发出 的信号.
          SIGCHLD：标识子进程停止或结束的信号.
          SIGSTOP：来自键盘 ( ctrl + z ) 或调试程序的停止执行信号.
信号处理：
          当某信号出现时，将按照下列三种方式中的一种进行处理.
          1，忽略此信号：
                    大多数信号都按照这种方式进行处理，但有两种信号却决不能被忽略.
                    它们是：SIGKILL 和 SIGSTOP . 这两种信号不能被忽略的原因是：它们向
                    超级用户提供了一种终止或停止进程的方法.
          2，执行用户希望的动作：
                    通知内核在某种信号发生时，调用一个用户函数，在用户函数中，执行用户希望的处理.
          3，执行系统默认动作：
                    对大多数信号的系统默认动作是终止该进程.

当系统捕捉到某个信号时，可以忽略该信号或是使用指定的处理函数来处理该信号，或者使用系统默认的方式.
信号处理的主要方法有两种，一种是使用简单的 signal 函数，另一个是使用信号集函数.


https://nodejs.org/api/process.html#process_signal_events
Node.js中关于信号的说明：
//SIGHUP是通过关闭命令行窗口导致的，在Windows平台上会在10秒后强制结束Node.js进程，
//非Windows平台默认行为是结束Node.js进程，但是如果绑定了SIGHUP的listener，
//那么不会执行默认行为。
SIGHUP is generated on Windows when the console window is closed, 
and on other platforms under various similar conditions, see signal(7). 
It can have a listener installed, 
however Node.js will be unconditionally terminated by Windows about 10 seconds later. 
On non-Windows platforms, the default behavior of SIGHUP is to terminate Node.js, 
but once a listener has been installed its default behavior will be removed.

//SIGINT是通过在命令行中执行Ctrl + C导致的
SIGINT from the terminal is supported on all platforms, 
and can usually be generated with CTRL+C (though this may be configurable). 
It is not generated when terminal raw mode is enabled.

//SIGTERM是kill命令发出的信号，Windows平台不支持SIGTERM
SIGTERM is not supported on Windows, it can be listened on.
SIGTERM and SIGINT have default handlers on non-Windows platforms that resets the terminal mode before exiting with code 128 + signal number. 
If one of these signals has a listener installed, its default behavior will be removed (Node.js will no longer exit).

//SIGKILL和SIGSTOP不能监听，会直接退出。
SIGKILL cannot have a listener installed, it will unconditionally terminate Node.js on all platforms.
SIGSTOP cannot have a listener installed.
*/
