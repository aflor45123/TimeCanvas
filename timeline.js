// TimeCanvas Timeline

const timelineSlider = document.getElementById("timeline-slider");
const selectedYear = document.getElementById("selected-year");
const startYear = document.getElementById("start-year");
const endYear = document.getElementById("end-year");

const previousCentury = document.getElementById("previous-century");
const nextCentury = document.getElementById("next-century");

const previousMillennium = document.getElementById("previous-millennium");
const nextMillennium = document.getElementById("next-millennium");

// Timeline configuration
const MIN_YEAR = 0;
const MAX_YEAR = 3000;
const RANGE_SIZE = 1000;
const CENTURY_STEP = 100;

let rangeStart = 1000;
let currentYear = 1500;

// Update timeline display
function updateTimeline() {
    timelineSlider.min = rangeStart;
    timelineSlider.max = rangeStart + RANGE_SIZE - CENTURY_STEP;
    timelineSlider.value = currentYear;

    startYear.textContent = rangeStart;
    endYear.textContent = rangeStart + RANGE_SIZE;

    selectedYear.textContent = `${currentYear}s`;

    previousCentury.disabled = currentYear <= MIN_YEAR;
    nextCentury.disabled = currentYear >= MAX_YEAR - CENTURY_STEP;

    previousMillennium.disabled = rangeStart <= MIN_YEAR;
    nextMillennium.disabled = rangeStart + RANGE_SIZE >= MAX_YEAR;

    // Notify the map when a century is selected
    document.dispatchEvent(new CustomEvent("timelineChange", {
        detail: {
            startYear: currentYear,
            endYear: currentYear + 99
        }
    }));
}

// Move the slider
timelineSlider.addEventListener("input", function () {
    currentYear = Number(this.value);
    updateTimeline();
});

// Previous century
previousCentury.addEventListener("click", function () {
    if (currentYear > MIN_YEAR) {
        currentYear -= CENTURY_STEP;

        if (currentYear < rangeStart) {
            rangeStart -= RANGE_SIZE;
        }

        updateTimeline();
    }
});

// Next century
nextCentury.addEventListener("click", function () {
    if (currentYear < MAX_YEAR - CENTURY_STEP) {
        currentYear += CENTURY_STEP;

        if (currentYear >= rangeStart + RANGE_SIZE) {
            rangeStart += RANGE_SIZE;
        }

        updateTimeline();
    }
});

// Previous 1000 years
previousMillennium.addEventListener("click", function () {
    if (rangeStart > MIN_YEAR) {
        rangeStart -= RANGE_SIZE;
        currentYear = rangeStart;
        updateTimeline();
    }
});

// Next 1000 years
nextMillennium.addEventListener("click", function () {
    if (rangeStart + RANGE_SIZE < MAX_YEAR) {
        rangeStart += RANGE_SIZE;
        currentYear = rangeStart;
        updateTimeline();
    }
});

// Initialize timeline
updateTimeline();