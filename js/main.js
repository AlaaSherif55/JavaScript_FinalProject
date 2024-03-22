 var countryName;
let countryInfo=document.getElementById("countryInfo");
let Facts=document.getElementById("Facts");
let MapsInfo=document.getElementById("MapsInfo");
let newsInfo=document.getElementById("newsInfo");
let EmailInfo=document.getElementById("EmailInfo");
async function fetchCountries() {
    try {

        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');

        if (response.ok) {
            data = await response.json();
            return data;

        } else {
            console.error('Error: Unable to fetch data.');
        }
    } catch (error) {
        console.error('Exception:', error.message);
    }
}

async function fetchCountry(countryName) {
    try {

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (response.ok) {
            data = await response.json();
            return data;

        } else {
            console.error('Error: Unable to fetch data.');
        }
    } catch (error) {
        console.error('Exception:', error.message);
    }
}

async function fetchnews(countrySymbol) {
    try {
        const apiKey = 'f140e577001e44ef8d1837ac1e3721e4'; // Replace with your actual API key
        const apiUrl = `https://api.worldnewsapi.com/search-news?api-key=${apiKey}&source-countries=${countrySymbol}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error(`Error: Unable to fetch data. Status: ${response.status}`);
            return null; 
        }
    } catch (error) {
        console.error('Exception:', error.message);
        return null; 
    }
}
function imageError(img) {
    img.src = 'https://www.tea-tron.com/antorodriguez/blog/wp-content/uploads/2016/04/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png'; // Replace with your own default image path
}
function formatDate(inputDate) {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-GB', options).toUpperCase();
}
// Here will use the data of countries from api
async function getConutries() {
    let countriesData = await fetchCountries();
    console.log(countriesData);
    // Show countries in select elemnet
    let optgroup = document.getElementById("showCountriesOptrgroup");// <option>Egypt</option>
    countriesData.forEach(country => {
        optgroup.innerHTML +=
            `
        <option>${country.name.common}</option>
        
        `
    });

    // Add action listener to select element

    let selectElement = document.getElementById("showCountriesSelect");
    selectElement.addEventListener('change', async function (event) {
        const selectedCountryName = event.target.value;
        // Get country from fun fetch country by name
        let selectedCountry = await fetchCountry(selectedCountryName);

        //get flagImg and coatImg
        let flagImg = document.getElementById("flagImg");
        let coatImg = document.getElementById("coatImg");

        //get country flags
        let countryFlagTrue = document.getElementById("countryFlagTrue");
        let countryFlagFalse = document.getElementById("countryFlagFalse");

        //get independent flags
        let independentFlagTrue = document.getElementById("independentFlagTrue");
        let independentFlagFalse = document.getElementById("independentFlagFalse");

        // fill Country Informations

        flagImg.src = selectedCountry[0].flags.png;
        coatImg.src = selectedCountry[0].coatOfArms.png;

        if (selectedCountry[0].unMember) {
            countryFlagTrue.style.display = "inline-block"
            countryFlagFalse.style.display = "none"

        } else {
            countryFlagTrue.style.display = "none"
            countryFlagFalse.style.display = "inline-block"
        }

        if (selectedCountry[0].independent) {
            independentFlagTrue.style.display = "inline-block"
            independentFlagFalse.style.display = "none"
        } else {
            independentFlagTrue.style.display = "none"
            independentFlagFalse.style.display = "inline-block"
        }

       
        //get some fact element
        let population = document.getElementById("population");
        let region = document.getElementById("region");
        let timeZone = document.getElementById("timeZone");
        let capital = document.getElementById("capital");

        // fill some facts .textContent
        population.textContent=selectedCountry[0].population.toLocaleString();
        region.textContent=selectedCountry[0].region;
        timeZone.textContent=selectedCountry[0].timezones[0];
        capital.textContent=selectedCountry[0].capital;

        // fill map for each country i selected
        
        let mapOfCountry = document.getElementById("mapOfCountry");
        const apiKey = 'AIzaSyBeFwbxwlie8EhSrN2Npe8rBhbNf5cXSnI';
        countryName = selectedCountryName;
         // Construct the embed URL directly with the country name
        const embedUrl = `https://www.google.com/maps?q=${countryName}&hl=en&z=6&output=embed`;
        mapOfCountry.src = embedUrl;
  
 
       // to get news for each country 
       let countrySymbol=selectedCountry[0].cca2;
       // console.log()
       //console.log(`this is the country symbols ${countrySymbol}`);
       let fetchedData= await fetchnews(countrySymbol);//return object have key knews 
       let news=fetchedData.news;
       //fill div of news
       let newsDiv=document.getElementById("newsDiv");
       newsDiv.innerHTML="";
        news.forEach(newelement => {
            newsDiv.innerHTML +=
       `
        <div class="col-md-3 col-sm-6">
            <div class="news-box">
                <div class="new-thumb"> <span class="cat c1">News</span> <img src=${newelement.image} alt="" onerror="imageError(this)"  width="500" height="300"> </div>
                     <div class="new-txt">
                        <ul class="news-meta">
                            <li>${formatDate(newelement.publish_date)}</li>
                        </ul>
                        <h6><a href="index.html#">${newelement.title.slice(0,50)}</a></h6>
                        <p> ${newelement.text.slice(0,101)} </p>
                     </div>
                <div class="news-box-f"> <img src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png" alt=""> ${newelement.author.split(",")[0]} <a href="index.html#"><i class="fas fa-arrow-right"></i></a> </div>
             </div>
        </div>
      `
      
        });
    // Display the hidden section
        countryInfo.style.display = 'block';
        Facts.style.display = 'block';
        MapsInfo.style.display = 'block';
        newsInfo.style.display = 'block';
        EmailInfo.style.display = 'block';
    });
  

}
emailjs.init('OJxkmb0ERz6tX2hmy'); 
// When press on button See On Google Maps
function openGoogleMaps() {
    const Url =`https://www.google.com/maps?q=${countryName}&hl=en&z=6`;
    //window.open(Url, '_blank');
    window.open(Url)
}
function sendEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get your EmailJS service ID and template ID from the EmailJS dashboard
    const serviceID = 'service_qi8gttx';
    const templateID = 'template_iz7q8lr';

    // Get the form data
    const formData = {
        from_name: document.getElementById("fullName").value,
        user_email: document.getElementById("email_id").value,
        message: document.getElementById("message").value
    };
    
    let message=document.getElementById("sucessMessage");
    // Send the email using EmailJS
    emailjs.send(serviceID, templateID, formData)
        .then(response => {
            console.log('Email sent successfully:', response);
            //alert('Message sent successfully!');
            message.style.display = 'block';
            document.getElementById('contactForm').reset(); // Clear the form
        })
        .catch(error => {
            console.error('Email failed to send:', error);
            alert('Error sending message. Please try again later.');
        });
}
getConutries();