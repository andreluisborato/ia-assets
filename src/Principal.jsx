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
      <div className="flex flex-col items-end gap-2">

         {texto && <h1 className="txt animar-texto">{texto}</h1>}
        
        <button id="btn" onClick={lidarComClique}>1</button>
        
        <textarea name="msg" id="msg" className="msg" placeholder="Descreva seu asset e deixe a ia criar: "></textarea>
        <button className="enviar" id="enviar">Enviar</button>
        
        <button id="microfone" className="bg-[#1f8dec] text-white font-bold flex items-center border-2 border-[#ffffff] rounded-[20px] p-2.5 w-25 justify-center">
          Gravar
        </button>
      </div>
    </>
  )
} 

export default Principal