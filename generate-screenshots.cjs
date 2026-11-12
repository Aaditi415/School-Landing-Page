const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const templates = [
  {
    id: "template-1",
    name: "Aurelia Editorial",
    url: "http://127.0.0.1:5500/template-1/index.html",
  },
  {
    id: "template-2",
    name: "Aurelia Inspire",
    url: "http://127.0.0.1:5500/template-2/index.html",
  },
  {
    id: "template-3",
    name: "Aurelia Modern",
    url: "http://127.0.0.1:5500/template-3/index.html",
  },
  {
    id: "template-4",
    name: "Aurelia Creative",
    url: "http://127.0.0.1:5500/template-4/index.html",
  },
];

async function generateScreenshots() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1000,
    },
    deviceScaleFactor: 1,
  });

  const assetsFolder = path.join(__dirname, "assets");

  // Create assets folder if it doesn't exist
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder, { recursive: true });
  }

  for (const template of templates) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });

  try {
    console.log(`Capturing: ${template.name}`);

    await page.goto(template.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(2000);

    const screenshotPath = path.join(
      assetsFolder,
      `${template.id}.jpg`
    );

    const hero = page.locator(".hero");

await hero.waitFor({ state: "visible" });

await hero.screenshot({
  path: screenshotPath,
  type: "jpeg",
  quality: 90
});

    console.log(`Saved: ${screenshotPath}`);

  } catch (error) {
    console.error(`Failed: ${template.name}`, error.message);
  } finally {
    await page.close();
  }
}

  await browser.close();

  console.log("Screenshot generation completed!");
}

generateScreenshots();
