import { Realm } from "@realm/react";

type GenerateProps = {
    user_id: string;
    description: string;
    license_plate: string;
}

export class Historic extends Realm.Object<Historic> {
    _id!: string;
    user_id!: string;
    license_plate!: string;
    description!: string;
    status!: string;
    created_at!: string;
    updated_at!: string;

    static generate({ description, license_plate, user_id }: GenerateProps) { // utilizado no momento que for utlizar o Schema
        return {
            _id: new Realm.BSON.UUID(),
            user_id,
            license_plate,
            description,
            status: 'departure',
            created_at: new Date(),
            updated_at: new Date(),
        };
    }

    static schema = { // estrutura que vamos armazenar no banco
        name: 'Historic',
        primaryKey: '_id',

        properties: {
            // todos esses tipos são do realmDB
            _id: 'uuid',
            user_id: {
                type: 'string',
                indexed: true // campo indexado (utilizado como filtro de pesquisas)
            },
            license_plate: 'string',
            description: 'string',
            status: 'string',
            created_at: 'date',
            updated_at: 'date',
        }
    }
}