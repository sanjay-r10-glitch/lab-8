# Web Programming Lab 8: Form Handling & Cross-Page State

## Overview
A web application designed to capture user information through HTML5 form elements, validate input using client-side JavaScript, and seamlessly transmit and display the data on a secondary profile showcase page.

---

## Captured Form Elements
1. **Full Name**: Text input with real-time character & regex validation.
2. **Gender**: Interactive radio cards with standard symbols (**♂ Male**, **♀ Female**, and **⚧ Other**).
3. **Mobile Number**: Telephone input with international country code prefix (`+91`, `+1`, `+44`, etc.) and auto-formatting.
4. **Mail ID**: Email input with format validation.
5. **Country**: Select dropdown with popular countries.
6. **State**: Select dropdown dynamically populated based on country, plus custom fallback.
7. **City**: Select dropdown dynamically populated based on state, plus custom fallback.

---

## Architecture & Cross-Page Communication
Data captured on `index.html` is passed to `display.html` through dual mechanisms to ensure compatibility across all environments (including direct `file:///` filesystem execution):
1. **URL Query Parameters (`URLSearchParams`)**: Encodes fields into the URL (e.g., `display.html?fullName=...&gender=...`), ensuring reliable cross-page parameter retrieval in any browser.
2. **Web Storage API (`sessionStorage` & `localStorage`)**: Stores the active profile object as serialized JSON. Also maintains a submission history list so multiple registrations can be reviewed.

---

## File Structure
- [index.html](file:///c:/Users/sanja/OneDrive/Desktop/Web%20Progaraming/lab%208/index.html) - Registration & data capture form.
- [display.html](file:///c:/Users/sanja/OneDrive/Desktop/Web%20Progaraming/lab%208/display.html) - Profile showcase & digital ID badge display.
- [style.css](file:///c:/Users/sanja/OneDrive/Desktop/Web%20Progaraming/lab%208/style.css) - Vanilla CSS styling with glassmorphism, responsive grid, animations, and print stylesheets.
- [script.js](file:///c:/Users/sanja/OneDrive/Desktop/Web%20Progaraming/lab%208/script.js) - Form validation, progress calculation, and redirection logic.
- [display.js](file:///c:/Users/sanja/OneDrive/Desktop/Web%20Progaraming/lab%208/display.js) - Cross-page data parser, profile renderer, history manager, and clipboard utilities.

---

## How to Run
Simply open [index.html](file:///c:/Users/sanja/OneDrive/Desktop/Web%20Progaraming/lab%208/index.html) in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
