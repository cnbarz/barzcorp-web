import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

// === SISTEMA DE TRADUCCIONES ===
const dict = {
  en: {
    navHome: "Home", navHow: "How it works", navAbout: "About Us", navContact: "Contact",
    btnSignIn: "Sign In", btnSignUp: "Sign Up", btnLogout: "Logout",
    heroTitle1: "Exchange Crypto ", heroTitle2: "easily and securely",
    heroSub: "A clear interface, transparent process, and total legal compliance. Use Barzcorp for real needs — from sending money to loved ones to protecting your savings.",
    adv1: "✅ No hidden fees", adv2: "✅ SEPA Transfers",
    loginTitle: "Access your account", loginSub: "To continue operating, log in or create an account.",
    email: "Email address", pass: "Password", btnEnter: "Enter", btnRegister: "Register", backCalc: "← Back to calculator",
    tabBuy: "Buy", tabSell: "Sell",
    youSend: "You send", youGet: "You get",
    walletBuy: "Your destination wallet address:", walletSell: "Your IBAN to receive EUR:",
    btnBuy: "Buy", btnSell: "Sell",
    connecting: "Connecting...", processing: "Processing...",
    successBuy: "✅ Order Placed Successfully",
    successBuyText: "To receive your Crypto, transfer exactly",
    successSell: "✅ Sell Order Generated",
    successSellText: "To receive your EUR, please send exactly",
    bank: "Bank:", beneficiary: "Beneficiary:", ref: "Reference:",
    btnNewOp: "New Operation",
    howTitle: "Three simple steps",
    step1: "Create account", step1Sub: "Register and verify your identity.",
    step2: "Transfer funds", step2Sub: "Send funds securely via SEPA.",
    step3: "Receive Crypto", step3Sub: "Get your assets directly to your wallet.",
    aboutTitle: "About Barzcorp", aboutText: "We are a digital asset exchange platform based in the Netherlands. Our mission is to provide a secure, fast, and compliant bridge between traditional finance and the crypto ecosystem.",
    contactTitle: "Contact Support", name: "Your Name", msg: "Your Message", btnSend: "Send Message",
    footerRight: "Netherlands.",
  },
  es: {
    navHome: "Inicio", navHow: "Cómo funciona", navAbout: "Sobre Nosotros", navContact: "Contacto",
    btnSignIn: "Iniciar sesión", btnSignUp: "Registrarse", btnLogout: "Salir",
    heroTitle1: "Intercambia Cripto de forma ", heroTitle2: "fácil y segura",
    heroSub: "Una interfaz clara, un proceso transparente y total cumplimiento legal. Usa Barzcorp para necesidades reales — desde enviar dinero a tus seres queridos hasta proteger tus ahorros.",
    adv1: "✅ Sin comisiones ocultas", adv2: "✅ Transferencias SEPA",
    loginTitle: "Accede a tu cuenta", loginSub: "Para continuar operando, inicia sesión o crea una cuenta.",
    email: "Tu correo electrónico", pass: "Tu contraseña", btnEnter: "Entrar", btnRegister: "Registro", backCalc: "← Volver a la calculadora",
    tabBuy: "Comprar", tabSell: "Vender",
    youSend: "Tú envías", youGet: "Tú recibes",
    walletBuy: "Tu dirección de Wallet destino:", walletSell: "Tu cuenta IBAN para recibir EUR:",
    btnBuy: "Comprar", btnSell: "Vender",
    connecting: "Conectando...", processing: "Procesando...",
    successBuy: "✅ Orden Generada con Éxito",
    successBuyText: "Para recibir tus Criptos, transfiere exactamente",
    successSell: "✅ Orden de Venta Generada",
    successSellText: "Para recibir tus Euros, envía exactamente",
    bank: "Banco:", beneficiary: "Beneficiario:", ref: "Concepto:",
    btnNewOp: "Nueva Operación",
    howTitle: "Tres simples pasos",
    step1: "Crea tu cuenta", step1Sub: "Regístrate y verifica tu identidad.",
    step2: "Haz tu transferencia", step2Sub: "Envía los fondos mediante transferencia SEPA.",
    step3: "Recibe tus Criptos", step3Sub: "Los activos llegarán a tu wallet personal.",
    aboutTitle: "Sobre Barzcorp", aboutText: "Somos una plataforma de intercambio de activos digitales con sede en los Países Bajos. Nuestra misión es ofrecer un puente seguro, rápido y regulado entre las finanzas tradicionales y el ecosistema cripto.",
    contactTitle: "Contactar Soporte", name: "Tu Nombre", msg: "Tu Mensaje", btnSend: "Enviar Mensaje",
    footerRight: "Países Bajos.",
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const t = dict[lang];

  const [view, setView] = useState('home'); // 'home', 'about', 'contact'
  const [session, setSession] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [authMsg, setAuthMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados del Exchange
  const [isBuying, setIsBuying] = useState(true); // true = Buy, false = Sell
  const [sendAmount, setSendAmount] = useState(100);
  const [cryptoType, setCryptoType] = useState('USDT');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [precioReal, setPrecioReal] = useState(0.95);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);
  const [ordenCreada, setOrdenCreada] = useState(false);
  const [numeroReferencia, setNumeroReferencia] = useState('');

  // Margen: 3% ganancia en ambos sentidos
  const tasaCompra = precioReal * 1.03; // El cliente paga más caro
  const tasaVenta = precioReal * 0.97;  // El cliente recibe menos

  // Cálculo dinámico
  const receiveAmount = isBuying 
    ? (tasaCompra > 0 ? (sendAmount / tasaCompra).toFixed(2) : 0) 
    : (tasaVenta > 0 ? (sendAmount * tasaVenta).toFixed(2) : 0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    const obtenerPrecioMercado = async () => {
      setCargandoPrecio(true);
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=eur');
        const precio = cryptoType === 'USDT' ? response.data.tether.eur : response.data['usd-coin'].eur;
        setPrecioReal(precio);
      } catch (error) {
        setPrecioReal(0.95); 
      }
      setCargandoPrecio(false);
    };
    obtenerPrecioMercado();
  }, [cryptoType]);

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!session) {
      setMostrarLogin(true);
      return;
    }
    setStatus(t.processing);
    const refUnica = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const response = await axios.post('https://barzcorp-api.onrender.com/nueva-orden', {
        nombreCliente: `${session.user.email} (Ref: #${refUnica}) - TIPO: ${isBuying ? 'COMPRA' : 'VENTA'}`,
        cantidad: isBuying ? receiveAmount : sendAmount,
        monedaCripto: cryptoType,
        montoFiat: isBuying ? sendAmount : receiveAmount,
        walletCliente: wallet
      });

      if(response.data.success) {
        setNumeroReferencia(refUnica);
        setOrdenCreada(true);
      }
    } catch (error) {
        setStatus('❌ Error');
    }
  };

  const handleAuth = async (action, e) => {
    e.preventDefault();
    setAuthMsg(t.processing);
    const { error } = action === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) setAuthMsg(`❌ ${error.message}`);
    else setAuthMsg(action === 'signup' ? '✅ Revisa tu correo' : '');
  };

  const cryptoLogos = {
    USDT: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024",
    USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=024"
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px', cursor: 'pointer' }}>
          BARZCORP <span style={{color: '#2563eb'}}>EXCHANGE</span>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', fontWeight: '500', color: '#475569' }}>
          <span onClick={() => setView('home')} style={{cursor: 'pointer'}}>{t.navHome}</span>
          <span onClick={() => setView('about')} style={{cursor: 'pointer'}}>{t.navAbout}</span>
          <span onClick={() => setView('contact')} style={{cursor: 'pointer'}}>{t.navContact}</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: 'bold' }}>
            {lang === 'en' ? '🇪🇸 ES' : '🇬🇧 EN'}
          </button>
          
          {session ? (
            <button onClick={() => supabase.auth.signOut()} style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnLogout}</button>
          ) : (
            <button onClick={() => {setView('home'); setMostrarLogin(true)}} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnSignIn}</button>
          )}
        </div>
      </nav>

      {/* VISTAS DINÁMICAS */}
      <div style={{ flex: 1 }}>
        {view === 'about' && (
          <div style={{ padding: '80px 5%', maxWidth: '800px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '20px', color: '#0f172a' }}>{t.aboutTitle}</h1>
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.8' }}>{t.aboutText}</p>
          </div>
        )}

        {view === 'contact' && (
          <div style={{ padding: '80px 5%', maxWidth: '500px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>{t.contactTitle}</h1>
            <form onSubmit={(e) => { e.preventDefault(); alert(lang==='en'?'Message sent!':'¡Mensaje enviado!'); }}>
              <input type="text" placeholder={t.name} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #cbd5e1' }} required />
              <input type="email" placeholder={t.email} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #cbd5e1' }} required />
              <textarea placeholder={t.msg} rows="5" style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #cbd5e1' }} required></textarea>
              <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{t.btnSend}</button>
            </form>
          </div>
        )}

        {view === 'home' && (
          <>
            {/* HERO & CALCULATOR */}
            <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '60px 5%', gap: '40px', background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
              <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-2px' }}>
                  {t.heroTitle1} <span style={{color: '#2563eb'}}>{t.heroTitle2}</span>
                </h1>
                <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '30px' }}>{t.heroSub}</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                   <span style={{ fontSize: '14px', color: '#64748b' }}>{t.adv1}</span>
                   <span style={{ fontSize: '14px', color: '#64748b' }}>{t.adv2}</span>
                </div>
              </div>

              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px' }}>
                  
                  {mostrarLogin && !session ? (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px' }}>{t.loginTitle}</h3>
                      <p style={{textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>{t.loginSub}</p>
                      <form>
                        <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #cbd5e1' }} required />
                        <input type="password" placeholder={t.pass} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #cbd5e1' }} required />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={(e) => handleAuth('signin', e)} style={{ flex: 1, padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnEnter}</button>
                          <button onClick={(e) => handleAuth('signup', e)} style={{ flex: 1, padding: '14px', backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnRegister}</button>
                        </div>
                        <button onClick={() => setMostrarLogin(false)} style={{ width: '100%', padding: '10px', marginTop: '15px', backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer' }}>{t.backCalc}</button>
                      </form>
                      {authMsg && <p style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center', color: authMsg.includes('❌') ? 'red' : 'green' }}>{authMsg}</p>}
                    </div>
                  ) : !ordenCreada ? (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      
                      {/* TABS COMPRAR/VENDER */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '20px', display: 'flex', gap: '5px' }}>
                           <div onClick={() => setIsBuying(true)} style={{ padding: '8px 20px', backgroundColor: isBuying ? '#ffffff' : 'transparent', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: isBuying ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', color: isBuying ? '#0f172a' : '#64748b' }}>
                             {t.tabBuy}
                           </div>
                           <div onClick={() => setIsBuying(false)} style={{ padding: '8px 20px', backgroundColor: !isBuying ? '#ffffff' : 'transparent', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: !isBuying ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', color: !isBuying ? '#0f172a' : '#64748b' }}>
                             {t.tabSell}
                           </div>
                        </div>
                      </div>

                      <form onSubmit={handleTransaction}>
                        <div style={{ marginBottom: '20px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '5px' }}>{t.youSend}</label>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} style={{ width: '50%', border: 'none', background: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#0f172a', outline: 'none' }} min="10" required />
                            
                            {isBuying ? (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '10px' }}>💶 EUR</div>
                            ) : (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '10px' }}>
                                 <img src={cryptoLogos[cryptoType]} alt={cryptoType} width="20" />
                                 <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}>
                                   <option value="USDT">USDT</option>
                                   <option value="USDC">USDC</option>
                                 </select>
                               </div>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', margin: '-15px 0', position: 'relative', zIndex: 2 }}>
                          <div style={{ display: 'inline-block', backgroundColor: '#ffffff', padding: '8px', borderRadius: '50%', border: '1px solid #e2e8f0', color: '#2563eb' }}>↓</div>
                        </div>

                        <div style={{ marginBottom: '20px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '5px' }}>{t.youGet}</label>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <input type="text" value={cargandoPrecio ? "..." : receiveAmount} disabled style={{ width: '50%', border: 'none', background: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#0f172a', outline: 'none' }} />
                            
                            {!isBuying ? (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '10px' }}>💶 EUR</div>
                            ) : (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '10px' }}>
                                 <img src={cryptoLogos[cryptoType]} alt={cryptoType} width="20" />
                                 <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}>
                                   <option value="USDT">USDT</option>
                                   <option value="USDC">USDC</option>
                                 </select>
                               </div>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                          <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '8px' }}>{isBuying ? t.walletBuy : t.walletSell}</label>
                          <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="..." style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
                        </div>

                        <button type="submit" disabled={cargandoPrecio || status.includes('Procesando') || status.includes('Connecting')} style={{ width: '100%', padding: '18px', backgroundColor: cargandoPrecio ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: cargandoPrecio ? 'not-allowed' : 'pointer' }}>
                          {status ? status : (isBuying ? `${t.btnBuy} ${cryptoType}` : `${t.btnSell} ${cryptoType}`)}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                      <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '25px' }}>
                        {isBuying ? t.successBuy : t.successSell}
                      </div>
                      
                      <p style={{ color: '#475569', fontSize: '15px', marginBottom: '20px' }}>
                        {isBuying ? t.successBuyText : t.successSellText} <strong>{isBuying ? sendAmount : sendAmount} {isBuying ? 'EUR' : cryptoType}</strong> a:
                      </p>
                      
                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
                        {isBuying ? (
                          <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>{t.bank} <strong style={{ color: '#0f172a', float: 'right' }}>ING</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>{t.beneficiary} <strong style={{ color: '#0f172a', float: 'right' }}>Barzcorp</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>IBAN: <strong style={{ color: '#0f172a', float: 'right' }}>NLXX INGB 0000 0000 00</strong></p>
                          </>
                        ) : (
                          <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Red (Network): <strong style={{ color: '#0f172a', float: 'right' }}>TRC20 / ERC20</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Wallet Barzcorp: <strong style={{ color: '#0f172a', float: 'right', fontSize: '11px' }}>0xTU_WALLET_CRIPTO_AQUI</strong></p>
                          </>
                        )}
                        <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '15px 0' }} />
                        <p style={{ margin: '0', fontSize: '15px', color: '#dc2626', fontWeight: 'bold' }}>{t.ref} <span style={{ float: 'right', fontSize: '18px' }}>#{numeroReferencia}</span></p>
                      </div>
                      
                      <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t.btnNewOp}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <section style={{ padding: '80px 5%', backgroundColor: '#ffffff', textAlign: 'center' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '50px' }}>{t.howTitle}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>1️⃣</div>
                  <h3 style={{ fontSize: '20px', color: '#1e293b' }}>{t.step1}</h3>
                  <p style={{ color: '#64748b' }}>{t.step1Sub}</p>
                </div>
                <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>2️⃣</div>
                  <h3 style={{ fontSize: '20px', color: '#1e293b' }}>{t.step2}</h3>
                  <p style={{ color: '#64748b' }}>{t.step2Sub}</p>
                </div>
                <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>3️⃣</div>
                  <h3 style={{ fontSize: '20px', color: '#1e293b' }}>{t.step3}</h3>
                  <p style={{ color: '#64748b' }}>{t.step3Sub}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 5%', textAlign: 'center', fontSize: '14px' }}>
        <div style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '900', color: '#ffffff' }}>BARZCORP</div>
        <p>Copyright © 2026 Barzcorp Exchange. {t.footerRight}</p>
      </footer>

    </div>
  );
}

export default App;