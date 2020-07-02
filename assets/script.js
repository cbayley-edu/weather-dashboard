// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
var cityName;//= "Woodbury,NJ";


// var searchCities = [];
// searchCities = JSON.parse(localStorage.getItem("searched-cities"));

// function submitScore(event) {
//     event.preventDefault();



    // //add event listener on click of save buttons
    // $(`#buttonSave${i}`).on("click", function() {
    //     //add to local storage - use workHoursText[i] as key
    //     localStorage.setItem(`${workHoursText[i]}`, $(`#input${i}`). val());
    // });

    // //add event listener on click of clear buttons
    // $(`#buttonClr${i}`).on("click", function() {
    //     //clear text from input and remove from localstorage
    //     $(`#input${i}`).val("");
    //     localStorage.removeItem(`${workHoursText[i]}`, $(`#input${i}`). val());
    // });




// if (searchCities) {
//     searchCities = `${searchCities},${highScoreDivEl.value}`;  //replace divEl with input box text
// } else {
//     searchCities = `${highScoreDivEl.value}`;
// }





//localStorage.setItem("searched-cities", JSON.stringify(searchCities));



function getWeatherData(searchFor) {
    if (!searchFor) {
        searchFor = "Philadelphia, PA";
    }
    //set variables, build url for first API call
    var apiKey = "52618b568e2d61b0b27171c59411a439";
    var queryURLGetLatLong = `https://api.openweathermap.org/data/2.5/weather?q=${searchFor},us&appid=${apiKey}`;

    $.ajax({
        url: queryURLGetLatLong,
        method: "GET" 
    })
        .then(function(responseLatLong) {

            //set variables from response
            var getLat = responseLatLong.coord.lat;
            var getLong = responseLatLong.coord.lon;
            var getCityName = responseLatLong.name;
            //use variables from response to build URL
            var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${getLat}&lon=${getLong}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`

            $.ajax({
                url: queryURL,
                method: "GET" 
            })
                .then(function(response) {

                    //set variables from response
                    var getCurrentDate = (moment(response.current.dt*1000).format("dddd MM.DD.YYYY"));
                    var getCurrentTemp = response.current.temp.toFixed(1);
                    var getHumidity = Math.round(response.current.humidity);
                    var getWindSpeed = response.current.wind_speed.toFixed(1);
                    var getUVIndex = response.current.uvi.toFixed(2);
                    var getCurrentWeather = response.current.weather[0].main;
                    var getCurrentWeatherIcon = `http://openweathermap.org/img/wn/${response.current.weather[0].icon}.png`;

                    //set and create current weather elements in HTML using data from response
                    $("#city-date").html(`${getCityName} (${getCurrentDate})`)
                    var currentWeatherIcon = $("<img>").attr("src", getCurrentWeatherIcon);
                    currentWeatherIcon.appendTo("#city-date");
                    $("#current-weather").html(`${getCurrentWeather}`);
                    $("#current-temp").html(`Temperature: <strong>${getCurrentTemp} °F</strong>`);
                    $("#current-humidity").html(`Humidity: <strong>${getHumidity}%</strong>`);
                    $("#wind-speed").html(`Wind Speed: <strong>${getWindSpeed} MPH</strong>`);
                    //highlight UV Index according to chart found online
                    if (getUVIndex < 3) {
                        $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexLow12");    
                    } else
                    if (getUVIndex >= 3 && getUVIndex < 6 ) {
                        $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexModerate35");    
                    } else
                    if (getUVIndex >= 6 && getUVIndex < 8 ) {
                        $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexHigh67");    
                    } else
                    if (getUVIndex >= 8 && getUVIndex < 11 ) {
                        $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexVeryHigh810");    
                    } else
                    if (getUVIndex >= 11) {
                        $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexExtreme11");    
                    } 
                    
                    //set shortcut variable for five day data
                    var fiveDay = response.daily;

                    //loop through response to get next 5 days' data
                    for (var i = 1; i < 6; i++) {
                        //set variables for each day 
                        var fiveDayDate = moment(fiveDay[i].dt*1000).format("ddd MM.DD");
                        var fiveDayTemp = fiveDay[i].temp.day.toFixed(2);
                        var fiveDayTempLow = fiveDay[i].temp.min.toFixed(2);
                        var fiveDayTempHigh = fiveDay[i].temp.max.toFixed(2);
                        var fiveDayTempFeelsLike = fiveDay[i].feels_like.day.toFixed(2);
                        var fiveDayHumidity = Math.round(fiveDay[i].humidity);
                        var fiveDayWeather = fiveDay[i].weather[0].main;
                        var fiveDayWeatherIcon = `http://openweathermap.org/img/wn/${fiveDay[i].weather[0].icon}.png`;

                        //set html elements using 5 day data
                        //ids in HTML have been set accordingly to use i in loop
                        $(`#title${i}`).html(fiveDayDate);
                        var dailyWeatherIcon = $("<img>").attr("src", fiveDayWeatherIcon);
                        dailyWeatherIcon.appendTo(`#title${i}`);
                        $(`#weather${i}`).html(`<strong>${fiveDayWeather}</strong>`);
                        $(`#temp${i}`).html(`Temp: <strong>${fiveDayTemp} °F</strong>`);
                        $(`#temp-feels-like${i}`).html(`Feels Like: <strong>${fiveDayTempFeelsLike} °F</strong>`);
                        $(`#temp-max${i}`).html(`High: <strong>${fiveDayTempHigh} °F</strong>`);
                        $(`#temp-min${i}`).html(`Low: <strong>${fiveDayTempLow} °F</strong>`);
                        $(`#humidity${i}`).html(`Humidity: <strong>${fiveDayHumidity}%</strong>`);

                    }  //end loop for daily weather
            });  //end then returning response
    });  //end then returning responseLatLong
}

getWeatherData(cityName);