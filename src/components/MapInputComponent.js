// components/MapComponent.js
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * MapComponent displays a map with a draggable marker.
 * It allows users to set the latitude and longitude by clicking on the map.
 *
 * @param {number} lat - The initial latitude position of the marker.
 * @param {number} lng - The initial longitude position of the marker.
 * @param {function} setLat - Function to update the latitude state in the parent component.
 * @param {function} setLng - Function to update the longitude state in the parent component.
 */
const MapComponent = ({ lat, lng, setLat, setLng }) => {
      const [position, setPosition] = useState([lat, lng]);

      /**
       * LocationMarker is an inner component that handles the marker's position on the map.
       * It updates the position when the map is clicked.
       */
      const LocationMarker = () => {
            const map = useMapEvents({
                  click(e) {
                        setPosition([e.latlng.lat, e.latlng.lng]);
                        setLat(e.latlng.lat);
                        setLng(e.latlng.lng);
                  },
            });

            return position === null ? null : (
                  <Marker position={position}></Marker>
            );
      };

      return (
            <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%' }}>
                  <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                  />
                  <LocationMarker />
            </MapContainer>
      );
};

export default MapComponent;
