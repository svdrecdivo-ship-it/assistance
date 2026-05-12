function updateClock() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').innerText = new Date().toLocaleDateString('vi-VN', options);
}

async function fetchFinanceNews() {
    const rssUrl = 'https://vnexpress.net/rss/kinh-doanh.rss';
    const apiProxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&t=${new Date().getTime()}`;
    
    try {
        const res = await fetch(apiProxy);
        const data = await res.json();
        if (data.status === 'ok') {
            document.getElementById('ai-analysis-content').innerHTML = `
                <p style="font-weight:bold; color:#1a237e;">${data.items[0].title}</p>
                <p style="font-size:0.9rem; color:#666;">${data.items[0].description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
            `;
            
            const grid = document.getElementById('news-grid');
            grid.innerHTML = data.items.slice(1, 10).map(item => `
                <div class="news-item">
                    <h3 style="font-size:1.1rem; color:#1a237e; margin-top:0;">${item.title}</h3>
                    <p style="font-size:0.9rem; color:#555;">${item.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                    <a href="${item.link}" target="_blank" style="text-decoration:none; font-weight:bold; color:#d4af37;">Xem thêm →</a>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error("Lỗi cập nhật tin tức:", e);
    }
}

function animateResult(val) {
    const box = document.getElementById('result-box');
    box.innerHTML = `Kết quả tạm tính: <b style="font-size:1.6rem;">${val.toLocaleString()} VNĐ</b>`;
}

function calcInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Vui lòng nhập đủ số liệu nhé!");
    animateResult(Math.round(p * r * n));
}

function calcFV() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('months').value);
    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Vui lòng nhập đủ số liệu nhé!");
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
    setInterval(fetchFinanceNews, 300000); 
};
