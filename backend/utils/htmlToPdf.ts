import puppeteer from "puppeteer";
import { buildHTML } from "../templates/deckTemplate";

export async function generatePDF(slides: { title: string; content: string }[]) {
  const html = buildHTML(slides);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1280,
      height: 1024
    },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--font-render-hinting=none",
      "--disable-web-security",
      "--disable-gpu",
      "--disable-dev-shm-usage"
    ]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm"
    }
  });

  await browser.close();
  return pdfBuffer;
}
