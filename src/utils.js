// Маленькие функции, которые нужны сразу на нескольких страницах.

// Дата -> "2026-10-05" (в таком виде дату ждёт бэкенд)
export function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// "2026-10-05" -> "5 октября"
export function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

// 5.6 -> "5,6"
export function formatGlucose(value) {
  return String(value).replace(".", ",");
}

// "before" -> "До еды"
export function mealText(meal) {
  return meal === "before" ? "До еды" : "После еды";
}

// "good" -> "Хорошо"
export function feelingText(feeling) {
  if (feeling === "good") return "Хорошо";
  if (feeling === "bad") return "Плохо";
  return "Обычно";
}

// "2008-05-14" -> "14.05.2008"
export function formatBirthDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("ru-RU");
}

// Возраст по дате рождения
export function getAge(birthDate) {
  const birth = new Date(birthDate + "T00:00:00");
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  // если день рождения в этом году ещё не наступил — отнимаем год
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age = age - 1;
  }
  return age;
}

// "male" -> "Мужской"
export function genderText(gender) {
  return gender === "male" ? "Мужской" : "Женский";
}

// Типы диабета: value уходит на бэк, text видит пользователь
export const DIABETES_TYPES = [
  { value: "type1", text: "Сахарный диабет 1 типа" },
  { value: "type2", text: "Сахарный диабет 2 типа" },
  { value: "gestational", text: "Гестационный диабет" },
  { value: "other", text: "Другой / не уточнён" },
];

export function diabetesText(value) {
  const found = DIABETES_TYPES.find((item) => item.value === value);
  return found ? found.text : "Не указан";
}

// ---------- Google Календарь ----------

// Число с нулём впереди: 5 -> "05"
function pad(number) {
  return String(number).padStart(2, "0");
}

// Дата и время для ссылки календаря: "20261008T083000"
function toCalendarDate(date) {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    "00"
  );
}

// Ссылка, которая открывает Google Календарь с уже заполненным событием.
// date: "2026-10-08", time: "08:30", minutes: сколько длится событие,
// repeatDaily: true — повторять каждый день (для лекарств)
export function makeCalendarLink(title, date, time, minutes, details, repeatDaily) {
  const start = new Date(date + "T" + time.slice(0, 5) + ":00");
  const end = new Date(start.getTime() + minutes * 60000);

  let link = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  link = link + "&text=" + encodeURIComponent(title);
  link = link + "&dates=" + toCalendarDate(start) + "/" + toCalendarDate(end);
  link = link + "&details=" + encodeURIComponent(details);
  if (repeatDaily) {
    link = link + "&recur=" + encodeURIComponent("RRULE:FREQ=DAILY");
  }
  return link;
}

// 1 -> "1 доза", 2 -> "2 дозы", 5 -> "5 доз"
export function dosesText(count) {
  const n = Number(count);
  const last = n % 10;
  const lastTwo = n % 100;

  if (last === 1 && lastTwo !== 11) return n + " доза";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return n + " дозы";
  return n + " доз";
}
