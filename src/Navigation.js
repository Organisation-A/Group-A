import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;
var MapLatitude = 26 + 11 / 60 + 20 / 3600;
MapLatitude *= -1; // South
var MapLongitude = 28 + 1 / 60 + 39 / 3600;

var MapDestLatitude = 26 + 11 / 60 + 40 / 3600;
MapDestLatitude *= -1; // South
var MapDestLongitude = 28 + 1 / 60 + 20 / 3600;
var offset = 0.008;

const NavMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [MapLongitude, MapLatitude], // Example coordinates (New York)
      zoom: 15,
      maxBounds: [
        [MapLongitude - offset, MapLatitude - offset], // Southwest corner [lng, lat]
        [MapLongitude + offset, MapLatitude + offset], // Northeast corner [lng, lat]
      ],
    });

    // Add navigation controls (zoom and compass)
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right"); //'top-left', 'top-right', 'bottom-left', 'bottom-right'

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geolocate);

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric", // or 'imperial'
      profile: "mapbox/walking", // or 'mapbox/driving, 'mapbox/cycling'
    });

    // Add the Directions control to the map
    map.addControl(directions, "top-left");

    // Optionally set initial route
    directions.setOrigin([MapLongitude, MapLatitude]); // Origin coordinates
    directions.setDestination([MapDestLongitude, MapDestLatitude]); // Destination coordinates

    // Clean up on component unmount
    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
  );
};

export default NavMap;
