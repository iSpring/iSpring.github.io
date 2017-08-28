/**
 * http://www.jikexueyuan.com/course/2301_2.html?ss=2
 * 通过lpush、rpush、lrange等方法可以设置list类型的值
 */

const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
client.auth('xxx');
//redis中的list和数组很像，用rpush相当于执行数组的push方法，lpush相当于执行数组的unshift方法
client.rpush('testList', 'a');
client.rpush('testList', 'b');
client.rpush('testList', 'c');
client.rpush('testList', 1);//数字1也会被存储成字符串'1'
client.lpush('testList', 2);//从左侧插入元素

//lpop相当于执行数组的shift，将最左侧元素删除，并通过回调函数返回
// client.lpop('testList', function(err, v){
// });

//rpop相当于执行数组的pop，将最右侧的元素删除，并通过回调函数返回
// client.rpop('testList', function(err, v){
// });

//lrang表示从左向右读取list的值，0表示从0开始读取，-1表示读到最右侧一个
client.lrange('testList', 0, -1, function(err, list){
    if(err){
        console.error(err);
    }else{
        console.log(list);
    }
});