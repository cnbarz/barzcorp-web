import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

function App() {
  // === ESTADOS DE AUTENTICACIÓN ===
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const [mostrarLogin, setMostrarLogin] = useState(false); // Controla cuándo pedir el login

  // === ESTADOS DEL EXCHANGE ===
  const [fiatAmount, setFiatAmount] = useState(100);
  const [cryptoType, setCryptoType] = useState('USDT');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [tasaDeCambio, setTasaDeCambio] = useState(0);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);
  const [ordenCreada, setOrdenCreada] = useState(false);
  const [numeroReferencia, setNumeroReferencia] = useState('');

  const margenGanancia = 1.03;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setMostrarLogin(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setMostrarLogin(false);
    });
  }, []);

  useEffect(() => {
    const obtenerPrecioMercado = async () => {
      setCargandoPrecio(true);
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=eur');
        const precioReal = cryptoType === 'USDT' ? response.data.tether.eur : response.data['usd-coin'].eur;
        setTasaDeCambio(precioReal * margenGanancia);
      } catch (error) {
        setTasaDeCambio(0.95); 
      }
      setCargandoPrecio(false);
    };
    obtenerPrecioMercado();
  }, [cryptoType]);

  const cryptoAmount = tasaDeCambio > 0 ? (fiatAmount / tasaDeCambio).toFixed(2) : 0;

  // === LÓGICA DE COMPRA MODIFICADA ===
  const handleBuyIntent = async (e) => {
    e.preventDefault();
    
    // Si no hay sesión, frenamos la compra y mostramos el login
    if (!session) {
      setMostrarLogin(true);
      return;
    }

    setStatus('Processing your order...');
    const refUnica = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const response = await axios.post('https://barzcorp-api.onrender.com/nueva-orden', {
        nombreCliente: `${session.user.email} (Ref: #${refUnica})`,
        cantidad: cryptoAmount,
        monedaCripto: cryptoType,
        montoFiat: fiatAmount,
        walletCliente: wallet
      });

      if(response.data.success) {
        setNumeroReferencia(refUnica);
        setOrdenCreada(true);
      }
    } catch (error) {
        setStatus('❌ Connection error.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthMsg('Creando cuenta...');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthMsg(error.message);
    else setAuthMsg('✅ Revisa tu correo para confirmar tu cuenta.');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthMsg('Iniciando...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMsg('❌ Datos incorrectos.');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '420px', position: 'relative' }}>
        
        {session && (
          <button onClick={() => supabase.auth.signOut()} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        )}
        
        <h1 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '34px', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px' }}>
          BARZCORP <span style={{color: '#2563eb'}}>EXCHANGE</span>
        </h1>

        {/* SI EL USUARIO NO TIENE SESIÓN Y QUIERE COMPRAR -> MOSTRAMOS LOGIN */}
        {mostrarLogin && !session ? (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            <p style={{textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>
              Para continuar con tu compra, por favor inicia sesión o crea una cuenta.
            </p>
            <form>
              <input type="email" placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
              <input type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSignIn} style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
                <button onClick={handleSignUp} style={{ flex: 1, padding: '12px', backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Registrarse</button>
              </div>
              <button onClick={() => setMostrarLogin(false)} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                ← Volver a la calculadora
              </button>
            </form>
            {authMsg && <p style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center', color: authMsg.includes('❌') ? 'red' : 'green' }}>{authMsg}</p>}
          </div>
        ) : !ordenCreada ? (
          /* PANTALLA PRINCIPAL: CALCULADORA */
          <div style={{ animation: 'fadeIn 0.3s' }}>
            <p style={{ textAlign: 'center', margin: '0 0 25px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              {cargandoPrecio ? "Connecting to live market..." : `1 ${cryptoType} = ${tasaDeCambio.toFixed(3)} EUR`}
            </p>
            
            <form onSubmit={handleBuyIntent}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>You send (EUR):</label>
                <input type="number" value={fiatAmount} onChange={(e) => setFiatAmount(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '18px', boxSizing: 'border-box', backgroundColor: '#f8fafc', color: '#0f172a' }} min="10" required />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>You get:</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <input type="text" value={cargandoPrecio ? "..." : cryptoAmount} disabled style={{ width: '70%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#e2e8f0', fontSize: '18px', boxSizing: 'border-box', color: '#0f172a', fontWeight: 'bold' }} />
                  <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ width: '30%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', cursor: 'pointer', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold' }}>
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>Your destination wallet address:</label>
                <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="Paste your receiving address here" style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8fafc', color: '#0f172a' }} required />
              </div>

              <button type="submit" disabled={cargandoPrecio || status.includes('Processing')} style={{ width: '100%', padding: '16px', backgroundColor: cargandoPrecio ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: cargandoPrecio ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
                {status.includes('Processing') ? 'Connecting...' : 'Buy Now'}
              </button>
            </form>
            {status && status.includes('❌') && <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{status}</div>}
          </div>
        ) : (
          /* INSTRUCCIONES DE PAGO */
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '25px' }}>
              ✅ Order Placed Successfully
            </div>
            
            <p style={{ color: '#475569', fontSize: '15px', marginBottom: '20px' }}>
              To receive your <strong>{cryptoAmount} {cryptoType}</strong>, please transfer exactly <strong>{fiatAmount} EUR</strong> using the details below:
            </p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Bank Name: <strong style={{ color: '#0f172a', float: 'right' }}>ING</strong></p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Beneficiary: <strong style={{ color: '#0f172a', float: 'right' }}>Barzcorp</strong></p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>IBAN: <strong style={{ color: '#0f172a', float: 'right' }}>NLXX BANK 0000 0000 00</strong></p>
              <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '15px 0' }} />
              <p style={{ margin: '0', fontSize: '15px', color: '#dc2626', fontWeight: 'bold' }}>Reference / Concept: <span style={{ float: 'right', fontSize: '18px' }}>#{numeroReferencia}</span></p>
            </div>
            
            <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Start New Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;