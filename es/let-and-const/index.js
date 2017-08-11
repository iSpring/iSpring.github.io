
function a(){
  return function(){
    console.log(arguments);
  }
}
f = a(1,2,3);
f("aa","bb");
//output: ["aa", "bb"]

//-------------------------------
//variable has function scope
//1.
function f(){
  console.log(a);
}
f();
//Uncaught ReferenceError: a is not defined

//2.
function f(){
  console.log(a);
  var a = "local a";
  console.log(a);
}
f();
//output: undefined   local a

//3.
function f(){
  console.log("a:", a);
  if(false){
    var a = "abc";
  }
}
f();
//output: a: undefined

//-------------------------------
//scope chain
//1.
var a = "a";
function f(){
  console.log(a);
}
f();
//output: a

//2.
var a = "a";
function f(){
  var a = "local a";
  console.log(a);
}
//output: local a

//3.
var a = "a";
function f(){
  console.log(a);
  var a = "local a";
  console.log(a);
}
f();
//output: undefined  local a

//4.
var a = "a";
function f(){
  console.log(a);
  if(false){
    var a = "local a";
  }
}
f();
//output: undefined

//5.
var a = "a";
function f(){
  var a = "aa";
  return function(){
    console.log(a);
  }
}
f()();
//output: aa
