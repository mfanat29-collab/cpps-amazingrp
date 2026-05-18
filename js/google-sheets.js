// ============================================
// Google Sheets подключение для ЦППС
// ============================================

// ЗАМЕНИ ЭТО НА ТВОЙ ID ИЗ ГУГЛ ТАБЛИЦЫ!
const SPREADSHEET_ID = 'ТВОЙ_ID_СЮДА';

// Базовый URL для получения данных
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

// Загрузка сотрудников из таблицы
async function loadEmployeesFromSheet() {
    try {
        const url = `${BASE_URL}&sheet=Сотрудники`;
        const response = await fetch(url);
        const text = await response.text();
        
        // Парсим JSON от Google
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;
        
        if (!rows || rows.length < 2) return [];
        
        // Преобразуем строки в объекты (пропускаем первую строку с заголовками)
        const employees = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.c && row.c[1] && row.c[1].v) {
                employees.push({
                    id: row.c[0]?.v || Date.now(),
                    fio: row.c[1]?.v || '',
                    phone: row.c[2]?.v || '',
                    rank: row.c[3]?.v || '',
                    spec: row.c[4]?.v || ''
                });
            }
        }
        
        return employees;
    } catch (error) {
        console.error('Ошибка загрузки сотрудников:', error);
        return [];
    }
}

// Загрузка лекций
async function loadLecturesFromSheet() {
    try {
        const url = `${BASE_URL}&sheet=Лекции`;
        const response = await fetch(url);
        const text = await response.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;
        
        if (!rows || rows.length < 2) return [];
        
        const lectures = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.c && row.c[1] && row.c[1].v) {
                lectures.push({
                    id: row.c[0]?.v || Date.now(),
                    title: row.c[1]?.v || '',
                    desc: row.c[2]?.v || ''
                });
            }
        }
        return lectures;
    } catch (error) {
        console.error('Ошибка загрузки лекций:', error);
        return [];
    }
}

// Загрузка тренировок
async function loadTrainingsFromSheet() {
    try {
        const url = `${BASE_URL}&sheet=Тренировки`;
        const response = await fetch(url);
        const text = await response.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;
        
        if (!rows || rows.length < 2) return [];
        
        const trainings = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.c && row.c[1] && row.c[1].v) {
                trainings.push({
                    id: row.c[0]?.v || Date.now(),
                    name: row.c[1]?.v || '',
                    method: row.c[2]?.v || ''
                });
            }
        }
        return trainings;
    } catch (error) {
        console.error('Ошибка загрузки тренировок:', error);
        return [];
    }
}

// Загрузка инвентаря
async function loadInventoryFromSheet() {
    try {
        const url = `${BASE_URL}&sheet=Инвентарь`;
        const response = await fetch(url);
        const text = await response.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;
        
        if (!rows || rows.length < 2) return [];
        
        const inventory = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.c && row.c[1] && row.c[1].v) {
                inventory.push({
                    id: row.c[0]?.v || i,
                    name: row.c[1]?.v || '',
                    count: parseInt(row.c[2]?.v) || 0
                });
            }
        }
        return inventory;
    } catch (error) {
        console.error('Ошибка загрузки инвентаря:', error);
        return [];
    }
}

// Главная функция загрузки всех данных
async function loadAllDataFromSheets() {
    console.log('🔄 Загрузка данных из Google Sheets...');
    
    const [employees, lectures, trainings, inventory] = await Promise.all([
        loadEmployeesFromSheet(),
        loadLecturesFromSheet(),
        loadTrainingsFromSheet(),
        loadInventoryFromSheet()
    ]);
    
    return { employees, lectures, trainings, inventory };
}

// Функция для ручного обновления
async function refreshAllData() {
    showNotification('🔄 Обновление данных...');
    const data = await loadAllDataFromSheets();
    
    if (data.employees.length > 0) {
        window.employees = data.employees;
        localStorage.setItem('cpps_emp', JSON.stringify(data.employees));
    }
    if (data.lectures.length > 0) {
        window.lecturesArr = data.lectures;
        localStorage.setItem('cpps_lectures', JSON.stringify(data.lectures));
    }
    if (data.trainings.length > 0) {
        window.trainingsArr = data.trainings;
        localStorage.setItem('cpps_trainings', JSON.stringify(data.trainings));
    }
    if (data.inventory.length > 0) {
        window.inventory = data.inventory;
        localStorage.setItem('cpps_inv', JSON.stringify(data.inventory));
    }
    
    // Обновляем интерфейс
    if (typeof renderEmployees === 'function') renderEmployees();
    if (typeof renderLectures === 'function') renderLectures();
    if (typeof renderTrainings === 'function') renderTrainings();
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof updateStatsUI === 'function') updateStatsUI();
    
    showNotification('✅ Данные обновлены из Google Sheets!');
}

// Уведомление
function showNotification(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Добавляем кнопку обновления на сайт
function addRefreshButton() {
    const statsWidget = document.getElementById('statsWidget');
    if (statsWidget && !document.getElementById('refreshSheetBtn')) {
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'refreshSheetBtn';
        refreshBtn.className = 'btn-icon';
        refreshBtn.style.position = 'fixed';
        refreshBtn.style.bottom = '20px';
        refreshBtn.style.right = '20px';
        refreshBtn.style.zIndex = '1000';
        refreshBtn.style.borderRadius = '50%';
        refreshBtn.style.width = '50px';
        refreshBtn.style.height = '50px';
        refreshBtn.style.fontSize = '20px';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshBtn.title = 'Обновить данные из Google Sheets';
        refreshBtn.onclick = () => refreshAllData();
        document.body.appendChild(refreshBtn);
    }
}

// Автоматическая загрузка при старте
async function initGoogleSheets() {
    await refreshAllData();
    addRefreshButton();
}

// Запускаем после загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogleSheets);
} else {
    initGoogleSheets();
}
