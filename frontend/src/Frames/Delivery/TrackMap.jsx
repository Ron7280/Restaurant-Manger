import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Components/Header";
import { FaMapMarkedAlt, FaUser } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { IoLocation, IoHomeSharp, IoCallSharp } from "react-icons/io5";
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
    <div
      style={{
        color: "red",
        fontSize: "32px",
        animation: "bounce 1s infinite",
      }}
    >
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
      <GiMeal />
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
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setSearchedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
    }
  };

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

  const details = useMemo(
    () => [
      {
        icon: <IoMdTime size={25} />,
        title: "ETA",
        value: eta ? `${eta} min` : "…",
        btn: "",
      },
      {
        icon: <FaUser size={25} />,
        title: "Name",
        value: name,
        btn: "",
      },
      {
        icon: <IoCallSharp size={25} />,
        title: "Number",
        value: mobile,
        btn: (
          <button
            className="w-[20%] justify-center p-1 rounded-md bg-mainColor text-white
           text-sm font-semibold hover:bg-green-700 active:scale-95 
           transition flex items-center gap-1"
          >
            Call <IoCallSharp size={18} />
          </button>
        ),
      },
    ],
    [eta, name, mobile]
  );

  if (!lat || !lng)
    return (
      <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
        <Header
          icon={FaMapMarkedAlt}
          title="Track Map"
          button={false}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          searchField={true}
        />

        <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
          <MapContainer
            center={[restaurant.lat, restaurant.lng]}
            zoom={15}
            scrollWheelZoom={true}
            className="h-full w-full"
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={[restaurant.lat, restaurant.lng]} icon={blueIcon}>
              <Popup>Restaurant</Popup>
            </Marker>

            {searchedLocation && (
              <Marker
                position={[searchedLocation.lat, searchedLocation.lng]}
                icon={redIcon}
              >
                <Popup>Search Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    );

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaMapMarkedAlt}
        title="Track Map"
        button={false}
        searchField={false}
      />

      <div className="rounded-xl bg-white p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 flex items-center justify-center rounded-md
             bg-gradient-to-tr from-mainColor to-Indigo text-white"
            >
              <IoHomeSharp size={22} />
            </div>
            <div className="text-mainColor2 font-bold text-lg">
              Delivery Address
            </div>
          </div>

          <div className="flex items-center gap-1 text-mainColor2 font-medium">
            <IoLocation size={25} className="animate-bounce text-Red" />

            {address || "Loading..."}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {details.map((d, indes) => {
            return (
              <div className="border border-gray-200 rounded-lg p-3 flex flex-col gap-1 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div
                    className=" p-1 flex items-center justify-center rounded-md 
                           bg-gradient-to-tr from-mainColor to-Indigo text-white"
                  >
                    {d.icon}
                  </div>
                  <div className="font-semibold text-mainColor2">{d.title}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-mainColor2 font-semibold text-lg">
                    {d.value}
                  </div>

                  {d.btn}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[restaurant.lat, restaurant.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitMap coords={routeCoords} restaurant={restaurant} />
          <Marker position={[restaurant.lat, restaurant.lng]} icon={blueIcon}>
            <Popup>Restaurant</Popup>
          </Marker>
          <Marker position={[lat, lng]} icon={redIcon}>
            <Popup>
              Delivery <br />
              <b>Order #{serialNum}</b>
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
