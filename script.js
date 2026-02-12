const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMR_DJiZWwbQoO3LVsWfr2uCrDzBV_BlrqMe3mr0DeVV8Zra4-xRKnEzYTfe2ghcJo/exec";
let allData = [];
let filteredData = []; // ข้อมูลที่ผ่านการกรอง/ค้นหา
let currentPage = 1;
const rowsPerPage = 10; // กำหนดให้แสดงหน้าละ 10 รายชื่อ

function fetchData() {
    toggleLoading(true);
    fetch(`${SCRIPT_URL}?action=getData`)
        .then(res => res.json())
        .then(data => {
            allData = data.sort((a, b) => a.sequence - b.sequence);
            filteredData = allData;
            currentPage = 1; // เริ่มที่หน้า 1 เสมอ
            displayData();
            toggleLoading(false);
        })
        .catch(err => {
            console.error(err);
            toggleLoading(false);
            Swal.fire('Error', 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้', 'error');
        });
}

// ฟังก์ชันสำหรับเลือกข้อมูลเฉพาะหน้ามาแสดง
function displayData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = filteredData.slice(startIndex, endIndex);

    renderTable(paginatedItems);
    renderPagination();
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">ไม่พบข้อมูลรายชื่อ</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr onclick="showDetail(${item.sequence})">
            <td class="text-center fw-bold">${item.sequence}</td>
            <td>${item.fullName}</td>
            <td>${item.nickname || '-'}</td>
            <td class="text-center"><i class="fas fa-eye text-primary"></i></td>
        </tr>
    `).join('');
}

// ฟังก์ชันสร้างปุ่มตัวเลขหน้า
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    pagination.innerHTML = '';

    const pageCount = Math.ceil(filteredData.length / rowsPerPage);
    if (pageCount <= 1) return; // ถ้ามีหน้าเดียว ไม่ต้องแสดงปุ่ม

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = (currentPage === i) ? 'btn btn-primary rounded-circle px-3 mx-1' : 'btn btn-outline-primary rounded-circle px-3 mx-1';
        btn.addEventListener('click', () => {
            currentPage = i;
            displayData();
            window.scrollTo(0, 0); // กลับไปด้านบนสุดของตาราง
        });
        pagination.appendChild(btn);
    }
}

function showDetail(seq) {
    const item = allData.find(x => x.sequence == seq);
    if (!item) return;

    document.getElementById('detailName').innerText = item.fullName;
    document.getElementById('detailNick').innerText = item.nickname || '-';
    document.getElementById('detailSeq').innerText = item.sequence;
    document.getElementById('detailPhone').innerText = item.phone || '-';
    document.getElementById('detailEmail').innerText = item.email || '-';
    document.getElementById('detailLine').innerText = item.lineId || '-';
    document.getElementById('detailFb').innerText = item.facebook || '-';
    document.getElementById('detailIg').innerText = item.instagram || '-';
    document.getElementById('detailAddress').innerText = item.address || '-';
    
    const img = document.getElementById('detailImage');
    img.src = (item.imageUrl && item.imageUrl.trim() !== "") ? item.imageUrl : 'https://via.placeholder.com/300x400?text=No+Photo';

    showPage('detail');
}

function showPage(pageId) {
    const list = document.getElementById('listPage');
    const detail = document.getElementById('detailPage');
    if (pageId === 'list') {
        list.classList.remove('hidden');
        detail.classList.add('hidden');
    } else {
        list.classList.add('hidden');
        detail.classList.remove('hidden');
    }
    window.scrollTo(0, 0);
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredData = allData.filter(x => 
            String(x.fullName).toLowerCase().includes(term) || 
            String(x.nickname).toLowerCase().includes(term) || 
            String(x.sequence).includes(term)
        );
        currentPage = 1; // รีเซ็ตไปหน้า 1 เมื่อค้นหา
        displayData();
    });
}

function toggleLoading(show) {
    const loader = document.getElementById('loading');
    if (loader) loader.classList.toggle('hidden', !show);
}