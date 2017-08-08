const os = require('os');

console.log(`系统内存总量: ${os.totalmem()} (字节)`);
console.log(`系统内存空闲: ${os.freemem()} (字节)`);
console.log(`CPU数量: ${os.cpus().length}`);
console.log(`操作系统: ${os.type()}`);//Windows_NT
console.log(`系统平台: ${os.platform()}`);//win32
console.log(`操作系统发行版: ${os.release()}`);
console.log(`CPU字节序: ${os.endianness()}`);//可能的是 "BE" 或 "LE"
console.log(`操作系统架构: ${os.arch()}`);//可能的值有 "x64"、"arm" 和 "ia32"