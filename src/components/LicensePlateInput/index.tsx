import { forwardRef } from "react"
import { TextInput, TextInputProps } from "react-native"
import { useTheme } from "styled-components/native"
import { Container, Input, Label } from "./styles"

type Props = TextInputProps & {
  label: string
}

const LicensePlateInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme()

    return (
      <Container>
        <Label>{label}</Label>

        <Input
          ref={ref} // pegando a referencia passada pelo input
          maxLength={7}
          autoCapitalize="characters" // deixar letras maiusculas
          placeholderTextColor={COLORS.GRAY_400}
          {...rest}
        />
      </Container>
    )
  }
)

export { LicensePlateInput }
