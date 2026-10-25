import { useState } from 'react'
import TarjetaResumen from './components/TarjetaResumen'
import './App.css'

function formatearImporte(centimos: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(centimos / 100)
}

function App() {
  const ingresosCentimos = 200000

  const [gastosCentimos, setGastosCentimos] = useState(65000)
  const [importeTexto, setImporteTexto] = useState('')
  const [error, setError] = useState('')

  const disponibleCentimos = ingresosCentimos - gastosCentimos

  function registrarGasto() {
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

    setGastosCentimos((gastosActuales) => gastosActuales + importeCentimos)
    setImporteTexto('')
    setError('')
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
    </main>
  )
}

export default App