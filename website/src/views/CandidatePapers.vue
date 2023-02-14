<template>
  <div>
    <h1>Candidate Papers</h1>
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
    <div class="bottomText">Showing {{ recordsData.papers.length }} papers</div>
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
import recordsData from "./../assets/data/candidateRecords.json";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import constants from "../../constants.json";

document.title = `${constants["website-title"]} | Candidate Papers`;

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
const gridOptions = ref({});
const buttonContent = ref("Add these papers!");
const isDisabled = ref(false);

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
      autoHeight: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: "venue", minWidth: 80, width: 80, maxWidth: 120 },
    { field: "publicationDate", width: 100, comparator: dateComparator },
    {
      headerName: "Score",
      field: "score",
      width: 60,
      minWidth: 60,
      maxWidth: 100,
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

<style>
.ag-cell-wrap-text {
  word-break: break-word;
}
.selectionButton {
  appearance: button;
  background-color: var(--sidebar-item-active);
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  font-family: din-round, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.8px;
  line-height: 20px;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  margin-top: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 15px;
  text-align: center;
  text-transform: uppercase;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter 0.2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: 250px;
}

.selectionButton:after {
  background-clip: padding-box;
  background-color: var(--sidebar-item-hover);
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  bottom: -4px;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

.selectionButton:main,
.selectionButton:focus {
  user-select: auto;
}

.selectionButton:hover:not(:disabled) {
  filter: brightness(1.1);
  -webkit-filter: brightness(1.1);
}

.selectionButton:disabled {
  cursor: auto;
}
</style>
