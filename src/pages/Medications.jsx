import { useState, useEffect } from "react";
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} from "../api";
import { toDateString, dosesText, makeCalendarLink } from "../utils";

// Сортировка списка по времени приёма (08:30 раньше 21:00)
function sortByTime(list) {
  return list.sort((a, b) => a.time.localeCompare(b.time));
}

export default function Medications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Поля формы
  const [name, setName] = useState("");
  const [doses, setDoses] = useState("1");
  const [time, setTime] = useState("08:00");
  const [editId, setEditId] = useState(null); // id лекарства, которое меняем (или null)

  // Загружаем список при открытии страницы
  useEffect(() => {
    async function loadMedications() {
      try {
        const data = await getMedications();
        setMedications(sortByTime(data));
      } catch (err) {
        setError("Не удалось загрузить лекарства. Проверьте, что сервер запущен.");
      }
      setLoading(false);
    }
    loadMedications();
  }, []);

  // Очистить форму
  function resetForm() {
    setName("");
    setDoses("1");
    setTime("08:00");
    setEditId(null);
  }

  async function handleSave() {
    if (name.trim() === "") {
      setError("Введите название лекарства");
      return;
    }
    if (doses === "" || Number(doses) < 1 || Number(doses) > 20) {
      setError("Количество доз — число от 1 до 20");
      return;
    }
    if (time === "") {
      setError("Укажите время приёма");
      return;
    }

    const data = {
      name: name.trim(),
      doses: Number(doses),
      time: time,
    };

    try {
      if (editId) {
        await updateMedication(editId, data);
        // заменяем старую запись в списке на новую
        const newList = medications.map((item) => {
          if (item.id === editId) {
            return { id: editId, name: data.name, doses: data.doses, time: data.time };
          }
          return item;
        });
        setMedications(sortByTime(newList));
      } else {
        const created = await createMedication(data);
        setMedications(sortByTime([...medications, created]));
      }
      setError("");
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  // Нажали ✏️ — кладём данные лекарства в форму
  function handleEdit(item) {
    setName(item.name);
    setDoses(String(item.doses));
    setTime(item.time);
    setEditId(item.id);
    setError("");
    window.scrollTo(0, 0);
  }

  async function handleDelete(id) {
    if (!window.confirm("Удалить это лекарство?")) return;
    try {
      await deleteMedication(id);
      setMedications(medications.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="page-title">Лекарства</h1>
      <p className="page-subtitle">Что и когда нужно принять</p>

      {error && <div className="error-box">{error}</div>}

      <div className="two-columns">
        {/* Форма */}
        <div className="card">
          <h2>{editId ? "Изменить лекарство" : "Новое лекарство"}</h2>

          <div className="form">
            <label>Название</label>
            <input
              className="input"
              type="text"
              placeholder="Например, метформин"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="row-2">
              <div>
                <label>Количество доз</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={doses}
                  onChange={(e) => setDoses(e.target.value)}
                />
              </div>
              <div>
                <label>Время приёма</label>
                <input
                  className="input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="buttons-row">
              <button className="btn btn-red" onClick={handleSave}>
                {editId ? "Сохранить" : "Добавить"}
              </button>
              {editId && (
                <button className="btn btn-pink" onClick={resetForm}>
                  Отмена
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Список */}
        <div>
          <h2>Мои лекарства</h2>

          {loading && <p className="empty">Загрузка...</p>}
          {!loading && medications.length === 0 && (
            <p className="empty">Лекарств пока нет. Добавьте первое!</p>
          )}

          {medications.map((item) => (
            <div key={item.id} className="diary-card item-card">
              <div className="diary-time">{item.time}</div>
              <div className="diary-info">
                <b>{item.name}</b>
                <div className="gray">{dosesText(item.doses)} за приём</div>
              </div>

              {/* Ссылка открывает Google Календарь с готовым событием (каждый день) */}
              <a
                className="calendar-link"
                target="_blank"
                rel="noreferrer"
                href={makeCalendarLink(
                  "Принять: " + item.name,
                  toDateString(new Date()),
                  item.time,
                  15,
                  item.name + ", " + dosesText(item.doses),
                  true
                )}
              >
                В календарь
              </a>

              <button className="icon-btn" title="Изменить" onClick={() => handleEdit(item)}>
                ✏️
              </button>
              <button className="icon-btn" title="Удалить" onClick={() => handleDelete(item.id)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
