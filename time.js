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

const formTable = function(){
    let table = {};
    for(let i = 0; i < arguments.length; i+=2){
        let val = arguments[i+1];
        let str = arguments[i];
        let arr = str.split("");
        for(let i = 0; i < arr.length; i++){
            table[arr[i]] = val;
        }
    }
    return table;
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

const jumps = [
    formTable("0123456789",2,"+-",1,".",3),    //0
    formTable("0123456789",2,".",3),           //1
    formTable("0123456789",2,".",3),           //2
    formTable("0123456789",4),                 //3
    formTable("0123456789",4,"Ee",5),          //4
    formTable("0123456789",7,"+-",6),          //5
    formTable("0123456789",7),                 //6
    formTable("0123456789",7),                 //7
];

const splitNumbers = function(str){
    let state = 0;
    let tokens = [];//alternation of str num
    let subtokens = [];
    let subtoken = "";
    for(let i = 0; i < str.length+1; i++){
        let char = str[i]||"EOF";
        //console.log(char,state,tokens,subtokens,subtoken);
        if(state === 0){
            if(char in jumps[0]){
                state = jumps[0][char];
                tokens.push(subtoken);
                subtoken = char;
                subtokens = [];
            }else{//jumping to numbers
                if(char !== "EOF")subtoken += char;
            }
        }else{
            if(char in jumps[state]){
                if(jumps[state][char] === state){//same subtoken
                    subtoken += char;
                }else{
                    state = jumps[state][char];
                    subtokens.push(subtoken);
                    subtoken = char;
                }
            }else{//goes back to 0
                subtokens.push(subtoken);
                //console.log(char,state,tokens,subtokens,subtoken);
                switch(state){
                    case 1:
                    //the token has ended with an error
                    subtoken = tokens.pop()+subtokens.join("");
                    i--;
                    break;
                    case 2:
                    //the token has ended correctly
                    tokens.push(parseInt(subtokens.join("")));
                    subtoken = char;
                    break;
                    case 3:{
                        //the token has ended with an error
                        let last = subtokens.pop();
                        subtoken = last;
                        i--;
                        let num = parseInt(subtokens.join(""));
                        if(isNaN(num)){
                            //console.log(char,state,tokens,subtokens,subtoken);
                            subtoken = tokens.pop()+subtokens.join("")+subtoken;
                        }else{
                            tokens.push(num);
                        }
                        break;
                    }
                    case 4:
                    //the token has ended correctly
                    tokens.push(parseFloat(subtokens.join("")));
                    subtoken = char;
                    break;
                    case 5:{
                        //the token has ended with an error
                        let last = subtokens.pop();
                        subtoken = last;
                        i--;
                        tokens.push(parseFloat(subtokens.join("")));
                        break;
                    }
                    case 6:{
                        //the token has ended with an error
                        let sign = subtokens.pop();
                        let esin = subtokens.pop();
                        subtoken = esin;
                        i--;
                        i -= sign.length;
                        tokens.push(parseFloat(subtokens.join("")));
                        break;
                    }
                    case 7:
                    //number to completion
                    tokens.push(parseFloat(subtokens.join("")));
                    subtoken = char;
                    break;
                }
                state = 0;
            }
        }
    }
    if(subtoken !== "EOF"){
        tokens.push(subtoken);
    }
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
        console.log(args);
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