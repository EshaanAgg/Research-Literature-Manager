const fs = require("fs");
const { parse } = require("json2csv");

function compare(a, b) {
  if (a.score < b.score) return 1;
  else return -1;
}

var allPapers = [];

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
    "score",
  ];
  const opts = { fields };
  const csvData = parse(allPapers, opts);
  fs.writeFileSync("./data/candidatePapers.csv", csvData, "utf8");
};

const getCandidatePapers = () => {
  fs.readFile("./data/records.json", "utf8", (err, jsonString) => {
    if (err) {
      throw new Error("Error reading file : records.json");
    }

    allPapers = JSON.parse(jsonString).papers;
    var allPaperIDs = [];
    allPapers.forEach((page) => allPaperIDs.push(paper.id));

    allPapers.forEach((paper) => {
      var citationScore = 0;
      var referenceScore = 0;
      paper.citations.forEach((citation) => {
        if (allPaperIDs.includes(citation.paperId)) citationScore += 1;
      });
      paper.references.forEach((reference) => {
        if (allPaperIDs.includes(reference.paperId)) referenceScore += 1;
      });
      paper.score =
        citationScore / paper.citationCount +
        referenceScore / paper.referenceCount;
    });

    allPapers.sort(compare);
    updateCSV();
  });
};

getCandidatePapers();
