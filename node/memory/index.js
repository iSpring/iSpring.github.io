/**
 * Linux系统
 * node install heapdum
 * node --expose_gc index.js
 */
const {EventEmitter} = require('events');
const heapdump = require('heapdump');

global.test = new EventEmitter();
global.test.setMaxListeners(200);
heapdump.writeSnapshot('./before.heapsnapshot');

function run3() {
  const innerData = new Buffer(100);
  const outClosure3 = function () {
      console.log(innerData);
  };
  test.on('error', () => {
      //run3这个函数内部有两个匿名函数：outClosure3和test的error回调函数
      //这两个函数会共享作用域
      //内名函数outClosure3引用了innerData，会导致test的error回调函数也间接引用innerData
      //也就是说，虽然test的error回调函数没有直接引用innerData，但是间接引用了innerData
      //由于test是全局的，所以运行100次run3之后，会导致test内部持有100个error回调，
      //每个error回调方法都间接持有了innerData对象，即导致持有100个innerData无法被GC
    console.log('error');
  });
}

for(let i = 0; i < 100; i++) {
  run3();
}
gc();

heapdump.writeSnapshot('./after.heapsnapshot');