//https://nodejs.org/api/url.html

var url = require('url');

//url：{parse, format, resolve, resolveObject, Url}
console.log(JSON.stringify(Object.keys(url)));

//--------------------------------------------url.parse()-------------------------------------------------------

//https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
var urlObj1 = url.parse('http://www.imooc.com:8080/video/6710.html?name=sunqun&age=28#aaaaaaa');
console.log(urlObj1);
//只有href包含hash，hash本身包含#，search本身包含?，pathname为host之后到?之前的内容，path包含pathname，path是从host之后到#之前的内容
/*{
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'www.imooc.com:8080',
  port: '8080',
  hostname: 'www.imooc.com',
  hash: '#aaaaaaa',
  search: '?name=sunqun&age=28',
  query: 'name=sunqun&age=28',
  pathname: '/video/6710.html',
  path: '/video/6710.html?name=sunqun&age=28',
  href: 'http://www.imooc.com:8080/video/6710.html?name=sunqun&age=28#aaaaaaa' }*/

//传入第二个参数为true，可以将query解析为Object对象，而不是字符串
var urlObj2 = url.parse('http://www.imooc.com:8080/video/6710.html?name=sunqun&age=28#aaaaaaa', true);
console.log(urlObj2);
/*{
protocol: 'http:',
slashes: true,
auth: null,
host: 'www.imooc.com:8080',
port: '8080',
hostname: 'www.imooc.com',
hash: '#aaaaaaa',
search: '?name=sunqun&age=28',
query: { name: 'sunqun', age: '28' },
pathname: '/video/6710.html',
path: '/video/6710.html?name=sunqun&age=28',
href: 'http://www.imooc.com:8080/video/6710.html?name=sunqun&age=28#aaaaaaa' }*/

//-------------------------------------------url.format()-------------------------------------------------------
/*
url.format(): object => url
*/

console.log(url.format(urlObj1));// 'http://www.imooc.com:8080/video/6710.html?name=sunqun&age=28#aaaaaaa'

//-------------------------------------------url.resolve()-------------------------------------------------------
/*
url.resolve(from, to)
https://nodejs.org/api/url.html#url_url_resolve_from_to
from <string> The Base URL being resolved against.
to <string> The HREF URL being resolved.
The url.resolve() method resolves a target URL relative to a base URL in a manner similar to that of a Web browser resolving an anchor tag HREF.
*/
console.log(url.resolve('/one/two/three', 'four')); // '/one/two/four'
console.log(url.resolve('http://example.com/', '/one')); // 'http://example.com/one'
console.log(url.resolve('http://example.com/one', '/two')); // 'http://example.com/two'