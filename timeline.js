
/* TimeCanvas — Single Year and Custom Date Range */

const MIN_YEAR = 1000;
const MAX_YEAR = 2026;

const centurySelect =
  document.getElementById("century-select");
const yearFrom =
  document.getElementById("year-from");
const yearTo =
  document.getElementById("year-to");
const selectedYear =
  document.getElementById("selected-year");
const timelineCount =
  document.getElementById("timeline-count");
const resetTimeline =
  document.getElementById("reset-timeline");
const showArtworksButton =
  document.getElementById("show-artworks");

let selectedStartYearTimeline = MIN_YEAR;
let selectedEndYearTimeline = MAX_YEAR;

// Publish the applied date range to the map.
function updateTimeline() {
  const start = selectedStartYearTimeline;
  const end = selectedEndYearTimeline;

  selectedYear.textContent = start === end
    ? `Selected year: ${start}`
    : `Selected period: ${start}–${end}`;

  resetTimeline.disabled =
    start === MIN_YEAR && end === MAX_YEAR;

  document.dispatchEvent(
    new CustomEvent("timelineChange", {
      detail: {
        startYear: start,
        endYear: end
      }
    })
  );
}

// Validate and apply user-entered dates.
function showAvailableArtworks() {
  const fromText = yearFrom.value.trim();
  const toText = yearTo.value.trim();

  if (fromText === "" && toText === "") {
    resetTimelineSelection();
    return;
  }

  if (fromText === "") {
    selectedYear.textContent =
      "Please enter a year in the first field.";
    return;
  }

  const start = Number(fromText);
  const end = toText === ""
    ? start
    : Number(toText);

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < MIN_YEAR ||
    start > MAX_YEAR ||
    end < MIN_YEAR ||
    end > MAX_YEAR ||
    start > end
  ) {
    selectedYear.textContent =
      `Enter a valid year or range between ${MIN_YEAR} and ${MAX_YEAR}.`;
    return;
  }

  selectedStartYearTimeline = start;
  selectedEndYearTimeline = end;

  centurySelect.value = "";
  updateTimeline();
}

// Apply only when the button is clicked.
showArtworksButton.addEventListener(
  "click",
  showAvailableArtworks
);

// Enter key can also submit a completed range.
[yearFrom, yearTo].forEach(input => {
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      showAvailableArtworks();
    }
  });
});

// Populate the century dropdown.
function populateCenturies() {
  centurySelect.replaceChildren(
    new Option("All dates / custom range", "")
  );

  for (let year = MIN_YEAR; year <= 2000; year += 100) {
    const centuryNumber = year / 100 + 1;

    const suffix =
      centuryNumber % 100 >= 11 &&
      centuryNumber % 100 <= 13
        ? "th"
        : centuryNumber % 10 === 1
          ? "st"
          : centuryNumber % 10 === 2
            ? "nd"
            : centuryNumber % 10 === 3
              ? "rd"
              : "th";

    centurySelect.add(
      new Option(
        `${year}s (${centuryNumber}${suffix} century)`,
        String(year)
      )
    );
  }
}

// Selecting a century filters immediately.
centurySelect.addEventListener("change", () => {
  if (centurySelect.value === "") {
    resetTimelineSelection();
    return;
  }

  const century = Number(centurySelect.value);

  selectedStartYearTimeline = century;
  selectedEndYearTimeline = Math.min(
    century + 99,
    MAX_YEAR
  );

  yearFrom.value = selectedStartYearTimeline;
  yearTo.value = selectedEndYearTimeline;

  updateTimeline();
});

// Restore the full 1000–2026 period.
function resetTimelineSelection() {
  selectedStartYearTimeline = MIN_YEAR;
  selectedEndYearTimeline = MAX_YEAR;

  yearFrom.value = "";
  yearTo.value = "";
  centurySelect.value = "";

  updateTimeline();
}

resetTimeline.addEventListener(
  "click",
  resetTimelineSelection
);

// Update the number of matching artworks.
document.addEventListener(
  "timelineResultsUpdated",
  event => {
    const count = event.detail?.count ?? 0;
    const mappedCount =
      event.detail?.mappedCount ?? 0;

    timelineCount.textContent =
      `${count} matching artworks · ${mappedCount} on map`;
  }
);

// Handle artwork selection from search.
window.addEventListener(
  "timecanvas:artwork-selected",
  event => {
    const artwork = event.detail?.artwork;

    if (!artwork || artwork.date_start == null) {
      return;
    }

    const year = Number(artwork.date_start);

    if (
      !Number.isFinite(year) ||
      year < MIN_YEAR ||
      year > MAX_YEAR
    ) {
      return;
    }

    // Show the exact artwork year.
    selectedStartYearTimeline = year;
    selectedEndYearTimeline = year;

    yearFrom.value = year;
    yearTo.value = "";

    centurySelect.value = "";
    updateTimeline();

    // Navigate to the artwork marker.
    if (
      typeof artworkMarkers !== "undefined" &&
      typeof timelineArtworkLayer !== "undefined" &&
      typeof map !== "undefined"
    ) {
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
    }
  }
);

// Initialize.
yearFrom.min = MIN_YEAR;
yearFrom.max = MAX_YEAR;
yearTo.min = MIN_YEAR;
yearTo.max = MAX_YEAR;

populateCenturies();
resetTimelineSelection();
