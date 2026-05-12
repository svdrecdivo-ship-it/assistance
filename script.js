let newsStore = [];
let timeFilter = 'today';
let topicFilter = 'all';

function updateClock() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').innerText = new Date().toLocaleDateString('vi-VN', options);
}

async function fetchFinanceNews() {
    const rssUrl = 'https://vnexpress.net/rss/kinh-doanh.rss';
    const apiProxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    try {
        const res = await fetch(apiProxy);
        const data = await res.json();
        if (data.status === 'ok') {
            newsStore = data.items;
            // Tin tiêu điểm luôn là tin mới nhất tuyệt đối
            document.getElementById('ai-analysis-content').innerHTML = `<p><strong>Mới nhất:</strong> ${newsStore[0].title}</p>`;
            renderNews();
        }
    } catch (e) {
        console.error("Lỗi:", e);
    }
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    const todayStr = new Date().toDateString();
    
    let filtered = newsStore.filter(item => {
        const itemDate = new Date(item.pubDate).toDateString();
        const isToday = itemDate === todayStr;
        
        const matchesTime = (timeFilter === 'today') ? isToday : !isToday;
        const matchesTopic = (topicFilter === 'all') || 
                             item.title.toLowerCase().includes(topicFilter) || 
                             item.description.toLowerCase().includes(topicFilter);
        
        return matchesTime && matchesTopic;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px;">Không có bản tin nào khớp với lựa chọn này.</p>`;
        return;
    }

    grid.innerHTML = filtered.slice(0, 8).map(item => `
        <div class="news-item">
            <h3 style="font-size:1.1rem; color:#1a237e;">${item.title}</h3>
            <p style="font-size:0.9rem; color:#555;">${item.description.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
            <a href="${item.link}" target="_blank" style="text-decoration:none; font-weight:bold; color:#d4af37;">Xem thêm →</a>
        </div>
    `).join('');
}

// Xử lý Tab
function filterTime(type) {
    timeFilter = type;
    document.querySelectorAll('#time-tabs .tab-item').forEach((el, i) => el.classList.toggle('active', (i === 0 && type === 'today') || (i === 1 && type === 'older')));
    renderNews();
}

function filterTopic(topic) {
    topicFilter = topic;
    const tabs = document.querySelectorAll('#topic-tabs .tab-item');
    const topics = ['all', 'chứng khoán', 'ngân hàng', 'vàng'];
    tabs.forEach((el, i) => el.classList.toggle('active', topics[i] === topic));
    renderNews();
}

// Tính toán giữ nguyên logic Nam thích
function animateResult(val) {
    const box = document.getElementById('result-box');
    box.innerHTML = `Kết quả: <b style="font-size:1.5rem;">${val.toLocaleString()} VNĐ</b>`;
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
