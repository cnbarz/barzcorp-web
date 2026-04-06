import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [fiatAmount, setFiatAmount] = useState(100);
  const [cryptoType, setCryptoType] = useState('USDT');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  
  const [tasaDeCambio, setTasaDeCambio] = useState(0);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);

  // 1.03 = 3% margin for Barzcorp
  const margenGanancia = 1.03;

  useEffect(() => {
    const obtenerPrecioMercado = async () => {
      setCargandoPrecio(true);
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=eur');
        const precioReal = cryptoType === 'USDT' ? response.data.tether.eur : response.data['usd-coin'].eur;
        setTasaDeCambio(precioReal * margenGanancia);
      } catch (error) {
        console.error("Market connection error:", error);
        setTasaDeCambio(0.95); 
      }
      setCargandoPrecio(false);
    };
    obtenerPrecioMercado();
  }, [cryptoType]);

  const cryptoAmount = tasaDeCambio > 0 ? (fiatAmount / tasaDeCambio).toFixed(2) : 0;

  const handleBuy = async (e) => {
    e.preventDefault();
    setStatus('Processing your order...');

    try {
      const response = await axios.post('https://barzcorp-api.onrender.com', {
        nombreCliente: "Web User",
        cantidad: cryptoAmount,
        monedaCripto: cryptoType,
        montoFiat: fiatAmount,
        walletCliente: wallet
      });

      if(response.data.success) {
        setStatus('✅ Order successfully placed! We will contact you with payment instructions.');
        setWallet('');
      }
    } catch (error) {
        setStatus('❌ Connection error. Please make sure the backend is running.');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' }}>
      
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '420px' }}>
        
        {/* TÍTULO GIGANTE Y VISIBLE */}
        <h1 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '34px', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px' }}>
          BARZCORP <span style={{color: '#2563eb'}}>EXCHANGE</span>
        </h1>

        <p style={{ textAlign: 'center', margin: '0 0 25px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
          {cargandoPrecio ? "Connecting to live market..." : `1 ${cryptoType} = ${tasaDeCambio.toFixed(3)} EUR`}
        </p>
        
        <form onSubmit={handleBuy}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>You send (EUR):</label>
            <input type="number" value={fiatAmount} onChange={(e) => setFiatAmount(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '18px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} min="10" required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>You get:</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <input type="text" value={cargandoPrecio ? "..." : cryptoAmount} disabled style={{ width: '70%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#e2e8f0', fontSize: '18px', boxSizing: 'border-box', color: '#475569', fontWeight: 'bold' }} />
              <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ width: '30%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', cursor: 'pointer', backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>Your destination wallet address:</label>
            <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="Paste your receiving address here" style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} required />
          </div>

          <button type="submit" disabled={cargandoPrecio} style={{ width: '100%', padding: '16px', backgroundColor: cargandoPrecio ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: cargandoPrecio ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
            Buy Now
          </button>
        </form>

        {status && <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', backgroundColor: status.includes('❌') ? '#fee2e2' : '#dcfce7', color: status.includes('❌') ? '#991b1b' : '#166534', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{status}</div>}
      </div>
    </div>
  );
}

export default App;