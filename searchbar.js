const gettingTheSearchBarInputTimeCanvas = document.getElementById("timecanvasSearchInput");
const gettingTheArtStyleFilterTimeCanvas = document.getElementById("timecanvasStyleFilter");
const gettingTheTimePeriodFilterTimeCanvas = document.getElementById("timecanvasPeriodFilter");
const gettingTheSearchResultsTimeCanvas = document.getElementById("timecanvasSearchResults");
const gettingTheSearchStatusTimeCanvas = document.getElementById("timecanvasSearchStatus");
const gettingTheClearSearchButtonTimeCanvas = document.getElementById("timecanvasClearSearch");
const gettingTheSearchPanelTimeCanvas = document.querySelector(".timecanvas-search-panel");
const gettingTheSearchToggleButtonTimeCanvas = document.getElementById("timecanvasSearchToggle");
const gettingTheSearchPanelContentTimeCanvas = document.getElementById("timecanvasSearchContent");
let gettingAllTheArtworksFromTheJsonFileTimeCanvas = [];
let gettingTheSearchStartYearTimeCanvas = 1000;
let gettingTheSearchEndYearTimeCanvas = 2026;
function gettingTheArtworkDateRangeTimeCanvas(gettingTheCurrentArtworkTimeCanvas) {
    let gettingTheArtworkStartingYearTimeCanvas = 0;
    let gettingTheArtworkEndingYearTimeCanvas = 0;
    if (gettingTheCurrentArtworkTimeCanvas.date_start === null || gettingTheCurrentArtworkTimeCanvas.date_start === undefined ||
        gettingTheCurrentArtworkTimeCanvas.date_end === null || gettingTheCurrentArtworkTimeCanvas.date_end === undefined ||
        gettingTheCurrentArtworkTimeCanvas.date_start === "" || gettingTheCurrentArtworkTimeCanvas.date_end === "") {
        return null;
    }
    gettingTheArtworkStartingYearTimeCanvas = Number(gettingTheCurrentArtworkTimeCanvas.date_start);
    gettingTheArtworkEndingYearTimeCanvas = Number(gettingTheCurrentArtworkTimeCanvas.date_end);
    if (!Number.isFinite(gettingTheArtworkStartingYearTimeCanvas) ||
        !Number.isFinite(gettingTheArtworkEndingYearTimeCanvas) ||
        gettingTheArtworkStartingYearTimeCanvas > gettingTheArtworkEndingYearTimeCanvas) {
        return null;
    }
    return {
        start: gettingTheArtworkStartingYearTimeCanvas,
        end: gettingTheArtworkEndingYearTimeCanvas
    };
}
function checkingIfTheArtworkMatchesTheDatesTimeCanvas(gettingTheCurrentArtworkTimeCanvas, gettingTheStartingYearTimeCanvas, gettingTheEndingYearTimeCanvas) {
    let gettingTheArtworkDateRangeResultTimeCanvas = null;
    gettingTheArtworkDateRangeResultTimeCanvas = gettingTheArtworkDateRangeTimeCanvas(gettingTheCurrentArtworkTimeCanvas);
    if (gettingTheArtworkDateRangeResultTimeCanvas === null) {
        return false;
    }
    return gettingTheArtworkDateRangeResultTimeCanvas.start <= gettingTheEndingYearTimeCanvas &&
        gettingTheArtworkDateRangeResultTimeCanvas.end >= gettingTheStartingYearTimeCanvas;
}
function puttingTheFilterOptionsOnThePageTimeCanvas() {
    let gettingTheAvailableArtStylesTimeCanvas = [];
    let gettingTheCurrentArtworkTimeCanvas = null;
    let gettingTheCurrentStyleTimeCanvas = "";
    let gettingTheNewOptionTimeCanvas = null;
    let gettingTheCurrentCenturyTimeCanvas = 1000;
    let gettingTheCenturyHasArtworksTimeCanvas = false;
    let gettingTheArtworkNumberTimeCanvas = 0;
    let gettingTheFilterNumberTimeCanvas = 0;
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        gettingTheCurrentStyleTimeCanvas = String(gettingTheCurrentArtworkTimeCanvas.movement || "").trim();
        if (gettingTheCurrentStyleTimeCanvas !== "" && !gettingTheAvailableArtStylesTimeCanvas.includes(gettingTheCurrentStyleTimeCanvas)) {
            gettingTheAvailableArtStylesTimeCanvas.push(gettingTheCurrentStyleTimeCanvas);
        }
    }
    gettingTheAvailableArtStylesTimeCanvas.sort();
    gettingTheArtStyleFilterTimeCanvas.replaceChildren(new Option("All styles", ""));
    for (gettingTheFilterNumberTimeCanvas = 0; gettingTheFilterNumberTimeCanvas < gettingTheAvailableArtStylesTimeCanvas.length; gettingTheFilterNumberTimeCanvas++) {
        gettingTheNewOptionTimeCanvas = document.createElement("option");
        gettingTheNewOptionTimeCanvas.value = gettingTheAvailableArtStylesTimeCanvas[gettingTheFilterNumberTimeCanvas];
        gettingTheNewOptionTimeCanvas.textContent = gettingTheAvailableArtStylesTimeCanvas[gettingTheFilterNumberTimeCanvas];
        gettingTheArtStyleFilterTimeCanvas.appendChild(gettingTheNewOptionTimeCanvas);
    }
    gettingTheTimePeriodFilterTimeCanvas.replaceChildren(new Option("All centuries", ""));
    for (gettingTheCurrentCenturyTimeCanvas = 1000; gettingTheCurrentCenturyTimeCanvas <= 2000; gettingTheCurrentCenturyTimeCanvas += 100) {
        gettingTheCenturyHasArtworksTimeCanvas = false;
        for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
            gettingTheCurrentArtworkTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
            if (checkingIfTheArtworkMatchesTheDatesTimeCanvas(gettingTheCurrentArtworkTimeCanvas, gettingTheCurrentCenturyTimeCanvas, gettingTheCurrentCenturyTimeCanvas + 99)) {
                gettingTheCenturyHasArtworksTimeCanvas = true;
                break;
            }
        }
        if (gettingTheCenturyHasArtworksTimeCanvas === true) {
            gettingTheNewOptionTimeCanvas = document.createElement("option");
            gettingTheNewOptionTimeCanvas.value = String(gettingTheCurrentCenturyTimeCanvas);
            gettingTheNewOptionTimeCanvas.textContent = String(gettingTheCurrentCenturyTimeCanvas) + "s";
            gettingTheTimePeriodFilterTimeCanvas.appendChild(gettingTheNewOptionTimeCanvas);
        }
    }
}
function findingTheArtworksThatMatchTheSearchTimeCanvas() {
    let gettingTheTextEnteredInSearchBarTimeCanvas = "";
    let gettingTheSelectedArtStyleTimeCanvas = "";
    let gettingTheSelectedCenturyTimeCanvas = "";
    let gettingTheCurrentArtworkTimeCanvas = null;
    let gettingTheArtworkSearchableTextTimeCanvas = "";
    let gettingTheMatchesSearchTextTimeCanvas = false;
    let gettingTheMatchesArtStyleTimeCanvas = false;
    let gettingTheMatchesTimelineTimeCanvas = false;
    let gettingTheMatchesCenturyTimeCanvas = false;
    let gettingTheArtworksAfterSearchingTimeCanvas = [];
    let gettingTheArtworkNumberTimeCanvas = 0;
    gettingTheTextEnteredInSearchBarTimeCanvas = gettingTheSearchBarInputTimeCanvas.value.trim().toLowerCase();
    gettingTheSelectedArtStyleTimeCanvas = gettingTheArtStyleFilterTimeCanvas.value;
    gettingTheSelectedCenturyTimeCanvas = gettingTheTimePeriodFilterTimeCanvas.value;
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        gettingTheArtworkSearchableTextTimeCanvas = (
            String(gettingTheCurrentArtworkTimeCanvas.title || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.artist || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.movement || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.place_of_origin || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.medium || "") + " " +
            String(gettingTheCurrentArtworkTimeCanvas.date_display || "")
        ).toLowerCase();
        gettingTheMatchesSearchTextTimeCanvas = gettingTheTextEnteredInSearchBarTimeCanvas === "" ||
            gettingTheArtworkSearchableTextTimeCanvas.includes(gettingTheTextEnteredInSearchBarTimeCanvas);
        gettingTheMatchesArtStyleTimeCanvas = gettingTheSelectedArtStyleTimeCanvas === "" ||
            gettingTheCurrentArtworkTimeCanvas.movement === gettingTheSelectedArtStyleTimeCanvas;
        gettingTheMatchesTimelineTimeCanvas = checkingIfTheArtworkMatchesTheDatesTimeCanvas(
            gettingTheCurrentArtworkTimeCanvas,
            gettingTheSearchStartYearTimeCanvas,
            gettingTheSearchEndYearTimeCanvas
        );
        gettingTheMatchesCenturyTimeCanvas = gettingTheSelectedCenturyTimeCanvas === "" ||
            checkingIfTheArtworkMatchesTheDatesTimeCanvas(
                gettingTheCurrentArtworkTimeCanvas,
                Number(gettingTheSelectedCenturyTimeCanvas),
                Number(gettingTheSelectedCenturyTimeCanvas) + 99
            );
        if (gettingTheMatchesSearchTextTimeCanvas && gettingTheMatchesArtStyleTimeCanvas &&
            gettingTheMatchesTimelineTimeCanvas && gettingTheMatchesCenturyTimeCanvas) {
            gettingTheArtworksAfterSearchingTimeCanvas.push(gettingTheCurrentArtworkTimeCanvas);
        }
    }
    return gettingTheArtworksAfterSearchingTimeCanvas;
}
function showingTheArtworkSearchResultsTimeCanvas(gettingTheArtworksAfterSearchingTimeCanvas) {
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
        gettingTheSearchResultsTimeCanvas.textContent = "No matching artworks found. Try another search or change the date range.";
        return;
    }
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingTheArtworksAfterSearchingTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingTheArtworksAfterSearchingTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        gettingTheArtworkResultButtonTimeCanvas = document.createElement("button");
        gettingTheArtworkResultButtonTimeCanvas.type = "button";
        gettingTheArtworkResultButtonTimeCanvas.className = "timecanvas-result-button";
        gettingTheArtworkResultButtonTimeCanvas.dataset.artworkId = String(gettingTheCurrentArtworkTimeCanvas.id);
        gettingTheArtworkResultImageTimeCanvas = document.createElement("img");
        gettingTheArtworkResultImageTimeCanvas.className = "timecanvas-result-picture";
        gettingTheArtworkResultImageTimeCanvas.src = gettingTheCurrentArtworkTimeCanvas.image_url || "";
        gettingTheArtworkResultImageTimeCanvas.alt = "";
        gettingTheArtworkResultImageTimeCanvas.loading = "lazy";
        gettingTheArtworkResultTextTimeCanvas = document.createElement("span");
        gettingTheArtworkResultTextTimeCanvas.className = "timecanvas-result-text";
        gettingTheArtworkResultTitleTimeCanvas = document.createElement("strong");
        gettingTheArtworkResultTitleTimeCanvas.textContent = gettingTheCurrentArtworkTimeCanvas.title || "Untitled";
        gettingTheArtworkResultExtraInfoTimeCanvas = document.createElement("span");
        gettingTheArtworkResultExtraInfoTimeCanvas.textContent =
            String(gettingTheCurrentArtworkTimeCanvas.artist || "Unknown artist") + " • " +
            String(gettingTheCurrentArtworkTimeCanvas.date_display || "");
        gettingTheArtworkResultTextTimeCanvas.appendChild(gettingTheArtworkResultTitleTimeCanvas);
        gettingTheArtworkResultTextTimeCanvas.appendChild(gettingTheArtworkResultExtraInfoTimeCanvas);
        gettingTheArtworkResultButtonTimeCanvas.appendChild(gettingTheArtworkResultImageTimeCanvas);
        gettingTheArtworkResultButtonTimeCanvas.appendChild(gettingTheArtworkResultTextTimeCanvas);
        gettingTheSearchResultsTimeCanvas.appendChild(gettingTheArtworkResultButtonTimeCanvas);
    }
}
function updatingTheArtworkSearchTimeCanvas() {
    let gettingTheArtworksAfterSearchingTimeCanvas = [];
    gettingTheArtworksAfterSearchingTimeCanvas = findingTheArtworksThatMatchTheSearchTimeCanvas();
    showingTheArtworkSearchResultsTimeCanvas(gettingTheArtworksAfterSearchingTimeCanvas);
    window.dispatchEvent(new CustomEvent("timecanvas:search-changed", {
        detail: { artworks: gettingTheArtworksAfterSearchingTimeCanvas }
    }));
}
function loadingTheArtworksIntoTheSearchBarTimeCanvas(gettingTheArtworkCollectionTimeCanvas) {
    if (!Array.isArray(gettingTheArtworkCollectionTimeCanvas)) {
        return;
    }
    gettingAllTheArtworksFromTheJsonFileTimeCanvas = gettingTheArtworkCollectionTimeCanvas;
    puttingTheFilterOptionsOnThePageTimeCanvas();
    updatingTheArtworkSearchTimeCanvas();
}
function changingTheSearchSectionVisibilityTimeCanvas() {
    let isTheSearchSectionCollapsedTimeCanvas = false;
    isTheSearchSectionCollapsedTimeCanvas = gettingTheSearchPanelTimeCanvas.classList.toggle("is-collapsed");
    gettingTheSearchPanelContentTimeCanvas.hidden = isTheSearchSectionCollapsedTimeCanvas;
    if (isTheSearchSectionCollapsedTimeCanvas === true) {
        gettingTheSearchToggleButtonTimeCanvas.textContent = "Show Search";
        gettingTheSearchToggleButtonTimeCanvas.setAttribute("aria-expanded", "false");
    } else {
        gettingTheSearchToggleButtonTimeCanvas.textContent = "Hide";
        gettingTheSearchToggleButtonTimeCanvas.setAttribute("aria-expanded", "true");
    }
    window.dispatchEvent(new Event("resize"));
    if (typeof map !== "undefined" && typeof map.invalidateSize === "function") {
        map.invalidateSize();
    }
}
gettingTheSearchToggleButtonTimeCanvas.addEventListener("click", changingTheSearchSectionVisibilityTimeCanvas);
gettingTheSearchBarInputTimeCanvas.addEventListener("input", updatingTheArtworkSearchTimeCanvas);
gettingTheArtStyleFilterTimeCanvas.addEventListener("change", updatingTheArtworkSearchTimeCanvas);
gettingTheTimePeriodFilterTimeCanvas.addEventListener("change", updatingTheArtworkSearchTimeCanvas);
gettingTheClearSearchButtonTimeCanvas.addEventListener("click", function() {
    gettingTheSearchBarInputTimeCanvas.value = "";
    gettingTheArtStyleFilterTimeCanvas.value = "";
    gettingTheTimePeriodFilterTimeCanvas.value = "";
    updatingTheArtworkSearchTimeCanvas();
    gettingTheSearchBarInputTimeCanvas.focus();
});
gettingTheSearchResultsTimeCanvas.addEventListener("click", function(gettingTheClickEventTimeCanvas) {
    let gettingTheClickedArtworkButtonTimeCanvas = null;
    let gettingTheArtworkIdFromButtonTimeCanvas = "";
    let gettingTheCurrentArtworkTimeCanvas = null;
    let gettingTheSelectedArtworkTimeCanvas = null;
    let gettingTheSelectedArtworkMarkerTimeCanvas = null;
    let gettingTheArtworkNumberTimeCanvas = 0;
    gettingTheClickedArtworkButtonTimeCanvas = gettingTheClickEventTimeCanvas.target.closest("button[data-artwork-id]");
    if (gettingTheClickedArtworkButtonTimeCanvas === null) {
        return;
    }
    gettingTheArtworkIdFromButtonTimeCanvas = gettingTheClickedArtworkButtonTimeCanvas.dataset.artworkId;
    for (gettingTheArtworkNumberTimeCanvas = 0; gettingTheArtworkNumberTimeCanvas < gettingAllTheArtworksFromTheJsonFileTimeCanvas.length; gettingTheArtworkNumberTimeCanvas++) {
        gettingTheCurrentArtworkTimeCanvas = gettingAllTheArtworksFromTheJsonFileTimeCanvas[gettingTheArtworkNumberTimeCanvas];
        if (String(gettingTheCurrentArtworkTimeCanvas.id) === gettingTheArtworkIdFromButtonTimeCanvas) {
            gettingTheSelectedArtworkTimeCanvas = gettingTheCurrentArtworkTimeCanvas;
            break;
        }
    }
    if (gettingTheSelectedArtworkTimeCanvas === null) {
        return;
    }
    if (typeof showArtworkDetails === "function") {
        showArtworkDetails(gettingTheSelectedArtworkTimeCanvas);
    }
    if (typeof artworkMarkers !== "undefined" && typeof timelineArtworkLayer !== "undefined" && typeof map !== "undefined") {
        gettingTheSelectedArtworkMarkerTimeCanvas = artworkMarkers.get(gettingTheSelectedArtworkTimeCanvas.id);
        if (gettingTheSelectedArtworkMarkerTimeCanvas !== undefined) {
            timelineArtworkLayer.zoomToShowLayer(gettingTheSelectedArtworkMarkerTimeCanvas, function() {
                map.setView(gettingTheSelectedArtworkMarkerTimeCanvas.getLatLng(), Math.max(map.getZoom(), 10));
                gettingTheSelectedArtworkMarkerTimeCanvas.openPopup();
            });
        }
    }
});
window.addEventListener("timecanvas:artworks-loaded", function(gettingTheArtworkLoadEventTimeCanvas) {
    loadingTheArtworksIntoTheSearchBarTimeCanvas(gettingTheArtworkLoadEventTimeCanvas.detail.artworks);
});
document.addEventListener("timelineChange", function(gettingTheTimelineChangeEventTimeCanvas) {
    gettingTheSearchStartYearTimeCanvas = gettingTheTimelineChangeEventTimeCanvas.detail.startYear;
    gettingTheSearchEndYearTimeCanvas = gettingTheTimelineChangeEventTimeCanvas.detail.endYear;
    updatingTheArtworkSearchTimeCanvas();
});
if (typeof artworks !== "undefined" && artworks.length > 0) {
    loadingTheArtworksIntoTheSearchBarTimeCanvas(artworks);
}