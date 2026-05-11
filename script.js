// ==========================================================
// 1. CHẾ ĐỘ SÁNG / TỐI (DARK MODE)
// ==========================================================
const darkModeBtn = document.getElementById('dark-mode-toggle');

darkModeBtn.addEventListener('click', () => {
    // Chuyển đổi class dark-theme cho thẻ body
    document.body.classList.toggle('dark-theme');
    
    // Lưu trạng thái vào bộ nhớ trình duyệt để khi load lại trang không bị mất
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Cập nhật text trên nút
    darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Chế độ sáng' : '<i class="fas fa-moon"></i> Chế độ tối';
});

// Kiểm tra chế độ đã lưu khi vừa mở trang
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Chế độ sáng';
}

// ==========================================================
// 2. ĐỒNG HỒ THỜI GIAN THỰC
// ==========================================================
function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', 
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
    };
    const timeString = now.toLocaleDateString('vi-VN', options);
    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.innerText = timeString;
}

// ==========================================================
// 3. LẤY TIN TỨC TỪ VNEXPRESS (RSS TO JSON)
// ==========================================================
async function changeCategory(category, element) {
    // Cập nhật trạng thái Active cho các nút tab
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (element) element.classList.add('active');

    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 20px;">Đang cập nhật tin tức mới nhất...</div>';

    // Sử dụng API rss2json để chuyển đổi RSS của VnExpress sang JSON
    const rssUrl = `https://vnexpress.net/rss/${category}.rss`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            // Cập nhật Tiêu điểm (Tin đầu tiên)
            const spotlight = document.getElementById('ai-analysis-content');
            if (spotlight && data.items.length > 0) {
                spotlight.innerHTML = `<p><strong>Mới nhất:</strong> ${data.items[0].title}</p>`;
            }

            // Hiển thị danh sách tin tức (lấy 6 tin tiếp theo)
            newsGrid.innerHTML = data.items.slice(1, 7).map(item => `
                <div class="news-item" style="animation: fadeIn 0.5s ease forwards;">
                    <h4 style="margin-top:0; color:var(--accent);">${item.title}</h4>
                    <p style="font-size: 0.9rem; opacity: 0.8;">${item.description.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                    <a href="${item.link}" target="_blank" style="text-decoration:none; font-weight:bold; color:var(--accent);">Đọc tiếp →</a>
                </div>
            `).join('');
        }
    } catch (error) {
        newsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Không thể tải tin tức lúc này. Vui lòng thử lại sau.</div>';
    }
}

// ==========================================================
// 4. LOGIC CÔNG CỤ TÀI CHÍNH
// ==========================================================

// Hàm định dạng số tiền VNĐ có dấu phẩy
function formatVND(amount) {
    return Math.round(amount).toLocaleString('vi-VN') + " VNĐ";
}

// Tính lãi đơn / lãi vay
function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = (parseFloat(document.getElementById('rate').value) / 100) / 12; // Lãi tháng
    const n = parseFloat(document.getElementById('months').value);

    if (!p || !r || !n) {
        alert("Vui lòng nhập đầy đủ thông tin số tiền, lãi suất và kỳ hạn.");
        return;
    }

    const interest = p * r * n;
    document.getElementById('result-box').innerHTML = `Số tiền lãi nhận được dự kiến là: <br><span style="font-size: 1.5rem; color: #27ae60;">${formatVND(interest)}</span>`;
}

// Tính lãi kép (FV)
function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = (parseFloat(document.getElementById('rate').value) / 100) / 12;
    const n = parseFloat(document.getElementById('months').value);

    if (!p || !r || !n) {
        alert("Vui lòng nhập đầy đủ thông tin để tính lãi kép.");
        return;
    }

    const fv = p * Math.pow((1 + r), n);
    document.getElementById('result-box').innerHTML = `Tổng số tiền (Gốc + Lãi kép) nhận được: <br><span style="font-size: 1.5rem; color: #27ae60;">${formatVND(fv)}</span>`;
}

// Tính thuế thu nhập cá nhân (TNCN) - Cập nhật biểu thuế lũy tiến
function calcTax() {
    const salary = parseFloat(document.getElementById('salary').value) || 0;
    const dependents = parseFloat(document.getElementById('dependents').value) || 0;

    if (salary <= 0) {
        alert("Vui lòng nhập tổng thu nhập hàng tháng.");
        return;
    }

    // Giảm trừ gia cảnh (Bản thân 11tr, người phụ thuộc 4.4tr)
    const taxableIncome = salary - 11000000 - (dependents * 4400000);
    
    let tax = 0;
    if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) tax = taxableIncome * 0.05;
        else if (taxableIncome <= 10000000) tax = taxableIncome * 0.1 - 250000;
        else if (taxableIncome <= 18000000) tax = taxableIncome * 0.15 - 750000;
        else if (taxableIncome <= 32000000) tax = taxableIncome * 0.2 - 1650000;
        else tax = taxableIncome * 0.25 - 3250000;
    }

    document.getElementById('result-box').innerHTML = `Thuế TNCN tạm tính phải nộp: <br><span style="font-size: 1.5rem; color: #e74c3c;">${formatVND(tax)}</span>`;
}

// ==========================================================
// 5. KHỞI CHẠY HỆ THỐNG
// ==========================================================
window.onload = () => {
    // Chạy đồng hồ ngay lập tức và mỗi giây
    updateClock();
    setInterval(updateClock, 1000);

    // Mặc định load tin tức mảng Kinh doanh
    const defaultTab = document.querySelector('.tab-btn');
    changeCategory('kinh-doanh', defaultTab);
};
