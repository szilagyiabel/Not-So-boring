document.addEventListener('DOMContentLoaded', function () {
    initializeProducts();
});

const productNames = []; 

//Task 3
async function updateMemes() {
    const product = await fetchMemeImages();
    const products = [];
    
    //original product names: const productNames = ["Notebook", "Smartphone", "Tablet", "Headphones", "Camera", "Printer", "Monitor", "Mouse", "Keyboard", "Webcam"]
    
    //I leave this here because the task asks for it, I hope it's okay
    const descriptions = [
        "This is a very fast device.",
        "High quality at a low price.",
        "Reliable and durable with extended warranty.",
        "Offers excellent performance.",
        "Compact and portable.",
        "Energy efficient with smart technology.",
        "Designed for professionals.",
        "Ideal for gaming.",
        "Lightweight with high battery capacity.",
        "User-friendly and easy to set up."
    ];

    for (let i = 0; i < 20; i++) {
        const memeIndex = i % product.length;
        const name = product[memeIndex].name;
        const description = descriptions[Math.floor(Math.random() * descriptions.length)]; 
        const price = Math.floor(Math.random() * 1900 + 100) + " EUR";
        const rating = Math.floor(Math.random() * 10 + 1) + "/10";
        const image = product[memeIndex].url;

        products.push({ name, description, price, rating, image });
    }
    return products;
}

//Task 4
async function initializeProducts() {
    const products = await updateMemes();
    let currentPage = 1;
    const itemsPerPage = 10;
    totalPage = Math.ceil(products.length / itemsPerPage);
    let currentProducts = products;

    const topProduct = determineTopProduct(products);
    renderTopProduct(topProduct);

    function renderTopProduct(product) {
        const topProductContainer = document.getElementById('top-product-container');
        if (topProductContainer) {
            topProductContainer.innerHTML = `
                <div class="product-card">
                    <img src="${product.image}" alt="Product Image" style="width:100%">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>${product.price}</p>
                    <p>Rating: ${product.rating}</p>
                </div>
            `;
        } else {
            console.error('Top product container not found');
        }
    }

    function renderProducts(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToShow = currentProducts.slice(start, end);

        const container = document.getElementById('product-container');
        container.innerHTML = "";

        productsToShow.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="Product Image" style="width:100%">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>Rating: ${product.rating}</p>
            `;
            container.appendChild(card);
        });
    }

    function updateButtons() {
        const prevButton = document.getElementById('prev-btn');
        const nextButton = document.getElementById('next-btn');

        const prevButtonBottom = document.getElementById('prev-btn-bottom');
        const nextButtonBottom = document.getElementById('next-btn-bottom');
        
        if (totalPage <= 1) {
            prevButton.disabled = true;
            nextButton.disabled = true;
            prevButtonBottom.disabled = true;
            nextButtonBottom.disabled = true;
        } else { 
            if (currentPage <= 1) {
                prevButton.disabled = true;
                prevButtonBottom.disabled = true;
            } else {
                prevButton.disabled = false;
                prevButtonBottom.disabled = false;
            }
        
            if (currentPage >= totalPage) {
                nextButton.disabled = true;
                nextButtonBottom.disabled = true;
            } else {
                nextButton.disabled = false;
                nextButtonBottom.disabled = false;
            }
        }
    }

    function handlePrev() {
        if (currentPage > 1) {
            currentPage--;
            updateButtons();
            renderProducts(currentPage);
        }
    }

    function handleNext() {
        if (currentPage < totalPage) {
            currentPage++;
            updateButtons();
            renderProducts(currentPage);
        }
    }

//Task 5
    function searchProductsByName() {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        currentProducts = products.filter(product => product.name.toLowerCase().includes(searchText));
        currentPage = 1;
        totalPage = Math.ceil(currentProducts.length / itemsPerPage);

        const container = document.getElementById('product-container');
        container.innerHTML = "";
        
        if (currentProducts.length === 0) {
            container.innerHTML = '<div class="empty-search">No memes found.</div>';
        } else {
            renderProducts(currentPage);
        }
        updateButtons();
    }

    document.getElementById('prev-btn').addEventListener('click', handlePrev);
    document.getElementById('next-btn').addEventListener('click', handleNext);
    
    document.getElementById('prev-btn-bottom').addEventListener('click', handlePrev);
    document.getElementById('next-btn-bottom').addEventListener('click', handleNext);

    document.getElementById('search-button').addEventListener('click',  searchProductsByName);

    document.getElementById('search-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            searchProductsByName();
            event.preventDefault();
        }
    })

    renderProducts(currentPage);
    updateButtons();
}

//Task 6
async function fetchMemeImages() {
    try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();

        if (data.success) {
            productNames.length = 0;
            data.data.memes.slice(0, 20).forEach(meme => {
                productNames.push(meme.name);
            });

            return data.data.memes.slice(0, 20).map(meme => ({
                url: meme.url,
                name: meme.name
            }));
        } else {
            console.error('Failed to fetch memes:', data.error_message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching memes:', error);
        return [];
    }
}

/*original products function
async function generateProducts() {
    const memes = await fetchMemeImages();
    const products = [];

    for (let i = 0; i < 20; i++) {
        const memeIndex = i % memes.length; 
        const name = memes[memeIndex] ? memes[memeIndex].name : productNames[Math.floor(Math.random() * productNames.length)] + ' ' + Math.floor(Math.random() * 3000 + 1000);
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        const price = Math.floor(Math.random() * 1900 + 100);
        const rating = Math.floor(Math.random() * 10 + 1) + "/10";

        products.push({
            name: name,
            description: description,
            price: price + " EUR",
            rating: rating,
            image: memes[memeIndex].url
        });
    }

    return products;
}*/

//Task 7
const determineTopProduct = (productList) => {
    return productList.reduce((topProduct, currentProduct) => {
        const currentRating = parseFloat(currentProduct.rating.trim());
        const topRating = parseFloat(topProduct.rating.trim());

        return (currentRating > topRating) ? currentProduct : topProduct;
    }, productList[0]);
}

