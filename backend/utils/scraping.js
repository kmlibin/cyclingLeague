import Cyclist from "../models/Cyclist.js";
import puppeteer from "puppeteer";
import createTeamData from "./aggregations.js";

export const scrapeTable = async (desiredOffset) => {
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
      const url = `https://www.procyclingstats.com/rankings.php?date=2022-12-27&nation=&age=&zage=&page=smallerorequal&team=&offset=${currentOffset}&teamlevel=&filter=Filter&p=me&s=uci-individual`;
      await page.goto(url);

      //grab rider info from the tr elements
      const findAnchors = await page.evaluate(() => {
        const tableRows = Array.from(document.getElementsByTagName("tr"));

        //skip first row since it's the header
        const dataRows = tableRows.slice(1);

        const riderInfo = dataRows.map((rider) => {
          //map through and find the team name and first anchor since it has the href i need
          const tdElements = rider.querySelectorAll("td"); //get all td elements
          const aElement = rider.querySelector("a"); //  get the first 'a' element
          const href = aElement.getAttribute("href"); // get 'href' attribute of the 'a' element
          const rank = tdElements[0].textContent.trim() | "";
          const team = tdElements[4].textContent.trim() || "";
          const points = tdElements[5].textContent.trim();

          // Extract the rider's name from the URL
          const riderName = decodeURIComponent(href.split("/").pop() || "");
          return {
            name: `https://www.procyclingstats.com/${href}`,
            team,
            points,
            rank,
            riderName,
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

//scrapes the urls grabbed from the scrapeTable function
export const scrapeURLS = async (riderUrlsToScrape) => {
  //set up puppeteer

  try {
    await Cyclist.deleteMany({});
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    //initiate variable to store data
    let cyclists = [];

    //for of loop to set up iteration over urls
    for (let url of riderUrlsToScrape) {
      //grab values from return of scrapeTable function
      const individualURL = url.name || "none";
      const team = url.team || "Free Agent";
      const points = url.points || 0;
      const rank = url.rank || 0;

      //open puppeteer
      await page.goto(individualURL);

      const findData = await page.evaluate(
        (team, points, rank) => {
          //rider name
          const name = document.querySelector("h1").textContent.trim();
          //remove extra spaces
          const normalizedName = name.replace(/\s+/g, " ").trim();

          //classname for flags and checking for values
          const nationalityElement = document.querySelector(
            ".rdr-info-cont .flag"
          );
          const nationality =
            nationalityElement?.getAttribute("class") || "n/a";

          //from what country and checking for values
          const nationalityNameElement = document.querySelector(
            ".rdr-info-cont .black"
          );
          const nationalityName =
            nationalityNameElement?.textContent.trim() || "n/a";

          //grab the image and checking for values
          const imageSrc = document.querySelector(".rdr-img-cont img");
          const image = imageSrc?.getAttribute("src") || "n/a";

          const socialMedia = Array.from(
            document.querySelectorAll(".list.horizontal.sites li")
          );

          const socialUrls = socialMedia.map((li) => {
            const aElement = li.querySelector("a");

            const icon = aElement?.textContent.trim() || "n/a";
            const href = aElement?.getAttribute("href") || "n/a";

            return { icon, href };
          });

          //grab a list of rider specialties, return as an object
          const pointsPerSpecialtyDiv = Array.from(
            document.querySelectorAll(".pps li")
          );

          const riderSpecialties = pointsPerSpecialtyDiv?.map((rider) => {
            const points =
              Number(rider.querySelector(".pnt")?.textContent.trim()) || 0;
            const specialty =
              rider.querySelector(".title a")?.textContent.trim() || "n/a";

            return { specialty, points };
          });

          // determine the highest scoring specialty
          let mainSpecialty = "n/a";
          let highestPoints = 0;

          riderSpecialties.forEach((specialtyData) => {
            if (specialtyData.points > highestPoints) {
              highestPoints = specialtyData.points;
              mainSpecialty = specialtyData.specialty;
            }
          });

          // if "GC" is the highest-scoring, find the second highest-scoring specialty
          if (mainSpecialty === "GC") {
            let secondHighestScoringSpecialty = "n/a";
            let secondHighestPoints = 0;

            riderSpecialties.forEach((specialtyData) => {
              const points = specialtyData.points;
              const specialty = specialtyData.specialty;

              if (points > secondHighestPoints && specialty !== "GC") {
                secondHighestPoints = points;
                secondHighestScoringSpecialty = specialty;
              }
            });

            mainSpecialty = secondHighestScoringSpecialty;
          }

          const defaultUser = "/images/defaultUser.png";
          return {
            name: normalizedName,
            team,
            rank,
            nationality,
            nationalityName,
            socialUrls,
            riderSpecialties,
            mainSpecialty,
            imageSrc:
              image === "n/a"
                ? defaultUser
                : `https://www.procyclingstats.com/${image}`,
            yearEndUciPoints: Number(points),
          };
        },
        team,
        points,
        rank
      );
      //push each cyclist to a list
      cyclists.push(findData);
      // console.log(cyclists);

      // Create an instance of the Cyclist model
      const newCyclist = new Cyclist({
        name: findData.name || "none",
        team: findData.team || "none",
        prevYearRank: findData.rank || "none",
        nationality: findData.nationality || "none",
        nationalityName: findData.nationalityName || "none",
        socialUrls: findData.socialUrls || "none",
        riderSpecialties: findData.riderSpecialties || [],
        mainSpecialty: findData.mainSpecialty || "none",
        imageSrc: findData.imageSrc || "none",
        yearEndUciPoints: findData.yearEndUciPoints || 0,
      });

      // Save the instance to the database
      try {
        await newCyclist.save();
        console.log(`Saved ${newCyclist.name} to the database.`);
      } catch (error) {
        console.error(`Error saving ${newCyclist.name}: ${error}`);
      }
    }
    await browser.close();

    return cyclists;
  } catch (err) {
    console.log(err);
  }
  //close mongodb connection
  mongoose.connection.close();
};

export const scrapeAndUpdateRank = async (riderUrlsToScrape) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    for (let url of riderUrlsToScrape) {
      // console.log(url)
      //grab values from return of scrapeTable function
      const rank = url.rank || "";
      const individualURL = url.name || "none";

      //open puppeteer
      await page.goto(individualURL);

      const findData = await page.evaluate((rank) => {
        //rider name
        const name = document.querySelector("h1").textContent.trim();
        //remove extra spaces
        const normalizedName = name.replace(/\s+/g, " ").trim();

        return {
          name: normalizedName,
          rank,
        };
      }, rank);

      const name = findData.name || "none";
      const existingRider = await Cyclist.findOne({ name: name });
      // console.log(existingRider)
      if (existingRider) {
        existingRider.prevYearRank = findData.rank;

        try {
          await existingRider.save();
          console.log(`Updated ${existingRider.name}'s rank in the db`);
        } catch (error) {
          console.log(`Error updating ${existingRider.name} in db: ${error}`);
        }
      }
    }

    console.log("after the loop");
  } catch (error) {
    console.log(error);
  }
};

export const scrapePointsAndRank = async (riderUrlsToScrape) => {
  //set up puppeteer

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    //initiate variable to store data
    let cyclists = [];

    //for of loop to set up iteration over urls
    for (let url of riderUrlsToScrape) {
      //grab values from return of scrapeTable function
      const individualURL = url.name || "none";

      //open puppeteer
      await page.goto(individualURL);

      const findData = await page.evaluate(() => {
        //rider name
        const name = document.querySelector("h1").textContent.trim();
        //remove extra spaces
        const normalizedName = name.replace(/\s+/g, " ").trim();

        let currentRank = "n/a";
        let currentPoints = "n/a";

        // Check if the rankings element exists
        const rankings = document.querySelector(
          ".list.horizontal.rdr-rankings"
        );
        if (rankings) {
          // Get all <li> elements within the rankings element
          const rankingItems = rankings.querySelectorAll("li");
          if (rankingItems.length > 0) {
            // Grab the second div element inside the first li element
            const secondDiv = rankingItems[0].querySelectorAll("div")[1];
            currentRank = secondDiv ? secondDiv.textContent.trim() : "N/A";
          }
        }
        // get uci score
        const rdrResultsSum = document.querySelector(".rdrResultsSum");
        // Find all <b> elements within the <div>
        if(rdrResultsSum) {
          const boldElements = rdrResultsSum.querySelectorAll("b");
          if (boldElements.length >= 3) {
            currentPoints = boldElements[2].textContent.trim();
          }
        }

        return {
          name: normalizedName,
          currentRank: currentRank || "n/a",
          currentPoints: currentPoints || "n/a",
        };
      });

      const name = findData.name || "none";
      const existingRider = await Cyclist.findOne({ name: name });
      // console.log(existingRider)
      if (existingRider) {
        existingRider.currentRank = findData.currentRank;
        existingRider.currentUciPoints = findData.currentPoints;

        try {
          await existingRider.save();
          // console.log(`Updated ${existingRider.name}'s rank in the db`);
        } catch (error) {
          console.log(`Error updating ${existingRider.name} in db: ${error}`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//for initial data scrape, to seed the db, call scrape table, save result
// and send return to scrapeURLS where data is actually saved in db. then run the aggregate function to
//create teams collection and store in db.

export const seedDataBase = async () => {
  try {
    const riderUrlsToScrape = await scrapeTable(800);
    const data = await scrapeURLS(riderUrlsToScrape);
    await createTeamData();
  } catch (error) {
    console.error("Error:", error);
  }
};

// I didn't do year end rank the first time...it should work in the initial seed data now, but if it doesn't here is the func. calls
// scrapeTable again, save the result and then send it to scrapeToUpdateData

export const updateYearEndRank = async () => {
  try {
    const riderUrlsToScrape = await scrapeTable(800);
    console.log("scraping 1 success");
    const updatedNames = await scrapeAndUpdateRank(riderUrlsToScrape);
    console.log("update success");
  } catch (error) {
    console.error("Error:", error);
  }
};

//this is the function that will essentially update cyclists' current ranking, and current uci points.
export const updatePointsAndRank = async () => {
  try {
    const riderUrlsToScrape = await scrapeTable(800);
    console.log("scraping 1 success");
    const updatedNames = await scrapePointsAndRank(riderUrlsToScrape);
    console.log("update success");
  } catch (error) {
    console.error("Error:", error);
  }
};

export default {
  scrapeTable,
  scrapeURLS,
  scrapeAndUpdateRank,
  seedDataBase,
  updateYearEndRank,
  updatePointsAndRank,
};
