import { useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';

import { Header } from '@components/Header';
import { Button } from '@components/Button';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import { ButtonIcon } from '@components/ButtonIcon';

type RouteParamsProps = {
    id: string;
}

export function Arrival() {

    const route = useRoute();
    const { id } = route.params as RouteParamsProps;

    return (
        <Container>
            <Header
                title='Chegada'
            />

            <Content>
                <Label>
                    Placa do veículo
                </Label>

                <LicensePlate>
                    XXX0000
                </LicensePlate>

                <Label>
                    Finalidade
                </Label>

                <Description>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nulla, doloremque consectetur, officia nihil itaque molestiae asperiores eius facilis doloribus modi ducimus explicabo facere eligendi possimus quam rerum exercitationem voluptatem!
                </Description>

                <Footer>
                    <ButtonIcon
                        icon={X}
                    />

                    <Button
                        title='Registrar Chegada'
                    />
                </Footer>
            </Content>
        </Container>
    );
}