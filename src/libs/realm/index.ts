import { createRealmContext } from '@realm/react';
import { Historic } from './schemas/Historic';

export const {
    RealmProvider, // provider para compartilhar o acesso do banco de dados com a app
    useRealm, // utilizar a instancia do nosso banco de dados (para cadastrar, atualizar)
    useQuery, // implementar consultas no banco
    useObject, // obter um objeto especifico
} = createRealmContext({
    schema: [Historic]
});