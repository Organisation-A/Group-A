import React, { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapStyle } from "./MapStyle";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BuildingMap.css";
import { useUserData } from "../../utils/userDataUtils.js";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const fallbackLatitude = -26.1893;
const fallbackLongitude = 28.0271;

const BuildingMap = () => {
  // Comment line 25-28 in order to remove the ESLINT errors
  // if (process.env.NODE_ENV === 'test') {
  //   return null;
  // }

  // console.log('Key:', process.env.REACT_APP_MAP_KEY);

  const navigate = useNavigate();
  const handleProfile = () => {
    navigate("/Profile");
  };

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, userId, refetchUserData } = useUserData();
  const [rental, setRentals] = useState([]);
  const [events, setEvents] = useState([]);

  const mapRef = useRef(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [directions, setDirections] = useState(() => {
    const savedDirections = localStorage.getItem("directions");
    return savedDirections ? JSON.parse(savedDirections) : null;
  });
  const [selectedMode, setSelectedMode] = useState(() => {
    const savedMode = localStorage.getItem("selectedMode");
    return savedMode || "WALKING"; // Default to "WALKING" if no saved mode
  });
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const originMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const watchIdRef = useRef(null);
  const [isDarkStyle, setIsDarkStyle] = useState(() => {
    const savedStyle = localStorage.getItem("isDarkStyle");
    return savedStyle ? JSON.parse(savedStyle) : true;
  });
  const mapInstanceRef = useRef(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [busData, setBusData] = useState([["helo"]]);
  const [isCalculating, setIsCalculating] = useState(false);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  }

  useEffect(() => {
    // Fetch building data only once, store it in localStorage
    const fetchBuildings = async () => {
      try {
        // Check if buildings data already exists in localStorage
        const storedBuildings = localStorage.getItem("rentalData");

        if (storedBuildings) {
          // If data exists, use it directly
          setRentals(JSON.parse(storedBuildings));
        } else {
          // If no data, fetch from Firestore
          const snapshot = await getDocs(
            collection(firestore, "Rental Station Inventory")
          );
          let rentalData = [];
          snapshot.forEach((doc) => {
            rentalData.push({ id: doc.id, ...doc.data() }); // Use document ID as the building name
          });

          // Set the data in state and store it in localStorage
          setRentals(rentalData);
          localStorage.setItem("rentalData", JSON.stringify(rentalData));
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };

    fetchBuildings();

    // Clean up localStorage on logout
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // console.log("User logged out. Clearing localStorage for buildings.");
        localStorage.removeItem("rentalData");
      }
    });

    // Clean up the auth subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch building data only once, store it in localStorage
    const fetchBuildings = async () => {
      try {
        // Check if buildings data already exists in localStorage
        const storedBuildings = localStorage.getItem("eventsData");

        if (storedBuildings) {
          // If data exists, use it directly
          setEvents(JSON.parse(storedBuildings));
        } else {
          // If no data, fetch from Firestore
          const snapshot = await getDocs(collection(firestore, "Events"));
          let eventsData = [];
          snapshot.forEach((doc) => {
            eventsData.push({ id: doc.id, ...doc.data() }); // Use document ID as the building name
          });

          // Set the data in state and store it in localStorage
          setEvents(eventsData);
          localStorage.setItem("eventsData", JSON.stringify(eventsData));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchBuildings();

    // Clean up localStorage on logout
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // console.log("User logged out. Clearing localStorage for buildings.");
        localStorage.removeItem("eventsData");
      }
    });

    // Clean up the auth subscription on unmount
    return () => unsubscribe();
  }, []);

  //handle bus tracking
  useEffect(() => {
    // Fetch bus data and store it in localStorage
    const fetchBusData = async () => {
      try {
        // Check if bus data already exists in localStorage
        const storedBusData = localStorage.getItem("busData");

        if (storedBusData) {
          // If bus data exists, use it directly
          setBusData(JSON.parse(storedBusData));
        } else {
          // If no data, fetch from Firestore
          const busSnapshot = await getDocs(collection(firestore, "Bus"));
          let buses = [];
          busSnapshot.forEach((doc) => {
            buses.push({ id: doc.id, ...doc.data() }); // Correctly get document data
          });

          // Set the data in state and store it in localStorage
          setBusData(buses);
          localStorage.setItem("busData", JSON.stringify(buses));
        }

        console.log("Bus data: ", busData); // Log bus data to check
      } catch (error) {
        console.error("Error fetching bus data:", error);
      }
    };

    fetchBusData();

    // Clean up localStorage on logout
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        localStorage.removeItem("busData");
      }
    });

    return () => unsubscribe();
  }, []);

  const addBusMarkers = useCallback(() => {
    if (googleMaps && mapInstanceRef.current) {
      busData.forEach((bus) => {
        if (bus.active && bus.lat && bus.lng) {
          const busMarker = new googleMaps.maps.Marker({
            position: { lat: parseFloat(bus.lat), lng: parseFloat(bus.lng) },
            map: mapInstanceRef.current,
            icon: {
              url: "https://img.icons8.com/?size=100&id=rbzJQybQmfOt&format=png&color=000000",
              scaledSize: new googleMaps.maps.Size(50, 50),
            },
            title: `Bus: ${bus.id}`,
          });

          // Optional: Add an info window for bus details
          const infoWindow = new googleMaps.maps.InfoWindow({
            content: `<div><h3>Bus: ${bus.id}</h3></div>`,
          });

          busMarker.addListener("click", () => {
            infoWindow.open(mapInstanceRef.current, busMarker);
          });
        }
      });
    }
  }, [googleMaps, busData]);

  // Handle Rent button click
  const handleDropOff = (ritem) => {
    axios
      .post(
        `https://api-campus-transport.vercel.app/complete-rent/${userId}/${ritem}`
      )
      .then((response) => {
        setIsLoading(false);
        setPopupMessage("Rental drop-off successful!");
        setShowPopup(true);
        sessionStorage.removeItem("userData");
        refetchUserData();
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error dropping off rental:", error);
        setPopupMessage("Error dropping off rental.");
        setShowPopup(true);
      });
  };

  function handleDrop(location) {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const distance = calculateDistance(
          location.lat,
          location.lng,
          userLat,
          userLng
        );
        console.log("Distance to the drop-off location:", distance);
        if (distance <= 500) {
          //change this
          handleDropOff(location.id);
        } else {
          setIsLoading(false);
          setPopupMessage(`Drop off unsuccessful, too far from ${location.id}`);
          setShowPopup(true);
        }
      },
      (error) => {
        setIsLoading(false);
        setPopupMessage("Unable to retrieve your location.");
        setShowPopup(true);
      }
    );
  }

  const calculateRoute = useCallback(
    (origin, destination) => {
      if (
        !googleMaps ||
        !directionsServiceRef.current ||
        !directionsRendererRef.current ||
        isCalculating
      )
        return;

      setIsCalculating(true);

      const request = {
        origin: origin,
        destination: destination,
        travelMode: googleMaps.maps.TravelMode[selectedMode],
      };

      if (selectedMode === "ACCESSIBILITY") {
        request.travelMode = googleMaps.maps.TravelMode.WALKING;
        request.provideRouteAlternatives = true;
        request.avoidHighways = true;
        request.avoidTolls = true;
      }

      directionsServiceRef.current.route(request, (response, status) => {
        setIsCalculating(false);

        if (status === "OK") {
          directionsRendererRef.current.setDirections(response);
          let routeDetails = response.routes[0].legs[0];

          if (selectedMode === "ACCESSIBILITY") {
            routeDetails.steps = routeDetails.steps.map((step) => {
              let instructions = step.instructions;
              instructions = instructions.replace(/stairs/gi, "ramp");
              instructions = instructions.replace(
                /\b(walk|Walk|WALK)\b/g,
                (match) => {
                  if (match === "walk") return "move";
                  if (match === "Walk") return "Move";
                  if (match === "WALK") return "MOVE";
                  return match;
                }
              );
              step.instructions = instructions;
              return step;
            });
          }

          setDirections(routeDetails);
          localStorage.setItem("directions", JSON.stringify(routeDetails));
          localStorage.setItem(
            "route",
            JSON.stringify({
              origin: routeDetails.start_location.toJSON(),
              destination: routeDetails.end_location.toJSON(),
            })
          );
        } else {
          console.log("Directions request failed due to " + status);
          setDirections(null);
          setPopupMessage(
            "Unable to find a route. Please try a different mode or destination."
          );
          setShowPopup(true);
        }
      });
    },
    [googleMaps, selectedMode, isCalculating]
  );

  const handleModeChange = useCallback(
    (newMode) => {
      setSelectedMode(newMode);
      localStorage.setItem("selectedMode", newMode);

      // Only recalculate if we have all necessary data
      if (
        originMarkerRef.current &&
        destinationMarkerRef.current &&
        directionsServiceRef.current
      ) {
        const origin = originMarkerRef.current.getPosition();
        const destination = destinationMarkerRef.current.getPosition();

        // Add a small delay to ensure state is updated
        setTimeout(() => {
          calculateRoute(origin, destination);
        }, 100);
      }
    },
    [calculateRoute]
  );

  const createMarkersAndCalculateRoute = useCallback(
    (originLatLng, destinationLatLng) => {
      if (originMarkerRef.current) originMarkerRef.current.setMap(null);
      if (destinationMarkerRef.current)
        destinationMarkerRef.current.setMap(null);

      const newOriginMarker = new googleMaps.maps.Marker({
        position: originLatLng,
        map: directionsRendererRef.current.getMap(),
        draggable: true,
      });
      const newDestinationMarker = new googleMaps.maps.Marker({
        position: destinationLatLng,
        map: directionsRendererRef.current.getMap(),
        draggable: true,
      });
      setOriginMarker(newOriginMarker);
      setDestinationMarker(newDestinationMarker);
      originMarkerRef.current = newOriginMarker;
      destinationMarkerRef.current = newDestinationMarker;

      localStorage.setItem(
        "route",
        JSON.stringify({
          origin: originLatLng.toJSON(),
          destination: destinationLatLng.toJSON(),
        })
      );

      newOriginMarker.addListener("dragend", () => {
        calculateRoute(
          newOriginMarker.getPosition(),
          newDestinationMarker.getPosition()
        );
      });
      newDestinationMarker.addListener("dragend", () => {
        calculateRoute(
          newOriginMarker.getPosition(),
          newDestinationMarker.getPosition()
        );
      });

      calculateRoute(originLatLng, destinationLatLng);
    },
    [googleMaps, calculateRoute]
  );

  const loadPersistedRoute = useCallback(() => {
    if (googleMaps) {
      const savedRoute = localStorage.getItem("route");
      if (savedRoute) {
        const { origin, destination } = JSON.parse(savedRoute);
        const originLatLng = new googleMaps.maps.LatLng(origin.lat, origin.lng);
        const destinationLatLng = new googleMaps.maps.LatLng(
          destination.lat,
          destination.lng
        );
        createMarkersAndCalculateRoute(originLatLng, destinationLatLng);
      }
    }
  }, [googleMaps, createMarkersAndCalculateRoute]);

  const calculateAndDisplayRoute = useCallback(
    (destination) => {
      if (!userLocation || !googleMaps) {
        alert(
          "Unable to access your location or Google Maps is not loaded. Please try again."
        );
        return;
      }
      const originLatLng = new googleMaps.maps.LatLng(
        userLocation.lat,
        userLocation.lng
      );
      createMarkersAndCalculateRoute(originLatLng, destination);
    },
    [userLocation, googleMaps, createMarkersAndCalculateRoute]
  );

  const addCustomLocationMarkers = useCallback(() => {
    if (googleMaps && mapInstanceRef.current) {
      rental.forEach((i) => {
        if (!i.id || !i.lat || !i.lng || !i.location) {
          console.error("Invalid rental data:", i);
          return; // Skip invalid rental data
        }
        let icon;

        // Define custom icons based on location type
        switch (i.id) {
          case "Bus-Station":
            icon = {
              url: "https://img.icons8.com/?size=100&id=rbzJQybQmfOt&format=png&color=000000",
              scaledSize: new googleMaps.maps.Size(50, 50),
            };
            break;
          default:
            icon = {
              url: "https://img.icons8.com/?size=100&id=dUCeRJ9NSaDu&format=png&color=000000",
              scaledSize: new googleMaps.maps.Size(50, 50),
            };
        }

        const marker = new googleMaps.maps.Marker({
          position: { lat: i.lat, lng: i.lng },
          map: mapInstanceRef.current,
          icon: icon,
          title: i.name,
        });

        // Create an info window for each marker
        const infoWindow = new googleMaps.maps.InfoWindow({
          content: `<div>
                      <h3>${i.id}</h3>
                      <p>Lat: ${i.lat}, Lng: ${i.lng}</p>
                      <p>Vehicle: ${i.Vehicle}</p>
                      <button class="dropOffButton"
                        id="dropOffButton-${i.id}" 
                      >
                        Drop-Off rentals
                      </button>
                    </div>`,
        });

        // Add click listener to open info window
        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        // Listen for the 'domready' event to attach the click handler to the button
        googleMaps.maps.event.addListener(infoWindow, "domready", () => {
          const dropOffButton = document.getElementById(
            `dropOffButton-${i.id}`
          );
          if (dropOffButton) {
            // Disable button if userLocation is null
            if (!userData.location) {
              dropOffButton.disabled = true;
            } else {
              dropOffButton.disabled = false;
            }

            dropOffButton.addEventListener("click", () => {
              handleDrop(i);
            });
          }
        });
      });
    }
  }, [googleMaps, userData.location, rental]);

  const addCustomLocationMarkers1 = useCallback(() => {
    if (googleMaps && mapInstanceRef.current) {
      events.forEach((i) => {
        if (!i.id || !i.lat || !i.lng || !i.location) {
          console.error("Invalid rental data:", i);
          return; // Skip invalid rental data
        }
        let icon;

        // Define custom icons based on location type
        switch (i.id) {
          default:
            icon = {
              url: "https://img.icons8.com/?size=100&id=Ib6dAoXkBweM&format=png&color=000000",
              scaledSize: new googleMaps.maps.Size(50, 50),
            };
        }

        const marker = new googleMaps.maps.Marker({
          position: { lat: i.lat, lng: i.lng },
          map: mapInstanceRef.current,
          icon: icon,
          title: i.name,
        });

        // Create an info window for each marker
        const infoWindow = new googleMaps.maps.InfoWindow({
          content: `<div>
                      <h3>${i.id}</h3>
                      <p>${i.description}</p>
                    </div>`,
        });

        // Add click listener to open info window
        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        // Listen for the 'domready' event to attach the click handler to the button
        googleMaps.maps.event.addListener(infoWindow, "domready", () => {
          const dropOffButton = document.getElementById(
            `dropOffButton-${i.id}`
          );
          if (dropOffButton) {
            // Disable button if userLocation is null
            if (!userData.location) {
              dropOffButton.disabled = true;
            } else {
              dropOffButton.disabled = false;
            }

            dropOffButton.addEventListener("click", () => {
              handleDrop(i);
            });
          }
        });
      });
    }
  }, [googleMaps, userData.location, events]);
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_MAP_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then((google) => {
        setGoogleMaps(google);
        directionsServiceRef.current = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
        });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

            watchIdRef.current = navigator.geolocation.watchPosition(
              (pos) =>
                setUserLocation({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              (error) => console.error("Error watching position:", error),
              { enableHighAccuracy: true, timeout: 20000 }
            );
          },
          (error) => {
            console.error("Error getting initial position:", error);
            setUserLocation({ lat: fallbackLatitude, lng: fallbackLongitude });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      })
      .catch((error) => console.error("Error loading Google Maps:", error));

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      googleMaps &&
      mapRef.current &&
      userLocation &&
      !mapInstanceRef.current
    ) {
      mapInstanceRef.current = new googleMaps.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 17,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: true,
        styles: isDarkStyle ? MapStyle : [],
      });

      directionsRendererRef.current.setMap(mapInstanceRef.current);

      new googleMaps.maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        icon: {
          path: googleMaps.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#4285F4",
          fillOpacity: 1,
        },
      });

      window.addEventListener("resize", () =>
        mapInstanceRef.current.setCenter(userLocation)
      );

      loadPersistedRoute();

      addCustomLocationMarkers();

      addCustomLocationMarkers1();

      addBusMarkers(); // Add bus markers to the map

      mapInstanceRef.current.addListener("click", (e) =>
        calculateAndDisplayRoute(e.latLng)
      );
    }
  }, [
    googleMaps,
    userLocation,
    calculateAndDisplayRoute,
    isDarkStyle,
    loadPersistedRoute,
    addCustomLocationMarkers,
    addCustomLocationMarkers1,
    addBusMarkers,
  ]);

  const toggleMapStyle = () => {
    setIsDarkStyle((prevIsDarkStyle) => {
      const newIsDarkStyle = !prevIsDarkStyle;
      localStorage.setItem("isDarkStyle", JSON.stringify(newIsDarkStyle));

      if (mapInstanceRef.current && googleMaps) {
        mapInstanceRef.current.setOptions({
          styles: newIsDarkStyle ? MapStyle : [],
        });
      }

      return newIsDarkStyle;
    });
  };

  const recenterMapToUserLocation = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.panTo(userLocation);
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleBar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  useEffect(() => {
    if (
      selectedCoordinates &&
      googleMaps &&
      mapInstanceRef.current &&
      userLocation
    ) {
      const destinationLatLng = new googleMaps.maps.LatLng(
        selectedCoordinates.latitude,
        selectedCoordinates.longitude
      );
      calculateAndDisplayRoute(destinationLatLng);
    }
  }, [
    selectedCoordinates,
    googleMaps,
    mapInstanceRef,
    userLocation,
    calculateAndDisplayRoute,
  ]);

  const handleGetDirections = useCallback((latitude, longitude) => {
    setSelectedCoordinates({ latitude, longitude });
  }, []);

  useEffect(() => {
    const handleCustomEvent = (event) => {
      if (event.detail && event.detail.latitude && event.detail.longitude) {
        handleGetDirections(event.detail.latitude, event.detail.longitude);
      }
    };

    window.addEventListener("getDirections", handleCustomEvent);

    return () => {
      window.removeEventListener("getDirections", handleCustomEvent);
    };
  }, [handleGetDirections]);

  useEffect(() => {
    if (originMarker && destinationMarker) {
      calculateRoute(
        originMarker.getPosition(),
        destinationMarker.getPosition()
      );
    }
  }, [selectedMode, calculateRoute, originMarker, destinationMarker]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
    navigate("/Profile");
  };

  const handleCloseNoRoutePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
    // Recalculate route with walking mode
    setSelectedMode("WALKING");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing drop-off...</p>
        </div>
      )}
      {showPopup && (
        <div className="popup-overlay-rental">
          <div className="popup-content-rental">
            <p>{popupMessage}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="popup-overlay-rental">
          <div className="popup-content-rental">
            <p>{popupMessage}</p>
            <button onClick={handleCloseNoRoutePopup}>Close</button>
          </div>
        </div>
      )}

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {directions && (
        <>
          <button
            className={`expand-button ${isCollapsed ? "visible" : "hidden"}`}
            onClick={toggleBar}
          ></button>
          <div
            className={`turn-by-turn hidden ${isCollapsed ? "hiddenBar" : ""}`}
          >
            <div className="direc-opt">
              <h3>Directions:</h3>
              <select
                className="selectName"
                value={selectedMode}
                onChange={(e) => handleModeChange(e.target.value)}
              >
                <option value="WALKING">Walking</option>
                <option value="DRIVING">Driving</option>
                <option value="ACCESSIBILITY">Accessibility</option>
              </select>
            </div>

            <button
              className="colourMode"
              onClick={toggleMapStyle}
              style={{
                backgroundColor: isDarkStyle ? "#aab9c9" : "#1d2c4d",
              }}
            >
              {isDarkStyle ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <button className="toggle-button" onClick={toggleBar}>
              {"Collapse Directions"}
            </button>

            <button
              className="recenterButton"
              onClick={recenterMapToUserLocation}
            >
              Recenter Map
            </button>
            {selectedMode === "ACCESSIBILITY" && (
              <p className="accessibility-disclaimer">
                Disclaimer: The accessibility option uses walking directions
                optimized for accessibility. However, it may not account for all
                accessibility needs. Please use caution and consider local
                conditions.
              </p>
            )}

            {directions.distance && <p>Distance: {directions.distance.text}</p>}
            {directions.duration && <p>Duration: {directions.duration.text}</p>}

            {directions && directions.steps && directions.steps.length > 0 && (
              <ol>
                {directions.steps.map((step, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                    style={{ marginBottom: "10px" }}
                  ></li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default BuildingMap;
