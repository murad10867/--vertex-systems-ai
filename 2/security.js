(() => {
  'use strict';

  const isProduction = location.hostname.endsWith('github.io');

  if (isProduction && location.protocol !== 'https:') {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
    return;
  }

  try {
    if (window.opener) window.opener = null;
  } catch {}

  const safeUrl = (href) => {
    try {
      const url = new URL(href, location.href);
      return url.protocol === 'https:' || (url.protocol === 'http:' && !isProduction);
    } catch {
      return false;
    }
  };

  const hardenLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (!safeUrl(link.getAttribute('href'))) {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        return;
      }

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (link && !safeUrl(link.getAttribute('href'))) {
      event.preventDefault();
    }
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    hardenLinks();

    if (window.top !== window.self) {
      document.body.replaceChildren();
      const message = document.createElement('main');
      message.className = 'page';
      const card = document.createElement('section');
      card.className = 'project-card';
      const title = document.createElement('h2');
      title.textContent = 'تم منع فتح الصفحة داخل إطار خارجي';
      const text = document.createElement('p');
      text.textContent = 'افتح موقع Vertex Systems AI مباشرةً لحماية الصفحة من التضمين غير المصرح.';
      card.append(title, text);
      message.appendChild(card);
      document.body.appendChild(message);
    }
  });
})();
