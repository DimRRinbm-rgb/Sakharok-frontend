import { Outlet, Link } from "react-router-dom";

// Обёртка
// Нет «пропуска» (token) — показываем приглашение войти.
// Есть — показываем саму страницу (<Outlet />).
export default function RequireLogin() {
  if (!localStorage.getItem("token")) {
    return (
      <div className="card need-login">
        <img className="mascot-img mascot-md need-login-mascot" src="/mascot.png" alt="" />
        <h2>Войдите, чтобы вести дневник</h2>
        <p className="gray" style={{ marginBottom: 16 }}>
          Ваши записи сохраняются в личном аккаунте.
        </p>
        <Link to="/profile" className="btn btn-red">
          Регистрация / Вход
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
