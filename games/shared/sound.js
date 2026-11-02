  // ---------- Carrie's own songs (the same files as the music player on the website, same track the visitor picked there);
  // in a preview without the website files it falls back to the little synth tune. Sound on/off is shared by all games.
  const SOUND_KEY = 'carrie-game-sound';
  const makeTrack = (fallback) => {
    const FILES = ['everyday', 'triumph', 'sneaky', 'suspense'];
    let el = null, ok = /^https?:$/.test(location.protocol) && !/claude/.test(location.hostname), vol = 0.5, idx = Math.max(0, FILES.indexOf(fallback));
    try { const s = JSON.parse(localStorage.getItem('carrie-music') || '{}'); if (typeof s.i === 'number' && FILES[s.i]) idx = s.i; if (typeof s.v === 'number') vol = s.v; } catch {}
    return {
      get ok() { return ok; },
      play(level) {
        if (!ok) return;
        try {
          if (!el) { el = new Audio('/assets/music/' + FILES[idx] + '.mp3'); el.loop = true; el.preload = 'auto'; el.addEventListener('error', () => { ok = false; }); }
          el.volume = Math.max(0, Math.min(1, vol * 0.85 * Math.min(1, level / 0.045)));
          if (level > 0) { const p = el.play(); if (p) p.catch(() => {}); } else el.pause();
        } catch { ok = false; }
      },
      stop() { if (el) el.pause(); },
    };
  };
  const soundWanted = () => { try { return localStorage.getItem(SOUND_KEY) === '1'; } catch { return false; } };
  const saveSound = (on) => { try { localStorage.setItem(SOUND_KEY, on ? '1' : '0'); } catch {} };
  const unlockSession = () => { try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {} };
