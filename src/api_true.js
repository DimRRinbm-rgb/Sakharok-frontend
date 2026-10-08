// Здесь все запросы к бэкенду (серверу). Больше нигде в проекте fetch не нужен.
// Если сервер запущен на другом порту — меняем адрес только в этой строке.
const API_URL = "http://localhost:3000/api";

// ---------- Вход и выход ----------

// Сохраняем в браузере «пропуск» (token) и данные пользователя.
// Пароль нигде не сохраняется!
function saveSession(result) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
}

// Выйти = стереть пропуск и данные
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Заголовки для запросов, где сервер должен знать, кто мы
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

// Если сервер ответил 401 («вы не вошли» или пропуск устарел) —
// выходим и отправляем на страницу входа
function checkLogin(response) {
  if (response.status === 401) {
    logout();
    window.location.href = "/profile";
  }
}

// Регистрация
export async function registerUser(data) {
  const response = await fetch(API_URL + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error); // текст ошибки приходит с бэка
  saveSession(result);
  return result;
}

// Вход
export async function loginUser(login, password) {
  const response = await fetch(API_URL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: login, password: password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  saveSession(result);
  return result;
}

// ---------- Измерения (все запросы с пропуском) ----------

// Последнее измерение (для главной)
export async function getLatest() {
  const response = await fetch(API_URL + "/measurements/latest", { headers: authHeaders() });
  checkLogin(response);
  if (response.status === 404) return null; // записей ещё нет
  if (!response.ok) throw new Error("Не удалось загрузить данные");
  return await response.json();
}

// Записи за период. from и to — даты вида "2026-10-01"
export async function getMeasurements(from, to) {
  const response = await fetch(API_URL + "/measurements?from=" + from + "&to=" + to, {
    headers: authHeaders(),
  });
  checkLogin(response);
  if (!response.ok) throw new Error("Не удалось загрузить записи");
  return await response.json();
}

// Одна запись по id
export async function getMeasurement(id) {
  const response = await fetch(API_URL + "/measurements/" + id, { headers: authHeaders() });
  checkLogin(response);
  if (!response.ok) throw new Error("Запись не найдена");
  return await response.json();
}

// Создать запись
export async function createMeasurement(data) {
  const response = await fetch(API_URL + "/measurements", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  checkLogin(response);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}

// Изменить запись
export async function updateMeasurement(id, data) {
  const response = await fetch(API_URL + "/measurements/" + id, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  checkLogin(response);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}

// Удалить запись
export async function deleteMeasurement(id) {
  const response = await fetch(API_URL + "/measurements/" + id, {
    method: "DELETE",
    headers: authHeaders(),
  });
  checkLogin(response);
  if (!response.ok) throw new Error("Не удалось удалить запись");
}
