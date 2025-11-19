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
