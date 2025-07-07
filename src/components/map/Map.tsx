
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { LatLng, LatLngBounds } from 'leaflet';

interface MapProps {
    onMapClick: (latlng: LatLng) => void;
}

const MapEvents = ({ onMapClick }: MapProps) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

const MapPanes = () => {
    const map = useMap();
    map.createPane('labels');
    map.getPane('labels')!.style.zIndex = '650';
    map.getPane('labels')!.style.pointerEvents = 'none';
    return null;
}

const Map = ({ onMapClick }: MapProps) => {
    const bounds = new LatLngBounds([-90, -180], [90, 180]);

    return (
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
        minZoom={2}
        maxBounds={bounds}
      >
        <MapPanes />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          pane="labels"
        />
        <MapEvents onMapClick={onMapClick} />
      </MapContainer>
    );
};

export default Map;
