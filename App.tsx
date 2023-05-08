import { StatusBar } from 'react-native';

import { ThemeProvider } from 'styled-components/native'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { REALM_APP_ID } from '@env';
import { AppProvider, UserProvider } from '@realm/react'

import theme from '@theme/index';

import { Loading } from '@components/Loading';

import { SignIn } from "@screens/SignIn";
import { Home } from '@screens/Home';


export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <AppProvider // configurar o projeto para fazer a integração com o atlas
      id={REALM_APP_ID}
    >
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <UserProvider // responsável pela parte de autenticação,
          fallback={SignIn} // se não tiver usuário autentiado, ele chama o signIn
        >
          <Home />
        </UserProvider>
      </ThemeProvider>
    </AppProvider>
  )
}

