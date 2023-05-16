import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useQuery, useRealm } from '@libs/realm'
import { Historic } from '@libs/realm/schemas/Historic'

import { CarStatus } from '@components/CarStatus'
import { HomeHeader } from '@components/HomeHeader'

import { Alert } from 'react-native'

import { Container, Content } from './styles'

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

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

    useEffect(() => {
        fetchVehicleInUse()
    }, []);

    useEffect(() => {
        realm.addListener('change', () => fetchVehicleInUse()) // change(quando mudar alguma coisa no banco chamar o fetchVehicleInUse)

        return () => realm.removeListener('change', fetchVehicleInUse) // deletar o Listener da memória
    }, []);

    return (
        <Container>
            <HomeHeader />

            <Content>
                <CarStatus
                    licensePlate={vehicleInUse?.license_plate}
                    onPress={handleRegisterMovement}
                />
            </Content>
        </Container>
    )
}