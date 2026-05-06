  //./js/apis/geolocationApi.js
// ==================== Part 2: Geolocation API Implementation ===============

export function location() {
  const status = document.querySelector("#dashboardStatus");
  // Sets the locations of the zoo features.
  const zooLocations = {
    animalExhibits: [
      { name: "Hippo Exhibit", lat: 44.523, lng: -89.574 },
      { name: "Eagle Exhibit", lat: 44.524, lng: -89.575 },
      { name: "Snake Exhibit", lat: 44.525, lng: -89.576 }
    ],
    visitorKiosks: [
      { name: "Front Gate Kiosk", lat: 44.522, lng: -89.573 }
    ],
    emergencyServices: [
      { name: "First Aid Station", lat: 44.521, lng: -89.572 }
    ],
    maintenanceStations: [
      { name: "Maintenance Shed", lat: 44.526, lng: -89.576 }
    ]
  };
  // If the browser doesnt support navigator return error.
  if (!navigator.geolocation) {
    if (status) {
      status.textContent = "Geolocation is not supported by this browser.";
    }

    console.error("Geolocation is not supported.");
    return;
  }

  if (status) {
    status.textContent = "Checking zoo location tracking...";
  }
  // Gets the current position of user.
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (status) {
        status.textContent =
          "Location tracking active for exhibits, kiosks, emergency services, and maintenance stations.";
      }
      
      console.log("Visitor/User Location:", userLocation);
      console.log("Zoo Feature Locations:", zooLocations);
    },
    (error) => {
      if (status) {
        status.textContent = "Unable to get location. Check browser permission.";
      }

      console.error("Location tracking error:", error.message);
    },
    {
      maximumAge: 0,
      enableHighAccuracy: false,
      timeout: 15000
    }
  );
}
  // tests if offline or online logs to consle.
  export const testOfflineStatus = () => {
  if (navigator.onLine) {
    console.log("Browser is online");
  } else {
    console.log("Browser is offline");
  }
};
