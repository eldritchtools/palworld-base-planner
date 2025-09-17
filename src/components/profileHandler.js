import { pals } from "@eldritchtools/palworld-shared-library";

function setProfileMaxBases(profileData, setProfileData, maxBases) {
    setProfileData({ ...profileData, maxBases: maxBases });
}

function setProfileMaxPalsPerBase(profileData, setProfileData, maxPals) {
    setProfileData({ ...profileData, maxPals: maxPals });
}

function setProfilePlannerLayout(profileData, setProfileData, layout) {
    setProfileData({ ...profileData, plannerLayout: layout })
}

function setProfileShownValues(profileData, setProfileData, shownValues) {
    setProfileData({ ...profileData, shownValues: shownValues })
}

function setProfileDefaultWork(profileData, setProfileData, setting) {
    setProfileData({ ...profileData, defaultWork: setting })
}

function setProfileDefaultPassives(profileData, setProfileData, passives) {
    setProfileData({ ...profileData, defaultPassives: passives.filter(p => p) })
}

function setProfileDefaultCurrentCondensationLevel(profileData, setProfileData, level) {
    setProfileData({ ...profileData, defaultCurrentCondensationLevel: level })
}

function setProfileDefaultTargetCondensationLevel(profileData, setProfileData, level) {
    setProfileData({ ...profileData, defaultTargetCondensationLevel: level })
}

function setProfileDefaultCurrentEnhancement(profileData, setProfileData, level) {
    setProfileData({ ...profileData, defaultCurrentEnhancement: level })
}

function setProfileDefaultTargetEnhancement(profileData, setProfileData, level) {
    setProfileData({ ...profileData, defaultTargetEnhancement: level })
}

function addBase(profileData, setProfileData, name) {
    const newBase = { name: name, pals: [], notes: "" };
    setProfileData({ ...profileData, bases: [...profileData.bases, newBase] })
}

function deleteBase(profileData, setProfileData, baseIndex) {
    setProfileData({ ...profileData, bases: profileData.bases.filter((_, index) => index !== baseIndex) })
}

function swapBaseOrder(profileData, setProfileData, baseIndex, baseIndex2) {
    setProfileData({
        ...profileData,
        bases: profileData.bases.map(
            (base, index) => index === baseIndex ?
                profileData.bases[baseIndex2] :
                index === baseIndex2 ? profileData.bases[baseIndex] : base
        )
    })
}

function updateBase(profileData, setProfileData, baseIndex, updateFunction) {
    setProfileData(
        {
            ...profileData,
            bases: profileData.bases.map((base, index) => index === baseIndex ? updateFunction(base) : base)
        }
    )
}

function setBaseNotes(profileData, setProfileData, baseIndex, notes) {
    updateBase(profileData, setProfileData, baseIndex, base => { return { ...base, notes: notes } });
}

const getNewCurrentSuitability = (profileData, palId) => {
    if (profileData.defaultWork && profileData.defaultWork === "Set Current and Target to Max") {
        return Object.keys(pals[palId].workSuitability).reduce((acc, work) => {acc[work] = 5; return acc}, {});
    } else {
        return {...pals[palId].workSuitability};
    }
}

const getNewTargetSuitability = (profileData, palId) => {
    if (profileData.defaultWork && profileData.defaultWork !== "Use Starting Levels") {
        return Object.keys(pals[palId].workSuitability).reduce((acc, work) => {acc[work] = 5; return acc}, {});
    } else {
        return {...pals[palId].workSuitability};
    }
}

function addPalToBaseById(profileData, setProfileData, baseIndex, palId) {
    if (!palId) return;

    
    const newPal = {
        id: palId,
        currentSuitabilities: getNewCurrentSuitability(profileData, palId),
        targetSuitabilities: getNewTargetSuitability(profileData, palId),
        passives: profileData.defaultPassives ?? [],
        currentCondenseLevel: profileData.defaultCurrentCondensationLevel ?? 0,
        targetCondenseLevel: profileData.defaultTargetCondensationLevel ?? 0,
        currentWorkSpeedEnhancement: profileData.defaultCurrentEnhancement ?? 0,
        targetWorkSpeedEnhancement: profileData.defaultTargetEnhancement ?? 0,
        enabledWork: Object.keys(pals[palId].workSuitability).reduce((acc, key) => { acc[key] = true; return acc }, {})
    };
    updateBase(profileData, setProfileData, baseIndex, base => { base.pals.push(newPal); return base; })
}

function deletePal(profileData, setProfileData, baseIndex, palIndex) {
    updateBase(profileData, setProfileData, baseIndex,
        base => { return { ...base, pals: base.pals.filter((_, index) => index !== palIndex) } }
    )
}

function swapPalOrder(profileData, setProfileData, baseIndex, palIndex, palIndex2) {
    updateBase(profileData, setProfileData, baseIndex,
        base => {
            return {
                ...base,
                pals: base.pals.map(
                    (pal, index) => index === palIndex ?
                        base.pals[palIndex2] :
                        index === palIndex2 ? base.pals[palIndex] : pal
                )
            }
        }
    )
}

function duplicatePal(profileData, setProfileData, baseIndex, palIndex) {
    updateBase(profileData, setProfileData, baseIndex,
        base => { return { ...base, pals: [...base.pals, { ...base.pals[palIndex] }] } }
    )
}

function updatePal(profileData, setProfileData, baseIndex, palIndex, updateFunction) {
    updateBase(profileData, setProfileData, baseIndex,
        base => { return { ...base, pals: base.pals.map((pal, index) => index === palIndex ? updateFunction(pal) : pal) } }
    )
}

