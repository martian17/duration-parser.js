# time.js

This module contains a class constructor Time that takes in a time string, and parses it into a usable form.

## Example
```javascript
const Time = require("time.js");

let time;
//               allows scientific notation
//               no space needed between numbers and postfixes
time = new Time("10.14e+1hours and 5 Seconds");
console.log(time.ms());//365045000

time = new Time("3:2:1");
console.log(time.toString());//3 hours 2 minutes 1 seconds

time = new Time("7 mins 5s");
console.log(time.seconds());//425
```

## Supported Syntaxes

### Postfix notations
```
milliseconds: millis millisecond milliseconds milli ms ml");
seconds:      seconds second sec s snd
minutes:      minutes minute mins m min
hours:        hours hour hrs hur hr h
days:         days day d dys dy
years:        years year yr y yer yar
```
as well as all of their upper cases and capitalized versions

### Colon (:) notation
```
years:days:hours:minutes:seconds
```
Everything left of years will be ignored.

### Direct number input
Direct number input will be converted to minutes.