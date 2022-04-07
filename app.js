// Importaciones
const puppeteer = require('puppeteer');


async function test() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({headless: false});
  
    console.log('Creating new page...');
    const page = await browser.newPage();
    
    console.log('Requesting url...');
    await page.goto('https://www.youtube.com');

    console.log('Closing browser...');
    await browser.close();
}

test().catch(e=>{console.log(e)});