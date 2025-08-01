import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabaseUrl = 'https://nyfiozihqkrjhqcefqhd.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [nombre, setNombre] = useState('')
  const [numero, setNumero] = useState('')
  const [apodo, setApodo] = useState('')
  const [error, setError] = useState('')
  const [gracias, setGracias] = useState(false)
  const [nombresUsados, setNombresUsados] = useState([])
  const [numerosUsados, setNumerosUsados] = useState([])
  const [apodosUsados, setApodosUsados] = useState([])

 useEffect(() => {
  async function fetchRemeras() {
    const { data, error } = await supabase.from('remeras').select('nombre, numero, apodo')
    if (!error && data) {
      setNombresUsados(data.map(r => r.nombre?.toUpperCase()))
      setNumerosUsados(data.map(r => r.numero))
      setApodosUsados(data.map(r => r.apodo?.toUpperCase()))
    }
  }
  fetchRemeras()
}, [])

  const numerosDisponibles = Array.from({ length: 100 }, (_, i) => i).filter(n => !numerosUsados.includes(n))

  function validar() {
  const nombreUpper = nombre.toUpperCase()
  const apodoUpper = apodo.toUpperCase()
  if (!nombre) return setError('El nombre es obligatorio')
  if (nombre.trim().split(/\s+/).length < 2) return setError('El nombre debe tener nombre y apellido')
  if (nombresUsados.includes(nombreUpper)) return setError('NOMBRE YA UTILIZADO')
  if (!numero) return setError('El número es obligatorio')
  if (!apodo) return setError('El apodo es obligatorio')
  if (!/^EL |^LA /.test(apodoUpper)) return setError('El apodo debe comenzar con "El" o "La"')
  if (apodoUpper.length < 5 || apodoUpper.length > 25) return setError('El apodo debe tener entre 5 y 25 caracteres')
  if (apodosUsados.includes(apodoUpper)) return setError('Apodo ya utilizado')
  setError('')
  return true
}

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) return
    const { error: insertError } = await supabase.from('remeras').insert([{ nombre, numero: Number(numero), apodo: apodo.toUpperCase() }])
    if (insertError) return setError('Error al guardar')
    setGracias(true)
  }

  if (gracias) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <h2
        style={{
          color: 'black',
          background: '#fff',
          padding: '32px 40px',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          margin: 0,
          fontSize: '2em'
        }}
      >
        GRACIAS POR PARTICIPAR
      </h2>
      <h4
        style={{
          color: 'black',
          background: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          margin: '18px 0 0 0',
          fontSize: '1em'
        }}
      >
        TU NOMBRE, NÚMERO Y APODO SERÁN AGREGADOS A LA LISTA
      </h4>
    </div>
  )
}

  return (
    <div>
      <h1
      style={{
        background: '#fff',
        color: 'black',
        padding: '18px 0',
        borderRadius: '14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        margin: '32px auto 0 auto',
        maxWidth: 400
      }}
    >
      Formulario Remeras para Kaitz
    </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <div style={{ color: 'black', fontSize: '0.95em', marginTop: 2 }}>Poner nombre completo. Ejemplo: "Tobías Jajurin"</div>
        <select value={numero} onChange={e => setNumero(e.target.value)}>
          <option value="">Selecciona un número</option>
          {numerosDisponibles.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <div style={{ color: 'black', fontSize: '0.95em', marginTop: 2 }}>Elegir el número que prefieras dentro de los disponibles</div>
        <input
          type="text"
          placeholder='Apodo ("El ..." o "La ...")'
          value={apodo}
          onChange={e => setApodo(e.target.value)}
        />
        <div style={{ color: 'black', fontSize: '0.95em', marginTop: 2 }}>El apodo debe comenzar con "El" o "La". Debe tener entre 5 y 25 caracteres. Debe tener sentido. Ejemplo: "El cazador"</div>
        <button type="submit">Enviar</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  )
}

export default App