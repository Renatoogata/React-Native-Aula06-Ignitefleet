import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';

import { useObject, useRealm } from '@libs/realm';
import { Historic } from '@libs/realm/schemas/Historic';
import { BSON } from 'realm';

import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { ButtonIcon } from '@components/ButtonIcon';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';

type RouteParamsProps = {
    id: string;
}

export function Arrival() {

    const route = useRoute();
    const { id } = route.params as RouteParamsProps;

    const { goBack } = useNavigation()
    const realm = useRealm();
    const historic = useObject(Historic, new BSON.UUID(id)); // primeiro parametro o Schema e segundo parametro o ID

    function handleRemoveVehicleUsage() {
        Alert.alert('Cancelar', 'Cancelar a utilização do veículo?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => removeVehicleUsage() }
            ]
        )
    }

    function removeVehicleUsage() {
        realm.write(() => {
            realm.delete(historic) // posso pegar o objeto que ja tinha definido pelo ID acima
        });
        goBack();
    }

    return (
        <Container>
            <Header
                title='Chegada'
            />

            <Content>
                <Label>
                    Placa do veículo
                </Label>

                <LicensePlate>
                    {historic?.license_plate}
                </LicensePlate>

                <Label>
                    Finalidade
                </Label>

                <Description>
                    {historic?.description}
                </Description>

                <Footer>
                    <ButtonIcon
                        icon={X}
                        onPress={handleRemoveVehicleUsage}
                    />

                    <Button
                        title='Registrar Chegada'
                    />
                </Footer>
            </Content>
        </Container>
    );
}