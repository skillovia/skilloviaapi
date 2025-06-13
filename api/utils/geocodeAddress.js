const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_GEOLOCATION_API_KEY;

module.exports = async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

  if (data.status !== "OK" || data.results.length === 0) {
    throw new Error("Unable to geocode the address");
  }

  const location = data.results[0].geometry.location;
  return {
    lat: location.lat,
    lon: location.lng,
  };
};
