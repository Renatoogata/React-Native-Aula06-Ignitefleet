import { TouchableOpacity } from 'react-native';
import { Power } from 'phosphor-react-native'

import theme from '@theme/index';

import { Container, Greeting, Message, Name } from "./styles";


export function HomeHeader() {
    return (
        <Container>
            <Greeting>
                <Message>
                    Olá
                </Message>

                <Name>
                    Renato
                </Name>
            </Greeting>

            <TouchableOpacity>
                <Power
                    size={32}
                    color={theme.COLORS.GRAY_400}
                />
            </TouchableOpacity>
        </Container>
    )
}