function updatePalCurrentSuitability(profileData, setProfileData, baseIndex, palIndex, work, level) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, currentSuitabilities: { ...pal.currentSuitabilities, [work]: level } } }
    )
}

function updatePalTargetSuitability(profileData, setProfileData, baseIndex, palIndex, work, level) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, targetSuitabilities: { ...pal.targetSuitabilities, [work]: level } } }
    )
}

function setPalPassive(profileData, setProfileData, baseIndex, palIndex, passiveIndex, newPassive) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => {
            let newPassives = [...pal.passives];
            if (passiveIndex >= newPassives.length) newPassives.push(newPassive);
            else if (newPassive === null) newPassives = newPassives.filter((_, index) => index !== passiveIndex);
            else newPassives = newPassives.map((passive, index) => index === passiveIndex ? newPassive : passive);
            return { ...pal, passives: newPassives }
        }
    )
}

function copyPalPassives(profileData, setProfileData, baseIndex, palIndex, sameOrAll) {
    updateBase(profileData, setProfileData, baseIndex,
        base => {
            return {
                ...base, pals: base.pals.map((pal, index) => {
                    if (index === palIndex) return pal;
                    if (sameOrAll === "same") {
                        if (base.pals[palIndex].id === pal.id) return { ...pal, passives: [...base.pals[palIndex].passives] }
                        else return pal;
                    } else if (sameOrAll === "all") {
                        return { ...pal, passives: [...base.pals[palIndex].passives] }
                    } else {
                        return pal;
                    }
                })
            }
        }
    )
}

function setPalCurrentCondenseLevel(profileData, setProfileData, baseIndex, palIndex, level) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, currentCondenseLevel: level } }
    )
}

function setPalTargetCondenseLevel(profileData, setProfileData, baseIndex, palIndex, level) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, targetCondenseLevel: level } }
    )
}

function copyPalCondenseLevel(profileData, setProfileData, baseIndex, palIndex, sameOrAll) {
    updateBase(profileData, setProfileData, baseIndex,
        base => {
            return {
                ...base, pals: base.pals.map((pal, index) => {
                    if (index === palIndex) return pal;
                    if (sameOrAll === "same") {
                        if (base.pals[palIndex].id === pal.id) return {
                            ...pal,
                            currentCondenseLevel: base.pals[palIndex].currentCondenseLevel,
                            targetCondenseLevel: base.pals[palIndex].targetCondenseLevel
                        }
                        else return pal;
                    } else if (sameOrAll === "all") {
                        return {
                            ...pal,
                            currentCondenseLevel: base.pals[palIndex].currentCondenseLevel,
                            targetCondenseLevel: base.pals[palIndex].targetCondenseLevel
                        }
                    } else {
                        return pal;
                    }
                })
            }
        }
    )
}

function setPalCurrentWorkSpeedEnhancement(profileData, setProfileData, baseIndex, palIndex, enhancement) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, currentWorkSpeedEnhancement: enhancement } }
    )
}

function setPalTargetWorkSpeedEnhancement(profileData, setProfileData, baseIndex, palIndex, enhancement) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, targetWorkSpeedEnhancement: enhancement } }
    )
}

function copyPalWorkSpeedEnhancement(profileData, setProfileData, baseIndex, palIndex, sameOrAll) {
    updateBase(profileData, setProfileData, baseIndex,
        base => {
            return {
                ...base, pals: base.pals.map((pal, index) => {
                    if (index === palIndex) return pal;
                    if (sameOrAll === "same") {
                        if (base.pals[palIndex].id === pal.id) return {
                            ...pal,
                            currentWorkSpeedEnhancement: base.pals[palIndex].currentWorkSpeedEnhancement,
                            targetWorkSpeedEnhancement: base.pals[palIndex].targetWorkSpeedEnhancement
                        }
                        else return pal;
                    } else if (sameOrAll === "all") {
                        return {
                            ...pal,
                            currentWorkSpeedEnhancement: base.pals[palIndex].currentWorkSpeedEnhancement,
                            targetWorkSpeedEnhancement: base.pals[palIndex].targetWorkSpeedEnhancement
                        }
                    } else {
                        return pal;
                    }
                })
            }
        }
    )
}


function togglePalEnabledWork(profileData, setProfileData, baseIndex, palIndex, workType) {
    updatePal(profileData, setProfileData, baseIndex, palIndex,
        pal => { return { ...pal, enabledWork: { ...pal.enabledWork, [workType]: !pal.enabledWork[workType] } } }
    )
}


export {
    setProfileMaxBases,
    setProfileMaxPalsPerBase,
    setProfilePlannerLayout,
    setProfileShownValues,
    setProfileDefaultWork,
    setProfileDefaultPassives,
    setProfileDefaultCurrentCondensationLevel,
    setProfileDefaultTargetCondensationLevel,
    setProfileDefaultCurrentEnhancement,
    setProfileDefaultTargetEnhancement,
    addBase,
    deleteBase,
    swapBaseOrder,
    updateBase,
    setBaseNotes,
    addPalToBaseById,
    deletePal,
    swapPalOrder,
    duplicatePal,
    updatePal,
    updatePalCurrentSuitability,
    updatePalTargetSuitability,
    setPalPassive,
    copyPalPassives,
    setPalCurrentCondenseLevel,
    setPalTargetCondenseLevel,
    copyPalCondenseLevel,
    setPalCurrentWorkSpeedEnhancement,
    setPalTargetWorkSpeedEnhancement,
    copyPalWorkSpeedEnhancement,
    togglePalEnabledWork
};