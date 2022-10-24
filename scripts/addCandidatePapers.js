const fs = require("fs");
const axios = require("axios");
const { parse } = require("json2csv");
const MultiSet = require("mnemonist/multi-set");

const NUMBER_OF_CANDIDATE_PAPERS_TO_FETCH = 200;

const SEMANTIC_SCHOLAR_BASE_URL =
  "https://api.semanticscholar.org/graph/v1/paper/";
const SEMANTIC_SCHOLAR_TIMEOUT = 4 * 1000;

function compare(a, b) {
  if (a.frequency < b.frequency) return 1;
  else return -1;
}

const updateJSON = (papers) => {
  var jsonContent = JSON.stringify({
    papers: papers,
  });

  fs.writeFileSync(
    "./data/candidateRecords.json",
    jsonContent,
    "utf8",
    (err) => {
      if (err) throw new Error("Could not write data to records.json");
      console.log("Updated candidateRecords.json sucessfully.");
    }
  );
  fs.writeFileSync(
    "./website/src/assets/data/candidateRecords.json",
    jsonContent,
    "utf-8"
  );
};

const updateCSV = (papers) => {
  const fields = [
    "id",
    "score",
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
  const csvData = parse(papers, opts);
  fs.writeFileSync("./data/candidatePapers.csv", csvData, "utf8");
  console.log("Wrote papers successfully.");
};

const getCandidatePapers = async () => {
  fs.readFile("./data/records.json", "utf8", async (err, jsonString) => {
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
      // To filter out the 'null' key
      if (key) {
        res.push({
          id: key,
          paperLink: "https://www.semanticscholar.org/paper/" + key,
          frequency: count,
        });
      }
    });
    res.sort(compare);
    console.log("Ranked papers successfully.\n");

    papersToAdd = [];

    for (
      let i = 0;
      i < Math.min(NUMBER_OF_CANDIDATE_PAPERS_TO_FETCH, res.length);
      i++
    ) {
      setTimeout(() => {
        console.log("Processing paper number " + (i + 1));
        var rec = {};
        var authors = [];
        axios
          .get(
            SEMANTIC_SCHOLAR_BASE_URL +
              "URL:https://www.semanticscholar.org/paper/" +
              res[i].id,
            {
              params: {
                fields:
                  "paperId,url,referenceCount,citationCount,influentialCitationCount,title,tldr,authors,venue,year",
              },
            }
          )
          .then((response) => {
            rec.id = response.data.paperId;
            rec.url = response.data.url;
            rec.citationCount = response.data.citationCount;
            rec.influentialCitationCount =
              response.data.influentialCitationCount;
            rec.referenceCount = response.data.referenceCount;
            rec.summary = response.data.tldr.text;
            rec.title = response.data.title;
            rec.venue = response.data.venue;
            rec.year = response.data.year;
            response.data.authors.forEach((obj) => authors.push(obj.name));
            rec.authors = String(authors);
            rec.score = res[i].frequency;
            papersToAdd.push(rec);
            console.log("Processed successfully.\n");
          });
      }, SEMANTIC_SCHOLAR_TIMEOUT * i);
    }

    setTimeout(() => {
      updateCSV(papersToAdd);
      updateJSON(papersToAdd);
    }, SEMANTIC_SCHOLAR_TIMEOUT * (5 + Math.min(NUMBER_OF_CANDIDATE_PAPERS_TO_FETCH, res.length)));
  });
};

getCandidatePapers();
