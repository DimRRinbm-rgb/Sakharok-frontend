import { NavLink, Outlet, Link } from "react-router-dom";

// Дата для шапки: "Среда, 7 октября"
function getToday() {
  const text = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text[0].toUpperCase() + text.slice(1);
}

// Пункты меню (одни и те же для компьютера и телефона)
const links = [
  { to: "/", icon: "🏠", text: "Главная" },
  { to: "/diary", icon: "📖", text: "Дневник" },
  { to: "/profile", icon: "👤", text: "Профиль" },
];

// NavLink сам добавляет класс "active" активной ссылке
function Menu() {
  return links.map((item) => (
    <NavLink key={item.to} to={item.to} end className="nav-link">
      {item.icon} <span>{item.text}</span>
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
        <img className="logo" src="/logo.png" alt="СахарОК" />
        <Menu />
        <div className="sidebar-bottom">
          <img className="mascot-img mascot-md" src="/mascot.png" alt="" />
          <b>СахарОК</b>
          <span className="gray">Ваш дневник самоконтроля</span>
        </div>
      </aside>

      <main className="main">
        {/* Шапка на телефоне */}
        <div className="mobile-header">
          <img src="/logo.png" alt="СахарОК" />
          <Link to="/profile" className="profile-btn">
            {user ? firstName[0] : "👤"}
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
