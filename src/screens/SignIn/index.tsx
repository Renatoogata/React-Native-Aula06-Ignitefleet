import { useState } from 'react';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import backgroundImg from '@assets/background.png';

import { Button } from '@components/Button';

import { Container, Slogan, Title } from './styles';

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession(); // cuidar da interface do navegador que vai abrir fora do app para autenticação

export function SignIn() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [_, response, googleSignIn] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID, // atribuindo a chave android
        iosClientId: IOS_CLIENT_ID, // atribuindo chave ios
        scopes: ['profile', 'email'] // passando o escopo que definimos no site (nesse caso email e profile)
    });

    function handleGoogleSignIn() {
        setIsAuthenticating(true);

        googleSignIn().then((response) => {
            if (response.type !== "success") {
                setIsAuthenticating(false);
            }
        })
    }

    useEffect(() => { // ficar observando o response (se for sucess quer dizer que usuário conseguiu fazer autenticação)
        if (response?.type === 'success') {
            if (response.authentication?.idToken) {
                console.log("token", response.authentication?.idToken)
            }
        }
    }, [response])

    return (
        <Container source={backgroundImg}>
            <Title>
                Ignite Fleet
            </Title>

            <Slogan>
                Gestão de uso de veículos
            </Slogan>

            <Button
                title='Entrar com Google'
                onPress={handleGoogleSignIn}
                isLoading={isAuthenticating}
            />
        </Container>
    )
}