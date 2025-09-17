import { Icon } from "../Icon";

const workSuitabilities = [
    { id: "kindling", name: "Kindling", icon: "T_icon_palwork_00" },
    { id: "watering", name: "Watering", icon: "T_icon_palwork_01" },
    { id: "planting", name: "Planting", icon: "T_icon_palwork_02" },
    { id: "generatingElectricity", name: "Generating Electricity", icon: "T_icon_palwork_03" },
    { id: "handiwork", name: "Handiwork", icon: "T_icon_palwork_04" },
    { id: "gathering", name: "Gathering", icon: "T_icon_palwork_05" },
    { id: "lumbering", name: "Lumbering", icon: "T_icon_palwork_06" },
    { id: "mining", name: "Mining", icon: "T_icon_palwork_07" },
    { id: "medicineProduction", name: "Medicine Production", icon: "T_icon_palwork_08" },
    { id: "cooling", name: "Cooling", icon: "T_icon_palwork_10" },
    { id: "transporting", name: "Transporting", icon: "T_icon_palwork_11" },
    { id: "farming", name: "Farming", icon: "T_icon_palwork_12" }
]

const mapping = workSuitabilities.reduce((acc, work) => { acc[work.id] = work; return acc }, {});

function WorkIcon({ work = null, id = null, size = null, level = null }) {
    if (!work && !id) return;
    let finalWork = work ? work : mapping[id];
    let finalSize = size ?? 32;

    return <div style={{ display: "inline-flex", height: finalSize, width: finalSize, verticalAlign: "middle" }}>
        <div style={{ position: "relative", height: finalSize, width: finalSize }}>
            <Icon path={finalWork.icon} name={finalWork.name} size={finalSize} />
            {level ? <span style={{ fontSize: "1em", color: "#aaa", position: "absolute", bottom: "0%", right: "0%", fontWeight: "bold" }}>{level}</span> : null}
        </div>
    </div>
}

export { workSuitabilities, WorkIcon };
