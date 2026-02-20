const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');

// API Configuration
const API_KEY = 'd7aa93a06672a9120716d142a5026396'; // Replace with your API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) getWeatherByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) getWeatherByCity(city);
    }
});

locationBtn.addEventListener('click', getCurrentLocation);

// Get Weather by City
async function getWeatherByCity(city) {
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError();
    }
}

// Get Current Location Weather
function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            () => {
                alert('Unable to get your location');
                hideLoading();
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Get Weather by Coordinates
async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) throw new Error('Unable to fetch weather');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError();
    }
}

// Display Weather Data
function displayWeather(data) {
    // Location and Date
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Temperature
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    document.getElementById('tempRange').textContent = `H:${Math.round(data.main.temp_max)}° L:${Math.round(data.main.temp_min)}°`;
    
    // Weather Icon
    const weatherIcon = getWeatherEmoji(data.weather[0].main);
    document.getElementById('weatherIcon').textContent = weatherIcon;
    
    // Details
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
    
    // Sun Times
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);
    
    // Show weather display
    hideLoading();
    weatherDisplay.classList.remove('hidden');
    errorMsg.classList.add('hidden');
}

// Get Weather Emoji
function getWeatherEmoji(weather) {
    const emojis = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '🌫️',
        'Haze': '🌫️',
        'Fog': '🌫️'
    };
    return emojis[weather] || '🌤️';
}

// Format Time
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Show Loading
function showLoading() {
    loading.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    errorMsg.classList.add('hidden');
}

// Hide Loading
function hideLoading() {
    loading.classList.add('hidden');
}

// Show Error
function showError() {
    hideLoading();
    weatherDisplay.classList.add('hidden');
    errorMsg.classList.remove('hidden');
}

// Initialize with default city
window.addEventListener('load', () => {
    getWeatherByCity('London');
});
