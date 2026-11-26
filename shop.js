
// PRODUCTS
const products = [
    {
        id: 1,
        name: "Plaided-Asymmetrical skirt",
        price: 450,
        categories: ["women", "bottoms", "brands"],
        brand: "Romwe",
        size: "Medium",
        condition: "Good",
        image: "sbstwo.png"
    },
    {
        id: 2,
        name: "Black Turtle neck",
        price: 280,
        categories: ["women", "tops"],
        brand: "Unbranded",
        size: "Medium",
        condition: "Like New",
        image: "ptwfour.png"
    },
    {
        id: 3,
        name: "Straight Cut Jeans",
        price: 320,
        categories: ["men", "bottoms"],
        brand: "Unbranded",
        size: "28",
        condition: "Good",
        image: "sbssix.png"
    },
    {
        id: 4,
        name: "Vintage Shoulder Bag",
        price: 390,
        categories: ["women", "accessories", "brands"],
        brand: "Dive Dale",
        size: "One Size",
        condition: "Like New",
        image: "sbsfour.png"
    },
    {
        id: 5,
        name: "Black Leather Jacket",
        price: 670,
        categories: ["men", "tops", "brands", "outerwear"],
        brand: "HUGO",
        size: "X-Large",
        condition: "Good",
        image: "ptwfive.png"
    },
    {
        id: 6,
        name: "Kids Green Cap",
        price: 130,
        categories: ["kids", "accessories"],
        brand: "Unbranded",
        size: "6-7 Years",
        condition: "Good",
        image: "sbsfive.png"
    },
    {
        id: 7,
        name: "Fairy brown dress",
        price: 550,
        categories: ["women", "tops"],
        brand: "Unbranded",
        size: "Medium",
        condition: "Good",
        image: "sbsthree.png"
    },
    {
        id: 8,
        name: "Kids rubber shoes",
        price: 160,
        categories: ["kids", "accessories", "outerwear"],
        brand: "Unbranded",
        size: "8-9 Years",
        condition: "Like New",
        image: "ptwtwo.png"
    }
];

// ELEMENTS
const productGrid = document.getElementById("product-grid");
const filters = document.querySelectorAll(".filter");
const navButtons = document.querySelectorAll("[data-nav]");
const sortMenu = document.getElementById("sort");
const searchInput = document.getElementById("search-input");
const sectionTitle = document.getElementById("section-title");
const productCount = document.getElementById("product-count");

let currentCategory = "all";
let favoritesOnly = false;
const favorites = new Set();

const categoryNames = {
    all: "All Products",
    new: "New Arrivals",
    women: "Women",
    men: "Men",
    kids: "Kids",
    tops: "Tops",
    bottoms: "Bottoms",
    outerwear: "Outerwear",
    accessories: "Accessories",
    brands: "Brands"
};

// DISPLAY
function displayProducts() {
    const searchText = searchInput.value.toLowerCase().trim();

    let visibleProducts = products.filter(product => {
        const matchesCategory =
            currentCategory === "all" ||
            currentCategory === "new" ||
            product.categories.includes(currentCategory);

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.brand.toLowerCase().includes(searchText);

        const matchesFavorites =
            !favoritesOnly || favorites.has(product.id);

        return matchesCategory && matchesSearch && matchesFavorites;
    });

    // SORT BY PRICE
    if (sortMenu.value === "low") {
        visibleProducts.sort((a, b) => a.price - b.price);
    } else if (sortMenu.value === "high") {
        visibleProducts.sort((a, b) => b.price - a.price);
    }

    sectionTitle.textContent = favoritesOnly
        ? "Favorites"
        : categoryNames[currentCategory];

    productCount.textContent =
        `${visibleProducts.length} products found`;

    productGrid.innerHTML = "";

    if (visibleProducts.length === 0) {
        productGrid.innerHTML = `
            <p class="empty-message">
                No products found. Try another category!
            </p>
        `;
        return;
    }

    // CREATE PRODUCT CARDS
    visibleProducts.forEach(product => {
        const isFavorite = favorites.has(product.id);
        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <img class="product-image"
                 src="${product.image}"
                 alt="${product.name}"
                 loading="lazy">

            <div class="product-info">
                <div class="product-top">
                    <h3 class="product-name">${product.name}</h3>

                    <button
                        class="heart-button ${isFavorite ? "saved" : ""}"
                        aria-label="Toggle favorite for ${product.name}">
                        ${isFavorite ? "♥" : "♡"}
                    </button>
                </div>

                <p class="product-price">
                    ₱${product.price.toFixed(2)}
                </p>

                <p class="product-details">
                    Brand: ${product.brand}
                </p>

                <p class="product-details">
                    Size: ${product.size}
                </p>

                <p class="product-details">
                    Condition: ${product.condition}
                </p>
            </div>
        `;

        productGrid.appendChild(card);

        // FAVORITE BUTTON
        const heartButton = card.querySelector(".heart-button");

        heartButton.addEventListener("click", () => {
            if (favorites.has(product.id)) {
                favorites.delete(product.id);
            } else {
                favorites.add(product.id);
            }

            displayProducts();
        });
    });
}

// CHANGE CATEGORY
function changeCategory(category) {
    currentCategory = category;
    favoritesOnly = false;

    filters.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    navButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.nav === category
        );
    });

    displayProducts();
}

// SIDEBAR FILTERS
filters.forEach(button => {
    button.addEventListener("click", () => {
        changeCategory(button.dataset.category);
    });
});

// NAVIGATION FILTERS
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        changeCategory(button.dataset.nav);
    });
});

// SEARCH
document.getElementById("search-form")
    .addEventListener("submit", event => {
        event.preventDefault();
        displayProducts();
    });

searchInput.addEventListener("input", displayProducts);

// SORT
sortMenu.addEventListener("change", displayProducts);

// FAVORITES
document.getElementById("favorites-button")
    .addEventListener("click", () => {
        favoritesOnly = !favoritesOnly;
        displayProducts();
    });

// LOAD PRODUCTS
displayProducts();
