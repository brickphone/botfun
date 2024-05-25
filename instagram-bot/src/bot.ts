import puppeteer, { Page } from "puppeteer";


const username = 'xcoinsfifa';
const password = 'Hurrmas123';


const acceptCookies = async (page: Page) => {
  // Wait for the cookies popup and click "Accept All" if it appears
  try {
    await page.waitForSelector('button', { visible: true, timeout: 5000 });
    
    // Use page.evaluate to handle the cookies popup
    const accepted = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const acceptButton = buttons.find(button => button.textContent?.includes('Allow all cookies') || button.textContent?.includes('Allow'));
      if (acceptButton) {
        acceptButton.click();
        return true;
      }
      return false;
    });

    if (accepted) {
      console.log('Accepted cookies.');
    } else {
      console.log('Cookies popup not found.');
    }
  } catch (error) {
    console.log('No cookies popup found or error occurred:', error);
  }
};


const login = async (page: Page) => {
	console.log("navigating to instagram login page...");
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0' });
	console.log("page fully loaded.")

	await acceptCookies(page);

	await page.waitForSelector('input[name="username"]') 
	await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);

  await page.click('button[type="submit"]');
  await page.waitForNavigation();
}

const initializeBot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  await login(page);

  const postUrl = 'https://www.instagram.com/p/CODE_HERE/';

	console.log("closing")
  await browser.close();
};

initializeBot().catch((error) => {
  console.error('An error occurred:', error);
});
