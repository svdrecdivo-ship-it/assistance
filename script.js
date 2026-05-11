// Dark Mode Toggle
const btn = document.getElementById('dark-mode-toggle');
btn.onclick = () => {
    document.body.classList.toggle('dark-theme');
    btn.innerText = document.body.classList.contains('dark-theme') ? "☀️ Chế độ sáng" : "🌓 Chế độ tối";
};

// Đồng hồ
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleString('vi-VN');
}, 1000);

// Tính Lãi
function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = (parseFloat(document.getElementById('rate').value) / 100) / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (!p || !r || !n) return alert("Vui lòng nhập đầy đủ thông số để tính toán!");
    
    const res = Math.round(p * r * n);
    document.getElementById('result-box').innerHTML = `Số tiền lãi dự kiến: <span style="color:var(--accent)">${res.toLocaleString()} VNĐ</span>`;
}

// Tính Thuế TNCN
function calcTax() {
    const s = parseFloat(document.getElementById('salary').value) || 0;
    const d = parseFloat(document.getElementById('dependents').value) || 0;
    if (s <= 0) return alert("Vui lòng nhập tổng thu nhập!");

    const taxable = s - 11000000 - (d * 4400000);
    let tax = taxable > 0 ? taxable * 0.1 : 0; // Công thức đơn giản hóa
    document.getElementById('result-box').innerHTML = `Thuế TNCN tạm tính: <span style="color:#e74c3c">${Math.round(tax).toLocaleString()} VNĐ</span>`;
}

// Hàm lấy tin tức VnExpress
async function changeCategory(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const grid = document.getElementById('news-grid');
    grid.innerHTML = "Đang tải tin mới...";
    
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://vnexpress.net/rss/${cat}.rss`);
        const data = await res.json();
        grid.innerHTML = data.items.slice(0, 6).map(item => `
            <div class="news-item" style="background:var(--card); padding:20px; border-radius:10px; box-shadow:var(--shadow)">
                <h4 style="color:var(--accent)">${item.title}</h4>
                <a href="${item.link}" target="_blank" style="color:var(--text); font-size:0.8rem">Xem chi tiết</a>
            </div>
        `).join('');
    } catch(e) { grid.innerHTML = "Không thể kết nối dữ liệu tin tức."; }
}

window.onload = () => changeCategory('kinh-doanh', document.querySelector('.tab-btn'));
