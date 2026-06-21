import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  let field = null;
  let order = null;

  return (query, state, action) => {
    // Если действие - сортировка
    if (action && action.name === "sort") {
      // Переключаем состояние сортировки (none -> asc -> desc -> none)
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // Сбрасываем сортировку на других колонках
      columns.forEach((column) => {
        if (column.dataset.field !== field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // Иначе получаем текущую сортировку из состояния колонок
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Если сортировка не выбрана - возвращаем query без изменений
    const sort = field && order !== "none" ? `${field}:${order}` : null;

    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
