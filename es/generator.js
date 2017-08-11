//http://www.infoq.com/cn/articles/es6-in-depth-generators?utm_source=articles_about_ES6-In-Depth&utm_medium=link&utm_campaign=ES6-In-Depth
//生成器是迭代器。所有的生成器都有内建.next()和[Symbol.iterator]()方法的实现。你只须编写循环部分的行为。
//因为生成器就是迭代器，所以我们可以调用生成器的next()方法
function * range(start, end){
    for(let i = start; i < end; i++){
        yield i;
    }
}

const range1 = range(0, 3);
for(let v of range1){
    /*
    分别输出
    0
    1
    2
    */
    console.log(v);
}

const range2 = range(0, 2);
console.log(range2.next());//=> { done: false, value: 0 }
console.log(range2.next());//=> { done: false, value: 0 }
console.log(range2.next());//=> { done: true, value: undefined }
console.log(range2.next());//=> { done: true, value: undefined }