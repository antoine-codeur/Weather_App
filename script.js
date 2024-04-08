let citySelector;
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loading').style.display = 'flex';
    const apiKey = '8998525009e06055a3bebc2fd8475631';
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const units = 'metric'; // Les unités : metric pour Celsius
    let defaultCity = 'Paris'; // Ville par défaut
    citySelector = document.getElementById('city-selector');
    initializeCitySelector(); // Initialisation avec des villes par défaut
    citySelector.addEventListener('change', function() {
        const selectedCity = this.value;
        if (selectedCity) {
            const url = buildUrl(selectedCity);
            fetchWeather(url, selectedCity);
        }
    });
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = buildUrl(null, lat, lon);
            // La fonction fetchWeather est appelée avec isGeoLocation à true
            fetchWeather(url, null, true);
        }, function(error) {
            console.error('Geolocation error:', error);
            const url = buildUrl(defaultCity);
            fetchWeather(url, defaultCity);
        });
    } else {
        const url = buildUrl(defaultCity);
        fetchWeather(url, defaultCity);  
    }
});
function buildUrl(city, lat, lon) {
    const apiKey = '8998525009e06055a3bebc2fd8475631';
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const units = 'metric';
    if(lat && lon) {
        return `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    } else {
        return `${baseUrl}?q=${city}&appid=${apiKey}&units=${units}`;
    }
}
function fetchWeather(url, city, isGeoLocation = false) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const cityName = data.name; // Assurez-vous d'utiliser le nom de ville correct depuis la réponse
            updateWeather(data, cityName);
            if (isGeoLocation) {
                // L'ajout conditionnel basé sur la géolocalisation
                addCityToSelector(cityName, true);
            }
        })
        .catch(error => {
            console.error('Could not fetch the data:', error);
        });
}
function updateWeather(data, cityName) {
    console.log(data);
    const appElement = document.querySelector('#app');
    const iconElement = document.getElementById('weather-icon');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('weather-description');
    const city = cityName || data.name; // La ville actuelle   
    // Trouve et sélectionne la bonne option dans le sélecteur
    const options = citySelector.options;
    for(let i = 0; i < options.length; i++) {
        if(options[i].value === city) {
            citySelector.selectedIndex = i;
            break; // Arrête la boucle une fois la ville trouvée et sélectionnée
        }
    }    
    if(citySelector.selectedIndex === -1) {
        const newOption = new Option(city, city, true, true);
        citySelector.add(newOption);
        citySelector.value = city; // Sélectionne la nouvelle option ajoutée
    }
    const weatherId = data.weather[0].id; // L'ID de la condition météorologique
    // Mappage des ID météo aux icônes et couleurs de fond
    const weatherStyles = {
        'thunderstorm': {
            icon: '<spline-viewer url="https://prod.spline.design/zMGTH7mNeNmYJUsr/scene.splinecode" height="300"></spline-viewer>',
            background: '#505050' // Gris foncé pour contraster avec les icônes d'orage
        },
        'drizzle': {
            icon: '<spline-viewer url="https://prod.spline.design/uJg9h3B73-OacStH/scene.splinecode" height="300"></spline-viewer>',
            background: '#6E7F80', // Gris vert pour la bruine
        },
        'lightRain': {
            icon: '<spline-viewer url="https://prod.spline.design/uJg9h3B73-OacStH/scene.splinecode" height="300"></spline-viewer>',
            background: '#A4B0BE', // Gris bleuté plus clair pour la petite pluie
        },
        'rain': {
            icon: '<spline-viewer url="https://prod.spline.design/uJg9h3B73-OacStH/scene.splinecode" height="300"></spline-viewer>',
            background: '#4C566A', // Gris bleuté pour la pluie
        },
        'heavyRain': {
            icon: '<spline-viewer url="https://prod.spline.design/uJg9h3B73-OacStH/scene.splinecode" height="300"></spline-viewer>',
            background: '#2C3E50', // Bleu foncé pour les pluies intenses
        },
        'snow': {
            icon: '<spline-viewer url="your_spline_url_for_snow"></spline-viewer>',
            background: '#D8DEE9' // Bleu très clair pour la neige, assurant un bon contraste avec l'icône
        },
        'atmosphere': {
            icon: '<spline-viewer url="your_spline_url_for_atmosphere"></spline-viewer>',
            background: '#ECEFF4' // Gris clair pour les conditions atmosphériques, favorisant la lisibilité
        },
        'clear': {
            icon: '<spline-viewer url="https://prod.spline.design/c8Ajq4y4CYPGMudc/scene.splinecode" height="300"></spline-viewer>',
            background: '#EBCB8B' // Jaune doux pour un temps clair et ensoleillé
        },
        'cloudySun': {
            icon: '<spline-viewer url="https://prod.spline.design/e-wT6A-KpmjHWBy6/scene.splinecode" height="300"></spline-viewer>',
            background: '#EBCB8B' // Jaune doux pour un temps clair et ensoleillé
        },
        'cloudy': {
            icon: '<spline-viewer url="https://prod.spline.design/VJ7J0l6VNYD4Vnvj/scene.splinecode" height="300"></spline-viewer>',
            background: '#6E7F80' // Gris vert
        }
    };
    // Sélection de l'icône et du style de fond basée sur l'ID météo
    let styleKey;
    if (weatherId >= 200 && weatherId <= 232) {
        styleKey = 'thunderstorm';
    } else if (weatherId >= 300 && weatherId <= 321) {
        styleKey = 'drizzle';
    } else if (weatherId == 500) { // Pluie légère
        styleKey = 'lightRain';
    } else if (weatherId > 500 && weatherId <= 504) { // Pluie modérée à intense
        styleKey = 'heavyRain';
    } else if (weatherId >= 505 && weatherId <= 531) { // Pluie très intense à extrême
        styleKey = 'rain';
    } else if (weatherId >= 600 && weatherId <= 622) {
        styleKey = 'snow';
    } else if (weatherId >= 701 && weatherId <= 781) {
        styleKey = 'atmosphere';
    } else if (weatherId === 800) {
        styleKey = 'clear';
    } else if (weatherId === 801 || weatherId === 802) {
        styleKey = 'cloudySun';
    } else if (weatherId === 803 || weatherId === 804) {
        styleKey = 'cloudy';
    }
    const weatherStyle = weatherStyles[styleKey];
    document.querySelector('h1').textContent = `${city}`;
    // Mise à jour de l'icône météo et du fond
    if (weatherStyle) {
        iconElement.innerHTML = weatherStyle.icon;
        appElement.style.backgroundColor = weatherStyle.background; // Ajuster la couleur de fond de l'app
    }
    // Mise à jour de la température
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    const weatherDescription = data.weather[0].description;
    descriptionElement.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1); // Capitalize the first letter
    document.getElementById('loading').style.display = 'none';
}
function addCityToSelector(cityName, isGeoLocation = false) {
    if (cityName && !Array.from(citySelector.options).some(option => option.value === cityName)) {
        const newOption = new Option(cityName, cityName, true, true);
        if (isGeoLocation) {
            citySelector.prepend(newOption); // Ajoute l'option au début si géolocalisation
            citySelector.value = cityName; // Sélectionnez cette ville
        } else {
            citySelector.add(newOption);
        }
    }
}
function initializeCitySelector() {
    // Liste initiale des villes
    const cities = [
        'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 
        'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille', 
        'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 
        'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 
        'Clermont-Ferrand', 'Le Mans', 'Aix-en-Provence', 'Brest', 'Limoges', 
        'Tours', 'Amiens', 'Perpignan', 'Metz', 'Besançon'
    ];
        citySelector.innerHTML = ''; // Nettoyage du sélecteur
    cities.forEach(city => addCityToSelector(city));
}