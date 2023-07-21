import { useEffect, useRef, useState } from "react"
import { TextInput, ScrollView, Alert } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Car } from "phosphor-react-native"

import { useNavigation } from "@react-navigation/native"

import {
  useForegroundPermissions,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords
} from "expo-location"

import { useUser } from "@realm/react"
import { useRealm } from "@libs/realm"
import { Historic } from "@libs/realm/schemas/Historic"

import { Button } from "@components/Button"
import { Header } from "@components/Header"
import { LicensePlateInput } from "@components/LicensePlateInput"
import { TextAreaInput } from "@components/TextAreaInput"
import { Loading } from "@components/Loading"
import { LocationInfo } from "@components/LocationInfo"
import { Map } from "@components/Map"

import { licensePlateValidate } from "@utils/licensePlateValidate"
import { getAdressLocation } from "@utils/getAddressLocation"

import { Container, Content, Message } from "./styles"

export function Departure() {
  const [description, setDescription] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<null | string>(null)
  const [currentCords, setCurrentCords] = useState<LocationObjectCoords | null>(
    null
  )

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions()

  const descriptionRef = useRef<TextInput>(null) // criando ref para aplicar em algum input
  const licensePlateRef = useRef<TextInput>(null) // criando ref para aplicar em algum input

  const { goBack } = useNavigation()
  const realm = useRealm() // criado na junto com o schema do realm para poder utilizar o banco offline
  const user = useUser() // pegando o usuario do realm (o que estou utilizando para atutenticação)

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus() // levando o foco para esse input
        return Alert.alert(
          "Placa inválida",
          "A placa é invalida. Por favor, informe a placa correta do veículo"
        )
      }

      if (description.trim().length === 0) {
        // trim() remove os espaços
        descriptionRef.current?.focus() // levando o foco para esse input
        return Alert.alert(
          "Finalidade",
          "Por favor, informe a finalidade da utilização do veículo"
        )
      }

      setIsRegistering(true)

      // write é baseado em transações(vamos definir oq iremos modificar e se alguma etapa der errado ele desfaz as alterações)
      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description
          })
        )
      })

      Alert.alert("Saída", "Saída do veículo registrada com sucesso!")
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível registrar a saída do veículo.")
    } finally {
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission()
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000
      },
      location => {
        setCurrentCords(location.coords)
        getAdressLocation(location.coords)
          .then(address => {
            if (address) {
              setCurrentAddress(address)
            }
          })
          .finally(() => setIsLoadingLocation(false))
      }
    ).then(response => (subscription = response))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [locationForegroundPermission])

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          utilizar essa funcionalidade. Porfavor, acesse as configurações do
          dispositivo para conceder essa permissão do aplicativo.
        </Message>
      </Container>
    )
  }

  if (isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCords && <Map coordinates={[currentCords]} />}
          <Content>
            {currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef} // atribuindo uma ref criada
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()} // passar para o proximo input pelo teclado utilizando ref
              returnKeyType="next" // mudando o icone
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef} // atribuindo uma ref criada
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister} // chamando a função com o teclado
              returnKeyType="send" // mudando o icone
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
