const $futureArea = document.getElementById(`futureForecast`);
let historyList = document.getElementById(`historyList`);
const searchButton = document.querySelector(`button`);
let arrayOfHistory = JSON.parse(localStorage.getItem(`searchHistory`)) || []
//Function getCoordinates takes the input value and returns the coordinates of it, then it runs the get server data and passes along its data.
function getCoordinates(){
    cityName = document.querySelector(`input`).value.trim().replaceAll(` `, `-`);
    const cordAPI = `https://api.openweathermap.org/geo/1.0/direct?q=`+cityName+`&limit=1&appid=327e492de8c1e347e7f779666d577345`;
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
//Function historyButtonClick finds the indexNumber attribute of the button clicked and passes it too the display data function.  It also sets the city name equal to the clicked button's text content.
function historyButtonClick(event){
    let clickedButton = event.target.getAttribute(`indexNumber`);
    cityName = event.target.textContent;
    
    displayData(clickedButton, false);
};
//Function makeButton creates the search history buttons.  It takes in their search index and stores it as a data-attribute to be used for later.
function makeButton(searchIndex){
    console.log(searchIndex)
    let $button = document.createElement(`button`);
    $button.classList.add(`button`);
    $button.setAttribute(`indexNumber`, searchIndex);
    $button.textContent = storedHistory[searchIndex][0].cityName;
    historyList.appendChild($button);
}

function pageLoad(){
    storedHistory = JSON.parse(localStorage.getItem(`searchHistory`));
    for (i=0; i < storedHistory.length; i++){
        makeButton(i);
    }
};

//Function getServerData takes the data from getCoordinates and traverses to the lat and lon.  Then it takes that information and uses it too find weather data from the coordinates location.
function getServerData(data){
    const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=`+data[0].lat+`&lon=`+data[0].lon+`&appid=327e492de8c1e347e7f779666d577345&units=imperial`;
    fetch(weatherURL)
        .then(function(response){
            if(response.ok){
                return response.json();
            }else{
                errorPage(response.statusText);
            }
        })
        .then(function(data){
            recentSearch = [{
                cityName: `${cityName}`,
                currentTemp: `${data.current.temp}`,
                currentWind: `${data.current.wind_speed}`,
                humidity: `${data.current.humidity}`,
                currentUvIndex: `${data.current.uvi}`,
                currentImage:`${data.current.weather[0].icon}`
            }];
            for(i=0;i < 5 ;i++){
                recentFutureSearch = {
                    dailyDate: `${data.daily[i].dt}`,
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
            displayData(firstSearch, true);
        })
};
//Function displayData sets the text content for the current weather and creates a button for the search history as well as triggers the createFutureData function.
function displayData(searchIndex, bool){
    let $temp = document.getElementById(`temp`);
    let $wind = document.getElementById(`wind`);
    let $humidity= document.getElementById(`humidity`);
    let $uvIndex= document.getElementById(`uvIndex`);
    let $titleH2 = document.getElementById(`cityTitle`);
    let $currentImg = document.getElementById(`img`);
    $currentImg.src = `./Assets/images/${storedHistory[searchIndex][0].currentImage}.png`;
    $temp.textContent = storedHistory[searchIndex][0].currentTemp;
    $wind.textContent = storedHistory[searchIndex][0].currentWind;
    $humidity.textContent= storedHistory[searchIndex][0].humidity;
    $uvIndex.textContent = storedHistory[searchIndex][0].currentUvIndex;
    $titleH2.textContent = cityName;
    $uvIndex.removeAttribute(`class`)
    if(storedHistory[searchIndex][0].currentUvIndex >= 6 ){
        $uvIndex.classList.add(`bg-danger`);
    }else if(storedHistory[searchIndex][0].currentUvIndex >= 3){
        $uvIndex.classList.add(`bg-warning`);
    }else{
        $uvIndex.classList.add(`bg-success`);
    };
    $futureArea.innerHTML = "";
    if(bool){
        makeButton(searchIndex);
    };
    for(i=1;i < 6 ;i++){
        createFutureData(searchIndex, i);
    };
};
//Function createFutureData creates the dom elements for the 5 day forecast and appends them to the future area.
function createFutureData(searchIndex, i){
    const $futureSection = document.createElement(`section`);
    const $h3 = document.createElement(`h3`);
    const $ul = document.createElement(`ul`);
    const $tempLi = document.createElement(`li`);
    const $windLi = document.createElement(`li`);
    const $humidityLi = document.createElement(`li`);
    const $dailyImg = document.createElement(`img`);
    $h3.textContent = moment().utc(storedHistory[searchIndex][i].dailyDate).format(`L`)
    $dailyImg.src = `./Assets/images/${storedHistory[searchIndex][i].dailyImg}.png`;
    $tempLi.textContent =`Temp:${storedHistory[searchIndex][i].dailyTemp}F`;
    $windLi.textContent =`Wind Speed:${storedHistory[searchIndex][i].dailyWind}MPH`;
    $humidityLi.textContent =`Humidity:${storedHistory[searchIndex][i].dailyHumidity}%`;
    $futureSection.classList.add(`col-2,`, `bg-primary`, `border`, `border-dark`, `rounded`)
    $futureSection.appendChild($h3);
    $futureSection.appendChild($dailyImg);
    $futureSection.appendChild($ul);
    $ul.appendChild($tempLi);
    $ul.appendChild($windLi);
    $ul.appendChild($humidityLi);
    $futureArea.appendChild($futureSection);
};
//listens for a click on the history buttons then runs historyButtonClick.
historyList.addEventListener(`click`, historyButtonClick);
// listens for click on the search button then runs getCoordinates.
searchButton.addEventListener(`click`, getCoordinates);

if(JSON.parse(localStorage.getItem(`searchHistory`)) !== null){
    pageLoad()
    
};