const puppeteer = require('puppeteer');

let page;

const validateCredentials = async () => {
    const username = process.argv[2];
    const password = process.argv[3];

    if (username === undefined || username.length === 0) {
        throw `Invalid username "${username}"`;
    } else if (password === undefined || password.length === 0) {
        throw `Invalid password "${password}"`;
    }

    return {username, password};
};

const openWodify = async () => {
    const debugArg = (process.argv[4] || "").toLowerCase();
    const debugMode = (debugArg === "debug" || debugArg === "true" || debugArg === "1");
    const launchOpts = {
        headless: true,
        defaultViewport: null
    };

    if(debugMode){
        launchOpts.headless = false;
    }

    const browser = await puppeteer.launch(launchOpts);

    page = await browser.newPage();

    await page.goto('https://app.wodify.com/Schedule/CalendarListView.aspx');
};

const login = async (credentials) => {
    // Wait for the sign in button to be visible
    await page.waitForSelector('button.signin-btn');

    // Fill username
    const usernameInput = await page.$('input#Input_UserName');
    await usernameInput.focus();
    await page.keyboard.type(credentials.username);

    // Fill password
    const passwordInput = await page.$('input#Input_Password');
    await passwordInput.focus();
    await page.keyboard.type(credentials.password);

    const signinBtn = await page.$('button.signin-btn');
    await signinBtn.click();

    await page.waitForNavigation();
};

const selectClass = async () => {
    // Wait for the class select to be visible
    await page.waitForSelector('select#AthleteTheme_wt6_block_wtMainContent_wt9_wt157');

    // Select Box (4421 = CrossFit Alvalade Oriente)
    await page.select('select#AthleteTheme_wt6_block_wtMainContent_wt9_wt156', "4421");

    // Wait until the "Loading" div appears and disappears
    await page.waitForSelector('.Feedback_AjaxWait', { visible: true });
    await page.waitForSelector('.Feedback_AjaxWait', { hidden: true });

    // Select class (39318 = WeightLift)
    await page.select('select#AthleteTheme_wt6_block_wtMainContent_wt9_wt157', "39318");

    // Wait until the "Loading" div appears and disappears
    await page.waitForSelector('.Feedback_AjaxWait', { visible: true });
    await page.waitForSelector('.Feedback_AjaxWait', { hidden: true });
};

const reserveSpot = async () => {
    // Wait for reservation icons to be available
    await page.waitForSelector('a div span svg.icon-calendar', { timeout:1000 });

    //Click on the first reservation link
    const reservationLink = await page.$('a.svgContainer');

    if(!reservationLink){
        return Promise.reject("No available spots for the class :(");
    }

    await reservationLink.click();
};

const onError = async (err) => {
    await page.screenshot({ path: `${process.env.HOME}/wodify-signer-error.png` });
    console.error(err);
};

openWodify()
    .then(validateCredentials)
    .then((credentials) => login(credentials))
    .then(selectClass)
    .then(reserveSpot)
    .catch(onError)
    .finally(() => page.browser().close());
