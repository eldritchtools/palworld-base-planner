import { useState } from "react";
import { useProfiles } from "@eldritchtools/shared-components";
import { pals, PalIcon, PassiveSelect, PassiveComponent } from "@eldritchtools/palworld-shared-library";
import { WorkIcon, workSuitabilities } from "../workSuitabilities";
import * as profileHandler from '../profileHandler';
import { Modal } from "../Modal";
import NumberSelector from "./NumberSelector";
import { CondenseIcon, getCondenseCounts } from "./condense";
import { getEnhanceCosts } from "./enhance";
import palNotes from '../../data/palNotes.json';
import { Tooltip } from "react-tooltip";
import { tooltipStyle } from "../../styles";
import FeedbackButton from "../FeedbackButton";

const tableCellStyle = { border: "1px #aaa dotted", padding: "0.2rem", fontSize: "1rem" };
const segmentHeight = "230px";

function Base({ base, baseIndex, sidePanelSelectedPalId }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const { profileData, setProfileData } = useProfiles();
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(base.name);
    const [deleteBaseOpen, setDeleteBaseOpen] = useState(false);

    const updateBaseName = () => {
        profileHandler.updateBase(profileData, setProfileData, baseIndex, base => { return { ...base, name: name } });
        setEditingName(false);
    }

    const handleInputNameKeyDown = (event) => {
        if (editingName && event.key === 'Enter') updateBaseName();
    };

    const handleDeleteBase = () => {
        setDeleteBaseOpen(false);
        profileHandler.deleteBase(profileData, setProfileData, baseIndex);
    }


    const palDisplayStyle = { display: "flex", flexDirection: "column", width: "100%", height: segmentHeight, border: "1px #aaa solid", borderRadius: "10px" };
    if (profileData.plannerLayout === "Horizontal") {
        palDisplayStyle.minWidth = "480px";
        palDisplayStyle.maxWidth = "480px";
    } else {
        palDisplayStyle.height = "100%";
    }
    const palDisplayComponent = <div style={palDisplayStyle}>
        <div style={{ display: "flex", flexDirection: "row" }}>
            <button style={{ flex: 1 }} disabled={selectedIndex === null || selectedIndex === 0}
                onClick={() => { profileHandler.swapPalOrder(profileData, setProfileData, baseIndex, selectedIndex, selectedIndex - 1); setSelectedIndex(selectedIndex - 1); }}>{"<"}</button>
            <button style={{ flex: 1 }} disabled={selectedIndex === null || selectedIndex === base.pals.length - 1}
                onClick={() => { profileHandler.swapPalOrder(profileData, setProfileData, baseIndex, selectedIndex, selectedIndex + 1); setSelectedIndex(selectedIndex + 1); }}>{">"}</button>
            <button style={{ flex: 1 }} disabled={selectedIndex === null || base.pals.length === profileData.maxPals}
                onClick={() => profileHandler.duplicatePal(profileData, setProfileData, baseIndex, selectedIndex)}>Duplicate</button>
            <button style={{ flex: 1 }} disabled={selectedIndex === null}
                onClick={() => {
                    if (base.pals.length === 1) setSelectedIndex(null);
                    else if (selectedIndex === base.pals.length - 1) setSelectedIndex(selectedIndex - 1);
                    profileHandler.deletePal(profileData, setProfileData, baseIndex, selectedIndex);
                }}>Remove</button>
        </div>
        <div style={{ flex: 1, width: "100%", overflowY: "scroll", padding: "0.5rem", boxSizing: "border-box" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", justifyItems: "center", gap: "0.5rem" }}>
                {base.pals.map((basePal, index) => {
                    return <div onClick={() => selectedIndex === index ? setSelectedIndex(null) : setSelectedIndex(index)} >
                        <PalIcon id={basePal.id} circle={true} highlighted={index === selectedIndex} />
                    </div>
                })}
                {base.pals.length < profileData.maxPals ?
                    <div
                        style={{ width: "80px", height: "80px", border: "1px rgba(255, 255, 255, 0.3) solid", borderRadius: "50%", cursor: "pointer" }}
                        onClick={() => profileHandler.addPalToBaseById(profileData, setProfileData, baseIndex, sidePanelSelectedPalId)}
                    >
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#aaa" strokeWidth="5">
                            <line x1="40" y1="20" x2="40" y2="60" />
                            <line x1="20" y1="40" x2="60" y2="40" />
                        </svg>
                    </div> :
                    null}
            </div>
        </div>
    </div>;

    const workSuitabilitiesRemoveZero = (level, work) => {
        if (profileData.shownValues === "Current Only") {
            const result = base.pals.filter(pal => work.id in pal.currentSuitabilities && pal.enabledWork[work.id] && pal.currentSuitabilities[work.id] === level).length;
            return result === 0 ? null : result;
        } else {
            const result1 = base.pals.filter(pal => work.id in pal.currentSuitabilities && pal.enabledWork[work.id] && pal.currentSuitabilities[work.id] === level).length;
            const result2 = base.pals.filter(pal => work.id in pal.targetSuitabilities && pal.enabledWork[work.id] && pal.targetSuitabilities[work.id] === level).length;
            return result1 === 0 && result2 === 0 ? null : `${result1}/${result2}`;
        }
    };

    const workSuitabilitiesStyle = { height: segmentHeight, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" };
    if (profileData.plannerLayout === "Horizontal") {
        workSuitabilitiesStyle.minWidth = "550px";
        workSuitabilitiesStyle.maxWidth = "550px";
    }
    const workSuitabilitiesComponent = <div style={workSuitabilitiesStyle}>
        <div style={{ textAlign: "start" }}>Work Suitabilities:</div>
        {selectedIndex !== null ?
            <table style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={tableCellStyle}></th>
                        {workSuitabilities.map(work => <th style={tableCellStyle}><WorkIcon work={work} size={32} /></th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={tableCellStyle}>Enabled</td>
                        {workSuitabilities.map(work => <td style={tableCellStyle}>
                            {work.id in base.pals[selectedIndex].currentSuitabilities ?
                                <div className="editable-text" style={{ cursor: "pointer" }}
                                    onClick={() => profileHandler.togglePalEnabledWork(profileData, setProfileData, baseIndex, selectedIndex, work.id)}>
                                    {base.pals[selectedIndex].enabledWork[work.id] ?
                                        <span style={{ color: "#00ff66" }}>&#10004;</span> :
                                        <span style={{ color: "red" }}>&#10006;</span>}
                                </div> :
                                ""}
                        </td>)}
                    </tr>
                    <tr>
                        <td style={tableCellStyle}>Current</td>
                        {workSuitabilities.map(work => work.id in base.pals[selectedIndex].currentSuitabilities ?
                            <td style={tableCellStyle}>
                                <NumberSelector value={base.pals[selectedIndex].currentSuitabilities[work.id]} min={pals[base.pals[selectedIndex].id].workSuitability[work.id]} max={work.id === "farming" ? 2 : 5}
                                    setValue={e => profileHandler.updatePalCurrentSuitability(profileData, setProfileData, baseIndex, selectedIndex, work.id, e)} />
                            </td> :
                            <td style={tableCellStyle}></td>
                        )}
                    </tr>
                    <tr>
                        <td style={tableCellStyle}>Target</td>
                        {workSuitabilities.map(work => work.id in base.pals[selectedIndex].targetSuitabilities ?
                            <td style={tableCellStyle}>
                                <NumberSelector value={base.pals[selectedIndex].targetSuitabilities[work.id]} min={base.pals[selectedIndex].currentSuitabilities[work.id]} max={work.id === "farming" ? 2 : 5}
                                    setValue={e => profileHandler.updatePalTargetSuitability(profileData, setProfileData, baseIndex, selectedIndex, work.id, e)} />
                            </td> :
                            <td style={tableCellStyle}></td>
                        )}
                    </tr>
                </tbody>
            </table> :
            <table style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={tableCellStyle}>Level</th>
                        {workSuitabilities.map(work => <th style={tableCellStyle}><WorkIcon work={work} size={32} /></th>)}
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4, 5].map(level => <tr>
                        <td style={tableCellStyle}>{level}</td>
                        {workSuitabilities.map(work => <td style={tableCellStyle}>
                            {workSuitabilitiesRemoveZero(level, work)}
                        </td>)}
                    </tr>)}
                    <tr>
                        <td style={tableCellStyle} data-tooltip-id={`books-${baseIndex}`}>Books
                            <Tooltip id={`books-${baseIndex}`} style={tooltipStyle}>Reduced by 1 for pals whose target condense level is 4</Tooltip>
                        </td>

                        {workSuitabilities.map(work => <td style={tableCellStyle}>
                            {work.id === "farming" ? null : base.pals.reduce((acc, pal) =>
                                work.id in pal.currentSuitabilities && pal.enabledWork[work.id] ?
                                    acc + Math.max(0, pal.targetSuitabilities[work.id] - pal.currentSuitabilities[work.id] - (pal.targetCondenseLevel === 4 && pal.currentCondenseLevel < 4 ? 1 : 0)) :
                                    acc, 0)}
                        </td>)}
                    </tr>
                </tbody>
            </table>
        }
    </div>;

    const passivesStyle = { height: segmentHeight, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" };
    if (profileData.plannerLayout === "Horizontal") {
        passivesStyle.minWidth = "290px";
    }
    const passivesComponent = <div style={passivesStyle}>
        <div style={{ textAlign: "start", width: "100%" }}>Passives:</div>
        {selectedIndex !== null ?
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                {base.pals[selectedIndex].passives.map((passive, index) =>
                    <PassiveSelect value={passive} onChange={v => profileHandler.setPalPassive(profileData, setProfileData, baseIndex, selectedIndex, index, v)} />
                )}
                {base.pals[selectedIndex].passives.length < 4 ?
                    <PassiveSelect value={null} onChange={v => profileHandler.setPalPassive(profileData, setProfileData, baseIndex, selectedIndex, 4, v)} /> :
                    null
                }
                <div style={{ display: "flex" }}>
                    <FeedbackButton style={{ flex: 1 }} onClick={() => profileHandler.copyPalPassives(profileData, setProfileData, baseIndex, selectedIndex, "same")}
                        text={"Copy to Same Pals in Base"} feedbackText={"Copied!"} />
                    <FeedbackButton style={{ flex: 1 }} onClick={() => profileHandler.copyPalPassives(profileData, setProfileData, baseIndex, selectedIndex, "all")}
                        text={"Copy to All Pals in Base"} feedbackText={"Copied!"} />
                </div>
            </div> :
            <div style={{ display: "grid", gridTemplateColumns: "fit-content(50px) 1fr", height: "90%", width: "100%", alignItems: "center", gap: "0.5rem", overflowY: "auto" }}>
                {
                    Object.entries(base.pals.reduce((acc, pal) => {
                        pal.passives.forEach(passive => passive in acc ? acc[passive] += 1 : acc[passive] = 1);
                        return acc;
                    }, {})).sort((a, b) => b[1] - a[1]).map(([passive, count]) =>
                        [<span>{count}x </span>, <PassiveComponent name={passive} addBorder={true} />]
                    ).flat()
                }
            </div>
        }
    </div>;

    const condensationRemoveZero = (level) => {
        if (profileData.shownValues === "Current Only") {
            const result = base.pals.filter(pal => pal.currentCondenseLevel === level).length;
            return result === 0 ? null : result;
        } else {
            const result1 = base.pals.filter(pal => pal.currentCondenseLevel === level).length;
            const result2 = base.pals.filter(pal => pal.targetCondenseLevel === level).length;
            return result1 === 0 && result2 === 0 ? null : `${result1}/${result2}`;
        }
    };

    const condensationStyle = { height: segmentHeight, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" };
    if (profileData.plannerLayout === "Horizontal") {
        condensationStyle.minWidth = "220px";
    }
    const condensationComponent = <div style={condensationStyle}>
        <div style={{ width: "100%", textAlign: "start" }}>Condense Level:</div>
        {selectedIndex !== null ?
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "220px" }}>
                <span>Current:</span>
                <NumberSelector value={base.pals[selectedIndex].currentCondenseLevel} min={0} max={4}
                    setValue={e => profileHandler.setPalCurrentCondenseLevel(profileData, setProfileData, baseIndex, selectedIndex, e)} />
                <span>Target:</span>
                <NumberSelector value={base.pals[selectedIndex].targetCondenseLevel} min={0} max={4}
                    setValue={e => profileHandler.setPalTargetCondenseLevel(profileData, setProfileData, baseIndex, selectedIndex, e)} />
                <FeedbackButton onClick={() => profileHandler.copyPalCondenseLevel(profileData, setProfileData, baseIndex, selectedIndex, "same")}
                    text={"Copy to Same Pals in Base"} feedbackText={"Copied!"} />
                <FeedbackButton onClick={() => profileHandler.copyPalCondenseLevel(profileData, setProfileData, baseIndex, selectedIndex, "all")}
                    text={"Copy to All Pals in Base"} feedbackText={"Copied!"} />
            </div>
            :
            <div style={{ width: "100%" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                        <tr>{[0, 1, 2, 3, 4].map(level => <td style={tableCellStyle}>{level}</td>)}</tr>
                        <tr>{[0, 1, 2, 3, 4].map(level => <td style={tableCellStyle}>
                            {condensationRemoveZero(level)}
                        </td>)}</tr>
                    </tbody>
                </table>
            </div>
        }
        <div style={{ width: "100%", textAlign: "start" }}>Pals needed for Condensation:</div>
        <div style={{ flex: 1, width: "100%", overflowY: "auto" }}>
            {selectedIndex !== null ?
                <div style={{ display: "grid", gridTemplateColumns: "150px 50px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        <PalIcon id={base.pals[selectedIndex].id} circle={true} size={32} />
                        <span>{pals[base.pals[selectedIndex].id].name}</span>
                    </div>
                    <div>
                        {getCondenseCounts(base.pals[selectedIndex].currentCondenseLevel, base.pals[selectedIndex].targetCondenseLevel)}
                    </div>
                </div>
                :
                <div style={{ display: "grid", gridTemplateColumns: "150px 50px", alignItems: "center" }}>
                    {
                        Object.entries(base.pals.reduce((acc, pal) => {
                            if (pal.id in acc) acc[pal.id] += getCondenseCounts(pal.currentCondenseLevel, pal.targetCondenseLevel);
                            else acc[pal.id] = getCondenseCounts(pal.currentCondenseLevel, pal.targetCondenseLevel);
                            return acc
                        }, {})).filter(([_, num]) => num > 0).map(([id, num]) => [
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <PalIcon id={id} circle={true} size={32} />
                                <span>{pals[id].name}</span>
                            </div>,
                            <div>
                                {num}
                            </div>
                        ]).flat()
                    }
                </div>
            }
        </div>
    </div>;

    const enhancementStyle = { height: segmentHeight, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" };
    if (profileData.plannerLayout === "Horizontal") {
        enhancementStyle.minWidth = "200px";
    }
    const enhancementComponent = <div style={enhancementStyle}>
        <div style={{ width: "100%", textAlign: "start" }}>Work Speed Enhancement:</div>
        {selectedIndex !== null ? [
            <div style={{ display: "grid", gridTemplateColumns: "fit-content(1px) 1fr fit-content(1px)", alignItems: "center" }} >
                <span>Current:</span>
                <input type="range" min="0" max="60" step="3" value={base.pals[selectedIndex].currentWorkSpeedEnhancement}
                    onChange={(e) => profileHandler.setPalCurrentWorkSpeedEnhancement(profileData, setProfileData, baseIndex, selectedIndex, parseInt(e.target.value))} />
                <span>{base.pals[selectedIndex].currentWorkSpeedEnhancement}%</span>
                <span>Target:</span>
                <input type="range" min="0" max="60" step="3" value={base.pals[selectedIndex].targetWorkSpeedEnhancement}
                    onChange={(e) => profileHandler.setPalTargetWorkSpeedEnhancement(profileData, setProfileData, baseIndex, selectedIndex, parseInt(e.target.value))} />
                <span>{base.pals[selectedIndex].targetWorkSpeedEnhancement}%</span>
            </div>,
            <div style={{ width: "100%", textAlign: "start" }}>Cost:</div>,
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.2rem" }}>
                {getEnhanceCosts(base.pals[selectedIndex].currentWorkSpeedEnhancement, base.pals[selectedIndex].targetWorkSpeedEnhancement).map(
                    (cost, level) => [<CondenseIcon level={level} size={32} />, <span>x{cost}</span>]).flat()
                }
            </div>,
            <div style={{ display: "flex" }}>
                <FeedbackButton style={{ flex: 1 }} onClick={() => profileHandler.copyPalWorkSpeedEnhancement(profileData, setProfileData, baseIndex, selectedIndex, "same")}
                    text={"Copy to Same Pals in Base"} feedbackText={"Copied!"} />
                <FeedbackButton style={{ flex: 1 }} onClick={() => profileHandler.copyPalWorkSpeedEnhancement(profileData, setProfileData, baseIndex, selectedIndex, "all")}
                    text={"Copy to All Pals in Base"} feedbackText={"Copied!"} />
            </div>
        ] : [
            <div style={{ width: "100%", textAlign: "start" }}>Current Average: {base.pals.reduce(
                (acc, pal) => { acc += pal.currentWorkSpeedEnhancement; return acc; }, 0) / Math.max(base.pals.length, 1)}%</div>,
            <div style={{ width: "100%", textAlign: "start" }}>Target Average: {+(base.pals.reduce(
                (acc, pal) => { acc += pal.targetWorkSpeedEnhancement; return acc; }, 0) / Math.max(base.pals.length, 1)).toFixed(2)}%</div>,
            <div style={{ width: "100%", textAlign: "start" }}>Cost:</div>,
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.2rem", alignItems: "center" }}>
                {base.pals.reduce((acc, pal) => {
                    const cost = getEnhanceCosts(pal.currentWorkSpeedEnhancement, pal.targetWorkSpeedEnhancement);
                    return acc.map((c, i) => c + cost[i]);
                }, [0, 0, 0, 0]).map((cost, level) => [<CondenseIcon level={level} size={32} />, <span>x{cost}</span>]).flat()}
            </div>
        ]}
    </div>;

    const otherStyle = { height: segmentHeight, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" };
    if (profileData.plannerLayout === "Horizontal") {
        otherStyle.minWidth = "180px";
    }
    const otherComponent = <div style={otherStyle}>
        <div style={{ width: "100%", textAlign: "start" }}>Other Effects:</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", overflowY: "auto" }} >
            {base.pals.filter(pal => pal.id in palNotes).map(pal => <div style={{ display: "flex", flexDirection: "row", gap: "0.2rem", alignItems: "center", textAlign: "start", border: "1px #aaa dotted" }}>
                <PalIcon id={pal.id} size={32} circle={true} />
                {"farming" in palNotes[pal.id] ? <span>Ranch: {palNotes[pal.id].farming}</span> : null}
                {"shortNote" in palNotes[pal.id] ?
                    pal.currentCondenseLevel === pal.targetCondenseLevel ?
                        <span>{palNotes[pal.id].values[pal.currentCondenseLevel]} {palNotes[pal.id].shortNote}</span> :
                        <span>{palNotes[pal.id].values[pal.currentCondenseLevel]} to {palNotes[pal.id].values[pal.targetCondenseLevel]} {palNotes[pal.id].shortNote}</span> :
                    null}
            </div>)}
        </div>
    </div>

    const notesStyle = { display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem", width: "100%", paddingTop: "0.5rem" };
    if (profileData.plannerLayout === "Horizontal") {
        notesStyle.height = "3rem";
    } else {
        notesStyle.minHeight = "3rem";
        // notesStyle.height = "100%";
    }
    const notesComponent = <div style={notesStyle}>
        <span>Notes:</span>
        <textarea style={{ height: "95%", flex: 1 }} value={base.notes} onChange={(e) => profileHandler.setBaseNotes(profileData, setProfileData, baseIndex, e.target.value)} />
    </div>

    const containerStyle = { border: "2px #777 solid", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" };
    if (profileData.plannerLayout === "Horizontal") {
        containerStyle.height = "350px";
        containerStyle.width = "100%";
    } else {
        containerStyle.height = "100%";
        containerStyle.minWidth = "580px";
        containerStyle.paddingBottom = "1rem";
    }

    return <>
        {profileData.plannerLayout === "Horizontal" ?
            <div style={containerStyle}>
                <div style={{ height: "100%", width: "100%", padding: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "start" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div style={{ width: "20rem", fontSize: "1.2rem", fontWeight: "bold", textAlign: "start" }}>
                            {editingName ?
                                <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleInputNameKeyDown} onBlur={updateBaseName} autoFocus /> :
                                <span className="editable-text" onClick={() => setEditingName(true)}>{base.name}</span>
                            }
                        </div>
                        <div
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#cc0000", fontSize: "1.25rem", cursor: "pointer" }}
                            onClick={() => setDeleteBaseOpen(true)}
                        >
                            &#x2716;
                        </div>
                    </div>
                    <div style={{ textAlign: "start" }}>
                        Showing: {selectedIndex !== null ? pals[base.pals[selectedIndex].id].name : "Summary"}
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
                        {palDisplayComponent}
                        {workSuitabilitiesComponent}
                        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", overflowX: "auto" }} >
                            {passivesComponent}
                            {condensationComponent}
                            {enhancementComponent}
                            {otherComponent}
                        </div>
                    </div>

                    {notesComponent}
                </div>
            </div> :
            <div style={containerStyle}>
                <div style={{ height: "100%", width: "100%", padding: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "start", overflowY: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div style={{ width: "20rem", fontSize: "1.2rem", fontWeight: "bold", textAlign: "start" }}>
                            {editingName ?
                                <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleInputNameKeyDown} onBlur={updateBaseName} autoFocus /> :
                                <span className="editable-text" onClick={() => setEditingName(true)}>{base.name}</span>
                            }
                        </div>
                        <div
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#cc0000", fontSize: "1.25rem", cursor: "pointer" }}
                            onClick={() => setDeleteBaseOpen(true)}
                        >
                            &#x2716;
                        </div>
                    </div>
                    <div style={{ textAlign: "start" }}>
                        Showing: {selectedIndex !== null ? pals[base.pals[selectedIndex].id].name : "Summary"}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "1fr auto auto", flex: 1, gap: "0.5rem", padding: "0.5rem" }}>
                        <div style={{ gridColumn: "span 2" }}>{palDisplayComponent}</div>
                        <div style={{ gridColumn: "span 2" }}>{workSuitabilitiesComponent}</div>
                        {passivesComponent}
                        {condensationComponent}
                        {enhancementComponent}
                        {otherComponent}
                    </div>

                    {notesComponent}
                </div>
            </div>
        }
        <Modal isOpen={deleteBaseOpen} onClose={() => setDeleteBaseOpen(false)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }} >
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Are you sure you want to delete {base.name}?</span>
                <div style={{ display: "flex", width: "100%", justifyContent: "end", gap: "2", borderTop: "0.5rem" }}>
                    <button onClick={() => setDeleteBaseOpen(false)}>Cancel</button>
                    <button onClick={handleDeleteBase}>Delete Base</button>
                </div>
            </div>
        </Modal>
    </>
}

function BaseEmpty() {
    const { profileData, setProfileData } = useProfiles();
    const [addBaseOpen, setAddBaseOpen] = useState(false);
    const [addBaseName, setAddBaseName] = useState("");

    const closeAddBase = () => {
        setAddBaseOpen(false);
        setAddBaseName("");
    }

    const addBase = () => {
        if (addBaseName !== "") {
            profileHandler.addBase(profileData, setProfileData, addBaseName);
            setAddBaseName("");
            closeAddBase();
        }
    }

    const containerStyle = { border: "2px #777 solid", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" };
    if (profileData.plannerLayout === "Horizontal") {
        containerStyle.height = "350px";
        containerStyle.width = "100%";
    } else {
        containerStyle.height = "100%";
        containerStyle.minWidth = "580px";
        containerStyle.paddingBottom = "1rem";
    }

    return <>
        <div className="selection-button" onClick={() => setAddBaseOpen(true)} style={containerStyle}>
            <div style={{ fontSize: "3rem", fontWeight: "bold" }} >+ Add Base</div>
        </div>
        <Modal isOpen={addBaseOpen} onClose={closeAddBase}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }} >
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Input Name:</span>
                <input type="text" value={addBaseName} onChange={(e) => setAddBaseName(e.target.value)} autoFocus />
                <div style={{ display: "flex", width: "100%", justifyContent: "end", gap: "2", borderTop: "0.5rem" }}>
                    <button onClick={closeAddBase}>Cancel</button>
                    <button onClick={addBase}>Add Base</button>
                </div>
            </div>
        </Modal>
    </>

}

export { Base, BaseEmpty };