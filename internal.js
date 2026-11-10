const worldBounds = [[-90, -180], [90, 180]];

const artworkCoordinates = {
    111628: [40.7128, -74.0060],  // Nighthawks
    28067: [41.3851, 2.1734],    // The Old Guitarist
    27992: [48.8738, 2.9530],    // La Grande Jatte
    6565: [41.9779, -91.6656],   // American Gothic
    20684: [48.8838, 2.3130]    // Paris Street; Rainy Day
};

const map = L.map("map", {
    crs: L.CRS.EPSG4326,
    zoomSnap: 0,
}).fitBounds(worldBounds);

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

/*const artworkPopup = `
    <article class="art-popup">
        <img src="images/sample-artwork.jpg" alt="Describe the artwork">
        <div>
            <h2>Artwork Title</h2>
            <p>Artist Name</p>
            <p>Florence, Italy</p>
        </div>
    </article>
`;

L.marker([43.7696, 11.2558])
    .addTo(map)
    .bindPopup(artworkPopup, {
        maxWidth: 200,
        autoPanPaddingTopLeft: [12, 24],
        autoPanPaddingBottomRight: [12, 12]
});*/

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

    container.appendChild(info);

    return container;
}

// Load artwork data and generate markers
async function loadArtworks() {
    try {
        const response = await fetch("./data/artworks.json");

        if (!response.ok) {
            throw new Error(
                `Could not load artworks.json: ${response.status}`
            );
        }

        const artworks = await response.json();

        artworks.forEach(artwork => {
            const coordinates = artworkCoordinates[artwork.id];

            const marker = L.marker(coordinates)
                .addTo(map);

            marker.bindPopup(
                createArtworkPopup(artwork),
                {
                    maxWidth: 350,
                    autoPanPaddingTopLeft: [12, 24],
                    autoPanPaddingBottomRight: [12, 12]
                }
            );
            marker.bindTooltip(artwork.title);

        });

    } catch (error) {
        console.error("Artwork loading error:", error);
    }
}

loadArtworks();
