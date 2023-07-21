import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location"

export async function getAdressLocation({
  latitude,
  longitude
}: LocationObjectCoords) {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude })

    return addressResponse[0]?.street
  } catch (error) {
    throw error
  }
}
