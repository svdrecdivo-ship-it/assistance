// 1. Đồng hồ
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = `Lúc: ${now.toLocaleString('vi-VN')}`;
}

// 2. Dark Mode
document.getElementById('dark-mode-toggle').onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('dark-mode-toggle').innerText = isDark ? "☀️ Chế độ sáng" : "🌙 Chế độ tối";
};

// 3. Sửa lỗi lấy tin tức (Đảm bảo tin Tài chính hiện ra)
async function fetchNews(category) {
    // Cập nhật trạng thái nút
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(category)) btn.classList.add('active');
    });

    const grid = document.getElementById('news-grid');
    grid.innerHTML = "<p>Đang tải dữ liệu bản tin...</p>";

    // Proxy ổn định hơn
    const api = `https://api.rss2json.com/v1/api.json?rss_url=https://vnexpress.net/rss/${category}.rss`;
    
    try {
        const res = await fetch(api);
        const data = await res.json();
        
        if(data.status === 'ok') {
            // Cập nhật tiêu điểm
            document.getElementById('ai-analysis-content').innerHTML = `<p><b>Mới nhất:</b> ${data.items[0].title}</p>`;

            // Đổ 9 tin vào lưới 3 cột
            grid.innerHTML = data.items.slice(1, 10).map(item => `
                <div class="news-item">
                    <h4 style="margin:0 0 8px 0; font-size: 0.95rem;">${item.title}</h4>
                    <p style="font-size: 0.8rem; color: #777;">${item.description.replace(/<[^>]*>/g, '').substring(0, 90)}...</p>
                    <a href="${item.link}" target="_blank" style="font-size: 0.75rem; text-decoration:none; color:var(--accent); font-weight:bold;">Xem chi tiết →</a>
                </div>
            `).join('');
        }
    } catch (e) {
        grid.innerHTML = "<p>Không thể kết nối. Bạn hãy nhấn F5 để tải lại nhé!</p>";
    }
}

// 4. Máy tính tài chính (Sửa lỗi FV)
function showStatus(msg, isError = false) {
    const box = document.getElementById('result-box');
    box.innerHTML = msg;
    box.style.color = isError ? "#e74c3c" : "inherit";
}

function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (!p || !r || !n) return showStatus("❌ Bạn vui lòng nhập đủ số liệu!", true);
    showStatus(`✅ Tiền lãi dự tính: <b>${Math.round(p * r * n).toLocaleString()} VNĐ</b>`);
}

function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    
    if (!p || !r || !n) return showStatus("❌ Bạn cần nhập đủ số liệu để tính FV!", true);
    
    // Công thức giá trị tương lai: FV = P * (1 + r)^n
    const fv = p * Math.pow((1 + r), n);
    showStatus(`✅ Gốc + Lãi (FV): <b style="color:#2ecc71">${Math.round(fv).toLocaleString()} VNĐ</b>`);
}

function calcTax() {
    const s = parseFloat(document.getElementById('salary').value) || 0;
    const d = parseFloat(document.getElementById('dependents').value) || 0;
    if (s === 0) return showStatus("❌ Bạn vui lòng nhập mức lương!", true);
    const taxable = s - 11000000 - (d * 4400000);
    let tax = 0;
    if (taxable > 0) {
        if (taxable <= 5000000) tax = taxable * 0.05;
        else if (taxable <= 10000000) tax = taxable * 0.1 - 250000;
        else tax = taxable * 0.15 - 750000;
    }
    showStatus(`✅ Thuế TNCN tạm tính: <b style="color:#e74c3c">${Math.round(tax).toLocaleString()} VNĐ</b>`);
}

// Tự khởi động
window.onload = () => {
    updateClock();
    fetchNews('kinh-doanh');
    setInterval(updateClock, 1000);
};