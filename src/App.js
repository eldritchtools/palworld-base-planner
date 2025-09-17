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

const tooltipNormalStyle = { ...tooltipStyle, fontWeight: "normal" };

function App() {
    return <ProfileProvider dbName={"palworld-base-planner"} migrateProfile={migrateProfile}>
        <div className="App">
            <div style={{ height: "100vh" }} >
                <Header title={"Palworld Base Planner"} lastUpdated={process.env.REACT_APP_LAST_UPDATED} />
                <div className="App-content">
                    <Tabs className="tabs" selectedTabClassName="selected-tab" selectedTabPanelClassName="selected-tab-panel">
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
                        </TabList>

                        <TabPanel className="tab-panel"><BasePlanningTab /></TabPanel>
                        <TabPanel className="tab-panel"><WorkSuitabilitiesTab /></TabPanel>
                        <TabPanel className="tab-panel"><SettingsProfilesTab /></TabPanel>
                    </Tabs>
                </div>
                <Tooltip id={"tabTooltip"} style={tooltipNormalStyle} />
                <Tooltip id={"palInfocardTooltip"} style={tooltipStyle} getTooltipContainer={() => document.body} render={({ content }) => <PalInfoCard pal={pals[content]} />} />
            </div>
            <Footer
                description={"This site is a fan-made web tool built to help with base planning for Palworld players."}
                gameName={"Palworld"}
                developerName={"Pocketpair"}
                githubLink={"https://github.com/eldritchtools/palworld-base-planner"}
            />
        </div>
    </ProfileProvider>;
}

export default App;