<style>
.bottomText {
  padding-top: 6px;
}
.papers-grid {
  width: 100%;
  height: 500px;
  padding-left: 40px;
  padding-right: 40px;
}
.ag-theme-alpine {
  --ag-grid-size: 5px;
  --ag-list-item-height: 20px;
}
.ag-cell-wrap-text {
  word-break: break-word;
}
</style>

<template>
  <div>
    <h1>Current Papers</h1>
    <br />
    <ag-grid-vue
      class="ag-theme-alpine papers-grid"
      :columnDefs="columnDefs.value"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      rowSelection="multiple"
      animateRows="true"
    >
    </ag-grid-vue>
    <div class="bottomText">
      Displaying {{ recordsData.papers.length }} papers
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { onMounted, ref } from "vue";
import recordsData from "./../assets/data/records.json";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import constants from "../../constants.json";

document.title = `${constants["website-title"]} | Papers`;

function _monthToNum(date) {
  if (date.length === 4) return parseInt(date) * 10000;
  if (date === undefined || date === null || date.length !== 10) return null;

  var yearNumber = date.substring(6, 10);
  var monthNumber = date.substring(3, 5);
  var dayNumber = date.substring(0, 2);

  var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
  return result;
}

function dateComparator(date1, date2) {
  var date1Number = _monthToNum(date1);
  var date2Number = _monthToNum(date2);

  if (date1Number === null && date2Number === null) return 0;
  if (date1Number === null) return -1;
  if (date2Number === null) return 1;
  return date1Number - date2Number;
}
const rowData = ref([]);

const columnDefs = ref({
  value: [
    {
      field: "title",
      minWidth: 180,
      width: 180,
      cellRenderer: function (params) {
        return `<a href="${params.data.url}" target="_blank">${params.data.title}</a>`;
      },
      wrapText: true,
    },
    { field: "venue", minWidth: 80, width: 80 },
    {
      field: "publicationDate",
      width: 100,
      comparator: dateComparator,
    },
    {
      headerName: "Citation Count",
      field: "citationCount",
      width: 60,
      minWidth: 60,
    },
    {
      headerName: "Influential Citation Count",
      field: "influentialCitationCount",
      width: 60,
      minWidth: 60,
    },
    {
      headerName: "Reference Count",
      field: "referenceCount",
      width: 60,
      minWidth: 60,
    },
    { field: "authors", wrapText: true, autoHeight: true, minWidth: 250 },
    { field: "summary" },
  ],
});

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  autoHeight: true,
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
};

onMounted(() => {
  rowData.value = recordsData.papers;
});
</script>
