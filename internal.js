const worldBounds = [[-90, -180], [90, 180]];

const map = L.map("map", {
    crs: L.CRS.EPSG4326,
    zoomSnap: 0,
    maxZoom: 17,
}).fitBounds(worldBounds);

map.zoomControl.setPosition("topright");
map.setMinZoom(map.getZoom());

fetch("./world-countries.geojson")
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not load world-countries.geojson (${response.status})');
        }
        return response.json();
    })
    .then(countries => {
        L.geoJSON(countries, {
            style: {
                color: "#797979",
                weight: 1,
                fillColor: "#ffffff",
                fillOpacity: 1
            },
            onEachFeature(feature, layer) {
                const name = feature.properties.ADMIN;
                layer.bindTooltip(name, {sticky: true});
                layer.bindPopup(name);

                /*const country = feature.properties;

                if (country.LABELRANK <= 3) {
                    layer.bindTooltip(country.ADMIN, {
                        permanent: true,
                        direction: "center",
                        className: "country-label"
                    }).openTooltip([country.LABEL_Y, country.LABEL_X]);
                } else {
                    layer.bindTooltip(country.ADMIN, {sticky: true});
                }*/
            }
        }).addTo(map);
    })
    .catch(error => console.error(error));

// Create artwork popup content
function createArtworkPopup(artwork) {
    const container = document.createElement("article");
    container.className = "art-popup";

    // Artwork image
    if (artwork.image_url) {
        const image = document.createElement("img");

        image.src = artwork.image_url;
        image.alt = artwork.title || "Artwork";
        image.loading = "lazy";

        container.appendChild(image);
    }

    // Artwork information
    const info = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = artwork.title || "Untitled";

    const artist = document.createElement("p");
    const artistLabel = document.createElement("span");
    artistLabel.textContent = "Artist: ";
    artistLabel.className = "popup-label";
    artist.append(
        artistLabel,
        artwork.artist || "Unknown artist"
    );

    const location = document.createElement("p");
    const locationLabel = document.createElement("span");
    locationLabel.textContent = "Location: ";
    locationLabel.className = "popup-label";
    location.append(
        locationLabel,
        artwork.place_of_origin || "Unknown location"
    );

    info.append(
        title,
        artist,
        location,
    );

    const moreInformation = document.createElement("button");
    moreInformation.type = "button";
    moreInformation.className = "art-popup-more";
    moreInformation.textContent = "More information";
    moreInformation.addEventListener("click", () => {
        showingTheSelectedArtworkInformationTimeCanvas(artwork, false);
    });
    info.appendChild(moreInformation);

    container.appendChild(info);

    return container;
}



// Timeline artwork filtering

const timelineArtworkLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true
}).addTo(map);

const artworkMarkers = new Map();
let artworks = [];
let selectedStartYear = 1500;
let selectedEndYear = 1599;

// Load artwork data
fetch("./data/artworks.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load artwork data");
        }
        return response.json();
    })
    .then(data => {
        artworks = data;
        displayArtworks(selectedStartYear, selectedEndYear);
    })
    .catch(error => console.error("Artwork loading error:", error));

// Filter artworks by selected century

function displayArtworks(startYear, endYear) {
    // Remove markers from the previously selected century
    timelineArtworkLayer.clearLayers();
    artworkMarkers.clear();

    // Find artworks created during the selected century
    const matchingArtworks = artworks.filter(artwork => {
        const artworkStart = Number(artwork.date_start);
        const artworkEnd = Number(artwork.date_end);

        return artwork.date_start != null &&
            artwork.date_end != null &&
            Number.isFinite(artworkStart) &&
            Number.isFinite(artworkEnd) &&
            artworkStart <= endYear &&
            artworkEnd >= startYear;
    });

    console.log(
        `Showing ${matchingArtworks.length} artworks from ${startYear} to ${endYear}`
    );

    // Create map markers for matching artworks
    matchingArtworks.forEach(artwork => {
        const coordinates = artwork.coordinates;

        // Skip artworks without mapped coordinates
        if (!coordinates) {
            console.warn("Missing coordinates:", artwork.title);
            return;
        }

        const marker = L.marker([
            coordinates.latitude,
            coordinates.longitude
        ]).addTo(timelineArtworkLayer);

        marker.bindPopup(
            createArtworkPopup(artwork),
            {
                maxWidth: 350,
                autoPanPaddingTopLeft: [12, 24],
                autoPanPaddingBottomRight: [12, 12]
            }
        );

        marker.bindTooltip(artwork.title);
        artworkMarkers.set(artwork.id, marker);
    });
}


// Listen for timeline changes
document.addEventListener("timelineChange", function(event) {
    selectedStartYear = event.detail.startYear;
    selectedEndYear = event.detail.endYear;

    displayArtworks(selectedStartYear, selectedEndYear);
});