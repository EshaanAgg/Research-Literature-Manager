const fs = require("fs");
const { parse } = require("json2csv");
const MultiSet = require("mnemonist/multi-set");

function compare(a, b) {
  if (a.frequency < b.frequency) return 1;
  else return -1;
}

const updateCSV = (res) => {
  const fields = ["paperLink", "frequency"];
  const opts = { fields };
  const csvData = parse(res, opts);
  fs.writeFileSync("./data/candidatePapers.csv", csvData, "utf8");
};

const getCandidatePapers = () => {
  fs.readFile("./data/records.json", "utf8", (err, jsonString) => {
    if (err) {
      throw new Error("Error reading file : records.json");
    }

    var orgPapers = JSON.parse(jsonString).papers;
    var paperIDs = MultiSet.from([]);

    orgPapers.forEach((paper) => {
      paper.citations.forEach((citation) => paperIDs.add(citation.paperId));
      paper.references.forEach((reference) => paperIDs.add(reference.paperId));
    });

    orgPapers.forEach((ele) => paperIDs.delete(ele.id));

    var res = [];
    paperIDs.forEachMultiplicity(function (count, key) {
      res.push({
        paperLink: "https://www.semanticscholar.org/paper/" + key,
        frequency: count,
      });
    });
    res.sort(compare);
    updateCSV(res);
  });
};

getCandidatePapers();
