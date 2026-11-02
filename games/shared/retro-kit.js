  // ---------- shared kit for Carrie's pixel games: chiptune effects + Carrie's songs, crisp canvas fitting, fixed 60 Hz loop
  function makeAudio(trackName, fxFactory) {
    const TRACK = makeTrack(trackName);
    let ac = null, on = false, master, noiseBuf, curLevel = 0;
    function ensure() {
      if (ac) return true; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ac = new AC(); master = ac.createGain(); master.gain.value = 0.8; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    }
    const A = {
      tone(f0, f1, dur, type = 'square', vol = 0.05, when = 0) {
        if (!on) return; const t = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
      },
      noise(dur, vol = 0.08, hp = 600, when = 0) {
        if (!on) return; const t = ac.currentTime + when, s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
        s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.02);
      },
      seq(notes, len, type = 'square', vol = 0.045) { notes.forEach((f, i) => f && A.tone(f, f, len * 0.9, type, vol, i * len)); },
    };
    const FX = fxFactory(A);
    return {
      get isOn() { return on; },
      toggle() { unlockSession(); if (!ensure()) return false; on = !on; saveSound(on); if (on) { ac.resume(); TRACK.play(curLevel); } else TRACK.stop(); return on; },
      music(level) { curLevel = level; if (on) { if (level > 0) TRACK.play(level); else TRACK.stop(); } },
      fx(n, ...a) { if (on && FX[n]) FX[n](...a); },
      suspend() { TRACK.stop(); if (ac && ac.state === 'running') ac.suspend(); },
      wake() { if (ac && on) { ac.resume(); if (curLevel > 0) TRACK.play(curLevel); } },
    };
  }
  // place the low-res canvas: whole-number scale when it fits, room for touch controls below (upright phone) or at the sides
  function fitCanvas(cv, VW, VH, touchUI, ctrlH = 180) {
    const W = innerWidth, H = innerHeight, portrait = H > W * 1.05;
    const sTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0, cH = touchUI ? ctrlH : 16;
    let availW = W, availH = H;
    if (portrait) availH = H - 62 - sTop - cH; else { availW = W - (touchUI ? 300 : 0); availH = H - 8; }
    let s = Math.min(availW / VW, availH / VH); if (s >= 2 && Math.floor(s) / s > 0.84) s = Math.floor(s); s = Math.max(1, s);
    const cw = Math.round(VW * s), ch = Math.round(VH * s);
    const top = portrait ? Math.round(62 + sTop + Math.max(0, (H - 62 - sTop - cH - ch) / 2)) : Math.round((H - ch) / 2);
    Object.assign(cv.style, { width: cw + 'px', height: ch + 'px', left: Math.round((W - cw) / 2) + 'px', top: top + 'px' });
    const dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    document.body.classList.toggle('portrait', portrait); document.body.classList.toggle('touch', touchUI);
    return { portrait, scale: s };
  }
  function runLoop(step, render, isPaused, present) {
    let last = 0, acc = 0;
    function frame(now) {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
      if (!isPaused()) { acc += dt; while (acc >= 1 / 60) { step(); acc -= 1 / 60; } }
      render(); present(); requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return { reset() { last = 0; } };
  }
  const readGamepad = () => { const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null; if (!gp) return null; const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed); return { left: b(14) || (gp.axes[0] || 0) < -0.4, right: b(15) || (gp.axes[0] || 0) > 0.4, a: b(0) || b(1) || b(2) || b(3), start: b(9) }; };
