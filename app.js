
const filterItem = document.querySelector(".items");
const gallery = document.querySelector(".gallery");
const previewBox = document.querySelector(".preview-box");
const categoryName = previewBox.querySelector(".title p");
const previewImg = previewBox.querySelector("img");
const closeIcon = previewBox.querySelector(".icon");
const shadow = document.querySelector(".shadow");
const prevBtn = previewBox.querySelector(".prev-btn");
const nextBtn = previewBox.querySelector(".next-btn");
const imageCount = previewBox.querySelector(".image-count");
const fullscreenBtn = previewBox.querySelector(".fullscreen-btn");
const downloadBtn = previewBox.querySelector(".download-btn");
let allImages = [];
let currentVisibleImages = [];
let currentImageIndex;
let fullscreenMode = false;

const imageData = [
    { src: "image/a2.jpg", alt: "Art 2", category: "art", caption: "A beautiful abstract painting." },
    { src: "image/na4.jpg", alt: "Nature 4", category: "nature", caption: "A tranquil beach with rolling waves." },
    { src: "image/n2.jpg", alt: "Place 2", category: "place", caption: "A serene mountain landscape." },
    { src: "image/na6.jpg", alt: "Nature 6", category: "nature", caption: "A serene meadow with wildflowers in bloom." },
    { src: "image/w1.jpg", alt: "Animal 1", category: "animals", caption: "A majestic lion in the savanna." },

    { src: "image/d1.jpg", alt: "Food 1", category: "food", caption: "A delicious plate of pasta." },
    { src: "image/a3.jpg", alt: "Art 3", category: "art", caption: "A vibrant street art mural." },
    { src: "image/na1.jpeg", alt: "Nature 1", category: "nature", caption: "A serene forest with sunlight filtering through the trees." },
    { src: "image/n1.jpg", alt: "Place 1", category: "place", caption: "A tranquil beach at sunset." },
    { src: "image/w2.jpg", alt: "Animal 2", category: "animals", caption: "A playful group of dolphins." },
    { src: "image/d2.jpg", alt: "Food 2", category: "food", caption: "A refreshing glass of lemonade." },
    { src: "image/na2.jpg", alt: "Nature 2", category: "nature", caption: "A beautiful sunset over a lake." },
    { src: "image/a4.webp", alt: "Art 4", category: "art", caption: "A detailed pencil sketch." },
    { src: "image/n3.jpg", alt: "Place 3", category: "place", caption: "A historic castle on a hilltop." },
    { src: "image/w3.jpg", alt: "Animal 3", category: "animals", caption: "A colorful parrot in the rainforest." },
    { src: "image/na3.jpg", alt: "Nature 3", category: "nature", caption: "A stunning waterfall surrounded by lush greenery." },
    { src: "image/d3.jpg", alt: "Food 3", category: "food", caption: "A tempting chocolate cake." },
    { src: "image/d4.jpg", alt: "Food 4", category: "food", caption: "A bowl of fresh fruit salad." },
    { src: "image/a5.jpg", alt: "Art 5", category: "art", caption: "A modern sculpture in a museum." },
    { src: "image/n4.jpg", alt: "Place 4", category: "place", caption: "A bustling city skyline at night." },
    { src: "image/d5.jpg", alt: "Food 5", category: "food", caption: "A cup of aromatic coffee." },
    { src: "image/n5.jpg", alt: "Place 5", category: "place", caption: "A peaceful countryside scene." },
    { src: "image/a6.jpg", alt: "Art 6", category: "art", caption: "An abstract digital art piece." },
    { src: "image/na5.webp", alt: "Nature 5", category: "nature", caption: "A majestic mountain range with snow-capped peaks." },
];

window.onload = () => {
    loadImages(imageData);

    filterItem.onclick = (selectedItem) => {
        if (selectedItem.target.classList.contains("item")) {
            filterItem.querySelector(".active").classList.remove("active");
            selectedItem.target.classList.add("active");
            const filterName = selectedItem.target.getAttribute("data-name");
            filterImages(filterName);
        }
    };
};

