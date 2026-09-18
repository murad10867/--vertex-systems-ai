(() => {
  'use strict';

  const owner = 'murad10867';
  const grid = document.getElementById('repoGrid');
  const status = document.getElementById('repoStatus');

  if (!grid) return;

  const excluded = new Set([
    'SvS-AI-BULLETIN',
    'desktop-tutorial'
  ]);

  const liveSites = {
    'www.vertex-systems-ai.com': 'https://murad10867.github.io/www.vertex-systems-ai.com/',
    'app-vertex-systems-ai': 'https://murad10867.github.io/app-vertex-systems-ai/'
  };

  const priority = [
    'www.vertex-systems-ai.com',
    'app-vertex-systems-ai'
  ];

  const safeHttps = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  };

  const makeLink = (label, href, secondary = false) => {
    const safe = safeHttps(href);
    if (!safe) return null;

    const a = document.createElement('a');
    a.className = secondary ? 'project-link secondary-link' : 'project-link';
    a.textContent = label;
    a.href = safe;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  };

  const makeCard = (repo) => {
    const article = document.createElement('article');
    article.className = 'project-card';

    const badge = document.createElement('span');
    badge.className = 'repo-badge';
    badge.textContent = 'مستودع عام';

    const title = document.createElement('h2');
    title.textContent = repo.name;

    const desc = document.createElement('p');
    desc.textContent = repo.description || 'أحد مستودعات Vertex Systems AI.';

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const live = liveSites[repo.name];
    if (live) {
      const liveLink = makeLink('فتح الموقع', live);
      if (liveLink) actions.appendChild(liveLink);
    }

    const repoLink = makeLink('فتح المستودع', repo.html_url, true);
    if (repoLink) actions.appendChild(repoLink);

    article.append(badge, title, desc, actions);
    return article;
  };

  fetch('https://api.github.com/users/' + owner + '/repos?per_page=100&sort=updated', {
    headers: { 'Accept': 'application/vnd.github+json' }
  })
    .then((response) => {
      if (!response.ok) throw new Error('GitHub API error');
      return response.json();
    })
    .then((repos) => {
      const list = repos
        .filter((repo) => repo && repo.name && !repo.archived && !repo.fork && !excluded.has(repo.name))
        .sort((a, b) => {
          const ai = priority.indexOf(a.name);
          const bi = priority.indexOf(b.name);
          if (ai !== -1 || bi !== -1) {
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
          }
          return String(a.name).localeCompare(String(b.name), 'ar');
        });

      if (!list.length) throw new Error('No public repositories');

      grid.replaceChildren(...list.map(makeCard));
      if (status) status.textContent = 'تم العثور على ' + list.length + ' مستودع عام — القائمة تتحدث تلقائيًا عند إضافة مستودع عام جديد.';
    })
    .catch(() => {
      if (status) status.textContent = 'تعذر التحديث التلقائي الآن، لذلك تظهر المستودعات المحفوظة في الصفحة.';
    });
})();
