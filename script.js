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

function getFriday(d) {
    d = new Date(d);
    let day = d.getDay();
    if (day === 0) day = 7; 
    let diff = d.getDate() - day + 5; 
    return new Date(d.setDate(diff));
}

currentDate = getFriday(currentDate);

let startDateStr = localStorage.getItem('rfc_startWeek_fri');
if (!startDateStr) {
    startDateStr = formatDate(currentDate); 
    localStorage.setItem('rfc_startWeek_fri', startDateStr);
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
        currentDate = getFriday(pickedDate);
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
    localStorage.setItem(`rfc_log_fri_${dateStr}`, JSON.stringify(data));
    
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
    const saved = localStorage.getItem(`rfc_log_fri_${dateStr}`);
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
        localStorage.removeItem(`rfc_log_fri_${dateStr}`);
        loadData(dateStr);
    }
}

function exportToCSV() {
    let csvContent = "Data (Sexta-feira),Atividades da Semana,Desafios Tecnicos,Aprendizados\n";

    let keys = Object.keys(localStorage).filter(key => key.startsWith('rfc_log_fri_'));
    
    keys.sort();

    if (keys.length === 0) {
        alert("Nenhum registro encontrado no sistema para exportar.");
        return;
    }

    keys.forEach(key => {
        const dateStr = key.replace('rfc_log_fri_', '');
        const dataStr = localStorage.getItem(key);
        
        if (dataStr) {
            const data = JSON.parse(dataStr);
            
            const formatCSV = (text) => {
                if (!text) return '""';
                return `"${text.replace(/"/g, '""')}"`;
            };

            const col1 = formatCSV(dateStr);
            const col2 = formatCSV(data.box1);
            const col3 = formatCSV(data.box2);
            const col4 = formatCSV(data.box3);

            csvContent += `${col1},${col2},${col3},${col4}\n`;
        }
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "logbook_estagio.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

updateDisplay();
