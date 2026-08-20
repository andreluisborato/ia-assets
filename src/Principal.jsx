import { useState, useRef, useEffect } from 'react'
import './Principal.css'
import { enviar } from '../api/groq'

function Principal() {
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const chatEndRef = useRef(null);

  // Rola suavemente para a mensagem mais recente
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historico, carregando]);

  async function handleEnviar() {
    if (!mensagem.trim() || carregando) return;

    const textoUsuario = mensagem;
    setMensagem('');

    setHistorico((prev) => [...prev, { sender: 'user', text: textoUsuario }]);
    setCarregando(true);

    try {
      const resultado = await enviar(textoUsuario);
      setHistorico((prev) => [...prev, { sender: 'ai', text: resultado }]);
    } catch (erro) {
      console.error(erro);
      setHistorico((prev) => [
        ...prev, 
        { sender: 'ai', text: `Erro: ${erro.message || 'Falha ao processar requisição.'}` }
      ]);
    } finally {
      setCarregando(false);
    }
  }

  function handleDownload(texto, nome = 'meu_asset', ext = 'json') {
    if (!texto) return;

    const textoLimpo = texto
      .replace(/^```[\w-]*\n?/gm, '')
      .replace(/```$/gm, '')
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

    const blob = new Blob([textoLimpo], { type: `${mimeTypes[ext] || 'text/plain'};charset=utf-8` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${nome || 'arquivo'}.${ext}`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 flex-1">
        
        {/* ÁREA DE CHAT - Permite rolagem, mas esconde a barra visualmente */}
        <div 
          className="w-full flex-1 flex flex-col gap-4 overflow-y-auto max-h-[60vh] p-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

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
                  <MensagemIA texto={item.text} onDownload={handleDownload} />
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
          <div ref={chatEndRef} />
        </div>

        {/* ÁREA DE ENTRADA */}
        <div className="w-full flex flex-col gap-3 mt-auto">
          <textarea 
            name="msg" 
            id="msg" 
            className="msg w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 resize-none focus:outline-none focus:border-blue-500" 
            placeholder="Descreva seu asset e deixe a IA criar..."
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
              type="button"
              className="bg-[#1f8dec] text-white font-bold flex items-center border-2 border-white rounded-[25px] p-2.5 hover:bg-[#1872c0] transition-colors w-25 text-center justify-center">
              Gravar
            </button>

            <button 
              id="enviar" 
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
              onClick={handleEnviar}
              disabled={carregando}>
              {carregando ? '...' : 'Enviar'}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}

function MensagemIA({ texto, onDownload }) {
  const [nomeArquivo, setNomeArquivo] = useState('meu_asset');
  const [extensao, setExtensao] = useState('json');

  return (
    <div className="flex flex-col gap-3">
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
            type="button"
            onClick={() => onDownload(texto, nomeArquivo, extensao)}
            className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold px-2 py-0.5 rounded transition-colors"
          >
            📥 Baixar
          </button>
        </div>
      </div>

      <pre 
        className="whitespace-pre-wrap font-mono text-xs overflow-x-auto bg-black/40 p-2 rounded"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {texto}
      </pre>
    </div>
  );
}

export default Principal;