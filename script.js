// 1. Đồng hồ thời gian thực
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').innerText = now.toLocaleDateString('vi-VN', options);
}

// 2. Chế độ Dark Mode
const darkBtn = document.getElementById('dark-mode-toggle');
darkBtn.onclick = () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    darkBtn.innerText = isDark ? "☀️ Chế độ sáng" : "🌓 Chế độ tối";
};

// 3. Lấy tin tức theo từng mảng (Tabs)
async function changeCategory(category) {
    // Đổi trạng thái nút tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const rssUrl = `https://vnexpress.net/rss/${category}.rss`;
    const apiProxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const grid = document.getElementById('news-grid');
    grid.innerHTML = "<p>Đang tải tin cho Bạn...</p>";

    try {
        const res = await fetch(apiProxy);
        const data = await res.json();
        if (data.status === 'ok') {
            // Cập nhật tiêu điểm bằng tin mới nhất của mục đó
            document.getElementById('ai-analysis-content').innerHTML = `<p><strong>Tin nóng:</strong> ${data.items[0].title}</p>`;
            
            // Đổ tin vào grid
            grid.innerHTML = data.items.slice(1, 10).map(item => `
                <div class="news-item">
                    <h4>${item.title}</h4>
                    <p style="font-size: 0.85rem; color: #666;">${item.description.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                    <a href="${item.link}" target="_blank" style="text-decoration:none; color:var(--accent-color); font-weight:bold;">Đọc bài viết →</a>
                </div>
            `).join('');
        }
    } catch (e) {
        grid.innerHTML = "<p>Không thể lấy tin. Bạn vui lòng thử lại sau nhé!</p>";
    }
}

// 4. Các hàm tính toán (Xưng hô "Bạn")
function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Bạn vui lòng nhập đầy đủ số liệu nhé!");
    document.getElementById('result-box').innerHTML = `Tiền lãi của Bạn nhận được: <b>${Math.round(p * r * n).toLocaleString()} VNĐ</b>`;
}

function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Bạn vui lòng nhập đủ số liệu để tính lãi kép!");
    const fv = p * Math.pow((1 + r), n);
    document.getElementById('result-box').innerHTML = `Giá trị (Gốc + Lãi) của Bạn: <b>${Math.round(fv).toLocaleString()} VNĐ</b>`;
}

function calcTax() {
    const s = parseFloat(document.getElementById('salary').value) || 0;
    const d = parseFloat(document.getElementById('dependents').value) || 0;
    const taxable = s - 11000000 - (d * 4400000);
    let tax = 0;
    if (taxable > 0) {
        if (taxable <= 5000000) tax = taxable * 0.05;
        else if (taxable <= 10000000) tax = taxable * 0.1 - 250000;
        else tax = taxable * 0.15 - 750000;
    }
    document.getElementById('result-box').innerHTML = `Thuế TNCN Bạn cần nộp tạm tính: <b style="color: #e74c3c;">${Math.round(tax).toLocaleString()} VNĐ</b>`;
}

// Khởi chạy
window.onload = () => {
    updateClock();
    setInterval(updateClock, 1000);
    changeCategory('kinh-doanh'); // Mặc định load tin kinh doanh
};
