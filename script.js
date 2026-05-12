let allNews = []; // Lưu trữ toàn bộ tin để lọc
let currentTopic = 'all';
let currentTimeFilter = 'today';

function updateClock() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').innerText = new Date().toLocaleDateString('vi-VN', options);
}

async function fetchFinanceNews() {
    const rssUrl = 'https://vnexpress.net/rss/kinh-doanh.rss';
    const apiProxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=your_api_key_if_any`; // Thêm API key nếu cần ổn định hơn
    
    try {
        const res = await fetch(apiProxy);
        const data = await res.json();
        if (data.status === 'ok') {
            allNews = data.items;
            renderNews(); // Gọi hàm hiển thị
            // Cập nhật tiêu điểm là tin mới nhất
            document.getElementById('ai-analysis-content').innerHTML = `🚀 TIÊU ĐIỂM: ${allNews[0].title}`;
        }
    } catch (e) {
        document.getElementById('news-grid').innerHTML = "<p>Đang chờ cập nhật tin mới...</p>";
    }
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    const now = new Date();
    
    // Logic lọc tin
    let filtered = allNews.filter(item => {
        const pubDate = new Date(item.pubDate);
        const isToday = pubDate.toDateString() === now.toDateString();
        
        // Lọc theo thời gian
        const timeMatch = (currentTimeFilter === 'today') ? isToday : !isToday;
        
        // Lọc theo chủ đề (tìm từ khóa trong tiêu đề/mô tả)
        const topicMatch = (currentTopic === 'all') || 
                           item.title.toLowerCase().includes(currentTopic) || 
                           item.description.toLowerCase().includes(currentTopic);
        
        return timeMatch && topicMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Chưa có bản tin nào trong mục này hôm nay.</p>`;
        return;
    }

    grid.innerHTML = filtered.slice(0, 8).map(item => `
        <div class="news-item">
            <h3>${item.title}</h3>
            <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
            <a href="${item.link}" target="_blank" style="color:#1a237e; font-weight:bold; text-decoration:none;">Xem thêm →</a>
        </div>
    `).join('');
}

// Xử lý chuyển Tab
function filterByTime(time) {
    currentTimeFilter = time;
    updateTabUI('time-tabs', time === 'today' ? 0 : 1);
    renderNews();
}

function filterByTopic(topic) {
    currentTopic = topic;
    const index = topic === 'all' ? 0 : (topic === 'chứng khoán' ? 1 : (topic === 'ngân hàng' ? 2 : 3));
    updateTabUI('topic-tabs', index);
    renderNews();
}

function updateTabUI(parentId, activeIndex) {
    const tabs = document.getElementById(parentId).querySelectorAll('.tab-item');
    tabs.forEach((tab, idx) => {
        tab.classList.toggle('active', idx === activeIndex);
    });
}

// Các hàm tính toán giữ nguyên logic cũ nhưng cập nhật UI
function animateResult(val) {
    const box = document.getElementById('result-box');
    box.innerHTML = `Kết quả tạm tính: <b style="font-size:1.5rem;">${val.toLocaleString()} VNĐ</b>`;
}

function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Nhập đủ số liệu nha Nam!");
    animateResult(Math.round(p * r * n));
}

function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Nhập đủ số liệu nha Nam!");
    animateResult(Math.round(p * Math.pow((1 + r), n)));
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
    animateResult(Math.round(tax));
}

window.onload = () => {
    updateClock();
    fetchFinanceNews();
    setInterval(updateClock, 1000);
};
