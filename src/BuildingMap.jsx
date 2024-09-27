import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapStyle } from "./MapStyle";

const fallbackLatitude = -26.1893;
const fallbackLongitude = 28.0271;

const BuildingMap = () => {
  const mapRef = useRef(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [directions, setDirections] = useState(null);
  const [selectedMode, setSelectedMode] = useState("WALKING");
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isDarkStyle, setIsDarkStyle] = useState(true);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBLFjakyXEMfq18y0BSZGa7qcNx8xkNAz4", // Replace with your actual API key
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then((google) => {
      setGoogleMaps(google);
      setDirectionsService(new google.maps.DirectionsService());
      setDirectionsRenderer(
        new google.maps.DirectionsRenderer({ suppressMarkers: true })
      );

      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            console.log("Error: The Geolocation service failed.");
            setUserLocation({ lat: fallbackLatitude, lng: fallbackLongitude });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
        setWatchId(id);
      } else {
        console.log("Error: Your browser doesn't support geolocation.");
        setUserLocation({ lat: fallbackLatitude, lng: fallbackLongitude });
      }
    });

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    if (googleMaps && mapRef.current && userLocation) {
      const map = new googleMaps.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 17,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: true,
        styles: isDarkStyle ? MapStyle : [], // Apply dark style conditionally
      });

      directionsRenderer.setMap(map);

      const userMarker = new googleMaps.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
          path: googleMaps.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const resizeMap = () => {
        map.setCenter(userLocation);
      };

      window.addEventListener("resize", resizeMap);

      map.addListener("click", (e) => {
        calculateAndDisplayRoute(e.latLng);
      });

      return () => {
        window.removeEventListener("resize", resizeMap);
        userMarker.setMap(null);
      };
    }
  }, [googleMaps, userLocation, isDarkStyle]);

  useEffect(() => {
    if (originMarker && userLocation) {
      originMarker.setPosition(userLocation);
      if (destinationMarker) {
        calculateRoute(
          new googleMaps.maps.LatLng(userLocation.lat, userLocation.lng),
          destinationMarker.getPosition()
        );
      }
    }
  }, [userLocation]);

  const calculateAndDisplayRoute = (destination) => {
    if (!userLocation || !googleMaps) {
      alert(
        "Unable to access your location or Google Maps is not loaded. Please try again."
      );
      return;
    }

    const origin = new googleMaps.maps.LatLng(
      userLocation.lat,
      userLocation.lng
    );
    const dest = new googleMaps.maps.LatLng(
      destination.lat(),
      destination.lng()
    );

    if (originMarker) originMarker.setMap(null);
    if (destinationMarker) destinationMarker.setMap(null);

    const newOriginMarker = new googleMaps.maps.Marker({
      position: origin,
      map: directionsRenderer.getMap(),
      draggable: true,
    });

    const newDestinationMarker = new googleMaps.maps.Marker({
      position: dest,
      map: directionsRenderer.getMap(),
      draggable: true,
    });

    setOriginMarker(newOriginMarker);
    setDestinationMarker(newDestinationMarker);

    newOriginMarker.addListener("dragend", () => {
      const newOrigin = newOriginMarker.getPosition();
      calculateRoute(newOrigin, newDestinationMarker.getPosition());
    });

    newDestinationMarker.addListener("dragend", () => {
      const newDest = newDestinationMarker.getPosition();
      calculateRoute(newOriginMarker.getPosition(), newDest);
    });

    calculateRoute(origin, dest);
  };

  const calculateRoute = (origin, destination) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: googleMaps.maps.TravelMode[selectedMode],
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          setDirections(response.routes[0].legs[0]);

          // Update marker positions using the current markers
          if (originMarker) {
            originMarker.setPosition(response.routes[0].legs[0].start_location);
          }
          if (destinationMarker) {
            destinationMarker.setPosition(
              response.routes[0].legs[0].end_location
            );
          }
        } else {
          console.log("Directions request failed due to " + status);
        }
      }
    );
  };

  const toggleMapStyle = () => {
    setIsDarkStyle(!isDarkStyle);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {directions && (
        <div
          className="turn-by-turn hidden"
          style={{
            position: "absolute",
            top: "90px",
            left: "30px",
            zIndex: 1000,
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Directions:</h3>
            <select
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value);
                if (directions && originMarker && destinationMarker) {
                  calculateRoute(
                    originMarker.getPosition(),
                    destinationMarker.getPosition()
                  );
                }
              }}
              style={{ padding: "5px" }}
            >
              <option value="DRIVING">Driving</option>
              <option value="WALKING">Walking</option>
              <option value="BICYCLING">Bicycling</option>
              <option value="TRANSIT">Transit</option>
            </select>
          </div>
          <button
            onClick={toggleMapStyle}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: isDarkStyle ? "#aab9c9" : "#1d2c4d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isDarkStyle ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
          <p>Distance: {directions.distance.text}</p>
          <p>Duration: {directions.duration.text}</p>
          <ol style={{ paddingLeft: "30px" }}>
            {directions.steps.map((step, index) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{ __html: step.instructions }}
                style={{ marginBottom: "10px" }}
              ></li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default BuildingMap;
