/* ===== Configuration Web3Forms =====
   1. Créez une clé gratuite sur https://web3forms.com avec l'adresse e-mail du magasin.
   2. Collez-la ci-dessous. Elle sert au formulaire de contact. */
const WEB3FORMS_KEY = "VOTRE_CLE_WEB3FORMS";

(function () {
  /* --- Header : ombre au défilement --- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Menu mobile plein écran --- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = menu.querySelector('.m-close');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) setTimeout(() => closeBtn.focus({ preventScroll: true }), 60);
  }
  burger.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => { setMenu(false); burger.focus(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });
  window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* --- Retour en haut --- */
  const toTop = document.getElementById('to-top');
  document.querySelectorAll('[data-top]').forEach(b => b.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }));
  if (toTop) {
    const t = () => toTop.classList.toggle('show', window.scrollY > 600);
    t(); window.addEventListener('scroll', t, { passive: true });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --- Envoi Web3Forms --- */
  function show(box, type, msg) { box.className = 'status show ' + type; box.textContent = msg; }

  async function send(form, subject, okMsg) {
    const box = form.querySelector('.status');
    const btn = form.querySelector('button[type="submit"]');
    if (!form.checkValidity()) {
      form.reportValidity();
      show(box, 'err', 'Merci de compléter les champs obligatoires.');
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.botcheck) return;
    delete data.botcheck;

    if (!WEB3FORMS_KEY || WEB3FORMS_KEY === 'VOTRE_CLE_WEB3FORMS') {
      show(box, 'info', "Formulaire prêt. Ajoutez votre clé Web3Forms dans script.js pour activer l'envoi.");
      return;
    }
    const payload = Object.assign({ access_key: WEB3FORMS_KEY, subject: subject, from_name: 'Site Central Market' }, data);
    btn.disabled = true; const label = btn.textContent; btn.textContent = 'Envoi…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) { show(box, 'ok', okMsg); form.reset(); }
      else show(box, 'err', "L'envoi a échoué (" + (json.message || 'erreur inconnue') + "). Réessayez dans un instant.");
    } catch (e) {
      show(box, 'err', "Impossible d'envoyer pour le moment. Vérifiez votre connexion et réessayez.");
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  }

  const contactForm = document.getElementById('form-contact');
  if (contactForm) contactForm.addEventListener('submit', e => {
    e.preventDefault();
    send(contactForm, 'Nouveau message depuis le site – ' + document.getElementById('c-sujet').value,
      'Merci ! Votre message est bien envoyé. Nous vous répondons rapidement.');
  });
})();
