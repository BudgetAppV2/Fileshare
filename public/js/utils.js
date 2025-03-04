// utils.js
export function getMonthRange(date) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return { start, end };
  }
  
  export function normalizeNumber(value) {
    if (!value) return 0;
    if (typeof value === "number") return value;
    return parseFloat(value.replace(/\s/g, '').replace(',', '.')) || 0;
  }
  
  export function formatCurrency(value) {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(value);
  }
  
  