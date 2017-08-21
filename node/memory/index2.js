/**
 * npm install memwatch
 * 可以使用memwatch模块监控内存泄漏的leak事件，
 * memwatch认为连续5次GC内存都在升高就会认为内存泄漏
 * https://www.w3ctech.com/topic/842
 */
var memwatch = require('memwatch');

//监听leak事件
memwatch.on('leak', function (info) {
    console.error('Memory leak detected: ', info);
});

//在两次leak事件之间进行diff，查找变化的内容，只能大体知道是什么类型的内存变化了多少
// var hd;
// memwatch.on('leak', function(info) {
//  console.error(info);
//  if (!hd) {
//    hd = new memwatch.HeapDiff();
//  } else {
//    var diff = hd.end();
//    console.error(util.inspect(diff, true, null));
//    hd = null;
//  }
// });

//要想精确查找leak的原因，可以在leak的时候，用heapdum.writeSnapshot()生成内存快照
//然后在Chrome Dev Tools中进行比较
// memwatch.on('leak', function (info) {
//     console.error(info);
//     var file = '/tmp/myapp-' + process.pid + '-' + Date.now() + '.heapsnapshot';
//     heapdump.writeSnapshot(file, function (err) {
//         if (err) console.error(err);
//         else console.error('Wrote snapshot: ' + file);
//     });
// });