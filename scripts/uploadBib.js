const fs = require("fs");
const axios = require("axios");
const bibtexParse = require("bibtex-parse");

const SEMANTIC_SCHOLAR_TIMEOUT = 4 * 1000;

console.log("Reading upload.bib...");
const papers = fs
  .readFileSync("./data/upload.bib", "utf-8")
  .replace(/(\r\n|\n|\r)/gm, "");
console.log("Read upload.bib in memory.");

let paperJSON;
console.log("Parsing the papers from the bib file. ");

try {
  paperJSON = bibtexParse.entries(papers);
} catch (err) {
  console.log("ERROR...");
  console.log(err);
  paperJSON = [];
}
console.log("Parsed all the papers.");
console.log(`Number of papers found: ${paperJSON.length}`);

const cleanup = () => {
  var jsonContent = JSON.stringify({
    papers: paperJSON,
  });

  fs.writeFileSync("./data/bibUpload.json", jsonContent, "utf8");
  fs.writeFileSync(
    "./website/src/assets/data/bibUpload.json",
    jsonContent,
    "utf8"
  );
};

const fetchLinks = async () => {
  let updatedPapers = [];
  paperJSON.forEach((paper, index) => {
    setTimeout(function () {
      console.log(`Processing paper number ${index + 1}`);
      axios
        .get(
          `http://api.semanticscholar.org/graph/v1/paper/search?query=${paper.TITLE}&fields=title,url`
        )
        .then((response) => {
          if (response.data.total > 0) {
            paper.url = response.data.data[0].url;
            updatedPapers.push(paper);
          }
        });
    }, SEMANTIC_SCHOLAR_TIMEOUT * index);
  });
  setTimeout(function () {
    paperJSON = updatedPapers;
    cleanup();
  }, SEMANTIC_SCHOLAR_TIMEOUT * (paperJSON.length + 5));
};

fetchLinks();
