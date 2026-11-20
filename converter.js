const fs = require("node:fs/promises");
const path = require("node:path");
// Art Institute API configuration
const api_url = "https://api.artic.edu/api/v1/artworks";
const iiif_url = "https://www.artic.edu/iiif/2";
//shorthands for directorys
const imageDirectory = path.join(__dirname, "images");
const cachePath = path.join(__dirname, "data/location-cache.json");
//used to retrieve coordinates
const geocodingUrl = "https://nominatim.openstreetmap.org/search";
//put in email only when running to retrieve coordinates, otherwise leave blank
const userAgent = "ArtOriginMap/1.0 (contact: email@here)";

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
    "web_url"
];

const eligibleArtworkTypes = [
    "Painting",
    "Print",
    "Drawing and Watercolor"
];

const retrievalConfig = {
    pageSize: 10,
    maxResultsPerKeyword: 6,
    maxPagesPerKeyword: 1
};

const movementKeywords = [
    "Impressionism",
    "Post-Impressionism",
    "Surrealism",
    "Renaissance",
    "Modernism",
    "18th Century",
];

const artistKeywords = [
    "Vincent van Gogh",
    "Claude Monet",
    "Pablo Picasso",
    "Georgia O'Keeffe",
    "Pierre-Auguste Renoir",
    "Rembrandt van Rijn",
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

async function fetchSearchResults(keyword, page = 1) {
    const params = new URLSearchParams({
        params: JSON.stringify({
            q: keyword,
            query: {
                terms: {
                    "artwork_type_title.keyword": eligibleArtworkTypes
                }
            },
            size: retrievalConfig.pageSize,
            page: page,
            fields: [
                "id",
                "title",
                "artist_title",
                "artist_titles",
                "artwork_type_title",
                "classification_title",
                "medium_display",
                "style_title",
                "style_titles"
            ]
        })
    });

    const response = await fetch(`${api_url}/search?${params}`);

    if (!response.ok) {
        throw new Error(
            `Search request failed: ${response.status}`
        );
    }

    return await response.json();
}

function normalizeKeyword(value) {
    return value?.trim().toLowerCase() ?? "";
}

function filterSearchResults(results, keyword, searchType) {
    const target = normalizeKeyword(keyword);

    return (results.data ?? []).filter(artwork => {
        if (!eligibleArtworkTypes.includes(artwork.artwork_type_title)) {
            return false;
        }

        const metadata = searchType === "movement"
            ? artwork.style_titles
            : artwork.artist_titles;

        return Array.isArray(metadata) &&
            metadata.some(value => normalizeKeyword(value) === target);
    });
}

async function fetchKeywordArtworks() {
    const keywords = [
        ...movementKeywords.map(keyword => ({
            keyword,
            type: "movement"
        })),
        ...artistKeywords.map(keyword => ({
            keyword,
            type: "artist"
        }))
    ];

    const artworks = new Map();
    let requestCount = 0;

    for (const { keyword, type } of keywords) {
        let matchedCount = 0;

        for (
            let page = 1;
            page <= retrievalConfig.maxPagesPerKeyword &&
            matchedCount < retrievalConfig.maxResultsPerKeyword;
            page++
        ) {
            // Respect the API request interval.
            if (requestCount > 0) {
                await new Promise(resolve =>
                    setTimeout(resolve, 1100)
                );
            }

            const results = await fetchSearchResults(keyword, page);
            requestCount++;

            const filtered = filterSearchResults(
                results,
                keyword,
                type
            );

            const remaining =
                retrievalConfig.maxResultsPerKeyword - matchedCount;

            const selected = filtered.slice(0, remaining);

            for (const artwork of selected) {
                artworks.set(artwork.id, artwork);
            }

            matchedCount += selected.length;

            // No more results to retrieve.
            if (!results.data || results.data.length === 0) {
                break;
            }
        }

        console.log(
            `${keyword}: ${matchedCount} artworks retrieved`
        );
    }

    return [...artworks.values()];
}

async function fetchAllArtworks() {
    const keywordArtworks = await fetchKeywordArtworks();

    const artworkIds = keywordArtworks.map(artwork => artwork.id);

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

async function downloadArtworkImages(artworks) {
    await fs.mkdir(imageDirectory, { recursive: true });

    for (const artwork of artworks) {
        if (!artwork.image_url) {
            console.log(`Skipping ${artwork.id}: no image URL`);
            continue;
        }

        const imagePath = path.join(
            imageDirectory,
            `${artwork.id}.jpg`
        );

        // Skip images that have already been downloaded
        try {
            await fs.access(imagePath);
            artwork.image_url = `images/${artwork.id}.jpg`;
            console.log(`Already downloaded: ${artwork.title}`);
            continue;
        } catch {
            // File doesn't exist, so continue with download
        }

        try {
            const response = await fetch(artwork.image_url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const contentType = response.headers.get("content-type");

            if (!contentType?.startsWith("image/")) {
                throw new Error(`Unexpected content type: ${contentType}`);
            }

            const imageBuffer = Buffer.from(
                await response.arrayBuffer()
            );

            await fs.writeFile(imagePath, imageBuffer);

            // Replace remote URL with local path
            artwork.image_url = `images/${artwork.id}.jpg`;

            console.log(`Downloaded: ${artwork.title}`);

        } catch (error) {
            console.error(
                `Failed to download ${artwork.title}:`,
                error.message
            );

            artwork.image_url = null;
        }

        // Wait one second before the next request
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Normalize a location name for consistent lookups
function normalizeLocation(place) {
    return place
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

// Read the location cache
async function loadLocationCache() {
    try {
        const contents = await fs.readFile(cachePath, "utf8");
        return JSON.parse(contents);
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }

        throw error;
    }
}

// Retrieve a location from the cache
function getCachedLocation(place, cache) {
    if (!place || typeof place !== "string") {
        return null;
    }

    const key = normalizeLocation(place);

    return cache[key] || null;
}

// Add or update a location in the cache
async function saveCachedLocation(place, location, cache) {
    const key = normalizeLocation(place);

    cache[key] = location;

    await fs.mkdir(path.dirname(cachePath), {
        recursive: true
    });

    await fs.writeFile(
        cachePath,
        JSON.stringify(cache, null, 4),
        "utf8"
    );
}

// Ensure requests are spaced at least 1.1 seconds apart
let lastGeocodingRequest = 0;

async function geocodeLocation(place) {
    const elapsed = Date.now() - lastGeocodingRequest;
    const delay = Math.max(0, 1100 - elapsed);

    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    const params = new URLSearchParams({
        q: place,
        format: "jsonv2",
        limit: "1",
        addressdetails: "1"
    });

    lastGeocodingRequest = Date.now();

    const response = await fetch(
        `${geocodingUrl}?${params}`,
        {
            headers: {
                "User-Agent": userAgent
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Geocoding failed: HTTP ${response.status}`);
    }

    const results = await response.json();

    if (results.length === 0) {
        return null;
    }

    const result = results[0];

    return {
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        resolved_name: result.display_name,
        precision: result.addresstype || "unknown"
    };
}

async function getLocation(place, cache) {
    if (!place || typeof place !== "string") {
        return null;
    }

    // Check the cache first
    const cachedLocation = getCachedLocation(place, cache);

    if (cachedLocation) {
        console.log(`Using cached location: ${place}`);
        return cachedLocation;
    }

    // If not cached, geocode the location
    console.log(`Geocoding: ${place}`);

    const location = await geocodeLocation(place);

    if (!location) {
        console.log(`No location found: ${place}`);
        return null;
    }

    // Save the new location
    await saveCachedLocation(place, location, cache);

    console.log(`Location saved: ${location.resolved_name}`);

    return location;
}


async function addArtworkCoordinates(artworks, cache) {
    for (const artwork of artworks) {
        const place = artwork.place_of_origin;

        // Skip artworks without a place of origin
        if (!place) {
            console.log(`Skipping ${artwork.title}: no place of origin`);
            artwork.coordinates = null;
            continue;
        }

        try {
            const location = await getLocation(place, cache);

            if (location) {
                artwork.coordinates = {
                    latitude: location.latitude,
                    longitude: location.longitude
                };
            } else {
                artwork.coordinates = null;
            }

        } catch (error) {
            console.error(
                `Failed to locate ${artwork.title}:`,
                error.message
            );

            artwork.coordinates = null;
        }
    }

    return artworks;
}


// Main execution
async function main() {
    try {
        console.log("Retrieving artwork data...");

        const apiResponse = await fetchAllArtworks();

        const artworks = convertArtworks(apiResponse);

        const cache = await loadLocationCache();

        await addArtworkCoordinates(artworks, cache);

        await downloadArtworkImages(artworks);

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