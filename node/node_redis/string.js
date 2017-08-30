/**
 * http://redis.js.org/
 * https://www.npmjs.com/package/redis
 * https://github.com/NodeRedis/node_redis
 * http://www.cnblogs.com/zhangchao-letv/p/6114030.html
 * 通过set和get方法可以设置string类型的值
 */

 const redis = require('redis');
 const client = redis.createClient(6379, 'localhost');
 client.auth('xxx');//设置密码

//-------------------------------------------------------------
 
 client.on("error", function (err) {
    console.log("Error " + err);
 });

 client.set('name', 'zhangsan');
 //redis需要通过回调获取值
 client.get('name', function(err, value){
     if(err){
         console.error(err);
     }else{
         console.log('name is ' + value);
     }
 });


 //redis中的set只能存储string类型的value，会默认调用toString()存储对象，
 //所以如果要存储对象，我们应该自己调用JSON.stringif()和JSON.parse()方法。
 //还有一点需要说明，如果value是一个number，那么存进去的时候会变成number.toString()，存成了string，获取得到的也是string。
 const person = {
     age: 28,
     salary: 30000
 };
 client.set('person', JSON.stringify(person));
 client.get('person', function(err, personStr){
     if(err){
         console.error(err);
     }else{
         let person = JSON.parse(personStr);
         console.log(person.age, person.salary);
     }
 });

 //https://redis.io/commands/expire
 //通用:设置key在10秒后过期
 client.expire('name', 10);
// client.set('name', 'sunqun', 'EX', 10);

//https://redis.io/commands/del
//通用:删除某个key
client.del(['name']);