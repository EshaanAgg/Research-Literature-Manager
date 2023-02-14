const NUMBER_OF_CANDIDATE_PAPERS_TO_FETCH = 200;

const fs = require("fs");
const axios = require("axios");
const { parse } = require("json2csv");
const MultiSet = require("mnemonist/multi-set");

const SEMANTIC_SCHOLAR_BASE_URL =
  "https://api.semanticscholar.org/graph/v1/paper/";
const SEMANTIC_SCHOLAR_TIMEOUT = 4 * 1000;

function compare(a, b) {
  if (a.frequency < b.frequency) return 1;
  else return -1;
}

const formatDate = (date) => {
  if (date == "" || date === null) return date;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const updateJSON = (papers) => {
  var jsonContent = JSON.stringify({
    papers: papers,
  });

  fs.writeFileSync("./data/candidateRecords.json", jsonContent, "utf8");
  fs.writeFileSync(
    "./website/src/assets/data/candidateRecords.json",
    jsonContent,
    "utf-8"
  );
};

const updateCSV = (papers) => {
  const fields = [
    "id",
    "url",
    "score",
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
  const csvData = parse(papers, opts);
  fs.writeFileSync("./data/candidatePapers.csv", csvData, "utf8");
  console.log("Wrote papers successfully.");
};

const getCandidatePapers = async () => {
  const jsonString = fs.readFileSync("./data/records.json", "utf8");
  var orgPapers = JSON.parse(jsonString).papers;
  var paperIDs = MultiSet.from([]);

  orgPapers.forEach((paper) => {
    paper.citations.forEach((citation) => paperIDs.add(citation.paperId));
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
      axios
        .get(
          SEMANTIC_SCHOLAR_BASE_URL +
            "URL:https://www.semanticscholar.org/paper/" +
            res[i].id,
          {
            params: {
              fields:
                "paperId,url,referenceCount,citationCount,influentialCitationCount,title,tldr,authors,venue,year,publicationDate",
            },
          }
        )
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
};

getCandidatePapers();
