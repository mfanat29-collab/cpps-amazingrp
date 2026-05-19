// ============================================
// ЦППС - JSONP версия (работает без CORS)
// ============================================

const API_URL = 'https://script.google.com/macros/s/AKfycbyVViDsfp2jNYMdjah0oKTfywLIo4jRAMN9NgWaUKfurfbJnKPaJ9KhQwwqrTnV2VSWNA/exec';

// Загрузка данных через JSONP
function loadAllData() {
    console.log('🔄 Загрузка данных...');
    showToast('📡 Синхронизация...');
    
    // Создаём уникальное имя для callback
    const callbackName = 'jsonp_callback_' + Date.now();
    
    // Создаём глобальную функцию для получения данных
    window[callbackName] = function(data) {
        // Получили данные
        window.employees = data.employees || [];
        window.lecturesArr = data.lectures || [];
        window.trainingsArr = data.trainings || [];
        window.inventory = data.inventory || [];
        
        // Сохраняем в localStorage
        localStorage.setItem('cpps_emp', JSON.stringify(window.employees));
        localStorage.setItem('cpps_lectures', JSON.stringify(window.lecturesArr));
        localStorage.setItem('cpps_trainings', JSON.stringify(window.trainingsArr));
        localStorage.setItem('cpps_inv', JSON.stringify(window.inventory));
        
        // Обновляем интерфейс
        if (typeof renderEmployees === 'function') renderEmployees();
        if (typeof renderLectures === 'function') renderLectures();
        if (typeof renderTrainings === 'function') renderTrainings();
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof updateStatsUI === 'function') updateStatsUI();
        
        console.log('✅ Загружено:', window.employees.length, 'сотрудников');
        showToast('✅ Данные обновлены!');
        
        // Удаляем временный скрипт
        delete window[callbackName];
        document.body.removeChild(script);
    };
    
    // Создаём JSONP запрос
    const script = document.createElement('script');
    script.src = `${API_URL}?callback=${callbackName}`;
    document.body.appendChild(script);
    
    // Таймаут на случай ошибки
    setTimeout(() => {
        if (window[callbackName]) {
            delete window[callbackName];
            showToast('⚠️ Ошибка соединения');
        }
    }, 10000);
}

// Добавление сотрудника (через POST)
async function syncAddEmployee(employee) {
    try {
        showToast('📤 Отправка...');
        
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addEmployee', employee: employee })
        });
        
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Сотрудник добавлен!');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        showToast('❌ Ошибка');
        return false;
    }
}

async function syncAddLecture(lecture) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addLecture', lecture: lecture })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Лекция добавлена!');
    } catch (error) {
        showToast('❌ Ошибка');
    }
}

async function syncAddTraining(training) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addTraining', training: training })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Тренировка добавлена!');
    } catch (error) {
        showToast('❌ Ошибка');
    }
}

async function syncAddInventory(item) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addInventory', inventory: item })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Инвентарь добавлен!');
    } catch (error) {
        showToast('❌ Ошибка');
    }
}

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
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Запуск
function initSync() {
    loadAllData();
    setInterval(() => loadAllData(), 15000);
    console.log('✅ Синхронизация запущена (JSONP)');
}

initSync();
