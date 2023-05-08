import { TouchableOpacity } from 'react-native';
import { Power } from 'phosphor-react-native'
import { useUser, useApp } from '@realm/react';

import theme from '@theme/index';

import { Container, Greeting, Message, Name, Picture } from "./styles";


export function HomeHeader() {
    const user = useUser(); // pegando dados do usuário autenticado com o google
    const app = useApp();

    function handleLogout() {
        app.currentUser?.logOut();
    }

    return (
        <Container>
            <Picture
                source={{ uri: user?.profile.pictureUrl }}
                placeholder="L184i9kCW=of00ayjZay~qj[ayj@" // blurhash
            />

            <Greeting>
                <Message>
                    Olá
                </Message>

                <Name>
                    {user?.profile.name}
                </Name>
            </Greeting>

            <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
                <Power
                    size={32}
                    color={theme.COLORS.GRAY_400}
                />
            </TouchableOpacity>
        </Container>
    )
}