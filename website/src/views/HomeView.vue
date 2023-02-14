<script setup>
import constants from "../../constants.json";
document.title = `${constants["website-title"]} | Home`;
</script>

<template>
  <div>
    <h1>{{ constants["home-title"] }}</h1>
    <br />
    <p>{{ constants["home-description"] }}</p>

    <br />
    <p class="content">
      You can access the various sections of the site using the side navigation!
      <br />
      <br />
      There are two primary pages:
      <h3>Current Papers:</h3> This view shows all the current papers
      that are present in the database with some basic information about them.
      <h3>Candidate Papers:</h3> This view lists all the prospective
      papers that the scripts have calculated on the basis of the papers already
      present in the system. You can use the checkboxes in the Candidate Papers
      view to select the papers that you actually want to add to your list, and
      then click the `Add these papers` button. This would copy the paper
      details to your clipboard, which you can directly paste in the
      `papersToAdd.txt` in your repository and commit the changes. <br /><br />
      The scripts would then automatically start running, and get a new set of
      candidate papers to be added in your database. Since we are using GitHub,
      proper versioning of all the papers happens automatically in form of
      commits, and thus you can always rollback to your older versions if you
      want.
    </p>
  </div>
</template>

<style>
.content {
  max-width: 140vh;
  align-content: center;
  align-items: center;
  margin: auto;
}
</style>
