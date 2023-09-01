import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

import puppeteer from "puppeteer";

const scrapeTable = async (desiredOffset) => {
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
      const findAnchors = await page.evaluate(() => {
        const tableRows = Array.from(document.getElementsByTagName("tr"));

        //skip first row since it's the header
        const dataRows = tableRows.slice(1);

        const riderInfo = dataRows.map((rider) => {
          //map through and find the first anchor since it has the href i need
          // const tdElements = rider.querySelectorAll("td");
          // const spanElement = rider.querySelectorAll("span");
          const aElement = rider.querySelector("a"); // Use querySelector to get the first 'a' element
          const href = aElement.getAttribute("href"); // Get the 'href' attribute of the 'a' element

          return {
            // ranking: tdElements[0].textContent.trim() || "",
            // nationality: spanElement[1].className,
            // riderName: aElements[0].textContent.trim() || "",
            name: `https://www.procyclingstats.com/${href}`,
            // team: tdElements[4].textContent.trim() || "",
            // points: aElements[1].textContent.trim() || "",
          };
        });

        return riderInfo;
      });
      //add riders to the array and increase the offset to trigger new page load
      riderData.push(...findAnchors);
      currentOffset += 100;
    }

    await browser.close();
    return riderData;
  } catch (err) {
    console.log(err);
  }
};

// call scrapedData and get the result
(async () => {
  try {
    // const riderUrlsToScrape = await scrapeTable(0);
    // console.log(riderUrlsToScrape)
    // const data = await scrapeURLS(riderUrlsToScrape);
  } catch (error) {
    console.error("Error:", error);
  }
})();

const scrapeURLS = async (riderUrlsToScrape) => {
  //set up puppeteer

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    //initiate variable
    let cyclists = [];

    //for of loop to set up iteration over urls
    for (let url of riderUrlsToScrape) {
      // console.log(url);
      const individualURL = url.name;
      await page.goto(individualURL);

      const findData = await page.evaluate(() => {
        const h1Element = document.querySelector("h1");
        const nationality = document
          .querySelector(".rdr-info-cont .flag")
          .getAttribute("class")
          .split(" ")[2];
        const nationalityName = document.querySelector(
          ".rdr-info-cont .black"
        ).textContent;
        // const oneDayRaces = document
        //   .querySelector('.title a:contains("One day races")')
        //   .previousSibling.textContent.trim();
        // const gc = document
        //   .querySelector('.title a:contains("GC")')
        //   .previousSibling.textContent.trim();
        const imageSrc = document
          .querySelector(".rdr-img-cont img")
          .getAttribute("src");
        return {
          name: h1Element.textContent,
          nationality,
          nationalityName,
          // oneDayRaces,
          // gc,
          imageSrc,
        };
      });
      cyclists.push(findData);
      console.log(cyclists);
    }
    await browser.close();

    return cyclists;
  } catch (err) {
    console.log(err);
  }
};

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
