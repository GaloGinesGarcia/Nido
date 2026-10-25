import { useState } from 'react'
import { convertirACentimos } from '../utils/moneda'
import { CATEGORIAS_GASTO, esCategoriaGasto } from '../types/Gasto'
import type { CategoriaGasto } from '../types/Gasto'

type FormularioGastoProps = {
  onRegistrar: (concepto: string, importeCentimos: number, categoria: CategoriaGasto) => void
}

function FormularioGasto({ onRegistrar }: FormularioGastoProps) {
  const [concepto, setConcepto] = useState('')
  const [importeTexto, setImporteTexto] = useState('')
  const [errorConcepto, setErrorConcepto] = useState('')
  const [error, setError] = useState('')
  const [categoria, setCategoria] = useState<CategoriaGasto>('Otros')

  function enviarFormulario() {
    const conceptoLimpio = concepto.trim()

    if (conceptoLimpio === '') {
      setErrorConcepto('Escribe un concepto para el gasto.')
      return
    }

    setErrorConcepto('')

    const importeCentimos = convertirACentimos(importeTexto)

    if (importeCentimos === null) {
      setError('Escribe un importe positivo, con un máximo de dos decimales y dentro del rango permitido.')
      return
    }

    onRegistrar(conceptoLimpio, importeCentimos, categoria)

    setConcepto('')
    setImporteTexto('')
    setErrorConcepto('')
    setError('')
    setCategoria('Otros')
  }

  return (
    <form className="formulario-gasto" onSubmit={(evento) => { evento.preventDefault(); enviarFormulario() }}>
      <label htmlFor="concepto-gasto">Concepto</label>
      <input id="concepto-gasto" type="text" placeholder="Ej. Compra del supermercado" value={concepto}
        onChange={(evento) => {
          setConcepto(evento.target.value)
          setErrorConcepto('')
        }}
        aria-invalid={errorConcepto !== ''}
        aria-describedby={errorConcepto ? 'error-concepto' : undefined}
        required
      />

      {errorConcepto && (
        <p id="error-concepto" className="mensaje-error" role="alert">{errorConcepto}</p>
      )}
       <label htmlFor="categoria-gasto">Categoría</label>
        <select id="categoria-gasto" value={categoria} onChange={(evento) => {
        const valor = evento.target.value

        if (esCategoriaGasto(valor)) {
            setCategoria(valor)
        }
        }}>
        {CATEGORIAS_GASTO.map((opcion) => (
            <option key={opcion} value={opcion}>{opcion}</option>
        ))}
        </select>
      <label htmlFor="importe-gasto">Importe del gasto (€)</label>
      <input id="importe-gasto" type="text" inputMode="decimal" placeholder="Ej. 12,50" value={importeTexto}
        onChange={(evento) => {
          setImporteTexto(evento.target.value)
          setError('')
        }}
        aria-invalid={error !== ''}
        aria-describedby={error ? 'error-importe' : undefined}
        required
      />

      {error && (
        <p id="error-importe" className="mensaje-error" role="alert">{error}</p>
      )}

      <button type="submit" className="boton-principal">Añadir gasto</button>
    </form>
  )
}

export default FormularioGasto