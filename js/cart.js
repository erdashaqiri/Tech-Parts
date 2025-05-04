document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart if it doesn't exist
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  // Add to cart functionality for product cards
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card");
      const name = productCard.querySelector("h3").textContent.trim();

      // Get the first price (handles discounted prices)
      const priceText = productCard
        .querySelector(".price")
        .textContent.split("MKD")[0]
        .trim();
      const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

      const image = productCard.querySelector(".product-img img")?.src || "";

      const product = {
        name: name,
        price: price,
        image: image,
        quantity: 1,
      };

      addToCart(product);
      showCartNotification(product.name);
    });
  });

  // Display cart items on cart.html
  if (document.getElementById("cart-items")) {
    displayCartItems();
  }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.name === product.name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.createElement("div");
    totalPriceElement.id = "total-price";
    totalPriceElement.className = "cart-total";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      return;
    }

    let totalPrice = 0;
    cartContainer.innerHTML = "";

    cart.forEach((item) => {
      // Skip items with missing data
      if (!item.name || isNaN(item.price) || !item.quantity) {
        console.warn("Invalid cart item:", item);
        return;
      }

      totalPrice += item.price * item.quantity;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image || "#"}" alt="${item.name}" width="100">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>${item.price} MKD × ${item.quantity}</p>
          <button class="remove-item" data-name="${item.name}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(cartItem);
    });

    totalPriceElement.innerHTML = `<strong>Total: ${totalPrice.toFixed(
      2
    )} MKD</strong>`;
    cartContainer.appendChild(totalPriceElement);

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        removeFromCart(this.dataset.name);
      });
    });
  }

  function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.name !== productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
  }

  function showCartNotification(productName) {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerHTML = `
      <span>${productName} added to cart!</span>
      <a href="../cart.html">View Cart</a>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("hide");
      notification.addEventListener("transitionend", () =>
        notification.remove()
      );
    }, 3000);
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartIcon = document.querySelector(".fa-cart-shopping");

    if (cartIcon) {
      let countBadge = cartIcon.parentElement.querySelector(".cart-count");
      if (!countBadge) {
        countBadge = document.createElement("span");
        countBadge.className = "cart-count";
        cartIcon.parentElement.appendChild(countBadge);
      }

      const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      countBadge.textContent = totalItems > 0 ? totalItems : "";
    }
  }

  // Initialize cart count on page load
  updateCartCount();
});
