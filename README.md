# Weather Dashboard

A clean, responsive weather dashboard that shows current weather and a 5-day forecast using the OpenWeather API. The UI has a modern "glass" look, a unit toggle (°C/°F), persisted last-search, and a small loading indicator for forecasts.

## Features

- Search weather by city name (search box or press Enter).
- Current weather card with:
  - Location (city, country)
  - Description and weather icon
  - Temperature and "feels like"
  - Humidity, wind speed, pressure, visibility, rain/snow
- 5-day forecast (midday snapshot per day) rendered as cards with icon, short description and temperature.
- Unit toggle (°C / °F) — toggles both current weather and forecast.
- Last searched city is saved to localStorage and auto-loaded on page open.
- Simple loading indicator while forecast data is fetched.

## Files

- `index.html` — app HTML and structure (search, main card, small stat cards, forecast section, unit toggle).
- `style.css` — CSS variables, layout, glass cards, responsive grid, hover/focus states, loader animation.
- `script.js` — Fetches current weather and 5-day forecast, updates DOM, handles unit toggle and localStorage.

## How to run locally

This is a static site — just open `index.html` in a browser to try it. For a better local experience (serving via a simple local server):



## OpenWeather API key

The app currently contains an OpenWeather API key in `script.js` for convenience while developing. Important security notes:

- Never ship a private API key in public production code. Expose the key from a server-side endpoint or use a proxy to keep it secret.
- To replace the key, open `script.js` and update the `apiKey` constant.

## Units and Localization

- Toggle between metric (°C, m/s) and imperial (°F, mph) using the unit toggle button near the search box. The forecast and wind speed requests respect the selected units.
- Dates in forecast cards use the browser's locale to format weekday names.

## Implementation notes

- Forecast fetching uses OpenWeather's 3-hour `forecast` endpoint and groups items by date; it selects the midday (12:00) item for each day where available and falls back to a central sample for that day.
- The forecast displays up to 5 days.

## Customization ideas / next steps

- Move API key to a backend or serverless function to keep it secret.
- Add a settings panel to pick number of forecast days, units preference persistence, or auto-location via Geolocation API.
- Improve error UI: show a friendly card when forecast or weather fetch fails.
- Add caching for repeated requests to reduce API usage.


## License

Use this project as you like — consider adding a license file if you plan to publish it.

---

rename "C:\Users\WAREEZ\Documents\My-Project\Weather Dashoard" "Weather-Dashboard"


