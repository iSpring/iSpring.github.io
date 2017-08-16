//二维数组
const arr2 = [[0,1,2],[3,4,5],[6,7,8]];

//通过reduce和...将二维数组变成一维数组
const arr1 = arr2.reduce((acc, item) => {
    acc.push(...item);
    return acc;
}, []);
console.log(arr1);
console.log(arr2);