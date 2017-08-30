/**
 * 通过client.multi().method1().method2().methodN().exec(cb)实现事务
 * https://github.com/NodeRedis/node_redis#clientmulticommands
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

client.on("error", function (err) {
   console.log("Error " + err);
});

let set_size = 20;

client.sadd("bigset", "a member");
client.sadd("bigset", "another member");

while (set_size > 0) {
    client.sadd("bigset", "member " + set_size);
    set_size -= 1;
}

// multi chain with an individual callback
client.multi()//multi方法标记一个事务的开始
    .scard("bigset")//获取bigset中key-value键值对的数量，返回22
    .smembers("bigset")//获取bigset的key-value对
    .keys("*", function (err, replies) {
        // NOTE: code in this callback is NOT atomic
        // this only happens after the the .exec call finishes.
        client.mget(replies, function(){

        });
    })
    .dbsize()//返回当前数据库中key的数量
//exec方法用于执行所有事务内的命令
.exec(function (err, replies) {
    console.log(replies);

    // 以下是node_redis语法
    // console.log("MULTI got " + replies.length + " replies");
    // replies.forEach(function (reply, index) {
    //     console.log("Reply " + index + ": " + reply.toString());
    // });
});