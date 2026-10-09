/* ================================================================
   marquee.js  —  Infinite marquee — pause on hover
   ================================================================ */
'use strict';
(function () {

  const ITEMS = [
    'React.js', 'Next.js', 'TypeScript', 'JavaScript',
    'ASP.NET', 'C#', 'Tailwind CSS', 'Redux',
    'SQL Server', 'Entity Framework', 'Git', 'OOP',
    'Data Structures', 'REST APIs', 'Sass', 'Bootstrap',
  ];

  const track = document.getElementById('marquee-track');
  if (!track) return;

  // Triple to guarantee seamless loop on ultrawide
  [...ITEMS, ...ITEMS, ...ITEMS].forEach(label => {
    const el  = document.createElement('span');
    el.className = 'm-item';

    const txt = document.createElement('span');
    txt.textContent = label;

    const sep = document.createElement('span');
    sep.className = 'm-sep';

    el.appendChild(txt);
    el.appendChild(sep);
    track.appendChild(el);
  });

})();
