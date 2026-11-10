const fs = require("node:fs/promises");
const path = require("node:path");

// Art Institute API configuration
const api_url = "https://api.artic.edu/api/v1/artworks";
const iiif_url = "https://www.artic.edu/iiif/2";

// Our initial curated artwork collection
const artworkIds = [
    111628, // Nighthawks
    28067,  // The Old Guitarist
    27992,  // A Sunday on La Grande Jatte
    6565,   // American Gothic
    20684   // Paris Street; Rainy Day
];

// Fields we want from the API
const fields = [
    "id",
    "title",
    "artist_title",
    "date_start",
    "date_end",
    "date_display",
    "style_title",
    "medium_display",
    "place_of_origin",
    "description",
    "short_description",
    "image_id",
    "is_public_domain",
    "web_url"
];

// Convert an individual artwork
function convertArtwork(artwork, iiifUrl) {
    return {
        id: artwork.id,

        title: artwork.title,
        artist: artwork.artist_title,

        date_start: artwork.date_start,
        date_end: artwork.date_end,
        date_display: artwork.date_display,

        movement: artwork.style_title,
        medium: artwork.medium_display,

        short_description: artwork.short_description || "",

        description: artwork.description || "",

        place_of_origin: artwork.place_of_origin,

        image_id: artwork.image_id,

        image_url: artwork.image_id
            ? `${iiifUrl}/${artwork.image_id}/full/843,/0/default.jpg`
            : null,

        source: "Art Institute of Chicago",
    };
}

// Convert the complete API response
function convertArtworks(apiResponse) {
    const iiifUrl = apiResponse.config?.iiif_url || iiif_url;

    return apiResponse.data.map(artwork =>
        convertArtwork(artwork, iiifUrl)
    );
}

// Retrieve artwork data from the API
async function fetchArtworks() {
    const params = new URLSearchParams({
        ids: artworkIds.join(","),
        fields: fields.join(",")
    });

    const response = await fetch(`${api_url}?${params}`);

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    return await response.json();
}

// Main execution
async function main() {
    try {
        console.log("Retrieving artwork data...");

        const apiResponse = await fetchArtworks();

        const artworks = convertArtworks(apiResponse);

        // Check that all requested artworks were returned
        const returnedIds = new Set(
            artworks.map(artwork => artwork.id)
        );

        const missingIds = artworkIds.filter(
            id => !returnedIds.has(id)
        );

        if (missingIds.length > 0) {
            throw new Error(
                `Missing artwork IDs: ${missingIds.join(", ")}`
            );
        }

        // Export JSON file
        const outputPath = path.join(
            __dirname,
            "data/artworks.json"
        );

        await fs.mkdir(path.dirname(outputPath), {
            recursive: true
        });

        await fs.writeFile(
            outputPath,
            JSON.stringify(artworks, null, 4),
            "utf8"
        );

        console.log("Artwork data successfully exported!");
        console.log(`Total artworks: ${artworks.length}`);
        console.log(`Output: ${outputPath}`);

    } catch (error) {
        console.error("Error processing artwork data:", error);
    }
}

// Run the script
main();