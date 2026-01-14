// ===== DOM ELEMENTS =====
const storeView = document.getElementById("storeView");
const addView = document.getElementById("addView");
const listView = document.getElementById("listView");

const btnStore = document.getElementById("btnStore");
const btnAdd = document.getElementById("btnAdd");
const btnList = document.getElementById("btnList");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const debtInput = document.getElementById("debt");
const shellInput = document.getElementById("shellDebt");

const list = document.getElementById("list");
const totalDebtEl = document.getElementById("totalDebt");
const totalShellEl = document.getElementById("totalShell");

// ===== CHUYỂN ĐỔI VIEW =====
function showView(view) {
    storeView.classList.add("hidden");
    addView.classList.add("hidden");
    listView.classList.add("hidden");

    btnStore.classList.remove("active");
    btnAdd.classList.remove("active");
    btnList.classList.remove("active");

    view.classList.remove("hidden");

    if (view === storeView) btnStore.classList.add("active");
    if (view === addView) btnAdd.classList.add("active");
    if (view === listView) btnList.classList.add("active");
}

// ===== LOCAL STORAGE =====
function getCustomers() {
    return JSON.parse(localStorage.getItem("customers") || "[]");
}
function saveCustomers(data) {
    localStorage.setItem("customers", JSON.stringify(data));
}

// ===== THÊM KHÁCH HÀNG =====
function addCustomer() {
    const name = nameInput.value.trim();
    if (!name) return alert("Vui lòng nhập tên khách!");

    const customer = {
        name,
        phone: phoneInput.value.trim(),
        debt: Number(debtInput.value) || 0,
        shell: Number(shellInput.value) || 0
    };

    const customers = getCustomers();
    customers.push(customer);
    saveCustomers(customers);

    // Reset form
    nameInput.value = "";
    phoneInput.value = "";
    debtInput.value = "";
    shellInput.value = "";

    alert("Đã thêm khách hàng thành công!");
}

// ===== HIỂN THỊ DANH SÁCH (Sử dụng CSS Class của bạn) =====
function renderList() {
    const customers = getCustomers();

    // Tạo tiêu đề bảng dùng class .table-header trong CSS
    list.innerHTML = `
    <div class="table-header">
      <div>Tên</div>
      <div>SĐT</div>
      <div style="text-align: left">Nợ (VNĐ)</div>
      <div style="text-align: left">Vỏ</div>
      <div></div>
    </div>
  `;

    let totalDebt = 0;
    let totalShell = 0;

    customers.forEach((c, i) => {
        totalDebt += c.debt;
        totalShell += c.shell;

        const row = document.createElement("div");
        row.className = "table-row"; // Sử dụng class .table-row trong CSS

        row.innerHTML = `
      <div><strong>${c.name}</strong></div>
      <div style="font-size: 13px; color: #555;">${c.phone || "-"}</div>
      
      <div class="debt">
        <input type="number" value="${c.debt}" onchange="updateDebt(${i}, this.value)">
      </div>
      
      <div class="shell">
        <input type="number" value="${c.shell}" onchange="updateShell(${i}, this.value)">
      </div>
      
      <div style="text-align: right;">
        <button class="delete" onclick="removeCustomer(${i})">Xóa</button>
      </div>
    `;
        list.appendChild(row);
    });

    totalDebtEl.textContent = `Tổng nợ: ${totalDebt.toLocaleString("vi-VN")} VNĐ`;
    totalShellEl.textContent = `Tổng vỏ: ${totalShell} bình`;
}

// ===== CẬP NHẬT DỮ LIỆU =====
function updateDebt(i, val) {
    const customers = getCustomers();
    customers[i].debt = Number(val) || 0;
    saveCustomers(customers);
    renderList(); // Render lại để cập nhật tổng
}

function updateShell(i, val) {
    const customers = getCustomers();
    customers[i].shell = Number(val) || 0;
    saveCustomers(customers);
    renderList();
}

function removeCustomer(i) {
    if (!confirm("Bạn chắc chắn muốn xóa khách này?")) return;
    const customers = getCustomers();
    customers.splice(i, 1);
    saveCustomers(customers);
    renderList();
}

// ===== GIỎ HÀNG / BÁN HÀNG =====
let cart = [];
let todaySales = JSON.parse(localStorage.getItem("todaySales") || "[]");

function addToCart(name, price) {
    cart.push({ name, price });
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cartList");
    const totalEl = document.getElementById("cartTotal");

    cartList.innerHTML = ""; // Xóa trắng danh sách cũ

    if (cart.length === 0) {
        cartList.innerHTML = '<i style="color: #999; font-size: 13px;">(Giỏ hàng trống)</i>';
        totalEl.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.marginBottom = "8px";
        div.style.fontSize = "14px";

        // Thêm nút xóa nhỏ (x) bên cạnh để nhỡ bấm nhầm thì xóa được
        div.innerHTML = `
    <span>${item.name}</span>

    <div>
        <strong>${item.price.toLocaleString("vi-VN")}</strong>
        
        <span 
            style="color: red; cursor: pointer; margin-left: 10px; font-weight: bold; font-size: 16px;" 
            onclick="removeFromCart(${index})"
            title="Xóa món này"
        >
            ×
        </span>
    </div>
`;
        cartList.appendChild(div);
    });

    totalEl.textContent = total.toLocaleString("vi-VN");
}

// Thêm hàm phụ để xóa món trong giỏ hàng nếu bấm nhầm
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function checkout() {
    if (!cart.length) return alert("Giỏ hàng đang trống!");

    todaySales.push(...cart);
    localStorage.setItem("todaySales", JSON.stringify(todaySales));

    cart = [];
    renderCart();
    renderToday();
    alert("Thanh toán xong!");
}

// ===== TODAY SUMMARY (CẬP NHẬT: GỘP SỐ LƯỢNG) =====
function renderToday() {
    const totalEl = document.getElementById("todayTotal");
    const itemsEl = document.getElementById("todayItems");

    itemsEl.innerHTML = "";
    let total = 0;

    // 1. Tạo object để đếm số lượng từng món
    // Ví dụ kết quả: { "Bình gas 12kg": 2, "Bếp gas": 1 }
    let counts = {};

    todaySales.forEach(item => {
        total += item.price;

        // Nếu tên món đã có thì +1, chưa có thì gán = 1
        if (counts[item.name]) {
            counts[item.name]++;
        } else {
            counts[item.name] = 1;
        }
    });

    // 2. Hiển thị ra màn hình từ danh sách đã đếm
    // Object.keys(counts) lấy ra danh sách tên: ["Bình gas 12kg", "Bếp gas"]
    if (Object.keys(counts).length === 0) {
        itemsEl.innerHTML = "<i>Chưa bán được gì hôm nay.</i>";
    } else {
        Object.keys(counts).forEach(name => {
            const quantity = counts[name]; // Lấy số lượng

            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "5px";
            row.style.borderBottom = "1px dotted #eee";
            row.style.paddingBottom = "2px";

            // Format: Tên món ...... (Số lượng)
            row.innerHTML = `
                <span>${name}</span>
                <span style="font-weight: bold; color: green;"> ${quantity}</span>
            `;
            itemsEl.appendChild(row);
        });
    }

    totalEl.textContent = total.toLocaleString("vi-VN");
}

// ===== SỰ KIỆN NÚT BẤM =====
if (btnStore && btnAdd && btnList) {
    btnStore.onclick = () => showView(storeView);
    btnAdd.onclick = () => showView(addView);
    btnList.onclick = () => {
        showView(listView);
        renderList();
    };
}

// ===== KHỞI CHẠY =====
showView(storeView);
renderToday();
