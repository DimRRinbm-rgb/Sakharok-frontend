import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeasurement, createMeasurement, updateMeasurement, deleteMeasurement } from "../api";
import { toDateString } from "../utils";

export default function AddRecord() {
  const navigate = useNavigate();
  const { id } = useParams(); // если в адресе есть id — значит, меняем старую запись

  const [glucose, setGlucose] = useState("");
  const [date, setDate] = useState(toDateString(new Date())); // сегодня
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5)); // сейчас, "08:30"
  const [meal, setMeal] = useState("before");
  const [feeling, setFeeling] = useState("normal");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  // При изменении записи сначала загружаем её и заполняем форму
  useEffect(() => {
    if (!id) return;

    async function loadRecord() {
      try {
        const item = await getMeasurement(id);
        setGlucose(String(item.glucose).replace(".", ","));
        setDate(item.date);
        setTime(item.time);
        setMeal(item.meal);
        setFeeling(item.feeling);
        setNote(item.note || "");
      } catch (err) {
        setError(err.message);
      }
    }
    loadRecord();
  }, [id]);

  async function handleSave() {
    // Разрешаем вводить и запятую, и точку
    const value = Number(glucose.replace(",", "."));
    if (glucose === "" || isNaN(value) || value <= 0) {
      setError("Введите значение глюкозы, например 5,6");
      return;
    }

    const data = {
      glucose: value,
      date: date,
      time: time,
      meal: meal,
      feeling: feeling,
      note: note,
    };

    try {
      if (id) {
        await updateMeasurement(id, data);
      } else {
        await createMeasurement(data);
      }
      navigate("/diary");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Удалить эту запись?")) return;
    try {
      await deleteMeasurement(id);
      navigate("/diary");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="page-title">{id ? "Изменить запись" : "Добавить запись"}</h1>
      <p className="page-subtitle">Измерение глюкозы</p>

      {error && <div className="error-box">{error}</div>}

      <div className="form">
        <label>Глюкоза, ммоль/л</label>
        <input
          className="input"
          type="text"
          placeholder="5,6"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
        />

        <div className="row-2">
          <div>
            <label>Дата</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label>Время</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <label>Когда измеряли?</label>
        <div className="toggle">
          <button className={meal === "before" ? "active" : ""} onClick={() => setMeal("before")}>
            До еды
          </button>
          <button className={meal === "after" ? "active" : ""} onClick={() => setMeal("after")}>
            После еды
          </button>
        </div>

        <label>Самочувствие</label>
        <div className="toggle">
          <button className={feeling === "good" ? "active" : ""} onClick={() => setFeeling("good")}>
            Хорошо
          </button>
          <button className={feeling === "normal" ? "active" : ""} onClick={() => setFeeling("normal")}>
            Обычно
          </button>
          <button className={feeling === "bad" ? "active" : ""} onClick={() => setFeeling("bad")}>
            Плохо
          </button>
        </div>

        <label>Заметка (необязательно)</label>
        <textarea
          className="input"
          placeholder="Что стоит запомнить?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="buttons-row">
          <button className="btn btn-red" onClick={handleSave}>Сохранить запись</button>
          <button className="btn btn-pink" onClick={() => navigate(-1)}>Отмена</button>
        </div>

        {id && (
          <button className="btn btn-pink" style={{ marginTop: 12 }} onClick={handleDelete}>
            Удалить запись
          </button>
        )}
      </div>
    </div>
  );
}
