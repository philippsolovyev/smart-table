import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
  // ========== @todo: #4.1 — заполнить выпадающие списки опциями ==========
  Object.keys(indexes).forEach((elementName) => {
    // Получаем массив значений для этого select
    const values = Object.values(indexes[elementName]);

    // Создаём опции и добавляем их в select
    const options = values.map((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      return option;
    });

    // Добавляем опции в соответствующий select
    elements[elementName].append(...options);
  });

  // ========== @todo: #4.3 — настроить компаратор ==========
  const compare = createComparison(defaultRules);

  return (data, state, action) => {
    // ========== @todo: #4.2 — обработать очистку поля ==========
    if (action && action.name === "clear") {
      // Находим родительский элемент (label, который обёртывает кнопку и input)
      const parent = action.closest(".filter-wrapper");
      if (parent) {
        // Находим input внутри родителя
        const input = parent.querySelector("input");
        if (input) {
          input.value = ""; // очищаем значение
          state[action.dataset.field] = ""; // очищаем в состоянии
        }
      }
    }

    // ========== @todo: #4.5 — отфильтровать данные используя компаратор ==========
    return data.filter((row) => compare(row, state));
  };
}
