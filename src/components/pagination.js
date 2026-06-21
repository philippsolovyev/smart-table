import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // Подготавливаем шаблон кнопки для страницы
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount; // храним количество страниц для последней отрисовки

  // Функция для формирования query-параметров пагинации
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page || 1;

    // Обрабатываем действия (навигация)

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    // Возвращаем новый объект с параметрами пагинации
    return Object.assign({}, query, {
      limit,
      page,
    });
  };

  // Функция для обновления интерфейса пагинации после получения данных
  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // Получаем список видимых страниц
    const visiblePages = getPages(page, pageCount, 5);

    // Отрисовываем кнопки страниц
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // Обновляем информацию о строках
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};
