// scripts/init-structure.js
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('created:', filePath);
  } else {
    console.log('skip (exists):', filePath);
  }
}

const root = process.cwd();
const srcDir = path.join(root, 'src');
const stylesDir = path.join(srcDir, 'styles');

ensureDir(srcDir);
ensureDir(stylesDir);

// 기본 JS 파일들
writeIfNotExists(
  path.join(srcDir, 'index.js'),
  `export * from './date-utils.js';
export * from './core-utils.js';
export * from './dual-date-picker.js';
export * from './month-picker.js';
export * from './default-date-picker.js';
export * from './time-picker.js';
`
);

writeIfNotExists(
  path.join(srcDir, 'date-utils.js'),
  `// DateUtils: 날짜 관련 유틸 함수 모듈
export const DateUtils = {
  formatDate(date, format) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (format === 'yyyy.MM.dd') {
      return \`\${year}.\${month < 10 ? '0' + month : month}.\${day < 10 ? '0' + day : day}\`;
    } else if (format === 'yyyy년 M월') {
      return \`\${year}년 \${month}월\`;
    } else if (format === 'M월') {
      return \`\${month}월\`;
    }
    return date.toString();
  },
  addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  },
  subMonths(date, months) {
    return this.addMonths(date, -months);
  },
  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
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
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  },
  endOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() + (6 - day);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  },
  isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  },
  isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth();
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
};
`
);

writeIfNotExists(
  path.join(srcDir, 'core-utils.js'),
  `// DateRangeLite 공통 유틸
export function closeAllPickers(exceptId) {
  document.querySelectorAll('.picker-dropdown.open').forEach(dd => {
    if (!exceptId || dd.id !== exceptId) {
      dd.classList.remove('open');
    }
  });
}

export function attachFocusClassToContainer(inputEl) {
  if (!inputEl) return;
  const container =
    inputEl.closest('.date-input-container') ||
    inputEl.closest('.time-input-container');
  if (!container) return;

  inputEl.addEventListener('focus', () => {
    container.classList.add('is-focused');
  });

  inputEl.addEventListener('blur', () => {
    container.classList.remove('is-focused');
  });
}

export function setInputValue(inputEl, value) {
  if (!inputEl) return;
  const safe = value || '';
  inputEl.value = safe;
  inputEl.setAttribute('value', safe);
}
`
);

// 나머지 picker 파일들은 기존 코드 붙여넣기/리팩토링
writeIfNotExists(path.join(srcDir, 'dual-date-picker.js'), `// export function DualDatePicker(options) { ... }`);
writeIfNotExists(path.join(srcDir, 'month-picker.js'), `// export function MonthPicker(options) { ... }`);
writeIfNotExists(path.join(srcDir, 'default-date-picker.js'), `// export function DefaultDatePicker(options) { ... }`);
writeIfNotExists(path.join(srcDir, 'time-picker.js'), `// export function TimePicker(options) { ... }`);

// SCSS 기본 파일
writeIfNotExists(
  path.join(stylesDir, 'date-range-lite.scss'),
  `/* DateRangeLite 기본 스타일 (SCSS)
   * TODO: 캘린더/타임피커 SCSS 여기로 붙여넣기
   */

.date-picker-container {
  position: relative;
  display: inline-block;
}

/* ... 나머지 SCSS ... */
`
);

console.log('✅ DateRangeLite 기본 구조 생성 완료');
