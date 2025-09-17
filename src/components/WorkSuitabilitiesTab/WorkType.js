import SnippetContainer from "./SnippetContainer";
import { PalIcon, palIdSortFunc, pals } from "@eldritchtools/palworld-shared-library";
import DataTable from 'react-data-table-component';
import { WorkIcon } from "../workSuitabilities";
import palNotes from '../../data/palNotes.json';

const columnTemplates = {
    "pal": (_) => {
        return {
            name: "Pal",
            cell: pal => <div style={{ display: "flex", flexDirection: "row", gap: "5px", alignItems: "center" }} data-tooltip-id={"palInfocardTooltip"} data-tooltip-content={pal.id}>
                <PalIcon pal={pal} size={32} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{pal.name}</span>
                    <span>{Object.entries(pal.workSuitability).map(([work, level]) => <WorkIcon id={work} level={level} />)}</span>
                </div>
            </div>,
            sortable: true,
            sortFunction: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
            grow: 1
        }
    },
    "level": (type) => {
        return {
            name: "L",
            selector: pal => pal.workSuitability[type],
            sortable: true,
            center: true,
            width: "70px"
        }
    },
    "numberOthers": (type) => {
        return {
            name: "O",
            selector: pal => Object.entries(pal.workSuitability).reduce((acc, [work, _]) => work === type ? acc : acc + 1, 0),
            sortable: true,
            center: true,
            width: "70px"
        }
    },
    "levelOthers": (type) => {
        return {
            name: "T",
            selector: pal => Object.entries(pal.workSuitability).reduce((acc, [work, level]) => work === type ? acc : acc + level, 0),
            sortable: true,
            center: true,
            width: "70px"
        }
    },
    "runSpeed": (_) => {
        return {
            name: "RS",
            selector: pal => pal.runSpeed,
            sortable: true,
            center: true,
            width: "70px"
        }
    },
    "transportSpeed": (_) => {
        return {
            name: "TS",
            selector: pal => pal.transportSpeed,
            sortable: true,
            center: true,
            width: "70px"
        }
    },
    "farming": (_) => {
        return {
            name: "Ranch Product",
            selector: pal => palNotes[pal.id].farming,
            sortable: true,
            center: true,
            grow: 1
        }
    },
};

