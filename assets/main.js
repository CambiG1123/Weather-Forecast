const apiKey = "79d5a678dfb20521cd3b46d53869b19f"
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
const searchBtn =document.getElementById('citySearch')
const cityInput = document.getElementById('cityInput')
const currentTemp = document.getElementById('currentCityTemp')
const currentWind = document.getElementById('currentCityWind')
const currentHumidity = document.getElementById('currentCityHumidity')
const fiveDay = document.getElementById('fiveDay')
const currentCity = document.getElementById("currentCityH2")
const cityList = document.getElementById('searchList')
const searchForm = document.getElementById('searchForm')
const clearContent = () => {
  fiveDay.innerHTML = '';
};

const fetchWeatherById = (cityId) => {
  return fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`)
  .then(response => response.json())
}

const fetchWeatherData = (city) => {
  return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
      .then(response => response.json());
};

const displayCityInfo = (data) => {
  const cityName = data.city.name;
  const cityId = data.city.id 
  const existingCityItem = document.getElementById(cityId);
  if (existingCityItem){
    currentCity.innerText = cityName
    
  } else {


  cityList.innerHTML += `<a href="#" class="w-100 list-group-item border-secondary hover list-group-item-action" id="${data.city.id}">${cityName}</a>`;
  currentCity.innerText = cityName;
  }
};

const displayWeatherInfo = (data) => {
  const temperature = data.list[0].main.temp;
  const wind = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;

  const fahrTemp = (temperature - 273.15) * 9/5 + 32;
  const roundTemp = Math.round(fahrTemp * 10) / 10;

  currentTemp.innerText = `Temp: ${roundTemp}F`;
  currentWind.innerText = `Wind: ${wind} mph`;
  currentHumidity.innerText = `Humidity: ${humidity}%`;
};

const displayFiveDayForecast = (data) => {
  const diffDateArray = [data.list[5], data.list[14], data.list[23], data.list[30], data.list[38]];
  
  diffDateArray.forEach(element => {
      const dateObj = new Date(element.dt_txt);
      const formattedDate = dateObj.toISOString().split('T')[0];
      const fahrTemp = (element.main.temp - 273.15) * 9/5 + 32;
      const roundTemp = Math.round(fahrTemp * 10) / 10;
      const weatherIcon = element.weather[0].icon;
      const weatherIconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;

      fiveDay.innerHTML += `<div class="m-2 p-2 col-sm-2">
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">${formattedDate}</h5>
                  <img src="${weatherIconUrl}" alt="Weather Icon">
                  <p id="cardText" class="card-text">Temp: ${roundTemp}F <br> Wind: ${element.wind.speed} mph <br> Humidity: ${element.main.humidity}%</p>
              </div>
          </div>
      </div>`;
  });
};

const searchButtonClickHandler = () => {
  event.preventDefault();
  const city = cityInput.value;

  clearContent();

  fetchWeatherData(city)
      .then(data => {
          displayCityInfo(data);
          displayWeatherInfo(data);
          displayFiveDayForecast(data);
      })
      .catch(error => {
          console.error(error);
      });
};
const cityListClickHandler = (event) => {
  event.stopPropagation()
  const cityId = event.target.id
  clearContent()
  fetchWeatherById(cityId)
  .then(data => {
    displayCityInfo(data);
    displayWeatherInfo(data);
    displayFiveDayForecast(data);
})
.catch(error => {
    console.error(error);
});
}
cityList.addEventListener('click', cityListClickHandler)

searchBtn.addEventListener('click', searchButtonClickHandler);


