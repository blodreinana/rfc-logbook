const htmlRoot = document.documentElement;

if (localStorage.getItem('rfc_theme') === 'light') {
    htmlRoot.setAttribute('data-theme', 'light');
}

function toggleTheme() {
    if (htmlRoot.getAttribute('data-theme') === 'light') {
        htmlRoot.removeAttribute('data-theme');
        localStorage.setItem('rfc_theme', 'dark');
    } else {
        htmlRoot.setAttribute('data-theme', 'light');
        localStorage.setItem('rfc_theme', 'light');
    }
}

let currentDate = new Date();

let startDateStr = localStorage.getItem('rfc_startDate');
if (!startDateStr) {
    startDateStr = formatDate(new Date()); 
    localStorage.setItem('rfc_startDate', startDateStr);
}

function formatDate(date) {
    const d = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return d.toISOString().split('T')[0];
}

function calculateDayNumber(currentDateStr) {
    const start = new Date(startDateStr + "T00:00:00");
    const current = new Date(currentDateStr + "T00:00:00");
    const diffTime = current - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `DAY_PRE_START (${diffDays})`;
    return `DAY_${String(diffDays + 1).padStart(2, '0')}`;
}

function updateDisplay() {
    const dateStr = formatDate(currentDate);
    
    document.getElementById('date-picker').value = dateStr;
    document.getElementById('entry-id').innerText = `IDX_${dateStr.replace(/-/g, '')}`;
    document.getElementById('day-counter').innerText = calculateDayNumber(dateStr);
    
    loadData(dateStr);
}

function changePage(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDisplay();
}

function jumpToDate() {
    const selectedDate = document.getElementById('date-picker').value;
    if (selectedDate) {
        currentDate = new Date(selectedDate + "T12:00:00"); 
        updateDisplay();
    }
}

function autoSave() {
    const dateStr = formatDate(currentDate);
    const data = {
        box1: document.getElementById('box-1').innerText,
        box2: document.getElementById('box-2').innerText,
        box3: document.getElementById('box-3').innerText
    };
    localStorage.setItem(`rfc_log_${dateStr}`, JSON.stringify(data));
    
    const status = document.getElementById('save-status');
    status.innerText = "SAVING...";
    setTimeout(() => status.innerText = "DATA_SYNCED", 500);
}

function manualSave() {
    autoSave();
    const status = document.getElementById('save-status');
    status.innerText = "LOG_SAVED_SECURELY";
    status.style.color = getComputedStyle(document.documentElement).getPropertyValue('--success-color'); 
    setTimeout(() => {
        status.innerText = "SYSTEM_READY";
        status.style.color = "var(--neon-blue)";
    }, 2000);
}

function loadData(dateStr) {
    const saved = localStorage.getItem(`rfc_log_${dateStr}`);
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('box-1').innerText = data.box1 || "";
        document.getElementById('box-2').innerText = data.box2 || "";
        document.getElementById('box-3').innerText = data.box3 || "";
    } else {
        document.getElementById('box-1').innerText = "";
        document.getElementById('box-2').innerText = "";
        document.getElementById('box-3').innerText = "";
    }
}

function clearCurrentPage() {
    if(confirm("Deseja apagar os registros deste dia?")) {
        const dateStr = formatDate(currentDate);
        localStorage.removeItem(`rfc_log_${dateStr}`);
        loadData(dateStr);
    }
}

// Inicializar

updateDisplay();
