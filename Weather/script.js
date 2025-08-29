const apiKey = "5a8167a617848da1772063ce8a8b4268";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const weatherForm = document.getElementById("weatherForm");

const voiceBtn = document.getElementById("voiceBtn");

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.style.background = "#d1e7ff"; // highlight when listening
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchBox.value = transcript;
        checkWeather(transcript);  // auto-search
    };

    recognition.onerror = (event) => {
        alert("Voice recognition error: " + event.error);
    };

    recognition.onend = () => {
        voiceBtn.style.background = "#ebfffc"; // reset button color
    };
} else {
    voiceBtn.style.display = "none"; // hide if not supported
}

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload
    if (searchBox.value.trim() !== "") {
        checkWeather(searchBox.value);
    }
});


async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        var data = await response.json();
        // console.log(data);

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "clouds.png";
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "clear(1).png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "rain(1).png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "mist(1).png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }

}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
})