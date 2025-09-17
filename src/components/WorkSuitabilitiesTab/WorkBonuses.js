import { PassiveComponent } from "@eldritchtools/palworld-shared-library";
import { WorkIcon } from "../workSuitabilities";
import SnippetContainer from "./SnippetContainer";

function WorkBonuses() {
    return <SnippetContainer title={"Work Speed"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "start", textAlign: "start", width: "100%" }}>
            There are numerous ways to increase the work speed of the pals in your base.
            <ol>
                <li><b>Work Suitability</b> is the primary way to increase your pals' work speed with higher levels having better speed. 
                <WorkIcon id={"kindling"}/>Kindling, <WorkIcon id={"handiwork"}/>Handiwork, and <WorkIcon id={"medicineProduction"} />Medicine Production roughly triple in speed per level, 
                while <WorkIcon id={"watering"}/>Watering, <WorkIcon id={"planting"}/>Planting, <WorkIcon id={"gathering"}/>Gathering, <WorkIcon id={"generatingElectricity"}/>Generating Electricity,
                <WorkIcon id={"lumbering"}/>Lumbering, <WorkIcon id={"mining"}/>Mining, and <WorkIcon id={"cooling"}/>Cooling all roughly double in speed per level. Additionally,
                <WorkIcon id={"gathering"}/>Gathering levels increase crop yield, <WorkIcon id={"transporting"}/>Transporting levels increase the amount of items carried at a time, and <WorkIcon id={"farming"}/>Farming levels increase the average yield of the pal.
                Work Suitability can be increased by maxing out the condensation level of the pal, which increases all of its suitabilities by 1 level each, or by using Applied Technique books which increases a pal's work suitability on the type of book used by one level.</li>
                <li><b>Passives</b> are the next main way of increasing a pal's work speed. Namely getting the following four passives on your pals via catching, breeding, and/or using the surgery table:<br/>
                    <div style={{display: "flex"}}>
                        <PassiveComponent name={"Remarkable Craftsmanship"}/>
                        <PassiveComponent name={"Artisan"}/>
                        <PassiveComponent name={"Work Slave"}/>
                        <PassiveComponent name={"Serious"}/>
                    </div>
                    These four passives put together give a 175% work speed boost in total. You may also want to replace Serious for Nocturnal on pals that are not naturally nocturnal to allow them to work during the night.
                </li>
                <li><b>Food</b> that have work speed bonus such as salad give another 30% bonus. The ingredients can easily be automated with plantations in the base.</li>
                <li><b>Enhancing</b> the pal with pal souls in a Statue of Power can increase their work speed by up to 60%.</li>
                <li><b>Research</b> in the Pal Labor Research Laboratory gives up to 35% bonus to each work type except Cooling which only goes up to 30%.</li>
                <li><b>Crafting Stations</b> also provide speed bonuses with the highest tier of Assembly Lines giving up to 6x speed compared to the initial workbench. There are bonuses for other work types such as ovens/furnaces for Kindling, the large generator for Electricity Generation, and so on.</li>
                <li><b>Base Buildings</b> like the Large Toolbox and Mining Wagon give another 20% bonus to their respective work types, but have to be researched first. Beta Wave Generator gives an additional 10% to all work types.</li>
                <li><b>Work Modes</b> in the Monitoring Stand can give you additional work speed at the cost of more sanity and hunger.</li>
                <li><b>Condensation Levels</b> on your pals increase their work speed according to the UI. This seems to be bugged and does not actually reflect in-game, but it may be fixed in the future.</li>
            </ol>
        </div>
    </SnippetContainer>
}

export default WorkBonuses;
