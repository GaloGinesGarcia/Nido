type TarjetaResumenProps = {
  titulo: string
  importe: string
}

function TarjetaResumen({ titulo, importe }: TarjetaResumenProps) {
  return (
    <section className="tarjeta-resumen">
      <h2>{titulo}</h2>
      <strong>{importe}</strong>
    </section>
  )
}

export default TarjetaResumen