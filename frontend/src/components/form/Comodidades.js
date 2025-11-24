// Comodidades.jsx
import { useState } from "react";
import { 
  Cigarette, 
  Baby, 
  PawPrint, 
  Wifi, 
  Car, 
  Music, 
  Accessibility,
  Check
} from "lucide-react";
import './Comodidades.css';

function Comodidades({ value = [], onChange }) {
  const [mostrarDescricaoAcess, setMostrarDescricaoAcess] = useState(false);
  const [descricaoAcess, setDescricaoAcess] = useState("");

  const handleChange = (comodidadeValue) => {
    let novaLista = [...value];

    if (value.includes(comodidadeValue)) {
      // Remover comodidade
      novaLista = novaLista.filter(item => item !== comodidadeValue);
      
      // Se for acessibilidade, limpar também a descrição
      if (comodidadeValue === "Acessibilidade") {
        setMostrarDescricaoAcess(false);
        setDescricaoAcess("");
      }
      
      // Se for estacionamento, remover também "coberto"
      if (comodidadeValue === "Estacionamento") {
        novaLista = novaLista.filter(item => item !== "Estacionamento Coberto");
      }
    } else {
      // Adicionar comodidade
      novaLista.push(comodidadeValue);
      
      if (comodidadeValue === "Acessibilidade") {
        setMostrarDescricaoAcess(true);
      }
    }

    onChange(novaLista);
  };

  const handleCobertoChange = () => {
    let novaLista = [...value];
    const coberto = "Estacionamento Coberto";
    
    if (value.includes(coberto)) {
      novaLista = novaLista.filter(item => item !== coberto);
    } else {
      novaLista.push(coberto);
    }
    
    onChange(novaLista);
  };

  const opcoes = [
    { 
      label: "Espaço para fumantes", 
      value: "Espaço para fumantes",
      icon: Cigarette,
      color: "#6366f1"
    },
    { 
      label: "Área Kids", 
      value: "Área Kids",
      icon: Baby,
      color: "#ec4899"
    },
    { 
      label: "Pet Friendly", 
      value: "Pet Friendly",
      icon: PawPrint,
      color: "#8b5cf6"
    },
    { 
      label: "Wi-Fi", 
      value: "Wi-Fi",
      icon: Wifi,
      color: "#3b82f6"
    },
    { 
      label: "Estacionamento", 
      value: "Estacionamento",
      icon: Car,
      color: "#10b981"
    },
    { 
      label: "Música ao Vivo", 
      value: "Música ao Vivo",
      icon: Music,
      color: "#f59e0b"
    },
    { 
      label: "Acessibilidade", 
      value: "Acessibilidade",
      icon: Accessibility,
      color: "#06b6d4"
    },
  ];

  return (
    <div className="comodidades-wrapper">
      <div className="comodidades-grid">
        {opcoes.map((opcao) => {
          const Icon = opcao.icon;
          const isSelected = value.includes(opcao.value);
          
          return (
            <div key={opcao.value}>
              <button
                type="button"
                className={`comodidade-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleChange(opcao.value)}
                style={{
                  '--comodidade-color': opcao.color
                }}
              >
                <div className="comodidade-icon-wrapper">
                  <Icon size={20} />
                </div>
                <span className="comodidade-label">{opcao.label}</span>
                {isSelected && (
                  <div className="comodidade-check">
                    <Check size={16} />
                  </div>
                )}
              </button>

              {/* Sub-opção: Estacionamento Coberto */}
              {opcao.value === "Estacionamento" && value.includes("Estacionamento") && (
                <div className="comodidade-subopcao">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={value.includes("Estacionamento Coberto")}
                      onChange={handleCobertoChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Estacionamento Coberto</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Campo de descrição de Acessibilidade */}
      {mostrarDescricaoAcess && (
        <div className="acessibilidade-descricao">
          <label className="form-label">
            Descreva as facilidades de acessibilidade
          </label>
          <textarea
            className="form-textarea-acess"
            placeholder="Ex: Rampas de acesso, banheiros adaptados, elevadores, piso tátil, vagas preferenciais..."
            value={descricaoAcess}
            onChange={(e) => setDescricaoAcess(e.target.value)}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

export default Comodidades;