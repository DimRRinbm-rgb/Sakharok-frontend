import { NavLink, Outlet, Link } from "react-router-dom";
import Icon from "./Icon";

// Дата для шапки
function getToday() {
  const text = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text[0].toUpperCase() + text.slice(1);
}

// Пункты меню (убрали "О проекте" из списка)
const links = [
  { to: "/", icon: "home", text: "Главная" },
  { to: "/diary", icon: "diary", text: "Дневник" },
  { to: "/medications", icon: "pill", text: "Лекарства" },
  { to: "/appointments", icon: "doctor", text: "Врачи" },
  { to: "/profile", icon: "profile", text: "Профиль" },
];

// NavLink сам добавляет класс "active" активной ссылке
function Menu() {
  return links.map((item) => (
    <NavLink key={item.to} to={item.to} end className="nav-link">
      <Icon name={item.icon} />
      <span>{item.text}</span>
    </NavLink>
  ));
}

export default function Layout() {
  // Достаём пользователя, которого сохранили при регистрации
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  // В ФИО (Фамилия Имя Отчество) имя — второе слово
  let firstName = "";
  if (user) {
    const words = user.fullName.split(" ");
    firstName = words[1] || words[0];
  }

  return (
    <div className="app">
      {/* Меню слева (компьютер) */}
      <aside className="sidebar">
        {/* Клик по верхнему логотипу ведет на "О проекте" */}
        <Link to="/about" title="О проекте" style={{ display: "inline-block" }}>
          <img className="logo" src="/logo.png" alt="СахарОК" />
        </Link>

        <Menu />

        {/* Блок с персонажем снизу сайдбара тоже ведет на "О проекте" */}
        <Link to="/about" className="sidebar-bottom" style={{ textDecoration: "none", color: "inherit" }}>
          <img className="mascot-img mascot-md" src="/sugar_normal.png" alt="Сахарок" />
          <b>СахарОК</b>
          <span className="gray">Ваш дневник самоконтроля</span>
        </Link>
      </aside>

      <main className="main">
        {/* Шапка на телефоне */}
        <div className="mobile-header">
          <Link to="/about" title="О проекте">
            <img src="/logo.png" alt="СахарОК" />
          </Link>
          <Link to="/profile" className="profile-btn">
            {user ? firstName[0] : <Icon name="profile" />}
          </Link>
        </div>

        {/* Шапка на компьютере: имя или кнопка регистрации */}
        <div className="topbar">
          <span>{getToday()}</span>
          {user ? (
            <Link to="/profile" className="topbar-user">{firstName}</Link>
          ) : (
            <Link to="/profile" className="auth-link">Регистрация / Вход</Link>
          )}
        </div>

        {/* Сюда подставляется текущая страница */}
        <Outlet />
      </main>

      {/* Меню снизу (телефон) */}
      <nav className="bottom-nav">
        <Menu />
      </nav>
    </div>
  );
}