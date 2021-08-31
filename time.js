//util
const euclidDivision = function(a,b){
    let c = Math.floor(a/b);
    let d = a-c*b;
    return [c,d]
};

//static stuff
const timeval = [
    1,
    60,
    60*60,
    60*60*24,
    60*60*24*365,//years
];
const timeLabels = "seconds minutes hours days years".split(" ");

const addPermutations = function(table,val,str){
    let arr = str.split(" ");
    for(let i = 0; i < arr.length; i++){
        let base = arr[i];
        table[base] = val;
        table[base[0].toUpperCase()+base.slice(1)] = val;
        table[base.toUpperCase()] = val;
    }
};

const timeTable = {};
addPermutations(timeTable,0.001,"millis millisecond milliseconds milli ms ml");
addPermutations(timeTable,timeval[0],"seconds second sec s snd");
addPermutations(timeTable,timeval[1],"minutes minute mins m min");
addPermutations(timeTable,timeval[2],"hours hour hrs hur hr h");
addPermutations(timeTable,timeval[3],"days day d dys dy");
addPermutations(timeTable,timeval[4],"years year yr y yer yar");
timeTable[""] = timeval[1];
//find all numeric patterns, and split the string by it
//begin sign numeric dot numeric exp sign num
//0     1    2       3   4       5   6    7

const splitNumbers = function(str){
    const matches = str.matchAll(/(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:e[\+\-]?[0-9]+)?/g);
    let tokens = [];
    let previousEnd = 0;
    for(const match of matches){
        //console.log(match);
        //catch up to the match index
        tokens.push(str.slice(previousEnd,match.index));
        //push the body
        tokens.push(parseFloat(match[0]));
        previousEnd = match.index+match[0].length;
    }
    tokens.push(str.slice(previousEnd-str.length));
    //console.log(tokens);
    return tokens;
};

class Time{
    constructor(str){//returns milliseconds
        //accepted time
        //3 (minutes)
        //5:23
        //12 mins
        //55.3 hours
        //52 days 33 hours 32 minutes
        
        let colsplit = str.split(":").reverse();
        if(colsplit.length > 1){
            //apply the colsplit notation
            let t = 0;
            for(let i = 0; i < timeval.length; i++){
                t += timeval[i]*(parseFloat(colsplit[i]||0));
            }
            this.t = t;
            return;
        }
        //else
        let args = splitNumbers(str).slice(1);
        //console.log(args);
        let t = 0;
        let success = false;
        for(let i = 0; i < args.length; i+=2){
            let num = args[i];
            let attrs = (args[i+1] || "").trim().split(/[\s\,]+/);
            if(attrs[0] in timeTable){
                success = true;
                t += parseFloat(num)*timeTable[attrs[0]];
            }
        }
        if(success){
            this.t=t;
        }else{
            throw new Error("error parsing the string");
        }
    };
    ms(){
        return this.t*1000;
    };
    seconds(){
        return this.t;
    };
    toString(){
        let str = "";
        let tt = this.t;
        let v = 0;
        let first = true;
        for(let i = timeval.length-1; i >=0; i--){
            [v,tt] = euclidDivision(tt,timeval[i]);
            if(v !== 0){
                if(!first){
                    str += " ";
                }else{
                    first = false;
                }
                str += v+" "+timeLabels[i];
            }
        }
        if(str === "") str = "0 seconds";
        return str;
    };
};
module.exports = Time;