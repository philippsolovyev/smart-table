import { makeIndex } from "./lib/utils.js";

const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData(sourceData) {
  // Строим индексы из исходных данных (для мок-режима)
  const sellers = makeIndex(
    sourceData.sellers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`,
  );
  const customers = makeIndex(
    sourceData.customers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`,
  );
  const data = sourceData.purchase_records.map((item) => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount,
  }));

  // Переменные для кеширования данных с сервера
  let cachedSellers;
  let cachedCustomers;
  let lastResult;
  let lastQuery;

  //  Функция для приведения данных с сервера к нужному формату
  const mapRecords = (records) =>
    records.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: cachedSellers[item.seller_id],
      customer: cachedCustomers[item.customer_id],
      total: item.total_amount,
    }));

  // Получение индексов (продавцов и покупателей) с сервера
  const getIndexes = async () => {
    if (!cachedSellers || !cachedCustomers) {
      [cachedSellers, cachedCustomers] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
        fetch(`${BASE_URL}/customers`).then((res) => res.json()),
      ]);
    }
    return { sellers: cachedSellers, customers: cachedCustomers };
  };

  // Получение записей о продажах с сервера
  const getRecords = async (query = {}, isUpdated = false) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    // Если параметры не изменились и нет принудительного обновления - возвращаем кеш
    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();

    lastQuery = nextQuery;
    lastResult = {
      total: records.total,
      items: mapRecords(records.items),
    };

    return lastResult;
  };

  // Возвращаем API
  return {
    getIndexes,
    getRecords,
  };
}
