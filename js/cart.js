// cart.js - Cart functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart if it doesn't exist
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card");
      const product = {
        name: productCard.querySelector("h3").textContent,
        price: productCard.querySelector(".price").textContent.split(" ")[0], // Get just the number
        image: productCard.querySelector(".product-img img")?.src || "",
        specs: Array.from(
          productCard.querySelectorAll(".product-specs li")
        ).map((li) => li.textContent),
      };

      addToCart(product);
      showCartNotification(product.name);
    });
  });

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function showCartNotification(productName) {
    const notification = document.createElement("div");
    notification.textContent = `${productName} added to cart!`;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#2c3e50";
    notification.style.color = "white";
    notification.style.padding = "15px 25px";
    notification.style.borderRadius = "4px";
    notification.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    notification.style.zIndex = "1000";
    notification.style.animation = "fadeIn 0.3s";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }

  // Initialize cart count on page load
  updateCartCount();
});
