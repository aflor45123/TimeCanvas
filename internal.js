
/* TimeCanvas — Interactive Art History Map */

// Initialize Leaflet map.
const worldBounds = [
    [-90, -180],
    [90, 180]
  ];
  
  const map = L.map("map", {
    crs: L.CRS.EPSG4326,
    zoomSnap: 0,
    maxZoom: 17
  }).fitBounds(worldBounds);
  
  map.zoomControl.setPosition("topright");
  map.setMinZoom(map.getZoom());
  
  // Load country boundaries.
  fetch("./world-countries.geojson")
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not load world map");
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
          const name =
            feature.properties?.ADMIN ||
            feature.properties?.name ||
            "Unknown country";
  
          layer.bindTooltip(name, {
            sticky: true
          });
        }
      }).addTo(map);
    })
    .catch(error => {
      console.error("Map loading error:", error);
    });
  
  // Artwork marker layer.
  const timelineArtworkLayer =
    L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true
    }).addTo(map);
  
  const artworkMarkers = new Map();
  
  // State.
  let artworks = [];
  let selectedStartYear = 1000;
  let selectedEndYear = 2026;
  let searchArtworkIds = null;
  
  // Artwork detail elements.
  const artworkDetailPanel =
    document.getElementById("artwork-detail-panel");
  
  const artworkDetailContent =
    document.getElementById("artwork-detail-content");
  
  const closeArtworkDetails =
    document.getElementById("close-artwork-details");
  
  // Close artwork details.
  closeArtworkDetails.addEventListener("click", () => {
    artworkDetailPanel.hidden = true;
  });
  
  // Display artwork information.
  function showArtworkDetails(artwork) {
    artworkDetailContent.replaceChildren();
  
    const title = document.createElement("h2");
    title.textContent =
      artwork.title || "Untitled artwork";
  
    artworkDetailContent.appendChild(title);
  
    if (artwork.image_url) {
      const image = document.createElement("img");
      image.src = artwork.image_url;
      image.alt = artwork.title || "Artwork image";
      image.loading = "lazy";
  
      artworkDetailContent.appendChild(image);
    }
  
    const fields = [
      ["Artist", artwork.artist],
      ["Start year", artwork.date_start],
      ["End year", artwork.date_end],
      ["Art style", artwork.style],
      ["Place of origin", artwork.place_of_origin],
      ["Medium", artwork.medium]
    ];
  
    fields.forEach(([label, value]) => {
      if (value === undefined ||
          value === null ||
          value === "") {
        return;
      }
  
      const paragraph = document.createElement("p");
      paragraph.textContent = `${label}: ${value}`;
  
      artworkDetailContent.appendChild(paragraph);
    });
  
    if (artwork.short_description) {
      const description = document.createElement("p");
      description.textContent = artwork.short_description;
  
      artworkDetailContent.appendChild(description);
    }
  
    artworkDetailPanel.hidden = false;
  }
  
  // Create artwork marker popup.
  function createArtworkPopup(artwork) {
    const container = document.createElement("article");
    container.className = "art-popup";
  
    if (artwork.image_url) {
      const image = document.createElement("img");
      image.src = artwork.image_url;
      image.alt = artwork.title || "Artwork";
      image.loading = "lazy";
  
      container.appendChild(image);
    }
  
    const information = document.createElement("div");
  
    const title = document.createElement("h2");
    title.textContent = artwork.title || "Untitled";
  
    const artist = document.createElement("p");
    artist.textContent =
      `Artist: ${artwork.artist || "Unknown"}`;
  
    const year = document.createElement("p");
    year.textContent =
      `Year: ${artwork.date_start ?? "Unknown"}`;
  
    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.className = "art-popup-more";
    moreButton.textContent = "More Information";
  
    moreButton.addEventListener("click", () => {
      showArtworkDetails(artwork);
    });
  
    information.append(
      title,
      artist,
      year,
      moreButton
    );
  
    container.appendChild(information);
  
    return container;
  }
  
  // Check whether artwork dates overlap the selected range.
  function artworkMatchesTimeline(artwork) {
    if (
      artwork.date_start == null ||
      artwork.date_end == null ||
      artwork.date_start === "" ||
      artwork.date_end === ""
    ) {
      return false;
    }
  
    const start = Number(artwork.date_start);
    const end = Number(artwork.date_end);
  
    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start > end
    ) {
      return false;
    }
  
    return (
      start <= selectedEndYear &&
      end >= selectedStartYear
    );
  }
  
  // Update visible artwork markers.
  function displayArtworks() {
    timelineArtworkLayer.clearLayers();
    artworkMarkers.clear();
  
    const matchingArtworks = artworks.filter(artwork => {
      const matchesTimeline =
        artworkMatchesTimeline(artwork);
  
      const matchesSearch =
        searchArtworkIds === null ||
        searchArtworkIds.has(String(artwork.id));
  
      return matchesTimeline && matchesSearch;
    });
  
    matchingArtworks.forEach(artwork => {
      const coordinates = artwork.coordinates;
  
      if (!coordinates) return;
  
      const lat = Number(coordinates.latitude);
      const lng = Number(coordinates.longitude);
  
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180
      ) {
        return;
      }
  
      const marker = L.marker([lat, lng]);
  
      marker.bindPopup(
        createArtworkPopup(artwork),
        { maxWidth: 350 }
      );
  
      marker.bindTooltip(
        artwork.title || "Artwork"
      );
  
      timelineArtworkLayer.addLayer(marker);
      artworkMarkers.set(artwork.id, marker);
    });
  
    document.dispatchEvent(
      new CustomEvent("timelineResultsUpdated", {
        detail: {
          count: matchingArtworks.length,
          mappedCount: artworkMarkers.size
        }
      })
    );
  }
  
  // Listen for timeline filtering.
  document.addEventListener(
    "timelineChange",
    event => {
      selectedStartYear = event.detail.startYear;
      selectedEndYear = event.detail.endYear;
  
      displayArtworks();
    }
  );
  
  // Listen for search filtering.
  window.addEventListener(
    "timecanvas:search-changed",
    event => {
      const results = event.detail?.artworks;
  
      if (!Array.isArray(results)) {
        searchArtworkIds = null;
      } else {
        searchArtworkIds = new Set(
          results.map(artwork => String(artwork.id))
        );
      }
  
      displayArtworks();
    }
  );
  
  // Load artwork collection.
  fetch("./data/artworks.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `Could not load artworks: ${response.status}`
        );
      }
  
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error(
          "artworks.json must contain an array"
        );
      }
  
      artworks = data;
  
      // Render the initial full collection.
      displayArtworks();
  
      // Notify other components.
      document.dispatchEvent(
        new CustomEvent("timecanvas:artworks-loaded", {
          detail: {
            artworks: artworks
          }
        })
      );
  
      window.dispatchEvent(
        new CustomEvent("timecanvas:artworks-loaded", {
          detail: {
            artworks: artworks
          }
        })
      );
    })
    .catch(error => {
      console.error("Artwork loading error:", error);
  
      const status =
        document.getElementById("timecanvasSearchStatus");
  
      if (status) {
        status.textContent = "Unable to load artworks.";
      }
    });
  