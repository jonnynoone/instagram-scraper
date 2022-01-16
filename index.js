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

        // Scrape data
        let user = 'vaporwavepalace';
        let details = await instagram.getUserDetails(user);
        let posts = await instagram.getPosts(user);

        // Log output
        console.log(details);
        console.log(posts);
        console.log(`Number of posts scraped: ${posts.length}`);
        
        // Download images
        await instagram.downloadImages(posts, user);

        // Kill scraper
        await instagram.end();
    }
})();