const korzinaBtn = document.getElementById("korzina-link");
const korzina = document.getElementById("korzina");
const closeBtn = document.getElementById("close");
const cardsContainer = document.getElementById("cards");
const paginationContainer = document.getElementById("pagination");
const filterLink = document.getElementById("filter-link");
const filter = document.getElementById("filter");
const filterClose = document.getElementById("filter-close");
const filterClear = document.getElementById("filter-clear");
const filterSave = document.getElementById("filter-save");
const priceInputs = document.querySelectorAll(".filter-price input");
const CARDS_PER_PAGE = 6;



korzinaBtn.addEventListener("click", function(event) {
	event.preventDefault();
	korzina.style.display = "block";
});

closeBtn.addEventListener("click", function() {
	korzina.style.display = "none";
});

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

function formatCategory(category) {
	return category.split("-").map(function(word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}).join(" ");
}

async function getProducts() {
	try {
		const response = await fetch("https://dummyjson.com/products?limit=24");
		const data = await response.json();
		allProducts = data.products;
		filteredProducts = allProducts;
		renderPage(1);
	} catch (error) {
		console.error(error);
	}
}

function renderPage(page) {
	currentPage = page;
	const start = (page - 1) * CARDS_PER_PAGE;
	const pageProducts = filteredProducts.slice(start, start + CARDS_PER_PAGE);

	cardsContainer.innerHTML = "";

	pageProducts.forEach(function(product) {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `
			<div class="card-photo">
				${product.rating >= 4.5 ? '<span class="card-badge">Best Seller</span>' : ""}
				<img src="${product.thumbnail}" alt="${product.title}">
				<button class="card-add">ADD TO CART</button>
			</div>
			<span class="card-category">${formatCategory(product.category)}</span>
			<h4 class="card-title">${product.title}</h4>
			<span class="card-price">$${product.price.toFixed(2)}</span>
		`;

		cardsContainer.appendChild(card);
	});

	renderPagination();
}

function renderPagination() {
	const totalPages = Math.ceil(filteredProducts.length / CARDS_PER_PAGE);
	paginationContainer.innerHTML = "";

	const prev = document.createElement("span");
	prev.textContent = "‹";
	prev.addEventListener("click", function() {
		if (currentPage > 1) renderPage(currentPage - 1);
	});
	paginationContainer.appendChild(prev);

	for (let i = 1; i <= totalPages; i++) {
		const pageBtn = document.createElement("span");
		pageBtn.textContent = i;
		if (i === currentPage) pageBtn.classList.add("active");
		pageBtn.addEventListener("click", function() {
			renderPage(i);
		});
		paginationContainer.appendChild(pageBtn);
	}

	const next = document.createElement("span");
	next.textContent = "›";
	next.addEventListener("click", function() {
		if (currentPage < totalPages) renderPage(currentPage + 1);
	});
	paginationContainer.appendChild(next);
}

filterLink.addEventListener("click", function() {
	filter.classList.add("open");
});

filterClose.addEventListener("click", function() {
	filter.classList.remove("open");
});

filterClear.addEventListener("click", function() {
	priceInputs.forEach(function(input) {
		input.checked = false;
	});
	filteredProducts = allProducts;
	renderPage(1);
});

filterSave.addEventListener("click", function() {
	const activeRanges = Array.from(priceInputs).filter(function(input) {
		return input.checked;
	});

	if (activeRanges.length === 0) {
		filteredProducts = allProducts;
	} else {
		filteredProducts = allProducts.filter(function(product) {
			return activeRanges.some(function(input) {
				const min = Number(input.dataset.min);
				const max = Number(input.dataset.max);
				return product.price >= min && product.price <= max;
			});
		});
	}

	renderPage(1);
	filter.classList.remove("open");
});

getProducts();