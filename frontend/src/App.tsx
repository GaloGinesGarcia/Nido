import { useState, useEffect } from 'react'
import TarjetaResumen from './components/TarjetaResumen'
import './App.css'

type Gasto = {
  id: string
  concepto: string
  importeCentimos: number
}

const CLAVE_GASTOS = 'nido-gastos-v1'

const GASTOS_INICIALES: Gasto[] = [
  { id: 'gasto-inicial', concepto: 'Gastos iniciales de ejemplo', importeCentimos: 65000 },
]

function cargarGastos(): Gasto[] {
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

    return datos
  } catch (error) {
    console.error('No se pudieron recuperar los gastos guardados.', error)
    return GASTOS_INICIALES
  }
}

function formatearImporte(centimos: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(centimos / 100)
}

function App() {
  const ingresosCentimos = 200000

  const [gastos, setGastos] = useState<Gasto[]>(cargarGastos)
  const [importeTexto, setImporteTexto] = useState('')
  const [error, setError] = useState('')
  const [concepto, setConcepto] = useState('')
  const [errorConcepto, setErrorConcepto] = useState('')
  const [errorGuardado, setErrorGuardado] = useState('')
  const gastosCentimos = gastos.reduce((total, gasto) => total + gasto.importeCentimos, 0)
  const disponibleCentimos = ingresosCentimos - gastosCentimos

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_GASTOS, JSON.stringify(gastos))
      setErrorGuardado('')
    } catch (error) {
      console.error('No se pudieron guardar los gastos.', error)
      setErrorGuardado('Los cambios no se han podido guardar en este navegador.')
    }
  }, [gastos])

  function registrarGasto() {
    const conceptoLimpio = concepto.trim()

    if (conceptoLimpio === '') {
      setErrorConcepto('Escribe un concepto para el gasto.')
      return
    }

    setErrorConcepto('')
    
    const texto = importeTexto.trim()

    if (!/^\d+([.,]\d{1,2})?$/.test(texto)) {
      setError('Escribe un importe válido, con un máximo de dos decimales.')
      return
    }

    const [euros, decimales = ''] = texto.replace(',', '.').split('.')

    const importeCentimos =
      Number(euros) * 100 + Number(decimales.padEnd(2, '0'))

    if (!Number.isSafeInteger(importeCentimos) || importeCentimos <= 0) {
      setError('Introduce un importe positivo dentro del rango permitido.')
      return
    }

    const nuevoGasto: Gasto = {
      id: crypto.randomUUID(),
      concepto: conceptoLimpio,
      importeCentimos,
    }

  setGastos((gastosActuales) => [...gastosActuales, nuevoGasto])
    setImporteTexto('')
    setError('')
  }

  function eliminarGasto(id: string) {
  setGastos((gastosActuales) => gastosActuales.filter((gasto) => gasto.id !== id))
  }

  return (
    <main className="nido-intro">
      <h1>Nido</h1>
      <p>Tu hogar, en equilibrio.</p>
      <p>Organiza tus gastos personales y compartidos en un mismo lugar.</p>

      <div className="resumen-tarjetas">
        <TarjetaResumen titulo="Ingresos del mes" importe={formatearImporte(ingresosCentimos)}/>
        <TarjetaResumen titulo="Gastos del mes" importe={formatearImporte(gastosCentimos)}/>
        <TarjetaResumen titulo="Disponible del mes" importe={formatearImporte(disponibleCentimos)}/>
      </div>

      <form className="formulario-gasto" onSubmit={(evento) => {evento.preventDefault(); registrarGasto()}}>

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
          <p id="error-importe" className="mensaje-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="boton-principal">Añadir gasto</button>
      </form>
      {errorGuardado && (
        <p className="mensaje-almacenamiento" role="alert">{errorGuardado}</p>
      )}
          <section className="listado-gastos">
            <h2>Gastos registrados</h2>

            {gastos.length === 0 && (
              <p>Todavía no hay gastos registrados.</p>
            )}

            <ul className="lista-gastos">
              {gastos.map((gasto) => (
                <li key={gasto.id}>
                  <span>{gasto.concepto}</span>

                  <div className="acciones-gasto">
                    <strong>{formatearImporte(gasto.importeCentimos)}</strong>
                    <button type="button" className="boton-eliminar" onClick={() => eliminarGasto(gasto.id)} aria-label={`Eliminar gasto: ${gasto.concepto}`}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
    </main>
  )
}

export default App