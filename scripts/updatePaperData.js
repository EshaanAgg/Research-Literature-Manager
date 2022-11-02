const fs = require("fs");
const axios = require("axios");
const { parse } = require("json2csv");

const SEMANTIC_SCHOLAR_BASE_URL =
  "https://api.semanticscholar.org/graph/v1/paper/";
const SEMANTIC_SCHOLAR_TIMEOUT = 4 * 1000;

var currentPapers = [];
var updatedPapers = [];

const getCurrentRecords = () => {
  const jsonString = fs.readFileSync("./data/records.json", "utf8");
  var papers = JSON.parse(jsonString);
  currentPapers = papers.papers;
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
  const csvData = parse(updatedPapers, opts);
  fs.writeFileSync("./data/currentPapers.csv", csvData, "utf8");
};

const cleanup = () => {
  console.log("\n\nSaving papers.....\n\n");

  var jsonContent = JSON.stringify({
    papers: updatedPapers,
  });

  fs.writeFileSync("./data/records.json", jsonContent, "utf8");
  fs.writeFileSync(
    "./website/src/assets/data/records.json",
    jsonContent,
    "utf8"
  );
  updateCSV();
};

const addPapers = () => {
  currentPapers.forEach((paper, index) => {
    setTimeout(() => {
      console.log(`Processing paper number ${index + 1}`);
      axios
        .get(SEMANTIC_SCHOLAR_BASE_URL + paper.id, {
          params: {
            fields:
              "referenceCount,citationCount,influentialCitationCount,citations,references",
          },
        })
        .then((response) => {
          var rec = paper;
          rec.referenceCount = response.data.referenceCount;
          rec.citationCount = response.data.citationCount;
          rec.influencialCitationCount = response.data.influencialCitationCount;
          rec.citations = response.data.citations;
          rec.references = response.data.references;
          updatedPapers.push(rec);
          console.log("Paper details fetched successfully.\n");
        })
        .catch((_) => {
          console.log("This paper does not exist in Semantic Scholar.\n");
        });
    }, SEMANTIC_SCHOLAR_TIMEOUT * index);
  });

  setTimeout(cleanup, SEMANTIC_SCHOLAR_TIMEOUT * (5 + currentPapers.length));
};

const controlFunction = async () => {
  getCurrentRecords();
  addPapers();
};

controlFunction();
