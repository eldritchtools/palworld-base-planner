function migrateProfile(profile = {}) {
    let latestVersion = "latestVersion" in profile ? profile.latestVersion : 0;
    let migratedProfile = { ...profile };
    if (latestVersion < 1) {
        migratedProfile["bases"] = [];
        migratedProfile["maxBases"] = 4;
        migratedProfile["maxPals"] = 15;
        migratedProfile["plannerLayout"] = "Horizontal";
        migratedProfile["shownValues"] = "Current Only";
        migratedProfile["latestVersion"] = 1;
    }
    return migratedProfile;
}

export default migrateProfile;