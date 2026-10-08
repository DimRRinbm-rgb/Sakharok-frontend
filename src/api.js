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
        diabetesType: "1",
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

// Последнее измерение (для главной)
export async function getLatest() {
  const records = getLocalMeasurements();
  if (records.length === 0) return null;
  // Сортируем по дате/времени 
  return records[0];
}

// Записи за период
export async function getMeasurements(from, to) {
  const records = getLocalMeasurements();
  // Если нужны фильтры по дате — можно добавить, но для теста пока вернем все
  return records;
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