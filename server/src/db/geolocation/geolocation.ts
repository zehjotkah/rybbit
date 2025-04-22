import type { City, SubdivisionsRecord } from "@maxmind/geoip2-node";
import { Reader } from "@maxmind/geoip2-node";
import { readFile } from "fs/promises";
import path from "path";

interface LocationResponse {
  city?: string;
  country?: string;
  countryIso?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  error?: string;
  subdivisions?: SubdivisionsRecord[];
}

let reader: Reader;

// Extend the Reader type to include the city method
interface ExtendedReader extends Reader {
  city(ip: string): City;
}

async function loadDatabase(dbPath: string): Promise<void> {
  try {
    const dbBuffer = await readFile(dbPath);
    reader = Reader.openBuffer(dbBuffer);
    console.log("GeoIP database loaded successfully");
  } catch (error) {
    console.error("Failed to load GeoIP database:", error);
    throw error;
  }
}

await loadDatabase(path.join(process.cwd(), "GeoLite2-City.mmdb"));

// Utility function to extract response data
function extractLocationData(response: City): LocationResponse {
  console.info(JSON.stringify(response, null, 2));
  return {
    city: response.city?.names?.en,
    country: response.country?.names?.en,
    countryIso: response.country?.isoCode,
    latitude: response.location?.latitude,
    longitude: response.location?.longitude,
    timezone: response.location?.timeZone,
    subdivisions: response.subdivisions,
  };
}

export async function getLocation(ip: string): Promise<LocationResponse> {
  try {
    const response = await (reader as ExtendedReader).city(ip);
    return extractLocationData(response);
  } catch (error) {
    console.error("Error fetching location:", error);
    return { error: "Failed to fetch location" };
  }
}
