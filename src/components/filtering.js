export function initFiltering(elements) {
  // Функция для заполнения селектов опциями (продавцы)
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      // Очищаем select перед добавлением новых опций
      elements[elementName].replaceChildren();

      // Добавляем опции из индексов
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        }),
      );
    });
  };

  // Функция для формирования query-параметров фильтрации
  const applyFiltering = (query, state, action) => {
    // Обработка очистки поля
    if (action && action.name === "clear") {
      const parent = action.closest(".filter-wrapper");
      if (parent) {
        const input = parent.querySelector("input");
        if (input) {
          input.value = "";
          state[action.dataset.field] = "";
        }
      }
    }

    // Собираем фильтры из элементов
    const filter = {};
    Object.keys(elements).forEach((key) => {
      const element = elements[key];
      if (element) {
        // Проверяем, что это поле ввода (INPUT или SELECT) и оно не пустое
        if (["INPUT", "SELECT"].includes(element.tagName) && element.value) {
          // Формируем ключ для query: filter[название_поля]
          filter[`filter[${element.name}]`] = element.value;
        }
      }
    });

    // Если есть фильтры - добавляем их к query
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
