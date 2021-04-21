var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var buttonContainerEl = document.querySelector("#btn-container");
var currentCityEl = document.querySelector("#current-city");
var currentForecastEl = document.querySelector("#forecast-current");
var futureForecastEl = document.querySelector("forecast-future");

var searchCity="";
var searchHistory = [];

// collect city input
var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();
    searchCity = city;

    if(city) {
        // geocode city
        getCoordinates(city);

        // clear form for next search
        cityInputEl.value = "";

        // save to searchHistory[]
        var updatedHistory = [];
        updatedHistory.push(city);

        for (var i = 0; i < searchHistory.length; i++) {
            if(city !== searchHistory[i]) {
                updatedHistory.push(searchHistory[i]);
            }
        }

        searchHistory = updatedHistory;
        saveLocation();
    }
    else {
        alert("Please enter a city.");
    }
}

// get longitude and latitude coordinates of city input from mapquest API
var getCoordinates = function(searchCity) {
    var geocodeApiUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=4kON7aMII2plUGxg7GnPOJVn3RGuO6qs&location="+searchCity;
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
                displayForecast(data);
            })
        }
        else {
            console.log("Couldn't get weather data from openweathermap API: " + response.text);
        }
    });
}

// display current weather
var displayWeather = function(weatherData) {
    // dynamically style the display div
    currentForecastEl.className = "forecast-current";
    
    // today's date
    var date = moment().format("M/DD/YYYY");

    // get current weather icon
    var weatherIconId = weatherData.current.weather[0].icon;
    var weatherIconDescription = weatherData.current.weather[0].description;
    var iconUrl = "http://openweathermap.org/img/wn/"+ weatherIconId +"@2x.png";
    var weatherIconEl = document.createElement("img");
    weatherIconEl.setAttribute("src", iconUrl);
    weatherIconEl.setAttribute("alt", weatherIconDescription);

    // display city name
    currentCityEl.textContent = searchCity + " " + "("+ date +") ";
    currentCityEl.appendChild(weatherIconEl);

    // display current temperature
    var currentTempEl = document.querySelector("#current-temp");
    var temp = weatherData.current.temp;
    currentTempEl.textContent = "Temp: " + temp + "°F";

    // display current wind speed
    var currentWindEl = document.querySelector("#current-wind");
    var wind = weatherData.current.wind_speed;
    currentWindEl.textContent = "Wind: " + wind + " MPH";

    // display current humidity
    var currentHumidityEl = document.querySelector("#current-humidity");
    var humidity = weatherData.current.humidity;
    currentHumidityEl.textContent = "Humidity: " + humidity + " %";
    
    // display current UV index
    var currentUviEl = document.querySelector("#current-uvi");
    var uvIndex = weatherData.current.uvi;
    currentUviEl.innerHTML = "UV Index: <span id='uvi'></span>";
    uvIndexColor(uvIndex);
}

// assign corresponding background color to uv index
var uvIndexColor = function(uvIndex) {
    var uvIndexEl = document.querySelector("#uvi");
        uvIndexEl.textContent = uvIndex;
        //uvIndexEl.className = "uvi";

    // clear previous uv index class
    //uvIndexEl.removeClass("uv-extreme uv-higher uv-high uv-moderate uv-low");

    if (uvIndex > 10) {
        uvIndexEl.className = "uv-extreme";
    }
    else if (uvIndex > 7) {
        uvIndexEl.className = "uv-higher";
    }
    else if(uvIndex > 5) {
        uvIndexEl.className = "uv-high";
    }
    else if (uvIndex > 2) {
        uvIndexEl.className = "uv-moderate";
    }
    else {
        uvIndexEl.className = "uv-low";
    }
}

// display 5 day forecast
var displayForecast = function(forecastData) {
    console.log(forecastData);

    var forecastIntroEl = document.querySelector("#forecast-intro");
    forecastIntroEl.textContent = "5-Day Forecast:";

    // iterate through the first 5 days in forecast data
    for (var i = 1; i < 6; i++) {
        var forecastDayContainerEl = document.querySelector("#card-"+i);
        forecastDayContainerEl.className = "card forecast-body";
        
        // display date
        var dateUnix = forecastData.daily[i].dt;
        var dateForecast = moment.unix(dateUnix).format("M/DD/YYYY");
        var forecastDateEl = document.querySelector("#forecast-date-"+i);
        forecastDateEl.textContent = "" + dateForecast;

        // display icon
        var iconId = forecastData.daily[i].weather[0].icon;
        var iconDescription = forecastData.daily[i].weather[0].description;
        var iconUrl = "http://openweathermap.org/img/wn/"+ iconId +"@2x.png";
        var forecastIconEl = document.querySelector("#forecast-icon-"+i);
        forecastIconEl.setAttribute("src", iconUrl);
        forecastIconEl.setAttribute("alt", iconDescription);

        // display temperature
        var tempForecastEl = document.querySelector("#forecast-temp-"+i);
        var temp = forecastData.daily[i].temp.day;
        tempForecastEl.textContent = "Temp: " + temp + "°F";

        // display wind
        var windForecastEl = document.querySelector("#forecast-wind-"+i);
        var wind = forecastData.daily[i].wind_speed;
        windForecastEl.textContent = "Wind: " + wind + " MPH";

        // display humidity
        var humidityForecastEl = document.querySelector("#forecast-humidity-"+i);
        var humidity = forecastData.daily[i].humidity;
        humidityForecastEl.textContent = "Humidity: " + humidity + " %";
    }
}

// save city search to localStorage
var saveLocation = function() {
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
}

// load city searches from local Storage
var loadLocations = function() {
    var savedLocations = localStorage.getItem("search-history");

    // checks if savedLocations is null, and if so, sets searchHistory back to empty array
    if(!savedLocations) {
        return false;
    }

    searchHistory = JSON.parse(savedLocations);

    for (var i = 0; i < searchHistory.length; i++) {
        cityButtons(searchHistory[i]);
    }
}

// create history search buttons
var cityButtons = function(city) {

    // split city/state input to get city name
    var buttonName = city.split(",")[0];

    // create history search button for city
    var buttonEl = document.createElement("button");
    buttonEl.textContent = buttonName;
    buttonEl.className = "btn btn-city";
    buttonEl.setAttribute("type", "button");
    buttonContainerEl.appendChild(buttonEl);
}

userFormEl.addEventListener("submit",formSubmitHandler);
loadLocations();