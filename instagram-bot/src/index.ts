import puppeteer, { Page } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { login } from "./helpers/login";
import fs from "fs";
import path from "path";

// avoids detection
puppeteer.use(StealthPlugin());

const initializeBot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  // Login in
  await login(page);

  const postUrl = 'https://www.instagram.com/p/C7Y-_7BtQs5';
  await page.goto(postUrl, { waitUntil: 'networkidle0' });
  console.log("Post loaded");

  await browser.close();
};

initializeBot().catch((error) => {
  console.error('An error occurred:', error);
});
