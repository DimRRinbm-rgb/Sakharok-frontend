import { useState } from "react";
import { registerUser, loginUser, logout } from "../api";
import {
  toDateString,
  formatBirthDate,
  getAge,
  genderText,
  DIABETES_TYPES,
  diabetesText,
} from "../utils";

export default function Profile() {
  // Если мы уже вошли — данные пользователя лежат в браузере
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [mode, setMode] = useState("register"); // "register" или "login"
  const [error, setError] = useState("");

  // Поля формы
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [diabetesType, setDiabetesType] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
  }

  // Показать ошибку: если сервер недоступен, пишем понятный текст
  function showError(err) {
    if (err.message === "Failed to fetch") {
      setError("Нет связи с сервером");
    } else {
      setError(err.message);
    }
  }

  async function handleRegister() {
    // Проверяем поля до отправки (бэк проверит ещё раз)
    if (fullName.trim() === "") {
      setError("Введите ФИО");
      return;
    }
    if (birthDate === "" || birthDate > toDateString(new Date())) {
      setError("Укажите корректную дату рождения");
      return;
    }
    if (gender === "") {
      setError("Выберите пол");
      return;
    }
    if (diabetesType === "") {
      setError("Выберите тип диабета");
      return;
    }
    if (login.trim().length < 3) {
      setError("Логин должен быть не короче 3 символов");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов");
      return;
    }
    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      await registerUser({
        fullName: fullName.trim(),
        birthDate: birthDate,
        gender: gender,
        diabetesType: diabetesType,
        login: login.trim(),
        password: password,
      });
      window.location.href = "/"; // открываем главную, вверху появится имя
    } catch (err) {
      showError(err);
    }
  }

  async function handleLogin() {
    if (login.trim() === "" || password === "") {
      setError("Введите логин и пароль");
      return;
    }
    try {
      await loginUser(login.trim(), password);
      window.location.href = "/";
    } catch (err) {
      showError(err);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/profile";
  }

  // ---------- Уже вошли: показываем профиль ----------
  if (user) {
    return (
      <div>
        <h1 className="page-title">Профиль</h1>
        <p className="page-subtitle">Личные данные</p>

        <div className="card profile-card">
          <img className="mascot-img mascot-md profile-mascot" src="/mascot.png" alt="" />

          <div className="profile-row">
            <span className="gray">ФИО</span>
            <b>{user.fullName}</b>
          </div>
          <div className="profile-row">
            <span className="gray">Логин</span>
            <b>{user.login}</b>
          </div>
          <div className="profile-row">
            <span className="gray">Дата рождения</span>
            <b>
              {formatBirthDate(user.birthDate)} ({getAge(user.birthDate)})
            </b>
          </div>
          <div className="profile-row">
            <span className="gray">Пол</span>
            <b>{genderText(user.gender)}</b>
          </div>
          <div className="profile-row">
            <span className="gray">Тип диабета</span>
            <b>{diabetesText(user.diabetesType)}</b>
          </div>

          <button className="btn btn-pink" style={{ marginTop: 18 }} onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    );
  }

  // ---------- Не вошли: регистрация или вход ----------
  return (
    <div>
      <h1 className="page-title">{mode === "register" ? "Регистрация" : "Вход"}</h1>
      <p className="page-subtitle">
        {mode === "register"
          ? "Создайте аккаунт, чтобы вести дневник"
          : "Войдите в свой аккаунт"}
      </p>

      <div className="card profile-card">
        <div className="toggle">
          <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>
            Регистрация
          </button>
          <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>
            Вход
          </button>
        </div>

        {error && <div className="error-box" style={{ marginTop: 14 }}>{error}</div>}

        <div className="form">
          {mode === "register" && (
            <div className="form-part">
              <label>ФИО</label>
              <input
                className="input"
                type="text"
                placeholder="Иванов Алексей Петрович"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label>Дата рождения</label>
              <input
                className="input"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />

              <label>Пол</label>
              <div className="toggle">
                <button className={gender === "male" ? "active" : ""} onClick={() => setGender("male")}>
                  Мужской
                </button>
                <button className={gender === "female" ? "active" : ""} onClick={() => setGender("female")}>
                  Женский
                </button>
              </div>

              <label>Тип сахарного диабета</label>
              <select className="input" value={diabetesType} onChange={(e) => setDiabetesType(e.target.value)}>
                <option value="">Выберите тип</option>
                {DIABETES_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label>Логин</label>
          <input
            className="input"
            type="text"
            placeholder="alexey"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <label>Пароль</label>
          <input
            className="input"
            type="password"
            placeholder="Не короче 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "register" && (
            <div className="form-part">
              <label>Повторите пароль</label>
              <input
                className="input"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          )}

          <button
            className="btn btn-red"
            style={{ marginTop: 18 }}
            onClick={mode === "register" ? handleRegister : handleLogin}
          >
            {mode === "register" ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
