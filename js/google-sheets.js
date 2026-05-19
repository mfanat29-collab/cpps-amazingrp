const API_URL = 'https://script.google.com/macros/s/AKfycbzQMAFF6ddjuuayjiidg6yQiYyOI0Oo34TOGCaMEmzQxSYC6kYFHVnGpXajj2wQJ7EnFw/exec';

// ========== УДАЛЕНИЕ ==========
async function syncDeleteEmployee(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteEmployee', id: id })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Сотрудник удален из таблицы!');
    } catch(e) { 
        showToast('❌ Ошибка при удалении');
        console.error(e);
    }
}

async function syncDeleteLecture(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteLecture', id: id })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Лекция удалена!');
    } catch(e) { 
        showToast('❌ Ошибка');
        console.error(e);
    }
}

async function syncDeleteTraining(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteTraining', id: id })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Тренировка удалена!');
    } catch(e) { 
        showToast('❌ Ошибка');
        console.error(e);
    }
}

async function syncDeleteInventory(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteInventory', id: id })
        });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Инвентарь удален!');
    } catch(e) { 
        showToast('❌ Ошибка');
        console.error(e);
    }
}
async function loadAllData() {
    console.log('🔄 Загрузка...');
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
        
        console.log('✅ Загружено:', window.employees.length);
        showToast(`✅ Загружено ${window.employees.length} сотрудников`);
    } catch(e) {
        console.error('Ошибка:', e);
        showToast('⚠️ Ошибка загрузки');
    }
}

async function syncAddEmployee(emp) {
    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'addEmployee', employee: emp }) });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Сотрудник добавлен');
    } catch(e) { showToast('❌ Ошибка'); }
}

async function syncAddLecture(lec) {
    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'addLecture', lecture: lec }) });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Лекция добавлена');
    } catch(e) { showToast('❌ Ошибка'); }
}

async function syncAddTraining(train) {
    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'addTraining', training: train }) });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Тренировка добавлена');
    } catch(e) { showToast('❌ Ошибка'); }
}

async function syncAddInventory(item) {
    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'addInventory', inventory: item }) });
        setTimeout(() => loadAllData(), 1000);
        showToast('✅ Инвентарь добавлен');
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

loadAllData();
setInterval(() => loadAllData(), 10000);
