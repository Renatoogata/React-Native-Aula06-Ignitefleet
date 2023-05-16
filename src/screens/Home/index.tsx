import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useQuery } from '@libs/realm'
import { Historic } from '@libs/realm/schemas/Historic'

import { CarStatus } from '@components/CarStatus'
import { HomeHeader } from '@components/HomeHeader'

import { Alert } from 'react-native'

import { Container, Content } from './styles'

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

    const { navigate } = useNavigation();

    const historic = useQuery(Historic);

    function handleRegisterMovement() {
        navigate('departure');
    }

    function fetchVehicle() {
        try {
            const vehicle = historic.filtered("status = 'departure'")[0] // filtar veículos que o status é departure [0](o primeiro)
            setVehicleInUse(vehicle);
        } catch (error) {
            Alert.alert('Veículo em uso', 'Não foi possível carregar o veículo em uso.');
            console.log(error);
        }
    }

    useEffect(() => {
        fetchVehicle()
    }, [])

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