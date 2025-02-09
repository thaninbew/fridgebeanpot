import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ExploreNavBar from './ExploreNavBar';
import { restaurantCache, backendApi } from '../../lib/backendApi.ts';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet/hooks';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: '/freaky-bean.svg',
  iconSize: [60, 60],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
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

    return () => {
      map.off('locationfound', handleLocationFound);
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup className="custom-popup">
        <div className="text-center">
          <p className="font-bold">You are here!</p>
        </div>
      </Popup>
    </Marker>
  );
}

// Component to render restaurant markers on the map
function RestaurantMarkers({ restaurants }) {
  if (!restaurants || restaurants.length === 0) return null;

  return (
    <LayerGroup>
      {restaurants.map((restaurant, index) => (
        <Marker 
          key={index} 
          position={[restaurant.location.lat, restaurant.location.long]}
        >
          <Popup className="custom-popup">
            <div className="text-center">
              <p className="font-bold text-lg">{restaurant.name}</p>
              <p className="text-sm text-gray-600">{restaurant.address}</p>
              <p className="text-sm italic mt-1">{restaurant.llm_info.matching_item_group}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
}

// Custom map style
const mapStyle = {
  backgroundColor: '#f7f6f4',  // Light beige background
  border: '2px solid black',
  borderRadius: '21px',
  boxShadow: '0px 2px 0px 0px rgba(0,0,0,1.00)',
};

export default function Map() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setIsLoading(true);
        // Try to get current position first
        const position = await backendApi.getCurrentPosition();
        const location = backendApi.normalizeLatLong(
          position.coords.latitude,
          position.coords.longitude
        );
        const allRestaurants = await backendApi.fetchLocalRestaurants(location);
        setRestaurants(allRestaurants || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        // Fallback to cached data if available
        const cachedData = await restaurantCache.getAllRestaurants();
        setRestaurants(cachedData || []);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  // Add dummy handler for inventory click
  const handleInventoryClick = () => {
    console.log("Inventory button clicked"); // Add basic implementation
  };

  return (
    <div className="pt-8"> {/* Increased top padding for navbar */}
      <div className="mb-32"> {/* Increased bottom margin to avoid navbar overlap */}
        <div className="mt-8"> {/* Added margin top to move ExploreNavBar down */}
          <ExploreNavBar onInventoryClick={handleInventoryClick} />
        </div>
        <div className="px-4 py-2 mt-2"> {/* Reduced vertical padding and top margin for map */}
          <div className="w-full" style={mapStyle}>
            <MapContainer
              center={[42.3601, -71.0589]}
              zoom={13}
              style={{ height: '65vh', width: '100%', borderRadius: '20px' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
              {!isLoading && <RestaurantMarkers restaurants={restaurants} />}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
