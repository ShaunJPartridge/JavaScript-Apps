export const buildTeams = (names,ranks) => {
    const teams = names.map((el,ind) => {
        console.log({name:el, rank:ranks[ind]});
        return {name:el, rank:ranks[ind]};
    })
};