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

  function Envio() {
    alert("Mensagem enviada com sucesso!");
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        
        {texto && (
          <h1 className="txt animar-texto text-2xl sm:text-4xl text-center">
            {texto}
          </h1>
        )}

        <button 
          id="btn" 
          onClick={lidarComClique}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-all">
          1
        </button>

        <div className="w-full flex flex-col gap-3">
          <textarea 
            name="msg" 
            id="msg" 
            className="msg w-full" 
            placeholder="Descreva seu asset e deixe a ia criar: "/>

          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <button 
              id="microfone" 
              className="bg-[#1f8dec] text-white font-bold flex items-center border-2 border-white rounded-[25px] p-2.5 hover:bg-[#1872c0] transition-colors w-25 text-center justify-center">
              Gravar
            </button>

            <button 
              id="enviar" 
              className="enviar"
              onClick={Envio}>
              Enviar
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Principal