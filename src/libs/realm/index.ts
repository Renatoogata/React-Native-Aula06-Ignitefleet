import { createRealmContext } from "@realm/react"

import { Historic } from "./schemas/Historic"
import { Coords } from "./schemas/Coords"
import { schemaVersion } from "realm"

const realmAcessBehavior: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately // vai abrir o banco de dados utilizando a estratégia de sincronização
}

export const syncConfig: any = {
  // configurações de sincronização com o realm(Atlas)
  flexible: true,
  newRealmFileBehavior: realmAcessBehavior,
  existingRealmFileBehavior: realmAcessBehavior
}

export const {
  RealmProvider, // provider para compartilhar o acesso do banco de dados com a app (utilizado no App.tsx como contexto)
  useRealm, // utilizar a instancia do nosso banco de dados (para cadastrar, atualizar)
  useQuery, // implementar consultas no banco
  useObject // obter um objeto especifico
} = createRealmContext({
  schema: [Historic, Coords],
  schemaVersion: 1
})
