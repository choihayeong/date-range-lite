/**
 * DualDatePicker - Range date picker component
 * @module dual-date-picker
 */

import { DateUtils } from './date-utils.js';
import { setInputValue, attachFocusClassToContainer, PickerCore } from './core-utils.js';

/**
 * @param {Object} options
 * @param {string} [options.inputId='dualRangeInput']
 * @param {string} [options.dropdownId='dualRangeDropdown']
 * @param {string} [options.leftCalendarId='leftCalendar']
 * @param {string} [options.rightCalendarId='rightCalendar']
 * @param {string} [options.presetLabelId='presetLabel']
 * @param {string} [options.presetsContainerSelector='.presets__button']
 * @param {string} [options.applyPresetId='applyPreset']
 * @param {number} [options.minYear]
 * @param {number} [options.maxYear]
 */
export function DualDatePicker({
  inputId = 'dualRangeInput',
  dropdownId = 'dualRangeDropdown',
  leftCalendarId = 'leftCalendar',
  rightCalendarId = 'rightCalendar',
  presetLabelId = 'presetLabel',
  presetsContainerSelector = '.presets__button',
  applyPresetId = 'applyPreset',
  minYear,
  maxYear,
} = {}) {
  this.today = new Date();
  this.leftMonth = DateUtils.subMonths(this.today, 1);
  this.rightMonth = new Date(this.today);
  this.startDate = null;
  this.endDate = null;

  this.minYear = minYear || this.today.getFullYear() - 10;
  this.maxYear = maxYear || this.today.getFullYear() + 10;

  this.input = document.getElementById(inputId);
  this.dropdown = document.getElementById(dropdownId);
  this.leftCalendarEl = document.getElementById(leftCalendarId);
  this.rightCalendarEl = document.getElementById(rightCalendarId);
  this.presetLabelEl = document.getElementById(presetLabelId);
  this.applyPresetBtn = document.getElementById(applyPresetId);

  this.currentPresetKey = null;
  this.leftMonthPickerOpen = false;
  this.rightMonthPickerOpen = false;

  this.leftMonthPickerEl = document.createElement('div');
  this.leftMonthPickerEl.className = 'year-month-list';
  this.leftMonthPickerEl.style.display = 'none';

  this.rightMonthPickerEl = document.createElement('div');
  this.rightMonthPickerEl.className = 'year-month-list';
  this.rightMonthPickerEl.style.display = 'none';

  PickerCore.registerDropdown(this.dropdown);
  attachFocusClassToContainer(this.input);

  this._presetButtons = this.dropdown ? this.dropdown.querySelectorAll(presetsContainerSelector) : [];

  this._bindEvents();
  this._initDefaultRange();
  this.render();
}

DualDatePicker.prototype._bindEvents = function () {
  const self = this;
  if (this.input) {
    this.input.addEventListener('click', () => {
      if (this.dropdown.classList.contains('open')) {
        this.dropdown.classList.remove('open');
      } else {
        PickerCore.closeAll(this.dropdown);
        this.dropdown.classList.add('open');
        this.render();
      }
    });
  }

  if (this.applyPresetBtn) {
    this.applyPresetBtn.addEventListener('click', () => {
      if (self.startDate && self.endDate) {
        self._updateInputValue();
        self.dropdown.classList.remove('open');
      }
    });
  }

  this._presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      self._presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      self.currentPresetKey = btn.dataset.preset || null;
      self._applyPreset(self.currentPresetKey);
    });
  });
};

DualDatePicker.prototype._initDefaultRange = function () {
  // 기본: 최근 7일
  this.startDate = DateUtils.subDays(this.today, 6);
  this.endDate = new Date(this.today);
  this.currentPresetKey = 'last7';
  this._updateInputValue();
};

DualDatePicker.prototype._applyPreset = function (key) {
  let range = null;
  const t = this.today;

  switch (key) {
    case 'yesterday':
      const y = DateUtils.subDays(t, 1);
      range = { start: y, end: y };
      break;
    case 'today':
      range = { start: t, end: t };
      break;
    case 'last7':
      range = { start: DateUtils.subDays(t, 6), end: t };
      break;
    case 'last30':
      range = { start: DateUtils.subDays(t, 29), end: t };
      break;
    case 'prevW': {
      const dow = t.getDay();
      const endLast = DateUtils.subDays(t, dow + 1);
      const startLast = DateUtils.subDays(endLast, 6);
      range = { start: startLast, end: endLast };
      break;
    }
    case 'thisM':
      range = { start: DateUtils.startOfMonth(t), end: t };
      break;
    case 'prevM': {
      const prev = DateUtils.subMonths(t, 1);
      range = {
        start: DateUtils.startOfMonth(prev),
        end: DateUtils.endOfMonth(prev),
      };
      break;
    }
    default:
      break;
  }

  if (!range) return;
  this.startDate = range.start;
  this.endDate = range.end;
  this.render();
};

