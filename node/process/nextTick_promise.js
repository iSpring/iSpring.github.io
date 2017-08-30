/*
macro-task: script (整体代码)，setTimeout, setInterval, setImmediate, I/O, UI rendering.
micro-task: process.nextTick, Promise.then(原生)，Object.observe，MutationObserver
除了script整体代码，micro-task的任务优先级高于macro-task的任务优先级。
其中，script(整体代码) ，可以理解为待执行的所有代码。
new Promise(funcA).then(cb, errcb)中funcA是同步执行的
process.nextTick 高于 Promise.then
setTimeout的优先级高于setIImmediate

优先级： process.nextTick > Promise.then > setTimeout(0) > setImmediate

setTimeout的创建要涉及到创建红黑树等性能消耗，所以如果是想创建异步操作的话毋庸置疑是使用setImmediate

process.nextTick 并不属于 Event loop 中的某一个阶段, 
而是在 Event loop 的每一个阶段结束后, 直接执行 nextTickQueue 中插入的 "Tick",
并且直到整个 Queue 处理完. 所以面试时又有可以问的问题了, 递归调用 process.nextTick 会怎么样?
*/

setImmediate(function(){
    console.log(1);
}, 0);

setTimeout(function(){
    console.log(2);
}, 0);

new Promise(function(resolve){
    console.log(3);
    resolve();
    console.log(4);
}).then(function(){
    console.log(5);
});

console.log(6);

process.nextTick(function(){
    console.log(7);
});

console.log(8);

//输出: 3 4 6 8 7 5 2 1


function funcA(){
    process.nextTick(function(){
        funcA();
    });
}
// funcA();
//process.nextTick()会导致在 Event loop 的每一个阶段结束后,
//直接执行 nextTickQueue 中插入的 "Tick", 并且直到整个 Queue 处理完. 
//所以，如果执行了funcA()，那么当前的nextTickQueue会不断插入新的Tick，
//永远也执行不完，导致后续任务挂起无法执行
//执行funcA()后会输出: 3 4 6 8 7
//5不输出是因为Promise.then()的优先级低于process.nextTick
//2和1不输出是因为2和1都是macroTask，优先级更低