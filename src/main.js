import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// API для запросов к серверу
const api = initData(sourceData);

// Сбор все параметры из формы (поиск, фильтры, пагинация)
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  // Количество записей на странице (по умолчанию 10)
  const rowsPerPage = parseInt(state.rowsPerPage) || 10;

  // Текущая страница (по умолчанию 1)
  let page = parseInt(state.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

async function render(action) {
  // Собираем состояние формы
  let state = collectState();
  // Формируем параметры запроса
  let query = {};

  // Применяем все компоненты по очереди
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  // Запрашиваем данные с сервера
  const { total, items } = await api.getRecords(query);

  // Обновляем пагинацию
  updatePagination(total, query);

  // Отрисовываем таблицу
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

// Поиск
const applySearching = initSearching("search");

// Пагинация
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

// Сортировка
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Фильтрация
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements,
);

// монтаж в dom
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

// Запуск - сначала init, потом render
init().then(render);
