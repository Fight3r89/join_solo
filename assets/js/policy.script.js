async function init() {
    await getUserDataFromSessionStorage();
    if (await checkLoggedIn()) {
        await includeHTML();
        renderUserMenueInizials();
    }
}