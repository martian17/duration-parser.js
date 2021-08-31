const splitNumbers = function(str){
    const matches = str.matchAll(/(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:e[\+\-]?[0-9]+)?/g);
    let tokens = [];
    let previousEnd = 0;
    for(const match of matches){
        console.log(match);
        //catch up to the match index
        tokens.push(str.slice(previousEnd,match.index));
        //push the body
        tokens.push(parseFloat(match[0]));
        previousEnd = match.index+match[0].length;
    }
    tokens.push(str.slice(previousEnd-str.length));
    console.log(tokens);
    return tokens;
};

splitNumbers("10fafabefd3.14e+12afalbhfd5e12asw");