const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
client.auth('xxx');
// client.info(function(serverInfo){
//     console.log(serverInfo);
// });

client.INFO(function(serverInfo){
    console.log(serverInfo);
});