// 1. Đồng hồ thời gian thực
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').innerText = now.toLocaleDateString('vi-VN', options);
}

// 2. Hiệu ứng đếm số (Animate Counter) cho kết quả sinh động
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `Kết quả tạm tính: <span style="font-size: 1.5rem; color: #1a237e;">${value.toLocaleString()} VNĐ</span>`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 3. Lấy tin tức từ VnExpress
async function fetchFinanceNews() {
    const rssUrl = 'https://vnexpress.net/rss/kinh-doanh.rss';
    const apiProxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    try {
        const res = await fetch(apiProxy);
        const data = await res.json();
        
        if (data.status === 'ok') {
            // Cập nhật Tiêu điểm
            const hotNews = data.items[0];
            document.getElementById('ai-analysis-content').innerHTML = `
                <p><strong><i class="far fa-newspaper"></i> Tin nóng nhất:</strong> ${hotNews.title}</p>
                <p style="font-size: 0.9rem; color: #666;">${hotNews.description.split('.')[0]}...</p>
            `;

            // Đổ tin vào Grid
            const grid = document.getElementById('news-grid');
            grid.innerHTML = data.items.slice(1, 9).map((item, index) => `
                <div class="news-item" style="animation: slideUp ${0.3 + index * 0.1}s ease-out;">
                    <h3>${item.title}</h3>
                    <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                    <a href="${item.link}" target="_blank" style="color: #1a237e; font-weight: bold; text-decoration: none;">Đọc tiếp <i class="fas fa-arrow-right"></i></a>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error("Lỗi:", e);
    }
}

// 4. Các hàm máy tính tài chính
function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Nam ơi, hãy nhập đủ số liệu nhé!");
    
    const result = Math.round(p * r * n);
    animateValue('result-box', 0, result, 800);
}

function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Nam ơi, hãy nhập đủ số liệu nhé!");
    
    const fv = Math.round(p * Math.pow((1 + r), n));
    animateValue('result-box', 0, fv, 800);
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
    animateValue('result-box', 0, Math.round(tax), 800);
}

window.onload = () => {
    updateClock();
    fetchFinanceNews();
    setInterval(updateClock, 1000);
};
