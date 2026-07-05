// ==========================================================
// Империя Пиццы — логика сайта
// ==========================================================

// ---------- данные меню ----------
const MENU = {
  pizza: [
    { id: "p1", name: "Маргарита", desc: "Томатный соус, моцарелла, свежий базилик, оливковое масло.", price: 420, weight: "450 г / 30 см" },
    { id: "p2", name: "Пепперони", desc: "Острая пепперони, моцарелла, томатный соус, орегано.", price: 490, weight: "480 г / 30 см" },
    { id: "p3", name: "Четыре сыра", desc: "Моцарелла, горгонзола, пармезан, сулугуни, сливочный соус.", price: 540, weight: "460 г / 30 см" },
    { id: "p4", name: "Барбекю с курицей", desc: "Курица гриль, соус барбекю, лук, моцарелла, паприка.", price: 510, weight: "500 г / 30 см" },
    { id: "p5", name: "Мясная делюкс", desc: "Говядина, пепперони, бекон, ветчина, моцарелла.", price: 570, weight: "520 г / 30 см" },
    { id: "p6", name: "Гавайская", desc: "Ветчина, ананас, моцарелла, томатный соус.", price: 460, weight: "460 г / 30 см" },
    { id: "p7", name: "Дьябло", desc: "Острая салями, халапеньо, чили-масло, моцарелла.", price: 500, weight: "460 г / 30 см" },
    { id: "p8", name: "Грибная трюфель", desc: "Шампиньоны, трюфельное масло, пармезан, сливочный соус.", price: 560, weight: "460 г / 30 см" },
  ],
  snacks: [
    { id: "s1", name: "Картофель фри", desc: "Хрустящий картофель фри с соусом на выбор.", price: 180, weight: "200 г" },
    { id: "s2", name: "Наггетсы", desc: "Куриные наггетсы, 8 шт, соус в комплекте.", price: 240, weight: "180 г" },
    { id: "s3", name: "Луковые кольца", desc: "Хрустящие кольца в темпуре, соус чили-майо.", price: 210, weight: "180 г" },
    { id: "s4", name: "Сырные палочки", desc: "Моцарелла в панировке, соус клюквенный.", price: 260, weight: "200 г" },
    { id: "s5", name: "Брускетты", desc: "Хрустящий багет, томаты, песто, пармезан.", price: 220, weight: "150 г" },
  ],
  desserts: [
    { id: "d1", name: "Шоколадный фондан", desc: "Тёплый шоколадный кекс с жидкой начинкой.", price: 260, weight: "120 г" },
    { id: "d2", name: "Чизкейк Нью-Йорк", desc: "Классический сливочный чизкейк на песочной основе.", price: 240, weight: "130 г" },
    { id: "d3", name: "Тирамису", desc: "Маскарпоне, кофе, какао, савоярди.", price: 250, weight: "130 г" },
  ],
  drinks: [
    { id: "dr1", name: "Coca-Cola 0.5 л", desc: "Классическая газировка.", price: 90, weight: "0.5 л" },
    { id: "dr2", name: "Домашний лимонад", desc: "Лимон, мята, содовая.", price: 150, weight: "0.4 л" },
    { id: "dr3", name: "Мохито безалкогольный", desc: "Лайм, мята, тростниковый сахар.", price: 170, weight: "0.4 л" },
    { id: "dr4", name: "Чай / кофе", desc: "На выбор: чёрный чай, американо, капучино.", price: 100, weight: "0.3 л" },
  ],
};

const COMBO = [
  { id: "c1", name: "Комбо для одного", desc: "Пицца 30 см + напиток 0.4 л + соус.", price: 490 },
  { id: "c2", name: "Комбо для двоих", desc: "2 пиццы 30 см + 2 напитка + закуска на выбор.", price: 990 },
  { id: "c3", name: "Семейное комбо", desc: "2 пиццы 40 см + закуска + 4 напитка.", price: 1590 },
  { id: "c4", name: "Комбо для компании", desc: "3 пиццы 40 см + 2 закуски + 6 напитков.", price: 2390 },
];

const CATEGORY_LABEL = { pizza: "Пицца", snacks: "Закуски", desserts: "Десерты", drinks: "Напитки" };

