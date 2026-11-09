const worldBounds = [[-90, -180], [90, 180]];

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

const artworkPopup = `
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
});