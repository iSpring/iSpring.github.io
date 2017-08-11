class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    } else {
      return {done: true, value: undefined};
    }
  }
}

// 返回一个新的迭代器，可以从start到stop计数。
function range(start, stop) {
  return new RangeIterator(start, stop);
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
