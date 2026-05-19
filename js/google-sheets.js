// ============================================
// ЦППС - ПОЛНАЯ СИНХРОНИЗАЦИЯ (чтение + запись)
// ============================================

const API_URL = 'https://script.google.com/macros/s/AKfycbzJv08UV_UrK98pFZ9KtXvbGnYp0sTyBSwsMLF3LaNpr3znLyw9ExigyVifRzHfOA75/exec';

// ЗАГРУЗКА ДАННЫХ
async function loadAllData() {
    console.log('🔄 Загрузка данных из Google Sheets...');
    showToast('📡 Синхронизация...');
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        window.employees = data.employees || [];
        window.lecturesArr = data.lectures || [];
        window.trainingsArr = data.trainings || [];
        window.inventory = data.inventory || [];
        
        localStorage.setItem('cpps_emp', JSON.stringify(window.employees));
        localStorage.setItem('cpps_lectures', JSON.stringify(window.lecturesArr));
        localStorage.setItem('cpps_trainings', JSON.stringify(window.trainingsArr));
        localStorage.setItem('cpps_inv', JSON.stringify(window.inventory));
        
        if (typeof renderEmployees === 'function') renderEmployees();
        if (typeof renderLectures === 'function') renderLectures();
        if (typeof renderTrainings === 'function') renderTrainings();
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof updateStatsUI === 'function') updateStatsUI();
        
        console.log('✅ Загружено:', window.employees.length, 'сотрудников');
        showToast('✅ Синхронизация завершена!');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        showToast('⚠️ Ошибка соединения');
    }
}

// ДОБАВЛЕНИЕ СОТРУДНИКА
async function syncAddEmployee(employee) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addEmployee', employee: employee })
        });
        const result = await response.json();
        
        if (result.success) {
            await loadAllData(); // Перезагружаем данные
            showToast('✅ Сотрудник добавлен!');
            return true;
        } else {
            showToast('❌ Ошибка: ' + result.error);
            return false;
        }
    } catch (error) {
        console.error(error);
        showToast('❌ Ошибка отправки');
        return false;
    }
}

// ДОБАВЛЕНИЕ ЛЕКЦИИ
async function syncAddLecture(lecture) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addLecture', lecture: lecture })
        });
        await loadAllData();
        showToast('✅ Лекция добавлена!');
    } catch (error) {
        showToast('❌ Ошибка');
    }
}

// ДОБАВЛЕНИЕ ТРЕНИРОВКИ
async function syncAddTraining(training) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addTraining', training: training })
        });
        await loadAllData();
        showToast('✅ Тренировка добавлена!');
    } catch (error) {
        showToast('❌ Ошибка');
    }
}

// ДОБАВЛЕНИЕ ИНВЕНТАРЯ
async function syncAddInventory(item) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addInventory', inventory: item })
        });
        await loadAllData();
        showToast('✅ Инвентарь добавлен!');
    } catch (error) {
        showToast('❌ Ошибка');
    }
}

// УВЕДОМЛЕНИЯ
function showToast(message) {
    let toast = document.querySelector('.cpps-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cpps-toast';
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #1E293B; border-left: 4px solid #0EA5E9;
            border-radius: 12px; padding: 12px 20px;
            color: white; font-size: 14px; z-index: 10000;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// АВТО-ОБНОВЛЕНИЕ КАЖДЫЕ 10 СЕКУНД
async function initSync() {
    await loadAllData();
    setInterval(() => loadAllData(), 10000);
    console.log('✅ Система синхронизации запущена!');
}

initSync();
