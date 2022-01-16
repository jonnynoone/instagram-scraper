const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

const BASE_URL = 'https://www.instagram.com/';
const LOGIN_URL = 'https://www.instagram.com/accounts/login/';
const USER_URL = (username) => BASE_URL + username + '/';

let browser = null;
let page = null;

const instagram = {
    initialize: async () => {
        browser = await puppeteer.launch({
            headless: false
        });

        page = await browser.newPage();
        page.setViewport({
            width: 1400,
            height: 1000
        });
    },

    login: async (username, password) => {
        // Navigate to login page
        await page.goto(LOGIN_URL);

        // Close cookie overlay
        await page.click('[role="dialog"] button.bIiDR');
        await page.$eval('.RnEpo.Yx5HN._4Yzd2', x => x.style.display = 'none');
        await page.waitForTimeout(2000);

        // Complete login form
        await page.type('[name="username"]', username, { delay: 100 });
        await page.type('[name="password"]', password, { delay: 100 });
        await page.click('[type="submit"]');

        // Wait for successful login
        await page.waitForSelector('[data-testid="user-avatar"]', { timeout: 8000 });
        return await page.url() === 'https://www.instagram.com/accounts/onetap/?next=%2F' ? true : false;
    },

    getUserDetails: async (username) => {
        // Navigate to user page
        let url = await page.url();
        if (url !== USER_URL(username)) {
            await page.goto(USER_URL(username));
        }

        // Wait for page load
        await page.waitForSelector('.k9GMp .g47SY');

        console.log('Getting user details...')
        return await page.evaluate(() => {
            const elementExists = (selector, getAttr = false) => {
                if (getAttr) {
                    return document.querySelector(selector) ? document.querySelector(selector).getAttribute('title') : false;
                } else {
                    return document.querySelector(selector) ? document.querySelector(selector).textContent.trim() : false;
                }
            };

            const removeEmojis = (string) => {
                return string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
            };

            // Grab user details
            let username = elementExists('.XBGH5 > h2');
            let displayName = elementExists('.QGPIr > h1');
            let posts = elementExists('.k9GMp .Y8-fY:first-child .g47SY');
            let followers = elementExists(`[href="/${username}/followers/"] > span`, true);
            let following = elementExists(`[href="/${username}/following/"] > span`);
            let description = removeEmojis(elementExists('.QGPIr > span'));
            let website = elementExists('[page_id="profilePage"]');
            
            return { username, displayName, posts, followers, following, description, website };
        });
    },

    end: async () => {
        await browser.close();
    }
}

module.exports = instagram;