/**
 * DefaultDatePicker - Single date picker component
 * @module default-date-picker
 */

import { DateUtils } from './date-utils.js';
import { setInputValue, attachFocusClassToContainer, PickerCore } from './core-utils.js';

/**
 * @param {Object} options
 * @param {string} [options.inputId='singleDatePicker']
 * @param {string} [options.dropdownId='singleCalendarDropdown']
 * @param {string} [options.calendarId='singleCalendar']
 * @param {string} [options.applyBtnId=null]
 * @param {string} [options.minDate] - 'YYYY-MM-DD' format
 * @param {string} [options.maxDate] - 'YYYY-MM-DD' format
 */
export function DefaultDatePicker({
  inputId = 'singleDatePicker',
  dropdownId = 'singleCalendarDropdown',
  calendarId = 'singleCalendar',
  applyBtnId = null,
  minDate,
  maxDate,
} = {}) {
  this.today = new Date();
  this.minDate = DateUtils.parseYmd(minDate);
  this.maxDate = DateUtils.parseYmd(maxDate);

  const initial = DateUtils.clampDate(new Date(this.today), this.minDate, this.maxDate);
  this.selectedDate = initial;
  this.currentMonth = new Date(initial.getFullYear(), initial.getMonth(), 1);

  this.input = document.getElementById(inputId);
  this.dropdown = document.getElementById(dropdownId);
  this.calendarContainer = document.getElementById(calendarId);
  this.applyBtn = applyBtnId ? document.getElementById(applyBtnId) : null;

  this.minMonth = this.minDate ? new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1) : null;
  this.maxMonth = this.maxDate ? new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1) : null;

  PickerCore.registerDropdown(this.dropdown);
  attachFocusClassToContainer(this.input);

  this._bindEvents();
  setInputValue(this.input, DateUtils.formatDate(initial, 'yyyy.MM.dd'));
  this.render();
}

DefaultDatePicker.prototype._bindEvents = function () {
  const self = this;

  if (this.input) {
    this.input.addEventListener('click', () => {
      if (!this.dropdown.classList.contains('open')) {
        PickerCore.closeAll(this.dropdown);
        this.dropdown.classList.add('open');
        this.render();
      } else {
        this.dropdown.classList.remove('open');
      }
    });
  }

  if (this.applyBtn) {
    this.applyBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.selectedDate) return;
      setInputValue(this.input, DateUtils.formatDate(this.selectedDate, 'yyyy.MM.dd'));
      this.dropdown.classList.remove('open');
    });
  }
};

DefaultDatePicker.prototype._handleDateClick = function (date) {
  this.selectedDate = date;
  if (!this.applyBtn) {
    setInputValue(this.input, DateUtils.formatDate(date, 'yyyy.MM.dd'));
    this.dropdown.classList.remove('open');
  } else {
    this.render();
  }
};

DefaultDatePicker.prototype.render = function () {
  if (!this.calendarContainer) return;
  const self = this;

  const monthStart = DateUtils.startOfMonth(this.currentMonth);
  const monthEnd = DateUtils.endOfMonth(this.currentMonth);
  const calendarStart = DateUtils.startOfWeek(monthStart);
  const calendarEnd = DateUtils.endOfWeek(monthEnd);

  const days = [];
  let d = new Date(calendarStart);
  while (d <= calendarEnd) {
    days.push(new Date(d));
    d = DateUtils.addDays(d, 1);
  }

  const weekdaysHtml = ['일', '월', '화', '수', '목', '금', '토']
    .map(w => `<div class="weekday">${w}</div>`)
    .join('');

  const daysHtml = days
    .map(date => {
      const isCurrentMonth = DateUtils.isSameMonth(date, self.currentMonth);
      const isToday = DateUtils.isSameDay(date, self.today);
      const isSelected = self.selectedDate && DateUtils.isSameDay(date, self.selectedDate);

      let disabled = !isCurrentMonth;
      const classes = ['day'];
      if (!isCurrentMonth) classes.push('other-month');
      if (isToday) classes.push('today');
      if (isSelected) classes.push('selected');

      if (self.minDate && date.getTime() < self.minDate.getTime()) {
        disabled = true;
      }
      if (self.maxDate && date.getTime() > self.maxDate.getTime()) {
        disabled = true;
      }
      if (disabled) classes.push('disabled');

      return `<button class="${classes.join(' ')}"
                      ${disabled ? 'disabled aria-disabled="true"' : ''}
                      data-date="${date.getTime()}">
                ${date.getDate()}
              </button>`;
    })
    .join('');

  const html = `
    <div class="calendar-header">
      <button class="nav-btn nav-btn--prev">
        <span hidden>이전 달</span>
      </button>
      <span class="month-label">${DateUtils.formatDate(this.currentMonth, 'yyyy년 M월')}</span>
      <button class="nav-btn nav-btn--next">
        <span hidden>다음 달</span>
      </button>
    </div>
    <div class="calendar-grid">
      ${weekdaysHtml}
      ${daysHtml}
    </div>
  `;

  this.calendarContainer.innerHTML = html;

  const prevBtn = this.calendarContainer.querySelector('.nav-btn--prev');
  const nextBtn = this.calendarContainer.querySelector('.nav-btn--next');

  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    const prevMonth = DateUtils.subMonths(self.currentMonth, 1);
    if (self.minMonth && prevMonth < self.minMonth) return;
    self.currentMonth = prevMonth;
    self.render();
  });

  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    const nextMonth = DateUtils.addMonths(self.currentMonth, 1);
    if (self.maxMonth && nextMonth > self.maxMonth) return;
    self.currentMonth = nextMonth;
    self.render();
  });

  this.calendarContainer.querySelectorAll('.day:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const date = new Date(Number(btn.dataset.date));
      self._handleDateClick(date);
    });
  });
};
