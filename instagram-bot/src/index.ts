import puppeteer from "puppeteer-extra";
import { Page } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AnonymizeUA from "puppeteer-extra-plugin-stealth";
import { login } from "./helpers/login";
import fs from "fs";
import path from "path";


const likeComment = async (page: Page, username: string) => {
    // Wait for the comments to load
    await page.waitForSelector(".x78zum5.xdt5ytf.x1iyjqo2");

    // Use page.evaluate to find the comment and like button
    const liked = await page.evaluate((username) => {
      // Locate the specific comment by the user's text
      const commentXPath = `//span[text()='${username}']/ancestor::div[contains(@class, 'x1iyjqo2')]`;
      const commentElement = document.evaluate(
        commentXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (commentElement instanceof Element) {
        // Locate the like button within the comment's parent element
        const likeButton = commentElement.querySelector('svg[aria-label="Like"]');
        if (likeButton) {
          (likeButton as HTMLElement).click();
          return true;
        }
      }
      return false;
    }, username);

    if (liked) {
      console.log(`Liked comment by: "${username}"`);
    } else {
      console.log(`Like button not found for comment by: "${username}"`);
    }
};


// avoids detection
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUA());


const initializeBot = async () => {
  // Parsing accounts
  const accountsPath = path.join(__dirname, 'data', 'accounts.json');
  const accountsData = fs.readFileSync(accountsPath, 'utf-8');
  const accounts = JSON.parse(accountsData);
  
  // randomize user agent
  function getRandomUserAgent() {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
      "Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1",
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  };

  // randomize viewport
  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // logging into all accounts
  await Promise.all(accounts.map(async (account: { username: string; password: string; }) => {
    
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath(),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--user-agent=${getRandomUserAgent()}`,
        '--proxy-server=38.154.227.167:5868',
      ],
      defaultViewport: {
        width: getRandomInt(1280, 1920),
        height: getRandomInt(720, 1080),
      }
    });

    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.authenticate({
      username: 'yelqohab',
      password: 'mregt3cbowd3',
    });

    console.log(`Logging in with account: ${account.username}`);

    // Login with the current account
    await login(page, account.username, account.password);

    // Perform actions for the logged-in account
    const postUrl = 'https://www.instagram.com/p/C7Y-_7BtQs5';
    await page.goto(postUrl, { waitUntil: 'networkidle0' });
    console.log("Post loaded");

    // Like comment
    likeComment(page, 'voiceoverydotcom');

    // Close the context after actions are done to ensure sessions are isolated
  }));

  console.log("Exiting.");
};


initializeBot().catch((error) => {
  console.error('An error occurred:', error);
});
