
/* TimeCanvas — Search Bar and Timeline Integration */

const searchInput = document.getElementById("timecanvasSearchInput");
const styleFilter = document.getElementById("timecanvasStyleFilter");
const periodFilter = document.getElementById("timecanvasPeriodFilter");
const searchResults = document.getElementById("timecanvasSearchResults");
const searchStatus = document.getElementById("timecanvasSearchStatus");
const clearSearch = document.getElementById("timecanvasClearSearch");

let searchCollection = [];
let searchStartYear = 1000;
let searchEndYear = 2026;

function artworkDateRange(artwork) {
  if (
    artwork.date_start == null ||
    artwork.date_end == null ||
    artwork.date_start === "" ||
    artwork.date_end === ""
  ) {
    return null;
  }

  const start = Number(artwork.date_start);
  const end = Number(artwork.date_end);

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start > end
  ) {
    return null;
  }

  return { start, end };
}

function artworkOverlaps(artwork, start, end) {
  const range = artworkDateRange(artwork);

  return range !== null &&
    range.start <= end &&
    range.end >= start;
}

function populateSearchFilters() {
  const styles = [...new Set(
    searchCollection
      .map(artwork => artwork.movement)
      .filter(Boolean)
  )].sort();

  styleFilter.replaceChildren(
    new Option("All styles", "")
  );

  styles.forEach(style => {
    styleFilter.add(new Option(style, style));
  });

  periodFilter.replaceChildren(
    new Option("All centuries", "")
  );

  for (let year = 1000; year <= 2000; year += 100) {
    const hasArtworks = searchCollection.some(artwork =>
      artworkOverlaps(artwork, year, year + 99)
    );

    if (hasArtworks) {
      periodFilter.add(
        new Option(`${year}s`, String(year))
      );
    }
  }
}

function getSearchMatches() {
  const query = searchInput.value.trim().toLowerCase();
  const style = styleFilter.value;
  const period = periodFilter.value;

  return searchCollection.filter(artwork => {
    const searchableText = [
      artwork.title,
      artwork.artist,
      artwork.movement,
      artwork.place_of_origin,
      artwork.medium,
      artwork.date_display
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesText =
      !query || searchableText.includes(query);

    const matchesStyle =
      !style || artwork.movement === style;

    const matchesTimeline = artworkOverlaps(
      artwork,
      searchStartYear,
      searchEndYear
    );

    const matchesPeriod =
      !period || artworkOverlaps(
        artwork,
        Number(period),
        Number(period) + 99
      );

    return matchesText &&
      matchesStyle &&
      matchesTimeline &&
      matchesPeriod;
  });
}

function renderSearchResults(matches) {
  searchResults.replaceChildren();

  searchStatus.textContent =
    `${matches.length} artwork(s) found`;

  if (matches.length === 0) {
    searchResults.textContent =
      "No matching artworks found. Try another search or change the date range.";
    return;
  }

  matches.forEach(artwork => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "timecanvas-result-button";

    const image = document.createElement("img");
    image.className = "timecanvas-result-picture";
    image.src = artwork.image_url || "";
    image.alt = "";
    image.loading = "lazy";

    const text = document.createElement("span");
    text.className = "timecanvas-result-text";

    const title = document.createElement("strong");
    title.textContent = artwork.title || "Untitled";

    const details = document.createElement("span");
    details.textContent =
      `${artwork.artist || "Unknown artist"} • ${artwork.date_display || ""}`;

    text.append(title, details);
    button.append(image, text);

    button.addEventListener("click", () => {
      // Show details using the current internal.js panel.
      if (typeof showArtworkDetails === "function") {
        showArtworkDetails(artwork);
      }

      // Focus the selected artwork on the map.
      const marker = artworkMarkers.get(artwork.id);

      if (marker) {
        timelineArtworkLayer.zoomToShowLayer(
          marker,
          () => {
            map.setView(
              marker.getLatLng(),
              Math.max(map.getZoom(), 10)
            );

            marker.openPopup();
          }
        );
      }
    });

    searchResults.appendChild(button);
  });
}

function updateSearch() {
  const matches = getSearchMatches();

  renderSearchResults(matches);

  // Tell internal.js which artworks match all filters.
  window.dispatchEvent(
    new CustomEvent("timecanvas:search-changed", {
      detail: {
        artworks: matches
      }
    })
  );
}

// Initialize search when internal.js loads artwork data.
function initializeSearch(collection) {
  if (!Array.isArray(collection)) return;

  searchCollection = collection;
  populateSearchFilters();
  updateSearch();
}

window.addEventListener(
  "timecanvas:artworks-loaded",
  event => {
    initializeSearch(event.detail.artworks);
  }
);

// Update search results when the timeline changes.
document.addEventListener(
  "timelineChange",
  event => {
    searchStartYear = event.detail.startYear;
    searchEndYear = event.detail.endYear;

    updateSearch();
  }
);

// Search as the user types.
searchInput.addEventListener("input", updateSearch);

styleFilter.addEventListener("change", updateSearch);
periodFilter.addEventListener("change", updateSearch);

// Clear search filters without changing the timeline.
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  styleFilter.value = "";
  periodFilter.value = "";

  updateSearch();
  searchInput.focus();
});

// If artwork data loaded before this script initialized,
// use the collection already held by internal.js.
if (typeof artworks !== "undefined" && artworks.length) {
  initializeSearch(artworks);
}
