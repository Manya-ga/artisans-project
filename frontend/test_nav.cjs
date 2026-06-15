const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message + '\n' + err.stack);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE ERROR: ' + msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');

  console.log('Clicking Cart icon...');
  await page.click('button[data-cart-icon]');
  
  await page.waitForTimeout(2000);
  
  if (errors.length > 0) {
    console.log('ERRORS FOUND:');
    console.log(errors.join('\n\n'));
  } else {
    console.log('No errors captured during cart navigation.');
  }

  await browser.close();
})();
