import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Realm, useApp } from '@realm/react';

import backgroundImg from '@assets/background.png';

import { Button } from '@components/Button';

import { Container, Slogan, Title } from './styles';

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'

WebBrowser.maybeCompleteAuthSession(); // cuidar da interface do navegador que vai abrir fora do app para autenticação

export function SignIn() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    const app = useApp()

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
            // demonstração de como pegar e utilizar o token
            /*if (response.authentication?.idToken) { // pegando IDtoken
                fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication?.idToken}`) // fazendo uma requisição com o token
                    .then(response => response.json())
                    .then(console.log)
            } else {
                Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta google')
                setIsAuthenticating(false);
            } */
            if (response.authentication?.idToken) { // utilizando o Jwt do Atlas
                const credentials = Realm.Credentials.jwt(response.authentication.idToken);

                app.logIn(credentials).catch((error) => {
                    console.log("error --> ", error)
                    Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta google')
                    setIsAuthenticating(false);
                })
            } else {
                Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta google')
                setIsAuthenticating(false);
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