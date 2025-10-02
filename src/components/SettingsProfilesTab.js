import { Tooltip } from "react-tooltip";
import { Modal } from "../components/Modal";
import { useProfiles } from "@eldritchtools/shared-components";
import { tooltipStyle } from "../styles";
import { useRef, useState } from "react";
import * as profileHandler from "./profileHandler";
import { PassiveSelect } from "@eldritchtools/palworld-shared-library";

const componentStyle = { height: "100%", flex: 1, border: "1px #aaa solid", borderRadius: "5px", display: "flex", flexDirection: "column", gap: "1rem", boxSizing: "border-box", alignItems: "center" };

function Setting({ name, tooltip, valueComponent }) {
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div data-tooltip-id={`setting`} data-tooltip-content={tooltip} style={{ padding: "0.5rem" }}>
            <span style={{ borderBottom: "1px #aaa dotted", cursor: "help" }}>{name}</span>
        </div>
        <div style={{ padding: "0.5rem" }}>
            {valueComponent}
        </div>
    </div>
}

function NumberOption({ value, setValue, min = null, max = null, step = 1 }) {
    const setOption = (v) => {
        let val = (min && v < min) ? min : ((max && v > max) ? max : v);
        if (val % step !== 0) val = step * Math.floor(val / step);
        setValue(val);
    }

    return <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <button onClick={() => setOption((value ?? min) - step)} disabled={value === undefined || value === min}>{"<"}</button>
        <input type="number" value={value ?? min} min={min} step={3} onChange={(e) => setOption(e.target.value === "" ? 0 : parseInt(e.target.value))} />
        <button onClick={() => setOption((value ?? min) + step)} disabled={value === max}>{">"}</button>
    </div>
}

function LeftRightOption({ options, value, setValue }) {
    const setOption = (indexDiff) => {
        const index = value ? options.indexOf(value) + indexDiff : 0 + indexDiff;
        setValue(options[index < 0 ? index + options.length : index % options.length])
    }

    return <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <button onClick={() => setOption(-1)}>{"<"}</button>
        <span>{value ?? options[0]}</span>
        <button onClick={() => setOption(+1)}>{">"}</button>
    </div>
}

