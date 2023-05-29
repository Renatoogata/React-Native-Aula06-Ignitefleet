import { useEffect, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import { CloudArrowUp } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import dayjs from 'dayjs'

import { useUser } from '@realm/react'
import { useQuery, useRealm } from '@libs/realm'
import { Historic } from '@libs/realm/schemas/Historic'
import { getLastAsyncTimestamp, saveLastSyncTimestamp } from '@libs/asyncStorage/syncStorage'

import { CarStatus } from '@components/CarStatus'
import { HomeHeader } from '@components/HomeHeader'
import { HistoricCard, HistoricCardProps } from '@components/HistoricCard'


import { Container, Content, Label, Title } from './styles'
import { TopMessage } from '@components/TopMessage'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([]);
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null)

  const { navigate } = useNavigation();

  const historic = useQuery(Historic);
  const user = useUser();
  const realm = useRealm();

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse?._id.toString() });
    } else {
      navigate('departure');
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0] // filtar veículos que o status é departure [0](o primeiro)
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert('Veículo em uso', 'Não foi possível carregar o veículo em uso.');
      console.log(error);
    }
  }

  async function fetchHistoric() {
    try {
      const response = historic.filtered("status = 'arrival' SORT(created_at DESC)"); // pegando os registros com status 'arrival' ordenando do mais recente

      const lastSync = await getLastAsyncTimestamp(); // pegando a ultima data de sincronização

      const formatedHistoric = response.map((item) => {
        return ({
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(), // comparando com a ultima data de sincronização para ver se é T ou F
          created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm') //formatando data
        });
      });

      setVehicleHistoric(formatedHistoric);

    } catch (error) {
      console.log(error);
      Alert.alert('Histórico', 'Não foi possível carregar o histórico');
    }
  }

  function handleHistoricDetails(id: string) {
    navigate('arrival', { id });
  }

  async function progressNotification(transferred: number, transferable: number) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      await fetchHistoric();
      setPercentageToSync(null);

      Toast.show({
        type: 'info',
        text1: 'Todos os dados estão sincronizados.'
      })
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`);
    }
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse()) // change(quando mudar alguma coisa no banco chamar o fetchVehicleInUse)

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse) // deletar o Listener da memória
      }
    }
  }, []);

  useEffect(() => {
    fetchHistoric()
  }, [historic])

  useEffect(() => {
    // é uma subscription do atlas(realm) para poder fazer a sincronização do banco local com o remoto
    realm.subscriptions.update((mutableSubs, realm) => { // creando a subscription pro realm
      const historicByUserQuery = realm.objects('Historic').filtered(`user_id = '${user!.id}'`);

      mutableSubs.add(historicByUserQuery, { name: 'historic_by_user' });
    })
  }, [realm]);

  useEffect(() => {
    // esse useEffect vai ter a função de dizer o quanto de dados precisam ser enviados para o banco remoto
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    )

    return () => syncSession.removeProgressNotification(progressNotification);
  }, [])

  return (
    <Container>
      {
        percentageToSync && <TopMessage title={percentageToSync} icon={CloudArrowUp} />
      }

      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <Title>
          Histórico
        </Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={(
            <Label>
              Nenhum registro de veículo.
            </Label>
          )}
        />
      </Content>
    </Container>
  )
}