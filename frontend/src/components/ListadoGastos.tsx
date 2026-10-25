import type { Gasto } from '../types/Gasto'
import { formatearImporte } from '../utils/moneda'

type ListadoGastosProps = {
  gastos: Gasto[]
  onEliminar: (id: string) => void
}

function ListadoGastos({ gastos, onEliminar }: ListadoGastosProps) {
  return (
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
              <button type="button" className="boton-eliminar" onClick={() => onEliminar(gasto.id)} aria-label={`Eliminar gasto: ${gasto.concepto}`}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ListadoGastos