// ⚠️ သင့် API Key ကို ဒီမှာ ထည့်ပါ
const apiKey = "97553606d975b2483cb5605badb3f867";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");
const searchResults = document.getElementById("search-results");

// ၁။ မြို့နာမည် ရှာဖွေတဲ့ Function (Geocoding API သုံးမယ်)
async function searchCity() {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("မြို့နာမည် အရင်ရိုက်ထည့်ပါ!");
        return;
    }

    // မြို့စာရင်း ရှာဖွေရန် API
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    try {
        weatherInfo.innerHTML = `<p class="default-text">ရှာဖွေနေပါတယ်...</p>`;
        searchResults.style.display = "none";
        
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (data.length === 0) {
            weatherInfo.innerHTML = `<p class="default-text" style="color: #ff7e5f;">မြို့နာမည် ရှာမတွေ့ပါ။ အင်္ဂလိပ်လို ပြောင်းရိုက်ကြည့်ပါ။</p>`;
            return;
        }

        displayResultsList(data);

    } catch (error) {
        weatherInfo.innerHTML = `<p class="default-text" style="color: #ff7e5f;">အင်တာနက် ချိတ်ဆက်မှု စစ်ဆေးပါ။</p>`;
    }
}

// ၂။ ရှာလို့ရလာတဲ့ မြို့စာရင်းကို ပြမယ့် Function
function displayResultsList(cities) {
    searchResults.innerHTML = "";
    searchResults.style.display = "block";
    weatherInfo.innerHTML = ""; // အရင်ရလဒ်တွေ ရှင်းမယ်

    cities.forEach(city => {
        const item = document.createElement("div");
        item.classList.add("result-item");
        // နိုင်ငံနဲ့ မြို့နာမည် ပြမယ် (ဥပမာ - Yangon, MM)
        item.innerText = `${city.name}, ${city.country}`;
        
        // မြို့ကို နှိပ်လိုက်ရင် ရာသီဥတု ဆွဲယူမယ်
        item.onclick = () => {
            getWeatherByCoords(city.lat, city.lon, city.name);
            searchResults.style.display = "none"; // ရွေးပြီးရင် စာရင်းဖျောက်မယ်
            cityInput.value = `${city.name}, ${city.country}`; // Input box မှာ ပြန်ဖြည့်မယ်
        };
        searchResults.appendChild(item);
    });
}

// ၃။ ရွေးလိုက်တဲ့ မြို့ရဲ့ ရာသီဥတုကို ဆွဲယူမယ့် Function
async function getWeatherByCoords(lat, lon, displayName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        weatherInfo.innerHTML = `<p class="default-text">ရာသီဥတု ရယူနေပါတယ်...</p>`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("ရာသီဥတု ဒေတာ ရယူ၍ မရပါ။");

        const data = await response.json();
        displayWeather(data, displayName);

    } catch (error) {
        weatherInfo.innerHTML = `<p class="default-text" style="color: #ff7e5f;">${error.message}</p>`;
    }
}

// ၄။ ရာသီဥတု ဒေတာကို မျက်နှာပြင်ပေါ်မှာ ပြသမယ့် Function
function displayWeather(data, displayName) {
    const { main, weather, wind } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherInfo.innerHTML = `
        <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
        <h1 class="temp">${Math.round(main.temp)}°C</h1>
        <h2 class="city">${displayName}</h2>
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
searchBtn.addEventListener("click", searchCity);

// Enter နှိပ်ရင်လည်း အလုပ်လုပ်မယ်
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchCity();
    }
});