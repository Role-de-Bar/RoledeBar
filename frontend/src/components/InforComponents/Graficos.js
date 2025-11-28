import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart,TrendingUp } from 'lucide-react';
import './Grafico.css';

const GraficoFavoritos = () => {
  const dados = [
    { mes: 'Jan', favoritos: 45 },
    { mes: 'Fev', favoritos: 52 },
    { mes: 'Mar', favoritos: 61 },
    { mes: 'Abr', favoritos: 78 },
    { mes: 'Mai', favoritos: 95 },
    { mes: 'Jun', favoritos: 120 },
    { mes: 'Jul', favoritos: 142 }
  ];

  return (
    <div className="grafico-container">
      <div className="grafico-header">
        <div className="grafico-titulo">
          <TrendingUp className="icone" />
          <h2>Estatísticas de Favoritos</h2>
        </div>
        <div className="grafico-total">
          <Heart className="icone-heart" fill="#e91e63" stroke="#e91e63" />
          <span className="total-numero">142</span>
          <span className="total-texto">favoritos totais</span>
        </div>
      </div>
      
      <div className="grafico-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="mes" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="favoritos" 
              stroke="#ff6b35" 
              strokeWidth={3}
              dot={{ fill: '#ffffffff', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grafico-info">
        <div className="info-card">
          <span className="info-label">Média Mensal</span>
          <span className="info-valor">85</span>
        </div>
        <div className="info-card">
          <span className="info-label">Crescimento</span>
          <span className="info-valor crescimento">+215%</span>
        </div>
      </div>
    </div>
  );
};

export default  GraficoFavoritos ;