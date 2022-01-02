import {config} from "./config";
import { HTML } from "./html";
import * as fs from "fs";
import * as path from "path";
import { BUILD_FOLDER } from "./output";

export function buildFrontpage() {
  let html = `<h1><tt>abapedia</tt></h1>
  <i>ABAP API Definitions</i><br>

  <h3><tt>Definitions</tt></h3>\n`;

  const list: string[] = [];
  for (const p of config.projects) {
    list.push(`<a href="./${p.name}/">${p.name}</a>`);
  }
  html += list.join("<br>\n");

//  html += search();
  html += settings();

  fs.writeFileSync(path.join(BUILD_FOLDER, "index.html"),
    HTML.preAmble(" - ABAP API Definitions") + html + HTML.postAmble(),
    "utf-8");
}

///////////////////////////////////////////////////

function settings() {
  const html = `<br>
  <h3><tt>Settings</tt></h3>
<script>
window.addEventListener('DOMContentLoaded', (event) => {
    getValue();
});

function getValue() {
   var sys = localStorage.getItem("ADT_SYSTEM");
   if (sys === null) {
     sys = "ME1";
     localStorage.setItem("ADT_SYSTEM", sys);
   }
   document.getElementById("ADT_SYSTEM").value = sys;
}

function handleValueChange(i) {
  localStorage.setItem("ADT_SYSTEM", i.toUpperCase());
  return false;
}
</script>
System for "<i>Open in ADT</i>" link: <input type="text" size="4" maxlength="3" class="" id="ADT_SYSTEM" oninput="handleValueChange(this.value)"/>`;
  return html;
}

export function search() {
  const html = `<br>
  <h3><tt>Search</tt></h3>
  <script>
  var idx = undefined;
  function searchFocus() {
    if (idx !== undefined) {
      console.log("index already loaded")
      return;
    }
    let myRequest = new Request('./steampunk-2111-api/index.json');
    fetch(myRequest).then(function(response) {
      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }
      return response.json();
    }).then((data) => {
      idx = lunr.Index.load(data)
      console.dir("index loaded");
    });
  }

  function searchInput(value) {
    console.dir("search input: " + value);
    if (idx === undefined) {
      console.log("error, index not loaded");
      return;
    }
    const searchResult = idx.search(value);
    console.dir(searchResult);
  }
  </script>
  <input type="text" class="" id="search" onfocus="searchFocus()" oninput="searchInput(this.value)"/>`;
  return html;
}