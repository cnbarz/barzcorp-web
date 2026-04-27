import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

// === SISTEMA DE TRADUCCIONES FRONTEND ===
const dict = {
  en: {
    navHome: "Home", navHow: "How it works", navAbout: "About Us", navContact: "Contact", navFaq: "FAQ",
    btnSignIn: "Sign In", btnSignUp: "Sign Up", btnLogout: "Logout",
    heroTitle1: "Exchange Crypto ", heroTitle2: "easily and securely",
    heroSub: "Barzcorp offers fiat on-ramp and off-ramp services for private individuals and entities across the SEPA zone.",
    adv1: "✅ No hidden fees", adv2: "✅ SEPA Transfers",
    loginTitle: "Welcome Back", loginSub: "Log in to your account to continue.",
    regTitle: "Create Account", regSub: "Join us to start exchanging securely.",
    resetTitle: "Reset Password", resetSub: "Enter your email to receive a recovery link.",
    firstName: "First Name", lastName: "Last Name", currencyLabel: "Preferred Currency",
    email: "Email address", pass: "Password", btnEnter: "Login", btnRegister: "Create Account", btnReset: "Send Recovery Link",
    backCalc: "← Back to calculator", backLogin: "← Back to Login",
    toggleToReg: "Don't have an account? Sign Up", toggleToLog: "Already have an account? Sign In", forgotPass: "Forgot your password?",
    fillAll: "Please fill all fields.", checkEmail: "Enter the 6-digit code sent to your email.", resetSuccess: "✅ Recovery link sent to your email.",
    agreeTerms: "I accept the ", termsLink: "Terms of Use", mustAccept: "You must accept the Terms of Use to register.",
    otpTitle: "Verify Your Email", otpSub: "We've sent a 6-digit code to your email.", btnVerify: "Verify Code",
    tabBuy: "Buy", tabSell: "Sell",
    youSend: "You send", youGet: "You get",
    walletBuy: "Your destination wallet address:", walletSell: "Your IBAN to receive EUR:",
    btnBuy: "Buy", btnSell: "Sell",
    connecting: "Connecting...", processing: "Processing...",
    successBuy: "✅ Order Placed Successfully", successBuyText: "To receive your Crypto, transfer exactly",
    successSell: "✅ Sell Order Generated", successSellText: "To receive your EUR, please send exactly",
    bank: "Bank:", beneficiary: "Beneficiary:", ref: "Reference:", btnNewOp: "New Operation",
    buyBlocksTitle: "Get Your Money's worth!", buyBlocksSub: "Ready to buy crypto? See below how much your money can get you",
    pay: "Pay", get: "Get", buyNow: "Buy now →", feeLabel: "Fee applied:",
    p2pTitle: "Also available on P2P Platforms", p2pSub: "Prefer using escrow? Trade with our verified merchant accounts on major exchanges.",
    verified: "✓ Verified Merchant", tradeOn: "Trade on",
    aboutTitle: "About Barzcorp", aboutIntro: "Barzcorp offers fiat on-ramp and off-ramp services across the SEPA zone.",
    termsTitle: "Terms of Use", termsText: "Welcome to Barzcorp. By using our services to buy or sell digital assets, you agree to comply with European AML directives. Funds must come from an account in your own name. Third-party transfers will be refunded minus processing fees. We are not responsible for funds sent to incorrect wallet addresses.",
    howTitle: "Three simple steps",
    step1: "Create account", step1Sub: "Register and verify your identity.",
    step2: "Transfer funds", step2Sub: "Send funds securely via SEPA.",
    step3: "Receive Crypto", step3Sub: "Get your assets directly to your wallet.",
    contactTitle: "Contact Support", name: "Your Name", msg: "Your Message", btnSend: "Send Message",
    faqTitle: "Frequently Asked Questions",
    footerRight: "Netherlands.",
  },
  es: {
    navHome: "Inicio", navHow: "Cómo funciona", navAbout: "Sobre Nosotros", navContact: "Contacto", navFaq: "FAQ",
    btnSignIn: "Iniciar sesión", btnSignUp: "Registrarse", btnLogout: "Salir",
    heroTitle1: "Intercambia Cripto de forma ", heroTitle2: "fácil y segura",
    heroSub: "Barzcorp ofrece servicios de entrada y salida de fiat (fiat-cripto-fiat) para particulares y empresas en toda la zona SEPA.",
    adv1: "✅ Sin comisiones ocultas", adv2: "✅ Transferencias SEPA",
    loginTitle: "Bienvenido de nuevo", loginSub: "Inicia sesión en tu cuenta para continuar.",
    regTitle: "Crea tu Cuenta", regSub: "Únete para operar de forma segura.",
    resetTitle: "Restablecer Contraseña", resetSub: "Ingresa tu correo para recibir un enlace de recuperación.",
    firstName: "Nombre", lastName: "Apellido", currencyLabel: "Moneda",
    email: "Tu correo electrónico", pass: "Tu contraseña", btnEnter: "Entrar", btnRegister: "Crear Cuenta", btnReset: "Enviar Enlace",
    backCalc: "← Volver a la calculadora", backLogin: "← Volver al inicio de sesión",
    toggleToReg: "¿No tienes cuenta? Regístrate", toggleToLog: "¿Ya tienes cuenta? Inicia Sesión", forgotPass: "¿Olvidaste tu contraseña?",
    fillAll: "Por favor llena todos los campos.", checkEmail: "Ingresa el código de 6 dígitos enviado a tu correo.", resetSuccess: "✅ Enlace enviado a tu correo.",
    agreeTerms: "Acepto los ", termsLink: "Términos de Uso", mustAccept: "Debes aceptar los Términos de Uso para registrarte.",
    otpTitle: "Verifica tu correo", otpSub: "Te hemos enviado un código de 6 dígitos.", btnVerify: "Verificar Código",
    tabBuy: "Comprar", tabSell: "Vender",
    youSend: "Tú envías", youGet: "Tú recibes",
    walletBuy: "Tu dirección de Wallet destino:", walletSell: "Tu cuenta IBAN para recibir EUR:",
    btnBuy: "Comprar", btnSell: "Vender",
    connecting: "Conectando...", processing: "Procesando...",
    successBuy: "✅ Orden Generada con Éxito", successBuyText: "Para recibir tus Criptos, transfiere exactamente",
    successSell: "✅ Orden de Venta Generada", successSellText: "Para recibir tus Euros, envía exactamente",
    bank: "Banco:", beneficiary: "Beneficiario:", ref: "Concepto:", btnNewOp: "Nueva Operación",
    buyBlocksTitle: "¡Sácale partido a tu dinero!", buyBlocksSub: "¿Listo para comprar cripto? Mira cuánto puedes obtener a continuación",
    pay: "Pagas", get: "Recibes", buyNow: "Comprar →", feeLabel: "Comisión:",
    p2pTitle: "También en Plataformas P2P", p2pSub: "¿Prefieres usar garantías? Opera con nuestras cuentas de comerciante verificado en los principales exchanges.",
    verified: "✓ Comerciante Verificado", tradeOn: "Operar en",
    aboutTitle: "Sobre Barzcorp", aboutIntro: "Barzcorp ofrece servicios de entrada y salida de fiat en toda la zona SEPA.",
    termsTitle: "Términos de Uso", termsText: "Bienvenido a Barzcorp. Al usar nuestros servicios, aceptas cumplir con las normativas europeas AML. Los fondos deben provenir de una cuenta a tu nombre. Las transferencias de terceros serán devueltas descontando tarifas. No nos hacemos responsables por envíos a direcciones incorrectas provistas por el usuario.",
    howTitle: "Tres simples pasos",
    step1: "Crea tu cuenta", step1Sub: "Regístrate y verifica tu identidad.",
    step2: "Haz tu transferencia", step2Sub: "Envía los fondos mediante transferencia SEPA.",
    step3: "Recibe tus Criptos", step3Sub: "Los activos llegarán a tu wallet personal.",
    contactTitle: "Contactar Soporte", name: "Tu Nombre", msg: "Tu Mensaje", btnSend: "Enviar Mensaje",
    faqTitle: "Preguntas Frecuentes",
    footerRight: "Países Bajos.",
  }
};

