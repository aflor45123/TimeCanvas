const gettingTheSearchBarInputTimeCanvas = document.getElementById("timecanvasSearchInput");
const gettingTheClearSearchButtonTimeCanvas = document.getElementById("timecanvasClearSearch");
const gettingTheArtStyleFilterTimeCanvas = document.getElementById("timecanvasStyleFilter");
const gettingTheTimePeriodFilterTimeCanvas = document.getElementById("timecanvasPeriodFilter");
const gettingTheSearchResultsTimeCanvas = document.getElementById("timecanvasSearchResults");
const gettingTheSearchStatusTimeCanvas = document.getElementById("timecanvasSearchStatus");
const gettingTheArtworkDetailsWindowTimeCanvas = document.getElementById("timecanvasArtworkDetails");
const gettingTheCloseArtworkDetailsTimeCanvas = document.getElementById("timecanvasCloseDetails");
const gettingTheArtworkDetailsImageTimeCanvas = document.getElementById("timecanvasDetailsImage");
const gettingTheArtworkDetailsTitleTimeCanvas = document.getElementById("timecanvasDetailsTitle");
const gettingTheArtworkDetailsArtistTimeCanvas = document.getElementById("timecanvasDetailsArtist");
const gettingTheArtworkDetailsDateTimeCanvas = document.getElementById("timecanvasDetailsDate");
const gettingTheArtworkDetailsStyleTimeCanvas = document.getElementById("timecanvasDetailsStyle");
const gettingTheArtworkDetailsLocationTimeCanvas = document.getElementById("timecanvasDetailsLocation");
const gettingTheArtworkDetailsMediumTimeCanvas = document.getElementById("timecanvasDetailsMedium");
const gettingTheArtworkDetailsDescriptionTimeCanvas = document.getElementById("timecanvasDetailsDescription");
let gettingAllTheArtworksFromTheJsonFileTimeCanvas = [];
let gettingTheArtworksAfterSearchingTimeCanvas = [];
let gettingTheCurrentArtworkFromSearchTimeCanvas = null;
function makingTheSearchTextLowercaseTimeCanvas(gettingTheTextToChangeTimeCanvas) {
    let gettingTheLowercaseTextTimeCanvas = "";
    if (gettingTheTextToChangeTimeCanvas !== null && gettingTheTextToChangeTimeCanvas !== undefined) {
        gettingTheLowercaseTextTimeCanvas = String(gettingTheTextToChangeTimeCanvas).toLowerCase().trim();
    }
    return gettingTheLowercaseTextTimeCanvas;
}
function gettingTheCenturyFromArtworkYearTimeCanvas(gettingTheYearOfArtworkTimeCanvas) {
    let gettingTheCenturyNumberTimeCanvas = 0;
    gettingTheCenturyNumberTimeCanvas = Math.floor((Number(gettingTheYearOfArtworkTimeCanvas) - 1) / 100) + 1;
    return gettingTheCenturyNumberTimeCanvas;
}
function puttingTheFilterOptionsOnThePageTimeCanvas() {
    let gettingTheAvailableArtStylesTimeCanvas = [];
    let gettingTheAvailableCenturiesTimeCanvas = [];
    let gettingTheCurrentArtworkTimeCanvas = null;
    let gettingTheCurrentStyleTimeCanvas = "";
    let gettingTheCurrentCenturyTimeCanvas = 0;
    let gettingTheNewOptionTimeCanvas = null;
    let gettingTheArtworkNumberTimeCanvas = 0;
    let gettingTheFilterNumberTimeCanvas = 0;
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        gettingTheCurrentStyleTimeCanvas = String(gettingTheCurrentArtworkTimeCanvas.movement || "").trim();
        gettingTheCurrentCenturyTimeCanvas = gettingTheCenturyFromArtworkYearTimeCanvas(gettingTheCurrentArtworkTimeCanvas.date_start);
        if (gettingTheCurrentStyleTimeCanvas !== "" && !gettingTheAvailableArtStylesTimeCanvas.includes(gettingTheCurrentStyleTimeCanvas)) {
            gettingTheAvailableArtStylesTimeCanvas.push(gettingTheCurrentStyleTimeCanvas);
        }
        if (gettingTheCurrentCenturyTimeCanvas > 0 && !gettingTheAvailableCenturiesTimeCanvas.includes(gettingTheCurrentCenturyTimeCanvas)) {
            gettingTheAvailableCenturiesTimeCanvas.push(gettingTheCurrentCenturyTimeCanvas);
        }
    }
    gettingTheAvailableArtStylesTimeCanvas.sort();
    gettingTheAvailableCenturiesTimeCanvas.sort(function(gettingTheFirstCenturyTimeCanvas, gettingTheSecondCenturyTimeCanvas) {
        return gettingTheFirstCenturyTimeCanvas - gettingTheSecondCenturyTimeCanvas;
    });
    for (gettingTheFilterNumberTimeCanvas = 0; gettingTheFilterNumberTimeCanvas < gettingTheAvailableArtStylesTimeCanvas.length; gettingTheFilterNumberTimeCanvas++) {
        gettingTheNewOptionTimeCanvas = document.createElement("option");
        gettingTheNewOptionTimeCanvas.value = gettingTheAvailableArtStylesTimeCanvas[gettingTheFilterNumberTimeCanvas];
        gettingTheNewOptionTimeCanvas.textContent = gettingTheAvailableArtStylesTimeCanvas[gettingTheFilterNumberTimeCanvas];
        gettingTheArtStyleFilterTimeCanvas.appendChild(gettingTheNewOptionTimeCanvas);
    }
    for (gettingTheFilterNumberTimeCanvas = 0; gettingTheFilterNumberTimeCanvas < gettingTheAvailableCenturiesTimeCanvas.length; gettingTheFilterNumberTimeCanvas++) {
        gettingTheNewOptionTimeCanvas = document.createElement("option");
        gettingTheNewOptionTimeCanvas.value = String(gettingTheAvailableCenturiesTimeCanvas[gettingTheFilterNumberTimeCanvas]);
        gettingTheNewOptionTimeCanvas.textContent = String(gettingTheAvailableCenturiesTimeCanvas[gettingTheFilterNumberTimeCanvas]) + "th century";
        gettingTheTimePeriodFilterTimeCanvas.appendChild(gettingTheNewOptionTimeCanvas);
    }
}
function findingTheArtworksThatMatchTheSearchTimeCanvas() {
    let gettingTheTextEnteredInSearchBarTimeCanvas = "";
    let gettingTheSelectedArtStyleTimeCanvas = "";
    let gettingTheSelectedCenturyTimeCanvas = "";
    let gettingTheCurrentArtworkTimeCanvas = null;
    let gettingTheArtworkSearchableTextTimeCanvas = "";
    let gettingTheArtworkCenturyTimeCanvas = 0;
    let gettingTheMatchesSearchTimeCanvas = false;
    let gettingTheMatchesStyleTimeCanvas = false;
    let gettingTheMatchesCenturyTimeCanvas = false;
    let gettingTheArtworkNumberTimeCanvas = 0;
    gettingTheArtworksAfterSearchingTimeCanvas = [];
    gettingTheTextEnteredInSearchBarTimeCanvas = makingTheSearchTextLowercaseTimeCanvas(gettingTheSearchBarInputTimeCanvas.value);
    gettingTheSelectedArtStyleTimeCanvas = gettingTheArtStyleFilterTimeCanvas.value;
    gettingTheSelectedCenturyTimeCanvas = gettingTheTimePeriodFilterTimeCanvas.value;
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        gettingTheArtworkSearchableTextTimeCanvas = makingTheSearchTextLowercaseTimeCanvas(
            String(gettingTheCurrentArtworkTimeCanvas.title || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.artist || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.movement || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.place_of_origin || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.medium || "")
        );
        gettingTheArtworkCenturyTimeCanvas = gettingTheCenturyFromArtworkYearTimeCanvas(gettingTheCurrentArtworkTimeCanvas.date_start);
        gettingTheMatchesSearchTimeCanvas = gettingTheTextEnteredInSearchBarTimeCanvas === "" || gettingTheArtworkSearchableTextTimeCanvas.includes(gettingTheTextEnteredInSearchBarTimeCanvas);
        gettingTheMatchesStyleTimeCanvas = gettingTheSelectedArtStyleTimeCanvas === "" || gettingTheCurrentArtworkTimeCanvas.movement === gettingTheSelectedArtStyleTimeCanvas;
        gettingTheMatchesCenturyTimeCanvas = gettingTheSelectedCenturyTimeCanvas === "" || String(gettingTheArtworkCenturyTimeCanvas) === gettingTheSelectedCenturyTimeCanvas;
        if (gettingTheMatchesSearchTimeCanvas && gettingTheMatchesStyleTimeCanvas && gettingTheMatchesCenturyTimeCanvas) {
            gettingTheArtworksAfterSearchingTimeCanvas.push(gettingTheCurrentArtworkTimeCanvas);
        }
    }
    showingTheArtworkSearchResultsTimeCanvas();
    window.dispatchEvent(new CustomEvent("timecanvas:search-changed", {
        detail: { artworks: gettingTheArtworksAfterSearchingTimeCanvas.slice() }
    }));
}
function showingTheArtworkSearchResultsTimeCanvas() {
    let gettingTheCurrentArtworkTimeCanvas = null;
    let gettingTheArtworkResultButtonTimeCanvas = null;
    let gettingTheArtworkResultImageTimeCanvas = null;
    let gettingTheArtworkResultTextTimeCanvas = null;
    let gettingTheArtworkResultTitleTimeCanvas = null;
    let gettingTheArtworkResultExtraInfoTimeCanvas = null;
    let gettingTheArtworkNumberTimeCanvas = 0;
    gettingTheSearchResultsTimeCanvas.replaceChildren();
    gettingTheSearchStatusTimeCanvas.textContent = String(gettingTheArtworksAfterSearchingTimeCanvas.length) + " artwork(s) found";
    if (gettingTheArtworksAfterSearchingTimeCanvas.length === 0) {
        gettingTheSearchResultsTimeCanvas.textContent = "No matching artworks found. Try another title, artist, or filter.";
        gettingTheSearchResultsTimeCanvas.classList.add("timecanvas-no-results");
        return;
    }
    gettingTheSearchResultsTimeCanvas.classList.remove("timecanvas-no-results");
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingTheArtworksAfterSearchingTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingTheArtworksAfterSearchingTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        gettingTheArtworkResultButtonTimeCanvas = document.createElement("button");
        gettingTheArtworkResultButtonTimeCanvas.type = "button";
        gettingTheArtworkResultButtonTimeCanvas.className = "timecanvas-result-button";
        gettingTheArtworkResultButtonTimeCanvas.dataset.artworkId = String(gettingTheCurrentArtworkTimeCanvas.id);
        gettingTheArtworkResultImageTimeCanvas = document.createElement("img");
        gettingTheArtworkResultImageTimeCanvas.className = "timecanvas-result-picture";
        gettingTheArtworkResultImageTimeCanvas.src = gettingTheCurrentArtworkTimeCanvas.image_url;
        gettingTheArtworkResultImageTimeCanvas.alt = "";
        gettingTheArtworkResultImageTimeCanvas.loading = "lazy";
        gettingTheArtworkResultTextTimeCanvas = document.createElement("span");
        gettingTheArtworkResultTextTimeCanvas.className = "timecanvas-result-text";
        gettingTheArtworkResultTitleTimeCanvas = document.createElement("strong");
        gettingTheArtworkResultTitleTimeCanvas.textContent = gettingTheCurrentArtworkTimeCanvas.title;
        gettingTheArtworkResultExtraInfoTimeCanvas = document.createElement("span");
        gettingTheArtworkResultExtraInfoTimeCanvas.textContent = gettingTheCurrentArtworkTimeCanvas.artist + " • " + gettingTheCurrentArtworkTimeCanvas.date_display;
        gettingTheArtworkResultTextTimeCanvas.appendChild(gettingTheArtworkResultTitleTimeCanvas);
        gettingTheArtworkResultTextTimeCanvas.appendChild(gettingTheArtworkResultExtraInfoTimeCanvas);
        gettingTheArtworkResultButtonTimeCanvas.appendChild(gettingTheArtworkResultImageTimeCanvas);
        gettingTheArtworkResultButtonTimeCanvas.appendChild(gettingTheArtworkResultTextTimeCanvas);
        gettingTheSearchResultsTimeCanvas.appendChild(gettingTheArtworkResultButtonTimeCanvas);
    }
}
function showingTheSelectedArtworkInformationTimeCanvas(gettingTheArtworkToShowTimeCanvas) {
    let gettingTheArtworkShortDescriptionTimeCanvas = "";
    gettingTheCurrentArtworkFromSearchTimeCanvas = gettingTheArtworkToShowTimeCanvas;
    gettingTheArtworkDetailsTitleTimeCanvas.textContent = gettingTheArtworkToShowTimeCanvas.title;
    gettingTheArtworkDetailsArtistTimeCanvas.textContent = gettingTheArtworkToShowTimeCanvas.artist;
    gettingTheArtworkDetailsDateTimeCanvas.textContent = gettingTheArtworkToShowTimeCanvas.date_display;
    gettingTheArtworkDetailsStyleTimeCanvas.textContent = gettingTheArtworkToShowTimeCanvas.movement;
    gettingTheArtworkDetailsLocationTimeCanvas.textContent = gettingTheArtworkToShowTimeCanvas.place_of_origin;
    gettingTheArtworkDetailsMediumTimeCanvas.textContent = gettingTheArtworkToShowTimeCanvas.medium;
    gettingTheArtworkDetailsImageTimeCanvas.src = gettingTheArtworkToShowTimeCanvas.image_url;
    gettingTheArtworkDetailsImageTimeCanvas.alt = gettingTheArtworkToShowTimeCanvas.title;
    gettingTheArtworkShortDescriptionTimeCanvas = String(gettingTheArtworkToShowTimeCanvas.short_description || "");
    gettingTheArtworkShortDescriptionTimeCanvas = gettingTheArtworkShortDescriptionTimeCanvas.replace(/<\/?em>/gi, "");
    gettingTheArtworkDetailsDescriptionTimeCanvas.textContent = gettingTheArtworkShortDescriptionTimeCanvas;
    const showDetails = window.dispatchEvent(new CustomEvent("timecanvas:artwork-selected", {
        cancelable: true,
        detail: { artwork: gettingTheArtworkToShowTimeCanvas }
    }));
    if (showDetails) {
        gettingTheArtworkDetailsWindowTimeCanvas.showModal();
    }
}
async function loadingTheArtworksForTheSearchBarTimeCanvas() {
    let gettingTheResponseFromArtworksFileTimeCanvas = null;
    let gettingTheArtworkDataFromFileTimeCanvas = null;
    try {
        gettingTheSearchStatusTimeCanvas.textContent = "Loading artworks...";
        gettingTheResponseFromArtworksFileTimeCanvas = await fetch("./data/artworks.json");
        if (!gettingTheResponseFromArtworksFileTimeCanvas.ok) {
            throw new Error("Could not load the artwork JSON file.");
        }
        gettingTheArtworkDataFromFileTimeCanvas = await gettingTheResponseFromArtworksFileTimeCanvas.json();
        if (!Array.isArray(gettingTheArtworkDataFromFileTimeCanvas)) {
            throw new Error("The artwork data should be a list.");
        }
        gettingAllTheArtworksFromTheJsonFileTimeCanvas = gettingTheArtworkDataFromFileTimeCanvas;
        puttingTheFilterOptionsOnThePageTimeCanvas();
        findingTheArtworksThatMatchTheSearchTimeCanvas();
    } catch (gettingTheErrorWhileLoadingTimeCanvas) {
        gettingTheSearchStatusTimeCanvas.textContent = "Could not load artwork data.";
        gettingTheSearchResultsTimeCanvas.textContent = "";
        console.error(gettingTheErrorWhileLoadingTimeCanvas);
    }
}
gettingTheSearchBarInputTimeCanvas.addEventListener("input", findingTheArtworksThatMatchTheSearchTimeCanvas);
gettingTheArtStyleFilterTimeCanvas.addEventListener("change", findingTheArtworksThatMatchTheSearchTimeCanvas);
gettingTheTimePeriodFilterTimeCanvas.addEventListener("change", findingTheArtworksThatMatchTheSearchTimeCanvas);
gettingTheClearSearchButtonTimeCanvas.addEventListener("click", function() {
    gettingTheSearchBarInputTimeCanvas.value = "";
    gettingTheArtStyleFilterTimeCanvas.value = "";
    gettingTheTimePeriodFilterTimeCanvas.value = "";
    findingTheArtworksThatMatchTheSearchTimeCanvas();
    gettingTheSearchBarInputTimeCanvas.focus();
});
gettingTheSearchResultsTimeCanvas.addEventListener("click", function(gettingTheClickEventTimeCanvas) {
    let gettingTheClickedArtworkButtonTimeCanvas = null;
    let gettingTheArtworkIdFromButtonTimeCanvas = "";
    let gettingTheArtworkFromListTimeCanvas = null;
    let gettingTheArtworkNumberTimeCanvas = 0;
    gettingTheClickedArtworkButtonTimeCanvas = gettingTheClickEventTimeCanvas.target.closest("button[data-artwork-id]");
    if (gettingTheClickedArtworkButtonTimeCanvas === null) {
        return;
    }
    gettingTheArtworkIdFromButtonTimeCanvas = gettingTheClickedArtworkButtonTimeCanvas.dataset.artworkId;
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheArtworkFromListTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        if (String(gettingTheArtworkFromListTimeCanvas.id) === gettingTheArtworkIdFromButtonTimeCanvas) {
            showingTheSelectedArtworkInformationTimeCanvas(gettingTheArtworkFromListTimeCanvas);
            break;
        }
    }
});
gettingTheCloseArtworkDetailsTimeCanvas.addEventListener("click", function() {
    gettingTheArtworkDetailsWindowTimeCanvas.close();
});
gettingTheArtworkDetailsWindowTimeCanvas.addEventListener("click", function(gettingTheClickEventTimeCanvas) {
    if (gettingTheClickEventTimeCanvas.target === gettingTheArtworkDetailsWindowTimeCanvas) {
        gettingTheArtworkDetailsWindowTimeCanvas.close();
    }
});
loadingTheArtworksForTheSearchBarTimeCanvas();