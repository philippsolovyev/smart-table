export function initSearching(searchField) {
  return (query, state, action) => {
    // Если в поле поиска что-то есть - добавляем параметр search в query
    if (state[searchField]) {
      return Object.assign({}, query, {
        search: state[searchField],
      });
    }
    // Если поле пустое - возвращаем query без изменений
    return query;
  };
}
