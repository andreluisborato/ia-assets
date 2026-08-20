import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './Principal.css'
import { enviar } from '../api/groq'

function Principal() {
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Estados para configuração do download
  const [nomeArquivo, setNomeArquivo] = useState('meu_asset');
  const [extensao, setExtensao] = useState('json');

  async function handleEnviar() {
    if (!mensagem.trim() || carregando) return;

    const textoUsuario = mensagem;
    setMensagem('');

    // 1. Adiciona a mensagem do usuário ao chat
    setHistorico((prev) => [...prev, { sender: 'user', text: textoUsuario }]);
    setCarregando(true);

    try {
      // 2. Chama a API da Groq
      const resultado = await enviar(textoUsuario);
      
      // 3. Adiciona a resposta da IA ao chat
      setHistorico((prev) => [...prev, { sender: 'ai', text: resultado }]);
    } catch (erro) {
      console.error(erro);
      setHistorico((prev) => [
        ...prev, 
        { sender: 'ai', text: `Erro: ${erro.message}` }
      ]);
    } finally {
      setCarregando(false);
    }
  }

  // Função para baixar o conteúdo de uma mensagem de IA
  function handleDownload(texto) {
    if (!texto) return;

    // Remove marcadores ```json, ```py, etc.
    const textoLimpo = texto
      .replace(/^```[\w-]*\n/i, '')
      .replace(/```$/i, '')
      .trim();

    const mimeTypes = {
      json: 'application/json',
      js: 'text/javascript',
      py: 'text/x-python',
      html: 'text/html',
      css: 'text/css',
      gd: 'text/plain',
      txt: 'text/plain'
    };

    const blob = new Blob([textoLimpo], { type: `${mimeTypes[extensao] || 'text/plain'};charset=utf-8` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${nomeArquivo || 'arquivo'}.${extensao}`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 flex-1">
        
        {/* ÁREA DE CHAT / MENSAGENS */}
        <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto max-h-[60vh] p-2">
          {historico.length === 0 && (
            <p className="text-center text-white/50 text-sm my-auto">
              Digite abaixo o asset ou código que deseja criar...
            </p>
          )}

          {historico.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                item.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  item.sender === 'user'
                    ? 'bg-[#1f8dec] text-white rounded-br-none'
                    : 'bg-slate-900 text-white border border-white/10 rounded-bl-none'
                }`}
              >
                {item.sender === 'ai' ? (
                  <div className="flex flex-col gap-3">
                    {/* Barra de Download na mensagem da IA */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <span className="text-[10px] font-bold text-blue-400">RESPOSTA IA</span>
                      
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="text" 
                          value={nomeArquivo}
                          onChange={(e) => setNomeArquivo(e.target.value)}
                          className="bg-slate-800 text-[11px] text-white px-2 py-0.5 rounded border border-slate-700 w-24"
                          placeholder="nome"
                        />

                        <select 
                          value={extensao}
                          onChange={(e) => setExtensao(e.target.value)}
                          className="bg-slate-800 text-[11px] text-white px-1 py-0.5 rounded border border-slate-700"
                        >
                          <option value="json">.json</option>
                          <option value="py">.py</option>
                          <option value="gd">.gd</option>
                          <option value="js">.js</option>
                          <option value="html">.html</option>
                          <option value="css">.css</option>
                          <option value="txt">.txt</option>
                        </select>

                        <button 
                          onClick={() => handleDownload(item.text)}
                          className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold px-2 py-0.5 rounded transition-colors"
                        >
                          📥 Baixar
                        </button>
                      </div>
                    </div>

                    <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto bg-black/40 p-2 rounded">
                      {item.text}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{item.text}</p>
                )}
              </div>
            </div>
          ))}

          {carregando && (
            <div className="flex items-start">
              <div className="bg-slate-900 text-blue-400 text-xs font-bold p-3 rounded-2xl rounded-bl-none border border-white/10 animate-pulse">
                🤖 Pensando / Gerando código...
              </div>
            </div>
          )}
        </div>

        {/* ÁREA DE ENTRADA (MENSAGEM) */}
        <div className="w-full flex flex-col gap-3 mt-auto">
          <textarea 
            name="msg" 
            id="msg" 
            className="msg w-full" 
            placeholder="Descreva seu asset e deixe a ia criar: "
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleEnviar();
              }
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <button 
              id="microfone" 
              className="bg-[#1f8dec] text-white font-bold flex items-center border-2 border-white rounded-[25px] p-2.5 hover:bg-[#1872c0] transition-colors w-25 text-center justify-center">
              Gravar
            </button>

            <button 
              id="enviar" 
              className="enviar disabled:opacity-50"
              onClick={handleEnviar}
              disabled={carregando}>
              {carregando ? '...' : 'Enviar'}
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Principal