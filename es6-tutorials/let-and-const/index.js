
function a(){
  return function(){
    console.log(arguments);
  }
}
f = a(1,2,3);
f("aa","bb");
//output: ["aa", "bb"]

-------------------------------

function f(){
  console.log(a);
}
f();
//Uncaught ReferenceError: a is not defined

function f(){
  console.log("a:", a);
  var a = "abc";
}
f();
//output: a: undefined

-------------------------------

function f(){
  console.log("a:", a);
  if(false){
    var a = "abc";
  }
}
f();
//output: a: undefined

-------------------------------