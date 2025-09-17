
const perLevelCost = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 2], [3, 3], [3, 3], [3, 3], [3, 4], [3, 4], [3, 4], [3, 4]
];

const enhanceCosts = [[0, 0, 0, 0]];
perLevelCost.forEach(levelCost => {
    const nextCost = [...enhanceCosts[enhanceCosts.length-1]];
    nextCost[levelCost[0]] += levelCost[1];
    enhanceCosts.push(nextCost);
})

function getEnhanceCosts(start, end) {
    return [0, 1, 2, 3].map(level => enhanceCosts[end/3][level] - enhanceCosts[start/3][level]);
}

export { getEnhanceCosts };