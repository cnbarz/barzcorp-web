import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const [mostrarLogin, setMostrarLogin] = useState(false);

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

  const handleBuyIntent = async (e) => {
    e.preventDefault();
    if (!session) {
      setMostrarLogin(true);
      return;
    }

    setStatus('Procesando tu orden...');
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
        setStatus('❌ Error de conexión.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthMsg('Creando cuenta...');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthMsg(error.message);
    else setAuthMsg('✅ Revisa tu correo para confirmar.');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthMsg('Iniciando...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMsg('❌ Datos incorrectos.');
  };

  // Función para ir al inicio al presionar "Iniciar Sesión" en el menú superior
  const scrollToLogin = () => {
    setMostrarLogin(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh' }}>
      
      {/* 1. BARRA DE NAVEGACIÓN (HEADER) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px' }}>
          BARZCORP <span style={{color: '#2563eb'}}>EXCHANGE</span>
        </div>
        
        {/* Menú visible solo en pantallas grandes (se esconde en móviles por simplicidad ahora) */}
        <div style={{ display: 'flex', gap: '30px', fontWeight: '500', color: '#475569', cursor: 'pointer' }}>
          <a href="#como-funciona" style={{textDecoration: 'none', color: 'inherit'}}>Cómo funciona</a>
          <a href="#ventajas" style={{textDecoration: 'none', color: 'inherit'}}>Ventajas</a>
        </div>

        <div>
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>{session.user.email}</span>
              <button onClick={() => supabase.auth.signOut()} style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={scrollToLogin} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#1e293b', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Iniciar sesión</button>
              <button onClick={scrollToLogin} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>Registrarse</button>
            </div>
          )}
        </div>
      </nav>

      {/* 2. SECCIÓN PRINCIPAL (HERO) */}
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '60px 5%', minHeight: '80vh', gap: '40px', background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
        
        {/* Columna Izquierda: Textos */}
        <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>
            ⚡ Más de 300 clientes satisfechos
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', color: '#0f172a', letterSpacing: '-2px' }}>
            Intercambia Cripto de forma <span style={{color: '#2563eb'}}>fácil y segura</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '30px' }}>
            Una interfaz clara, un proceso transparente y total cumplimiento legal. Usa Barzcorp para necesidades reales — desde enviar dinero a tus seres queridos hasta proteger tus ahorros.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
             <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>✅ Sin comisiones ocultas</span>
             <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>✅ Transferencias SEPA</span>
          </div>
        </div>

        {/* Columna Derecha: Calculadora / Login */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', position: 'relative' }}>
            
            {mostrarLogin && !session ? (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px' }}>Accede a tu cuenta</h3>
                <p style={{textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>
                  Para continuar operando, inicia sesión o crea una cuenta.
                </p>
                <form>
                  <input type="email" placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }} required />
                  <input type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }} required />
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleSignIn} style={{ flex: 1, padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Entrar</button>
                    <button onClick={handleSignUp} style={{ flex: 1, padding: '14px', backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Registro</button>
                  </div>
                  <button onClick={() => setMostrarLogin(false)} style={{ width: '100%', padding: '10px', marginTop: '15px', backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                    ← Volver a la calculadora
                  </button>
                </form>
                {authMsg && <p style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center', color: authMsg.includes('❌') ? 'red' : 'green' }}>{authMsg}</p>}
              </div>
            ) : !ordenCreada ? (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '20px', display: 'flex', gap: '5px' }}>
                     <div style={{ padding: '8px 20px', backgroundColor: '#ffffff', borderRadius: '15px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Comprar</div>
                     <div style={{ padding: '8px 20px', color: '#64748b', fontWeight: 'bold', cursor: 'not-allowed' }}>Vender</div>
                  </div>
                </div>

                <form onSubmit={handleBuyIntent}>
                  <div style={{ marginBottom: '20px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '5px' }}>Tú envías</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <input type="number" value={fiatAmount} onChange={(e) => setFiatAmount(e.target.value)} style={{ width: '60%', border: 'none', background: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#0f172a', outline: 'none' }} min="10" required />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        💶 EUR
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', margin: '-15px 0', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-block', backgroundColor: '#ffffff', padding: '8px', borderRadius: '50%', border: '1px solid #e2e8f0', color: '#2563eb' }}>↓</div>
                  </div>

                  <div style={{ marginBottom: '20px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '5px' }}>Tú recibes</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <input type="text" value={cargandoPrecio ? "..." : cryptoAmount} disabled style={{ width: '60%', border: 'none', background: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#0f172a', outline: 'none' }} />
                      <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', outline: 'none' }}>
                        <option value="USDT">🟢 USDT</option>
                        <option value="USDC">🔵 USDC</option>
                      </select>
                    </div>
                  </div>

                  <p style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '12px', color: '#94a3b8' }}>
                    {cargandoPrecio ? "Conectando al mercado..." : `1 ${cryptoType} = ${tasaDeCambio.toFixed(3)} EUR`}
                  </p>

                  <div style={{ marginBottom: '25px' }}>
                    <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="Pega tu dirección de Wallet aquí..." style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} required />
                  </div>

                  <button type="submit" disabled={cargandoPrecio || status.includes('Procesando')} style={{ width: '100%', padding: '18px', backgroundColor: cargandoPrecio ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: cargandoPrecio ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
                    {status.includes('Procesando') ? 'Conectando...' : `Comprar ${cryptoType}`}
                  </button>
                </form>
                {status && status.includes('❌') && <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{status}</div>}
              </div>
            ) : (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '25px' }}>
                  ✅ Orden Generada con Éxito
                </div>
                <p style={{ color: '#475569', fontSize: '15px', marginBottom: '20px' }}>
                  Para recibir tus <strong>{cryptoAmount} {cryptoType}</strong>, transfiere exactamente <strong>{fiatAmount} EUR</strong> a:
                </p>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Banco: <strong style={{ color: '#0f172a', float: 'right' }}>ING</strong></p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Beneficiario: <strong style={{ color: '#0f172a', float: 'right' }}>Barzcorp</strong></p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>IBAN: <strong style={{ color: '#0f172a', float: 'right' }}>NLXX INGB 0000 0000 00</strong></p>
                  <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '15px 0' }} />
                  <p style={{ margin: '0', fontSize: '15px', color: '#dc2626', fontWeight: 'bold' }}>Concepto: <span style={{ float: 'right', fontSize: '18px' }}>#{numeroReferencia}</span></p>
                </div>
                <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Nueva Operación
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. SECCIÓN: CÓMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '80px 5%', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '50px' }}>Tres simples pasos</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>1️⃣</div>
            <h3 style={{ fontSize: '20px', color: '#1e293b' }}>Crea tu cuenta</h3>
            <p style={{ color: '#64748b' }}>Regístrate en segundos y verifica tu identidad para operar con seguridad.</p>
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>2️⃣</div>
            <h3 style={{ fontSize: '20px', color: '#1e293b' }}>Haz tu transferencia</h3>
            <p style={{ color: '#64748b' }}>Envía los fondos mediante una transferencia bancaria SEPA a nuestra cuenta ING.</p>
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>3️⃣</div>
            <h3 style={{ fontSize: '20px', color: '#1e293b' }}>Recibe tus Criptos</h3>
            <p style={{ color: '#64748b' }}>Las criptomonedas llegarán directamente a tu wallet personal sin demoras.</p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 5%', textAlign: 'center', fontSize: '14px' }}>
        <div style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '900', color: '#ffffff' }}>BARZCORP</div>
        <p>Westerzicht 356, Vlissingen, Países Bajos.</p>
        <p>© 2026 Barzcorp Exchange. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default App;