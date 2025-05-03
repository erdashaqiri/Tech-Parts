document.addEventListener("DOMContentLoaded", function () {
  console.log("main.js loaded"); // Debug: Confirm script is loading

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Add to cart clicked"); // Debug: Confirm click works

      const productCard = this.closest(".product-card");
      if (!productCard) {
        console.error("Couldn't find product card");
        return;
      }

      // Debug: Check what elements are being found
      console.log("Product card found:", productCard);

      const nameElement = productCard.querySelector("h3");
      const priceElement = productCard.querySelector(".price");
      const imageElement = productCard.querySelector(".product-img img");

      if (!nameElement || !priceElement) {
        console.error("Couldn't find required elements");
        return;
      }

      const product = {
        id: nameElement.textContent.trim().toLowerCase().replace(/\s+/g, "-"),
        name: nameElement.textContent.trim(),
        price: parsePrice(priceElement.textContent),
        image: imageElement ? imageElement.src : "",
        quantity: 1,
      };

      console.log("Product data extracted:", product); // Debug: Show extracted data

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      console.log("Current cart before update:", cart); // Debug: Show current cart

      const existingIndex = cart.findIndex((item) => item.id === product.id);
      if (existingIndex >= 0) {
        cart[existingIndex].quantity++;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      console.log(
        "Cart after update:",
        JSON.parse(localStorage.getItem("cart"))
      ); // Debug: Show updated cart

      showAddToCartNotification(product.name);
    });
  });

  function parsePrice(priceText) {
    // Get first number in price div (handles discounted prices)
    const priceValue = priceText.split("MKD")[0].trim();
    console.log("Raw price text:", priceText); // Debug
    console.log("Price after split:", priceValue); // Debug

    // Remove all non-digit characters except decimal point
    const numericValue = priceValue.replace(/[^\d.]/g, "");
    console.log("Numeric price:", numericValue); // Debug

    const result = parseFloat(numericValue);
    console.log("Final parsed price:", result); // Debug
    return result;
  }

  function showAddToCartNotification(productName) {
    console.log("Showing notification for:", productName); // Debug
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerHTML = `
          <span>${productName} added to cart!</span>
          <a href="cart.html">View Cart</a>
      `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("hide");
      notification.addEventListener("transitionend", () =>
        notification.remove()
      );
    }, 3000);
  }
});
