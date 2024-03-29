import { IconProps } from "phosphor-react-native"
import { useTheme } from "styled-components/native"
import { TouchableOpacityProps } from "react-native"

import { Container } from "./styles"

export type IconBoxProps = (props: IconProps) => JSX.Element //usar o icone de uma forma dinamica como propriedade

type Props = TouchableOpacityProps & {
  icon: IconBoxProps
}

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { COLORS } = useTheme()

  return (
    <Container activeOpacity={0.7} {...rest}>
      <Icon size={32} color={COLORS.BRAND_MID} />
    </Container>
  )
}
