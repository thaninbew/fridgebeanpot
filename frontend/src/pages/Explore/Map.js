import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ExploreNavBar from './ExploreNavBar';
import { restaurantCache } from '../../lib/backendApi.ts'; // Adjust this import to your project structure
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet/hooks';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle the user's location on the map
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    const handleLocationFound = (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    };

    map.locate().on('locationfound', handleLocationFound);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      map.off('locationfound', handleLocationFound);
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here!</Popup>
    </Marker>
  );
}

// Component to render restaurant markers on the map
function RestaurantMarkers({ restaurants }) {
  return (
    <LayerGroup>
      {restaurants.map((restaurant, index) => (
        <Marker key={index} position={[restaurant.location.lat, restaurant.location.long]}>
          <Popup>
            <b>{restaurant.name}</b>
            <br />
            {restaurant.address}
            <br />
            <i>{restaurant.llm_info.matching_item_group}</i>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
}

export default function Map() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch all restaurants from your cache/API
    const allRestaurants = restaurantCache.getAllRestaurants();
    setRestaurants(allRestaurants);
  }, []);

  // Add dummy handler for inventory click
  const handleInventoryClick = () => {
    console.log("Inventory button clicked"); // Add basic implementation
  };

  return (
    <div>
      <ExploreNavBar onInventoryClick={handleInventoryClick} />
      <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <MapContainer
          center={[42.3601, -71.0589]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          <RestaurantMarkers restaurants={restaurants} />
        </MapContainer>
      </div>
    </div>
  );
}
