apiKey = "f177e49c6d9cd10785b89ad462d712c1";
cityName = "Austin";
lat = 0;
lon = 0;
fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
UVApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
cardNumber = 2;
var currentDay = moment().format('l');

$("#searchBtn").click(getWeather);
$(".searchCities").click(getWeatherPresets);

pageLoad();
getWeather();

function pageLoad(){
    var lastSearch = localStorage.getItem("lastSearch");
    if (lastSearch){
        cityName = lastSearch;
    }else{

    };
};

function getWeatherPresets (){

    cardNumber = 2;
    cityName = $(this).attr("data");
    fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    currentWeather()
    fiveDayWeather()

};

function getWeather(){

    cardNumber = 2;

    if ($("#searchInput").val()){
        cityName = $("#searchInput").val();
        localStorage.setItem("lastSearch", cityName);
    }else{
        
    };
    fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    currentWeather()
    fiveDayWeather()

};

function currentWeather() {

    var city = "";
    var temp = 0;
    var humid = 0;
    var wind = 0;
    var UV = 0;

    $.ajax({
        method: "GET",
        url: currentWeatherApiUrl
    }).then(function(response){
        console.log(response);
        city = response.name;
        temp = response.main.temp;
        humid = response.main.humidity;
        wind = response.wind.speed;
        weather = response.weather[0].description;
        icon = response.weather[0].icon;
        unixTime = response.dt;
        lat = response.coord.lat;
        lon = response.coord.lon;
        UVApiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

        $("#cityName").text(city + " (" + currentDay + ")");
        $("#cityTemp").text("Temperature: " + temp + " °F");
        $("#cityHumid").text("Humidity: " + humid + " %");
        $("#cityWind").text("Wind Speed: " + wind + " MPH");
        $("#cityWeather").text("Current Weather: " + weather)
        $("#cityIcon").attr("src", "http://openweathermap.org/img/w/" + icon + ".png");

        $.ajax({
            method: "GET",
            url: UVApiUrl
        }).then(function(response){
            UV = response.value;
            $("#UVColor").text(UV);
            if(UV < 3){
                $("#UVColor").attr("class", "bg-success");
            }else if(UV < 6 && UV > 2){
                $("#UVColor").attr("class", "bg-warning");
            }else{
                $("#UVColor").attr("class", "bg-danger");
            };

        });

    });
    

};

function fiveDayWeather(){

    $(".card-body").empty();

    $.ajax({
        method: "GET",
        url: fiveDayApiUrl
    }).then(function(response){

        for (i=0; i < 5; i++){

            var date = response.list[i].dt_txt;
            var fiveDayTemp = response.list[i].main.temp;
            var fiveDayHumid = response.list[i].humidity;

        };

        $(".card-body").each(function(){

            var date = response.list[cardNumber].dt_txt;
            var fiveDayTemp = response.list[cardNumber].main.temp;
            var fiveDayHumid = response.list[cardNumber].main.humidity;
            var fiveDayWeather = response.list[cardNumber].weather[0].description;
            var fiveDayIcon = response.list[cardNumber].weather[0].icon

            date = date.slice(0,10);

            var newDate = $("<h3>");
            var newBR = $("<br>");
            var newTemp = $("<p>");
            var newHumid = $("<p>");
            var newWeather = $("<p>");
            var newIcon = $("<img>")

            newDate.text(date);
            newTemp.text("Temperature: " + fiveDayTemp);
            newHumid.text("Humidity: " + fiveDayHumid);
            newWeather.text("Weather Forecast: " + fiveDayWeather);
            newIcon.attr("src", "http://openweathermap.org/img/w/" + fiveDayIcon + ".png");

            $(this).append(newDate, newIcon, newBR, newTemp, newHumid, newWeather);

            cardNumber = cardNumber + 8;

        });

    });

};