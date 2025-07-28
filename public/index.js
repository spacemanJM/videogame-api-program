/*
    This programs allows the user to get information such as release date,
    rating, publishers, genres, and platforms of any game they type in.
    This programs also displays the cover art for the game, and has buttons
    that allow the user to cycle through provided images for each specific game.

    This program utilizes the RAWG Video Games Database API to retrieve the info
*/

// Get HTML elements by class using querySelector()
const gameForm = document.querySelector(".gameForm");
const gameInput = document.querySelector(".gameInput");
const card = document.querySelector(".card");

// Try fetching game data when user hits button, display error if any
gameForm.addEventListener("submit", async event => {
    event.preventDefault(); // stops the webpage from refreshing

    const game = encodeURIComponent(gameInput.value); // make string URL safe

    // Check if user entered a game, if so fetch and display data, if not display error
    if(game) {
        try {
            const gameData = await fetchGameData(game);
            displayGameData(gameData);
        } catch(error) {
            displayError("Could not fetch game data");
        }
    } else {
        displayError("Please enter a game");
    }
});

/* 
    Fetches the data from the API using the user input
    Retrives the game slug from the first response object
    Fetches again with the slug to find data for specific game user entered
*/
async function fetchGameData(game) {
    const apiUrl = `http://localhost:3000/api/games?search=${game}`;
    const response = await fetch(apiUrl);

    if(!response.ok) {
        throw new Error("Could not fetch game list");
    }

    const initialData = await response.json();

    if(!initialData.results || initialData.results.length === 0) {
        throw new Error("No games found");
    }

    const gameSlug = initialData.results[0].slug;
    const slugUrl = `http://localhost:3000/api/games/${gameSlug}`;
    const detailedResponse = await fetch(slugUrl);

    if(!detailedResponse.ok) {
        throw new Error("Could not fetch game details");
    }
    return await detailedResponse.json();
}

/*
    Retrieve game details to display
    Sets style for card container
    Creates all necessary HTML elements to hold game data
    Set each HTML element's content to corresponding data
    Add CSS class for styling
    Append each element to the DOM
*/
function displayGameData(data) {
    console.log(data);

    const gameName = data.name;
    const image1 = data.background_image;
    const image2 = data.background_image_additional;
    const releaseDate = data.released.split("-");
    const rating = data.rating;
    const publishers = data.publishers.map(publisher => publisher.name).join(", ");
    const genres = data.genres.map(genre => genre.name).join(", ");
    const platforms = data.platforms.map(platform => platform.platform.name).join(", ");
    const esrbRating = data.esrb_rating.name;
    const developers = data.developers.map(developer => developer.name).join(", ");

    card.textContent = "";
    card.style.display = "flex";
    card.style.visibility = "visible";

    const gameNameDisplay = document.createElement("h1");
    const gameImageDisplay = document.createElement("img");
    const releaseDateDisplay = document.createElement("p");
    const ratingDisplay = document.createElement("p");
    const publisherDisplay = document.createElement("p");
    const genreDisplay = document.createElement("p");
    const platformDisplay = document.createElement("p");
    const esrbDisplay = document.createElement("p");
    const developerDisplay = document.createElement("p");
    const prevImageButton = document.createElement("button");
    const nextImageButton = document.createElement("button");

    gameNameDisplay.textContent = gameName;
    gameImageDisplay.src = image1;
    releaseDateDisplay.textContent = `Release Date: ${releaseDate[1]}-${releaseDate[2]}-${releaseDate[0]}`;
    ratingDisplay.textContent = `Rating: ${rating}/5`;
    publisherDisplay.textContent = publishers == "" ? `Publisher(s): N/A` : `Publisher(s): ${publishers}`;
    genreDisplay.textContent = `Genre(s): ${genres}`;
    platformDisplay.textContent = `Platform(s): ${platforms}`;
    esrbDisplay.textContent = `ESRB: ${esrbRating}`;
    developerDisplay.textContent = `Developer(s): ${developers}`;
    prevImageButton.textContent = "<";
    nextImageButton.textContent = ">";

    prevImageButton.onclick = function() {
        if(gameImageDisplay.src == image1) {
            gameImageDisplay.src = image2;
        } else {
            gameImageDisplay.src = image1;
        }
    };

    nextImageButton.onclick = function() {
        if(gameImageDisplay.src == image1) {
            gameImageDisplay.src = image2;
        } else {
            gameImageDisplay.src = image1;
        }
    };


    gameNameDisplay.classList.add("gameNameDisplay");
    gameImageDisplay.classList.add("gameImageDisplay");
    releaseDateDisplay.classList.add("releaseDateDisplay");
    ratingDisplay.classList.add("ratingDisplay");
    publisherDisplay.classList.add("publisherDisplay");
    genreDisplay.classList.add("genreDisplay");
    platformDisplay.classList.add("platformDisplay");
    esrbDisplay.classList.add("esrbDisplay");
    developerDisplay.classList.add("developerDisplay")
    prevImageButton.classList.add("imageButtons", "prev");
    nextImageButton.classList.add("imageButtons", "next");

    card.appendChild(gameNameDisplay);
    card.appendChild(gameImageDisplay);
    card.appendChild(esrbDisplay);
    card.appendChild(ratingDisplay);
    card.appendChild(genreDisplay);
    card.appendChild(platformDisplay);
    card.appendChild(releaseDateDisplay);
    card.appendChild(developerDisplay);
    card.appendChild(publisherDisplay);
    card.appendChild(prevImageButton);
    card.appendChild(nextImageButton);

}

// Displays an error if any
function displayError(message) {
    card.textContent = "";
    card.style.display = "flex";
    card.style.visibility = "visible";

    const errorDisplay = document.createElement("h1");

    errorDisplay.textContent = (message);

    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}

// Removes any input the user has typed
function resetInput() {
    const gameInput = document.getElementById("gameInput");
    gameInput.value = "";
}

