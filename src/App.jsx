import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Volume2, VolumeX, ChevronRight, CheckCircle2, XCircle, Eye, Sparkles } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO DOS DADOS
// ==========================================

const TITULO_BLOQUEIO = "Nem tudo é para todos.\nAlgo que só nós sabemos...";
const PERGUNTA_BLOQUEIO = "Qual foi o melhor dia deste século?";

const SENHAS_ACEITAS = ["110107", "11012007", "11/01/07", "11/01/2007"];

// Juntei as listas para garantir que sempre tenha dica nova
const TODAS_DICAS = [
  "O maior acontecimento histórico do mundo aconteceu nesta data...",
  "É a senha do meu celular.",
  "Você não estaria aqui hoje se não fosse por esse dia.",
  "É a minha data favorita no calendário.",
  "Hoje!",
  "Exatamente 19 anos atrás."
];

const ZOOM_LEVEL = 3.5; 

// ==========================================
// MEMÓRIAS (POSIÇÕES INALTERADAS)
// ==========================================
const MEMORIAS = [
  // 0. Ponta de Baixo (Centro) - COMEÇO
  {
    id: 1,
    titulo: "Eu não esperava que um dia essa criatura cacheada fosse ser tão importante...",
    comentario: "Foi a melhor decisão que eu tomei naquele ano.",
    pergunta: "Qual foi a primeira interação?",
    opcoes: [
      "Um cumprimento depois de você ganhar um ponto extra da Luciana",
      "Um crossover de grupinhos no pátio",
      "Compartilhamos a mesma bancada no laboratório"
    ],
    respostaCorreta: 0, 
    top: 90, left: 50, 
  },
  // 1. Subindo Esquerda (Baixo)
  {
    id: 2,
    titulo: "... mas um dia ela apareceu e tudo foi inevitável, fofo e divertido.",
    revelacao: "Você",
    comentario: "É sério que você não sabia dessa? Esse foi o mais importante!",
    pergunta: "Qual foi o primeiro presente que me foi dado?",
    opcoes: ["Um anel", "Uma pulseira de crochê", "Uma cesta de natal"],
    respostaCorreta: -1, 
    top: 75, left: 25, 
  },
  // 2. Subindo Esquerda (Meio)
  {
    id: 3,
    titulo: "E então, a sua presença passou a ser inexplicavelmente um lar. E te chamar era como chegar em casa.",
    comentario: "O tênis laranja era marcante. E todos no diminutivo pra enfatizar a sua fofurice.",
    pergunta: "Qual foi o primeiro apelidinho aleatório que eu usei com você?",
    opcoes: ["Laranjinha", "Pessoinha", "Maninha"],
    respostaCorreta: 0,
    top: 55, left: -3, 
  },
  // 3. Subindo Esquerda (Alto)
  {
    id: 4,
    titulo: "Dali pra frente, não consegui mais enxergar como as coisas poderiam ser diferentes...",
    revelacao: "Impossível escolher",
    comentario: "Era tanta viadagem que não dá pra escolher qual foi a situação mais comprometedora.",
    pergunta: "No período pré-pénabunda, qual foi a frase mais comprometedora proferida pela senhora?",
    opcoes: [
      "\"... mas se você quiser alguém...\"",
      "\"É pra isso que banheiros servem, mana\"",
      "*mordi a língua* \"Você quer um beijinho pra sarar?\""
    ],
    respostaCorreta: -1, 
    top: 35, left: -9, 
  },
  // 4. Curva Topo Esquerda (Exterior)
  {
    id: 5,
    titulo: "Amável. Simplesmente afável e fácil de amar. Não foi difícil decorar os seus gostos e o seus desgostos.",
    revelacao: "TODAS... e mais um pouco",
    comentario: "Sei que as preferências são todas duvidosas, mas não sei como provar...",
    pergunta: "Qual dessas opções te parece mais... interessante?",
    opcoes: ["Milfs", "Professores", "Pessoa mais de 7 anos mais velha"],
    respostaCorreta: -1, 
    top: 18, left: 10, 
  },
  // 5. Curva Topo Esquerda (Pico)
  {
    id: 6,
    titulo: "Incrivelmente engraçada também. Um meme ambulante.",
    comentario: "Meu amor, a sua EXISTÊNCIA é icônica. Todas as opções estão corretas",
    pergunta: "Qual dessas foi a situação mais icônica?",
    opcoes: [
      "Deixar a garrafinha cair do 2º andar e descer sendo aplaudida",
      "Engasgar com água de tanto rir na aula",
      "Todas as 193489781562 cochiladas nas aulas"
    ],
    respostaCorreta: -2, 
    top: 12, left: 32, 
  },
  // 6. Mergulho Central Esquerdo (Começo do V)
  {
    id: 7,
    titulo: "De repente, estava tendo aulas particulares sobre 8 homens dançarinos muito divos...",
    comentario: "A Jhulya passando, olhando com cara de piedade e dizendo \"meus pêsames\" foi o auge.",
    pergunta: "Sobre o que você me explicou no quadro um dia?",
    opcoes: [
      "Como o Han Jisung é um gostoso",
      "Ordem cronológica dos fatos até o debut",
      "Evidências da gayzisse no Minho"
    ],
    respostaCorreta: 1, 
    top: 28, left: 45, 
  },
  
  // --- LADO DIREITO (ESPELHO DO ESQUERDO) ---
  // 7. Mergulho Central Direito (Fim do V)
  {
    id: 8,
    titulo: "...e tudo começou dividindo um fone de ouvido.",
    comentario: "Sim, eu lembro disso. Muddy Water e Venom foram as primeiras.",
    pergunta: "Será que você lembra qual foi o primeiro álbum que você me mostrou?",
    opcoes: ["SKZ-Replay", "Noeasy", "Oddinary"],
    respostaCorreta: 2, 
    top: 28, left: 55, 
  },
  // 8. Curva Topo Direita (Pico)
  {
    id: 9,
    titulo: "E não parou por aí. As músicas se estenderam para além da melodia...",
    comentario: "Rapaz, foi um trauma, viu...",
    pergunta: "Qual foi a primeira fic que eu li?",
    opcoes: ["The Most Fuckable Ass", "Pink Pony Club", "When the Morning Comes"],
    respostaCorreta: 0,
    top: 12, left: 68, 
  },
  // 9. Curva Topo Direita (Exterior)
  {
    id: 10,
    titulo: "O que era apenas um pequeno interesse virou quase uma obsessão...",
    comentario: "Hehehe, é muito argumento pra implicar. Por favor, nunca deixe de recomendar.",
    pergunta: "Quantas fics tinham na planilha antes do ano acabar?",
    opcoes: ["O suficiente", "1982289528920", "29"],
    respostaCorreta: 2,
    top: 18, left: 90, 
  },
  // 10. Descendo Direita (Alto - Bochecha larga)
  {
    id: 11,
    titulo: "Mas dentre todas as histórias, algumas conquistaram meu coraçãozinho.",
    comentario: "Insuperável. Apenas.",
    pergunta: "Qual foi a minha favorita EVER de toda planilha?",
    opcoes: ["When the morning comes", "So sweet like a chocolate", "Wanting and Knowing"],
    respostaCorreta: 0,
    top: 35, left: 109, 
  },
  // 11. Descendo Direita (Meio)
  {
    id: 12,
    titulo: "Ainda que eu não seja a mais presente, saiba que eu sempre estarei aqui.",
    comentario: "Está certa. Todas estão certas. Porque eu amo você.",
    pergunta: "Para quê?",
    opcoes: ["Pra te encher o saco", "Pra te ouvir e apoiar", "E fazer você rir."],
    respostaCorreta: -2, 
    top: 55, left: 103, 
  },
  // 12. Descendo Direita (Baixo) - ÚLTIMA BRANCA -> MEMÓRIA VIADA
  {
    id: 13,
    titulo: "Muito obrigada pelos últimos 4 anos.",
    comentario: "Brincadeira à parte, você também é [todos os elogios da língua portuguesa] e uma das melhores coisas que já aconteceu na minha vida.",
    pergunta: "Você é",
    opcoes: ["A melhor coisa que já aconteceu na minha vida", "Todos os elogios da língua portuguesa", "Viada"],
    respostaCorreta: 2, 
    top: 75, left: 75, 
  },
  // 13. CENTRAL (O FIM - ESTRELA VERMELHA) - Apenas gatilho visual
  {
    id: 14,
    top: 50, left: 50, 
  }
];

