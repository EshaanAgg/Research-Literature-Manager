const fs = require("fs");
const { parse } = require("json2csv");
const MultiSet = require("mnemonist/multi-set");

const NUMBER_OF_CANDIDATE_PAPERS_TO_FETCH = 200;

function compare(a, b) {
  if (a.frequency < b.frequency) return 1;
  else return -1;
}

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
    "paperLink",
  ];
  const opts = { fields };
  const csvData = parse(papers, opts);
  fs.writeFileSync("./data/currentPapers.csv", csvData, "utf8");
  console.log("Wrote papers successfully.");
};

const fetchPaper = async (paperId) => {
  var rec = {};
  var authors = [];
  var response = await axios.get(
    SEMANTIC_SCHOLAR_BASE_URL +
      "URL:https://www.semanticscholar.org/paper/" +
      paperId,
    {
      params: {
        fields:
          "paperId,url,referenceCount,citationCount,influentialCitationCount,title,tldr,authors,venue,year",
      },
    }
  );
  rec.id = response.data.paperId;
  rec.url = response.data.url;
  rec.citationCount = response.data.citationCount;
  rec.influentialCitationCount = response.data.influentialCitationCount;
  rec.referenceCount = response.data.referenceCount;
  rec.summary = response.data.tldr.text;
  rec.title = response.data.title;
  rec.venue = response.data.venue;
  rec.year = response.data.year;
  response.data.authors.forEach((obj) => authors.push(obj.name));
  rec.authors = String(authors);
  return rec;
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
      res.push({
        id: key,
        paperLink: "https://www.semanticscholar.org/paper/" + key,
        frequency: count,
      });
    });
    res.sort(compare);
    console.log("Ranked papers successfully.");

    papersToAdd = [];

    for (
      var i = 0;
      i < Math.min(NUMBER_OF_CANDIDATE_PAPERS_TO_FETCH, res.length);
      i++
    ) {
      console.log("Processing paper number " + (i + 1));
      var obj = await fetchPaper(res[i].id);
      obj.paperLink = res[i].paperLink;
      obj.score = res[i].frequency;
      papersToAdd.push(res);
      console.log("Processed successfully.\n");
    }

    updateCSV(papersToAdd);
  });
};

getCandidatePapers();
