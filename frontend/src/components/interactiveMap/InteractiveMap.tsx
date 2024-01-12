import axios from "axios";
import { useEffect, useState, useRef } from "react";
import L, { LatLngTuple, MarkerCluster, Point } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import CustomMarker from "../interactiveMap/marker/CustomMarker";
import style from "./InteractiveMap.module.scss";
// @ts-ignore
import icon from "../../assets/marker.svg";
import SearchBar from "./searchBar/SearchBar";

type coordinates = {
  type: Point;
  coordinates: LatLngTuple;
};

const InteractiveMap = () => {
  const [pois, setPois] = useState<
    Array<{
      name: string;
      image: string;
      coordinates: coordinates;
      address: string;
      phoneNumber: number;
      description: string;
    }>
  >([]);

  const mapRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/poi");
      console.log(response.data);

      setPois(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [mapRef]);

  const createClusterCustomIcon = (cluster: MarkerCluster) => {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span><img class=${
        style.clusterIcon
      } src=${icon} alt="clusterMarker"/>`,
      className: `${style.counter}`,
      iconSize: L.point(33, 33, true),
      iconUrl: icon,
    });
  };
  return (
    <>
      <MapContainer
        className={`${style.map}`}
        center={[46.232193, 2.209667]}
        zoom={6}
        scrollWheelZoom={true}
        minZoom={6}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/78a4b677-e817-42a6-8184-16a7c7017384/{z}/{x}/{y}{r}.png?access-token=VsqNhlNeeh2fYcI97JN1VuaKPpHNNeQSYYllqIf29xrB8in1XrrCycJkjpz6aJZX"
        />
        {<SearchBar />}

        <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
          {pois.map((poi, index) => {
            const latitude = poi.coordinates.coordinates[0];
            const longitude = poi.coordinates.coordinates[1];

            return (
              <CustomMarker
                key={index}
                position={[latitude, longitude]}
                name={poi.name}
                image={poi.image}
                address={poi.address}
                phoneNumber={poi.phoneNumber}
                description={poi.description}
              />
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
};

export default InteractiveMap;
