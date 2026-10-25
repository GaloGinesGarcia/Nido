export function formatearImporte(centimos: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(centimos / 100)
}

export function convertirACentimos(importeTexto: string): number | null {
  const texto = importeTexto.trim()

  if (!/^\d+([.,]\d{1,2})?$/.test(texto)) {
    return null
  }

  const [euros, decimales = ''] = texto.replace(',', '.').split('.')
  const centimos = Number(euros) * 100 + Number(decimales.padEnd(2, '0'))

  if (!Number.isSafeInteger(centimos) || centimos <= 0) {
    return null
  }

  return centimos
}