const faqs = {
  en: [
    { q: "How long does the verification (KYC) take?", a: "Our automated system verifies your documents in less than 5 minutes." },
    { q: "What are the fees?", a: "We charge a transparent fee based on your volume tier. Rates start at 1.5% and drop to 0.5% for high volumes." },
    { q: "How fast will I receive my crypto/fiat?", a: "Once your SEPA transfer arrives, crypto is dispatched immediately." }
  ],
  es: [
    { q: "¿Cuánto tarda la verificación (KYC)?", a: "Nuestro sistema automatizado verifica tus documentos en menos de 5 minutos." },
    { q: "¿Cuáles son las comisiones?", a: "Cobramos una tarifa transparente. Las tasas comienzan en 1.5% y bajan hasta el 0.5% para grandes volúmenes." },
    { q: "¿Qué tan rápido recibiré mi dinero/cripto?", a: "Una vez que llega tu transferencia SEPA, enviamos la cripto de inmediato." }
  ]
};

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

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [view, setView] = useState('home');
  const [session, setSession] = useState(null);
  
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [isSignUpView, setIsSignUpView] = useState(false);
  const [isResetView, setIsResetView] = useState(false); 
  const [authMsg, setAuthMsg] = useState('');
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isBuying, setIsBuying] = useState(true);
  const [cryptoType, setCryptoType] = useState('USDT');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [precioReal, setPrecioReal] = useState(0.95);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);
  const [ordenCreada, setOrdenCreada] = useState(false);
  const [numeroReferencia, setNumeroReferencia] = useState('');

  const [fiatInput, setFiatInput] = useState('100');
  const [cryptoInput, setCryptoInput] = useState('');
  const [activeTier, setActiveTier] = useState('1.5%');

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

  useEffect(() => {
    if (!cargandoPrecio) handleFiatChange(fiatInput);
  }, [precioReal, isBuying]);

  const calcularTasas = (montoEuros) => {
    let margen = 1.015; 
    let porcentajeMostrar = "1.5%";
    if (montoEuros >= 1500) { margen = 1.005; porcentajeMostrar = "0.5%"; } 
    else if (montoEuros >= 500) { margen = 1.01; porcentajeMostrar = "1.0%"; }
    return { tasaCompra: precioReal * margen, tasaVenta: precioReal * (2 - margen), porcentajeMostrar };
  };

  const handleFiatChange = (value) => {
    setFiatInput(value);
    const numValue = Number(value);
    if (numValue > 0) {
      const { tasaCompra, tasaVenta, porcentajeMostrar } = calcularTasas(numValue);
      setActiveTier(porcentajeMostrar);
      if (isBuying) {
        setCryptoInput((numValue / tasaCompra).toFixed(2));
      } else {
        setCryptoInput((numValue / tasaVenta).toFixed(2));
      }
    } else {
      setCryptoInput('');
    }
  };

  const handleCryptoChange = (value) => {
    setCryptoInput(value);
    const numValue = Number(value);
    if (numValue > 0) {
      const approxFiat = numValue * precioReal; 
      const { tasaCompra, tasaVenta, porcentajeMostrar } = calcularTasas(approxFiat);
      setActiveTier(porcentajeMostrar);
      if (isBuying) {
        setFiatInput((numValue * tasaCompra).toFixed(2));
      } else {
        setFiatInput((numValue * tasaVenta).toFixed(2));
      }
    } else {
      setFiatInput('');
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!session) { setMostrarLogin(true); return; }
    setStatus(t.processing);
    const refUnica = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const response = await axios.post('https://barzcorp-api.onrender.com/nueva-orden', {
        nombreCliente: `${session.user.user_metadata?.first_name || session.user.email} (Ref: #${refUnica}) - TYPE: ${isBuying ? 'BUY' : 'SELL'}`,
        cantidad: isBuying ? cryptoInput : fiatInput,
        monedaCripto: cryptoType,
        montoFiat: isBuying ? fiatInput : cryptoInput,
        walletCliente: wallet
      });

      if(response.data.success) {
        setNumeroReferencia(refUnica);
        setOrdenCreada(true);
      }
    } catch (error) {
        setStatus('❌ Network Error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAuthMsg(t.processing);
    if (!email) return setAuthMsg(`❌ ${t.fillAll}`);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setAuthMsg(`❌ ${error.message}`); else setAuthMsg(t.resetSuccess);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMsg(t.processing);

    if (isSignUpView) {
      if (!firstName || !lastName || !email || !password) return setAuthMsg(`❌ ${t.fillAll}`);
      if (!acceptTerms) return setAuthMsg(`❌ ${t.mustAccept}`);

      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { first_name: firstName, last_name: lastName, currency: currency } }
      });
      
      if (error) {
        setAuthMsg(`❌ ${error.message}`);
      } else {
        setAuthMsg('');
        setShowOtpModal(true); 
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthMsg(`❌ ${error.message}`);
      else { setAuthMsg(''); setMostrarLogin(false); setIsResetView(false); }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthMsg(t.processing);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'signup'
    });
    if (error) {
      setAuthMsg(`❌ ${error.message}`);
    } else {
      setAuthMsg('');
      setShowOtpModal(false);
      setMostrarLogin(false);
    }
  };

  const selectBlock = (amount) => {
    setIsBuying(true);
    setCryptoType('USDT');
    handleFiatChange(amount.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cryptoLogos = {
    USDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
    USDC: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png"
  };

  const userName = session?.user?.user_metadata?.first_name 
    ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name || ''}`
    : session?.user?.email;

  const boxStyle = {
    display: 'flex', backgroundColor: '#111827', border: '1px solid #374151',
    borderRadius: '16px', padding: '8px', alignItems: 'center', justifyContent: 'space-between'
  };

  const inputStyle = {
    flex: 1, background: 'transparent', border: 'none', color: '#ffffff',
    fontSize: '24px', fontWeight: 'bold', outline: 'none', padding: '10px', width: '100%'
  };

  const labelStyle = {
    width: '120px', height: '45px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', backgroundColor: '#374151',
    color: '#ffffff', borderRadius: '10px', fontWeight: 'bold', flexShrink: 0
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#111827', color: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', top: 0, left: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(17,24,39,0) 70%)', filter: 'blur(60px)', transform: `translateY(${scrollY * 0.15}px)` }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-20%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(17,24,39,0) 70%)', filter: 'blur(60px)', transform: `translateY(${scrollY * -0.1}px)` }} />
        <svg viewBox="0 0 1440 320" style={{ position: 'absolute', top: '20%', width: '100%', transform: `translateY(${scrollY * -0.25}px)`, opacity: 0.05, transition: 'transform 0.1s ease-out' }}>
          <path fill="#10b981" d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,112C672,117,768,171,864,197.3C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px', cursor: 'pointer' }}>
          <BarzcorpLogo /> BARZCORP
        </div>
        
        <div style={{ display: 'flex', gap: '25px', fontWeight: '500', color: '#9ca3af' }}>
          <span onClick={() => setView('home')} style={{cursor: 'pointer', color: view==='home'?'#10b981':'inherit'}}>{t.navHome}</span>
          <span onClick={() => setView('about')} style={{cursor: 'pointer', color: view==='about'?'#10b981':'inherit'}}>{t.navAbout}</span>
          <span onClick={() => setView('faq')} style={{cursor: 'pointer', color: view==='faq'?'#10b981':'inherit'}}>{t.navFaq}</span>
          <span onClick={() => setView('contact')} style={{cursor: 'pointer', color: view==='contact'?'#10b981':'inherit'}}>{t.navContact}</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#f3f4f6', cursor: 'pointer', fontWeight: 'bold' }}>
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block'}}></span>
                {userName}
              </span>
              <button onClick={() => supabase.auth.signOut()} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnLogout}</button>
            </div>
          ) : (
            <button onClick={() => {setView('home'); setIsSignUpView(false); setIsResetView(false); setMostrarLogin(true);}} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#064e3b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.btnSignIn}</button>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        
        {view === 'terms' && (
          <div style={{ padding: '80px 5%', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '40px', color: '#ffffff', textAlign: 'center' }}>{t.termsTitle}</h1>
            <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', padding: '30px', borderRadius: '16px', color: '#d1d5db', lineHeight: '1.8' }}>
              {t.termsText}
            </div>
          </div>
        )}

        {view === 'faq' && (
          <div style={{ padding: '80px 5%', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '40px', color: '#ffffff', textAlign: 'center' }}>{t.faqTitle}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {faqs[lang].map((faq, index) => (
                <div key={index} style={{ backgroundColor: '#1f2937', border: '1px solid #374151', padding: '25px', borderRadius: '16px' }}>
                  <h3 style={{ color: '#10b981', fontSize: '18px', marginBottom: '10px' }}>Q: {faq.q}</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'about' && (
          <div style={{ animation: 'fadeIn 0.4s', padding: '80px 5%', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', color: '#ffffff', textAlign: 'center' }}>{t.aboutTitle}</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: '1.7', marginBottom: '50px', textAlign: 'center' }}>{t.aboutIntro}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.7)', border: '1px solid #374151', padding: '30px', borderRadius: '16px' }}>
                <h3 style={{ color: '#10b981', fontSize: '22px', marginBottom: '10px' }}>{t.aboutRetailTitle}</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{t.aboutRetail}</p>
              </div>
            </div>
          </div>
        )}

        {showOtpModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              <h2 style={{ color: '#111827', margin: '0 0 10px 0', fontSize: '28px' }}>{t.otpTitle}</h2>
              <p style={{ color: '#475569', marginBottom: '30px' }}>{t.otpSub}</p>
              <form onSubmit={handleVerifyOtp}>
                <input 
                  type="text" 
                  maxLength="6" 
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ width: '80%', letterSpacing: '10px', textAlign: 'center', fontSize: '32px', padding: '15px', borderRadius: '12px', border: '2px solid #cbd5e1', marginBottom: '25px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} 
                  placeholder="------"
                  required 
                />
                <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' }}>
                  {t.btnVerify}
                </button>
              </form>
              {authMsg && <p style={{ marginTop: '15px', color: '#ef4444', fontWeight: 'bold' }}>{authMsg}</p>}
            </div>
          </div>
        )}

        {view === 'home' && (
          <>
            <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '60px 5%', gap: '40px' }}>
              <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1px', color: '#ffffff' }}>
                  {t.heroTitle1} <br/><span style={{color: '#10b981'}}>{t.heroTitle2}</span>
                </h1>
                <p style={{ fontSize: '20px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '30px' }}>{t.heroSub}</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                   <span style={{ fontSize: '15px', color: '#d1d5db', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px' }}>{t.adv1}</span>
                   <span style={{ fontSize: '15px', color: '#d1d5db', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px' }}>{t.adv2}</span>
                </div>
              </div>

              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.7)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '420px' }}>
                  
                  {mostrarLogin && !session ? (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      {isResetView ? (
                         <div style={{ animation: 'fadeIn 0.3s' }}>
                           <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '5px', color: '#ffffff' }}>{t.resetTitle}</h3>
                           <p style={{textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginBottom: '20px'}}>{t.resetSub}</p>
                           <form onSubmit={handleResetPassword}>
                             <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                             <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#064e3b', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>{t.btnReset}</button>
                           </form>
                           <div style={{ textAlign: 'center' }}>
                             <button onClick={() => setIsResetView(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px' }}>{t.backLogin}</button>
                           </div>
                         </div>
                      ) : (
                        <>
                          <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '5px', color: '#ffffff' }}>{isSignUpView ? t.regTitle : t.loginTitle}</h3>
                          <p style={{textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginBottom: '20px'}}>{isSignUpView ? t.regSub : t.loginSub}</p>
                          
                          <form onSubmit={handleAuth}>
                            {isSignUpView && (
                              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input type="text" placeholder={t.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '50%', padding: '14px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                                <input type="text" placeholder={t.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '50%', padding: '14px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                              </div>
                            )}
                            
                            <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                            <input type="password" placeholder={t.pass} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} required />
                            
                            {isSignUpView && (
                              <>
                                <div style={{ marginBottom: '15px' }}>
                                  <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '5px', display: 'block' }}>{t.currencyLabel}</label>
                                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff', outline: 'none' }}>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="USD">USD ($)</option>
                                  </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '13px', color: '#d1d5db' }}>
                                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} style={{ marginRight: '10px', width: '16px', height: '16px' }} />
                                  <label>{t.agreeTerms} <span onClick={() => {setView('terms'); setMostrarLogin(false);}} style={{ color: '#10b981', cursor: 'pointer', textDecoration: 'underline' }}>{t.termsLink}</span></label>
                                </div>
                              </>
                            )}

                            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#064e3b', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
                              {isSignUpView ? t.btnRegister : t.btnEnter}
                            </button>
                          </form>
                          
                          <div style={{ textAlign: 'center' }}>
                            {!isSignUpView && (
                              <button onClick={() => setIsResetView(true)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '13px', marginBottom: '15px', textDecoration: 'underline' }}>
                                {t.forgotPass}
                              </button>
                            )}
                            <br/>
                            <button onClick={() => setIsSignUpView(!isSignUpView)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>
                              {isSignUpView ? t.toggleToLog : t.toggleToReg}
                            </button>
                            <br/>
                            <button onClick={() => setMostrarLogin(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px' }}>{t.backCalc}</button>
                          </div>
                        </>
                      )}
                      {authMsg && <p style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center', color: authMsg.includes('❌') ? '#ef4444' : '#10b981' }}>{authMsg}</p>}
                    </div>
                  ) : !ordenCreada ? (
                    <div style={{ animation: 'fadeIn 0.3s', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{ backgroundColor: '#111827', padding: '5px', borderRadius: '20px', display: 'flex', gap: '5px' }}>
                           <div onClick={() => setIsBuying(true)} style={{ padding: '8px 20px', backgroundColor: isBuying ? '#374151' : 'transparent', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', color: isBuying ? '#ffffff' : '#9ca3af' }}>{t.tabBuy}</div>
                           <div onClick={() => setIsBuying(false)} style={{ padding: '8px 20px', backgroundColor: !isBuying ? '#374151' : 'transparent', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', color: !isBuying ? '#ffffff' : '#9ca3af' }}>{t.tabSell}</div>
                        </div>
                      </div>

                      <div style={{ position: 'absolute', top: '15px', right: '0', fontSize: '11px', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)' }}>
                        {t.feeLabel} {activeTier}
                      </div>

                      <form onSubmit={handleTransaction}>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>{t.youSend}</label>
                          <div style={boxStyle}>
                            <input type="number" value={isBuying ? fiatInput : cryptoInput} onChange={(e) => isBuying ? handleFiatChange(e.target.value) : handleCryptoChange(e.target.value)} style={inputStyle} min="0" step="any" required />
                            {isBuying ? (
                               <div style={labelStyle}>💶 EUR</div>
                            ) : (
                               <div style={{...labelStyle, cursor: 'pointer'}}>
                                 <img src={cryptoLogos[cryptoType]} alt={cryptoType} width="20" />
                                 <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', color: '#ffffff', outline: 'none', cursor: 'pointer', backgroundColor: 'transparent', paddingRight: '5px' }}>
                                   <option value="USDT">USDT</option>
                                   <option value="USDC">USDC</option>
                                 </select>
                               </div>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', margin: '-10px 0', position: 'relative', zIndex: 2 }}>
                          <div style={{ display: 'inline-block', backgroundColor: '#1f2937', padding: '6px', borderRadius: '50%', border: '1px solid #374151', color: '#10b981', fontSize: '12px' }}>↓</div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                          <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>{t.youGet}</label>
                          <div style={boxStyle}>
                            <input type="number" value={isBuying ? cryptoInput : fiatInput} onChange={(e) => isBuying ? handleCryptoChange(e.target.value) : handleFiatChange(e.target.value)} style={inputStyle} min="0" step="any" required />
                            {!isBuying ? (
                               <div style={labelStyle}>💶 EUR</div>
                            ) : (
                               <div style={{...labelStyle, cursor: 'pointer'}}>
                                 <img src={cryptoLogos[cryptoType]} alt={cryptoType} width="20" />
                                 <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} style={{ border: 'none', fontWeight: 'bold', color: '#ffffff', outline: 'none', cursor: 'pointer', backgroundColor: 'transparent', paddingRight: '5px' }}>
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

                        <button type="submit" disabled={cargandoPrecio || status.includes('Procesando') || status.includes('Connecting') || !fiatInput} style={{ width: '100%', padding: '18px', backgroundColor: (!fiatInput || cargandoPrecio) ? '#374151' : '#10b981', color: '#064e3b', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: (!fiatInput || cargandoPrecio) ? 'not-allowed' : 'pointer' }}>
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
                        {isBuying ? t.successBuyText : t.successSellText} <strong style={{color: '#ffffff'}}>{isBuying ? fiatInput : cryptoInput} {isBuying ? 'EUR' : cryptoType}</strong> a:
                      </p>
                      <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
                        {isBuying ? (
                          <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>{t.bank} <strong style={{ color: '#ffffff', float: 'right' }}>ING</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>{t.beneficiary} <strong style={{ color: '#ffffff', float: 'right' }}>Barzcorp</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af' }}>IBAN: <strong style={{ color: '#ffffff', float: 'right' }}>NL78 INGB 0112 0149 92</strong></p>
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

            <section style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
               <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginBottom: '10px' }}>{t.buyBlocksTitle}</h2>
               <p style={{ color: '#9ca3af', marginBottom: '40px' }}>{t.buyBlocksSub}</p>
               <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                  {blockAmounts.map((amount, index) => {
                    const blockRates = calcularTasas(amount);
                    return (
                      <div key={index} onClick={() => selectBlock(amount)} style={{ backgroundColor: 'rgba(31, 41, 55, 0.7)', border: '1px solid #374151', borderRadius: '16px', padding: '25px', minWidth: '200px', flex: '1', position: 'relative', cursor: 'pointer' }}>
                         <div style={{ backgroundColor: '#10b981', color: '#064e3b', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '20px' }}>{index + 1}</div>
                         <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '5px' }}>{t.pay}</p>
                         <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '20px' }}>{amount} <span style={{fontSize:'16px', color:'#9ca3af'}}>EUR</span></p>
                         <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '5px' }}>{t.get}</p>
                         <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '30px' }}>{(amount / blockRates.tasaCompra).toFixed(2)} <span style={{fontSize:'14px'}}>USDT</span></p>
                         <button style={{ width: '100%', padding: '12px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t.buyNow}</button>
                      </div>
                    );
                  })}
               </div>
            </section>
          </>
        )}
      </div>

      <footer style={{ backgroundColor: '#111827', color: '#6b7280', padding: '40px 5%', textAlign: 'center', fontSize: '14px', borderTop: '1px solid #1f2937', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', fontSize: '20px', fontWeight: '900', color: '#ffffff' }}>
          <BarzcorpLogo /> BARZCORP
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span onClick={() => {setView('terms'); window.scrollTo(0,0);}} style={{ cursor: 'pointer', margin: '0 10px', textDecoration: 'underline' }}>{t.termsLink}</span>
        </div>
        <p>Copyright © 2026 Barzcorp Exchange. {t.footerRight}</p>
      </footer>
    </div>
  );
}

export default App;