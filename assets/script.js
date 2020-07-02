// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
var cityName = "Woodbury,NJ";



function getWeatherData() {
    //set variables, build url for first API call
    var apiKey = "52618b568e2d61b0b27171c59411a439";
    var queryURLGetLatLong = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},us&appid=${apiKey}`;
    console.log(queryURLGetLatLong);

    $.ajax({
        url: queryURLGetLatLong,
        method: "GET" 
    })
        .then(function(responseLatLong) {

            console.log(responseLatLong);
            //set variables from response
            var getLat = responseLatLong.coord.lat;
            var getLong = responseLatLong.coord.lon;
            var getCityName = responseLatLong.name;
            //use variables from response to build URL
            var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${getLat}&lon=${getLong}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
            console.log(queryURL);
            console.log(getLat);
            console.log(getLong);
            console.log(getCityName);

            $.ajax({
                url: queryURL,
                method: "GET" 
            })
                .then(function(response) {

                    console.log(response);
                    //set variables from response
                    var getCurrentDate = (moment(response.current.dt*1000).format("dddd MM/DD/YYYY"));
                    var getCurrentTemp = response.current.temp.toFixed(1);
                    var getHumidity = Math.round(response.current.humidity);
                    var getWindSpeed = response.current.wind_speed.toFixed(1);
                    var getUVIndex = response.current.uvi.toFixed(2);
                    var getCurrentWeather = response.current.weather[0].main;
                    var getCurrentWeatherDesc = response.current.weather[0].description;
                    var getCurrentWeatherIcon = `http://openweathermap.org/img/wn/${response.current.weather[0].icon}.png`;
                    console.log(getCurrentDate);
                    console.log(getCurrentTemp);
                    console.log(getHumidity);
                    console.log(getWindSpeed);
                    console.log(getUVIndex);
                    console.log(getCurrentWeather);
                    console.log(getCurrentWeatherDesc);
                    console.log(getCurrentWeatherIcon);

                    //set and create current weather elements in HTML using data from response
                    $("#city-date").html(`${getCityName} (${getCurrentDate})`)
                    var currentWeatherIcon = $("<img>").attr("src", getCurrentWeatherIcon);
                    currentWeatherIcon.appendTo("#city-date");
                    $("#current-temp").html(`Temperature: ${getCurrentTemp} °F`);
                    $("#current-humidity").html(`Humidity: ${getHumidity}%`);
                    $("#wind-speed").html(`Wind Speed: ${getWindSpeed} MPH`);
                    if (getUVIndex < 3) {
                        $("#uv-index-number").html(`${getUVIndex}`).attr("class", "uvIndexLow12");    
                    } else
                    if (getUVIndex >= 3 && getUVIndex < 6 ) {
                        $("#uv-index-number").html(`${getUVIndex}`).attr("class", "uvIndexModerate35");    
                    } else
                    if (getUVIndex >= 6 && getUVIndex < 8 ) {
                        $("#uv-index-number").html(`${getUVIndex}`).attr("class", "uvIndexHigh67");    
                    } else
                    if (getUVIndex >= 8 && getUVIndex < 11 ) {
                        $("#uv-index-number").html(`${getUVIndex}`).attr("class", "uvIndexVeryHigh810");    
                    } else
                    if (getUVIndex >= 11) {
                        $("#uv-index-number").html(`${getUVIndex}`).attr("class", "uvIndexExtreme11");    
                    } 
                    
                    //set shortcut variable for five day data
                    var fiveDay = response.daily;

                    //loop through response to get next 5 days' data
                    for (var i = 1; i < 6; i++) {
                        //set variables for each day 
                        var fiveDayDate = moment(fiveDay[i].dt*1000).format("dd MM-DD");
                        var fiveDayTemp = fiveDay[i].temp.day.toFixed(2);
                        var fiveDayTempLow = fiveDay[i].temp.min.toFixed(2);
                        var fiveDayTempHigh = fiveDay[i].temp.max.toFixed(2);
                        var fiveDayTempFeelsLike = fiveDay[i].feels_like.day.toFixed(2);
                        var fiveDayHumidity = Math.round(fiveDay[i].humidity);
                        var fiveDayWeather = fiveDay[i].weather[0].main;
                        var fiveDayWeatherDesc = fiveDay[i].weather[0].description;
                        var fiveDayWeatherIcon = `http://openweathermap.org/img/wn/${fiveDay[i].weather[0].icon}.png`;
                        console.log(fiveDayDate);
                        console.log(fiveDayTemp);
                        console.log(fiveDayTempLow);
                        console.log(fiveDayTempHigh);
                        console.log(fiveDayTempFeelsLike);
                        console.log(fiveDayHumidity);
                        console.log(fiveDayWeather);
                        console.log(fiveDayWeatherDesc);
                        console.log(fiveDayWeatherIcon);
                        //set html elements using 5 day data
                        //ids in HTML have been set accordingly to use i in loop
                        $(`#title${i}`).html(fiveDayDate);
                        var dailyWeatherIcon = $("<img>").attr("src", fiveDayWeatherIcon);
                        dailyWeatherIcon.appendTo(`#title${i}`);
                        $(`#temp${i}`).html(`Temp: ${fiveDayTemp} °F`);
                        $(`#temp-feels-like${i}`).html(`Feels Like: ${fiveDayTempFeelsLike} °F`);
                        $(`#temp-min${i}`).html(`Min: ${fiveDayTempLow} °F`);
                        $(`#temp-max${i}`).html(`Max: ${fiveDayTempHigh} °F`);
                        $(`#humidity${i}`).html(`Humidity: ${fiveDayHumidity}%`);

                        // <img id="image1">
                        //         <p id="temp1" class="card-text"></p>
                        //         <p id="temp-feels-like1" class="card-text"></p>
                        //         <p id="temp-min1" class="card-text"></p>
                        //         <p id="temp-max1" class="card-text"></p>
                        //         <p id="humidity1" class="card-text"></p>
                        // $("#city-date").html(`${getCityName} (${getCurrentDate})`)
                        // var currentWeatherIcon = $("<img>").attr("src", getCurrentWeatherIcon);
                        // currentWeatherIcon.appendTo("#city-date");
                        // $("#current-temp").html(`Temperature: ${getCurrentTemp}°`);
                        // $("#current-humidity").html(`Humidity: ${getHumidity}%`);
                        // $("#wind-speed").html(`Wind Speed: ${getWindSpeed} MPH`);




                    }


        
            });
            
    });
}

getWeatherData();