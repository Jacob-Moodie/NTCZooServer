  //./js/apis/animalApi.js

  // Urls for animal api
  export const animalApiURL = "https://api.api-ninjas.com/v1/animals?name=lion";
  export const failanimalApiURL = "http://api.api-ninjas.com/v1/animals?name=lion";

  const animalApi = document.querySelector("#animalApiData");
  const animalApiName = document.querySelector("#animalApiName");

    
  const whitelist = [
    "api.coinlayer.com",
    "api.api-ninjas.com"
  ];

  export function createAnimalRequest(url) {
    const parsedURL = new URL(url);

    const animalApi = document.querySelector("#animalApiData");
    const animalApiName = document.querySelector("#animalApiName");

    // HTTPS verification
    if (parsedURL.protocol !== "https:") {
   //   console.table([{ test: "Protocol Check", result: "Blocked", reason: "Not HTTPS", url: url }]);
      animalApiName.textContent = "Request blocked: HTTPS required";
      return;
    }

    // Whitelist validation
    if (!whitelist.includes(parsedURL.hostname)) {
      console.table([{ test: "Whitelist Check", result: "Blocked", reason: "Not allowed host", url: url }]);
      animalApiName.textContent = "Couldn't load animal values";
      return;
    }

    // Security logging
  //  console.table([
 ////   ]);

    // Fetch with cors and secure cookie handling.
    fetch(url, {
      mode: "cors",       
      credentials: "omit",
      headers: {
      "X-Api-Key": "2fbDlQw2L6DU70vFM0ja8DHHaS9o2OQvgTpgbuw6"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
      //  console.table(data);
        const animalApi = document.querySelector("#animalApiData");
        const animalApiName = document.querySelector("#animalApiName");
        animalApiName.textContent = data[0].name;
        animalApi.textContent = `Top speed: ${data[0].characteristics.top_speed} Lifespan: ${data[0].characteristics.lifespan} Weight: ${data[0].characteristics.weight}`;
      })
      .catch((error) => {
     //   console.error(error);
        const animalApi = document.querySelector("#animalApiData");
  const animalApiName = document.querySelector("#animalApiName");
        animalApiName.textContent = "Could not load animal data"; 
      });
  }

