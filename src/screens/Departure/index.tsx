import { useRef, useState } from 'react';
import { TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from '@realm/react';
import { useRealm } from '@libs/realm';
import { Historic } from '@libs/realm/schemas/Historic';

import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { LicensePlateInput } from '@components/LicensePlateInput';
import { TextAreaInput } from '@components/TextAreaInput';

import { licensePlateValidate } from '@utils/licensePlateValidate';

import { Container, Content } from './styles';

const KeyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position'; // deixar o Input sempre visivel na hora de digitar

export function Departure() {
    const [description, setDescription] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const descriptionRef = useRef<TextInput>(null) // criando ref para aplicar em algum input
    const licensePlateRef = useRef<TextInput>(null) // criando ref para aplicar em algum input

    const { goBack } = useNavigation();
    const realm = useRealm(); // criado na junto com o schema do realm para poder utilizar o banco offline
    const user = useUser(); // pegando o usuario do realm (o que estou utilizando para atutenticação)

    function handleDepartureRegister() {
        try {
            if (!licensePlateValidate(licensePlate)) {
                licensePlateRef.current?.focus(); // levando o foco para esse input
                return Alert.alert('Placa inválida', 'A placa é invalida. Por favor, informe a placa correta do veículo');
            }

            if (description.trim().length === 0) { // trim() remove os espaços
                descriptionRef.current?.focus(); // levando o foco para esse input
                return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo');
            }

            setIsRegistering(true);

            // write é baseado em transações(vamos definir oq iremos modificar e se alguma etapa der errado ele desfaz as alterações)
            realm.write(() => {
                realm.create('Historic', Historic.generate({
                    user_id: user!.id,
                    license_plate: licensePlate.toUpperCase(),
                    description
                }))
            });

            Alert.alert('Saída', 'Saída do veículo registrada com sucesso!');
            goBack();

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Não foi possível registrar a saída do veículo.');
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <Container>
            <Header title='Saída' />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={KeyboardAvoidingViewBehavior}>
                <ScrollView>
                    <Content>
                        <LicensePlateInput
                            ref={licensePlateRef} // atribuindo uma ref criada
                            label='Placa do veículo'
                            placeholder='BRA1234'
                            onSubmitEditing={() => descriptionRef.current?.focus()} // passar para o proximo input pelo teclado utilizando ref
                            returnKeyType="next" // mudando o icone
                            onChangeText={setLicensePlate}
                        />

                        <TextAreaInput
                            ref={descriptionRef} // atribuindo uma ref criada
                            label='Finalidade'
                            placeholder='Vou utilizar o veículo para...'
                            onSubmitEditing={handleDepartureRegister} // chamando a função com o teclado
                            returnKeyType="send" // mudando o icone
                            blurOnSubmit
                            onChangeText={setDescription}
                        />

                        <Button
                            title='Registrar Saída'
                            onPress={handleDepartureRegister}
                            isLoading={isRegistering}
                        />
                    </Content>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}