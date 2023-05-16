import { useEffect, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import { useQuery, useRealm } from '@libs/realm'
import { Historic } from '@libs/realm/schemas/Historic'

import { CarStatus } from '@components/CarStatus'
import { HomeHeader } from '@components/HomeHeader'
import { HistoricCard, HistoricCardProps } from '@components/HistoricCard'


import { Container, Content, Label, Title } from './styles'

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
    const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([]);

    const { navigate } = useNavigation();

    const historic = useQuery(Historic);
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

    function fetchHistoric() {
        try {
            const response = historic.filtered("status = 'arrival' SORT(created_at DESC)"); // pegando os registros com status 'arrival' ordenando do mais recente
            const formatedHistoric = response.map((item) => {
                return ({
                    id: item!.toString(),
                    licensePlate: item.license_plate,
                    isSync: false,
                    created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm') //formatando data
                });
            });

            setVehicleHistoric(formatedHistoric);

        } catch (error) {
            console.log(error);
            Alert.alert('Histórico', 'Não foi possível carregar o histórico');
        }
    }

    useEffect(() => {
        fetchVehicleInUse()
    }, []);

    useEffect(() => {
        realm.addListener('change', () => fetchVehicleInUse()) // change(quando mudar alguma coisa no banco chamar o fetchVehicleInUse)

        return () => realm.removeListener('change', fetchVehicleInUse) // deletar o Listener da memória
    }, []);

    useEffect(() => {
        fetchHistoric()
    }, [historic])

    return (
        <Container>
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