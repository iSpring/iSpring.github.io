/**
 * https://github.com/luin/ioredis#cluster
 * https://github.com/luin/ioredis#read-write-splitting
 * ioredis支持cluster，并且支持读写分离
一个典型的redis集群包括三个或更多的master，并且每个master有多个slave。
可以通过设置scaleReads这个参数为"salve"可以实现读写分离:从slave读取数据，向master写入数据。
scaleReads的有以下可选值：
1. "master"，这是默认值，这意味着默认所有读写都从master进行，不会与salve进行交互。
2. "salve"，我们在实际环境中一般使用该值，表示从slave读取数据，向master写入数据，实现读写完全分离。
3. "all"，表示向master写入数据，但是读取数据的时候是随机的，有可能从master读取，有可能有slave读取。
4. function(nodes, command)，也可以是自定义函数实现其他逻辑。

通过以上我们可以发现，写入一定是写入到master的，实际环境中应该将scaleReads设置为"slave"，实现读写分离，减轻master的压力。
 */

var Redis = require('ioredis');

var cluster = new Redis.Cluster([{
  port: 6380,
  host: '127.0.0.1'
}, {
  port: 6381,
  host: '127.0.0.1'
}], {
    scaleReads: 'slave'//实现读写分离
});

cluster.set('foo', 'bar');//向master写入
cluster.get('foo', function (err, res) {
  // 从slave读取
});