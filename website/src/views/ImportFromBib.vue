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
  let data = [];
  recordsData.papers.forEach((p) => data.push(p.entryTags));
  rowData.value = data;
});

const handleSelection = () => {
  buttonContent.value = "Copied to clipboard!";
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
