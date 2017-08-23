/*
https://redis.io/
http://www.jikexueyuan.com/course/2301_2.html?ss=2
http://www.runoob.com/redis/redis-pub-sub.html
It supports data structures such as strings, hashes, lists, sets, 
sorted sets with range queries, bitmaps, hyperloglogs and geospatial indexes with radius queries. 
可以通过redis的消息订阅发布机制实现进程间的通信
通过client.subscribe/publish实现消息的订阅与发布，通过client.on监听message事件，获取消息内容
1. 通过node sub.js &先启动进程sub.js
2. 然后通过node pub.js &启动另一个进程pub.js
*/

const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
client.auth('xxx');

client.publish('testPublish', 'message from testPublish');