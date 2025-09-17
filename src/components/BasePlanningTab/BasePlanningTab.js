import { useMemo, useState } from "react";

import "./BasePlanningTab.css"
import { useProfiles } from "@eldritchtools/shared-components";
import { pals, PalIcon, palIdSortFunc, checkPalSearchMatch } from "@eldritchtools/palworld-shared-library";
import { WorkIcon, workSuitabilities } from "../workSuitabilities";
import palNotes from '../../data/palNotes.json';
import { Base, BaseEmpty } from "./Base";

function comparePalNames(a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

function filterWorkSuitabilities(x, selectedSuitabilities) {
    return selectedSuitabilities.length > 0 ?
        Object.entries(x.workSuitability).filter(([work, _]) => selectedSuitabilities.includes(work)).map(([_, level]) => level) :
        Object.entries(x.workSuitability).map(([_, level]) => level);
}

function comparePalWorkSuitabilities(a, b, selectedSuitabilities) {
    let filteredA = filterWorkSuitabilities(a, selectedSuitabilities);
    let filteredB = filterWorkSuitabilities(b, selectedSuitabilities);
    if (Math.max(...filteredA) !== Math.max(...filteredB)) return Math.max(...filteredB) - Math.max(...filteredA);
    return filteredB.reduce((acc, level) => acc + level, 0) - filteredA.reduce((acc, level) => acc + level, 0);
}

function SidePanel({ selectedPalId, setSelectedPalId }) {
    const [searchString, setSearchString] = useState("");
    const handleSetSearchString = (e) => {
        setSearchString(e.target.value);
    }

    const searchComponent = <input onChange={handleSetSearchString} value={searchString} placeholder="Search Pal..." />

    const [suitabilitiesSelection, setSuitabilitiesSeletion] = useState([])
    const handleToggleSuitabilitySelection = (id, on) => {
        if (on) setSuitabilitiesSeletion(prev => prev.filter(x => x !== id));
        else setSuitabilitiesSeletion(prev => [...prev, id]);
    }

    const suitabilityComponents = <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridTemplateRows: "repeat(2, 1fr)" }}>
        {workSuitabilities.map(work => {
            const selected = suitabilitiesSelection.includes(work.id);
            return <div
                className={selected ? "selection-button-selected" : "selection-button"}
                onClick={() => handleToggleSuitabilitySelection(work.id, selected)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <WorkIcon work={work} />
            </div>
        })}
    </div>

    const [nocturnalToggle, setNocturnalToggle] = useState(false);
    const handleNocturnalToggle = () => {
        setNocturnalToggle(!nocturnalToggle);
    }
    const [specialEffectsToggle, setSpecialEffectsToggle] = useState(false);
    const handleSpecialEffectsToggle = () => {
        setSpecialEffectsToggle(!specialEffectsToggle);
    }

    const filterComponents = <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>Filters</span>
        {suitabilityComponents}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
            <div
                className={nocturnalToggle ? "selection-button-selected" : "selection-button"}
                onClick={() => handleNocturnalToggle()}
            >
                Nocturnal Only
            </div>
            <div
                className={specialEffectsToggle ? "selection-button-selected" : "selection-button"}
                onClick={() => handleSpecialEffectsToggle()}
            >
                Special Base Effects
            </div>
        </div>
    </div>

    const [sortSelection, setSortSelection] = useState("no");
    const sortComponents = <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>Sort by</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className={sortSelection === "no" ? "selection-button-selected" : "selection-button"} onClick={() => setSortSelection("no")}>Number</div>
            <div className={sortSelection === "name" ? "selection-button-selected" : "selection-button"} onClick={() => setSortSelection("name")}>Name</div>
            <div className={sortSelection === "work" ? "selection-button-selected" : "selection-button"} onClick={() => setSortSelection("work")}>Work Level</div>
        </div>
    </div>

    const filteredPals = useMemo(() => Object.entries(pals).filter(([_, pal]) => {
        if (searchString !== "" && !checkPalSearchMatch(searchString, pal)) return false;
        if (suitabilitiesSelection.length !== 0 && !Object.keys(pal.workSuitability).some(x => suitabilitiesSelection.includes(x))) return false;
        if (nocturnalToggle && !pal.nocturnal) return false;
        if (specialEffectsToggle && !(pal.id in palNotes && "notes" in palNotes[pal.id])) return false;
        return true;
    }).sort((a, b) => {
        switch (sortSelection) {
            case "no": return palIdSortFunc(a[0], b[0]);
            case "name": return comparePalNames(a[1], b[1]);
            case "work": return comparePalWorkSuitabilities(a[1], b[1], suitabilitiesSelection);
            default: return palIdSortFunc(a[0], b[0]);
        }
    }).map(([_, pal]) => pal), [searchString, suitabilitiesSelection, nocturnalToggle, specialEffectsToggle, sortSelection]);

    const handlePalClick = (palId) => {
        selectedPalId === palId ? setSelectedPalId(null) : setSelectedPalId(palId);
    }

    const palsDisplayComponent = <div style={{ display: "flex", width: "100%", flex: 1, overflowY: "scroll", padding: "2px", borderRadius: "5px", border: "1px #aaa solid", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "start", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", margin: "0.2rem", height: "fit-content", width: "100%" }}>
            {filteredPals.map(pal => <>
                <div data-tooltip-id={"palInfocardTooltip"} data-tooltip-content={pal.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={() => handlePalClick(pal.id)}>
                    <PalIcon pal={pal} circle={true} showName={true} highlighted={pal.id === selectedPalId} wrapName={true} />
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", maxWidth: "80px" }}>
                        {
                            suitabilitiesSelection.length > 0 ?
                                Object.entries(pal.workSuitability).filter(
                                    ([work, _]) => suitabilitiesSelection.includes(work)
                                ).map(
                                    ([work, level]) => <WorkIcon id={work} size={32} level={level} />
                                ) :
                                null
                        }
                    </div>
                </div>
            </>)}
        </div>
    </div>

    return <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", borderRight: "1px #aaa solid" }}>
        <div style={{ fontWeight: "bold" }}>Select Pal to Add</div>
        {searchComponent}
        {filterComponents}
        {sortComponents}
        {palsDisplayComponent}
    </div>
}


function BasesDisplay({ selectedPalId }) {
    const { profileData } = useProfiles();

    const style = { height: "100%", width: "100%", gap: "0.2rem", padding: "1rem", boxSizing: "border-box" };
    if (profileData.plannerLayout === "Horizontal") {
        style.display = "flex";
        style.flexDirection = "column";
        style.overflowX = "hidden";
        style.overflowY = "scroll";
    } else {
        style.display = "flex";
        style.flexDirection = "row";
        style.overflowX = "scroll";
        style.overflowY = "hidden";
    }

    return <div style={style}>
        {profileData.bases.map((base, index) => <Base base={base} baseIndex={index} sidePanelSelectedPalId={selectedPalId} />)}
        {profileData.bases.length < profileData.maxBases ? <BaseEmpty /> : null}
    </div>
}

function BasePlanningTab() {
    const [selectedPalId, setSelectedPalId] = useState(null);

    return <div style={{ height: "100%", width: "100%", display: "flex" }}>
        <div style={{ height: "100%", minWidth: "480px", width: "480px" }}>
            <SidePanel selectedPalId={selectedPalId} setSelectedPalId={setSelectedPalId} />
        </div>
        <div style={{ height: "100%", width: "calc(100% - 480px)" }}>
            <BasesDisplay selectedPalId={selectedPalId} />
        </div>
    </div>;
}

export default BasePlanningTab;