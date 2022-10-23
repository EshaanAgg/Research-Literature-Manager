<style scoped>
.papers-grid {
  height: 500px;
  padding-left: 50px;
  padding-right: 50px;
}
</style>

<template>
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
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { onMounted, ref } from "vue";
import recordsData from "./../../../data/records.json";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const rowData = ref([]);

const columnDefs = ref({
  value: [
    { headerName: "ID", field: "id", maxWidth: 80 },
    { field: "title", minWidth: 180 },
    { field: "venue", minWidth: 100 },
    { field: "year", minWidth: 80 },
    { headerName: "Citation Count", field: "citationCount" },
    {
      headerName: "Influential Citation Count",
      field: "influentialCitationCount",
    },
    { headerName: "Reference Count", field: "referenceCount" },
    { field: "summary" },
    { field: "authors" },
  ],
});

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
};

// Example load data from sever
onMounted(() => {
  rowData.value = recordsData.papers;
});
</script>
