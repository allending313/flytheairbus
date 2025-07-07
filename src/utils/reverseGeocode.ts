import { LatLng } from 'leaflet';
import { countries } from './country.data';

export const getCountryFromLatLng = (latlng: LatLng): string | null => {
  let closestCountryName: string | null = null;
  let minDistance = Infinity;

  for (const country of countries) {
    const distance = Math.sqrt(
      Math.pow(latlng.lat - country.latitude, 2) +
      Math.pow(latlng.lng - country.longitude, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestCountryName = country.name;
    }
  }

  return closestCountryName;
};