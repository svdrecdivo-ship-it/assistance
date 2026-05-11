// 1. Đồng hồ thời gian thực
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').innerText = now.toLocaleDateString('vi-VN', options);
}

// 2. Lấy tin tức và Tự động hóa tiêu điểm (Sửa lỗi mất tin)
async function fetchFinanceNews() {
    const rssUrl = 'https://vnexpress.net/rss/kinh-doanh.rss';
    // Sử dụng proxy rss2json để lấy dữ liệu ổn định
    const apiProxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    try {
        const res = await fetch(apiProxy);
        const data = await res.json();
        
        if (data.status === 'ok') {
            // LẤY TIN MỚI NHẤT ĐƯA VÀO TIÊU ĐIỂM
            const hotNews = data.items[0].title;
            const spotlight = document.getElementById('ai-analysis-content');
            if(spotlight) {
                spotlight.innerHTML = `
                    <p><strong>Tin nóng nhất:</strong> ${hotNews}</p>
                    <p style="font-size: 0.8rem; color: #888;"><i>*Cập nhật tự động từ VnExpress</i></p>
                `;
            }

            // ĐỔ 8 BẢN TIN VÀO LƯỚI (DÀN TRANG ĐỐI XỨNG)
            const grid = document.getElementById('news-grid');
            if(grid) {
                grid.innerHTML = data.items.slice(1, 9).map(item => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.description;
                    return `
                    <div class="news-item">
                        <h3>${item.title}</h3>
                        <p>${tempDiv.textContent.substring(0, 130)}...</p>
                        <a href="${item.link}" target="_blank">Xem chi tiết →</a>
                    </div>`;
                }).join('');
            }
        }
    } catch (e) {
        console.error("Lỗi tải tin tức:", e);
        document.getElementById('news-grid').innerHTML = "<p>Không thể tải tin tức lúc này. Nam vui lòng làm mới trang (F5) nhé!</p>";
    }
}

// 3. Các hàm máy tính tài chính (Khớp ID chính xác)
function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Nhập đủ số liệu nha Nam!");
    document.getElementById('result-box').innerHTML = `Tiền lãi nhận được: <b>${Math.round(p * r * n).toLocaleString()} VNĐ</b>`;
}

function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Nhập đủ số liệu nha Nam!");
    const fv = p * Math.pow((1 + r), n);
    document.getElementById('result-box').innerHTML = `Gốc + Lãi (FV): <b>${Math.round(fv).toLocaleString()} VNĐ</b>`;
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
    document.getElementById('result-box').innerHTML = `Thuế TNCN tạm tính: <b style="color:red">${Math.round(tax).toLocaleString()} VNĐ</b>`;
}

// KHỞI CHẠY
window.onload = () => {
    updateClock();
    fetchFinanceNews();
    setInterval(updateClock, 1000);
};
