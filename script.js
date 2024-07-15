// Replace 'your_api_key' with your actual OpenWeatherMap API key
const apiKey = '25a90b651cb19274cc5a8de2f39501a5';

function getWeather() {
    const city = document.getElementById('city').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })

        .then(data => {
            

            // Extract relevant data from the API response
            const location = data.name;
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const rain = data.rain ? data.rain['1h'] : 0;
            const snow = data.snow ? data.snow['1h'] : 0;
            const windSpeed = data.wind.speed;
            
     
      
   
   
  
            // Update the HTML elements with the fetched data
            document.getElementById('location').textContent = `Location: ${location}`;
            document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
            document.getElementById('description').textContent = `Description: ${description}`;
            document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
            document.getElementById('rain').textContent = rain ? `Rain (last hour): ${rain} mm` : `No rain in the last hour`;
            document.getElementById('snow').textContent = snow ? `Snow (last hour): ${snow} mm` : `No snow in the last hour`;
            document.getElementById('windSpeed').textContent = `Wind Speed: ${windSpeed} m/s`;
          
            
      
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
