import Cyclist from "../models/Cyclist.js";
import puppeteer from "puppeteer";


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
          const team = tdElements[4].textContent.trim() || "";
          const points = tdElements[5].textContent.trim();
          return {
            name: `https://www.procyclingstats.com/${href}`,
            team,
            points,
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
// (async () => {
//   try {
//     const riderUrlsToScrape = await scrapeTable(600);
//     // console.log(riderUrlsToScrape)
//     const data = await scrapeURLS(riderUrlsToScrape);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();

//scrapes the urls grabbed from the scrapeTable function
export const scrapeURLS = async (riderUrlsToScrape) => {
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
      const team = url.team || "Free Agent";
      const points = url.points || 0;

      //open puppeteer
      await page.goto(individualURL);

      const findData = await page.evaluate(
        (team, points) => {
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

          // Determine the highest-scoring specialty
          let mainSpecialty = "n/a";
          let highestPoints = 0;

          riderSpecialties.forEach((specialtyData) => {
            if (specialtyData.points > highestPoints) {
              highestPoints = specialtyData.points;
              mainSpecialty = specialtyData.specialty;
            }
          });

          // If "GC" is the highest-scoring specialty, find the second highest-scoring specialty
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
        points
      );
      //push each cyclist to a list
      cyclists.push(findData);

      console.log(cyclists);

      // Create an instance of the Cyclist model
      const newCyclist = new Cyclist({
        name: findData.name || "none",
        team: findData.team || "none",
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

export default { scrapeTable, scrapeURLS };
