import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

// === SISTEMA DE TRADUCCIONES ===
const dict = {
  en: {
    navHome: "Home", navHow: "How it works", navAbout: "About Us", navContact: "Contact",
    btnSignIn: "Sign In", btnSignUp: "Sign Up", btnLogout: "Logout",
    heroTitle1: "Exchange Crypto ", heroTitle2: "easily and securely",
    heroSub: "Barzcorp offers fiat on-ramp and off-ramp services for private individuals and entities across the SEPA zone.",
    adv1: "✅ No hidden fees", adv2: "✅ SEPA Transfers",
    loginTitle: "Access your account", loginSub: "To continue operating, log in or create an account.",
    email: "Email address", pass: "Password", btnEnter: "Enter", btnRegister: "Register", backCalc: "← Back to calculator",
    tabBuy: "Buy", tabSell: "Sell",
    youSend: "You send", youGet: "You get",
    walletBuy: "Your destination wallet address:", walletSell: "Your IBAN to receive EUR:",
    btnBuy: "Buy", btnSell: "Sell",
    connecting: "Connecting...", processing: "Processing...",
    successBuy: "✅ Order Placed Successfully", successBuyText: "To receive your Crypto, transfer exactly",
    successSell: "✅ Sell Order Generated", successSellText: "To receive your EUR, please send exactly",
    bank: "Bank:", beneficiary: "Beneficiary:", ref: "Reference:", btnNewOp: "New Operation",
    buyBlocksTitle: "Get Your Money's worth!", buyBlocksSub: "Ready to buy crypto? See below how much your money can get you",
    pay: "Pay", get: "Get", buyNow: "Buy now →",
    aboutTitle: "About Barzcorp", 
    aboutIntro: "Barzcorp offers fiat on-ramp and off-ramp services (fiat-crypto-fiat) for private individuals and legal entities across the SEPA zone in Europe. Services are provided through different channels up to the customer’s choice:",
    aboutP2pTitle: "P2P Marketplace Platforms", aboutP2p: "We operate on major platforms (Binance, OKX, Bitget, Bybit etc.). This service channel is mostly suitable for private individuals looking for additional security through escrow services.",
    aboutRetailTitle: "Online Retail", aboutRetail: "Direct service through our website to the customer’s external wallet. This is a quick and reliable service without intermediaries, allowing on/off ramp using customer-managed wallets.",
    aboutOtcTitle: "OTC Desk", aboutOtc: "Tailored to meet the needs of high-volume traders and investors. Provides trust, speed, reliability, and a personal touch. Ensures fixed prices for your volume and protects from market price slippage.",
    howTitle: "Three simple steps",
    step1: "Create account", step1Sub: "Register and verify your identity.",
    step2: "Transfer funds", step2Sub: "Send funds securely via SEPA.",
    step3: "Receive Crypto", step3Sub: "Get your assets directly to your wallet.",
    contactTitle: "Contact Support", name: "Your Name", msg: "Your Message", btnSend: "Send Message",
    footerRight: "Netherlands.",
  },
  es: {
    navHome: "Inicio", navHow: "Cómo funciona", navAbout: "Sobre Nosotros", navContact: "Contacto",
    btnSignIn: "Iniciar sesión", btnSignUp: "Registrarse", btnLogout: "Salir",
    heroTitle1: "Intercambia Cripto de forma ", heroTitle2: "fácil y segura",
    heroSub: "Barzcorp ofrece servicios de entrada y salida de fiat (fiat-cripto-fiat) para particulares y empresas en toda la zona SEPA.",
    adv1: "✅ Sin comisiones ocultas", adv2: "✅ Transferencias SEPA",
    loginTitle: "Accede a tu cuenta", loginSub: "Para continuar operando, inicia sesión o crea una cuenta.",
    email: "Tu correo electrónico", pass: "Tu contraseña", btnEnter: "Entrar", btnRegister: "Registro", backCalc: "← Volver a la calculadora",
    tabBuy: "Comprar", tabSell: "Vender",
    youSend: "Tú envías", youGet: "Tú recibes",
    walletBuy: "Tu dirección de Wallet destino:", walletSell: "Tu cuenta IBAN para recibir EUR:",
    btnBuy: "Comprar", btnSell: "Vender",
    connecting: "Conectando...", processing: "Procesando...",
    successBuy: "✅ Orden Generada con Éxito", successBuyText: "Para recibir tus Criptos, transfiere exactamente",
    successSell: "✅ Orden de Venta Generada", successSellText: "Para recibir tus Euros, envía exactamente",
    bank: "Banco:", beneficiary: "Beneficiario:", ref: "Concepto:", btnNewOp: "Nueva Operación",
    buyBlocksTitle: "¡Sácale partido a tu dinero!", buyBlocksSub: "¿Listo para comprar cripto? Mira cuánto puedes obtener a continuación",
    pay: "Pagas", get: "Recibes", buyNow: "Comprar →",
    aboutTitle: "Sobre Barzcorp",
    aboutIntro: "Barzcorp ofrece servicios de entrada y salida de fiat (fiat-cripto-fiat) para particulares y entidades legales en toda la zona SEPA en Europa. Los servicios se brindan a través de diferentes canales a elección del cliente:",
    aboutP2pTitle: "Plataformas de Mercado P2P", aboutP2p: "Operamos en las principales plataformas (Binance, OKX, Bitget, Bybit, etc.). Este canal es ideal para particulares que buscan seguridad adicional a través del servicio de depósito en garantía (escrow).",
    aboutRetailTitle: "Comercio Minorista Online", aboutRetail: "Servicio directo a través de nuestro sitio web hacia la billetera externa del cliente. Es un servicio rápido y confiable sin intermediarios.",
    aboutOtcTitle: "Mesa OTC", aboutOtc: "Diseñado para satisfacer las necesidades de comerciantes e inversores de alto volumen. Brinda confianza, rapidez, confiabilidad y un trato personal, protegiendo contra el deslizamiento del mercado.",
    howTitle: "Tres simples pasos",
    step1: "Crea tu cuenta", step1Sub: "Regístrate y verifica tu identidad.",
    step2: "Haz tu transferencia", step2Sub: "Envía los fondos mediante transferencia SEPA.",
    step3: "Recibe tus Criptos", step3Sub: "Los activos llegarán a tu wallet personal.",
    contactTitle: "Contactar Soporte", name: "Tu Nombre", msg: "Tu Mensaje", btnSend: "Enviar Mensaje",
    footerRight: "Países Bajos.",
  }
};

