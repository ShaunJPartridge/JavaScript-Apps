// Method: getRanks()
export const getRanks = (ranks) => {
    let tmp = '';
    // For loop to get all 32 teams' ranks 
    for(let i = 0;i < ranks.length;){
        // Builds a comma delimited string rep. digits 1-9 
        if(i <= 8){
            tmp += ranks[i] + ',';
            i++;
        }
        // Builds a comma delimites string rep. numbers 10-32
        else{
            tmp += ranks[i] + ranks[i+1] + ',';
            i+=2;
        }
    }

    // Remove trailing comma from string and turn string into an array,
    // filled with integers 1-32.
    ranks = tmp.replace(/,$/,'').split(',');

    return ranks;
}

// Method: buildTeams()
export const buildTeams = (names,ranks) => {
    return names.map((el,ind) => {
        //console.log({team:el, rank:ranks[ind]});
        return {team:el, rank:Number(ranks[ind])};
    })
};