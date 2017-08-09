const cluster = require('cluster');
const http = require('http');
const os = require('os');

if(cluster.isMaster){
    //在master中根据cpu的数量进行fork
    const cpuCount = os.cpus().length;
    for(var i = 0; i < cpuCount; i++){
        cluster.fork();
    }
    //cluser监听的exit是监听子进程的退出事件
    //process.on('exit', cb)是监听自身进程的退出事件
    cluster.on('exit', function(worker, code, signal){
        console.log(`worker ${worker.process.pid} exit`);
    });
}else{
    //cluster.isWorker => true
    http.createServer(function(req, res){
        res.writeHead(200);
        res.end("Hello World");
    }).listen(3000);
}