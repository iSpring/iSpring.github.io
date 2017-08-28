/*
https://redis.io/
http://www.jikexueyuan.com/course/2301_2.html?ss=2
It supports data structures such as strings, hashes, lists, sets, 
sorted sets with range queries, bitmaps, hyperloglogs and geospatial indexes with radius queries. 
通过sadd、smembers可以设置集合set类型的值，集合中的元素都是唯一的，不会出现重复的情况
*/

const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
client.auth('xxx');
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
