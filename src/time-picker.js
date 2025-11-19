/**
 * TimePicker - Time selection component
 * @module time-picker
 */

import { setInputValue, attachFocusClassToContainer, PickerCore } from './core-utils.js';

/**
 * @param {Object} options
 * @param {string} [options.inputId='timePicker']
 * @param {string} [options.dropdownId='timeDropdown']
 * @param {string} [options.timeListId='timeList']
 * @param {string} [options.applyBtnId='applyTime']
 */
export function TimePicker({
  inputId = 'timePicker',
  dropdownId = 'timeDropdown',
  timeListId = 'timeList',
  applyBtnId = 'applyTime',
} = {}) {
  this.input = document.getElementById(inputId);
  this.dropdown = document.getElementById(dropdownId);
  this.timeList = document.getElementById(timeListId);
  this.applyBtn = applyBtnId ? document.getElementById(applyBtnId) : null;

  const now = new Date();
  const parsed = parseTimeString(this.input && this.input.value);
  const initial = parsed || { hour: now.getHours(), minute: now.getMinutes() };

  this.selectedHour = initial.hour;
  this.selectedMinute = initial.minute;

  PickerCore.registerDropdown(this.dropdown);
  attachFocusClassToContainer(this.input);

  this._bindEvents();
  setInputValue(this.input, formatTime(this.selectedHour, this.selectedMinute));
  this.render();
}

function formatTime(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function parseTimeString(str) {
  if (!str) return null;
  const [hh, mm] = str.split(':');
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { hour: h, minute: m };
}

TimePicker.prototype._bindEvents = function () {
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
      setInputValue(this.input, formatTime(this.selectedHour, this.selectedMinute));
      this.dropdown.classList.remove('open');
    });
  }
};

TimePicker.prototype.render = function () {
  if (!this.timeList) return;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const hourHtml = hours
    .map(h => {
      const selected = h === this.selectedHour ? ' selected' : '';
      return `<button class="time-option${selected}" data-type="hour" data-value="${h}">${h}</button>`;
    })
    .join('');

  const minuteHtml = minutes
    .map(m => {
      const selected = m === this.selectedMinute ? ' selected' : '';
      return `<button class="time-option${selected}" data-type="minute" data-value="${m}">${m}</button>`;
    })
    .join('');

  const currentText = formatTime(this.selectedHour, this.selectedMinute);

  const html = `
    <div class="time-picker">
      <div class="time-picker__header">
        <span class="time-picker__current">${currentText}</span>
      </div>
      <div class="time-picker__columns">
        <div class="time-column time-column--hours">
          <div class="time-column__label">Hours</div>
          <div class="time-column__list" data-type="hour">
            ${hourHtml}
          </div>
        </div>
        <div class="time-column time-column--minutes">
          <div class="time-column__label">Minutes</div>
          <div class="time-column__list" data-type="minute">
            ${minuteHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  this.timeList.innerHTML = html;

  const self = this;
  this.timeList.querySelectorAll('.time-column__list').forEach(list => {
    list.addEventListener('click', e => {
      const btn = e.target.closest('.time-option');
      if (!btn) return;
      e.stopPropagation();
      const type = btn.dataset.type;
      const value = parseInt(btn.dataset.value, 10);
      if (Number.isNaN(value)) return;

      if (type === 'hour') self.selectedHour = value;
      if (type === 'minute') self.selectedMinute = value;

      self.render();
    });
  });

  this._scrollToSelected('hour');
  this._scrollToSelected('minute');
};

TimePicker.prototype._scrollToSelected = function (type) {
  if (!this.timeList) return;
  const list = this.timeList.querySelector(`.time-column__list[data-type="${type}"]`);
  if (!list) return;

  const selected = list.querySelector('.time-option.selected');
  if (!selected) return;

  const offsetTop = selected.offsetTop;
  const targetScroll = offsetTop - list.clientHeight / 2 + selected.clientHeight / 2;
  list.scrollTop = targetScroll;
};
