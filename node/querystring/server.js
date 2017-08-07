const querystring = require('querystring');

let keyValueObj = querystring.parse("key1=value1&key2=value2"); // => keyValueObj
console.log(keyValueObj);

let v2 = querystring.stringify(keyValueObj, /*optional*/ "&", /*optional*/ "="); // => "key1=value1&key2=value2"
console.log(v2);

//等价于encodeURIComponent
console.log(encodeURIComponent("哈哈"));// => "%E5%93%88%E5%93%88"
let v3 = querystring.escape("哈哈"); // => "%E5%93%88%E5%93%88"
console.log(v3);

//等价于decodeURIComponent
console.log(decodeURIComponent("%E5%93%88%E5%93%88"));// => "哈哈"
let v4 = querystring.unescape("%E5%93%88%E5%93%88"); // => "哈哈"
console.log(v4);