function SettingsComponent() {
    const { profileData, setProfileData } = useProfiles();

    const getCurrentDefaultPassives = () => {
        if ("defaultPassives" in profileData) {
            const newArr = [...profileData.defaultPassives];
            newArr.length = 4;
            newArr.fill(null, profileData.defaultPassives.length);
            return newArr;
        } else {
            return [null, null, null, null];
        }
    }
    const [passivesOpen, setPassivesOpen] = useState(false);
    const [selectedPassives, setSelectedPassives] = useState([]);

    const openPassives = () => {
        setSelectedPassives(getCurrentDefaultPassives());
        setPassivesOpen(true);
    }

    const closePassives = () => {
        setSelectedPassives([]);
        setPassivesOpen(false);
    }

    const handleSetPassives = () => {
        profileHandler.setProfileDefaultPassives(profileData, setProfileData, selectedPassives);
        setPassivesOpen(false);
    }

    return <div style={componentStyle}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Settings</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
            <Setting name={"Max Bases"} tooltip={"Maximum number of bases you can build (default: 4)"}
                valueComponent={<NumberOption value={profileData.maxBases} min={1} setValue={e => profileHandler.setProfileMaxBases(profileData, setProfileData, e)} />} />
            <Setting name={"Max Pals per Base"} tooltip={"Maximum number of pals each base can hold (default: 15)"}
                valueComponent={<NumberOption value={profileData.maxPals} min={1} setValue={e => profileHandler.setProfileMaxPalsPerBase(profileData, setProfileData, e)} />} />
            <Setting name={"Base Planner Layout"} tooltip={"Layout used when displaying bases"}
                valueComponent={<LeftRightOption options={["Horizontal", "Vertical"]} value={profileData.plannerLayout} setValue={v => profileHandler.setProfilePlannerLayout(profileData, setProfileData, v)} />} />
            <Setting name={"Shown Values in Summary"} tooltip={"Whether to show only the current or both the current and target values when viewing the base summary.\nFilling in target values is only relevant if you want to see how many resources you need to achieve that target,\notherwise it's fine if you only fill in current values."}
                valueComponent={<LeftRightOption options={["Current Only", "Current and Target"]} value={profileData.shownValues} setValue={v => profileHandler.setProfileShownValues(profileData, setProfileData, v)} />} />
            <Setting name={"Default Work Suitabilities"} tooltip={"Work suitability levels to assign to newly added pals\n'Use Starting Levels' assigns the pal's normal levels to both current and target\n'Set Target to Max' retains the normal levels for current but sets target to 5\n'Set Current and Target to Max' sets both current and target to 5"}
                valueComponent={<LeftRightOption options={["Use Starting Levels", "Set Target to Max", "Set Current and Target to Max"]} value={profileData.defaultWork} setValue={v => profileHandler.setProfileDefaultWork(profileData, setProfileData, v)} />} />
            <Setting name={"Default Passives"} tooltip={"Passives to assign to newly added pals"}
                valueComponent={<button onClick={openPassives} >Set Passives</button>} />
            <Setting name={"Default Current Condense Level"} tooltip={"Current condense level to assign to newly added pals"}
                valueComponent={<NumberOption value={profileData.defaultCurrentCondensationLevel} min={0} max={4} setValue={e => profileHandler.setProfileDefaultCurrentCondensationLevel(profileData, setProfileData, e)} />} />
            <Setting name={"Default Target Condense Level"} tooltip={"Target condense level to assign to newly added pals"}
                valueComponent={<NumberOption value={profileData.defaultTargetCondensationLevel} min={0} max={4} setValue={e => profileHandler.setProfileDefaultTargetCondensationLevel(profileData, setProfileData, e)} />} />
            <Setting name={"Default Current Work Speed Enhancement"} tooltip={"Current work speed enhancement to assign to newly added pals"}
                valueComponent={<NumberOption value={profileData.defaultCurrentEnhancement} min={0} max={60} step={3} setValue={e => profileHandler.setProfileDefaultCurrentEnhancement(profileData, setProfileData, e)} />} />
            <Setting name={"Default Target Work Speed Enhancement"} tooltip={"Target work speed enhancement level to assign to newly added pals"}
                valueComponent={<NumberOption value={profileData.defaultTargetEnhancement} min={0} max={60} step={3} setValue={e => profileHandler.setProfileDefaultTargetEnhancement(profileData, setProfileData, e)} />} />
        </div>
        <Tooltip id={`setting`} style={{ ...tooltipStyle, whiteSpace: "pre-wrap" }} />

        <Modal isOpen={passivesOpen} onClose={closePassives}>
            <h3>Select up to 4 passives:</h3>
            {selectedPassives.map((passive, index) => <PassiveSelect value={passive} onChange={v => setSelectedPassives(selectedPassives.map((p, i) => i === index ? v : p))} />)}
            <div style={{ display: "flex", justifyContent: "end", gap: "2" }}>
                <button onClick={closePassives}>Cancel</button>
                <button onClick={handleSetPassives}>Set Default Passives</button>
            </div>
        </Modal>
    </div>
}

