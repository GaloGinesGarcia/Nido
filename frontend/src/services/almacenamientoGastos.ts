import type { Gasto } from '../types/Gasto'
import { esCategoriaGasto } from '../types/Gasto'

const CLAVE_GASTOS = 'nido-gastos-v1'

const GASTOS_INICIALES: Gasto[] = [
  { id: 'gasto-inicial', concepto: 'Gastos iniciales de ejemplo', importeCentimos: 65000, categoria: 'Otros' },
]

export function cargarGastos(): Gasto[] {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_GASTOS)

    if (textoGuardado === null) {
      return GASTOS_INICIALES
    }

    const datos: unknown = JSON.parse(textoGuardado)

    if (!Array.isArray(datos)) {
      throw new Error('Los datos guardados no son una lista.')
    }

    const sonValidos = datos.every((gasto) =>
      gasto !== null &&
      typeof gasto === 'object' &&
      typeof gasto.id === 'string' &&
      typeof gasto.concepto === 'string' &&
      gasto.concepto.trim() !== '' &&
      Number.isSafeInteger(gasto.importeCentimos) &&
      gasto.importeCentimos > 0
    )

    if (!sonValidos) {
      throw new Error('La lista contiene gastos no válidos.')
    }

    return datos.map((gasto): Gasto => ({
        id: gasto.id,
        concepto: gasto.concepto,
        importeCentimos: gasto.importeCentimos,
        categoria: esCategoriaGasto(gasto.categoria) ? gasto.categoria : 'Otros',
    }))
  } catch (error) {
    console.error('No se pudieron recuperar los gastos guardados.', error)
    return GASTOS_INICIALES
  }
}

export function guardarGastos(gastos: Gasto[]): void {
  localStorage.setItem(CLAVE_GASTOS, JSON.stringify(gastos))
}