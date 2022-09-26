const searchButton = document.querySelector(`button`);
function getCoordinates(){
    const cityName = document.querySelector(`input`).value.trim().replaceAll(` `, `-`);
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
            displayFutureInfo(data);
        })
};

function displayFutureInfo(data){
    const $futureArea = document.getElementById(`futureForecast`);
    let $temp = document.getElementById(`temp`)
    let $wind = document.getElementById(`wind`)
    let $humidity= document.getElementById(`humidity`)
    let $uvIndex= document.getElementById(`uvIndex`)
    let $cityName = document.getElementById(`cityName`)
    $temp.textContent = data.current.temp;
    $wind.textContent = data.current.wind_speed;
    $humidity.textContent= data.current.humidity;
    $uvIndex.textContent = data.current.uvi;
    $cityName.textContent = document.querySelector(`input`).value.trim();
    for(i=0;i < 5 ;i++){
        const $futureSection = document.createElement(`section`);
        const $h3 = document.createElement(`h3`);
        const $ul = document.createElement(`ul`);
        const $tempLi = document.createElement(`li`);
        const $windLi = document.createElement(`li`);
        const $humidityLi = document.createElement(`li`);
        $h3.textContent = data.daily[i].dt;
        $tempLi.textContent =`Temp:` + data.daily[i].temp.max + `F`
        $windLi.textContent =`Wind Speed:` + data.daily[i].wind_speed + `MPH`
        $humidityLi.textContent =`Humidity:` + data.daily[i].humidity + `%`
        $futureSection.appendChild($h3);
        $futureSection.appendChild($ul);
        $ul.appendChild($tempLi);
        $ul.appendChild($windLi);
        $ul.appendChild($humidityLi);
        $futureArea.appendChild($futureSection);
    };
};




searchButton.addEventListener(`click`, getCoordinates);