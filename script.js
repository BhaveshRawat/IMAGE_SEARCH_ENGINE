const imageWrapper = document.querySelector(".images");  // Represents the container for holding the gallery images
const searchInput = document.querySelector(".search input"); //Represents the input field where users can search for images.
const loadMoreBtn = document.querySelector(".gallery .load-more");  // Represents the "Load More" button in the gallery.
const lightbox = document.querySelector(".lightbox"); //: Represents the lightbox container for displaying enlarged images.
const downloadImgBtn = lightbox.querySelector(".uil-import");  // Represents the download button within the lightbox.
const closeImgBtn = lightbox.querySelector(".close-icon");  //Represents the close button within the lightbox.

// API key, paginations, searchTerm variables
const apiKey = "rqpUdwouykYZld2IOhDLf3RlUIUKRpOFVv1GxFesWNbouzHa0hRV7Vwm";
const perPage = 15;  // Determines the number of images to load per page.
let currentPage = 1;  //Tracks the current page number of images being displayed.
let searchTerm = null;  // Stores the search term entered by the use


//this funtion --Downloads an image by fetching its URL as a blob, creating a download link, and triggering a click event on the link.
const downloadImg = (imgUrl) => {
    fetch(imgUrl).then(res => res.blob()).then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

//Displays the lightbox container with the provided image and photographer's name.
const showLightbox = (name, img) => {
    // Showing lightbox and setting img source, name and button attribute
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightbox.classList.add("show");  //Disables body scrolling while the lightbox is open.
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    // Hiding lightbox on close icon click
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";  //Restores normal body scrolling.
}
//Creates HTML markup for each image received from the API.
const generateHTML = (images) => {

    // Making li of all fetched images and adding them to the existing image wrapper
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card">
            <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

// Fetches images from the Pexels API using the provided API URL and authorization header.
// Updates UI elements during and after API requests, including loading state and error handling.
const getImages = (apiURL) => {
    // Fetching images by API call with authorization header
    searchInput.blur();
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    // If searchTerm has some value then call API with search term else call default API
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);   //to load more images 
}

const loadSearchImages = (e) => {
    // If the search input is empty, set the search term to null and return from here
    if (e.target.value === "") return searchTerm = null;
    // If pressed key is Enter, update the current page, search term & call the getImages
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
}
//Event Listeners:
// Listens for clicks on the "Load More" button and search input field to trigger corresponding functions.
// Handles clicks on the close button and download button within the lightbox.
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));



// Initial API Call:
// Calls getImages to initially load a set of curated images from the Pexels API.