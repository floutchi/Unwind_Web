import { Loader } from "@googlemaps/js-api-loader";
import type { Place } from "./place";

const autoOptions = {
  fields: ["address_components", "geometry", "name"],
  types: ["address"],
  strictBounds: false,
};

let streetInput = "";
let numInput = "";
let zipInput = "";
let cityInput = "";
let countryInput = "";

export function loadGooglePlace(onPlaceChanged: (place: Place) => void) {
  const loader = new Loader({
    apiKey: "AIzaSyCLNgwKUno1K3gg3MngB-iDS5md5yEVzck",
    version: "weekly",
    libraries: ["places"],
  });

  loader
    .importLibrary("places")
    .then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("address"),
        autoOptions
      );

      autocomplete.addListener("place_changed", () =>
        onPlaceChanged(getData(autocomplete.getPlace()))
      );
    })
    .catch((e) => {
      console.log(e);
    });
}

function getData(address: any): Place {
  streetInput =
    address.address_components.find((c: any) => c.types.includes("route"))
      ?.long_name || "";

  numInput =
    address.address_components.find((c: any) =>
      c.types.includes("street_number")
    )?.long_name || "";

  zipInput =
    address.address_components.find((c: any) => c.types.includes("postal_code"))
      ?.long_name || "";

  cityInput =
    address.address_components.find((c: any) => c.types.includes("locality"))
      ?.long_name || "";

  countryInput =
    address.address_components.find((c: any) => c.types.includes("country"))
      ?.short_name || "";

  return {
    street: streetInput,
    num: parseInt(numInput),
    zipCode: zipInput,
    city: cityInput,
    country: countryInput,
  };
}
