const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
client.auth('xxx');
//https://redis.io/commands/flushdb
client.flushdb();//删除当前数据库中的所有key
//https://redis.io/commands/flushall
// client.flushall();//删除所有数据库中的所有key