DualDatePicker.prototype._updateInputValue = function () {
  if (!this.input || !this.startDate || !this.endDate) return;

  const text =
    `${DateUtils.formatDate(this.startDate, 'yyyy.MM.dd')} - ` +
    `${DateUtils.formatDate(this.endDate, 'yyyy.MM.dd')}`;
  setInputValue(this.input, text);

  if (!this.presetLabelEl) return;

  const labelMap = {
    yesterday: '어제',
    today: '오늘',
    last7: '최근 7일',
    last30: '최근 30일',
    prevW: '지난주',
    thisM: '이번달',
    prevM: '지난달',
  };

  if (this.currentPresetKey && labelMap[this.currentPresetKey]) {
    this.presetLabelEl.textContent = labelMap[this.currentPresetKey];
    this.presetLabelEl.classList.remove('is-hidden');
  } else {
    this.presetLabelEl.textContent = '';
    this.presetLabelEl.classList.add('is-hidden');
  }
};

DualDatePicker.prototype._handleDateClick = function (date) {
  if (!this.startDate || (this.startDate && this.endDate)) {
    this.startDate = date;
    this.endDate = null;
  } else if (DateUtils.isBefore(date, this.startDate)) {
    this.endDate = this.startDate;
    this.startDate = date;
  } else {
    this.endDate = date;
  }

  this.currentPresetKey = null;
  this._presetButtons.forEach(b => b.classList.remove('active'));
  this.render();
};

DualDatePicker.prototype._renderCalendar = function (currentMonth, isLeft) {
  const self = this;
  const monthStart = DateUtils.startOfMonth(currentMonth);
  const monthEnd = DateUtils.endOfMonth(currentMonth);
  const calendarStart = DateUtils.startOfWeek(monthStart);
  const calendarEnd = DateUtils.endOfWeek(monthEnd);

  const days = [];
  let d = new Date(calendarStart);
  while (d <= calendarEnd) {
    days.push(new Date(d));
    d = DateUtils.addDays(d, 1);
  }

  const weekdaysHtml = ['일', '월', '화', '수', '목', '금', '토']
    .map(d => `<div class="weekday">${d}</div>`)
    .join('');

  const daysHtml = days
    .map(day => {
      const isCurrentMonth = DateUtils.isSameMonth(day, currentMonth);
      const isToday = DateUtils.isSameDay(day, self.today);
      const isStart = self.startDate && DateUtils.isSameDay(day, self.startDate);
      const isEnd = self.endDate && DateUtils.isSameDay(day, self.endDate);
      const hasOnlyStart = self.startDate && !self.endDate;

      let inRange = false;
      if (self.startDate && self.endDate) {
        inRange = DateUtils.isWithinInterval(day, self.startDate, self.endDate);
      }
      if (hasOnlyStart && isStart) inRange = true;
      if (isStart || isEnd) inRange = true;

      const isSelected = isCurrentMonth && (isStart || isEnd);

      const classes = ['day'];
      if (!isCurrentMonth) classes.push('other-month');
      if (isSelected) classes.push('selected');
      if (inRange) classes.push('in-range');
      if (isStart) classes.push('range-start');
      if (isEnd) classes.push('range-end');
      if (isToday) classes.push('today');
      if (hasOnlyStart && isStart) classes.push('range-start--pending');

      const disabled = !isCurrentMonth;

      return `<button class="${classes.join(' ')}"
                      ${disabled ? 'disabled aria-disabled="true"' : ''}
                      data-date="${day.getTime()}">
                ${day.getDate()}
              </button>`;
    })
    .join('');

  const html = `
    <div class="calendar-header">
      <button class="nav-btn nav-btn--prev">
        <span hidden>이전 달</span>
      </button>
      <span class="month-label">${DateUtils.formatDate(currentMonth, 'yyyy년 M월')}</span>
      <button class="nav-btn nav-btn--next">
        <span hidden>다음 달</span>
      </button>
    </div>
    <div class="calendar-grid">
      ${weekdaysHtml}
      ${daysHtml}
    </div>
  `;

  const container = isLeft ? this.leftCalendarEl : this.rightCalendarEl;
  if (!container) return;

  container.innerHTML = html;

  const prevBtn = container.querySelector('.nav-btn--prev');
  const nextBtn = container.querySelector('.nav-btn--next');
  const monthLabel = container.querySelector('.month-label');

  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (isLeft) {
      this.leftMonth = DateUtils.subMonths(currentMonth, 1);
    } else {
      this.rightMonth = DateUtils.subMonths(currentMonth, 1);
    }
    this.render();
  });

  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (isLeft) {
      this.leftMonth = DateUtils.addMonths(currentMonth, 1);
    } else {
      this.rightMonth = DateUtils.addMonths(currentMonth, 1);
    }
    this.render();
  });

  monthLabel.style.cursor = 'pointer';
  monthLabel.addEventListener('click', e => {
    e.stopPropagation();
    this._toggleInlineMonthPicker(container, currentMonth, isLeft);
  });

  container.querySelectorAll('.day:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const date = new Date(Number(btn.dataset.date));
      self._handleDateClick(date);
    });
  });
};

