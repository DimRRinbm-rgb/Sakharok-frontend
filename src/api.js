// Заглушка API!!!!! реальный файл не в проекте

// ---------- Вход и выход ----------

function saveSession(result) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("mock_measurements");
  localStorage.removeItem("mock_medications");
  localStorage.removeItem("mock_appointments");
}

// Регистрация
export async function registerUser(data) {
  // Эмуляция задержки
  await new Promise((res) => setTimeout(res, 300));

  const result = {
    token: "fake-jwt-token-12345",
    user: {
      fullName: data.fullName,
      birthDate: data.birthDate,
      gender: data.gender,
      diabetesType: data.diabetesType,
      login: data.login,
    },
  };

  saveSession(result);
  return result;
}

// Вход
export async function loginUser(login, password) {
  await new Promise((res) => setTimeout(res, 300));

  if (!login || !password) {
    throw new Error("Введите логин и пароль");
  }

  // берется сохраненный или тестовый пользователь
  const savedUser = localStorage.getItem("user");
  const user = savedUser
    ? JSON.parse(savedUser)
    : {
        fullName: "Тестовый Пользователь",
        birthDate: "1995-05-15",
        gender: "male",
        diabetesType: "type1",
        login: login,
      };

  const result = {
    token: "fake-jwt-token-12345",
    user: user,
  };

  saveSession(result);
  return result;
}


// ---------- Измерения (в localStorage) ----------

//  функция для получения массива записей из localStorage
function getLocalMeasurements() {
  const data = localStorage.getItem("mock_measurements");
  return data ? JSON.parse(data) : [];
}

function saveLocalMeasurements(records) {
  localStorage.setItem("mock_measurements", JSON.stringify(records));
}

// Сортировка: сначала новые (как отдаёт настоящий бэк)
function sortNewFirst(records) {
  return records.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

// Последнее измерение (для главной)
export async function getLatest() {
  const records = sortNewFirst(getLocalMeasurements());
  if (records.length === 0) return null;
  return records[0];
}

// Записи за период
export async function getMeasurements(from, to) {
  const records = getLocalMeasurements();
  const inPeriod = records.filter((r) => r.date >= from && r.date <= to);
  return sortNewFirst(inPeriod);
}

// Одна запись по id
export async function getMeasurement(id) {
  const records = getLocalMeasurements();
  const record = records.find((r) => String(r.id) === String(id));
  if (!record) throw new Error("Запись не найдена");
  return record;
}

// Создать запись
export async function createMeasurement(data) {
  const records = getLocalMeasurements();
  const newRecord = {
    ...data,
    id: Date.now().toString(), // генерируем уникальный ID
  };
  records.unshift(newRecord); // добавляем в начало
  saveLocalMeasurements(records);
  return newRecord;
}

// Изменить запись
export async function updateMeasurement(id, data) {
  const records = getLocalMeasurements();
  const index = records.findIndex((r) => String(r.id) === String(id));
  if (index === -1) throw new Error("Запись не найдена");

  records[index] = { ...records[index], ...data, id };
  saveLocalMeasurements(records);
  return records[index];
}

// Удалить запись
export async function deleteMeasurement(id) {
  let records = getLocalMeasurements();
  records = records.filter((r) => String(r.id) !== String(id));
  saveLocalMeasurements(records);
}


// ---------- Лекарства и записи к врачу (в localStorage) ----------

// Достать список по ключу и сохранить его обратно
function getList(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

// Лекарства
export async function getMedications() {
  return getList("mock_medications");
}

export async function createMedication(data) {
  const list = getList("mock_medications");
  const newItem = { ...data, id: Date.now().toString() };
  list.push(newItem);
  saveList("mock_medications", list);
  return newItem;
}

export async function updateMedication(id, data) {
  const list = getList("mock_medications");
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index === -1) throw new Error("Лекарство не найдено");
  list[index] = { ...data, id: id };
  saveList("mock_medications", list);
  return list[index];
}

export async function deleteMedication(id) {
  const list = getList("mock_medications");
  saveList("mock_medications", list.filter((item) => String(item.id) !== String(id)));
}

// Записи к врачу
export async function getAppointments() {
  return getList("mock_appointments");
}

export async function createAppointment(data) {
  const list = getList("mock_appointments");
  const newItem = { ...data, id: Date.now().toString() };
  list.push(newItem);
  saveList("mock_appointments", list);
  return newItem;
}

export async function updateAppointment(id, data) {
  const list = getList("mock_appointments");
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index === -1) throw new Error("Запись не найдена");
  list[index] = { ...data, id: id };
  saveList("mock_appointments", list);
  return list[index];
}

export async function deleteAppointment(id) {
  const list = getList("mock_appointments");
  saveList("mock_appointments", list.filter((item) => String(item.id) !== String(id)));
}
