import { PalIcon } from "@eldritchtools/palworld-shared-library";
import { WorkIcon } from "./workSuitabilities";
import palNotes from '../data/palNotes.json';

function PalInfoCard({ pal }) {
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "350px" }}>
        {pal.no !== "-1" ?
            <span style={{ fontSize: "1rem", fontWeight: "bold" }}>#{pal.no} {pal.name}</span> :
            <span style={{ fontSize: "1rem", fontWeight: "bold" }}>{pal.name}</span>
        }
        <PalIcon pal={pal} circle={true} />
        <div style={{ display: "flex", flexDirection: "row" }}>
            {Object.entries(pal.workSuitability).map(([work, level]) => <WorkIcon id={work} size={32} level={level} />)}
        </div>
        {pal.nocturnal ? <span>Nocturnal</span> : null}
        <span>Run Speed: {pal.runSpeed}</span>
        {"transporting" in pal.workSuitability ? <span>Transport Speed: {pal.transportSpeed}</span> : null }
        {"farming" in pal.workSuitability ? <span>Ranch Product: {palNotes[pal.id].farming}</span> : null}
        {pal.id in palNotes && "notes" in palNotes[pal.id] ? <div style={{display: "flex", flexDirection: "column"}}>
            <span>{palNotes[pal.id].notes}</span>
            <span>Effect by condense level:</span>
            <span>{palNotes[pal.id].values.join(", ")}</span>
            </div> : null}
    </div>
}

export default PalInfoCard;
