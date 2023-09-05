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
(async () => {
  try {
    const riderUrlsToScrape = await scrapeTable(0);
    // console.log(riderUrlsToScrape)
    const data = await scrapeURLS(riderUrlsToScrape);
  } catch (error) {
    console.error("Error:", error);
  }
})();

//scrapes the urls grabbed from the scrapeTable function
const scrapeURLS = async (riderUrlsToScrape) => {
  //set up puppeteer

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    //initiate variable to store data
    let cyclists = [];

    //for of loop to set up iteration over urls
    for (let url of riderUrlsToScrape) {
      //grab values from return of scrapeTable function
      const individualURL = url.name;
      const team = url.team || "";
      const points = url.points;

      //open puppeteer
      await page.goto(individualURL);

      const findData = await page.evaluate(
        (team, points) => {
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
            const points = Number(
              rider.querySelector(".pnt").textContent.trim()
            );
            const specialty = rider
              .querySelector(".title a")
              .textContent.trim();

            return { points, specialty };
          });

          return {
            name,
            team,
            nationality,
            nationalityName,
            riderSpecialties,
            imageSrc,
            yearEndUciPoints: points,
          };
        },
        team,
        points
      );

      //push each cyclist to a list
      cyclists.push(findData);

      console.log(cyclists);
    }
    await browser.close();

    return cyclists;
  } catch (err) {
    console.log(err);
  }
};
