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
      const r = e.target.getBoundingClientRect();
      burstConfetti(r.left + r.width/2, r.top + r.height/2);
      setTimeout(()=>{ window.location.href = link; }, 850);
    };
    modal.style.display = 'grid';
  }

  // Confetti burst then redirect
  function burstConfetti(x=window.innerWidth/2, y=window.innerHeight/2){
    
    const N = 90;
    for(let i=0;i<N;i++){
      const p = document.createElement('i');
      p.style.position='absolute';
      p.style.left = x+'px';
      p.style.top  = y+'px';
      p.style.width='8px'; p.style.height='8px';
      p.style.background='linear-gradient(180deg,#FFD86E,#B08D57)';
      p.style.borderRadius='2px';
      p.style.filter='drop-shadow(0 0 6px rgba(255,215,130,.7))';
      p.style.setProperty('--dx', ((Math.random()*2-1)*340)+'px');
      p.style.setProperty('--dy', ((Math.random()*-1)*420)+'px');
      p.style.setProperty('--rot', (Math.random()*720-360)+'deg');
      p.style.animation='fall .9s ease-out forwards';
      confetti.appendChild(p);
      setTimeout(()=>p.remove(), 900);
    }

    // const N = 80;
    // for(let i=0;i<N;i++){
    //   const p = document.createElement('i');
    //   const dx = (Math.random()*2-1)*320 + 'px';
    //   const dy = (Math.random()*-1)*400 + 'px';
    //   const rot = (Math.random()*720 - 360) + 'deg';
    //   p.style.left = x + 'px';
    //   p.style.top  = y + 'px';
    //   p.style.setProperty('--dx', dx);
    //   p.style.setProperty('--dy', dy);
    //   p.style.setProperty('--rot', rot);
    //   confetti.appendChild(p);
    //   setTimeout(()=>p.remove(), 900);
    // }

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
