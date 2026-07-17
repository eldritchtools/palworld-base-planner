import './App.css';
import { HashRouter, Link, Routes, Route } from 'react-router-dom';
import BasePlanningTab from './components/BasePlanningTab/BasePlanningTab';
import WorkSuitabilitiesTab from './components/WorkSuitabilitiesTab/WorkSuitabilitiesTab';
import SettingsProfilesTab from './components/SettingsProfilesTab';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './styles';
import { ProfileProvider, Layout, useBreakpoint } from '@eldritchtools/shared-components';
import migrateProfile from './migrateProfile';
import PalInfoCard from './components/PalInfoCard';
import { pals } from '@eldritchtools/palworld-shared-library';

const description = <span>Palworld Base Planner is a free fan-made online tool that helps you decide which Pals to place in your bases. Instead of guesswork, the planner makes it easy to balance work suitability and track the required resources to upgrade your Pals.
    <br /><br />
    Organize your Pals, spot missing work types, get recommendations for base Pals, and discover options you may have overlooked.
    <br /><br />
    The Palworld Base Planner saves time and reduces trial and error. Build well-balanced bases and share your plans with friends or other players with the profiles feature.</span>

function SidebarLink({ href, className, style, onClick, children }) {
    return <Link className={className} style={{ ...style, textAlign: "start" }} to={href} onClick={onClick}>{children}</Link>;
}

const paths = [
    { path: "/base-planning", title: "Base Planning" },
    { path: "/work-suitabilities", title: "Work Suitabilities" },
    { path: "/settings-profiles", title: "Settings and Profiles" },
]

function App() {
    const { isDesktop } = useBreakpoint();

    return <ProfileProvider dbName={"palworld-base-planner"} migrateProfile={migrateProfile}>
        <div className="App">
            <HashRouter>
                <Layout
                    title={"Palworld Base Planner"}
                    lastUpdated={process.env.REACT_APP_LAST_UPDATED}
                    linkSet={"palworld"}
                    description={description}
                    gameName={"Palworld"}
                    developerName={"Pocketpair"}
                    githubLink={"https://github.com/eldritchtools/palworld-base-planner"}
                    paths={paths}
                    LinkComponent={SidebarLink}
                    includeDiscord={false}
                >
                    <div className="App-content">
                        <div style={{ width: isDesktop ? "100%" : "100%" }}>
                            <Routes>
                                <Route path="/" element={<BasePlanningTab />} />
                                <Route path="/base-planning" element={<BasePlanningTab />} />
                                <Route path="/work-suitabilities" element={<WorkSuitabilitiesTab />} />
                                <Route path="/settings-profiles" element={<SettingsProfilesTab />} />
                            </Routes>
                        </div>

                        {/* <Tooltip id={"tabTooltip"} style={tooltipNormalStyle} /> */}
                        <Tooltip id={"palInfocardTooltip"} style={tooltipStyle} getTooltipContainer={() => document.body} render={({ content }) => <PalInfoCard pal={pals[content]} />} />
                    </div>
                </Layout>
            </HashRouter>
        </div>
    </ProfileProvider>;
}

export default App;