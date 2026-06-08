import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // ========== @todo: #5.1 — настроить компаратор ==========
  // Создаём компаратор с правилами:
  // 1. skipEmptyTargetValues — пропускать пустые значения (если поле поиска пустое, ничего не фильтруем)
  // 2. rules.searchMultipleFields — искать в полях 'date', 'customer', 'seller', 'total'
  const compare = createComparison(
    ["skipEmptyTargetValues"],
    [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller", "total"],
        false,
      ),
    ],
  );

  return (data, state, action) => {
    // ========== @todo: #5.2 — применить компаратор ==========
    // Фильтруем данные: оставляем только те строки, которые подходят под поисковый запрос
    return data.filter((row) => compare(row, state));
  };
}
