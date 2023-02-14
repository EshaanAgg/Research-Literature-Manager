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

const formatDate = (date) => {
  if (date == "" || date === null) return date;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const getCurrentRecords = () => {
  const jsonString = fs.readFileSync("./data/records.json", "utf8");
  var papers = JSON.parse(jsonString);
  currentPapers = papers.papers;
  currentPapers.forEach((paper) => currentPaperIDs.push(paper.id));
};

const updateCSV = () => {
  const fields = [
    "id",
    "url",
    "title",
    "summary",
    "venue",
    "year",
    "authors",
    "citationCount",
    "referenceCount",
    "influentialCitationCount",
  ];
  const opts = { fields };
  const csvData = parse(currentPapers, opts);
  fs.writeFileSync("./data/currentPapers.csv", csvData, "utf8");
};

const cleanup = () => {
  console.log("\n\nSaving papers.....\n\n");

  var jsonContent = JSON.stringify({
    papers: currentPapers,
  });

  fs.writeFileSync("./data/records.json", jsonContent, "utf8");
  fs.writeFileSync(
    "./website/src/assets/data/records.json",
    jsonContent,
    "utf8"
  );

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
        axios
          .get(SEMANTIC_SCHOLAR_BASE_URL + identifier, {
            params: {
              fields:
                "paperId,url,referenceCount,citationCount,influentialCitationCount,title,tldr,authors,venue,year,citations,references,publicationDate",
            },
          })
          .then((response) => {
            var rec = response.data;
            var authors = [];

            rec.id = response.data.paperId;
            if (response.data.tldr) rec.summary = response.data.tldr.text;
            else rec.summary = "";
            response.data.authors.forEach((obj) => authors.push(obj.name));
            rec.authors = String(authors);
            if (rec.publicationDate != "" && rec.publicationDate != null)
              rec.publicationDate = formatDate(rec.publicationDate);
            else rec.publicationDate = rec.year;
            delete rec.paperId;
            delete rec.tldr;

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
