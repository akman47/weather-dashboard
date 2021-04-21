var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var buttonContainerEl = document.querySelector("btn-container");
var currentCityEl = document.querySelector("#current-city");
var currentForecastEl = document.querySelector("forecast-current");
var futureForecastEl = document.querySelector("forecast-future");

var searchCity="Houston";
var searchHistory = [];

// collect user city input
var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();
    searchCity = city;
    console.log(city);
    //getCoordinates(city);
}

// get longitude and latitude coordinates from city
var getCoordinates = function() {
    var geocodeApiUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=4kON7aMII2plUGxg7GnPOJVn3RGuO6qs&location=Washington,DC";
    fetch(geocodeApiUrl).then(function(response) {
        if (response.ok) {
            // if successful, obtain coordinates from response and send to getWeather
            response.json().then(function(data) {
                var location = data.results[0].locations[0].latLng;
                getWeatherInfo(location);
            })
        }
        else {
            console.log("Couldn't get city coordinates from mapquest API: ", response.text);
        }
    });

}

// get weather data from one call API weather
var getWeatherInfo = function(coordindates) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordindates.lat + "&lon=" + coordindates.lng +"&exclude=minutely,hourly&units=imperial&appid=cf3edf2b74dd1233c21759f00579a76f";

    // make a get request to url
    fetch(weatherApiUrl).then(function(response) {
        // if successful, obtain weather information and send to displayWeather
        if(response.ok) {
            response.json().then(function(data) {
                displayWeather(data);
            })
        }
        else {
            console.log("Couldn't get weather data from openweathermap API: " + response.text);
        }
    });
}

// display current weather
var displayWeather = function(weatherData) {
    
    //today's date
    var date = moment().format("M/DD/YYYY");

    // display city name
    currentCityEl.textContent = searchCity + " " + "("+ date +")";

    // display current weather
    var currentTempEl = document.querySelector("#current-temp");
    var temp = weatherData.current.temp;
    currentTempEl.textContent = "Temp: " + temp + "°F";

    var currentWindEl = document.querySelector("#current-wind");
    var wind = weatherData.current.wind_speed;
    currentWindEl.textContent = "Wind: " + wind + " MPH";

    var currentHumidityEl = document.querySelector("#current-humidity");
    var humidity = weatherData.current.humidity;
    currentHumidityEl.textContent = "Humidity: " + humidity + " %";
    
    var currentUviEl = document.querySelector("#current-uvi");
    var uvIndex = weatherData.current.uvi;
    currentUviEl.textContent = "UV Index: " + uvIndex;

}

// assign corresponding background color to uv index

// assign corresponding weather icon to forecasts
var uvIndexColor = function(uvIndex) {
}

// display 5 day forecast
var displayForecast = function(forecastData) {
    var temp = "";
    var wind = "";
    var humidity = "";

}

// save city searches to localStorage
var saveLocation = function(location) {

}

// load city searches from local Storage

userFormEl.addEventListener("submit",formSubmitHandler);