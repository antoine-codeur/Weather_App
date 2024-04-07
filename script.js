document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '8998525009e06055a3bebc2fd8475631';
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const city = 'Clermont-Ferrand'; // Modification pour Clermont-Ferrand
    const units = 'metric'; // Les unités : metric pour Celsius

    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateWeather(data);
        })
        .catch(error => {
            console.error('Could not fetch the data:', error);
        });
});
function updateWeather(data) {
    console.log(data);
    const appElement = document.querySelector('#app');
    const iconElement = document.getElementById('weather-icon');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('weather-description');
    
    const weatherId = data.weather[0].id; // L'ID de la condition météorologique

    // Mappage des ID météo aux icônes et couleurs de fond
    const weatherStyles = {
        'thunderstorm': {
            icon: '<spline-viewer url="https://prod.spline.design/zMGTH7mNeNmYJUsr/scene.splinecode" height="300"></spline-viewer>',
            background: '#505050' // Gris foncé pour contraster avec les icônes d'orage
        },
        'drizzle': {
            icon: '<spline-viewer url="your_spline_url_for_drizzle"></spline-viewer>',
            background: '#88C0D0' // Bleu clair pour la bruine
        },
        'rain': {
            icon: '<spline-viewer url="https://prod.spline.design/uJg9h3B73-OacStH/scene.splinecode" height="300"></spline-viewer>',
            background: '#4C566A' // Gris bleuté pour la pluie
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
        }
    };

    // Sélection de l'icône et du style de fond basée sur l'ID météo
    let styleKey;
    if (weatherId >= 200 && weatherId <= 232) {
        styleKey = 'thunderstorm';
    } else if (weatherId >= 300 && weatherId <= 321) {
        styleKey = 'drizzle';
    } else if (weatherId >= 500 && weatherId <= 531) {
        styleKey = 'rain';
    } else if (weatherId >= 600 && weatherId <= 622) {
        styleKey = 'snow';
    } else if (weatherId >= 701 && weatherId <= 781) {
        styleKey = 'atmosphere';
    } else if (weatherId === 800) {
        styleKey = 'clear';
    }

    const weatherStyle = weatherStyles[styleKey];

    // Mise à jour de l'icône météo et du fond
    if (weatherStyle) {
        iconElement.innerHTML = weatherStyle.icon;
        appElement.style.backgroundColor = weatherStyle.background; // Ajuster la couleur de fond de l'app
    }

    // Mise à jour de la température
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    const weatherDescription = data.weather[0].description;
    descriptionElement.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1); // Capitalize the first letter

}
