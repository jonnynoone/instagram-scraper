const fs = require('fs');
const instagram = require('./instagram');

const CONFIG = JSON.parse(fs.readFileSync('./config.json'));
const EMAIL = CONFIG.email;
const PASSWORD = CONFIG.password;

(async () => {
    await instagram.initialize();
    let loggedIn = await instagram.login(EMAIL, PASSWORD);

    if (loggedIn) {
        console.log('Successfully logged in...')

        // Kill scraper
        // await instagram.end();
    }
})();