// Hochstapler: Cloudflare Worker + Durable Object (Klasse Room, Binding ROOMS, Secret PASSWORT)
const WV = '6.11.-12';
const H = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'content-type': 'application/json' };
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: H });
const WORDS = ['Pizza', 'Hund', 'Auto', 'Sonne', 'Fußball'];
const sh = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const maxK = n => Math.max(1, Math.floor((n - 1) / 2));

async function tok(env) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.PASSWORT), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode('hochstapler-v1'));
  return [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: H });
    if (u.pathname === '/') return new Response('Hochstapler läuft, Server-Version ' + WV);
    if (!env.PASSWORT) return J({ e: 'PASSWORT fehlt' }, 500);
    if (u.pathname === '/api/login') {
      const b = await req.json().catch(() => ({}));
      if (b.pw !== env.PASSWORT) { await new Promise(r => setTimeout(r, 800)); return J({ e: 'falsch' }, 401); }
      return J({ token: await tok(env) });
    }
    if (u.pathname === '/api/check') return u.searchParams.get('token') === await tok(env) ? J({ ok: 1 }) : J({ e: 'x' }, 401);
    if (u.pathname === '/api/create') {
      const b = await req.json().catch(() => ({}));
      if (b.token !== await tok(env)) return J({ e: 'login' }, 401);
      for (let i = 0; i < 8; i++) {
        const code = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random() * 24 | 0]).join('');
        const r = await env.ROOMS.get(env.ROOMS.idFromName(code)).fetch('https://do/init?code=' + code, { method: 'POST' });
        if (r.ok) return J({ code });
      }
      return J({ e: 'voll' }, 500);
    }
    if (u.pathname === '/ws') {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('WebSocket nötig', { status: 400 });
      const code = (u.searchParams.get('raum') || '').toUpperCase().replace(/[^A-Z]/g, '');
      return env.ROOMS.get(env.ROOMS.idFromName(code)).fetch(req);
    }
    return new Response('?', { status: 404 });
  }
};

export class Room {
  constructor(st) { this.st = st; this.S = null; this.ws = new Map(); }
  async load() { if (!this.S) this.S = (await this.st.storage.get('S')) || null; }
  async save() { await this.st.storage.put('S', this.S); }