const info = {
    "kindling": {
        title: "Kindling",
        notes: "Used often due to smelting and cooking always being needed, but not always active so needs secondary skills.",
        notablePals: ["FlameBuffalo", "FoxMage", "RedArmorBird", "VolcanicMonster", "Umihebi_Fire", "CandleGhost", "Baphomet", "GhostAnglerfish_Fire", "Ronin_Dark", "KingBahamut"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "watering": {
        title: "Watering",
        notes: "Constantly active if you have a lot of plantations especially skill fruit orchards, otherwise needs secondary skills. Special mention to Jellroy and Jelliette who become the best watering pals once you have access to Applied Technique books due to their partner skills.",
        notablePals: ["CaptainPenguin", "CaptainPenguin_Black", "BlueDragon", "JellyfishGhost", "JellyfishFairy", "GhostAnglerfish"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "planting": {
        title: "Planting",
        notes: "Only used for plantations. Good to also have Gathering or pair with a Gathering pal since plantations need both. Special mention to Prunelia for its strong partner skill.",
        notablePals: ["FlowerDinosaur", "GrassPanda", "GrassRabbitMan", "FlowerDoll", "BlueberryFairy", "LilyQueen", "Plesiosaur", "MushroomDragon_Dark"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "generatingElectricity": {
        title: "Generating Electricity",
        notes: "Has a lot of downtime if used in a main base with all the crafting stations, but will likely be constantly active in an oil base if you have a lot of Oil Extractors. Adjust secondary skills as necessary.",
        notablePals: ["ElecPanda", "ThunderDragonMan", "CaptainPenguin_Black", "GrassPanda_Electric", "HadesBird_Electric"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "handiwork": {
        title: "Handiwork",
        notes: "Only needed when building or crafting, will likely need secondary skills to do other jobs in the base. A lot of pals have this so you'll probably get enough handiwork as you fill the other jobs. You might need higher ranks by the time you start crafting ammo though.",
        notablePals: ["CaptainPenguin", "FoxMage", "Anubis", "GrimGirl", "Baphomet", "CandleGhost", "MushroomDragon_Dark"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "gathering": {
        title: "Gathering",
        notes: "Only used for plantations. Good to also have Planting or pair with a Planting pal since plantations need both. Special mention to Prunelia for its strong partner skill.",
        notablePals: ["CatBat", "RobinHood", "GrassRabbitMan", "FlowerDoll", "BlueberryFairy", "Plesiosaur", "MushroomDragon_Dark"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "lumbering": {
        title: "Lumbering",
        notes: "Only needed for wood, but will be stuck lumbering unless it has skills of a higher priority. Don't expect it to transport anything.",
        notablePals: ["Deer", "FlowerDinosaur", "Ronin", "Yeti", "WhiteDeer", "MushroomDragon_Dark"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "mining": {
        title: "Mining",
        notes: "Needed to mine all the mining sites in the base, but will be stuck mining unless it has skills of a higher priority. Don't expect it to transport anything.",
        notablePals: ["CaptainPenguin", "DrillGame", "VolcanicMonster", "Anubis", "KingBahamut", "BlackMetalDragon", "CandleGhost", "CaptainPenguin_Black", "Baphomet"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "medicineProduction": {
        title: "Medicine Production",
        notes: "Used very minimally due to medicines not being too demanding or necessary. You likely won't need it in the base most of the time so just treat it as an extra secondary skill for pals that focus on other tasks.",
        notablePals: ["CatVampire", "VioletFairy", "BlueberryFairy", "LilyQueen", "NightLady", "RobinHood"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "cooling": {
        title: "Cooling",
        notes: "Lowest priority skill. Be careful with other skills if you need it for the Crusher. You might need to disable other skills sometimes in the Monitoring Stand.",
        notablePals: ["CaptainPenguin", "IceCrocodile", "WhiteTiger", "IceNarwhal", "BirdDragon_Ice"],
        columnTypes: ["pal", "level", "numberOthers", "levelOthers"]
    },
    "transporting": {
        title: "Transporting",
        notes: "Second lowest priority just after Cooling (except for food). Pals with other skills may not have time to transport if you have a lot of other jobs. If you're producing a lot of things you may want dedicated transporters. Focus on high run speed if you have chests beside crafting stations and transport speed if they're far.",
        notablePals: ["FlyingManta", "BirdDragon", "RedArmorBird", "Horus", "YakushimaBoss001", "MimicDog"],
        columnTypes: ["pal", "level", "runSpeed", "transportSpeed"]
    },
    "farming": {
        title: "Farming",
        notes: "Ranch pals will always be in the ranch unless it's full or if there's a building task and they have handiwork. You can pretty much ignore all their other skills.",
        notablePals: [],
        columnTypes: ["pal", "farming"]
    }
}

const styles = {
    headRow: {
        style: {
            backgroundColor: '#1f1f1f',
            color: '#ddd',
            fontSize: "1rem"
        }
    },
    rows: {
        style: {
            backgroundColor: '#1f1f1f',
            color: '#ddd',
            fontSize: "1rem"
        },
        highlightOnHoverStyle: {
            backgroundColor: '#3f3f3f',
            color: '#ddd',
            fontSize: "1rem"
        },
    }
}

function WorkType({ type }) {
    const { title, notes, notablePals, columnTypes } = info[type];
    const data = Object.values(pals).filter(pal => type in pal.workSuitability).sort((a, b) => palIdSortFunc(a.id, b.id));
    const columns = columnTypes.map(col => columnTemplates[col](type));

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "start",
        textAlign: "start",
        width: "100%",
        willChange: "transform",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)"
    }

    return <SnippetContainer title={title} icon={type}>
        <div style={containerStyle}>
            {notes}
            {notablePals.length > 0 ?
                <>
                    <div data-tooltip-id="notablePals" style={{ borderBottom: "1px #aaa dotted" }}>Some notable pals:</div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "0.25rem", justifyContent: "center", textAlign: "center", width: "100%", flexWrap: "wrap" }}>
                        {notablePals.map(palId => <div data-tooltip-id={"palInfocardTooltip"} data-tooltip-content={palId}>
                            <PalIcon id={palId} circle={true} />
                        </div>)}
                    </div>
                </> :
                null
            }
            <div>Pals with this Work Suitability:</div>
            <DataTable
                columns={columns}
                data={data}
                customStyles={styles}
                fixedHeader
                fixedHeaderScrollHeight="300px"
                highlightOnHover
            />
            {type === "transporting" ?
                <span style={{ fontSize: "0.8rem" }}>L = Work Level, RS = Run Speed, TS = Transport Speed</span> :
                type !== "farming" ?
                    <span style={{ fontSize: "0.8rem" }}>L = Work Level, O = Number of Other Work, T = Total Level of Other Work</span> :
                    null
            }
        </div>
    </SnippetContainer>
}

export default WorkType;
