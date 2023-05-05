import { Text } from 'react-native';

import backgroundImg from '../../assets/background.png'
import { Container, Slogan, Title } from './styles';

export function SignIn() {
    return (
        <Container source={backgroundImg}>
            <Title>
                Ignite Fleet
            </Title>

            <Slogan>
                Gestão de uso de veículos
            </Slogan>
        </Container>
    )
}