import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.error(`[PAGE ERROR] ${err.message}`));

  console.log("Navigating to http://localhost:9999...");
  await page.goto("http://localhost:9999", { waitUntil: "networkidle" });
  
  console.log("Waiting 3s to let React mount...");
  await page.waitForTimeout(3000);
  
  const rootHtml = await page.evaluate(() => document.getElementById("root")?.innerHTML);
  console.log("[ROOT HTML LENGTH]:", rootHtml?.length);
  
  await browser.close();
})();
