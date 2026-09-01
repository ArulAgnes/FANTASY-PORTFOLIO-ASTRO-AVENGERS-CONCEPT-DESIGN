import * as THREE from 'three';

export interface HeroOptions { reducedMotion: boolean; quality: number; }
export interface HeroHandle {
  ok: boolean;
  destroy(): void;
  setPointer(x: number, y: number): void;
  setProgress(p: number): void;
  strike(): void;
}

/* Window light texture for buildings */
function windowTexture(cols: string[], litRatio: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#05070d';
  g.fillRect(0, 0, 64, 128);
  const cw = 6, ch = 7;
  for (let y = 4; y < 124; y += ch + 3) {
    for (let x = 4; x < 60; x += cw + 3) {
      if (Math.random() < litRatio) {
        g.fillStyle = cols[Math.floor(Math.random() * cols.length)];
        g.globalAlpha = 0.55 + Math.random() * 0.45;
        g.fillRect(x, y, cw, ch);
      }
    }
  }
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function glowSprite(color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color + 'aa');
  grad.addColorStop(1, 'transparent');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: HeroOptions): HeroHandle {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: opts.quality > 0.7, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return { ok: false, destroy() {}, setPointer() {}, setProgress() {}, strike() {} };
  }

  const q = opts.quality;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, q > 0.7 ? 2 : 1.4));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0x04060c, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04060c, 0.016);

  const camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / Math.max(1, canvas.clientHeight), 0.1, 400);
  camera.position.set(0, 15, 92);

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0x223148, 1.5));
  const moon = new THREE.DirectionalLight(0x5a80c8, 1.1);
  moon.position.set(-40, 80, 30);
  scene.add(moon);
  const portalLight = new THREE.PointLight(0xff7a1a, 260, 130, 1.9);
  portalLight.position.set(0, 22, -34);
  scene.add(portalLight);
  const arcLight = new THREE.PointLight(0x41d9ff, 90, 90, 2);
  arcLight.position.set(-16, 26, -20);
  scene.add(arcLight);
  const flash = new THREE.PointLight(0xbfe4ff, 0, 320, 1.4);
  flash.position.set(20, 90, -60);
  scene.add(flash);

  /* ---------- ground grid ---------- */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0x060a12, roughness: 0.85, metalness: 0.4 }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const grid = new THREE.GridHelper(300, 90, 0x1c3a55, 0x0d1826);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.35;
  scene.add(grid);

  /* ---------- city ---------- */
  const disposables: { dispose(): void }[] = [];
  const buildingMats = [
    new THREE.MeshStandardMaterial({ color: 0x0c1420, roughness: 0.6, metalness: 0.7, emissive: 0xffffff, emissiveIntensity: 0.85, emissiveMap: windowTexture(['#8fb6e8', '#3d6ea8', '#c9e6ff'], 0.34) }),
    new THREE.MeshStandardMaterial({ color: 0x0a1018, roughness: 0.55, metalness: 0.75, emissive: 0xffffff, emissiveIntensity: 0.8, emissiveMap: windowTexture(['#ffb25e', '#ff7a1a', '#8fb6e8'], 0.27) }),
    new THREE.MeshStandardMaterial({ color: 0x0d1322, roughness: 0.65, metalness: 0.65, emissive: 0xffffff, emissiveIntensity: 0.9, emissiveMap: windowTexture(['#41d9ff', '#69e2ff', '#8fb6e8'], 0.23) }),
  ];
  buildingMats.forEach((m) => disposables.push(m, m.emissiveMap as THREE.Texture));

  const unit = new THREE.BoxGeometry(1, 1, 1);
  unit.translate(0, 0.5, 0);
  disposables.push(unit);
  const dummy = new THREE.Object3D();
  const COUNT = Math.floor((q > 0.7 ? 520 : 260));
  const per = Math.floor(COUNT / buildingMats.length);
  const meshes: THREE.InstancedMesh[] = [];

  buildingMats.forEach((mat, mi) => {
    const inst = new THREE.InstancedMesh(unit, mat, per);
    let i = 0;
    let guard = 0;
    while (i < per && guard++ < per * 40) {
      const ring = 14 + Math.pow(Math.random(), 0.7) * 130;
      const ang = Math.random() * Math.PI * 2;
      const x = Math.cos(ang) * ring;
      const z = Math.sin(ang) * ring - 20;
      // keep the portal approach corridor clear
      if (Math.abs(x) < 10 && z > -50 && z < 40) continue;
      const dist = Math.hypot(x, z + 20);
      const h = Math.max(5, 44 * Math.exp(-dist / 90) * (0.5 + Math.random())) + (mi === 0 ? 6 : 0);
      const w = 2.4 + Math.random() * 3.4;
      dummy.position.set(x, 0, z);
      dummy.scale.set(w, h, w);
      dummy.rotation.y = Math.random() * 0.3 - 0.15;
      dummy.updateMatrix();
      inst.setMatrixAt(i++, dummy.matrix);
    }
    inst.count = i;
    inst.instanceMatrix.needsUpdate = true;
    scene.add(inst);
    meshes.push(inst);
  });

  /* ---------- portal ---------- */
  const portal = new THREE.Group();
  portal.position.set(0, 22, -34);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xff8a2a });
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x41d9ff });
  const torus1 = new THREE.Mesh(new THREE.TorusGeometry(11, 0.32, 16, 120), ringMat1);
  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(12.4, 0.14, 12, 120), ringMat2);
  disposables.push(torus1.geometry, ringMat1, torus2.geometry, ringMat2);
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowSprite('#ff9a3d'), transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
  coreGlow.scale.set(30, 30, 1);
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(10.4, 64),
    new THREE.MeshBasicMaterial({ color: 0x1a0d06, transparent: true, opacity: 0.85 }),
  );
  disposables.push(coreGlow.material, (coreGlow.material as THREE.SpriteMaterial).map as THREE.Texture, disc.geometry, disc.material as THREE.Material);
  portal.add(disc, torus1, torus2, coreGlow);
  scene.add(portal);

  /* silhouette hero — original abstract figure, no copyrighted likeness */
  const hero = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0b0f18, roughness: 0.4, metalness: 0.9 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.5, 6, 12), bodyMat);
  body.position.y = 1.6;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), bodyMat);
  head.position.y = 3;
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xffb25e }));
  core.position.set(0, 2.1, 0.42);
  const rim = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowSprite('#ff8a2a'), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
  rim.scale.set(6, 8, 1);
  rim.position.y = 1.9;
  disposables.push(body.geometry, head.geometry, core.geometry, bodyMat, core.material as THREE.Material, rim.material, (rim.material as THREE.SpriteMaterial).map as THREE.Texture);
  hero.add(body, head, core, rim);
  hero.position.set(0, 16.4, -40);
  scene.add(hero);

  /* ---------- particles ---------- */
  const pCount = Math.floor(q > 0.7 ? 1500 : 650);
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  const spd = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 220;
    pos[i * 3 + 1] = Math.random() * 70;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 220 - 10;
    spd[i] = 0.02 + Math.random() * 0.08;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x7fa8d8, size: 0.14, transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending, map: glowSprite('#9cc4ff') });
  const points = new THREE.Points(pGeo, pMat);
  disposables.push(pGeo, pMat, pMat.map as THREE.Texture);
  scene.add(points);

  /* ---------- flying vehicles ---------- */
  const vehTex = glowSprite('#ffd9a0');
  disposables.push(vehTex);
  const vehicles: THREE.Sprite[] = [];
  for (let i = 0; i < Math.floor(q > 0.7 ? 16 : 8); i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: vehTex, color: i % 3 ? 0xffb25e : 0x41d9ff, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(1.6, 0.28, 1);
    s.position.set((Math.random() - 0.5) * 260, 18 + Math.random() * 40, -70 + Math.random() * 90);
    s.userData.v = (0.1 + Math.random() * 0.22) * (Math.random() > 0.5 ? 1 : -1);
    scene.add(s);
    vehicles.push(s);
    disposables.push(s.material);
  }

  /* ---------- lightning ---------- */
  const boltMat = new THREE.LineBasicMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0 });
  const boltGeo = new THREE.BufferGeometry();
  boltGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12 * 3), 3));
  const bolt = new THREE.Line(boltGeo, boltMat);
  disposables.push(boltMat, boltGeo);
  scene.add(bolt);
  let boltTtl = 0;
  let nextStrike = 3 + Math.random() * 5;

  const strike = () => {
    const p = boltGeo.attributes.position as THREE.BufferAttribute;
    let x = (Math.random() - 0.5) * 120;
    let y = 95;
    const ex = x + (Math.random() - 0.5) * 40;
    for (let i = 0; i < 12; i++) {
      const t = i / 11;
      p.setXYZ(i, x + (ex - x) * t + (Math.random() - 0.5) * 9, y * (1 - t) + 6, -70 + (Math.random() - 0.5) * 30);
    }
    p.needsUpdate = true;
    boltTtl = 0.16;
    flash.intensity = 900;
  };

  /* ---------- interaction ---------- */
  let px = 0, py = 0, progress = 0;
  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;
  let inView = true;

  const render = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    portal.rotation.z += dt * 0.4;
    torus2.rotation.z -= dt * 0.8;
    const pulse = 1 + Math.sin(t * 1.8) * 0.06;
    coreGlow.scale.set(30 * pulse, 30 * pulse, 1);
    portalLight.intensity = 240 + Math.sin(t * 1.8) * 60;
    hero.position.y = 16.4 + Math.sin(t * 1.2) * 0.35;
    hero.rotation.y = Math.sin(t * 0.4) * 0.25;
    core.rotation.y += dt * 2;

    const arr = pGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pCount; i++) {
      let y = arr.getY(i) + spd[i];
      if (y > 72) y = 0;
      arr.setY(i, y);
    }
    arr.needsUpdate = true;

    vehicles.forEach((v) => {
      v.position.x += (v.userData.v as number) * 0.9;
      if (v.position.x > 150) v.position.x = -150;
      if (v.position.x < -150) v.position.x = 150;
    });

    if (!opts.reducedMotion) {
      nextStrike -= dt;
      if (nextStrike <= 0) { strike(); nextStrike = 4 + Math.random() * 7; }
    }
    if (boltTtl > 0) {
      boltTtl -= dt;
      boltMat.opacity = Math.max(0, boltTtl / 0.16) * (0.5 + Math.random() * 0.5);
      flash.intensity *= 0.82;
    } else {
      boltMat.opacity = 0;
      flash.intensity = 0;
    }

    const approach = 92 - progress * 34;
    camera.position.x += (px * 6 - camera.position.x) * 0.04;
    camera.position.y += (15 + py * -4 + progress * 6 - camera.position.y) * 0.04;
    camera.position.z += (approach - camera.position.z) * 0.06;
    camera.lookAt(portal.position.x * 0.5, 20, portal.position.z);

    renderer.render(scene, camera);
  };

  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!running || !inView || document.hidden) return;
    render();
  };
  loop();

  const onResize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', onResize);

  const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.02 });
  io.observe(canvas);

  return {
    ok: true,
    setPointer(x: number, y: number) { px = x; py = y; },
    setProgress(p: number) { progress = Math.min(1, Math.max(0, p)); },
    strike,
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      meshes.forEach((m) => { m.dispose(); });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
