const apiKey = "92f3eedec937c748b53e26647938c5cb";

/* =========================
   SEARCH FUNCTION
========================= */
function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  fetchWeatherByCity(city);
}

/* =========================
   FETCH WEATHER BY CITY
========================= */
async function fetchWeatherByCity(city) {
  showLoading();

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert("City not found");
      hideLoading();
      return;
    }

    displayWeather(weatherData);
    fetchForecastByCity(city);

  } catch (error) {
    alert("Error fetching weather data");
  }

  hideLoading();
}

/* =========================
   FETCH FORECAST BY CITY
========================= */
async function fetchForecastByCity(city) {
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );

  const forecastData = await forecastResponse.json();
  displayForecast(forecastData);
}

/* =========================
   DISPLAY CURRENT WEATHER
========================= */
function displayWeather(data) {
  document.getElementById("weatherCard").classList.remove("hidden");

  document.getElementById("cityName").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").textContent =
    `Temperature: ${data.main.temp}°C`;

  document.getElementById("description").textContent =
    data.weather[0].description;

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

/* =========================
   DISPLAY 3-DAY FORECAST
========================= */
function displayForecast(data) {
  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  document.getElementById("forecastTitle").classList.remove("hidden");
  container.classList.remove("hidden");

  for (let i = 0; i < 24; i += 8) {
    const item = data.list[i];

    const div = document.createElement("div");
    div.className = "forecast-day";

    div.innerHTML = `
      <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
      <p>${item.main.temp}°C</p>
    `;

    container.appendChild(div);
  }
}

/* =========================
   GET CURRENT LOCATION
========================= */
function getCurrentLocation() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      showLoading();

      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);

      } catch (error) {
        alert("Error fetching location weather");
      }

      hideLoading();

    });

  } else {
    alert("Geolocation not supported by your browser");
  }
}

/* =========================
   LOADING HELPERS
========================= */
function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}
