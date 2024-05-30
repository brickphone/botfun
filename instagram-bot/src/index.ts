import puppeteer from "puppeteer-extra";
import { Page } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { login } from "./helpers/login";
import fs from "fs";
import path from "path";


const likeComment = async (page: Page) => {
  const commentBox = await page.waitForSelector(".xryxfnj");
  const commentSelector = `xpath=//span[text()='voiceoverydotcom']`;
  console.log("commentBox", commentBox);
  console.log("commentSelector:", commentSelector);
};

// avoids detection
puppeteer.use(StealthPlugin());

const initializeBot = async () => {
  // Parsing accounts
  const accountsPath = path.join(__dirname, 'data', 'accounts.json');
  const accountsData = fs.readFileSync(accountsPath, 'utf-8');
  const accounts = JSON.parse(accountsData);
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath(),
  });

  // logging into all accounts
  await Promise.all(accounts.map(async (account: { username: string; password: string; }) => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    console.log(`Logging in with account: ${account.username}`);

    // Login with the current account
    await login(page, account.username, account.password);

    // Perform actions for the logged-in account
    const postUrl = 'https://www.instagram.com/p/C7Y-_7BtQs5';
    await page.goto(postUrl, { waitUntil: 'networkidle0' });
    console.log("Post loaded");

    // Like comment
    likeComment(page);

    // Close the context after actions are done to ensure sessions are isolated
  }));

  console.log("Exiting.");
};


initializeBot().catch((error) => {
  console.error('An error occurred:', error);
});
