// ===== DOM =====
const addView = document.getElementById("addView");
const listView = document.getElementById("listView");
const btnAdd = document.getElementById("btnAdd");
const btnList = document.getElementById("btnList");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const debtInput = document.getElementById("debt");
const shellInput = document.getElementById("shellDebt");

const list = document.getElementById("list");
const totalDebtEl = document.getElementById("totalDebt");
const totalShellEl = document.getElementById("totalShell");

// ===== Navigation =====
btnAdd.addEventListener("click", () => {
    addView.classList.remove("hidden");
    listView.classList.add("hidden");
    btnAdd.classList.add("active");
    btnList.classList.remove("active");
});
btnList.addEventListener("click", () => {
    addView.classList.add("hidden");
    listView.classList.remove("hidden");
    btnAdd.classList.remove("active");
    btnList.classList.add("active");
    renderList();
});

// ===== LocalStorage =====
function getCustomers() {
    return JSON.parse(localStorage.getItem("customers") || "[]");
}
function saveCustomers(data) {
    localStorage.setItem("customers", JSON.stringify(data));
}

// ===== Thêm khách =====
function addCustomer() {
    const name = nameInput.value.trim();
    if (!name) return alert("Chưa nhập tên");
    const phone = phoneInput.value.trim();
    const debt = parseFloat(debtInput.value) || 0;
    const shell = parseInt(shellInput.value) || 0;

    const customers = getCustomers();
    customers.push({ name, phone, debt, shell });
    saveCustomers(customers);

    nameInput.value = "";
    phoneInput.value = "";
    debtInput.value = "";
    shellInput.value = "";

    alert("Đã lưu khách");
}

// ===== Render danh sách =====
function renderList() {
    const customers = getCustomers();
    list.innerHTML = "";

    // Tổng nợ tiền & vỏ
    const totalDebt = customers.reduce((sum, c) => sum + (c.debt || 0), 0);
    const totalShell = customers.reduce((sum, c) => sum + (c.shell || 0), 0);
    totalDebtEl.textContent = "Tổng nợ: " + totalDebt.toLocaleString() + " VNĐ";
    totalShellEl.textContent = "Tổng thiếu vỏ: " + totalShell.toLocaleString() + " bình";

    customers.forEach((c, i) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
      <strong>${c.name}</strong>
      <div class="phone">${c.phone || ""}</div>
      <div class="debt">Thiếu nợ: ${c.debt.toLocaleString()} VNĐ</div>
      <div class="shell">Thiếu vỏ: ${c.shell} bình</div>
      <button class="delete" onclick="removeCustomer(${i})">Xóa</button>
    `;
        list.appendChild(div);
    });
}

// ===== Xóa khách =====
function removeCustomer(i) {
    const customers = getCustomers();
    customers.splice(i, 1);
    saveCustomers(customers);
    renderList();
}
