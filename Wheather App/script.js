const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

const apiErrorMessage=document.querySelector("[data-apiErrorText]")
const apiErrorContainer=document.querySelector(".api-error-container");
 const apiErrorImg = document.querySelector("[data-notFoundImg]");
 const apiErrorBtn= document.querySelector("[data-apiErrorBtn]")

const API_KEY="4723b59c994da4b71e8d04cadf3160b0";
let currentTab = userTab;
currentTab.classList.add("current-tab");
// current=old
// cliked=new
getfromSessionStorage();

function switchTab(ClickedTab) {
    if(ClickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=ClickedTab;
        ClickedTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    // pass clicked tag as input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

//Check if cordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local cordinate nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loder visible
    loadingScreen.classList.add("active");
    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
 
    }
}
function renderWeatherInfo(weatherInfo){
    // Firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-WeatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    // console.log(weatherInfo)

    // fetch value from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //Show elert for no geoLocation suppport avaliable
         
    }
}
function showPosition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon:  position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

let searchInput =document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if (cityName==="") return;

    fetchSearchWeatherInfo(cityName);

});

async function fetchSearchWeatherInfo(city){
loadingScreen.classList.add("active");
grantAccessContainer.classList.remove("active");
userInfoContainer.classList.remove("active");
apiErrorContainer.classList.remove("active");

try {
    const response= await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
        throw data;
      }
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
} catch (error) {
    loadingScreen.classList.remove("active");
    apiErrorContainer.classList.add("active");
    apiErrorMessage.innerText = `${error?.message}`;
    apiErrorBtn.style.display = "none";
    
}

}

