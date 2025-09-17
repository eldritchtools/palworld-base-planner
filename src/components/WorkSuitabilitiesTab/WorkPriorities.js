import { WorkIcon } from "../workSuitabilities";
import SnippetContainer from "./SnippetContainer";

const priority = [
    [{ text: "Defend" }],
    [{ text: "Aid/Revive" }, { text: "Extinguish", icon: "watering" }],
    [{ text: "Construction", icon: "handiwork" }],
    [{ text: "Grazing", icon: "farming" }],
    [{ text: "Generating Electricity", icon: "generatingElectricity" }],
    [{ text: "Repair", icon: "handiwork" }],
    [{ text: "Smelting", icon: "kindling" }, { text: "Heating", icon: "kindling" }],
    [{ text: "Cooking", icon: "kindling" }],
    [{ text: "Harvesting", icon: "gathering" }, { text: "Transporting Food", icon: "transporting" }],
    [{ text: "Planting", icon: "planting" }, { text: "Watering Farms", icon: "watering" }],
    [{ text: "Medicine Production", icon: "medicineProduction" }, { text: "Watering (Mill)", icon: "watering" }],
    [{ text: "Crafting/Handiwork", icon: "handiwork" }],
    [{ text: "Mining (Natural Nodes)", icon: "mining" }, { text: "Lumbering (Trees)", icon: "lumbering" }],
    [{ text: "Mining (Mining Sites)", icon: "mining" }, { text: "Lumbering (Lumbering Site)", icon: "lumbering" }],
    [{ text: "Transport (Disposable)", icon: "transporting" }],
    [{ text: "Transport", icon: "transporting" }],
    [{ text: "Gathering (Natural Spawns)", icon: "gathering" }],
    [{ text: "Cooling", icon: "cooling" }]
]

priority.forEach(prio => prio.length < 2 ? prio.push({}) : null);

function WorkPriorities() {
    return <SnippetContainer title={"Work Priorities"}>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem", alignItems: "start", textAlign: "start", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                Pals decide what they work on based on a predetermined order of work priorities, their available work suitabilities, and which types of work are enabled for them if you have the Monitoring Stand.
                <br /><br />
                This means if you constantly have work that's a higher priority than another work type, the pal will never do the lower priority work type (unless other pals are taking up all the slots for the higher priority work).
                <br /><br />
                For example, mining and lumbering are both higher than transport. This means if you have mining or lumbering sites in your base, a pal with both mining/lumbering and transport will only transport those materials to chests once you hit the max (9999) materials in the sites since that's the only time they can't work on the sites anymore.
                <br /><br />
                Similarly, if you have a cooling pal with any other work suitability, they will always prioritize those over cooling tasks.
                <br /><br />
                The table on the right shows the list of work priorities with the lower numbers having a higher priority.
            </div>
            <div style={{display: "flex", overflowY: "auto", flex: 1}}>
                <table style={{borderCollapse: "collapse"}}>
                    <tbody>
                        {priority.map((list, index) => <tr>
                            <td style={{border: "1px #aaa dotted", textAlign: "center", padding: "0.2rem"}}>{index+1}</td>
                            {list.map(item => <td style={{border: "1px #aaa dotted", padding: "0.2rem"}}>
                                {item.icon ? <WorkIcon id={item.icon} /> : null}
                                {item.text ?? null}
                            </td> )}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    </SnippetContainer>
}

export default WorkPriorities;