function ProfilesComponent() {
    const [selected, setSelected] = useState(null);
    const [addProfileIsOpen, setAddProfileIsOpen] = useState(false);
    const [copyProfileIsOpen, setCopyProfileIsOpen] = useState(false);
    const [deleteProfileIsOpen, setDeleteProfileIsOpen] = useState(false);
    const [exportProfileIsOpen, setExportProfileIsOpen] = useState(false);
    const [importProfileIsOpen, setImportProfileIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [dataString, setDataString] = useState("");
    const textAreaRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState('');
    const { profiles, currentProfile, addProfile, switchProfile, copyProfile, deleteProfile, exportProfile, importProfile } = useProfiles();

    const handleSwitchProfileButton = () => {
        if (!selected) return;
        switchProfile(selected).catch(err => {
            console.error(err.message);
        });
    }

    const handleCopyProfileButton = () => {
        if (!selected) return;
        setCopyProfileIsOpen(true);
    }

    const handleDeleteProfileButton = () => {
        if (!selected) return;
        setDeleteProfileIsOpen(true);
    }

    const handleExportProfileButton = () => {
        if (!selected) return;
        exportProfile(selected).then(data => setDataString(data));
        setExportProfileIsOpen(true);
    }

    const handleImportProfileButton = () => {
        setImportProfileIsOpen(true);
    }

    const closeAddProfile = () => {
        setAddProfileIsOpen(false);
        setName("");
    }

    const closeCopyProfile = () => {
        setCopyProfileIsOpen(false);
        setName("");
    }

    const closeExportProfile = () => {
        setExportProfileIsOpen(false);
        setDataString("");
    }

    const closeImportProfile = () => {
        setImportProfileIsOpen(false);
        setName("");
        setDataString("");
    }

    const handleAddProfile = () => {
        addProfile(name).catch(err => {
            console.error(err.message);
        });
        setName("");
        setAddProfileIsOpen(false);
    }

    const handleCopyProfile = () => {
        copyProfile(selected, name).catch(err => {
            console.error(err.message);
        });
        setName("");
        setCopyProfileIsOpen(false);
    }

    const handleDeleteProfile = () => {
        deleteProfile(selected).catch(err => {
            console.error(err.message);
        });
        setDeleteProfileIsOpen(false);
    }

    const handleImportProfile = () => {
        importProfile(name, dataString);
        setImportProfileIsOpen(false);
        setName("");
        setDataString("");
    }

    const handleCopy = async () => {
        if (textAreaRef.current) {
            try {
                await navigator.clipboard.writeText(textAreaRef.current.value);
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            } catch (err) {
                setCopySuccess('Failed to copy!');
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return <div style={componentStyle}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Profiles</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(350px, 1fr)", width: "90%", padding: "1rem", alignItems: "center" }}>
            <div style={{ display: "flex", width: "100%", height: "25rem", justifyContent: "center", overflowY: "scroll", border: "1px #aaa solid" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", width: "100%", height: "100%" }}>
                    {profiles.map(profile => {
                        return <div style={selected === profile ? { background: "rgba(255, 255, 255, 0.25)" } : {}} onClick={() => setSelected(profile)}>
                            {profile}
                        </div>
                    })}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: "2rem" }}>
                <div style={{fontSize: "1.2rem", fontWeight: "bold"}}>Current Profile: {currentProfile}</div>
                <div style={{ display: "flex", flexDirection: "column", width: "250px", justifyContent: "center", gap: "1rem" }}>
                    <button onClick={() => setAddProfileIsOpen(true)}>Create New Profile</button>
                    <button onClick={handleSwitchProfileButton}>Switch to Selected Profile</button>
                    <button onClick={handleCopyProfileButton}>Copy Selected Profile</button>
                    <button onClick={handleDeleteProfileButton}>Delete Selected Profile</button>
                    <button onClick={handleExportProfileButton}>Export Selected Profile</button>
                    <button onClick={handleImportProfileButton}>Import Selected Profile</button>
                </div>
            </div>
        </div>

        <Modal isOpen={addProfileIsOpen} onClose={closeAddProfile}>
            <h3>Input name of new profile:</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <div style={{ display: "flex", justifyContent: "end", gap: "2" }}>
                <button onClick={closeAddProfile}>Cancel</button>
                <button onClick={handleAddProfile}>Create</button>
            </div>
        </Modal>

        <Modal isOpen={copyProfileIsOpen} onClose={closeCopyProfile}>
            <h3>Input name of new profile:</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <div style={{ display: "flex", justifyContent: "end", gap: "2" }}>
                <button onClick={closeCopyProfile}>Cancel</button>
                <button onClick={handleCopyProfile}>Copy</button>
            </div>
        </Modal>

        <Modal isOpen={deleteProfileIsOpen} onClose={() => setDeleteProfileIsOpen(false)}>
            <h3>Are you sure you want to delete '{selected}'?</h3>
            <div style={{ display: "flex", justifyContent: "end", gap: "2" }}>
                <button onClick={() => setDeleteProfileIsOpen(false)}>Cancel</button>
                <button onClick={handleDeleteProfile}>Delete</button>
            </div>
        </Modal>

        <Modal isOpen={exportProfileIsOpen} onClose={closeExportProfile}>
            <h3>Copy the following string to import '{selected}' to another device</h3>
            <textarea style={{height: "5rem", width: "90%"}} ref={textAreaRef} readOnly={true} value={dataString} onClick={handleCopy}/>
            <div>{copySuccess ?? null}</div>
            <div style={{ display: "flex", justifyContent: "end", gap: "2" }}>
                <button onClick={closeExportProfile}>Close</button>
            </div>
        </Modal>

        <Modal isOpen={importProfileIsOpen} onClose={closeImportProfile}>
            <h3>Input name of new profile:</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <h3>Input exported data string:</h3>
            <textarea style={{height: "5rem", width: "90%"}} value={dataString} onChange={e => setDataString(e.target.value)}/>
            <div style={{ display: "flex", justifyContent: "end", gap: "2" }}>
                <button onClick={closeImportProfile}>Cancel</button>
                <button onClick={handleImportProfile}>Import</button>
            </div>
        </Modal>
    </div>
}

function SettingsProfilesTab() {

    return <div style={{ height: "95%", width: "80%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(800px, 1fr))", gap: "1rem", overflowY: "auto" }}>
        <SettingsComponent />
        <ProfilesComponent />
    </div>;
}

export default SettingsProfilesTab;
