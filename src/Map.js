import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;
var MapLatitude = 26 + 11 / 60 + 20 / 3600;
MapLatitude *= -1; // South
var MapLongitude = 28 + 1 / 60 + 39 / 3600;

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [MapLongitude, MapLatitude], // Example starting position [lng, lat]
      zoom: 15,
    });

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([MapLongitude, MapLatitude])
      .addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
  );
};

export default Map;
