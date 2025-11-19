/**
 * DOM / Core Utils - Common helper functions
 * @module core-utils
 */

export function setInputValue(inputEl, value) {
  if (!inputEl) return;
  const safe = value || '';
  inputEl.value = safe;
  inputEl.setAttribute('value', safe);
}

export function attachFocusClassToContainer(inputEl) {
  if (!inputEl) return;
  const container = inputEl.closest('.date-input-container') || inputEl.closest('.time-input-container');
  if (!container) return;

  inputEl.addEventListener('focus', () => {
    container.classList.add('is-focused');
  });
  inputEl.addEventListener('blur', () => {
    container.classList.remove('is-focused');
  });
}

export const PickerCore = (() => {
  const dropdowns = new Set();

  function register(dropdownEl) {
    if (!dropdownEl) return;
    dropdowns.add(dropdownEl);
  }

  function closeAll(exceptEl) {
    dropdowns.forEach(dd => {
      if (!exceptEl || dd !== exceptEl) {
        dd.classList.remove('open');
      }
    });
  }

  // 공통 외부 클릭 핸들러 – 한 번만 붙이기
  document.addEventListener('click', e => {
    const container = e.target.closest('.date-picker-container, .time-picker-container');
    if (container) return; // 내부 클릭
    closeAll();
  });

  return {
    registerDropdown: register,
    closeAll,
  };
})();
