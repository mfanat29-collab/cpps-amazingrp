// ============================================
// ЦППС - Полная синхронизация с Google Sheets
// ============================================

// 🔴 ВАЖНО: ЗАМЕНИ ЭТУ СТРОКУ НА ТВОЮ ССЫЛКУ ИЗ APPS SCRIPT!
const API_URL = 'https://script.google.com/macros/s/AKfycbz_bJJD8m0P5NaM-IpmfU-d5zdYEnsJr8I4bZEZfO3SPoLGEeRh9ag8bykrPh3JMxKseA/exec';
// ============ 1. ЗАГРУЗКА ДАННЫХ (ЧТЕНИЕ) ============
async function loadAllData() {
    console.log('🔄 Загрузка данных из Google Sheets...');
    showToast('📡 Синхронизация с облаком...');
    
    try {
        // Отправляем запрос к твоему Apps Script
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Сохраняем данные в глобальные переменные
        window.employees = data.employees || [];
        window.lecturesArr = data.lectures || [];
        window.trainingsArr = data.trainings || [];
        window.inventory = data.inventory || [];
        
        // Сохраняем копию в localStorage (на случай, если интернет пропадёт)
        localStorage.setItem('cpps_emp', JSON.stringify(window.employees));
        localStorage.setItem('cpps_lectures', JSON.stringify(window.lecturesArr));
        localStorage.setItem('cpps_trainings', JSON.stringify(window.trainingsArr));
        localStorage.setItem('cpps_inv', JSON.stringify(window.inventory));
        
        // Обновляем всё, что видит пользователь
        if (typeof renderEmployees === 'function') renderEmployees();
        if (typeof renderLectures === 'function') renderLectures();
        if (typeof renderTrainings === 'function') renderTrainings();
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof updateStatsUI === 'function') updateStatsUI();
        
        console.log('✅ Данные загружены:', {
            сотрудников: window.employees.length,
            лекций: window.lecturesArr.length,
            тренировок: window.trainingsArr.length,
            инвентаря: window.inventory.length
        });
        
        showToast('✅ Данные синхронизированы!');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        showToast('⚠️ Ошибка соединения. Использую локальные данные.');
        
        // Если интернета нет — берём данные из localStorage
        window.employees = JSON.parse(localStorage.getItem('cpps_emp')) || [];
        window.lecturesArr = JSON.parse(localStorage.getItem('cpps_lectures')) || [];
        window.trainingsArr = JSON.parse(localStorage.getItem('cpps_trainings')) || [];
        window.inventory = JSON.parse(localStorage.getItem('cpps_inv')) || [];
    }
}

// ============ 2. ДОБАВЛЕНИЕ СОТРУДНИКА ============
async function syncAddEmployee(employee) {
    showToast('📤 Отправка сотрудника в облако...');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'addEmployee',
                employee: employee
            })
        });
        
        // После добавления — перезагружаем все данные
        await loadAllData();
        showToast('✅ Сотрудник добавлен! Все видят обновление.');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        showToast('❌ Ошибка! Проверь интернет.');
        return false;
    }
}

// ============ 3. УДАЛЕНИЕ СОТРУДНИКА ============
async function syncDeleteEmployee(id) {
    showToast('🗑️ Удаление сотрудника...');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteEmployee',
                id: id
            })
        });
        
        await loadAllData();
        showToast('✅ Сотрудник удалён');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        showToast('❌ Ошибка удаления');
        return false;
    }
}

// ============ 4. ДОБАВЛЕНИЕ ЛЕКЦИИ ============
async function syncAddLecture(lecture) {
    showToast('📤 Отправка лекции...');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'addLecture',
                lecture: lecture
            })
        });
        
        await loadAllData();
        showToast('✅ Лекция добавлена!');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        showToast('❌ Ошибка');
        return false;
    }
}

// ============ 5. УДАЛЕНИЕ ЛЕКЦИИ ============
async function syncDeleteLecture(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteLecture',
                id: id
            })
        });
        
        await loadAllData();
        showToast('✅ Лекция удалена');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

// ============ 6. ДОБАВЛЕНИЕ ТРЕНИРОВКИ ============
async function syncAddTraining(training) {
    showToast('📤 Отправка тренировки...');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'addTraining',
                training: training
            })
        });
        
        await loadAllData();
        showToast('✅ Тренировка добавлена!');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

// ============ 7. УДАЛЕНИЕ ТРЕНИРОВКИ ============
async function syncDeleteTraining(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteTraining',
                id: id
            })
        });
        
        await loadAllData();
        showToast('✅ Тренировка удалена');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

// ============ 8. ДОБАВЛЕНИЕ ИНВЕНТАРЯ ============
async function syncAddInventory(item) {
    showToast('📤 Отправка инвентаря...');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'addInventory',
                inventory: item
            })
        });
        
        await loadAllData();
        showToast('✅ Инвентарь добавлен!');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

// ============ 9. УДАЛЕНИЕ ИНВЕНТАРЯ ============
async function syncDeleteInventory(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteInventory',
                id: id
            })
        });
        
        await loadAllData();
        showToast('✅ Инвентарь удалён');
        return true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

// ============ 10. УВЕДОМЛЕНИЯ (TOAST) ============
function showToast(message) {
    // Ищем или создаём элемент для уведомлений
    let toast = document.querySelector('.cpps-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cpps-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1E293B;
            border-left: 4px solid #0EA5E9;
            border-radius: 12px;
            padding: 12px 20px;
            color: white;
            font-size: 14px;
            font-family: monospace;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ============ 11. КНОПКА ДЛЯ РУЧНОЙ СИНХРОНИЗАЦИИ ============
function addSyncButton() {
    if (!document.getElementById('manualSyncBtn')) {
        const btn = document.createElement('button');
        btn.id = 'manualSyncBtn';
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
        btn.title = 'Синхронизировать с облаком';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0EA5E9, #8B5CF6);
            border: none;
            color: white;
            font-size: 22px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        `;
        btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => loadAllData();
        document.body.appendChild(btn);
    }
}

// ============ 12. АВТОЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ============
async function initSync() {
    // Загружаем данные
    await loadAllData();
    
    // Добавляем кнопку синхронизации
    addSyncButton();
    
    // Авто-обновление каждые 30 секунд
    setInterval(() => {
        console.log('🔄 Авто-синхронизация...');
        loadAllData();
    }, 30000);
    
    console.log('✅ Система синхронизации запущена!');
}

// Запускаем всё, когда страница загрузится
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSync);
} else {
    initSync();
}
