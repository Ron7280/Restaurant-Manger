import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { FaMapMarkedAlt, FaUser } from "react-icons/fa";
import {
  IoRestaurant,
  IoLocation,
  IoHomeSharp,
  IoCallSharp,
} from "react-icons/io5";

import { useLocation } from "react-router-dom";
import { IoMdTime } from "react-icons/io";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const redIcon = new L.DivIcon({
  html: ReactDOMServer.renderToString(
    <div style={{ color: "red", fontSize: "32px" }}>
      <IoLocation />
    </div>
  ),
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const blueIcon = new L.DivIcon({
  html: ReactDOMServer.renderToString(
    <div style={{ color: "#2563eb", fontSize: "32px" }}>
      <IoRestaurant />
    </div>
  ),
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const FitMap = ({ coords, restaurant }) => {
  const map = useMap();

  useEffect(() => {
    if (!coords || coords.length === 0) return;

    const bounds = L.latLngBounds([
      [restaurant.lat, restaurant.lng],
      ...coords,
    ]);

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [coords, restaurant, map]);

  return null;
};

const TrackMap = () => {
  const { state } = useLocation();
  const { lat, lng, serialNum, name, mobile } = state || {};
  const restaurant = { lat: 40.78816, lng: -73.9555 };
  const [routeCoords, setRouteCoords] = useState([]);
  const [eta, setEta] = useState(null);
  const [address, setAddress] = useState("");

  const loadRoute = async () => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${restaurant.lng},${restaurant.lat};${lng},${lat}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const coords = route.geometry.coordinates.map(([lon, lat]) => [
          lat,
          lon,
        ]);

        setRouteCoords(coords);

        setEta(Math.ceil(route.duration / 60));
      }
    } catch (err) {
      console.error("Route Error:", err);
    }
  };

  const loadAddress = async () => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      setAddress(data.display_name || "Unknown location");
    } catch (err) {
      setAddress("Unable to load address");
    }
  };

  useEffect(() => {
    if (!lat || !lng) return;
    loadRoute();
    loadAddress();
  }, [lat, lng]);

  if (!lat || !lng)
    return (
      <div className="p-6 text-center text-xl font-bold text-red-600">
        No delivery order selected.
      </div>
    );

  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header icon={FaMapMarkedAlt} title="Track Map" button={false} />

      <div className="bg-gray-100 shadow rounded-xl p-4 gap-2 flex flex-col">
        <div>
          <div className="flex items-center gap-1 font-bold text-lg text-mainColor2">
            <div
              className="flex gap-1 items-center  justify-center
                      text-white bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg "
            >
              <IoHomeSharp size={25} />
            </div>
            Delivery Address
          </div>
          <div className="text-gray-600 font-semibold">
            {address || "Loading..."}
          </div>
        </div>

        <div className="flex w-full gap-5">
          <div className="w-[20%]">
            <div className="flex items-center gap-1 font-bold text-lg text-mainColor2">
              <div
                className="flex gap-1 items-center  justify-center
                      text-white bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg "
              >
                <IoMdTime size={25} />
              </div>
              ETA
            </div>
            <div className="text-mainColor font-bold text-xl">
              {eta ? `${eta} minutes` : "Calculating..."}
            </div>
          </div>
          <div className="w-[40%]">
            <div className="flex items-center gap-1  font-bold text-lg text-mainColor2">
              <div
                className="flex gap-1 items-center  justify-center
                      text-white bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg "
              >
                <FaUser size={25} />
              </div>
              Name
            </div>
            <div className="text-mainColor2 font-semibold text-xl">{name}</div>
          </div>
          <div className="w-[40%]">
            <div className="flex items-center gap-1 font-bold text-lg text-mainColor2">
              <div
                className="flex gap-1 items-center  justify-center
                      text-white bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg "
              >
                <IoCallSharp size={25} />
              </div>
              Number
            </div>
            <div className="flex items-center gap-2 text-mainColor2 font-semibold text-xl">
              {mobile}
              <button
                className="bg-mainColor w-[20%] items-center justify-center gap-2 
              rounded-full shadow-black shadow-md text-white flex"
              >
                Call <IoCallSharp size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[restaurant.lat, restaurant.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          <FitMap coords={routeCoords} restaurant={restaurant} />

          <Marker position={[restaurant.lat, restaurant.lng]} icon={blueIcon}>
            <Popup>Restaurant</Popup>
          </Marker>

          <Marker position={[lat, lng]} icon={redIcon}>
            <Popup>
              Delivery <br />
              <b>#{serialNum}</b>
            </Popup>
          </Marker>

          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="#305BCF" weight={6} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default TrackMap;
