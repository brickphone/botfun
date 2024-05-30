import { Page } from "puppeteer";

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));


// Dismissing "bot challenge"
const dismissChallenge = async (page: Page) => {
  try {
    const dismissButtonSelect = '[aria-label="Dismiss"]';
    await page.waitForSelector(dismissButtonSelect, { timeout: 5000 });
    await page.click(dismissButtonSelect);
    console.log("bot challenge clicked.");
  } catch (error) {
    console.log("No challenge found.");
  }
};

// Accepting page cookies
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

export const login = async (page: Page, username: string, password: string) => {
  console.log("Navigating to Instagram login page...");
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0' });
  console.log("Page fully loaded.");

  await acceptCookies(page);

  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);

  // Click login button
  const loginClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const loginButton = buttons.find(button => button.textContent?.includes('Log in') || button.textContent?.includes('Login'));
    if (loginButton) {
      (loginButton as HTMLElement).click();
      return true;
    }
    return false;
  });

  if (loginClicked) {
    console.log('Clicked login button.');
  } else {
    console.log('Login button not found.');
  }

  // Wait for navigation to complete the login process
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Logged in successfully.');
  } catch (error) {
    console.error('Error waiting for navigation after login:', error);
  }

  // Wait and handle "save login info" popup
  try {
    await delay(5000); // Adding a delay to ensure the popup has time to appear
    const loginInfoPopupClicked = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div[role="button"]'));
      const loginPopupButton = divs.find(div => div.textContent?.includes('Not now'));
      if (loginPopupButton) {
        (loginPopupButton as HTMLElement).click();
        return true;
      }
      return false;
    });

    if (loginInfoPopupClicked) {
      console.log("Clicked popup.");
    } else {
      console.log('Login info popup not found.');
    }
  } catch (error) {
    console.log('No login info popup found or error occurred:', error);
  };

  await dismissChallenge(page);

  // Wait and handle "notifications popup"
  try {
    await delay(5000);
    const notificationsPopupClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const notifyButton = buttons.find(button => button.textContent?.includes('Not Now'));
      if (notifyButton) {
        (notifyButton as HTMLElement).click();
        return true;
      }
      return false;
    });

    if (notificationsPopupClicked) {
      console.log("Clicked second popup.");
    } else {
      console.log('Notifications popup not found.');
    }
  } catch (error) {
    console.log('No notifications popup found or error occurred:', error);
  }
};
