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

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
}

currentDate = getMonday(currentDate);

let startDateStr = localStorage.getItem('rfc_startWeek');
if (!startDateStr) {
    startDateStr = formatDate(currentDate); 
    localStorage.setItem('rfc_startWeek', startDateStr);
}

function formatDate(date) {
    const d = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return d.toISOString().split('T')[0];
}

function calculateWeekNumber(currentDateStr) {
    const start = new Date(startDateStr + "T00:00:00");
    const current = new Date(currentDateStr + "T00:00:00");
    const diffTime = current - start;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    if (diffWeeks < 0) return `PRE_START`;
    return `WEEK_${String(diffWeeks + 1).padStart(2, '0')}`;
}

function updateDisplay() {
    const dateStr = formatDate(currentDate);
    
    document.getElementById('date-picker').value = dateStr;
    document.getElementById('entry-id').innerText = `WK_${dateStr.replace(/-/g, '')}`;
    document.getElementById('day-counter').innerText = calculateWeekNumber(dateStr);
    
    loadData(dateStr);
}

function changePage(weeks) {
    currentDate.setDate(currentDate.getDate() + (weeks * 7));
    updateDisplay();
}

function jumpToDate() {
    const selectedDate = document.getElementById('date-picker').value;
    if (selectedDate) {
        let pickedDate = new Date(selectedDate + "T12:00:00"); 
        currentDate = getMonday(pickedDate);
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
    localStorage.setItem(`rfc_log_week_${dateStr}`, JSON.stringify(data));
    
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
    const saved = localStorage.getItem(`rfc_log_week_${dateStr}`);
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
    if(confirm("Deseja apagar os registros DESTA SEMANA?")) {
        const dateStr = formatDate(currentDate);
        localStorage.removeItem(`rfc_log_week_${dateStr}`);
        loadData(dateStr);
    }
}

updateDisplay();
