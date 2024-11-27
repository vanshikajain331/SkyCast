const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]")
const userCont=document.querySelector(".weather-container");

const grantAccess=document.querySelector(".grant-location-container");
const grantAccessButton=document.querySelector(".btn");

const userSearchForm=document.querySelector("[data-searchForm]");
const userInp=document.querySelector("[data-userInput]");

const loadingContainer=document.querySelector(".loading-container");

const userWeather=document.querySelector(".user-info-container");

const cityName=document.querySelector("[data-cityName]");
const countryIcon=document.querySelector("[data-countryIcon]");
const weatherDesc=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-weatherIcon]");
const temp=document.querySelector("[data-temp]");

const windspeed=document.querySelector("[data-windspped]");
const humidity=document.querySelector("[data-humidity]");
const clouds=document.querySelector("[data-clouds]");

//initially variables need
const API_KEY="6c1a4114e73ba15e981ab958e04c2116";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();


//switching
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");

        //usertab ko invisible, clickedtab ko visible
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!userSearchForm.classList.contains("active")){
            userWeather.classList.remove("active");
            grantAccess.classList.remove("active");

            userSearchForm.classList.add("active");
        }
        else{
            //visible weather tab
            userSearchForm.classList.remove("active");
            userWeather.classList.remove("active");

            //apni location ki weather display
            // for Coordinates, if we have saved there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=>{
    //pass the input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});

//check if coordinates are already present in session storage(local)
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //display grant access container
        grantAccess.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//fetch according to latitude and longitude
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    //make grantaccess invisible
    grantAccess.classList.remove("active");

    //loader visible
    loadingContainer.classList.add("active");

    // API call 
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        //loader remove
        loadingContainer.classList.remove("active");
        userWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingContainer.classList.remove("active");
        //missing
    }
}

function renderWeatherInfo(weatherInfo){
    // fetch the element
    // already fetched above 

    // fetch the weatherInfo object values and display in UI  
    // use Optional chaining operator(?) if there is no value then it doesnot 
    // throw an error, it will say undefined
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://api.openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    clouds.innerText = weatherInfo?.clouds?.all;
}

//use geoLocation API
function getLocation(){
    //support available
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geolocation support available
        const x = document.createElement("p");
        x.innerText="Geolocation is not supported by this browser.";

        //DO ANY ALERT POPUP
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude ,
        lon: position.coords.longitude,
    }
    //store in session storage
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click", getLocation);

//search weather 
userSearchForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    //cityName
    if(userInp.value==="")
    return;

    fetchSearchWeatherInfo(userInp.value);
});

//fetch according to city name
async function fetchSearchWeatherInfo(city){

    // loading visible
    loadingContainer.classList.add("active");
    userWeather.classList.remove("active");
    grantAccess.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();

        //loading invisible
        loadingContainer.classList.remove("active");
        userWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingContainer.classList.remove("active");
        // missing
    }
}