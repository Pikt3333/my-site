/* ============================================================
   Dr. Keys Locksmith — Global JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. FORM HANDLING
     - Email never in HTML; assembled at submit time only
     - Honeypot + timing check (bot protection)
     - Fetch-based submit (no page redirect)
  ---------------------------------------------------------- */
  var FORM_LOAD_TIME = Date.now();

  // Email parts — obfuscated, assembled only on submit
  var _u = 'investmentpro99';
  var _d = 'gmail';
  var _t = 'com';

  function getEndpoint() {
    return 'https://formsubmit.co/' + _u + '\u0040' + _d + '.' + _t;
  }

  var form    = document.getElementById('drkeys-form');
  var formMsg = document.getElementById('form-msg');
  var submitBtn = form ? form.querySelector('.form-submit-btn') : null;

  function showMsg(type, text) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.className = 'form-msg ' + type;
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideMsg() {
    if (!formMsg) return;
    formMsg.className = 'form-msg';
    formMsg.textContent = '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideMsg();

      // Honeypot check
      var hp = form.querySelector('.hp-trap');
      if (hp && hp.value !== '') {
        // Silent success for bots
        showMsg('success', '✔ Request sent! We\'ll call you shortly.');
        return;
      }

      // Timing check — real humans take > 4 s to fill a form
      if (Date.now() - FORM_LOAD_TIME < 4000) {
        showMsg('error', 'Please take a moment and try again.');
        return;
      }

      // Basic validation
      var name    = (form.querySelector('#f-name')    || {}).value || '';
      var phone   = (form.querySelector('#f-phone')   || {}).value || '';
      var service = (form.querySelector('#f-service') || {}).value || '';
      var message = (form.querySelector('#f-message') || {}).value || '';

      if (!name.trim() || !phone.trim() || !message.trim()) {
        showMsg('error', 'Please fill in all required fields.');
        return;
      }

      // Phone sanity check (at least 7 digits)
      if (phone.replace(/\D/g, '').length < 7) {
        showMsg('error', 'Please enter a valid phone number.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var fd = new FormData(form);
      fd.set('_subject', 'New lead from Dr. Keys — ' + (service || 'General inquiry'));

      fetch(getEndpoint(), {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok || res.status === 200) {
            showMsg('success', '✔ Request sent! We\'ll call you back shortly.');
            form.reset();
          } else {
            showMsg('error', 'Something went wrong. Please call us: 786-88-666-88');
          }
        })
        .catch(function () {
          showMsg('error', 'Network error. Please call us directly: 786-88-666-88');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Request →';
        });
    });
  }

  /* ----------------------------------------------------------
     2. FAQ ACCORDION
  ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard: Enter / Space already handled natively for buttons
  });

  /* ----------------------------------------------------------
     3. SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     4. LAZY LOAD images (native + JS polyfill)
  ---------------------------------------------------------- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.src = img.dataset.src || img.src;
    });
  }

  /* ----------------------------------------------------------
     5. Mark active nav link by current page
  ---------------------------------------------------------- */
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      a.setAttribute('aria-current', 'page');
    }
  });

})();