function loadImages(images) {
    gallery.innerHTML = "";
    allImages = [];
    images.forEach((image, index) => {
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("image");
        imageDiv.setAttribute("data-name", image.category);
        imageDiv.setAttribute("data-index", index);
        imageDiv.innerHTML = `<span><img src="${image.src}" alt="${image.alt}"></span><div class="caption">${image.caption}</div>`;
        gallery.appendChild(imageDiv);

        allImages.push(imageDiv);
        imageDiv.addEventListener("click", () => preview(imageDiv));
    });
    currentVisibleImages = [...allImages];
    updatePreviewNavigation();
}

function filterImages(filterName) {
    currentVisibleImages = [];
    allImages.forEach(image => {
        const category = image.getAttribute("data-name");
        if (filterName === "all" || category === filterName) {
            image.style.display = "block";
            currentVisibleImages.push(image);
        } else {
            image.style.display = "none";
        }
    });
    updatePreviewNavigation();
}

function preview(element) {
    document.querySelector("body").style.overflow = "hidden";
    const selectedPrevImg = element.querySelector("img").src;
    const selectedImgCategory = element.getAttribute("data-name");
    const originalIndex = parseInt(element.getAttribute("data-index")); // Get original index
    previewImg.src = selectedPrevImg;
    categoryName.textContent = selectedImgCategory;
    previewBox.classList.add("show");
    shadow.classList.add("show");

    currentImageIndex = currentVisibleImages.indexOf(element);
    updatePreviewNavigation();

    closeIcon.onclick = () => {
        previewBox.classList.remove("show");
        shadow.classList.remove("show");
        document.querySelector("body").style.overflow = "auto";
        exitFullscreen();
    };

    prevBtn.onclick = showPreviousImage;
    nextBtn.onclick = showNextImage;

    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.href = selectedPrevImg;
        link.download = getFileNameFromURL(selectedPrevImg);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    fullscreenBtn.onclick = () => {
        toggleFullscreen(selectedPrevImg);
    };
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + currentVisibleImages.length) % currentVisibleImages.length;
    preview(currentVisibleImages[currentImageIndex]);
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentVisibleImages.length;
    preview(currentVisibleImages[currentImageIndex]);
}

function updatePreviewNavigation() {
    imageCount.textContent = `${currentImageIndex + 1}/${currentVisibleImages.length}`;
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === currentVisibleImages.length - 1;
}

function toggleFullscreen(imageSrc) {
    if (!fullscreenMode) {
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.classList.add('fullscreen-mode');
        fullscreenDiv.innerHTML = `<img src="${imageSrc}" alt="Fullscreen Image">`;
        document.body.appendChild(fullscreenDiv);
        fullscreenMode = true;

        fullscreenDiv.addEventListener('click', exitFullscreen);
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    const fullscreenDiv = document.querySelector('.fullscreen-mode');
    if (fullscreenDiv) {
        fullscreenDiv.remove();
        fullscreenMode = false;
    }
}

function getFileNameFromURL(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
        return fileName || 'image.jpg';
    } catch (error) {
        console.error("Error getting filename from URL:", error);
        return 'image.jpg';
    }
}


//Dark mode
const navbar = document.querySelector("nav");
const darkModeToggle = document.createElement("button");
darkModeToggle.textContent = "Dark Mode";
darkModeToggle.classList.add("dark-mode-toggle");

navbar.appendChild(darkModeToggle);

if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "Light Mode";
}

darkModeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
        darkModeToggle.textContent = "Light Mode";
    } else {
        localStorage.setItem("dark-mode", "disabled");
        darkModeToggle.textContent = "Dark Mode";
    }
};



//search image
document.getElementById("searchBox").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const activeCategory = document.querySelector(".items .active").getAttribute("data-name");
    let found = false;

    allImages.forEach(image => {
        const altText = image.querySelector("img").alt.toLowerCase();
        const captionText = image.querySelector(".caption").textContent.toLowerCase();
        const category = image.getAttribute("data-name");

        if ((activeCategory === "all" || category === activeCategory) &&
            (altText.includes(keyword) || captionText.includes(keyword))) {
            image.style.display = "block";
            found = true;
        } else {
            image.style.display = "none";
        }
    });

    const noResultMessage = document.getElementById("noResultsMessage");
    if (!found) {
        noResultMessage.style.display = "block";
    } else {
        noResultMessage.style.display = "none";
    }
});

