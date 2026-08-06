import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './Principal.css'

function Principal() {
  const [count, setCount] = useState(0)

function nome() {
  let nome = document.getElementById("msg")
  const [texto, setTexto] = useState(nome)

  const alterarNome = () => {
    setTexto(nome)
  }
}

  return (
    <>
      <div className="container">
        <h1 className="txt"></h1>
        <button>1</button>
        <textarea name="msg" id="msg" className="msg" placeholder="Descreva seu asset e deixe a ia criar: "></textarea>
      </div>
    </>
  )
}

export default Principal
