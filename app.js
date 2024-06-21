const cityEntered = document.querySelector(".search-bar-input");
const searchIcon = document.querySelector(".search-icon");
const locationIcon = document.querySelector(".current-location");
const cardDiv = document.querySelector(".card");
const forecastDiv = document.querySelector(".forecast-container");
const getMoreDetailsVar = document.querySelector("#more-details");

const API_KEY = "1f68c36d6f9904008cc8e05cc7868a16";

const changeIcon = (weatherItem) => {
  let icon = "./images/1.png";

  if (weatherItem.weather[0].icon === "01d") {
    icon = "./images/1d.png";
    console.log(icon);
  } else if (weatherItem.weather[0].icon === "01n") {
    icon = "./images/1n.png";
  } else if (weatherItem.weather[0].icon === "02d") {
    icon = "./images/2d.png";
  } else if (weatherItem.weather[0].icon === "02n") {
    icon = "./images/2n.png";
  } else if (
    weatherItem.weather[0].icon === "03d" ||
    weatherItem.weather[0].icon === "03n"
  ) {
    icon = "./images/3.png";
  } else if (
    weatherItem.weather[0].icon === "04d" ||
    weatherItem.weather[0].icon === "04n"
  ) {
    icon = "./images/4.png";
  } else if (
    weatherItem.weather[0].icon === "09d" ||
    weatherItem.weather[0].icon === "09n"
  ) {
    icon = "./images/9.png";
  } else if (
    weatherItem.weather[0].icon === "10d" ||
    weatherItem.weather[0].icon === "10n"
  ) {
    icon = "./images/10.png";
  } else if (
    weatherItem.weather[0].icon === "11d" ||
    weatherItem.weather[0].icon === "11n"
  ) {
    icon = "./images/11.png";
  } else if (
    weatherItem.weather[0].icon === "13d" ||
    weatherItem.weather[0].icon === "13n"
  ) {
    icon = "./images/13.png";
  } else if (
    weatherItem.weather[0].icon === "50d" ||
    weatherItem.weather[0].icon === "50n"
  ) {
    icon = "./images/50.png";
  }

  return icon;
};

const createWeatherCard = (cityName, state, weatherItem, index) => {
  const icon = changeIcon(weatherItem);
  if (index === 0) {
    return `
          <img src=${icon} alt="weather image" />
          <p class="h1">${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
          <div class="box">
            <img src="./images/weather-type.svg" alt="weather type" />
            <p class="weather-type">${weatherItem.weather[0].description}</p>
          </div>
          <div class="horizontal-line"></div>
          <div class="box city">
            <img class="marker" src="./images/marker.svg" alt="marker" />
            <span>${cityName + ", " + state}</span>
          </div>
          <div class="outer">
            <div class="inner1">
              <div class="box">
                <img src="./images/wind.svg" alt="wind" />
                <p><span>wind: </span>${weatherItem.wind.speed} M/S</p>
              </div>
              <div class="box">
                <img src="./images/pressure.svg" alt="pressure" />
                <p><span>pressure: </span>${weatherItem.main.pressure} psi</p>
              </div>
            </div>
            <div class="inner2">
              <div class="box">
                <img src="./images/humidity.svg" alt="humidity" />
                <p><span>humidity: </span>${weatherItem.main.humidity}%</p>
              </div>
              <div class="box">
                <img src="./images/visibility.svg" alt="visibility" />
                <p><span>visibility: </span>${
                  weatherItem.visibility / 1000
                } km</p>
              </div>
            </div>
          </div>
        `;
  } else {
    // HTML for the other five day forecast card

    return ` <div class="wrapper">
            <div class="wrapper-container">
              <p>${weatherItem.dt_txt.split(" ")[0]}</p>
              <div class="horizontal-line"></div>
              <img src=${icon} alt="weather" />
            </div>
            <p class="h3">${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
            <div class="box">
              <img src="./images/wind.svg" alt="wind" />
              <p><span>wind: </span>${weatherItem.wind.speed} M/S</p>
            </div>
            <div class="box">
              <img src="./images/pressure.svg" alt="pressure" />
              <p><span>pressure: </span>${weatherItem.main.pressure} psi</p>
            </div>
            <div class="box">
              <img src="./images/humidity.svg" alt="humidity" />
              <p><span>humidity: </span>${weatherItem.main.humidity}%</p>
            </div>
            <div class="box">
              <img src="./images/visibility.svg" alt="visibility" />
              <p><span>visibility: </span>${
                weatherItem.visibility / 1000
              } km</p>
            </div>
          </div>`;
  }
};

const getMoreDetails = (weatherItem) => {
  return `<div class="right-container">
          <p>Day</p>
          <p class="active">
            The sky will be mostly ${
              weatherItem.weather[0].description
            }. The high will be ${(weatherItem.main.temp - 273.15).toFixed(
    2
  )}°C.
          </p>
          <p>Night</p>
          <p class="active">
            Except mainly ${
              weatherItem.weather[0].main
            } sky. The low will be ${(
    weatherItem.main.temp_min - 273.15
  ).toFixed(2)}°C.
          </p>
        </div>`;
};

const getWeatherDetails = (cityName, state, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      // Filter the forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Clearing previous weather data
      cityEntered.value = "";
      cardDiv.innerHTML = "";
      forecastDiv.innerHTML = "";
      getMoreDetailsVar.innerHTML = "";

      // Creating weather cards and adding them to the DOM
      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, state, weatherItem, index);
        const html2 = getMoreDetails(weatherItem);
        if (index === 0) {
          cardDiv.insertAdjacentHTML("beforeend", html);
          getMoreDetailsVar.insertAdjacentHTML("beforeend", html2);
        } else {
          forecastDiv.insertAdjacentHTML("beforeend", html);
        }
      });
    })
    .catch(() => {
      alert("An error occurred while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityName = cityEntered.value.trim();
  if (cityName === "") return;
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  // Get entered city coordinates (latitude, longitude, and name) from the API response
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name, state } = data[0];
      getWeatherDetails(name, state, lat, lon);
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!");
    });
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // Get coordinates of user location
      // Get city name from coordinates using reverse geocoding API
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occurred while fetching the city name!");
        });
    },
    (error) => {
      // Show alert if user denied the location permission
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
};

locationIcon.addEventListener("click", getUserCoordinates);
searchIcon.addEventListener("click", getCityCoordinates);
cityEntered.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