// ---------- состояние корзины ----------
let cart = {};
try {
  cart = JSON.parse(localStorage.getItem("pizza_cart") || "{}");
} catch (e) {
  cart = {};
}

const ALL_ITEMS = [...Object.values(MENU).flat(), ...COMBO];

function findItem(id) {
  return ALL_ITEMS.find((i) => i.id === id);
}

function saveCart() {
  try {
    localStorage.setItem("pizza_cart", JSON.stringify(cart));
  } catch (e) {}
}

function cartCountTotal() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartPriceTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = findItem(id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCartBadge();
  renderCartDrawer();
  showToast(`${findItem(id)?.name || "Товар"} добавлен в корзину`);
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCartBadge();
  renderCartDrawer();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  renderCartBadge();
  renderCartDrawer();
}

// ---------- рендер бейджа ----------
function renderCartBadge() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cartCountTotal();
}

// ---------- рендер меню ----------
function renderMenu(category) {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;
  grid.innerHTML = "";
  MENU[category].forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.innerHTML = `
      <div class="menu-card-top">
        <h3>${item.name}</h3>
        <span class="price">${item.price} с</span>
      </div>
      <p>${item.desc}</p>
      <div class="menu-card-bottom">
        <span class="weight">${item.weight}</span>
        <button class="add-btn" data-id="${item.id}" aria-label="Добавить ${item.name} в корзину">+</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- рендер комбо ----------
function renderCombo() {
  const grid = document.getElementById("comboGrid");
  if (!grid) return;
  grid.innerHTML = "";
  COMBO.forEach((item) => {
    const card = document.createElement("article");
    card.className = "combo-card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="combo-card-bottom">
        <span class="price">${item.price} с</span>
        <button class="btn btn-primary btn-sm add-btn-combo" data-id="${item.id}">Добавить</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- рендер корзины (drawer) ----------
function renderCartDrawer() {
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!wrap || !totalEl) return;

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">Корзина пока пуста.<br>Выбери что-нибудь вкусное 🍕</p>`;
  } else {
    wrap.innerHTML = ids
      .map((id) => {
        const item = findItem(id);
        if (!item) return "";
        return `
          <div class="cart-item" data-id="${id}">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">${item.price} с × ${cart[id]}</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="dec" data-id="${id}" aria-label="Уменьшить количество">−</button>
              <span class="qty-val">${cart[id]}</span>
              <button class="qty-btn" data-action="inc" data-id="${id}" aria-label="Увеличить количество">+</button>
              <button class="cart-remove" data-action="remove" data-id="${id}">убрать</button>
            </div>
          </div>
        `;
      })
      .join("");
  }
  totalEl.textContent = `${cartPriceTotal()} сом`;
}

// ---------- toast ----------
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

// ---------- cart drawer open/close ----------
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderMenu("pizza");
  renderCombo();
  renderCartBadge();
  renderCartDrawer();
  document.getElementById("year").textContent = new Date().getFullYear();

  // header scroll state
  const header = document.getElementById("header");
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // mobile nav
  const burger = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });
  mobileNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // tabs
  document.getElementById("tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderMenu(tab.dataset.cat);
  });

  // add to cart — pizza/snacks/desserts/drinks
  document.getElementById("menuGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    addToCart(btn.dataset.id);
    btn.classList.add("bump");
    setTimeout(() => btn.classList.remove("bump"), 300);
  });

  // add to cart — combo
  document.getElementById("comboGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn-combo");
    if (!btn) return;
    addToCart(btn.dataset.id);
  });

  // cart drawer controls
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  document.getElementById("cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "inc") changeQty(id, 1);
    if (action === "dec") changeQty(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  // checkout
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cartCountTotal() === 0) {
      showToast("Корзина пуста — сначала добавьте пиццу 🍕");
      return;
    }
    showToast("Заявка принята! Мы свяжемся с вами для подтверждения.");
    cart = {};
    saveCart();
    renderCartBadge();
    renderCartDrawer();
    setTimeout(closeCart, 900);
  });

  // order form
  document.getElementById("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const note = document.getElementById("formNote");
    note.textContent = "Спасибо! Заявка отправлена, мы перезвоним в течение 5 минут.";
    e.target.reset();
    setTimeout(() => (note.textContent = ""), 5000);
  });

  // scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
});