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
      const url = `https://www.procyclingstats.com/rankings.php?date=2022-08-29&nation=&age=&zage=&page=smallerorequal&team=&offset=${currentOffset}&teamlevel=&filter=Filter&p=me&s=uci-individual`;
      await page.goto(url);

      //grab rider info from the tr elements
      const findAnchors = await page.evaluate(() => {
        const tableRows = Array.from(document.getElementsByTagName("tr"));

        //skip first row since it's the header
        const dataRows = tableRows.slice(1);

        const riderInfo = dataRows.map((rider) => {
          //map through and find the team name and first anchor since it has the href i need
          const tdElements = rider.querySelectorAll("td");
          const aElement = rider.querySelector("a"); // Use querySelector to get the first 'a' element
          const href = aElement.getAttribute("href"); // Get the 'href' attribute of the 'a' element
          const team = tdElements[4].textContent.trim() || "";
          return {
            name: `https://www.procyclingstats.com/${href}`,
            team,
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
    // // console.log(riderUrlsToScrape)
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
      const individualURL = url.name;
      const team = url.team || ''
    
      
      await page.goto(individualURL);

      const findData = await page.evaluate((team) => {
        //rider name
        const name = document.querySelector("h1").textContent.trim();

        //classname for flags
        const nationality = document
          .querySelector(".rdr-info-cont .flag")
          .getAttribute("class");
        // .split(" ")[2];

        //from what country
        const nationalityName = document
          .querySelector(".rdr-info-cont .black")
          .textContent.trim();
        //grab the image
        const imageSrc = document
          .querySelector(".rdr-img-cont img")
          .getAttribute("src");

        //grab a list of rider specialties, return as an object
        const pointsPerSpecialtyDiv = Array.from(
          document.querySelectorAll(".pps li")
        );

        const riderSpecialties = pointsPerSpecialtyDiv.map((rider) => {
          const points = Number(rider.querySelector(".pnt").textContent.trim());
          const specialty = rider.querySelector(".title a").textContent.trim();

          return { points, specialty };
        });

        //grab total UCI points
        const uciPoints = document.querySelector(".rnk").textContent.trim();
        

        return {
          name,
          team,
          nationality,
          nationalityName,
          riderSpecialties,
          imageSrc,
          uciPoints,
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
