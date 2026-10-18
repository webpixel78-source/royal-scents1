/* Royal Scents Kampala — product catalogue, cart and WhatsApp order flow */
const WHATSAPP_NUMBER = "256753629773";
const CURRENCY = "UGX";

/* Prices are intentionally blank until the owner supplies confirmed prices.
   To add a price, enter a number in the price field for that product. */
const products = [
  {id:"kai-vanilla-candy",name:"Kai Aly Vanilla Candy",category:"Sweet & warm",filter:"sweet",description:"A sweet, playful fragrance for lovers of gourmand scents.",price:40000,image:"assets/kai-aly-vanilla-candy.jpg",tag:"Sweet pick"},
  {id:"kai-vanilla-128",name:"Kai Aly Vanilla 128",category:"Sweet & warm",filter:"sweet",description:"A rich-looking vanilla fragrance with a warm, indulgent character.",price:40000,image:"assets/kai-aly-vanilla-128.jpg",tag:"Warm & rich"},
  {id:"hawas-london",name:"Hawas London",category:"Fresh & bold",filter:"fresh",description:"A confident fragrance choice for everyday wear and evenings.",price:40000,image:"assets/hawas-london.jpg",tag:"Fresh statement"},
  {id:"asad",name:"Asad",category:"Bold & warm",filter:"night",description:"A bold, dark fragrance style for a strong presence.",price:40000,image:"assets/asad.jpg",tag:"Bold choice"},
  {id:"nine-pm-black",name:"9PM Black",category:"Evening",filter:"night",description:"A sleek, dark bottle for a night-out fragrance collection.",price:40000,image:"assets/nine-pm-black.jpg",tag:"Evening edit"},
  {id:"nine-pm-brown",name:"9PM Brown",category:"Warm & woody",filter:"sweet",description:"A warm-toned fragrance option with a rich, polished look.",price:40000,image:"assets/nine-pm-brown.jpg",tag:"Warm tones"},
  {id:"hawas-fire",name:"Hawas Fire",category:"Fresh & bold",filter:"fresh",description:"A striking red-toned Hawas fragrance from the supplied collection.",price:40000,image:"assets/hawas-fire.jpg",tag:"Bold colour"},
  {id:"nine-pm-night-out",name:"9PM Night Out",category:"Evening",filter:"night",description:"A dark, refined option for evening fragrance fans.",price:40000,image:"assets/nine-pm-night-out.jpg",tag:"Night edit"},
  {id:"nine-pm-elixir",name:"9PM Elixir",category:"Bold & warm",filter:"night",description:"A deep-toned bottle to complete your evening fragrance rotation.",price:40000,image:"assets/nine-pm-elixir.jpg",tag:"Statement scent"}
];

const state = {cart:{},filter:"all",query:""};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const formatPrice = value => value == null ? "Price on request" : new Intl.NumberFormat("en-UG",{style:"currency",currency:CURRENCY,maximumFractionDigits:0}).format(value);
const waLink = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

function renderProducts(){
  const grid=$("#productGrid");
  const list=products.filter(p=>(state.filter==="all"||p.filter===state.filter)&&`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(state.query));
  if(!list.length){grid.innerHTML='<div class="no-results">No products match your search. Try another name or category.</div>';return;}
  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${escapeHtml(p.name)} perfume" loading="lazy" onerror="this.onerror=null;this.src='assets/kai-aly-vanilla-128.jpg'">
        <span class="product-tag">${escapeHtml(p.tag)}</span>
      </div>
      <div class="product-info">
        <p class="product-category">${escapeHtml(p.category)}</p>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="product-description">${escapeHtml(p.description)}</p>
        <div class="product-bottom"><span class="price">${formatPrice(p.price)}</span><button class="add-btn" data-add="${p.id}">Add to bag +</button></div>
      </div>
    </article>`).join("");
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function addToCart(id){
  state.cart[id]=(state.cart[id]||0)+1;renderCart();showToast(`${products.find(p=>p.id===id).name} added to your bag.`);
}
function changeQty(id,delta){
  state.cart[id]=(state.cart[id]||0)+delta;if(state.cart[id]<=0)delete state.cart[id];renderCart();
}
function cartEntries(){return Object.entries(state.cart).map(([id,qty])=>({product:products.find(p=>p.id===id),qty})).filter(x=>x.product);}
function renderCart(){
  const entries=cartEntries(),count=entries.reduce((sum,item)=>sum+item.qty,0);
  $("#cartCount").textContent=count;$("#cartHeaderCount").textContent=`(${count})`;
  if(!entries.length){$("#cartItems").innerHTML='<div class="empty-cart"><span>✳</span><p>Your bag is waiting for something special.</p><button class="text-link" id="continueShopping">Continue shopping ↗</button></div>';$("#cartTotal").textContent="Price on request";return;}
  $("#cartItems").innerHTML=entries.map(({product:p,qty})=>`
    <div class="cart-row"><img src="${p.image}" alt="${escapeHtml(p.name)}"><div><h3>${escapeHtml(p.name)}</h3><small>${formatPrice(p.price)}</small><div class="qty-control"><button data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${escapeHtml(p.name)}">×</button></div>`).join("");
  const total=entries.every(e=>e.product.price!=null)?entries.reduce((sum,e)=>sum+e.product.price*e.qty,0):null;
  $("#cartTotal").textContent=total==null?"Price on request":formatPrice(total);
}
function openCart(){$("#cartPanel").classList.add("open");$("#cartPanel").setAttribute("aria-hidden","false");$("#cartBackdrop").hidden=false;document.body.classList.add("cart-open");$("#cartClose").focus();}
function closeCart(){$("#cartPanel").classList.remove("open");$("#cartPanel").setAttribute("aria-hidden","true");$("#cartBackdrop").hidden=true;document.body.classList.remove("cart-open");}
function orderMessage(){
  const entries=cartEntries();
  if(!entries.length)return "Hello Royal Scents Kampala! I'd like to ask about your available perfumes, scents, men's wear and watches, including current prices. Please assist me.";
  const lines=entries.map(({product,qty})=>`• ${product.name} × ${qty} — ${formatPrice(product.price)}`);
  return `Hello Royal Scents Kampala! I'd like to enquire/order these items:\n\n${lines.join("\n")}\n\nPlease confirm availability and delivery/pickup options. Thank you!`;
}
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2500);}

$("#productGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(btn.dataset.add);});
$("#cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");
  if(qty)changeQty(qty.dataset.id,Number(qty.dataset.qty));
  if(remove){delete state.cart[remove.dataset.remove];renderCart();}
  if(e.target.closest("#continueShopping"))closeCart();
});
$("#cartOpen").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#cartBackdrop").addEventListener("click",closeCart);
$("#checkoutWhatsapp").addEventListener("click",()=>{window.open(waLink(orderMessage()),"_blank","noopener");});
$("#contactWhatsapp").addEventListener("click",e=>{e.currentTarget.href=waLink("Hello Royal Scents Kampala! I'd like to ask about your products and current prices.");});
$("#clearCart").addEventListener("click",()=>{state.cart={};renderCart();showToast("Your bag has been cleared.");});
$("#productSearch").addEventListener("input",e=>{state.query=e.target.value.trim().toLowerCase();renderProducts();});
$$(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{state.filter=btn.dataset.filter;$$(".filter-btn").forEach(b=>b.classList.toggle("active",b===btn));renderProducts();}));
$("#menuToggle").addEventListener("click",()=>{const nav=$("#mainNav"),open=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").textContent=open?"×":"☰";});
$$(".main-nav a").forEach(link=>link.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").textContent="☰";}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
