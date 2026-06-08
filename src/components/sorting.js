import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  let field = null;
  let order = null;

  return (data, state, action) => {
    if (action && action.name === "sort") {
      // ========== @todo: #3.1 — запомнить выбранный режим сортировки ==========
      // Переключаем состояние кнопки по карте переходов
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // ========== @todo: #3.2 — сбросить сортировки остальных колонок ==========
      columns.forEach((column) => {
        if (column.dataset.field !== field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // ========== @todo: #3.3 — получить выбранный режим сортировки ==========
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Если нет активной сортировки, возвращаем данные как есть
    if (order === "none" || order === null) {
      return data;
    }

    return sortCollection(data, field, order);
  };
}
