/**
 * MonthPicker - Month/Year selection component
 * @module month-picker
 */

import { DateUtils } from './date-utils.js';
import { setInputValue, attachFocusClassToContainer, PickerCore } from './core-utils.js';

/**
 * @param {Object} options
 * @param {string} [options.inputId='monthPicker']
 * @param {string} [options.dropdownId='yearMonthDropdown']
 * @param {string} [options.yearMonthListId='yearMonthList']
 * @param {string} [options.applyButtonId='applyYearMonth']
 * @param {string} [options.minDate] - 'YYYY-MM' format
 * @param {string} [options.maxDate] - 'YYYY-MM' format
 * @param {number} [options.minYear]
 * @param {number} [options.maxYear]
 */
export function MonthPicker({
  inputId = 'monthPicker',
  dropdownId = 'yearMonthDropdown',
  yearMonthListId = 'yearMonthList',
  applyButtonId = 'applyYearMonth',
  minDate,
  maxDate,
  minYear,
  maxYear,
} = {}) {
  this.today = new Date();

  this.minMonth = DateUtils.parseYearMonth(minDate);
  this.maxMonth = DateUtils.parseYearMonth(maxDate);
  this.minYear = minYear || this.today.getFullYear() - 10;
  this.maxYear = maxYear || this.today.getFullYear() + 10;

  const clamped = DateUtils.clampMonth(
    { year: this.today.getFullYear(), month: this.today.getMonth() },
    this.minMonth,
    this.maxMonth
  );
  this.selectedYear = clamped.year;
  this.selectedMonth = clamped.month;

  this.input = document.getElementById(inputId);
  this.dropdown = document.getElementById(dropdownId);
  this.yearMonthList = document.getElementById(yearMonthListId);
  this.applyBtn = document.getElementById(applyButtonId);

  PickerCore.registerDropdown(this.dropdown);
  attachFocusClassToContainer(this.input);

  this._bindEvents();
  this.render();
  const initialValue = DateUtils.formatDate(new Date(this.selectedYear, this.selectedMonth, 1), 'yyyy.MM.dd').slice(
    0,
    7
  );
  setInputValue(this.input, initialValue);
}

MonthPicker.prototype._bindEvents = function () {
  const self = this;

  if (this.input) {
    this.input.addEventListener('click', () => {
      if (!this.dropdown.classList.contains('open')) {
        PickerCore.closeAll(this.dropdown);
        this.dropdown.classList.add('open');
        this.render();
        this._scrollToSelectedYear();
      } else {
        this.dropdown.classList.remove('open');
      }
    });
  }

  if (this.applyBtn) {
    this.applyBtn.addEventListener('click', () => {
      const date = new Date(this.selectedYear, this.selectedMonth, 1);
      const value = DateUtils.formatDate(date, 'yyyy.MM.dd').slice(0, 7);
      setInputValue(this.input, value);
      this.dropdown.classList.remove('open');
    });
  }
};

MonthPicker.prototype.render = function () {
  if (!this.yearMonthList) return;
  const self = this;
  let html = '';

  for (let y = this.minYear; y <= this.maxYear; y++) {
    html += `<div class="year-month-section" data-year="${y}">
      <div class="year-title">${y}년</div>
      <div class="month-grid">`;

    for (let m = 0; m < 12; m++) {
      const monthNum = m + 1;
      const classes = ['month-button'];

      const disabled = DateUtils.isBeforeMonth(y, m, this.minMonth) || DateUtils.isAfterMonth(y, m, this.maxMonth);

      if (this.selectedYear === y && this.selectedMonth === m) {
        classes.push('selected');
      }
      if (this.today.getFullYear() === y && this.today.getMonth() === m) {
        classes.push('current');
      }
      if (disabled) classes.push('disabled');

      html += `<button class="${classes.join(' ')}"
                       data-year="${y}"
                       data-month="${m}"
                       ${disabled ? 'disabled aria-disabled="true"' : ''}>
                 ${monthNum}
               </button>`;
    }

    html += `</div></div>`;
  }

  this.yearMonthList.innerHTML = html;

  this.yearMonthList.querySelectorAll('.month-button').forEach(btn => {
    if (btn.classList.contains('disabled')) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const y = parseInt(btn.dataset.year, 10);
      const m = parseInt(btn.dataset.month, 10);
      self.selectedYear = y;
      self.selectedMonth = m;
      self.render();
      self._scrollToSelectedYear();
    });
  });
};

MonthPicker.prototype._scrollToSelectedYear = function () {
  if (!this.yearMonthList) return;
  const section = this.yearMonthList.querySelector(`.year-month-section[data-year="${this.selectedYear}"]`);
  if (!section) return;
  const offsetTop = section.offsetTop;
  const targetScroll = offsetTop - this.yearMonthList.clientHeight / 2 + section.clientHeight / 2;
  this.yearMonthList.scrollTop = targetScroll;
};
