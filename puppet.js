import puppeteer from 'puppeteer';

export { args, test };

const args = {
    button: '',
    input: ''
};

async function test(url) {
    const button = args.button;
    const input = args.input;
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox'
        ]
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(input);
    await page.waitForSelector(button);
    await page.click(button);
    const result = await page.$eval(input, (el) => el.value);

    return result;
}