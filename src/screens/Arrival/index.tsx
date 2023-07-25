import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { X } from "phosphor-react-native"
import dayjs from "dayjs"

import { useObject, useRealm } from "@libs/realm"
import { Historic } from "@libs/realm/schemas/Historic"
import { BSON } from "realm"
import { LatLng } from "react-native-maps"

import { Header } from "@components/Header"
import { Button } from "@components/Button"
import { ButtonIcon } from "@components/ButtonIcon"
import { Map } from "@components/Map"
import { Locations } from "@components/Locations"
import { LocationInfoProps } from "@components/LocationInfo"
import { Loading } from "@components/Loading"

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  AsyncMessage
} from "./styles"
import { getLastAsyncTimestamp } from "@libs/asyncStorage/syncStorage"
import { getStorageLocations } from "@libs/asyncStorage/locationStorage"
import { stopLocationTask } from "@tasks/backgroundTaskLocation"
import { getAdressLocation } from "@utils/getAddressLocation"

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)
  const [coordinates, setCoordinates] = useState<LatLng[]>([])
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  )
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const route = useRoute()
  const { id } = route.params as RouteParamsProps

  const { goBack } = useNavigation()
  const realm = useRealm()
  const historic = useObject(Historic, new BSON.UUID(id)) // primeiro parametro o Schema e segundo parametro o ID

  const title = historic?.status === "departure" ? "Chegada" : "Detalhes"

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() }
    ])
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic) // posso pegar o objeto que ja tinha definido pelo ID acima
    })

    await stopLocationTask()
    goBack()
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possível objter os dados para registrar a chegada do veículo"
        )
      }

      const locations = await getStorageLocations()

      realm.write(() => {
        historic.status = "arrival"
        historic.updated_at = new Date()
        historic.coords.push(...locations)
      })

      await stopLocationTask()

      Alert.alert("Chegada", "Chegada registrada com sucesso")
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Não foi possível registrar a chegada do veículo")
    }
  }

  async function getLocationsInfo() {
    if (!historic) {
      return
    }

    const lastSync = await getLastAsyncTimestamp()
    const updatedAt = historic!.updated_at.getTime()
    setDataNotSynced(updatedAt > lastSync)

    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations()
      setCoordinates(locationsStorage)
    } else {
      setCoordinates(historic?.coords ?? [])
    }

    if (historic?.coords[0]) {
      const departureStreetName = await getAdressLocation(historic?.coords[0])
      setDeparture({
        label: `Saindo em ${departureStreetName ?? ""}`,
        description: dayjs(new Date(historic?.coords[0].timestamp)).format(
          "DD/MM/YYYY [ás] HH:mm"
        )
      })
    }

    if (historic?.status === "arrival") {
      const lastLocation = historic.coords[historic.coords.length - 1]
      const arrivalStreetName = await getAdressLocation(lastLocation)

      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ""}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          "DD/MM/YYYY [ás] HH:mm"
        )
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getLocationsInfo()
  }, [historic])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations departure={departure} arrival={arrival} />

        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar Chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da{" "}
          {historic?.status === "departure" ? "partida" : "chegada"} pendente.
        </AsyncMessage>
      )}
    </Container>
  )
}
