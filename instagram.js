const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

const BASE_URL = 'https://www.instagram.com/';
const LOGIN_URL = 'https://www.instagram.com/accounts/login/';

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

    end: async () => {
        await browser.close();
    }
}

module.exports = instagram;