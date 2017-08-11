process.on('unhandledRejection', function(e){
    console.error('unhandledRejection:' + e);
});



//promise.then(cb, errcb)当cb中中本身执行出现错误时，errcb不会触发，会抛出异常
Promise.resolve(1).then((v) => {
    console.log(v.a.b);
}, (e) => {
    //不会执行
    console.error('test1: ' + e);
});



//更好的处理是promise.then(cb).catch(errcb)，这样cb出现错误或promise时，errcb都会执行
Promise.resolve(1).then((v) => {
    console.log(v.a.b);
}).catch((e) => {
    //会执行
    console.error('test2: ' + e);
});



//错误被catch到之后，catch方法的返回值会传递到下一个then，不会影响后续执行
//只是下一个then接收到的值是catch返回的值，要考虑这种情况
Promise.resolve(1).then((v) => {
    console.log(v.a.b);
}).catch((e) => {
    //会执行
    console.error('test3: ' + e);
    return '我catch到了异常，没事，你就当啥事也没发生';
}).then((v) => {
    //输出test4: 我catch到了异常，没事，你就当啥事也没发生
    console.log('test4: ' + v);
});


//p.then(cb, errcb).then(cb2)
//如果preject了进入了errcb，那么还会执行cb2，这种情况下cb2的输入就是errcb的返回值
Promise.reject(1).then((v) => {
    console.log(v);
}, (e) => {
    console.error('test5: ' + e);
    return 'reject了';
}).then((v) => {
    //test6: reject了
    console.log('test6: ' + v);
});



//可以用Promise一直then下去，直到最后加一个catch就可以了，这样最后一个catch会拦截到错误
Promise.resolve(1).then((v) => {
    return v+1;
}).then((v) => {
    return v + 1;
}).then((v) => {
    return v.a.b;
}).then((v) => {
    return v + 1;
}).catch((e) => {
    //test5: TypeError: Cannot read property 'b' of undefined
    console.error('test7: ' + e);
});