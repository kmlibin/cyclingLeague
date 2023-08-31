import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

import puppeteer from "puppeteer";

const scrapeRiders = async (desiredOffset) => {
  //check for current page, if not start at 0
  try {
    if (!desiredOffset) {
      desiredOffset = 0;
    }
    //load browser and page
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    //init variables that will be changed with each loop
    let currentOffset = 0;
    let riderData = [];

    //riders are limited to 100 per page. loop through and change url so that you can get multiple pages of riders
    while (currentOffset <= desiredOffset) {
      const url = `https://www.procyclingstats.com/rankings.php?date=2023-08-29&nation=&age=&zage=&page=smallerorequal&team=&offset=${currentOffset}&teamlevel=&filter=Filter&p=me&s=uci-individual`;
      await page.goto(url);

      //grab rider info from the tr elements
      const pageRiderData = await page.evaluate(() => {
        const riderRows = Array.from(document.getElementsByTagName("tr"));

        //skip first row since it's the header
        const dataRows = riderRows.slice(1);

        const riderInfo = dataRows.map((rider) => {
          //map through each tr and grab elements
          const tdElements = rider.querySelectorAll("td");
          const spanElement = rider.querySelectorAll("span");
          const aElements = rider.querySelectorAll("a");

          return {
            ranking: tdElements[0].textContent.trim() || "",
            nationality: spanElement[1].className,
            riderName: aElements[0].textContent.trim() || "",
            team: tdElements[4].textContent.trim() || "",
            points: aElements[1].textContent.trim() || "",
          };
        });

        return riderInfo;
      });
      //add riders to the array and increase the offset to trigger new page load
      riderData.push(pageRiderData);
      currentOffset += 100;
    }
    console.log(riderData);
    await browser.close();
  } catch (err) {
    console.log(err);
  }
};
//call
scrapeRiders(100);

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
