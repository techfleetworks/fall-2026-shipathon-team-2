// "Use your location" (O5l) without any outside service: we compare the
// device's position with approximate centres of LA County neighborhoods and
// fill in the nearest one. Only the neighborhood name is kept, never the
// coordinates.

const PLACES: [string, number, number][] = [
  ["Westlake", 34.0577, -118.2777],
  ["Downtown LA", 34.0453, -118.2551],
  ["South Park", 34.043, -118.2673],
  ["Little Tokyo", 34.0505, -118.24],
  ["Chinatown", 34.0623, -118.2383],
  ["Koreatown", 34.0614, -118.3007],
  ["Pico-Union", 34.0447, -118.2876],
  ["Echo Park", 34.0782, -118.2606],
  ["Silver Lake", 34.0869, -118.2702],
  ["Boyle Heights", 34.0339, -118.2054],
  ["Hollywood", 34.0928, -118.3287],
  ["Palms", 34.0219, -118.4041],
  ["Santa Monica", 34.0195, -118.4912],
  ["Inglewood", 33.9617, -118.3531],
  ["Compton", 33.8958, -118.2201],
  ["Long Beach", 33.7701, -118.1937],
  ["Pasadena", 34.1478, -118.1445],
  ["Van Nuys", 34.1899, -118.4514],
];

/** Farther than this from every listed place = outside the LA County pilot. */
const MAX_KM = 25;

function km(aLat: number, aLon: number, bLat: number, bLon: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat);
  const dLon = r(bLon - aLon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Nearest neighborhood name, or null if outside the pilot area. */
export function nearestNeighborhood(lat: number, lon: number): string | null {
  let best: [string, number] | null = null;
  for (const [name, pLat, pLon] of PLACES) {
    const d = km(lat, lon, pLat, pLon);
    if (!best || d < best[1]) best = [name, d];
  }
  return best && best[1] <= MAX_KM ? best[0] : null;
}
