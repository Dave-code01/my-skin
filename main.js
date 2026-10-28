(() => {
  'use strict';

  const CONFIG = {
    whatsapp: {
      phone: '573169355455',
      message: 'Hola My Skin, quiero más información sobre el Sérum Niacinamida 10% + Zinc 1%.',
    },
    social: {
      instagram: 'https://www.instagram.com/',
      tiktok: 'https://www.tiktok.com/',
    },
  };

  const BOT = {
    start: {
      text: '¡Hola! Soy el asistente de My Skin. ¿En qué te puedo ayudar hoy?',
      options: [
        { label: 'Ver producto', go: 'productos' },
        { label: 'Cómo pagar y pedir', go: 'pagos' },
        { label: 'Envíos y devoluciones', go: 'envios' },
        { label: 'Hablar con un asesor', go: 'humano' },
        { label: 'Redes sociales', go: 'redes' },
      ],
    },
    productos: {
      text: 'Nuestro producto estrella es el Sérum Niacinamida 10% + Zinc 1% ($68.000 COP). Regula el sebo, minimiza poros y calma la piel sin irritar.',
      options: [
        { label: 'Ir al producto', href: '#productos' },
        { label: 'Cómo pagar y pedir', go: 'pagos' },
        { label: 'Volver al inicio', go: 'start' },
      ],
    },
    pagos: {
      text: 'Toca «Comprar por WhatsApp» en el producto y te atenderemos enseguida para finalizar tu compra por Nequi, Bancolombia, PSE o pago contraentrega.',
      options: [
        { label: 'Comprar por WhatsApp', link: 'whatsapp' },
        { label: 'Volver al inicio', go: 'start' },
      ],
    },
    envios: {
      text: 'Hacemos envíos seguros a toda Colombia (24 a 72 horas hábiles). Además, cuentas con 30 días de garantía de satisfacción.',
      options: [
        { label: 'Hablar por WhatsApp', link: 'whatsapp' },
        { label: 'Volver al inicio', go: 'start' },
      ],
    },
    humano: {
      text: 'Te atendemos directamente por WhatsApp. Toca el botón para abrir el chat.',
      options: [
        { label: 'Abrir WhatsApp', link: 'whatsapp' },
        { label: 'Volver al inicio', go: 'start' },
      ],
    },
    redes: {
      text: 'Síguenos en nuestras redes para ver rutinas, tips dermatológicos y novedades.',
      options: [
        { label: 'Instagram', link: 'instagram' },
        { label: 'TikTok', link: 'tiktok' },
        { label: 'Volver al inicio', go: 'start' },
      ],
    },
  };

  const root = document.documentElement;
  const $ = (selector, context = document) => context.querySelector(selector);

  function whatsappUrl(customMessage) {
    const digits = CONFIG.whatsapp.phone.replace(/\D/g, '');
    const text = customMessage || CONFIG.whatsapp.message;
    return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : '';
  }

  function initTheme() {
    const KEY = 'my-skin-theme';
    const button = $('#theme-toggle');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
    const write = (value) => { try { localStorage.setItem(KEY, value); } catch {} };
    const current = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');

    const apply = (theme) => {
      root.dataset.theme = theme;
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
    };

    apply(read() || current());
    button.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      write(next);
    });
  }

  function initLogo3D() {
    const stage = $('#hero-stage');
    const logo = $('#hero-logo');
    const replay = $('#replay');

    replay.addEventListener('click', () => {
      logo.classList.remove('go');
      void logo.offsetWidth;
      logo.classList.add('go');
    });

    stage.addEventListener('pointermove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty('--ry', `${(x * 26).toFixed(2)}deg`);
      stage.style.setProperty('--rx', `${(-y * 22).toFixed(2)}deg`);
      stage.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
      stage.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
    });

    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--ry', '0deg');
      stage.style.setProperty('--rx', '0deg');
      stage.style.setProperty('--gx', '50%');
      stage.style.setProperty('--gy', '50%');
    });

    logo.addEventListener('click', () => {
      logo.classList.add('pulse');
      setTimeout(() => logo.classList.remove('pulse'), 420);
    });
  }

  function initProductActions() {
    $('.grid').addEventListener('click', (event) => {
      const saveBtn = event.target.closest('.save');
      if (saveBtn) {
        const on = saveBtn.getAttribute('aria-pressed') !== 'true';
        saveBtn.setAttribute('aria-pressed', String(on));
        saveBtn.textContent = on ? 'Guardado ✓' : 'Guardar';
        return;
      }

      const buyBtn = event.target.closest('.buy');
      if (buyBtn) {
        const card = buyBtn.closest('.card');
        const { name, price } = card.dataset;
        const msg = `¡Hola My Skin! Quiero comprar el producto *${name}* (${price}). ¿Me ayudas a finalizar mi pedido?`;
        window.open(whatsappUrl(msg), '_blank', 'noopener,noreferrer');
      }
    });
  }

  function initRoutineTips() {
    const selector = $('#skin-selector');
    const tipBox = $('#skin-tip');
    if (!selector || !tipBox) return;

    selector.addEventListener('click', (event) => {
      const btn = event.target.closest('.chip');
      if (!btn) return;
      selector.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      tipBox.textContent = btn.dataset.tip;
    });
  }

  function initSubscribe() {
    const form = $('#subscribe');
    const email = $('#email');
    const status = $('#status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!email.checkValidity()) {
        email.setAttribute('aria-invalid', 'true');
        status.textContent = 'Escribe un correo válido para continuar.';
        email.focus();
        return;
      }
      email.removeAttribute('aria-invalid');
      status.textContent = '¡Gracias! Te avisaremos pronto de nuestras novedades.';
      form.reset();
    });
  }

  function initWhatsAppAndSocial() {
    const url = whatsappUrl();
    if (url) $('#whatsapp').href = url;

    Object.entries(CONFIG.social).forEach(([id, socialUrl]) => {
      const link = $(`#${id}`);
      if (link && socialUrl) link.href = socialUrl;
    });
  }

  function initBot() {
    const panel = $('#bot');
    const log = $('#bot-log');
    const tray = $('#bot-options');
    const dock = $('#dock');
    const opener = $('#bot-open');
    const typingDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600;
    const urls = () => ({ whatsapp: whatsappUrl(), ...CONFIG.social });

    const scrollDown = () => { log.scrollTop = log.scrollHeight; };

    const addMessage = (text, who) => {
      const message = document.createElement('p');
      message.className = `msg msg--${who}`;
      message.textContent = text;
      log.append(message);
      scrollDown();
    };

    function openPanel() {
      panel.hidden = false;
      dock.hidden = true;
      opener.setAttribute('aria-expanded', 'true');
      if (!log.children.length) show('start');
      $('#bot-close').focus();
    }

    function closePanel(returnFocus = true) {
      panel.hidden = true;
      dock.hidden = false;
      opener.setAttribute('aria-expanded', 'false');
      if (returnFocus) opener.focus();
    }

    function buildOption(option) {
      if (option.go) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chip glass glass--interactive';
        button.textContent = option.label;
        button.addEventListener('click', () => {
          addMessage(option.label, 'user');
          show(option.go);
        });
        return button;
      }
      const link = document.createElement('a');
      link.className = 'chip glass glass--interactive';
      link.textContent = option.label;
      const url = option.link ? urls()[option.link] : option.href;
      link.href = url || '#';
      if (option.link) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.addEventListener('click', () => closePanel(false));
      }
      return link;
    }

    function show(key) {
      const node = BOT[key];
      tray.replaceChildren();
      const typing = document.createElement('p');
      typing.className = 'msg msg--bot';
      typing.innerHTML = '<span class="typing" aria-hidden="true"><i></i><i></i><i></i></span>';
      log.append(typing);
      scrollDown();
      setTimeout(() => {
        typing.remove();
        addMessage(node.text, 'bot');
        tray.replaceChildren(...node.options.map(buildOption));
      }, typingDelay);
    }

    opener.addEventListener('click', openPanel);
    $('#bot-close').addEventListener('click', () => closePanel());
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closePanel();
    });
  }

  [initTheme, initLogo3D, initProductActions, initRoutineTips, initSubscribe, initWhatsAppAndSocial, initBot].forEach((fn) => fn());
})();
