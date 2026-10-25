export type CategoriaGasto = 'Alimentación' | 'Vivienda' | 'Transporte' | 'Ocio' | 'Otros'

export const CATEGORIAS_GASTO: CategoriaGasto[] = ['Alimentación', 'Vivienda', 'Transporte', 'Ocio', 'Otros']

export type Gasto = {
  id: string
  concepto: string
  importeCentimos: number
  categoria: CategoriaGasto
}

export function esCategoriaGasto(valor: unknown): valor is CategoriaGasto {
  return CATEGORIAS_GASTO.some((categoria) => categoria === valor)
}