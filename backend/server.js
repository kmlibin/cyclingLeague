import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

import puppeteer from "puppeteer";
const offset = [0, 100, 200, 300, 400, 500];
const url = `https://www.procyclingstats.com/rankings.php?date=2023-08-29&nation=&age=&zage=&page=smallerorequal&team=&offset=0&teamlevel=&filter=Filter&p=me&s=uci-individual`;

const scrapeRiders = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url);
  const riderData = await page.evaluate(() => {
    const riderRows = Array.from(document.getElementsByTagName("tr"));

    const riderInfo = riderRows.map((rider) => {
      const tdElements = rider.querySelectorAll("td");
      const spanElement = rider.querySelector("span.flag");
      const aElements = rider.querySelectorAll("a");

      return {
        ranking: tdElements[0]?.textContent.trim() || "",
        riderName: aElements[0]?.textContent.trim() || "",
        team: tdElements[4]?.textContent.trim() || "",
        points: aElements[1]?.textContent.trim() || "",
      };
    });

    return riderInfo;
  });
  console.log(riderData);
  await browser.close();
};

scrapeRiders();

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("API is up and running...");
});

app.get("/api/riders", (req, res) => {
  res.send("riders");
});

app.get("/api/races", (req, res) => {
  res.send("races");
});

app.listen(port, () => console.log(`server running on port ${port}`));
