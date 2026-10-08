// Маленькие функции, которые нужны сразу на нескольких страницах.
// Чтобы не копировать их в каждый файл, лежат здесь.

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
