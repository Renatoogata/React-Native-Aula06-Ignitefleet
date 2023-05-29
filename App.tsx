import 'react-native-get-random-values'
import '@libs/dayjs' // importando o dayjs para app

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components/native'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { WifiSlash } from 'phosphor-react-native';

import { REALM_APP_ID } from '@env';
import { AppProvider, UserProvider } from '@realm/react'

import theme from '@theme/index';


import { RealmProvider, syncConfig } from '@libs/realm';
import { Routes } from '@routes/index';
import { SignIn } from "@screens/SignIn";

import { Loading } from '@components/Loading';
import { TopMessage } from '@components/TopMessage';

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
        <SafeAreaProvider // fazendo o aplicativo encaixar dentro a area segura do smartphone(exluir notchs etc)
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          <TopMessage
            title='Você está offline.'
            icon={WifiSlash}
          />

          <UserProvider // responsável pela parte de autenticação,
            fallback={SignIn} // se não tiver usuário autentiado, ele chama o signIn
          >
            <RealmProvider
              sync={syncConfig} // estratégia de sincronização com o banco de dados
              fallback={Loading} // enquanto estiver no processo de carregamento do banco, mostrar o componente de loading
            >
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}

