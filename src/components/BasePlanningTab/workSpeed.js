
const workSpeedByLevel = {
    "kindling": [0, 70, 200, 600, 1800, 5400],
    "watering": [0, 70, 150, 300, 500, 1000],
    "planting": [0, 70, 150, 300, 500, 1000],
    "generatingElectricity": [0, 250, 500, 1000, 2000, 4000],
    "handiwork": [0, 70, 200, 600, 1800, 5400],
    "gathering": [0, 70, 150, 300, 500, 1000],
    "lumbering": [0, 70, 150, 300, 500, 1000],
    "mining": [0, 70, 150, 300, 500, 1000],
    "medicineProduction": [0, 70, 200, 600, 1800, 5400],
    "cooling": [0, 70, 150, 300, 500, 1000]
}

function getWorkSpeed(pal, basePals, work) {
    if (!(work.id in pal.currentSuitabilities)) return 0;
    if (work.id === "transporting" || work.id === "farming") return 0;

    return workSpeedByLevel[pal.currentSuitabilities[work.id]];
}

export { getWorkSpeed };