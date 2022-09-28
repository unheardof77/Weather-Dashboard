const $futureArea = document.getElementById(`futureForecast`);
let historyList = document.getElementById(`historyList`);
const searchButton = document.querySelector(`button`);
let arrayOfHistory = JSON.parse(localStorage.getItem(`searchHistory`)) || []
function getCoordinates(){
    cityName = document.querySelector(`input`).value.trim().replaceAll(` `, `-`);
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
            getServerData(data);
        })
};

function historyButtonClick(event){
    let clickedButton = event.target.getAttribute(`indexNumber`);
    cityName = event.target.textContent;
    
    displayData(clickedButton);
};

function getServerData(data){
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
            recentSearch = [{
                currentTemp: `${data.current.temp}`,
                currentWind: `${data.current.wind_speed}`,
                humidity: `${data.current.humidity}`,
                currentUvIndex: `${data.current.uvi}`,
                currentImage:`${data.current.weather[0].icon}`
            },]
            for(i=0;i < 5 ;i++){
                recentFutureSearch = {
                    dailyImg: `${data.daily[i].weather[0].icon}`,
                    dailyTemp: `${data.daily[i].temp.max}`,
                    dailyWind: `${data.daily[i].wind_speed}`,
                    dailyHumidity: `${data.daily[i].humidity}`
                };
                recentSearch.push(recentFutureSearch);
            };
            let firstSearch = arrayOfHistory.length  || 0
            arrayOfHistory.push(recentSearch);
            localStorage.setItem(`searchHistory`, JSON.stringify(arrayOfHistory));
            storedHistory = JSON.parse(localStorage.getItem(`searchHistory`));
            console.log(storedHistory)
            displayData(firstSearch);
        })
};

function displayData(searchIndex){
    let $temp = document.getElementById(`temp`);
    let $wind = document.getElementById(`wind`);
    let $humidity= document.getElementById(`humidity`);
    let $uvIndex= document.getElementById(`uvIndex`);
    let $titleH2 = document.getElementById(`cityTitle`);
    let $currentImg = document.getElementById(`img`);
    let $button = document.createElement(`button`);
    $button.classList.add(`button`);
    $button.setAttribute(`indexNumber`, searchIndex);
    $button.textContent = cityName;
    $currentImg.src = `./Assets/images/${storedHistory[searchIndex][0].currentImage}.png`;
    $temp.textContent = storedHistory[searchIndex][0].currentTemp;
    $wind.textContent = storedHistory[searchIndex][0].currentWind;
    $humidity.textContent= storedHistory[searchIndex][0].humidity;
    $uvIndex.textContent = storedHistory[searchIndex][0].currentUvIndex;
    $titleH2.textContent = cityName;
    historyList.appendChild($button);
    $futureArea.innerHTML = ""
    for(i=1;i < 6 ;i++){
        createFutureData(searchIndex, i);
    };
};

function createFutureData(searchIndex, i){
    const $futureSection = document.createElement(`section`);
    const $h3 = document.createElement(`h3`);
    const $ul = document.createElement(`ul`);
    const $tempLi = document.createElement(`li`);
    const $windLi = document.createElement(`li`);
    const $humidityLi = document.createElement(`li`);
    const $dailyImg = document.createElement(`img`);
    //const UTC = data.daily[i].dt;
    //const $date = moment(UTC).local();
    //$h3.textContent = $date
    $dailyImg.src = `./Assets/images/${storedHistory[searchIndex][i].dailyImg}.png`;
    $tempLi.textContent =`Temp:${storedHistory[searchIndex][i].dailyTemp}F`;
    $windLi.textContent =`Wind Speed:${storedHistory[searchIndex][i].dailyWind}MPH`;
    $humidityLi.textContent =`Humidity:${storedHistory[searchIndex][i].dailyHumidity}%`;
    $futureSection.appendChild($h3);
    $futureSection.appendChild($dailyImg);
    $futureSection.appendChild($ul);
    $ul.appendChild($tempLi);
    $ul.appendChild($windLi);
    $ul.appendChild($humidityLi);
    $futureArea.appendChild($futureSection);
};




historyList.addEventListener(`click`, historyButtonClick)
searchButton.addEventListener(`click`, getCoordinates);