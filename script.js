(() => {
  const gate = document.getElementById('gate');
  const confetti = document.getElementById('confetti');

  // Show overlay in portrait
  const checkOrientation = () => {
    const portrait = window.matchMedia('(orientation: portrait)').matches || window.innerHeight > window.innerWidth;
    gate.style.display = portrait ? 'flex' : 'none';
  };
  ['load','resize','orientationchange'].forEach(ev => window.addEventListener(ev, checkOrientation));
  checkOrientation();

  // Confetti burst function
  function burstConfetti(x=window.innerWidth/2, y=window.innerHeight/2){
    const N = 80;
    for(let i=0;i<N;i++){
      const p = document.createElement('i');
      const dx = (Math.random()*2-1)*320 + 'px';
      const dy = (Math.random()*-1)*400 + 'px';
      const rot = (Math.random()*720 - 360) + 'deg';
      p.style.left = x + 'px';
      p.style.top  = y + 'px';
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.setProperty('--rot', rot);
      confetti.appendChild(p);
      setTimeout(()=>p.remove(), 900);
    }
  }

  // Card CTA click handler
  const cards = Array.from(document.querySelectorAll('.sr-card'));
  cards.forEach(card => {
    const cta = card.querySelector('.back .cta');

    cta.addEventListener('click', (e) => {
      e.stopPropagation();
      const link = card.dataset.link || '#';
      const rect = e.target.getBoundingClientRect();

      // Trigger glow and confetti
      document.body.classList.add('glow-effect');
      burstConfetti(rect.left + rect.width/2, rect.top + rect.height/2);

      // Redirect after animations
      setTimeout(() => {
        window.location.href = link;
      }, 900);
    });
  });

})();