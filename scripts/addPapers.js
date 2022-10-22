const fs = require("fs");
const axios = require("axios");
const { parse } = require("json2csv");

const SEMANTIC_SCHOLAR_BASE_URL =
  "https://api.semanticscholar.org/graph/v1/paper/";
const SEMANTIC_SCHOLAR_TIMEOUT = 4 * 1000;

const papersToAdd = fs
  .readFileSync("./papersToAdd.txt", "utf-8")
  .split(/\r?\n/);
var currentPapers = [];
var currentPaperIDs = [];
var leftPapers = [];

const getIdentifierFromURL = (url) => {
  if (url == "" || url == null) return null;
  var urlParts = url.split("/");
  var host = urlParts[2];

  if (
    [
      "semanticscholar.org",
      "www.semanticscholar.org",
      "arxiv.org",
      "www.aclweb.org",
      "acm.org",
      "biorxiv.org",
    ].includes(host)
  )
    return `URL:${url}`;
  else if (host == "aclanthology.org" && urlParts.length >= 4)
    return `DOI:10.18653/v1/${urlParts[3]}`;
  else if (host == "dl.acm.org" && urlParts.length >= 6)
    return `DOI:${urlParts[4]}/v1/${urlParts[5]}`;

  return null;
};

const getCurrentRecords = () => {
  fs.readFileSync("./data/records.json", "utf8", (err, jsonString) => {
    if (err) throw new Error("Error reading current records file from disk");
    papers = JSON.parse(jsonString);
    currentPapers = papers.papers;
  });
  currentPapers.forEach((paper) => currentPaperIDs.push(paper.id));
};

const updateCSV = () => {
  const fields = [
    "id",
    "title",
    "summary",
    "venue",
    "year",
    "authors",
    "citationCount",
    "referenceCount",
    "influentialCitationCount",
    "url",
  ];
  const opts = { fields };
  const csvData = parse(currentPapers, opts);
  fs.writeFileSync("./data/currentPapers.csv", csvData, "utf8");
};

const cleanup = () => {
  console.log("\n\nSaving papers.....\n\n");
  // Update records.json
  var jsonContent = JSON.stringify({
    papers: currentPapers,
  });

  fs.writeFileSync("./data/records.json", jsonContent, "utf8", (err) => {
    if (err) throw new Error("Could not write data to records.json");
    console.log("Updated records.json sucessfully.");
  });

  var leftoverPapers = leftPapers.filter((paper) => paper != "");
  if (leftoverPapers.length != 0) {
    console.log("\nThese papers could not be processed:");
    console.log(leftoverPapers);
    console.log("Try supplying different links for these papers.");
  }
  // Update filesToAdd.txt
  fs.writeFileSync("./papersToAdd.txt", leftoverPapers.join("\r\n"), "utf8");

  // Update currentPapers.csv
  updateCSV();
};

const addPapers = () => {
  papersToAdd.forEach((pageLink, index) => {
    setTimeout(() => {
      console.log(`Processing paper number ${index + 1}`);
      var identifier = getIdentifierFromURL(pageLink);

      if (identifier) {
        var rec = {};
        var authors = [];

        axios
          .get(SEMANTIC_SCHOLAR_BASE_URL + identifier, {
            params: {
              fields:
                "paperId,url,referenceCount,citationCount,influentialCitationCount,title,tldr,authors,venue,year,citations,references",
            },
          })
          .then((response) => {
            rec.id = response.data.paperId;
            rec.url = response.data.url;
            rec.citationCount = response.data.citationCount;
            rec.influentialCitationCount =
              response.data.influentialCitationCount;
            rec.referenceCount = response.data.referenceCount;
            rec.citations = response.data.citations;
            rec.references = response.data.references;
            rec.summary = response.data.tldr.text;
            rec.title = response.data.title;
            rec.venue = response.data.venue;
            rec.year = response.data.year;
            response.data.authors.forEach((obj) => authors.push(obj.name));
            rec.authors = String(authors);

            // Add paper to the global list
            if (!currentPaperIDs.includes(rec.id)) {
              currentPaperIDs.push(rec.id);
              currentPapers.push(rec);
            }
            console.log("Paper details fetched successfully.\n");
          })
          .catch((_) => {
            console.log("This paper does not exist in Semantic Scholar.\n");
            leftPapers.push(pageLink);
          });
      } else {
        console.log("This paper does not exist in Semantic Scholar.\n");
        leftPapers.push(pageLink);
      }
    }, SEMANTIC_SCHOLAR_TIMEOUT * index);
  });

  setTimeout(cleanup, SEMANTIC_SCHOLAR_TIMEOUT * (5 + papersToAdd.length));
};

const controlFunction = async () => {
  getCurrentRecords();
  addPapers();
};

controlFunction();
