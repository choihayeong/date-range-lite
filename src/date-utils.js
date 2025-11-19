/**
 * DateUtils - Date manipulation utilities
 * @module date-utils
 */

export const DateUtils = {
  formatDate(date, format) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    const mm = m < 10 ? '0' + m : m;
    const dd = d < 10 ? '0' + d : d;

    switch (format) {
      case 'yyyy.MM.dd':
        return `${y}.${mm}.${dd}`;
      case 'yyyy년 M월':
        return `${y}년 ${m}월`;
      case 'M월':
        return `${m}월`;
      default:
        return date.toString();
    }
  },

  addMonths(date, months) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  },

  subMonths(date, months) {
    return this.addMonths(date, -months);
  },

  addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  },

  subDays(date, days) {
    return this.addDays(date, -days);
  },

  startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  startOfWeek(date) {
    const d = date.getDay();
    const diff = date.getDate() - d;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  },

  endOfWeek(date) {
    const d = date.getDay();
    const diff = date.getDate() + (6 - d);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  },

  isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  },

  isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  },

  isBefore(a, b) {
    return a.getTime() < b.getTime();
  },

  isAfter(a, b) {
    return a.getTime() > b.getTime();
  },

  isWithinInterval(date, start, end) {
    const t = date.getTime();
    return t >= start.getTime() && t <= end.getTime();
  },

  /** 'YYYY-MM-DD' → Date | null */
  parseYmd(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  },

  /** 'YYYY-MM' → {year, month(0~11)} | null */
  parseYearMonth(str) {
    if (!str) return null;
    const [y, m] = str.split('-').map(Number);
    if (!y || !m) return null;
    return { year: y, month: m - 1 };
  },

  clampDate(date, min, max) {
    const t = date.getTime();
    if (min && t < min.getTime()) return new Date(min);
    if (max && t > max.getTime()) return new Date(max);
    return date;
  },

  isBeforeMonth(y, m, bound) {
    if (!bound) return false;
    if (y < bound.year) return true;
    if (y === bound.year && m < bound.month) return true;
    return false;
  },

  isAfterMonth(y, m, bound) {
    if (!bound) return false;
    if (y > bound.year) return true;
    if (y === bound.year && m > bound.month) return true;
    return false;
  },

  clampMonth({ year, month }, minMonth, maxMonth) {
    if (minMonth && this.isBeforeMonth(year, month, minMonth)) {
      return { year: minMonth.year, month: minMonth.month };
    }
    if (maxMonth && this.isAfterMonth(year, month, maxMonth)) {
      return { year: maxMonth.year, month: maxMonth.month };
    }
    return { year, month };
  },
};
