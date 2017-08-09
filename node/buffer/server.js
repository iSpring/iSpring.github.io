var buf1 = Buffer.from('Buffer是个好东西');
var buf2 = Buffer.from('Node.js是个好东西');
//将buf1和buf2合并成一个buffer
var buf3 = Buffer.concat([buf1, buf2]);
console.log(buf3.toString('utf8'));//buf.toString([encoding[, start[, end]]])

//两个汉字的长度是6
console.log(Buffer.byteLength('汉字'));

console.log(Buffer.poolSize);//8192 Byte

//"A".charCodeAt(0) => 65
//String.fromCharCode(65) => "A"

//分配128字节的Buffer
var buf4 = Buffer.alloc(128);
for(var i = 0; i < 128; i++){
    buf4[i] = i;
}
console.log(buf4.toString('utf8'));//输出ASCII码

var start = "A".charCodeAt(0);//65
var end = "Z".charCodeAt(0);//90
//buf.slice([start[, end]])
//将buf从索引start到end-1中的内容构建新的buffer，新旧buffer公用内存，更改其中一个buffer中的内容会导致另个一buffer中对应的数据也更新。
var buf5 = buf4.slice(start, end + 1);
console.log(buf5.toString('utf8'));//A-Z


//buf.indexOf(value[, byteOffset][, encoding])
//查找value在buf中第一次出现时的索引。
console.log(buf4.indexOf(65));//65
console.log(buf4.indexOf('A', 'utf8'));//65
console.log(buf4.indexOf('AB', 'utf8'));//65
console.log(buf4.indexOf('ABA', 'utf8'));//-1

/*
buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
将buf中的内容(根据sourceStart和sourceEnd)拷贝到target中（根据targetStart决定起始位置）
buf1.copy(buf2, 8, 16, 20)的含义是：
1. 将buf1中的内容拷贝到buf2中
2. 将buf1中索引[16, 20]之间的数据拷贝到buf1中
3. 将buf1中的数据从buf2的索引8位置开始拷贝进去
4. 拷贝完成的时候，buf2[8]===buf1[16]
*/
/*
Buffer.allocUnsafe(size)和Buffer.allocUnsafeSlow(size): 分配大小为size的内存，但是内部的数据是old data，
没有被清理为默认值，需要手动执行buffer.fill()方法设置默认值。unsafe的alloc方法比单纯的alloc方法要快。
*/
var buf6 = Buffer.allocUnsafe(128);
buf6.fill('a');
buf4.copy(buf6, 10, start, end + 1);
console.log(buf6.toString());

/*
通过Buffer.isEncoding(encoding)判断Node是否原生支持该编码类型，在中国常用的GBK、GBK2312和BIG-5编码Node都不支持。
可以使用iconv-lite等第三方库实现对GBK等编码格式的支持。
var iconv = require('iconv-lite');
//buffer转字符串
var str = iconv.decode(buf, 'win1251');
//字符串转buffer
var buf = iconv.encode("Sample input string", 'win1251')
*/
console.log(Buffer.isEncoding('utf8'));
console.log(Buffer.isEncoding('utf-8'));
console.log(Buffer.isEncoding('GBK'));

/*
字符串解码器 (String Decoder) 是一个用于将 Buffer 拿来 decode 到 string 的模块, 
是作为 Buffer.toString 的一个补充, 它支持多字节 UTF-8 和 UTF-16 字符. 例如
*/
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
console.log(decoder.write(Buffer.from([0xC2, 0xA2])));//¢
console.log(decoder.write(Buffer.from([0xE2, 0x82, 0xAC])));//€

/*
buf.write(string[, offset[, length]][, encoding])
向buf中写入字符串，返回写入的字节数量
Added in: v0.1.90
  ● string <string> String to be written to buf
  ● offset <integer> Where to start writing string. Default: 0
  ● length <integer> How many bytes to write. Default: buf.length - offset
  ● encoding <string> The character encoding of string. Default: 'utf8'
  ● Returns: <integer> Number of bytes written
*/
const buf7 = Buffer.allocUnsafe(256);
const len = buf7.write('\u00bd + \u00bc = \u00be', 0);
// Prints: 12 bytes: ½ + ¼ = ¾
console.log(`${len} bytes: ${buf7.toString('utf8', 0, len)}`);