  async fetch(req) {
    await this.load();
    const u = new URL(req.url);
    if (u.pathname === '/init') {
      if (this.S) return new Response('x', { status: 409 });
      this.S = { code: u.searchParams.get('code'), players: [], host: null, ph: 'lobby', cfg: { type: 'blitz', rounds: 5, mode: 'bekannt', k: 1, max: 2, timer: 0 }, round: 0, used: [], G: null };
      await this.save();
      return new Response('ok');
    }
    if (!this.S) return new Response('Raum nicht gefunden', { status: 404 });
    const [c, s] = Object.values(new WebSocketPair());
    s.accept();
    let pid = null;
    const err = e => s.send(JSON.stringify({ t: 'err', e }));
    s.addEventListener('message', async ev => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      await this.load();
      const S = this.S;
      if (m.t === 'join') {
        let p = m.pid && S.players.find(x => x.id === m.pid);
        if (!p) {
          const name = String(m.name || '').trim().slice(0, 14);
          if (S.ph !== 'lobby') return err('Das Spiel läuft schon.');
          if (!name || S.players.some(x => x.name === name)) return err('Dieser Name ist ungültig oder schon vergeben.');
          if (S.players.length >= 20) return err('Der Raum ist voll.');
          p = { id: crypto.randomUUID().slice(0, 8), name, sc: 0 };
          S.players.push(p);
          if (!S.host) S.host = p.id;
          this.clamp();
        }
        pid = p.id;
        this.ws.set(pid, s);
        s.send(JSON.stringify({ t: 'me', pid }));
      } else if (pid) this.act(pid, m);
      await this.save();
      this.push();
    });
    s.addEventListener('close', () => { if (pid && this.ws.get(pid) === s) this.ws.delete(pid); this.push(); });
    return new Response(null, { status: 101, webSocket: c });
  }

  clamp() {
    const c = this.S.cfg, n = this.S.players.length, l = maxK(n);
    c.k = Math.min(Math.max(c.k, 1), l);
    if (!c.maxSet) c.max = Math.max(2, Math.floor(n / 3));
    c.max = Math.min(Math.max(c.max, 2), Math.max(2, l));
    c.rounds = Math.min(20, Math.max(1, c.rounds));
  }

  newRound() {
    const S = this.S, c = S.cfg, P = S.players.map(p => p.id);
    const k = c.mode === 'geheim' ? 1 + (Math.random() * c.max | 0) : c.k;
    let pool = WORDS.filter(w => !S.used.includes(w));
    if (!pool.length) { S.used = []; pool = WORDS; }
    const word = pool[Math.random() * pool.length | 0];
    S.used.push(word);
    S.round++; S.ph = 'role';
    S.G = { k, imp: sh(P).slice(0, k), word, votes: {}, guess: {}, seen: [], start: P[Math.random() * P.length | 0], gi: 0 };
  }

  reveal() {
    const S = this.S, G = S.G, I = G.imp, V = S.players.map(p => p.id).filter(x => !I.includes(x));
    G.th = Math.ceil(V.length / 2);
    G.cnt = {}; S.players.forEach(p => G.cnt[p.id] = V.filter(v => G.votes[v].includes(p.id)).length);
    G.ent = {}; I.forEach(h => G.ent[h] = G.cnt[h] >= G.th);
    S.ph = 'reveal';
  }

  finish() {
    const S = this.S, G = S.G, I = G.imp, c = S.cfg, geh = c.mode === 'geheim';
    const ids = S.players.map(p => p.id), V = ids.filter(x => !I.includes(x)), won = {}, d = {};
    I.forEach(h => won[h] = !G.ent[h] || G.guess[h]);
    G.allLost = I.every(h => !won[h]);
    G.W = G.allLost ? V : I.filter(h => won[h]);
    ids.forEach(x => d[x] = 0);
    I.forEach(h => d[h] = (G.ent[h] ? 0 : 2) + (G.guess[h] ? 2 : 0));
    V.forEach(v => {
      const t = G.votes[v]; let s = G.allLost ? 1 : 0;
      if (geh) {
        if (t.length > G.k) s -= t.length - G.k;
        else { const h = t.filter(x => I.includes(x)).length; s += h; if (G.k > 1 && h === G.k) s++; }
      } else { const h = t.filter(x => G.ent[x]).length; s += h; if (G.k > 1 && h === G.k) s++; }
      d[v] = s;
    });
    G.d = d;
    if (c.type === 'turnier') S.players.forEach(p => p.sc += d[p.id]);
    S.ph = 'result';
  }

  judge() {
    const S = this.S, g = S.G.imp[S.G.gi];
    return g !== S.host ? S.host : S.players.find(p => p.id !== g).id;
  }

  act(pid, m) {
    const S = this.S, G = S.G, H0 = pid === S.host, c = S.cfg, ph = S.ph;
    if (ph === 'lobby') {
      if (!H0) return;
      if (m.t === 'cfg') {
        if (m.k === 'type' || m.k === 'mode') { if (['blitz', 'turnier', 'bekannt', 'geheim'].includes(m.v)) c[m.k] = m.v; }
        else if (['k', 'max', 'rounds'].includes(m.k)) { c[m.k] += m.d > 0 ? 1 : -1; if (m.k === 'max') c.maxSet = true; }
        else if (m.k === 'timer') { const t = Number(m.v); if ([0, 1, 2, 3, 5].includes(t)) c.timer = t; }
        this.clamp();
      }
      if (m.t === 'kick') {
        const t = S.players.find(p => p.id === m.id);
        if (t && t.id !== S.host) {
          S.players = S.players.filter(p => p !== t);
          const sk = this.ws.get(t.id); this.ws.delete(t.id);
          if (sk) { try { sk.send(JSON.stringify({ t: 'err', e: 'Du wurdest aus dem Raum entfernt.' })); sk.close(); } catch (e) {} }
          this.clamp();
        }
      }
      if (m.t === 'start' && S.players.length >= (c.mode === 'geheim' ? 5 : 4)) { S.players.forEach(p => p.sc = 0); S.round = 0; S.used = []; this.newRound(); }
      return;
    }
    if (m.t === 'end' && H0) { S.ph = 'lobby'; S.G = null; return; }
    if (m.t === 'restart' && H0 && ph !== 'result') {
      const keep = S.players.filter(p => p.id === S.host || this.ws.has(p.id));
      if (keep.length < (c.mode === 'geheim' ? 5 : 4) || keep.length === S.players.length) return;
      S.players = keep; this.clamp(); S.round--; this.newRound(); return;
    }
    if (m.t === 'seen' && ph === 'role') {
      if (!G.seen.includes(pid)) G.seen.push(pid);
      if (G.seen.length >= S.players.length) { S.ph = 'talk'; G.t0 = Date.now(); }
    } else if (m.t === 'next' && H0) {
      if (ph === 'talk') S.ph = 'vote';
      else if (ph === 'reveal') { S.ph = 'guess'; G.gi = 0; }
      else if (ph === 'result') { if (c.type === 'turnier' && S.round >= c.rounds) { S.ph = 'lobby'; S.G = null; } else this.newRound(); }
    } else if (m.t === 'vote' && ph === 'vote' && !G.votes[pid]) {
      const ids = [...new Set(m.ids || [])].filter(x => x !== pid && S.players.some(p => p.id === x));
      if (c.mode === 'geheim' ? ids.length >= 1 : ids.length === G.k) {
        G.votes[pid] = ids;
        if (Object.keys(G.votes).length >= S.players.length) this.reveal();
      }
    } else if (m.t === 'ans' && ph === 'guess' && pid === this.judge()) {
      G.guess[G.imp[G.gi]] = !!m.v; G.gi++;
      if (G.gi >= G.imp.length) this.finish();
    }
  }

  view(me) {
    const S = this.S, G = S.G;
    const v = { t: 's', wv: WV, now: Date.now(), me, code: S.code, host: S.host, ph: S.ph, cfg: S.cfg, round: S.round, players: S.players.map(p => ({ id: p.id, name: p.name, sc: p.sc, on: this.ws.has(p.id) })) };
    if (!G) return v;
    const late = ['reveal', 'guess', 'result'].includes(S.ph);
    v.k = (S.cfg.mode === 'bekannt' || late) ? G.k : null;
    if (S.ph === 'role') v.role = { imp: G.imp.includes(me), word: G.imp.includes(me) ? null : G.word, seen: G.seen.includes(me), n: G.seen.length };
    if (S.ph === 'talk' && S.cfg.timer) v.tend = G.t0 + S.cfg.timer * 60000;
    if (S.ph === 'talk') { const L = S.players, s = L.findIndex(p => p.id === G.start); v.order = L.map((_, j) => L[(s + j) % L.length].id); }
    if (S.ph === 'vote') { v.voted = Object.keys(G.votes).length; v.my = G.votes[me] || null; }
    if (late) v.rev = { cnt: G.cnt, imp: G.imp, ent: G.ent, th: G.th, nv: S.players.length - G.imp.length, votes: G.votes };
    if (S.ph === 'guess') { v.guesser = G.imp[G.gi]; v.judge = this.judge(); }
    if (S.ph === 'result') v.res = { word: G.word, W: G.W, allLost: G.allLost, d: G.d, last: S.cfg.type === 'turnier' && S.round >= S.cfg.rounds };
    return v;
  }

  push() {
    for (const [pid, sock] of this.ws) { try { sock.send(JSON.stringify(this.view(pid))); } catch (e) {} }
  }
} 
