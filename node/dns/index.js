const dns = require('dns');

const hostname = 'www.qq.com';

/*
dns模块中有两类查找模式:
1. dns.lookup()方法会首先从系统的DNS缓存中(/etc/hosts)中查找，进行本机dns查找，如果查找到了就无需发送网络请求查询。
如果手动修改hosts文件，那么会影响dns.lookup()的结果。经测试发现，如果本机dns缓存中没有，那么还是会发请求得到结果。
2. 其他的dns方法都需要发送请求进行查询，绕过本机dns查找。
*/

//将域名（比如 'runoob.com'）解析为第一条找到的记录 A （IPV4）或 AAAA(IPV6)。
//参数 options可以是一个对象或整数。如果没有提供 options，IP v4 和 v6 地址都可以。如果 options 是整数，则必须是 4 或 6。
//options也可以是对象{all: true}
dns.lookup(hostname, function(err, address, family){
    if(err){
        console.error(err);
    }else{
        //dns.lookup 125.39.240.113 4
        console.log(`dns.lookup ${address} ${family}`);
    }
});

//和 dns.resolve() 类似, 仅能查询 IPv4 (A 记录）。 addresses IPv4 地址数组 (比如，['74.125.79.104', '74.125.79.105', '74.125.79.106']）。
dns.resolve4(hostname, function(err, addresses){
    if(err){
        console.error(err);
    }else{
        //dns.resolve4 ["61.135.157.156","125.39.240.113"]
        console.log(`dns.resolve4 ${JSON.stringify(addresses)}`);
    }
});

//和 dns.resolve4() 类似， 仅能查询 IPv6( AAAA 查询）,对于某些host查找的IP6的地址可能是空数组，比如www.baidu.com
dns.resolve6(hostname, function(err, addresses){
    if(err){
        console.error(err);
    }else{
        //dns.resolve6 ["240e:e1:8100:28::2:16"]
        console.log(`dns.resolve6 ${JSON.stringify(addresses)}`);
    }
});

// dns.resolveCname(hostname, function(err, addresses){
//     if(err){
//         console.error(err);
//     }else{
//         console.log(`dns.resolveCname ${JSON.stringify(addresses)}`);
//     }
// });

// //根据IP地址得到对应的hostnames
// dns.reverse('61.135.157.156', function(err, hostnames){
//     if(err){
//         console.error(err);
//     }else{
//         console.log(`dns.reverse ${JSON.stringify(hostnames)}`);
//     }
// });