
const products = [
    {
        id: 1,
        name: "Classic Leather Bag",
        category: "Accessories",
        price: 89,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700"
    },
    {
        id: 2,
        name: "Minimalist Watch",
        category: "Accessories",
        price: 120,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
    },
    {
        id: 3,
        name: "Premium Sneakers",
        category: "Shoes",
        price: 95,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700"
    },
    {
        id: 4,
        name: "Elegant Sunglasses",
        category: "Accessories",
        price: 55,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700"
    },
    {
        id: 5,
        name: "Modern Backpack",
        category: "Bags",
        price: 75,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700"
    },
    {
        id: 6,
        name: "Luxury Perfume",
        category: "Beauty",
        price: 110,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=700"
    }
];

// Get saved cart or create an empty one
let cart = JSON.parse(localStorage.getItem("karma-cart")) || [];

// Display products
function displayProducts() {
    const grid = document.getElementById("products-grid");

    grid.innerHTML = products.map(product => `
        <article class="product-card">
            <img src="${product.image}"
                 alt="${product.name}"
                 loading="lazy">

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>

                <div class="product-bottom">
                    <span class="price">$${product.price}</span>

                    <button class="add-button"
                            onclick="addToCart(${product.id})">
                        Add to Cart +
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Save cart
function saveCart() {
    localStorage.setItem("karma-cart", JSON.stringify(cart));
    updateCartCount();
}

// Update cart quantity
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;
}

// Add product to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    showNotification(product.name + " added to your bag!");
}

// Notification
function showNotification(message) {
    let notification = document.getElementById("notification");

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: #25231f;
            color: white;
            padding: 16px 24px;
            z-index: 1000;
            font-size: 13px;
            border-radius: 4px;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.display = "block";

    clearTimeout(notification.timer);
    notification.timer = setTimeout(() => {
        notification.style.display = "none";
    }, 2500);
}

// Create shopping cart window
const cartStyle = document.createElement("style");
cartStyle.textContent = `
    .cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.45);
        z-index: 2000;
        display: none;
        justify-content: flex-end;
    }

    .cart-panel {
        background: #faf9f6;
        width: 100%;
        max-width: 430px;
        height: 100%;
        overflow-y: auto;
        padding: 30px;
    }

    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .cart-header h2 {
        font-family: 'Playfair Display', serif;
        font-size: 28px;
        font-weight: 400;
    }

    .close-cart {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
    }

    .cart-item {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 18px 0;
        border-bottom: 1px solid #ddd;
    }

    .cart-item h3 {
        font-size: 14px;
        margin-bottom: 8px;
    }

    .cart-item p {
        font-size: 13px;
        color: #858078;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
    }

    .quantity-controls button {
        width: 27px;
        height: 27px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
    }

    .remove-item {
        border: none;
        background: none;
        color: #a34c40;
        cursor: pointer;
        font-size: 12px;
        margin-top: 8px;
    }

    .cart-total {
        display: flex;
        justify-content: space-between;
        font-size: 19px;
        font-weight: bold;
        padding: 25px 0;
    }

    .checkout-button {
        width: 100%;
        padding: 17px;
        background: #25231f;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 13px;
    }

    .empty-cart {
        text-align: center;
        padding: 50px 10px;
        color: #858078;
    }
`;
document.head.appendChild(cartStyle);

// Add cart window to page
document.body.insertAdjacentHTML("beforeend", `
    <div class="cart-overlay" id="cart-overlay">
        <div class="cart-panel">
            <div class="cart-header">
                <h2>Your Shopping Bag</h2>
                <button class="close-cart" id="close-cart">&times;</button>
            </div>
            <div id="cart-items"></div>
            <div id="cart-summary"></div>
        </div>
    </div>
`);

// Display cart
function renderCart() {
    const itemsContainer = document.getElementById("cart-items");
    const summary = document.getElementById("cart-summary");

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your bag is empty</h3>
                <p>Discover something beautiful!</p>
            </div>
        `;
        summary.innerHTML = "";
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>$${item.price} each</p>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <button class="remove-item"
                        onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>

            <strong>$${item.price * item.quantity}</strong>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    summary.innerHTML = `
        <div class="cart-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="checkout-button" onclick="checkout()">
            PROCEED TO CHECKOUT
        </button>
    `;
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart();
    renderCart();
}

// Remove product
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

// Open and close cart
const overlay = document.getElementById("cart-overlay");

document.querySelector(".cart").addEventListener("click", event => {
    event.preventDefault();
    renderCart();
    overlay.style.display = "flex";
});

document.getElementById("close-cart").addEventListener("click", () => {
    overlay.style.display = "none";
});

overlay.addEventListener("click", event => {
    if (event.target === overlay) {
        overlay.style.display = "none";
    }
});

// Demo checkout
function checkout() {
    if (cart.length === 0) return;

    showNotification("Checkout will be available soon!");
}

// Start website
displayProducts();
updateCartCount();
