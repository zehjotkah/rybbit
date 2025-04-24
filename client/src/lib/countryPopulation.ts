// Population data in millions (2023 estimates)
export const countryPopulations: Record<string, number> = {
  // Major countries
  US: 331.9, // United States
  CN: 1412.2, // China
  IN: 1408.0, // India
  ID: 273.8, // Indonesia
  PK: 231.4, // Pakistan
  BR: 214.3, // Brazil
  NG: 213.4, // Nigeria
  BD: 169.4, // Bangladesh
  RU: 145.5, // Russia
  MX: 126.7, // Mexico
  JP: 125.7, // Japan
  PH: 115.6, // Philippines
  ET: 123.4, // Ethiopia
  EG: 110.0, // Egypt
  VN: 98.2, // Vietnam

  // European countries
  DE: 83.8, // Germany
  GB: 67.3, // United Kingdom
  FR: 65.5, // France
  IT: 60.3, // Italy
  ES: 47.4, // Spain
  PL: 37.8, // Poland
  RO: 19.1, // Romania
  NL: 17.5, // Netherlands
  BE: 11.6, // Belgium
  GR: 10.6, // Greece
  CZ: 10.7, // Czech Republic
  PT: 10.2, // Portugal
  SE: 10.4, // Sweden
  HU: 9.7, // Hungary
  AT: 9.1, // Austria
  CH: 8.7, // Switzerland
  DK: 5.8, // Denmark
  FI: 5.5, // Finland
  SK: 5.4, // Slovakia
  NO: 5.4, // Norway
  IE: 5.0, // Ireland
  HR: 4.0, // Croatia
  LT: 2.8, // Lithuania
  SI: 2.1, // Slovenia
  LV: 1.9, // Latvia
  EE: 1.3, // Estonia
  CY: 0.9, // Cyprus
  LU: 0.6, // Luxembourg
  MT: 0.5, // Malta

  // North America
  CA: 38.2, // Canada
  CU: 11.3, // Cuba
  HT: 11.5, // Haiti
  DO: 10.9, // Dominican Republic

  // South/Central America
  CO: 51.5, // Colombia
  AR: 45.8, // Argentina
  PE: 33.4, // Peru
  VE: 28.4, // Venezuela
  CL: 19.2, // Chile
  EC: 17.9, // Ecuador
  BO: 11.7, // Bolivia

  // Asia/Oceania
  AU: 25.7, // Australia
  MY: 33.6, // Malaysia
  SA: 35.3, // Saudi Arabia
  UZ: 34.2, // Uzbekistan
  YE: 33.7, // Yemen
  NP: 30.0, // Nepal
  AF: 38.9, // Afghanistan
  IQ: 43.5, // Iraq
  TH: 71.7, // Thailand
  TR: 84.3, // Turkey
  IR: 87.9, // Iran
  KR: 51.3, // South Korea
  MM: 54.8, // Myanmar
  TW: 23.8, // Taiwan
  LK: 22.2, // Sri Lanka
  KH: 16.7, // Cambodia
  AE: 9.9, // United Arab Emirates
  IL: 9.2, // Israel
  TJ: 9.5, // Tajikistan
  AZ: 10.2, // Azerbaijan
  JO: 10.2, // Jordan
  SG: 5.9, // Singapore
  KG: 6.5, // Kyrgyzstan
  TM: 6.0, // Turkmenistan
  NZ: 5.1, // New Zealand

  // Africa
  ZA: 59.3, // South Africa
  TZ: 63.6, // Tanzania
  KE: 54.0, // Kenya
  DZ: 44.6, // Algeria
  SD: 45.7, // Sudan
  UG: 47.1, // Uganda
  MA: 37.3, // Morocco
  GH: 32.8, // Ghana
  MZ: 32.9, // Mozambique
  AO: 34.5, // Angola
  CI: 27.5, // Côte d'Ivoire
  CM: 27.9, // Cameroon
  MG: 28.9, // Madagascar
  LY: 7.0, // Libya
  TN: 12.0, // Tunisia
  SN: 17.2, // Senegal

  // Default population for countries not in the list (use with caution)
  XX: 5.0, // Default value
};

// Helper function to get population with fallback
export function getCountryPopulation(countryCode: string): number {
  if (!countryCode) return 1;

  // Normalize to uppercase and get first 2 characters (ISO2 code)
  const normalizedCode = countryCode.slice(0, 2).toUpperCase();

  return countryPopulations[normalizedCode] || countryPopulations.XX || 1;
}