// === NUEVO LOGO GEOMÉTRICO ===
const BarzcorpLogo = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

function App() {
  const [lang, setLang] = useState('en');
  const t = dict[lang];

  const [view, setView] = useState('home');
  const [session, setSession] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [authMsg, setAuthMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isBuying, setIsBuying] = useState(true);
  const [sendAmount, setSendAmount] = useState(100);
  const [cryptoType, setCryptoType] = useState('USDT');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [precioReal, setPrecioReal] = useState(0.95);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);
  const [ordenCreada, setOrdenCreada] = useState(false);
  const [numeroReferencia, setNumeroReferencia] = useState('');

  const margenGanancia = 1.03;
  const tasaCompra = precioReal * margenGanancia;
  const tasaVenta = precioReal * (1 - (margenGanancia - 1));

  const receiveAmount = isBuying 
    ? (tasaCompra > 0 ? (sendAmount / tasaCompra).toFixed(2) : 0) 
    : (tasaVenta > 0 ? (sendAmount * tasaVenta).toFixed(2) : 0);

  const blockAmounts = [100, 250, 500, 1000, 1500];

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
    else setAuthMsg(action === 'signup' ? '✅ Check email' : '');
  };

  const selectBlock = (amount) => {
    setSendAmount(amount);
    setIsBuying(true);
    setCryptoType('USDT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cryptoLogos = {
    USDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
    USDC: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png"
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#111827', color: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* EFECTOS CRISTALINOS DE FONDO */}
      <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(17,24,39,0) 60%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '20%', left: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(17,24,39,0) 60%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: 'rgba(31, 41, 55, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #374151', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px', cursor: 'pointer' }}>
          <BarzcorpLogo />
          BARZCORP
        </div>
        
        <div style={{ display: 'flex', gap: '20px', fontWeight: '500', color: '#9ca3af' }}>
          <span onClick={() => setView('home')} style={{cursor: 'pointer', color: view==='home'?'#10b981':'inherit'}}>{t.navHome}</span>
          <span onClick={() => setView('about')} style={{cursor: 'pointer', color: view==='about'?'#10b981':'inherit'}}>{t.navAbout}</span>
          <span onClick={() => setView('contact')} style={{cursor: 'pointer', color: view==='contact'?'#10b981':'inherit'}}>{t.navContact}</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#f3f4f6', cursor: 'pointer', fontWeight: 'bold' }}>
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          
          {session ? (
            <button onClick={() => supabase.auth.signOut()} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnLogout}</button>
          ) : (
            <button onClick={() => {setView('home'); setMostrarLogin(true)}} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#064e3b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnSignIn}</button>
          )}
        </div>
      </nav>

      {/* VISTAS DINÁMICAS */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        
        {/* VISTA: ABOUT US */}
        {view === 'about' && (
          <div style={{ animation: 'fadeIn 0.4s', padding: '80px 5%', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', color: '#ffffff', textAlign: 'center' }}>{t.aboutTitle}</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: '1.7', marginBottom: '50px', textAlign: 'center' }}>{t.aboutIntro}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', padding: '30px', borderRadius: '16px' }}>
                <h3 style={{ color: '#10b981', fontSize: '22px', marginBottom: '10px' }}>{t.aboutP2pTitle}</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{t.aboutP2p}</p>
              </div>
              <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', padding: '30px', borderRadius: '16px' }}>
                <h3 style={{ color: '#10b981', fontSize: '22px', marginBottom: '10px' }}>{t.aboutRetailTitle}</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{t.aboutRetail}</p>
              </div>
              <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', padding: '30px', borderRadius: '16px' }}>
                <h3 style={{ color: '#10b981', fontSize: '22px', marginBottom: '10px' }}>{t.aboutOtcTitle}</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{t.aboutOtc}</p>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: CONTACTO */}
        {view === 'contact' && (
          <div style={{ padding: '80px 5%', maxWidth: '500px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px', textAlign: 'center', color: '#ffffff' }}>{t.contactTitle}</h1>
            <form onSubmit={(e) => { e.preventDefault(); alert(lang==='en'?'Message sent!':'¡Mensaje enviado!'); }}>
              <input type="text" placeholder={t.name} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }} required />
              <input type="email" placeholder={t.email} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }} required />
              <textarea placeholder={t.msg} rows="5" style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }} required></textarea>
              <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: '#064e3b', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{t.btnSend}</button>
            </form>
          </div>
        )}

        {/* VISTA: INICIO */}
        {view === 'home' && (
          <>
            <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '60px 5%', gap: '40px' }}>
              <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1px', color: '#ffffff' }}>
                  {t.heroTitle1} <br/><span style={{color: '#10b981'}}>{t.heroTitle2}</span>
                </h1>
                <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '30px' }}>{t.heroSub}</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                   <span style={{ fontSize: '14px', color: '#d1d5db' }}>{t.adv1}</span>
                   <span style={{ fontSize: '14px', color: '#d1d5db' }}>{t.adv2}</span>
                </div>
              </div>

              {/* CALCULADORA */}
              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ backgroundColor: '#1f2937', padding: '40px', borderRadius: '24px', border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '420px' }}>
                  
                  {mostrarLogin && !session ? (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px', color: '#ffffff' }}>{t.loginTitle}</h3>
                      <p style={{textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginBottom: '20px'}}>{t.loginSub}</p>
                      <form>
                        <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                        <input type="password" placeholder={t.pass} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={(e) => handleAuth('signin', e)} style={{ flex: 1, padding: '14px', backgroundColor: '#10b981', color: '#064e3b', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnEnter}</button>
                          <button onClick={(e) => handleAuth('signup', e)} style={{ flex: 1, padding: '14px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnRegister}</button>
                        </div>
                        <button onClick={() => setMostrarLogin(false)} style={{ width: '100%', padding: '10px', marginTop: '15px', backgroundColor: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>{t.backCalc}</button>
                      </form>
                      {authMsg && <p style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center', color: authMsg.includes('❌') ? '#ef4444' : '#10b981' }}>{authMsg}</p>}
                    </div>
                  ) : !ordenCreada ? (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{ backgroundColor: '#111827', padding: '5px', borderRadius: '20px', display: 'flex', gap: '5px' }}>
                           <div onClick={() => setIsBuying(true)} style={{ padding: '8px 20px', backgroundColor: isBuying ? '#374151' : 'transparent', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', color: isBuying ? '#ffffff' : '#9ca3af' }}>{t.tabBuy}</div>
                           <div onClick={() => setIsBuying(false)} style={{ padding: '8px 20px', backgroundColor: !isBuying ? '#374151' : 'transparent', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', color: !isBuying ? '#ffffff' : '#9ca3af' }}>{t.tabSell}</div>
                        </div>
                      </div>

                      <form onSubmit={handleTransaction}>
                        <div style={{ marginBottom: '20px', backgroundColor: '#111827', padding: '15px', borderRadius: '16px', border: '1px solid #374151' }}>
                          <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>{t.youSend}</label>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} style={{ width: '50%', border: 'none', background: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#ffffff', outline: 'none' }} min="10" required />
                            {isBuying ? (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', backgroundColor: '#374151', color: '#ffffff', padding: '8px 12px', borderRadius: '10px' }}>💶 EUR</div>
                            ) : (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#374151', padding: '6px 12px', borderRadius: '10px' }}>
                                 <img src={cryptoLogos[cryptoType]} alt={cryptoType} width="20" />
                                 <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', color: '#ffffff', outline: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}>
                                   <option value="USDT">USDT</option>
                                   <option value="USDC">USDC</option>
                                 </select>
                               </div>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', margin: '-15px 0', position: 'relative', zIndex: 2 }}>
                          <div style={{ display: 'inline-block', backgroundColor: '#1f2937', padding: '8px', borderRadius: '50%', border: '1px solid #374151', color: '#10b981' }}>↓</div>
                        </div>

                        <div style={{ marginBottom: '20px', backgroundColor: '#111827', padding: '15px', borderRadius: '16px', border: '1px solid #374151' }}>
                          <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>{t.youGet}</label>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <input type="text" value={cargandoPrecio ? "..." : receiveAmount} disabled style={{ width: '50%', border: 'none', background: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#ffffff', outline: 'none' }} />
                            {!isBuying ? (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', backgroundColor: '#374151', color: '#ffffff', padding: '8px 12px', borderRadius: '10px' }}>💶 EUR</div>
                            ) : (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#374151', padding: '6px 12px', borderRadius: '10px' }}>
                                 <img src={cryptoLogos[cryptoType]} alt={cryptoType} width="20" />
                                 <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', color: '#ffffff', outline: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}>
                                   <option value="USDT">USDT</option>
                                   <option value="USDC">USDC</option>
                                 </select>
                               </div>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                          <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>{isBuying ? t.walletBuy : t.walletSell}</label>
                          <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="..." style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff', boxSizing: 'border-box' }} required />
                        </div>

                        <button type="submit" disabled={cargandoPrecio || status.includes('Procesando') || status.includes('Connecting')} style={{ width: '100%', padding: '18px', backgroundColor: cargandoPrecio ? '#374151' : '#10b981', color: '#064e3b', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: cargandoPrecio ? 'not-allowed' : 'pointer' }}>
                          {status ? status : (isBuying ? `${t.btnBuy} ${cryptoType}` : `${t.btnSell} ${cryptoType}`)}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '15px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '25px', border: '1px solid #10b981' }}>
                        {isBuying ? t.successBuy : t.successSell}
                      </div>
                      <p style={{ color: '#d1d5db', fontSize: '15px', marginBottom: '20px' }}>
                        {isBuying ? t.successBuyText : t.successSellText} <strong style={{color: '#ffffff'}}>{isBuying ? sendAmount : sendAmount} {isBuying ? 'EUR' : cryptoType}</strong> a:
                      </p>
                      <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
                        {isBuying ? (
                          <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>{t.bank} <strong style={{ color: '#ffffff', float: 'right' }}>ING</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>{t.beneficiary} <strong style={{ color: '#ffffff', float: 'right' }}>Barzcorp</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>IBAN: <strong style={{ color: '#ffffff', float: 'right' }}>NLXX INGB 0000 0000 00</strong></p>
                          </>
                        ) : (
                          <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>Red (Network): <strong style={{ color: '#ffffff', float: 'right' }}>TRC20 / ERC20</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>Wallet Barzcorp: <strong style={{ color: '#ffffff', float: 'right', fontSize: '11px' }}>0xTU_WALLET_CRIPTO_AQUI</strong></p>
                          </>
                        )}
                        <hr style={{ border: 'none', borderTop: '1px dashed #374151', margin: '15px 0' }} />
                        <p style={{ margin: '0', fontSize: '15px', color: '#10b981', fontWeight: 'bold' }}>{t.ref} <span style={{ float: 'right', fontSize: '18px', color: '#ffffff' }}>#{numeroReferencia}</span></p>
                      </div>
                      <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t.btnNewOp}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* SECCIÓN: BUY BLOCKS */}
            <section style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
               <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginBottom: '10px' }}>{t.buyBlocksTitle}</h2>
               <p style={{ color: '#9ca3af', marginBottom: '40px' }}>{t.buyBlocksSub}</p>
               
               <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                  {blockAmounts.map((amount, index) => (
                    <div key={index} style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '16px', padding: '25px', minWidth: '200px', flex: '1' }}>
                       <div style={{ backgroundColor: '#10b981', color: '#064e3b', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '20px' }}>
                         {index + 1}
                       </div>
                       <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '5px' }}>{t.pay}</p>
                       <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '20px' }}>{amount} <span style={{fontSize:'16px', color:'#9ca3af'}}>EUR</span></p>
                       
                       <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '5px' }}>{t.get}</p>
                       <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '30px' }}>{(amount / tasaCompra).toFixed(2)} <span style={{fontSize:'14px'}}>USDT</span></p>
                       
                       <button onClick={() => selectBlock(amount)} style={{ width: '100%', padding: '12px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
                         {t.buyNow}
                       </button>
                    </div>
                  ))}
               </div>
            </section>

            {/* SECCIÓN: CÓMO FUNCIONA */}
            <section style={{ padding: '80px 5%', textAlign: 'center' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', marginBottom: '50px' }}>{t.howTitle}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                <div style={{ flex: '1 1 250px', maxWidth: '300px', backgroundColor: '#1f2937', padding: '30px', borderRadius: '16px', border: '1px solid #374151' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
                  <h3 style={{ fontSize: '20px', color: '#ffffff', marginBottom: '10px' }}>{t.step1}</h3>
                  <p style={{ color: '#9ca3af' }}>{t.step1Sub}</p>
                </div>
                <div style={{ flex: '1 1 250px', maxWidth: '300px', backgroundColor: '#1f2937', padding: '30px', borderRadius: '16px', border: '1px solid #374151' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏦</div>
                  <h3 style={{ fontSize: '20px', color: '#ffffff', marginBottom: '10px' }}>{t.step2}</h3>
                  <p style={{ color: '#9ca3af' }}>{t.step2Sub}</p>
                </div>
                <div style={{ flex: '1 1 250px', maxWidth: '300px', backgroundColor: '#1f2937', padding: '30px', borderRadius: '16px', border: '1px solid #374151' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>💎</div>
                  <h3 style={{ fontSize: '20px', color: '#ffffff', marginBottom: '10px' }}>{t.step3}</h3>
                  <p style={{ color: '#9ca3af' }}>{t.step3Sub}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#111827', color: '#6b7280', padding: '40px 5%', textAlign: 'center', fontSize: '14px', borderTop: '1px solid #1f2937', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', fontSize: '20px', fontWeight: '900', color: '#ffffff' }}>
          <BarzcorpLogo /> BARZCORP
        </div>
        <p>Copyright © 2026 Barzcorp Exchange. {t.footerRight}</p>
      </footer>
    </div>
  );
}

export default App;