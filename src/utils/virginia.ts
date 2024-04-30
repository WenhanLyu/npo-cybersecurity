import VAZipCodes from '@/data/maps/VA_Zip_Codes.json';

export type CityAndZip = {
  [key: string]: string[];
};

const processZipCodes = (geoJson: any): CityAndZip => {
  const result: CityAndZip = {};

  // Assuming the file structure is a FeatureCollection
  if (geoJson.type === 'FeatureCollection' && Array.isArray(geoJson.features)) {
    for (const feature of geoJson.features) {
      if (feature.geometry !== null) {
        const zipCode: string = feature.properties.ZIP_CODE;
        const poName: string = feature.properties.PO_NAME;

        if (!result[poName]) {
          result[poName] = [];
        }

        if (!result[poName].includes(zipCode)) {
          result[poName].push(zipCode);
        }
      }
    }
  }
  const sortedCities = Object.keys(result).sort();
  const sortedCityAndZipCodes: CityAndZip = {};
  sortedCities.forEach(city => {
    sortedCityAndZipCodes[city] = result[city].sort((a, b) => parseInt(a) - parseInt(b));
  });

  return sortedCityAndZipCodes;
};

const virginiaCityAndZip: CityAndZip = processZipCodes(VAZipCodes);

export default virginiaCityAndZip;
