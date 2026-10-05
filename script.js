// ⚠️ ဒီနေရာမှာ သင့်ရဲ့ OpenWeatherMap API Key ကို ထည့်ပါ
const apiKey = "97553606d975b2483cb5605badb3f867";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");

// ရှာဖွေမယ့် Function
async function getWeather() {
    const city = cityInput.value.trim();
    
    if (city === "") {
        alert("မြို့နာမည် အရင်ရိုက်ထည့်ပါ!");
        return;
    }

    // API URL (units=metric က အပူချိန်ကို ဆယ်လ်ဆီးယပ်စ်နဲ့ ပြပေးပါတယ်)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        weatherInfo.innerHTML = `<p class="default-text">ရှာဖွေနေပါတယ်...</p>`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("မြို့နာမည် မှားနေပါတယ် သို့မဟုတ် ရှာမတွေ့ပါဘူး။");
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        weatherInfo.innerHTML = `<p class="default-text" style="color: #ff7e5f;">${error.message}</p>`;
    }
}

// ရလာတဲ့ ဒေတာတွေကို မျက်နှာပြင်ပေါ်မှာ ပြသမယ့် Function
function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherInfo.innerHTML = `
        <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
        <h1 class="temp">${Math.round(main.temp)}°C</h1>
        <h2 class="city">${name}</h2>
        <p class="description">${weather[0].description}</p>
        
        <div class="details">
            <div class="col">
                <span>စိုထိုင်းဆ</span>
                <p>${main.humidity}%</p>
            </div>
            <div class="col">
                <span>လေတိုက်နှုန်း</span>
                <p>${wind.speed} km/h</p>
            </div>
            <div class="col">
                <span>ခံစားရမှု</span>
                <p>${Math.round(main.feels_like)}°C</p>
            </div>
        </div>
    `;
}

// ခလုတ်နှိပ်ရင် အလုပ်လုပ်မယ်
searchBtn.addEventListener("click", getWeather);

// Enter နှိပ်ရင်လည်း အလုပ်လုပ်မယ်
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});