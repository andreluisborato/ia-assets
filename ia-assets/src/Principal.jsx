import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './Principal.css'

function Principal() {

  const [texto, setTexto] = useState('');

  function lidarComClique() {
    const nome = "André";
    setTexto(`Olá, ${nome}`);
  }

  return (
    <>
      <div className="container">

         {texto && <h1 className="txt animar-texto">{texto}</h1>}
        
        <button id="btn" onClick={lidarComClique}>1</button>
        
        <textarea name="msg" id="msg" className="msg" placeholder="Descreva seu asset e deixe a ia criar: "></textarea>
        <button className="enviar" id="enviar">Enviar</button>
      </div>
    </>
  )
} 

export default Principal
