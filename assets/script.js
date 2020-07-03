$(document).ready(function(){
    var cityName;
    var getSearchCity = JSON.parse(localStorage.getItem("citySearches"));

    if (getSearchCity) {
        getSearchCity = getSearchCity.split(";");
        cityName = getSearchCity[0];
        getWeatherData(cityName);
    } else {
        $(".five-day-heading").hide();
        $(".five-day-detail").hide();
    }

    displayCities();

    $("#searchBtn").on("click", function(event){
        event.preventDefault();
        $(".five-day-heading").show();
        $(".five-day-detail").show();
        cityName = $("#city-search").val().trim();

        getWeatherData(cityName);

        var getSearchCities = [];
        getSearchCities = JSON.parse(localStorage.getItem("citySearches"));

        if (getSearchCities && !getSearchCities.includes(cityName)) {
            getSearchCities = `${cityName};${getSearchCities}`;
        } else {
            getSearchCities = cityName;
        }

        localStorage.setItem("citySearches", JSON.stringify(getSearchCities));

        $("#search-buttons").empty();
        displayCities();
    });

    function displayCities() {
        var searchButtons = JSON.parse(localStorage.getItem("citySearches"));
        
        if (searchButtons) {
            searchButtons = searchButtons.split(";");
        }

        $.each(searchButtons, function(i) {
            var newButton = $("<button>").attr("type", "button").attr("class", "btn btn-outline-secondary btn-block city-button").attr("id", searchButtons[i]).html(searchButtons[i]);
            newButton.appendTo("#search-buttons");
        });

        $(".city-button").on("click", function(event){
            event.preventDefault();
            console.log(this.id);
            
            getWeatherData(this.id);
            $("#city-search").val(this.id);

        });
    }


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
                        $("#uv-index-label").html(`UV Index: `);
                        
                        //highlight UV Index according to chart found online
                        if (getUVIndex < 3) {
                            $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexLow12").appendTo("#uv-index");    
                        } else
                        if (getUVIndex >= 3 && getUVIndex < 6 ) {
                            $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexModerate35").appendTo("#uv-index");    
                        } else
                        if (getUVIndex >= 6 && getUVIndex < 8 ) {
                            $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexHigh67").appendTo("#uv-index");    
                        } else
                        if (getUVIndex >= 8 && getUVIndex < 11 ) {
                            $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexVeryHigh810");  
                        } else
                        if (getUVIndex >= 11) {
                            $("#uv-index-number").html(`<strong>${getUVIndex}</strong>`).attr("class", "uvIndexExtreme11").appendTo("#uv-index");    
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
})