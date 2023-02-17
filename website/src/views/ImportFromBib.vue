<template>
  <div>
    <h1>Import papers from Bib file</h1>
    You can choose papers that you want to add to the database by clicking the
    checkbox next to them.
    <br />
    <br />
    <ag-grid-vue
      class="ag-theme-alpine papers-grid"
      :columnDefs="columnDefs.value"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      rowSelection="multiple"
      animateRows="true"
      :gridOptions="gridOptions"
    >
    </ag-grid-vue>
    <div class="bottomText">
      Displaying {{ recordsData.papers.length }} papers
    </div>
    <button
      @click="handleSelection"
      class="selectionButton"
      :disabled="isDisabled"
    >
      {{ buttonContent }}
    </button>
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
const gridOptions = ref({});
const buttonContent = ref("Add these papers!");
const isDisabled = ref(false);

const columnDefs = ref({
  value: [
    {
      headerName: "Title",
      minWidth: 180,
      width: 180,
      wrapText: true,
      autoHeight: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
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

const handleSelection = () => {
  buttonContent.value = "Copied to clipboard! Paste these in papersToAdd.txt!";
  isDisabled.value = true;

  setTimeout(() => {
    buttonContent.value = "Add these papers!";
    isDisabled.value = false;
  }, 2000);

  var selectedRows = gridOptions.value.api.getSelectedRows();
  var copyText = "";
  selectedRows.forEach((row) => (copyText += `${row.url}\n`));
  navigator.clipboard.writeText(copyText);
};
</script>
