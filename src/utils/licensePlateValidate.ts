const LICENSE_PLATE_REGEX = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}" // regex para placa de carro (3 Letras, 1 numero, 1 numero ou letra, 2 numeros)

export function licensePlateValidate(licensePlate: string) {
  const license = licensePlate.toUpperCase()

  const isValid = license.match(LICENSE_PLATE_REGEX)

  return isValid
}