export default function App() {
  const [bloqueado, setBloqueado] = useState(true);
  const [desbloqueando, setDesbloqueando] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [dicaAtual, setDicaAtual] = useState("");
  const [somAtivo, setSomAtivo] = useState(true);
  
  // Estado do Jogo
  const [nivelAtual, setNivelAtual] = useState(0); 
  const [modalAberto, setModalAberto] = useState(false); 
  const [mostrarComentario, setMostrarComentario] = useState(false); 
  const [erroQuiz, setErroQuiz] = useState(null); 
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  // Animação Final
  const [zoomOutFinal, setZoomOutFinal] = useState(false);
  const [showRedStar, setShowRedStar] = useState(false);
  const [zoomInRedStar, setZoomInRedStar] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  
  const [showLabelTermine, setShowLabelTermine] = useState(false);

  // Áudios
  // Usei os nomes de arquivo que você solicitou
  const audioAmbient = useRef(new Audio("drone.mp3")); 
  const audioUnlock = useRef(new Audio("unlock.mp3")); 
  const audioClick = useRef(new Audio("click.mp3")); 
  const audioSuccess = useRef(new Audio("yes.mp3")); 
  const audioError = useRef(new Audio("no.wav")); 

  useEffect(() => {
    audioAmbient.current.loop = true;
    audioAmbient.current.volume = 0.6; 
    return () => {
      audioAmbient.current.pause();
    };
  }, []);

  useEffect(() => {
    audioAmbient.current.muted = !somAtivo;
    audioUnlock.current.muted = !somAtivo;
    audioClick.current.muted = !somAtivo;
    audioSuccess.current.muted = !somAtivo;
    audioError.current.muted = !somAtivo;
  }, [somAtivo]);

  const playSound = (audioRef) => {
    if (somAtivo && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Erro ao reproduzir som:", e));
    }
  };

  const [backgroundStars] = useState(() => Array.from({ length: 250 }).map((_, i) => ({
    id: i,
    top: Math.random() * 120 - 10,
    left: Math.random() * 120 - 10,
    delay: Math.random() * 5,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.7 + 0.3
  })));

  const [shootingStars] = useState(() => Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    top: Math.random() * 40,
    left: Math.random() * 90,
    delay: Math.random() * 5
  })));

  // Lógica de sorteio de dica
  const gerarDica = () => {
    const dicasDisponiveis = TODAS_DICAS.filter(d => d !== dicaAtual);
    const novaDica = dicasDisponiveis[Math.floor(Math.random() * dicasDisponiveis.length)];
    setDicaAtual(novaDica);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    const inputLimpo = senhaInput.trim().replace(/\s/g, ''); 
    
    if (SENHAS_ACEITAS.includes(inputLimpo)) {
      setDesbloqueando(true);
      playSound(audioUnlock);
      if(somAtivo) {
        audioAmbient.current.play().catch(e => console.error("Autoplay bloqueado:", e));
      }
      setTimeout(() => {
        setBloqueado(false);
      }, 2000);
    } else {
      setErroSenha(true);
      playSound(audioError);
      gerarDica(); 
      setTimeout(() => setErroSenha(false), 800);
    }
  };

  const abrirMemoria = (index) => {
    // A vermelha (13) só é clicável via lógica final
    if (index === 13) return; 

    playSound(audioClick);
    
    if (index <= nivelAtual || jogoFinalizado) {
      setModalAberto(index);
      if (index < nivelAtual || jogoFinalizado) {
         setMostrarComentario(true);
      } else {
         setMostrarComentario(false);
      }
      setErroQuiz(null);
    }
  };

  const verificarOpcao = (indexOpcao) => {
    const memoriaAtual = MEMORIAS[modalAberto];
    
    if (memoriaAtual.respostaCorreta === -1) {
      playSound(audioError);
      setMostrarComentario(true);
      return;
    }

    if (memoriaAtual.respostaCorreta === -2) {
        playSound(audioSuccess);
        setMostrarComentario(true);
        return;
    }

    if (indexOpcao === memoriaAtual.respostaCorreta) {
      playSound(audioSuccess);
      if (!memoriaAtual.comentario) {
        fecharModalEAvancar(); 
      } else {
        setMostrarComentario(true);
      }
    } else {
      playSound(audioError);
      setErroQuiz(indexOpcao);
      setTimeout(() => setErroQuiz(null), 500);
    }
  };

  const fecharModalEAvancar = () => {
    playSound(audioClick);
    const isViadaMemory = modalAberto === 12; // Índice 12 é a memória "Viada"
    const isCurrentLevel = modalAberto === nivelAtual;

    setModalAberto(false);
    
    if (isCurrentLevel && !jogoFinalizado) {
      setTimeout(() => {
        if (isViadaMemory) {
          // Se acabou a memória 12, fim de jogo, inicia a sequência da estrela vermelha
          setJogoFinalizado(true);
          iniciarSequenciaFinal();
        } else {
          setNivelAtual(prev => prev + 1);
        }
      }, 300);
    }
  };

  const iniciarSequenciaFinal = () => {
    setTimeout(() => {
      setZoomOutFinal(true);
    }, 500);

    setTimeout(() => {
      setShowRedStar(true);
    }, 2500);

    setTimeout(() => {
      setZoomOutFinal(false);
      setZoomInRedStar(true);
      
      setTimeout(() => {
          setShowLabelTermine(true);
      }, 2500);

    }, 4000);
  };

  const handleRedStarClick = () => {
    // Se clicar durante o zoom out, vai para o zoom in
    if (zoomOutFinal) {
        playSound(audioSuccess);
        setZoomOutFinal(false);
        setZoomInRedStar(true);
        setTimeout(() => setShowFinalText(true), 1000); 
        return;
    }

    // Se clicar no final (zoom in), mostra o texto
    if (zoomInRedStar && !showFinalText) {
        playSound(audioUnlock); // Alterado para unlock.mp3
        setShowFinalText(true);
    }
  };

  const handleVoltarParaConstelacao = () => {
    playSound(audioClick);
    setShowFinalText(false);
    setZoomInRedStar(false);
    setShowLabelTermine(false);
    setZoomOutFinal(true);
  };

  // Lógica de Câmera
  const targetStar = MEMORIAS[nivelAtual] || MEMORIAS[0];
  let currentZoom = ZOOM_LEVEL;
  let translateX = targetStar.left;
  let translateY = targetStar.top;

  if (zoomOutFinal) {
    currentZoom = 0.65; 
    translateX = 50;
    translateY = 50;
  } else if (zoomInRedStar) {
    currentZoom = 4;
    translateX = 50;
    translateY = 50;
  } else if (jogoFinalizado) {
    translateX = 50;
    translateY = 50;
    currentZoom = 0.65;
  }

  // FIX: Multiplicamos por -1 para o CSS entender coordenadas negativas
  const transformStyle = `translate(50vw, 50vh) scale(${currentZoom}) translate(${-translateX}%, ${-translateY}%)`;
  const parallaxX = (translateX - 50) * -0.2; 
  const parallaxY = (translateY - 50) * -0.2;
  const backgroundTransform = `translate(${parallaxX}%, ${parallaxY}%)`;

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

        * { box-sizing: border-box; }
        body, html { 
            margin: 0; padding: 0; width: 100%; height: 100dvh; 
            overflow: hidden; background-color: #050505; 
            font-family: 'Quicksand', sans-serif; 
            -webkit-overflow-scrolling: touch; 
        }
        
        .app-container {
          position: fixed; inset: 0;
          background: radial-gradient(circle at center, #1a1a2e 0%, #000000 100%);
          color: white; overflow: hidden;
          padding-bottom: env(safe-area-inset-bottom);
        }

        @keyframes pulse-strong { 
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { transform: scale(1.5); box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        @keyframes pulse-red { 
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.5); box-shadow: 0 0 30px 15px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes shake { 10%, 90% { transform: translateX(-4px); } 20%, 80% { transform: translateX(4px); } }
        
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        
        @keyframes pop-in-node { 
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); } 
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 
        }

        @keyframes appear-center {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes unlock-success { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes soft-fade-in { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }

        @keyframes shooting {
          0% { transform: translate(-100px, -100px) rotate(45deg) scale(1); opacity: 1; }
          100% { transform: translate(400px, 400px) rotate(45deg) scale(1); opacity: 0; }
        }

        .shooting-stars-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;
        }

        .shooting-star {
          position: absolute; width: 150px; height: 2px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,1));
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.8);
          opacity: 0;
          animation: shooting 3s ease-out infinite;
        }

        .fixed-background {
          position: absolute; 
          width: 120vw; height: 120vh;
          top: -10vh; left: -10vw;
          pointer-events: none; z-index: 0;
          transition: transform 3s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
        }

        .camera-world {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          transition: transform 3s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
          transform-origin: 0 0;
          z-index: 2;
        }

        .star-dot {
          position: absolute; border-radius: 50%; background: white;
          animation: twinkle 3s infinite ease-in-out;
        }

        .memory-node {
          position: absolute; transform: translate(-50%, -50%);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
        }

        .node-button {
          background: none; border: none; padding: 0; cursor: pointer; position: relative;
        }

        .node-core {
          width: 20px; height: 20px;
          background: #e2e8f0; border-radius: 50%;
          transition: all 0.5s;
        }

        .memory-node.current .node-core {
          background: #fff;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4);
          animation: pulse-strong 1.5s infinite;
        }
        
        .memory-node.first-star-appear .node-core {
            animation: appear-center 2s ease-out forwards, pulse-strong 1.5s infinite 2s;
        }

        .memory-node.completed .node-core {
          background: #fff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(236, 72, 153, 0.6);
          animation: twinkle 3s infinite ease-in-out;
        }
        
        .red-star .node-core {
            background: #ef4444;
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.4);
            animation: pulse-red 1.5s infinite;
            width: 20px; height: 20px;
        }
        .red-star.pulse-constellation .node-core {
            animation: pulse-red 2s infinite;
            width: 30px; height: 30px; 
        }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px); z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .modal-card {
          background: #0f172a; border: 1px solid #334155; border-radius: 20px; padding: 32px;
          max-width: 500px; width: 90%; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          animation: pop-in 0.3s ease-out;
          display: flex; flex-direction: column; 
          max-height: 85vh; 
          overflow-y: auto;
          font-family: 'Quicksand', sans-serif;
          margin: 0 auto; 
        }
        .input-field {
          width: 100%; background: #1e293b; border: 1px solid #475569; color: white;
          padding: 12px; border-radius: 8px; font-size: 16px; outline: none; text-align: center;
          margin-bottom: 16px; transition: border-color 0.3s;
          font-family: 'Quicksand', sans-serif;
        }
        .input-field:focus { border-color: #818cf8; }
        .input-field.error { border-color: #ef4444; animation: shake 0.5s; }
        .btn-primary {
          width: 100%; background: #4f46e5; color: white; border: none; padding: 12px;
          border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px; transition: background 0.2s;
          font-family: 'Quicksand', sans-serif;
        }
        .btn-primary:hover { background: #4338ca; }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255,255,255,0.2); 
            padding: 10px 20px; border-radius: 30px; font-weight: 600; cursor: pointer; 
            font-size: 14px; transition: all 0.3s; display: flex; align-items: center; gap: 8px;
            margin-top: 20px; backdrop-filter: blur(4px);
        }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }

        .option-btn {
          width: 100%; text-align: left; padding: 16px; margin-bottom: 12px;
          background: #1e293b; border: 1px solid #334155; border-radius: 12px;
          color: #e2e8f0; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'Quicksand', sans-serif;
          font-weight: 500;
        }
        .option-btn:hover { background: #334155; border-color: #6366f1; }
        .option-btn.error { border-color: #ef4444; background: rgba(239, 68, 68, 0.1); animation: shake 0.4s; }
        
        .sound-control {
          position: fixed; top: 20px; right: 20px; z-index: 200;
          background: rgba(255,255,255,0.1); padding: 10px; borderRadius: 50%;
          cursor: pointer; transition: background 0.3s; border: none; color: white;
        }
        .sound-control:hover { background: rgba(255,255,255,0.2); }

        .final-card-wrapper {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          padding-bottom: env(safe-area-inset-bottom);
          pointer-events: none; 
        }

        .final-message {
          pointer-events: auto;
          text-align: center; color: white;
          animation: fade-in-up 1s ease-out;
          font-family: 'Quicksand', sans-serif;
          
          background: rgba(15, 23, 42, 0.90);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 60px rgba(0,0,0,0.8);
          
          display: flex; flex-direction: column; align-items: center;
          
          width: 100%;
          max-width: 420px;
          max-height: 80vh;
          overflow-y: auto; 
        }

        .final-message::-webkit-scrollbar { width: 6px; }
        .final-message::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .final-message::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

        .final-message p { 
            margin: 12px 0; 
            font-size: 18px; 
            font-weight: 500; 
            line-height: 1.6; 
            color: #e2e8f0; 
        }
        
        .final-message .highlight { 
            color: #f472b6; 
            font-weight: 700; 
            font-size: 20px; 
            margin-top: 24px; 
            display: block; 
            text-shadow: 0 0 20px rgba(244, 114, 182, 0.3);
        }
        
        .final-message .signature { 
            font-size: 16px; 
            margin-top: 32px; 
            color: #818cf8; 
            opacity: 1; 
            font-weight: 600; 
        }

        @media (max-width: 480px) {
          .final-message { padding: 24px; max-height: 75vh; }
          .final-message p { font-size: 16px; margin: 8px 0; }
          .final-message .highlight { font-size: 18px; margin-top: 16px; }
          .final-message .signature { margin-top: 24px; }
          .modal-card { padding: 24px; }
        }

      `}</style>

      {/* Botão de Controle de Som */}
      <button 
        className="sound-control"
        onClick={() => setSomAtivo(!somAtivo)}
        title={somAtivo ? "Silenciar" : "Ativar Som"}
      >
        {somAtivo ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* BACKGROUND FIXO */}
      {!bloqueado && (
        <div className="fixed-background" style={{ transform: backgroundTransform }}>
          {backgroundStars.map(star => (
            <div 
              key={star.id}
              className="star-dot"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                opacity: star.opacity
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay de Estrelas Cadentes */}
      {(jogoFinalizado || zoomOutFinal || zoomInRedStar) && (
        <div className="shooting-stars-overlay">
          {shootingStars.map(s => (
            <div 
              key={s.id} 
              className="shooting-star" 
              style={{ 
                top: `${s.top}%`, 
                left: `${s.left}%`, 
                animationDelay: `${s.delay}s` 
              }}
            />
          ))}
        </div>
      )}

      {bloqueado ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ animation: desbloqueando ? 'none' : 'float 6s ease-in-out infinite' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div 
                style={{ 
                  background: desbloqueando ? '#4ade80' : '#4f46e5', 
                  padding: '16px', 
                  borderRadius: '50%', 
                  boxShadow: desbloqueando ? '0 0 30px #4ade80' : '0 0 20px rgba(79, 70, 229, 0.6)',
                  transition: 'all 0.5s',
                  animation: desbloqueando ? 'unlock-success 0.5s ease-out' : 'none'
                }}
              >
                {desbloqueando ? <Unlock size={32} color="white" /> : <Lock size={32} color="white" />}
              </div>
            </div>

            {desbloqueando ? (
              <h1 style={{ textAlign: 'center', margin: '20px 0', fontSize: '28px', color: '#4ade80', fontWeight: 'bold' }}>
                Acesso Autorizado
              </h1>
            ) : (
              <>
                <h1 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '24px', whiteSpace: 'pre-wrap' }}>
                  {TITULO_BLOQUEIO}
                </h1>
                <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '24px' }}>
                  {PERGUNTA_BLOQUEIO}
                </p>
                
                <form onSubmit={handleUnlock}>
                  <input 
                    type="text" 
                    value={senhaInput}
                    onChange={(e) => setSenhaInput(e.target.value)}
                    className={`input-field ${erroSenha ? 'error' : ''}`}
                    placeholder="Digite a resposta..."
                    autoFocus
                  />
                  <button type="submit" className="btn-primary">
                    Desbloquear
                  </button>
                </form>

                {dicaAtual && (
                  <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid #f472b6', animation: 'pop-in 0.3s' }}>
                    <p style={{ fontSize: '12px', color: '#f472b6', fontWeight: 'bold', margin: '0 0 4px 0' }}>DICA:</p>
                    <p style={{ fontSize: '14px', color: '#e2e8f0', margin: 0, fontStyle: 'italic' }}>"{dicaAtual}"</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
            <div className="camera-world" style={{ transform: transformStyle }}>
                
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', opacity: (zoomOutFinal || zoomInRedStar) ? 0.3 : 1, transition: 'opacity 2s' }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    </filter>
                </defs>
                {MEMORIAS.map((memoria, index) => {
                    if (index >= nivelAtual && !jogoFinalizado) return null;
                    
                    // Pula o índice 13 (Estrela central)
                    if (index === 13) return null;

                    let nextIndex = index + 1;
                    
                    // Fecha o ciclo: Do último nó (index 12) volta para o primeiro (index 0)
                    if (index === 12) {
                        if (!jogoFinalizado) return null; 
                        nextIndex = 0; 
                    }
                    
                    const start = MEMORIAS[index];
                    const end = MEMORIAS[nextIndex];
                    
                    if (!end) return null;

                    return (
                    <line 
                        key={`line-${index}`}
                        x1={`${start.left}%`} y1={`${start.top}%`} 
                        x2={`${end.left}%`} y2={`${end.top}%`} 
                        stroke="url(#lineGradient)" 
                        strokeWidth="1.5"
                        strokeDasharray="0"
                        filter="url(#glow-line)"
                        style={{ animation: 'draw 2s linear forwards', opacity: 0.8 }}
                    />
                    );
                })}
                </svg>

                {MEMORIAS.map((memoria, index) => {
                // Estrela central não é renderizada no loop normal
                if (index === 13) return null;

                const isCurrent = index === nivelAtual;
                const isCompleted = index < nivelAtual;
                const isFuture = index > nivelAtual;
                
                if (isFuture && !jogoFinalizado) return null;

                // CLASSE ESPECIAL PARA A PRIMEIRA ESTRELA
                const isFirstStar = index === 0;
                
                return (
                    <div 
                    key={memoria.id}
                    className={`memory-node ${isCurrent && !jogoFinalizado ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isFirstStar && !modalAberto ? 'first-star-appear' : ''}`}
                    style={{ top: `${memoria.top}%`, left: `${memoria.left}%`, opacity: (zoomOutFinal || zoomInRedStar) ? 0.5 : 1, transition: 'opacity 2s' }}
                    >
                    <button onClick={() => abrirMemoria(index)} className="node-button">
                        <div className="node-core" />
                        {index === 0 && nivelAtual === 0 && !modalAberto && (
                        <div style={{ position: 'absolute', top: '35px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', pointerEvents: 'none', animation: 'soft-fade-in 1.5s ease-out 1.5s forwards', opacity: 0 }}>
                            <span style={{ color: '#fff', fontSize: '12px', fontStyle: 'italic', textShadow: '0 0 10px rgba(255,255,255,0.5)', letterSpacing: '1px' }}>
                            comece aqui
                            </span>
                        </div>
                        )}
                    </button>
                    </div>
                );
                })}

                {/* ESTRELA VERMELHA CENTRAL */}
                {showRedStar && (
                    <div 
                    className={`memory-node red-star ${zoomOutFinal ? 'pulse-constellation' : ''}`}
                    // animation agora é pop-in-node para manter o translate correto e não pular
                    style={{ top: '50%', left: '50%', cursor: 'pointer', animation: 'pop-in-node 1s ease-out' }}
                    >
                        <button onClick={handleRedStarClick} className="node-button">
                            <div className="node-core" />
                            {/* O TEXTO "TERMINE AQUI" APARECE DEPOIS DO ZOOM */}
                            {zoomInRedStar && showLabelTermine && !showFinalText && (
                                <div style={{ position: 'absolute', top: '35px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', pointerEvents: 'none', animation: 'soft-fade-in 1s ease-out forwards' }}>
                                    <span style={{ color: '#ef4444', fontSize: '12px', fontStyle: 'italic', textShadow: '0 0 10px rgba(239, 68, 68, 0.5)', letterSpacing: '1px' }}>
                                    termine aqui
                                    </span>
                                </div>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </>
      )}

      {/* MENSAGEM FINAL FIXA (OVERLAY) */}
      {showFinalText && (
          <div className="final-card-wrapper">
              <div className="final-message">
                  <Sparkles className="text-yellow-300 mb-4" size={32} />
                  <p>Obrigada por existir na linha do tempo da minha vida</p>
                  <p>Espero continuar construindo constelações de memórias com você por muitos anos</p>
                  <span className="highlight">Um feliz aniversário para a minha pessoinha favorita</span>
                  <div className="signature">
                      <p>Com carinho,</p>
                      <p>Da sua lerdinha favorita.</p>
                  </div>
                  
                  <button onClick={handleVoltarParaConstelacao} className="btn-secondary">
                      <Eye size={18} />
                      Ver Constelação
                  </button>
              </div>
          </div>
      )}

      {modalAberto !== false && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ height: '4px', background: 'linear-gradient(to right, #6366f1, #ec4899)', position: 'absolute', top: 0, left: 0, width: '100%', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            
            {!mostrarComentario ? (
              <>
                <button onClick={() => setModalAberto(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Memória {MEMORIAS[modalAberto].id}
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0', color: 'white' }}>
                    {MEMORIAS[modalAberto].titulo}
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '20px' }}>
                    {MEMORIAS[modalAberto].pergunta}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {MEMORIAS[modalAberto].opcoes.map((opcao, idx) => (
                    <button 
                      key={idx}
                      onClick={() => verificarOpcao(idx)}
                      className={`option-btn ${erroQuiz === idx ? 'error' : ''}`}
                    >
                      <span style={{ flex: 1 }}>{opcao}</span>
                      {erroQuiz === idx && <XCircle size={20} color="#ef4444" />}
                      <ChevronRight size={16} color="#64748b" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', animation: 'pop-in 0.5s ease-out' }}>
                  {/* Lógica condicional para mensagens de erro/acerto */}
                  {MEMORIAS[modalAberto].respostaCorreta === -1 ? (
                    <>
                      <div style={{ margin: '0 auto 20px', width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <XCircle size={32} color="#ef4444" />
                      </div>
                      <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
                        Resposta Errada!
                      </h3>
                      <p style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '16px' }}>
                        A resposta certa é: <span style={{ fontWeight: 'bold', color: '#4ade80' }}>{MEMORIAS[modalAberto].revelacao}</span>
                      </p>
                    </>
                  ) : MEMORIAS[modalAberto].respostaCorreta === -2 ? (
                    <>
                      <div style={{ margin: '0 auto 20px', width: '60px', height: '60px', background: 'rgba(74, 222, 128, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={32} color="#4ade80" />
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#4ade80', marginBottom: '16px' }}>
                        Tudo Certo!
                      </h3>
                    </>
                  ) : (
                    <>
                      <div style={{ margin: '0 auto 20px', width: '60px', height: '60px', background: 'rgba(74, 222, 128, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={32} color="#4ade80" />
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#4ade80', marginBottom: '16px' }}>
                        Resposta Correta!
                      </h3>
                    </>
                  )}
                  
                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #334155' }}>
                    <p style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.6', fontStyle: 'italic' }}>
                      "{MEMORIAS[modalAberto].comentario}"
                    </p>
                  </div>

                  <button onClick={fecharModalEAvancar} className="btn-primary">
                    {modalAberto === MEMORIAS.length - 2 ? "Ver Presente Final" : "Próxima Estrela"}
                  </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}