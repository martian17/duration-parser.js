const Time = require("./time.js");

let time;
time = new Time("10 hours and 5 seconds");
console.log(time.toString());//10 hours 5 seconds
console.log(time.seconds());//36005
console.log(time.ms());//36005000

time = new Time("3:2:1");
console.log(time.toString());//3 hours 2 minutes 1 seconds

//no need for spaces & scientific notation supported
time = new Time("7mins 5.2e+2s");
console.log(time.ms());//940000