DualDatePicker.prototype._toggleInlineMonthPicker = function (calendarContainer, baseMonth, isLeft) {
  const pickerEl = isLeft ? this.leftMonthPickerEl : this.rightMonthPickerEl;
  const flagKey = isLeft ? 'leftMonthPickerOpen' : 'rightMonthPickerOpen';

  const grid = calendarContainer.querySelector('.calendar-grid');
  const header = calendarContainer.querySelector('.calendar-header');

  if (this[flagKey]) {
    // close
    grid.style.display = 'grid';
    pickerEl.style.display = 'none';
    pickerEl.remove();
    this[flagKey] = false;
    return;
  }

  // open
  grid.style.display = 'none';
  pickerEl.style.display = 'block';
  header.insertAdjacentElement('afterend', pickerEl);
  this[flagKey] = true;

  this._renderInlineMonthPicker(pickerEl, baseMonth, isLeft);
  this._scrollMonthPickerToYear(pickerEl, baseMonth.getFullYear());
};

DualDatePicker.prototype._renderInlineMonthPicker = function (pickerEl, baseMonth, isLeft) {
  const self = this;
  let html = '';

  for (let y = this.minYear; y <= this.maxYear; y++) {
    html += `<div class="year-month-section" data-year="${y}">
      <div class="year-title">${y}년</div>
      <div class="month-grid">`;

    for (let m = 0; m < 12; m++) {
      const monthNumber = m + 1;
      const isSelected = baseMonth.getFullYear() === y && baseMonth.getMonth() === m;
      const isCurrent = this.today.getFullYear() === y && this.today.getMonth() === m;

      const classes = ['month-button'];
      if (isSelected) classes.push('selected');
      if (isCurrent) classes.push('current');

      html += `<button class="${classes.join(' ')}"
                       data-year="${y}"
                       data-month="${m}">
                  ${monthNumber}
                </button>`;
    }

    html += `</div></div>`;
  }

  pickerEl.innerHTML = html;

  pickerEl.querySelectorAll('.month-button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const y = parseInt(btn.dataset.year, 10);
      const m = parseInt(btn.dataset.month, 10);
      const selectedMonth = new Date(y, m, 1);

      if (isLeft) this.leftMonth = selectedMonth;
      else this.rightMonth = selectedMonth;

      this.leftMonthPickerOpen = false;
      this.rightMonthPickerOpen = false;
      pickerEl.style.display = 'none';
      pickerEl.remove();
      self.render();
    });
  });
};

DualDatePicker.prototype._scrollMonthPickerToYear = function (pickerEl, year) {
  const section = pickerEl.querySelector(`.year-month-section[data-year="${year}"]`);
  if (!section) return;
  const offsetTop = section.offsetTop;
  const targetScroll = offsetTop - pickerEl.clientHeight / 2 + section.clientHeight / 2;
  pickerEl.scrollTop = targetScroll;
};

DualDatePicker.prototype.render = function () {
  this._renderCalendar(this.leftMonth, true);
  this._renderCalendar(this.rightMonth, false);
  if (this.applyPresetBtn) {
    this.applyPresetBtn.disabled = !(this.startDate && this.endDate);
  }
};
