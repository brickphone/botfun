import puppeteer, { Page } from "puppeteer";


const username = 'xcoinsfifa';
const password = 'Hurrmas123';


const acceptCookies = async (page: Page) => {
  // Wait for the cookies popup and click "Accept All" if it appears
  try {
    await page.waitForSelector('button', { visible: true, timeout: 10000 });
    
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
  

  // Click login button
  const login = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const loginButton = buttons.find(button => button.textContent?.includes('Log in') || button.textContent?.includes('Login'));
    if (loginButton) {
      loginButton.click();
      return true;
    }
    return false;
  });

  if (login) {
    console.log('Accepted cookies.');
  } else {
    console.log('Cookies popup not found.');
  }

  // Click "save login info popup"
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Logged in successfully.');
  } catch (error) {
    console.error('Error waiting for navigation after login:', error);
  }

  // Wait and handle "save login info" popup
  await page.waitForSelector('button', { visible: false, timeout: 5000 });
    const loginInfoPopup = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div[role="button"]'));
      const loginPopupButton = divs.find(div => div.textContent?.includes('Not now') || div.textContent?.includes('Not'));
      if (loginPopupButton) {
        (loginPopupButton as HTMLElement).click();
        return true;
      }
      return false;
    });

  if (loginInfoPopup) {
    console.log("Clicked 'Not now' on login info popup.");
  } else {
    console.log('Login info popup not found.');
  }

  // Clicking "notifications popup"
  await page.waitForSelector('button', { visible: false, timeout: 5000 });
  const ntfBtn = await page.evaluate(() => {
    const ntfButtons = Array.from(document.querySelectorAll('button'));
    const notifyButton = ntfButtons.find(ntfButton => ntfButton.textContent?.includes("Not Now"));
    if (notifyButton) {
      notifyButton.click();
      return true;
    }
    return false;
  });

  if (ntfBtn) {
    console.log("clicked notify button");
  } else {
    console.log('Login info popup not found.');
  }
};

const initializeBot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  await login(page);

  const postUrl = 'https://www.instagram.com/p/CODE_HERE/';

	
};

initializeBot().catch((error) => {
  console.error('An error occurred:', error);
});
