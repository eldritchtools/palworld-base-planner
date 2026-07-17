
const workSpeedByLevel = {
    "kindling": [0, 50, 80, 140, 240, 400, 680, 1100, 1900, 3200, 5400],
    "watering": [0, 50, 70, 100, 140, 190, 260, 370, 510, 720, 1000],
    "planting": [0, 50, 70, 100, 140, 190, 260, 370, 510, 720, 1000],
    "generatingElectricity": [0, 250, 325, 400, 500, 750, 1000, 1500, 2000, 3000, 4000],
    "handiwork": [0, 50, 80, 140, 240, 400, 680, 1100, 1900, 3200, 5400],
    "gathering": [0, 50, 70, 100, 140, 190, 260, 370, 510, 720, 1000],
    "lumbering": [0, 50, 70, 100, 140, 190, 260, 370, 510, 720, 1000],
    "mining": [0, 50, 70, 100, 140, 190, 260, 370, 510, 720, 1000],
    "medicineProduction": [0, 50, 80, 140, 240, 400, 680, 1100, 1900, 3200, 5400],
    "cooling": [0, 50, 80, 140, 240, 400, 680, 1100, 1900, 3200, 5400],
    "transporting": [0, 2, 5, 10, 20, 40, 70, 120, 200, 320, 500],
    "farming": [0, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
}

function getWorkSpeed(pal, basePals, work) {
    if (!(work.id in pal.currentSuitabilities)) return 0;
    if (work.id === "transporting" || work.id === "farming") return 0;

    return workSpeedByLevel[pal.currentSuitabilities[work.id]];
}

export { getWorkSpeed };