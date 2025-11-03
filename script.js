
const apiKey = '25a90b651cb19274cc5a8de2f39501a5';
let units = 'metric'; // 'metric' or 'imperial'

// Helper to format numbers and show fallback
function fmt(val, unit = ''){
    if (val === undefined || val === null) return '—';
    return `${Math.round(val)}${unit}`;
}

async function getWeather(){
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();
    const messageEl = document.getElementById('message');

    if(!city){
        messageEl.textContent = 'Please enter a city name.';
        return;
    }

    messageEl.textContent = 'Loading…';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try{
        const res = await fetch(url);
        if(!res.ok){
            if(res.status === 404) throw new Error('City not found');
            throw new Error('Network response was not ok');
        }
        const data = await res.json();

        // populate UI
        document.getElementById('location').textContent = `${data.name}, ${data.sys && data.sys.country ? data.sys.country : ''}`;
        document.getElementById('temperature').textContent = fmt(data.main.temp, '°C');
        document.getElementById('description').textContent = data.weather?.[0]?.description ?? '—';
        document.getElementById('humidity').textContent = fmt(data.main.humidity, '%');
        document.getElementById('windSpeed').textContent = fmt(data.wind.speed, ' m/s');
        document.getElementById('rain').textContent = data.rain ? `${data.rain['1h']} mm (1h)` : 'No rain in last hour';
        document.getElementById('snow').textContent = data.snow ? `${data.snow['1h']} mm (1h)` : 'No snow in last hour';
        document.getElementById('feels_like').textContent = fmt(data.main.feels_like, '°C');
        document.getElementById('pressure').textContent = data.main.pressure ? `${data.main.pressure} hPa` : '—';
        document.getElementById('visibility').textContent = data.visibility ? `${Math.round(data.visibility/1000)} km` : '—';

        // set icon
        const iconCode = data.weather?.[0]?.icon;
        const iconEl = document.getElementById('icon');
        if(iconCode){
            iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}" width="64" height="64">`;
        } else {
            iconEl.textContent = '';
        }

            // adapt units in display text
            const tempUnit = units === 'metric' ? '°C' : '°F';
            const speedUnit = units === 'metric' ? ' m/s' : ' mph';
            // replace existing unit suffixes set earlier
            document.getElementById('temperature').textContent = fmt(data.main.temp, tempUnit);
            document.getElementById('feels_like').textContent = fmt(data.main.feels_like, tempUnit);
            document.getElementById('windSpeed').textContent = fmt(data.wind.speed, speedUnit);

            messageEl.textContent = '';

            // persist last searched city
            try{ localStorage.setItem('lastCity', data.name); }catch(e){/*ignore*/}

            // automatically load forecast for coordinates
            if(data.coord && data.coord.lat && data.coord.lon){
                getForecast(data.coord.lat, data.coord.lon);
            }
    }catch(err){
        console.error(err);
        messageEl.textContent = err.message || 'Unable to fetch weather';
    }
}

// wire events: button and Enter key
document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('btn');
    const city = document.getElementById('city');

    btn.addEventListener('click', getWeather);
    city.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') getWeather(); });
});

// wire unit toggle and restore last city
document.addEventListener('DOMContentLoaded', ()=>{
    const ut = document.getElementById('unit-toggle');
    const cityInput = document.getElementById('city');
    // set initial toggle state
    ut.textContent = units === 'metric' ? '°C' : '°F';
    ut.setAttribute('aria-pressed', units === 'imperial' ? 'true' : 'false');
    ut.addEventListener('click', ()=>{
        units = units === 'metric' ? 'imperial' : 'metric';
        ut.textContent = units === 'metric' ? '°C' : '°F';
        ut.setAttribute('aria-pressed', units === 'imperial' ? 'true' : 'false');
        // refetch with new units if there's a city
        const c = cityInput.value.trim() || localStorage.getItem('lastCity');
        if(c) {
            cityInput.value = c;
            getWeather();
        }
    });

    // restore last searched city if present
    try{
        const last = localStorage.getItem('lastCity');
        if(last){
            cityInput.value = last;
            // automatically fetch on load
            getWeather();
        }
    }catch(e){/* ignore localStorage errors */}
});

// Fetch 5-day forecast using coordinates and render 5 daily cards
async function getForecast(lat, lon){
    if(!lat || !lon) return;
    const forecastEl = document.getElementById('forecast');
    // show loader
    forecastEl.innerHTML = '<div class="loader" role="status" aria-label="Loading forecast"></div>';
    try{
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        const res = await fetch(url);
        if(!res.ok) throw new Error('Forecast not available');
        const data = await res.json();

        // Group the 3-hourly data into days and pick the midday (12:00:00) item for each day
        const byDay = {};
        data.list.forEach(item => {
            const day = item.dt_txt.split(' ')[0];
            if(!byDay[day]) byDay[day] = [];
            byDay[day].push(item);
        });

        const days = Object.keys(byDay).slice(0,6); // sometimes includes today; we'll choose up to 6 and then pick 5
        const cards = [];
        for(let d of days){
            // prefer 12:00 entry, otherwise middle one
            const entries = byDay[d];
            let pick = entries.find(e => e.dt_txt.endsWith('12:00:00')) || entries[Math.floor(entries.length/2)];
            if(pick) cards.push(pick);
            if(cards.length >= 5) break;
        }

        // render cards
        forecastEl.innerHTML = '';
        cards.forEach(c => {
            const date = new Date(c.dt * 1000);
            const dayName = date.toLocaleDateString(undefined, {weekday:'short'});
            const icon = c.weather?.[0]?.icon;
            const temp = Math.round(c.main.temp);
            const tempUnit = units === 'metric' ? '°C' : '°F';

            const card = document.createElement('div');
            card.className = 'forecast-card';
                    card.innerHTML = `
                <div class="day">${dayName}</div>
                <div class="icon">${icon ? `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${c.weather[0].description}">` : ''}</div>
                <div class="desc">${c.weather?.[0]?.main ?? ''}</div>
                        <div class="temp">${temp}${tempUnit}</div>
            `;
            forecastEl.appendChild(card);
        });

    }catch(err){
        console.error(err);
    }
}

