import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BasePlanningTab from './components/BasePlanningTab/BasePlanningTab';
import WorkSuitabilitiesTab from './components/WorkSuitabilitiesTab/WorkSuitabilitiesTab';
import SettingsProfilesTab from './components/SettingsProfilesTab';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './styles';
import { Header, Footer, ProfileProvider } from '@eldritchtools/shared-components';
import migrateProfile from './migrateProfile';
import PalInfoCard from './components/PalInfoCard';
import { pals } from '@eldritchtools/palworld-shared-library';
import MigrationTab from './components/MigrationTab';

const tooltipNormalStyle = { ...tooltipStyle, fontWeight: "normal" };

const description = <span>Palworld Base Planner is a free fan-made online tool that helps you decide which Pals to place in your bases. Instead of guesswork, the planner makes it easy to balance work suitability and track the required resources to upgrade your Pals.
<br/><br/>
Organize your Pals, spot missing work types, get recommendations for base Pals, and discover options you may have overlooked.
<br/><br/>
The Palworld Base Planner saves time and reduces trial and error. Build well-balanced bases and share your plans with friends or other players with the profiles feature.</span>

function App() {
    return <ProfileProvider dbName={"palworld-base-planner"} migrateProfile={migrateProfile}>
        <div className="App">
            <div style={{ height: "100vh" }} >
                <Header title={"Palworld Base Planner"} lastUpdated={process.env.REACT_APP_LAST_UPDATED} />
                <div className="App-content">
                    <Tabs className="tabs" selectedTabClassName="selected-tab" selectedTabPanelClassName="selected-tab-panel" forceRenderTabPanel>
                        <TabList className="tab-list">
                            <Tab className="tab" data-tooltip-id={"tabTooltip"} data-tooltip-content={"Plan out your base pals"}>
                                Base Planning
                            </Tab>
                            <Tab className="tab" data-tooltip-id={"tabTooltip"} data-tooltip-content={"Some useful info on work suitabilities "}>
                                Work Suitabilities
                            </Tab>
                            <Tab className="tab" data-tooltip-id={"tabTooltip"} data-tooltip-content={"Change settings or switch profiles to better manage your bases"}>
                                Settings and Profiles
                            </Tab>
                            <Tab className="tab" data-tooltip-id={"tabTooltip"} data-tooltip-content={"Details on migration"}>
                                Click here if your data's missing
                            </Tab>
                        </TabList>

                        <TabPanel className="tab-panel"><BasePlanningTab /></TabPanel>
                        <TabPanel className="tab-panel"><WorkSuitabilitiesTab /></TabPanel>
                        <TabPanel className="tab-panel"><SettingsProfilesTab /></TabPanel>
                        <TabPanel className="tab-panel"><MigrationTab /></TabPanel>
                    </Tabs>
                </div>
                <Tooltip id={"tabTooltip"} style={tooltipNormalStyle} />
                <Tooltip id={"palInfocardTooltip"} style={tooltipStyle} getTooltipContainer={() => document.body} render={({ content }) => <PalInfoCard pal={pals[content]} />} />
            </div>
            <Footer
                description={description}
                gameName={"Palworld"}
                developerName={"Pocketpair"}
                githubLink={"https://github.com/eldritchtools/palworld-base-planner"}
            />
        </div>
    </ProfileProvider>;
}

export default App;