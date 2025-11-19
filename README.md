# Date-Range-Lite

A modular, lightweight date/time picker library for vanilla JavaScript. Supports range selection, month selection, single date selection, and time selection with customizable styling.

## Features

- **DualDatePicker**: Range date picker with preset options
- **MonthPicker**: Month/Year selection component
- **DefaultDatePicker**: Single date picker
- **TimePicker**: Time selection (HH:MM format)
- **Modular & ES6**: Built with ES modules for easy composition
- **Lightweight**: No dependencies
- **Customizable**: CSS custom properties for theming

## Installation

```bash
npm install date-range-lite
```

## Usage

### DualDatePicker (Range Selection)

```html
<div class="date-picker-container">
  <div class="date-input-container date-input-container--dual">
    <span class="date-preset-label" id="presetLabel">날짜 선택 범위</span>
    <input type="text" id="dualRangeInput" class="date-input" placeholder="날짜를 선택하세요" readonly />
  </div>

  <div class="picker-dropdown" id="dualRangeDropdown">
    <div class="picker-content">
      <div class="dual-calendars">
        <div class="each-calendar" id="leftCalendar"></div>
        <div class="each-calendar" id="rightCalendar"></div>
      </div>

      <div class="presets-container">
        <div class="presets">
          <button class="presets__button" data-preset="yesterday">어제</button>
          <button class="presets__button" data-preset="today">오늘</button>
          <button class="presets__button" data-preset="last7">최근 7일</button>
          <button class="presets__button" data-preset="last30">최근 30일</button>
          <button class="presets__button" data-preset="prevW">지난주</button>
          <button class="presets__button" data-preset="thisM">이번달</button>
          <button class="presets__button" data-preset="prevM">지난달</button>
        </div>
        <button class="button button--fit button--primary presets-apply" id="applyPreset">적용</button>
      </div>
    </div>
  </div>
</div>
```

```javascript
import { DualDatePicker } from "date-range-lite";

new DualDatePicker({
  inputId: "dualRangeInput",
  dropdownId: "dualRangeDropdown",
  leftCalendarId: "leftCalendar",
  rightCalendarId: "rightCalendar",
  minYear: 2020,
  maxYear: 2030,
});
```

### MonthPicker

```html
<div class="date-picker-container">
  <div class="date-input-container">
    <input type="text" id="monthPicker" class="date-input" placeholder="기준 월을 선택하세요" readonly />
  </div>

  <div class="picker-dropdown" id="yearMonthDropdown">
    <div class="year-month-list" id="yearMonthList"></div>

    <div class="picker-footer">
      <button class="ui-button ui-button--primary" id="applyYearMonth">적용</button>
    </div>
  </div>
</div>
```

```javascript
import { MonthPicker } from "date-range-lite";

new MonthPicker({
  inputId: "monthPicker",
  dropdownId: "yearMonthDropdown",
  minDate: "2020-01",
  maxDate: "2030-12",
});
```

### DefaultDatePicker

```html
<div class="date-picker-container">
  <div class="date-input-container">
    <input type="text" id="singleDatePicker" class="date-input" placeholder="날짜를 선택하세요" readonly />
  </div>

  <div class="picker-dropdown" id="singleCalendarDropdown">
    <div class="each-calendar" id="singleCalendar"></div>
  </div>
</div>
```

```javascript
import { DefaultDatePicker } from "date-range-lite";

new DefaultDatePicker({
  inputId: "singleDatePicker",
  dropdownId: "singleCalendarDropdown",
  minDate: "2020-01-01",
  maxDate: "2030-12-31",
});
```

### TimePicker

```html
<div class="date-picker-container">
  <div class="date-input-container">
    <input type="text" id="timePicker" class="time-input" placeholder="HH:MM" readonly />
  </div>

  <div class="picker-dropdown" id="timeDropdown">
    <div class="time-list" id="timeList"></div>
    <div class="picker-footer">
      <button class="ui-button ui-button--primary" id="applyTime">적용</button>
    </div>
  </div>
</div>
```

```javascript
import { TimePicker } from "date-range-lite";

new TimePicker({
  inputId: "timePicker",
  dropdownId: "timeDropdown",
});
```

## Utilities

### DateUtils

Provides date manipulation functions:

```javascript
import { DateUtils } from "date-range-lite";

DateUtils.formatDate(date, "yyyy.MM.dd");
DateUtils.addMonths(date, 1);
DateUtils.isSameDay(date1, date2);
// ... and more
```

## Styling

Import the default styles:

```javascript
import "date-range-lite/styles";
```

Or customize with CSS custom properties:

```css
:root {
  --date-input-border-radius: 8px;
  --day-hover-bg: #e0edff;
  --today-bg: #1f5cf8;
  --today-text-color: #fff;
}
```

## Project Structure

```
DateRangeX/
  src/
    index.js                  # Main export file
    date-utils.js            # Date utilities
    core-utils.js            # Shared utilities
    dual-date-picker.js      # Range picker component
    month-picker.js          # Month picker component
    default-date-picker.js   # Single date picker component
    time-picker.js           # Time picker component
    styles/
      date-range-lite.scss        # Main stylesheet
  dist/
    date-range-lite.esm.js        # ES module bundle
    date-range-lite.cjs.js        # CommonJS bundle
    date-range-lite.css           # Compiled CSS
```

## License

MIT
