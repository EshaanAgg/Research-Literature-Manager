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
    <h1>Import papers from Bib file</h1>
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
import recordsData from "./../assets/data/bibUpload.json";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import constants from "../../constants.json";

document.title = `${constants["website-title"]} | Bib Files`;

const rowData = ref([]);

const columnDefs = ref({
  value: [
    {
      headerName: "Title",
      minWidth: 180,
      width: 180,
      wrapText: true,
      cellRenderer: function (params) {
        return `<a href="${params.data.url}" target="_blank">${params.data.TITLE}</a>`;
      },
    },
    { headerName: "Author", field: "AUTHOR", minWidth: 80, width: 80 },
    {
      headerName: "Year",
      field: "YEAR",
      width: 100,
    },
    { headerName: "Publisher", field: "PUBLISHER", width: 60, minWidth: 60 },
    {
      headerName: "Journal",
      field: "JOURNAL",
      width: 60,
      minWidth: 60,
    },
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
  let data = [];
  recordsData.papers.forEach((p) => data.push(p.entryTags));
  rowData.value = data;
});
</script>
