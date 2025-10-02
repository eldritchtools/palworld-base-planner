import { Tooltip } from "react-tooltip";
import { tooltipStyle } from "../../styles";
import WorkBonuses from "./WorkBonuses";
import WorkPriorities from "./WorkPriorities";
import WorkType from "./WorkType";

function WorkSuitabilitiesTab() {
    return <div style={{ height: "auto", width: "90%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(1000px, 1fr)", gap: "0.5rem" }}>
            
            <div><WorkBonuses /></div>
            <div><WorkPriorities /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(500px, 1fr)", gap: "0.5rem" }}>
                <div><WorkType type={"kindling"} /></div>
                <div><WorkType type={"watering"} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(500px, 1fr)", gap: "0.5rem" }}>
                <div><WorkType type={"planting"} /></div>
                <div><WorkType type={"generatingElectricity"} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(500px, 1fr)", gap: "0.5rem" }}>
                <div><WorkType type={"handiwork"} /></div>
                <div><WorkType type={"gathering"} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(500px, 1fr)", gap: "0.5rem" }}>
                <div><WorkType type={"lumbering"} /></div>
                <div><WorkType type={"mining"} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(500px, 1fr)", gap: "0.5rem" }}>
                <div><WorkType type={"medicineProduction"} /></div>
                <div><WorkType type={"cooling"} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(500px, 1fr)", gap: "0.5rem" }}>
                <div><WorkType type={"transporting"} /></div>
                <div><WorkType type={"farming"} /></div>
            </div>
        </div>
        
        <Tooltip id="notablePals" style={{...tooltipStyle, textAlign: "start"}}>
            Notable for various reasons such as but not limited to:
            <ul>
                <li>Having a good partner skill</li>
                <li>Being good for the role at the point they become accessible</li>
                <li>Being good for the role in general, especially at late/endgame</li>
                <li>Having a naturally high skill level without many alternatives</li>
                <li>Nocturnal while having good skills</li>
                <li>(For Transporting) Good speed</li>
            </ul>
        </Tooltip>
    </div>;
}

export default WorkSuitabilitiesTab;