(() => {

  // Show overlay in portrait
  /* ----- Orientation gate ----- */
  const gate = document.getElementById('gate');
  const checkOrientation = () => {
     const showOverlay = window.innerWidth <= 556;
    gate.style.display = showOverlay ? 'flex' : 'none';
  };
  ['load','resize','orientationchange'].forEach(ev => window.addEventListener(ev, checkOrientation));
  checkOrientation();

  /* ----- Elements ----- */
  const cards = Array.from(document.querySelectorAll('.sr-card'));
  const spinBtn = document.getElementById('spin');
  const statusEl = document.getElementById('status');
  const modal = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mCopy  = document.getElementById('mCopy');
  const mCTA   = document.getElementById('mCTA');
  const mClose = document.getElementById('mClose');
  const confetti = document.getElementById('confetti');
  let pendingLink = '#';

  // Card click handlers
  cards.forEach(card => {

    const inner = card.querySelector('.card-inner');
    const cta = card.querySelector('.back .cta');
    // flip on tap
    inner.addEventListener('click', (e) => {
      // ignore if clicking the CTA itself (handled below)
      if(e.target.classList.contains('cta')) return;
      cards.forEach(c => c.classList.remove('flipped'));
      card.classList.add('flipped');
    });

    
    // CTA → popup
    cta.addEventListener('click', (e) => {
      e.stopPropagation();
      const name  = card.dataset.name;
      const tag   = card.dataset.tag;
      const bonus = card.dataset.bonus;
      pendingLink = card.dataset.link || '#';
      mTitle.textContent = name;
      mCopy.innerHTML = `<span style="color:#B08D57">${tag}</span><br/>Personally chosen for you by Seraphine Noir.<br/><strong>${bonus}</strong>`;
      modal.style.display = 'grid';
    });

  });

  // Spin mini-game
  function setActive(i){
    cards.forEach(c => c.classList.remove('active'));
    cards[i].classList.add('active');
  }
  
  function openModal(card){
    const name  = card.dataset.name;
    const tag   = card.dataset.tag;
    const bonus = card.dataset.bonus;
    const link  = card.dataset.link || '#';
    mTitle.textContent = name;
    mCopy.innerHTML = `<span style="color:var(--gold)">${tag}</span><br/>Personally chosen for you by Seraphine Noir.<br/><strong>${bonus}</strong>`;
    mCTA.onclick = (e)=>{
      setTimeout(()=>{ window.location.href = link; }, 100);
    };
    modal.style.display = 'grid';
    // Add confetti effect when revealing the game
    setTimeout(() => rainConfetti(), 100);
  }

  // Rain confetti effect for modal reveal
  function rainConfetti() {
    const modalRect = modal.querySelector('.modal-card').getBoundingClientRect();
    const startX = modalRect.left - 100; // Extend area beyond modal edges
    const width = modalRect.width + 200; // Add extra width for more natural spread
    const isMobile = window.innerWidth <= 556;
    
    // Adjust number of particles and waves based on device
    const particleDensity = isMobile ? 0.25 : 0.3; // Reduced desktop density
    const N = Math.floor(width * particleDensity);
    const numberOfWaves = isMobile ? 3 : 4; // Reduced waves for desktop
    
    function createConfettiParticle(wave) {
      const p = document.createElement('i');
      
      // Randomize starting position with appropriate spread
      const spreadFactor = isMobile ? 0.8 : 1; // Tighter spread on mobile
      const randomX = startX + Math.random() * width * spreadFactor;
      const randomStart = -50 - (Math.random() * (isMobile ? 100 : 200));
      
      p.style.position = 'absolute';
      p.style.left = randomX + 'px';
      p.style.top = randomStart + 'px';
      
      // Adjust movement based on device
      const driftFactor = isMobile ? 0.7 : 1;
      const drift = (Math.random() * 180 - 90) * (1 + wave * 0.1) * driftFactor;
      const fall = window.innerHeight + (isMobile ? 100 : 200);
      const rot = (Math.random() * 720 - 360) * (1 + wave * 0.1);
      
      // Smaller size variation on mobile
      const size = isMobile ? 
        (6 + Math.random() * 3) : // Mobile size
        (7 + Math.random() * 5);  // Desktop size
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      
      // Faster animation on mobile
      const duration = isMobile ?
        (1.2 + Math.random() * 0.8) : // Mobile duration
        (2 + Math.random() * 1.5);    // Desktop duration
      p.style.animationDuration = duration + 's';
      
      p.style.opacity = (0.85 + Math.random() * 0.15).toString();
      
      p.style.setProperty('--dx', drift + 'px');
      p.style.setProperty('--dy', fall + 'px');
      p.style.setProperty('--rot', rot + 'deg');
      
      confetti.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000 + 100);
    }
    
    // Create waves with adjusted timing for both mobile and desktop
    for (let wave = 0; wave < numberOfWaves; wave++) {
      const particlesInWave = Math.floor(N * (1 - wave * (isMobile ? 0.2 : 0.15)));
      
      // More controlled distribution of particles
      const baseDelay = isMobile ? 150 : 200;
      const randomSpread = isMobile ? 400 : 600;
      
      for (let i = 0; i < particlesInWave; i++) {
        // Ensure even distribution within each wave
        const normalizedIndex = i / particlesInWave;
        const delay = wave * baseDelay + (normalizedIndex * 0.7 + Math.random() * 0.3) * randomSpread;
        
        setTimeout(() => {
          createConfettiParticle(wave);
        }, delay);
      }
    }
  }

  // Modal buttons
  mClose.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.style.display='none'; });

  spinBtn.addEventListener('click', ()=> {

        if (spinBtn.disabled) return;
        spinBtn.disabled = true;
        statusEl.textContent = 'Spinning...';

        let idx = Math.floor(Math.random()*cards.length);
        let steps = 18 + Math.floor(Math.random()*16);
        let delay = 70;
        let step = 0;

        const tick = () => {
        setActive(idx % cards.length);
        idx++; step++;
        delay += 12; // decelerate
        if (step < steps){
            setTimeout(tick, delay);
        } else {
            const chosen = cards[(idx-1) % cards.length];
            // flip chosen for drama
            cards.forEach(c => c.classList.remove('flipped'));
            chosen.classList.add('flipped');
            statusEl.textContent = 'Fate has spoken.';
            spinBtn.disabled = false;
            // popup
            setTimeout(()=>openModal(chosen), 350);
        }
        };
        tick();
    });

  mCTA.addEventListener('click', (e) => {
    // glow is CSS, now confetti then redirect
    const rect = e.target.getBoundingClientRect();
    burstConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
    setTimeout(()=>{ window.location.href = pendingLink; }, 900);
  });


})();