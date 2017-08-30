/*
https://redis.io/
http://www.jikexueyuan.com/course/2301_2.html?ss=2
It supports data structures such as strings, hashes, lists, sets, 
sorted sets with range queries, bitmaps, hyperloglogs and geospatial indexes with radius queries. 
通过sadd、smembers可以设置集合set类型的值，集合中的元素都是唯一的，不会出现重复的情况
*/

//ioredis连接redis服务器
const Redis = require('ioredis');
const client = new Redis({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'xxx',
    db: 0
});

// node_redis连接redis服务器
// const redis = require('redis');
// const client = redis.createClient(6379, 'localhost');
// client.auth('xxx');//设置密码

//----------------------------以下ioredis和node_redis都兼容-------------------------------------

client.sadd('testSet', 1);
client.sadd('testSet', 'a');
client.sadd('testSet', 'a');
client.sadd('testSet', 'b');

client.smembers('testSet', function(err, v){
    if(err){
        console.error(err);
    }else{
        //输出 ['1', 'b', 'a']，自动去掉了多余的'a'
        console.log('testSet:', v);
    }
});

//以下代码只在ioredis下验证过
client.sadd('testSet2', 1, 1, 3, 'a', 'a', 'b');//与下面代码等价
client.sadd('testSet3', [1, 1, 3, 'a', 'a', 'b']);//与上面代码等价
client.sadd('testSet4', [1, 2, 3]);
client.del('testSet4');
