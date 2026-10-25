import { useEffect, useState } from 'react'
import TarjetaResumen from './components/TarjetaResumen'
import { cargarGastos, guardarGastos } from './services/almacenamientoGastos'
import type { Gasto } from './types/Gasto'
import ListadoGastos from './components/ListadoGastos'
import { formatearImporte } from './utils/moneda'
import FormularioGasto from './components/FormularioGasto'
import './App.css'

function App() {
  const ingresosCentimos = 200000

  const [gastos, setGastos] = useState<Gasto[]>(cargarGastos)
  
  
  
  
  const [errorGuardado, setErrorGuardado] = useState('')
  const gastosCentimos = gastos.reduce((total, gasto) => total + gasto.importeCentimos, 0)
  const disponibleCentimos = ingresosCentimos - gastosCentimos

    useEffect(() => {
    try {
      guardarGastos(gastos)
      setErrorGuardado('')
    } catch (error) {
      console.error('No se pudieron guardar los gastos.', error)
      setErrorGuardado('Los cambios no se han podido guardar en este navegador.')
    }
  }, [gastos])

  function registrarGasto(concepto: string, importeCentimos: number) {
  const nuevoGasto: Gasto = {
    id: crypto.randomUUID(),
    concepto,
    importeCentimos,
  }

  setGastos((gastosActuales) => [...gastosActuales, nuevoGasto])
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

      <FormularioGasto onRegistrar={registrarGasto} />
      {errorGuardado && (
        <p className="mensaje-almacenamiento" role="alert">{errorGuardado}</p>
      )}
          <ListadoGastos gastos={gastos} onEliminar={eliminarGasto} />
    </main>
  )
}

export default App