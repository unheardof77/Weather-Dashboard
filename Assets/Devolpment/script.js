let historyList = document.getElementById(`historyList`);
const searchButton = document.querySelector(`button`);

function getCoordinates(){
    cityName = document.querySelector(`input`).value.trim().replaceAll(` `, `-`);
    console.log(cityName);
    const cordAPI = `http://api.openweathermap.org/geo/1.0/direct?q=`+cityName+`&limit=1&appid=327e492de8c1e347e7f779666d577345`;
    fetch(cordAPI)
        .then(function(response){
            if(response.ok){
                return response.json();
                }else{
                    errorPage(response.statusText);
                };
            })
        .then(function(data){
            getFutureInfo(data);
        })
};

function historyButtonClick(event){
    let clickedButton = event.target.getAttribute(`data-history`);
};

function getFutureInfo(data){
    const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=`+data[0].lat+`&lon=`+data[0].lon+`&appid=327e492de8c1e347e7f779666d577345&units=imperial`;
    fetch(weatherURL)
        .then(function(response){
            if(response.ok){
                return response.json();
            }else{
                errorPage(response.statusText)
            }
        })
        .then(function(data){
            displayData(data);
        })
};

function createFutureData(data){
    const $futureArea = document.getElementById(`futureForecast`);
    const $futureSection = document.createElement(`section`);
    const $h3 = document.createElement(`h3`);
    const $ul = document.createElement(`ul`);
    const $tempLi = document.createElement(`li`);
    const $windLi = document.createElement(`li`);
    const $humidityLi = document.createElement(`li`);
    const $dailyImg = document.createElement(`img`);
    const UTC = data.daily[i].dt;
    const $date = moment(UTC).local();
    $dailyImg.src = `./Assets/images/${data.daily[i].weather[0].icon}.png`
    $h3.textContent = $date
    $tempLi.textContent =`Temp:` + data.daily[i].temp.max + `F`
    $windLi.textContent =`Wind Speed:` + data.daily[i].wind_speed + `MPH`
    $humidityLi.textContent =`Humidity:` + data.daily[i].humidity + `%`
    $futureSection.appendChild($h3);
    $futureSection.appendChild($dailyImg);
    $futureSection.appendChild($ul);
    $ul.appendChild($tempLi);
    $ul.appendChild($windLi);
    $ul.appendChild($humidityLi);
    $futureArea.appendChild($futureSection);

};

function displayData(data){
    let $temp = document.getElementById(`temp`);
    let $wind = document.getElementById(`wind`);
    let $humidity= document.getElementById(`humidity`);
    let $uvIndex= document.getElementById(`uvIndex`);
    let $titleH2 = document.getElementById(`cityTitle`);
    let $main = document.getElementById(`mainStats`);
    let currentImg = document.createElement(`img`);
    let currentIcon = data.current.weather[0].icon;
    currentImg.src = `./Assets/images/${currentIcon}.png`;
    $main.appendChild(currentImg);
    $temp.textContent = data.current.temp;
    $wind.textContent = data.current.wind_speed;
    $humidity.textContent= data.current.humidity;
    $uvIndex.textContent = data.current.uvi;
    $titleH2.textContent = cityName;
    for(i=0;i < 5 ;i++){
        createFutureData(data);
    };
};



historyList.addEventListener(`click`, historyButtonClick)
searchButton.addEventListener(`click`, getCoordinates);