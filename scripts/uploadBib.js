const fs = require("fs");
const bibtexParse = require("bibtex-parser-js");
const axios = require("axios");

const SEMANTIC_SCHOLAR_TIMEOUT = 4 * 1000;

const papers = fs
  .readFileSync("./data/upload.bib", "utf-8")
  .replace(/(\r\n|\n|\r)/gm, "");

try {
  var paperJSON = bibtexParse.toJSON(papers);
} catch (err) {
  paperJSON = [];
}

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
          `http://api.semanticscholar.org/graph/v1/paper/search?query=${paper.entryTags.TITLE}&fields=title,url`
        )
        .then((response) => {
          if (response.data.total > 0) {
            paper.entryTags.url = response.data.data[0].url;
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
