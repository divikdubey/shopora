// ===== Product Data =====
const products = [
  { id:1, name:"iPhone 15 Pro", price:60000, image:"images/product1.jpg", category:"Electronics", description:"Latest Apple iPhone with A17 Pro chip and Titanium build."},
  { id:2, name:"Samsung Galaxy S24", price:99999, image:"images/product2.jpg", category:"Electronics", description:"Flagship Samsung smartphone with cutting-edge camera."},
  { id:3, name:"Sony WH-1000XM5", price:29999, image:"images/product3.jpg", category:"Electronics", description:"Noise-cancelling wireless headphones with premium sound."},
  { id:4, name:"Nike Air Max Shoes", price:7999, image:"images/product4.jpg", category:"Fashion", description:"Stylish and comfortable running shoes for everyday wear."},
  { id:5, name:"Rolex Watch", price:599999, image:"images/product5.jpg", category:"Fashion", description:"Luxury Swiss watch with timeless design and precision."},
  { id:6, name:"Wooden Sofa", price:24999, image:"images/product6.jpg", category:"Home", description:"Elegant 3-seater sofa with premium wooden finish."}
];

// ===== Cart & Wishlist =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ===== Update Cart Count =====
function updateCartCount(){
  const cartCount = document.getElementById("cart-count");
  if(cartCount) cartCount.textContent = cart.reduce((acc,item)=>acc+item.qty,0);
}

// ===== Render Products =====
function renderProducts(){
  const productList = document.getElementById("product-list");
  if(!productList) return;
  productList.innerHTML = "";
  products.forEach(product=>{
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price.toLocaleString()}</p>
      </a>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <button onclick="toggleWishlist(${product.id})">
        ${wishlist.find(w=>w.id===product.id) ? "❤️ Remove Wishlist" : "🤍 Add Wishlist"}
      </button>
    `;
    productList.appendChild(div);
  });
}


// ===== Autocomplete Search =====
const searchInput = document.getElementById("search");
if(searchInput){
  const suggestionBox = document.createElement("div");
  suggestionBox.id = "suggestions";
  suggestionBox.style.position = "absolute";
  suggestionBox.style.background = "#fff";
  suggestionBox.style.border = "1px solid #ccc";
  suggestionBox.style.width = "200px";
  suggestionBox.style.zIndex = "1000";
  searchInput.parentNode.appendChild(suggestionBox);

  searchInput.addEventListener("input",function(){
    const keyword = searchInput.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if(keyword.length>0){
      const matches = products.filter(p=>p.name.toLowerCase().includes(keyword));
      matches.forEach(m=>{
        const div = document.createElement("div");
        div.textContent = m.name;
        div.style.padding = "5px";
        div.style.cursor = "pointer";
        div.onclick = ()=>{
          searchInput.value = m.name;
          suggestionBox.innerHTML = "";
          renderFilteredProducts(m.name.toLowerCase());
        };
        suggestionBox.appendChild(div);
      });
    }
    renderFilteredProducts(keyword);
  });
}

function renderFilteredProducts(keyword){
  const productList = document.getElementById("product-list");
  if(!productList) return;
  productList.innerHTML = "";
  products
    .filter(p=>p.name.toLowerCase().includes(keyword)||p.category.toLowerCase().includes(keyword))
    .forEach(product=>{
      const div=document.createElement("div");
      div.classList.add("product-card");
      div.innerHTML = `
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>₹${product.price.toLocaleString()}</p>
        </a>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="toggleWishlist(${product.id})">
          ${wishlist.find(w=>w.id===product.id) ? "❤️ Remove Wishlist" : "🤍 Add Wishlist"}
        </button>
      `;
      productList.appendChild(div);
    });
}


// ===== Cart Functions =====
function addToCart(productId){
  const product = products.find(p=>p.id===productId);
  const cartItem = cart.find(item=>item.id===productId);
  if(cartItem) cartItem.qty+=1;
  else cart.push({...product, qty:1});
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function renderCart(){
  const cartTable = document.querySelector(".cart-page table");
  if(!cartTable) return;
  cartTable.innerHTML = `
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Qty</th>
      <th>Total</th>
      <th>Action</th>
    </tr>
  `;
  let grandTotal=0;
  cart.forEach(item=>{
    const total = item.price*item.qty;
    grandTotal+=total;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>
        <button onclick="changeQty(${item.id},-1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${item.id},1)">+</button>
      </td>
      <td>₹${total.toLocaleString()}</td>
      <td><button onclick="removeItem(${item.id})">Remove</button></td>
    `;
    cartTable.appendChild(row);
  });
  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td colspan="3" style="text-align:right"><strong>Grand Total:</strong></td>
    <td colspan="2"><strong>₹${grandTotal.toLocaleString()}</strong></td>
  `;
  cartTable.appendChild(totalRow);

  // Checkout button
  const checkoutRow = document.createElement("tr");
  checkoutRow.innerHTML = `
    <td colspan="5" style="text-align:center">
      <button onclick="checkout()">Proceed to Checkout</button>
    </td>
  `;
  cartTable.appendChild(checkoutRow);
}

function changeQty(productId, delta){
  const cartItem = cart.find(item=>item.id===productId);
  if(!cartItem) return;
  cartItem.qty+=delta;
  if(cartItem.qty<=0) cart = cart.filter(item=>item.id!==productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function removeItem(productId){
  cart = cart.filter(item=>item.id!==productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ===== Wishlist =====
function toggleWishlist(productId){
  const product = products.find(p=>p.id===productId);
  const exists = wishlist.find(w=>w.id===productId);
  if(exists) wishlist = wishlist.filter(w=>w.id!==productId);
  else wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderProducts();
}

// ===== Checkout (Fake Stripe Integration) =====
function checkout(){
  alert("Redirecting to payment (Test Mode)");
  window.location.href = "https://checkout.stripe.dev/test"; // demo checkout
}

// ===== Dark Mode Toggle =====
function toggleDarkMode(){
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
if(localStorage.getItem("darkMode")==="true"){
  document.body.classList.add("dark");
}

// ===== Smart Recommendations =====
function renderRecommendations(productId){
  const recSection = document.getElementById("recommendations");
  if(!recSection) return;
  const current = products.find(p=>p.id===productId);
  const related = products.filter(p=>p.category===current.category && p.id!==productId);
  recSection.innerHTML = "<h3>Related Products</h3>";
  related.forEach(r=>{
    const div=document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML=`
      <img src="${r.image}" alt="${r.name}">
      <h4>${r.name}</h4>
      <p>₹${r.price.toLocaleString()}</p>
      <button onclick="addToCart(${r.id})">Add to Cart</button>
    `;
    recSection.appendChild(div);
  });
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded",()=>{
  renderProducts();
  renderCart();
  updateCartCount();
   renderProductDetail();
});
// ===== Render Product Detail Page =====
function renderProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  if(!productId) return;

  const product = products.find(p => p.id === productId);
  if(!product) return;

  document.getElementById("product-img").src = product.image;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-desc").textContent = product.description;
  document.getElementById("product-price").textContent = "₹" + product.price.toLocaleString();

  // addToCart button support
  window.addToCartDetail = function() {
    addToCart(product.id);
  }

  // Recommendations bhi show karo
  renderRecommendations(productId);
}
document.addEventListener("DOMContentLoaded",()=>{
  renderProducts();
  renderCart();
  updateCartCount();
   
});
