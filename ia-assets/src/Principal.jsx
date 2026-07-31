import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './Principal.css'

function Principal() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Olá</h1>
      <textarea name="msg" id="msg" className="msg" placeholder="Descreva seu assets e deixe a ia criar: "></textarea>
    </>
  )
}

export default Principal
