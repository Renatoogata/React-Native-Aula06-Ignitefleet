import { TouchableOpacity } from 'react-native';
import { Power } from 'phosphor-react-native'
import { useUser, useApp } from '@realm/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import theme from '@theme/index';

import { Container, Greeting, Message, Name, Picture } from "./styles";


export function HomeHeader() {
    const user = useUser(); // pegando dados do usuário autenticado com o google
    const app = useApp();
    const insets = useSafeAreaInsets();

    const paddingTop = insets.top + 32; // insets.top é a area do notch do dispoisito(então o padding top fica toda area do smartphone(notch) + 32px)

    function handleLogout() {
        app.currentUser?.logOut();
    }

    return (
        <Container style={{ paddingTop }}>
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