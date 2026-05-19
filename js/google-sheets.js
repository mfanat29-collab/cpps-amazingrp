// ============================================
// ЦППС - РАБОЧАЯ ВЕРСИЯ (JSONP + POST)
// ============================================

const API_URL = 'https://script.google.com/macros/s/AKfycbyVViDsfp2jNYMdjah0oKTfywLIo4jRAMN9NgWaUKfurfbJnKPaJ9KhQwwqrTnV2VSWNA/exec';

// ========== ЗАГРУЗКА ДАННЫХ (JSONP - без CORS) ==========
function loadAllData() {
    console.log('🔄 Загрузка данных...');
    
    const callbackName = 'callback_' + Date.now();
    
    window[callbackName] = function(data) {
        console.log('✅ Данные получены:', data);
        
        if (window.employees !== undefined) {
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
            
            showToast(`✅ Загружено: ${window.employees.length} сотрудников`);
        }
        
        delete window[callbackName];
        if (script) document.body.removeChild(script);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?callback=${callbackName}`;
    script.onerror = () => {
        showToast('⚠️ Ошибка соединения');
        delete window[callbackName];
    };
    document.body.appendChild(script);
}

// ========== ОТПРАВКА ДАННЫХ ==========
async function syncAddEmployee(employee) {
    try {
        showToast('📤 Отправка...');
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'addEmployee', employee: employee })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Сотрудник добавлен!');
        return true;
    } catch(e) {
        showToast('❌ Ошибка');
        return false;
    }
}

async function syncAddLecture(lecture) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'addLecture', lecture: lecture })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Лекция добавлена!');
    } catch(e) { showToast('❌ Ошибка'); }
}

async function syncAddTraining(training) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'addTraining', training: training })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Тренировка добавлена!');
    } catch(e) { showToast('❌ Ошибка'); }
}

async function syncAddInventory(item) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'addInventory', inventory: item })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Инвентарь добавлен!');
    } catch(e) { showToast('❌ Ошибка'); }
}

function showToast(msg) {
    let t = document.querySelector('.cpps-toast');
    if (!t) {
        t = document.createElement('div');
        t.className = 'cpps-toast';
        t.style.cssText = `position:fixed;bottom:20px;right:20px;background:#1E293B;border-left:4px solid #0EA5E9;border-radius:12px;padding:12px 20px;color:white;font-size:14px;z-index:10000`;
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
}

// ========== АВТОЗАПУСК ==========
loadAllData();
setInterval(() => loadAllData(), 15000);
console.log('✅ JSONP синхронизация запущена!');
