const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const heroOptions = document.querySelectorAll('.hero-option');
const startButton = document.getElementById('startButton');
const dashButton = document.getElementById('dashButton');
const ultimateButton = document.getElementById('ultimateButton');
const abilityButton = document.getElementById('abilityButton');
const restartButton = document.getElementById('restartButton');
const playButton = document.getElementById('playButton');
const controlsButton = document.getElementById('controlsButton');
const controlsModal = document.getElementById('controlsModal');
const closeControlsButton = document.getElementById('closeControlsButton');
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsButton = document.getElementById('closeSettingsButton');
const audioButton = document.getElementById('audioButton');
const settingsAudioButton = document.getElementById('settingsAudioButton');
const sensitivitySetting = document.getElementById('sensitivitySetting');
const fovSetting = document.getElementById('fovSetting');
const volumeSetting = document.getElementById('volumeSetting');
const leaderboard = document.getElementById('leaderboard');
const skinName = document.getElementById('skinName');
const captureValue = document.getElementById('captureValue');
const captureProgressBar = document.getElementById('captureProgress');
const captureStatus = document.getElementById('captureStatus');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const abilityName = document.getElementById('abilityName');
const abilityDescription = document.getElementById('abilityDescription');
const battleFeed = document.getElementById('battleFeed');
const networkStatus = document.getElementById('networkStatus');
const networkMessage = document.getElementById('networkMessage');
const accountForm = document.getElementById('accountForm');
const usernameInput = document.getElementById('usernameInput');
const connectButton = document.getElementById('connectButton');
const friendTools = document.getElementById('friendTools');
const friendCode = document.getElementById('friendCode');
const friendCodeInput = document.getElementById('friendCodeInput');
const addFriendButton = document.getElementById('addFriendButton');
const friendList = document.getElementById('friendList');
const bossHealth = document.getElementById('bossHealth');
const bossHealthValue = document.getElementById('bossHealthValue');
const bossHealthProgress = document.getElementById('bossHealthProgress');
const socialTabs = document.querySelectorAll('.social-tab');
const socialViews = document.querySelectorAll('.social-view');
const skinOptions = document.querySelectorAll('.skin-option');
const mapOptions = document.querySelectorAll('.map-option');
const arenaMapName = document.getElementById('arenaMapName');

const hud = {
  hp: document.getElementById('hpValue'),
  hpProgress: document.getElementById('hpProgress'),
  energy: document.getElementById('energyValue'),
  ammo: document.getElementById('ammoValue'),
  score: document.getElementById('scoreValue'),
  wave: document.getElementById('waveValue'),
  timer: document.getElementById('timerValue'),
  elimination: document.getElementById('eliminationValue'),
  combo: document.getElementById('comboValue')
};

const heroConfig = {
  vanguard: {
    name: 'Vanguard', color: '#ff5c77', accent: '#ffbf5d',
    moveSpeed: 6.4, fireRate: 0.22, damage: 30, maxHealth: 350,
    magazineSize: 18, reloadDuration: 1.25,
    abilityName: 'Aether Pulse',
    abilityDescription: 'A close-range pulse blasts nearby enemies and restores your shield.',
    dashPower: 11, dashCooldown: 1.6, abilityCooldown: 7, fireColor: '#ffd5db'
  },
  striker: {
    name: 'Striker', color: '#ffb75d', accent: '#ff5c77',
    moveSpeed: 7.3, fireRate: 0.14, damage: 21, maxHealth: 250,
    magazineSize: 28, reloadDuration: 1.4,
    abilityName: 'Nova Rush',
    abilityDescription: 'A forward burst breaks through the front line and detonates on impact.',
    dashPower: 14, dashCooldown: 1.2, abilityCooldown: 8, fireColor: '#ffeab4'
  },
  oracle: {
    name: 'Oracle', color: '#67d9ff', accent: '#7ea5ff',
    moveSpeed: 6.1, fireRate: 0.17, damage: 34, maxHealth: 275,
    magazineSize: 12, reloadDuration: 1.5,
    abilityName: 'Starfield Well',
    abilityDescription: 'A focused precision shot pierces the arena and hits every foe in its path.',
    dashPower: 12, dashCooldown: 1.4, abilityCooldown: 6.5, fireColor: '#d9f4ff'
  },
  warden: {
    name: 'Warden', color: '#6b8dff', accent: '#67d9ff',
    moveSpeed: 5.7, fireRate: 0.25, damage: 40, maxHealth: 325,
    magazineSize: 15, reloadDuration: 1.65,
    abilityName: 'Gravity Lock',
    abilityDescription: 'A gravity surge damages and slows every enemy in the arena.',
    dashPower: 10, dashCooldown: 1.7, abilityCooldown: 9, fireColor: '#dfe6ff'
  }
};

const arenaMaps = {
  prism: {
    name: 'Prism District',
    description: 'Open neon lanes and rooftop towers.',
    palette: {
      sky: ['#090d25', '#302d64', '#d16683'],
      haze: ['rgba(255, 164, 196, 0.42)', 'rgba(135, 120, 255, 0.18)'],
      stars: '#d8eaff', skyline: '#20234d', windows: 'rgba(103, 217, 255, 0.58)',
      ring: 'rgba(255, 190, 219, 0.18)', objective: '#72e6ff',
      floor: ['#4b345d', '#25264e', '#080b1b'],
      glow: ['rgba(255, 118, 166, 0.24)', 'rgba(77, 132, 255, 0.1)'],
      grid: 'rgba(129, 210, 255, 0.18)', lanes: 'rgba(255, 126, 181, 0.4)',
      wall: 'rgba(103, 217, 255, 0.36)'
    },
    landmarks: [
      { x: -15.5, z: 15.5, height: 6.2, color: '#67d9ff', kind: 'spire' },
      { x: 15.5, z: 15.5, height: 7.8, color: '#ff83ba', kind: 'spire' },
      { x: -15.5, z: -15.5, height: 7, color: '#9b8cff', kind: 'spire' },
      { x: 15.5, z: -15.5, height: 5.8, color: '#ffd17a', kind: 'spire' },
      { x: -5.8, z: -5.8, height: 2.4, radius: 1.3, color: '#67d9ff', kind: 'crystal' },
      { x: 5.8, z: -5.8, height: 2.4, radius: 1.3, color: '#ff83ba', kind: 'crystal' },
      { x: -5.8, z: 5.8, height: 2.4, radius: 1.3, color: '#9b8cff', kind: 'crystal' },
      { x: 5.8, z: 5.8, height: 2.4, radius: 1.3, color: '#ffd17a', kind: 'crystal' }
    ]
  },
  foundry: {
    name: 'Ember Foundry',
    description: 'Hot metal, smoke stacks, and tight cover.',
    palette: {
      sky: ['#1b1020', '#6a3142', '#e78355'],
      haze: ['rgba(255, 177, 104, 0.36)', 'rgba(255, 101, 72, 0.16)'],
      stars: '#ffe1bd', skyline: '#38243a', windows: 'rgba(255, 177, 104, 0.65)',
      ring: 'rgba(255, 177, 104, 0.2)', objective: '#ffc163',
      floor: ['#633b3c', '#362633', '#120d19'],
      glow: ['rgba(255, 115, 64, 0.3)', 'rgba(255, 174, 76, 0.12)'],
      grid: 'rgba(255, 191, 122, 0.2)', lanes: 'rgba(255, 102, 79, 0.42)',
      wall: 'rgba(255, 177, 104, 0.4)'
    },
    landmarks: [
      { x: -15, z: 15, height: 7.2, color: '#ff9b59', kind: 'factory' },
      { x: 15, z: 15, height: 5.8, color: '#ffc163', kind: 'factory' },
      { x: -15, z: -15, height: 6.2, color: '#ff684f', kind: 'factory' },
      { x: 15, z: -15, height: 7.6, color: '#e98952', kind: 'factory' },
      { x: -7, z: 0, height: 2.8, radius: 1.6, color: '#ff8455', kind: 'factory' },
      { x: 7, z: 0, height: 2.8, radius: 1.6, color: '#ffc163', kind: 'factory' },
      { x: 0, z: -7, height: 2.8, radius: 1.6, color: '#e98952', kind: 'factory' },
      { x: 0, z: 7, height: 2.8, radius: 1.6, color: '#ff684f', kind: 'factory' }
    ]
  },
  sanctum: {
    name: 'Astral Sanctum',
    description: 'Crystal groves and shifting sightlines.',
    palette: {
      sky: ['#071827', '#174c68', '#8b83c7'],
      haze: ['rgba(133, 255, 232, 0.3)', 'rgba(116, 161, 255, 0.2)'],
      stars: '#d8fff6', skyline: '#15364d', windows: 'rgba(157, 255, 230, 0.65)',
      ring: 'rgba(157, 255, 230, 0.18)', objective: '#8affdf',
      floor: ['#315767', '#1d334a', '#091421'],
      glow: ['rgba(110, 255, 221, 0.22)', 'rgba(103, 158, 255, 0.12)'],
      grid: 'rgba(146, 255, 226, 0.18)', lanes: 'rgba(152, 163, 255, 0.4)',
      wall: 'rgba(146, 255, 226, 0.4)'
    },
    landmarks: [
      { x: -15, z: 15, height: 8.2, color: '#7ef8d5', kind: 'crystal' },
      { x: 15, z: 15, height: 6.5, color: '#9e9aff', kind: 'crystal' },
      { x: -15, z: -15, height: 7.4, color: '#70d9ff', kind: 'crystal' },
      { x: 15, z: -15, height: 8, color: '#c88dff', kind: 'crystal' },
      { x: -7, z: -3, height: 3.2, radius: 1.5, color: '#70d9ff', kind: 'crystal' },
      { x: 7, z: 3, height: 3.2, radius: 1.5, color: '#c88dff', kind: 'crystal' },
      { x: -3, z: 8, height: 3.2, radius: 1.5, color: '#7ef8d5', kind: 'crystal' },
      { x: 3, z: -8, height: 3.2, radius: 1.5, color: '#9e9aff', kind: 'crystal' }
    ]
  }
};

const keys = {};
let selectedHero = 'vanguard';
let selectedMap = 'prism';
let gameStarted = false;
let gameOver = false;
let score = 0;
let wave = 1;
let elapsed = 0;
let spawnTimer = 0;
let combo = 1;
let player = null;
let enemies = [];
let particles = [];
let tracers = [];
let projectiles = [];
let pickups = [];
let mouseFiring = false;
let lastTime = 0;
let audioContext = null;
let audioEnabled = true;
let masterVolume = 0.65;
let mouseSensitivity = 0.0025;
let fieldOfView = 90;
let selectedSkin = 'ion';
let recoil = 0;
let damageFlash = 0;
let dashFlash = 0;
let ultimateFlash = 0;
let comboTimer = 0;
let hitMarker = 0;
let objective = null;
let objectiveProgress = 0;
let objectiveTransition = 0;
let objectiveContested = false;
let lastBossWave = 0;

const arenaSize = 19;
const eyeHeight = 1.55;
const horizon = canvas.height * 0.43;
const skinColors = { ion: '#67d9ff', ember: '#ff925e', prism: '#bf8cff' };

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveEntity(entity, deltaX, deltaZ, radius) {
  const limit = arenaSize - 1 - radius;
  entity.x = clamp(entity.x + deltaX, -limit, limit);
  entity.z = clamp(entity.z + deltaZ, -limit, limit);
  const obstacles = arenaMaps[selectedMap].landmarks.filter((landmark) => landmark.radius);
  for (let pass = 0; pass < 2; pass += 1) {
    for (const obstacle of obstacles) {
      const dx = entity.x - obstacle.x;
      const dz = entity.z - obstacle.z;
      const distance = Math.hypot(dx, dz) || 0.001;
      const minimumDistance = radius + obstacle.radius;
      if (distance < minimumDistance) {
        entity.x = clamp(obstacle.x + dx / distance * minimumDistance, -limit, limit);
        entity.z = clamp(obstacle.z + dz / distance * minimumDistance, -limit, limit);
      }
    }
  }
}

function isClearOfMap(x, z, padding = 0) {
  return arenaMaps[selectedMap].landmarks.every((landmark) => (
    !landmark.radius || Math.hypot(x - landmark.x, z - landmark.z) >= landmark.radius + padding
  ));
}

function isClearShot(targetX, targetZ) {
  const dx = targetX - player.x;
  const dz = targetZ - player.z;
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared === 0) return true;
  return arenaMaps[selectedMap].landmarks.every((landmark) => {
    if (!landmark.radius) return true;
    const along = clamp(((landmark.x - player.x) * dx + (landmark.z - player.z) * dz) / lengthSquared, 0, 1);
    const nearestX = player.x + dx * along;
    const nearestZ = player.z + dz * along;
    return Math.hypot(landmark.x - nearestX, landmark.z - nearestZ) >= landmark.radius;
  });
}

function randomObjectivePosition() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(8, 12);
    const x = clamp(player.x + Math.cos(angle) * distance, -12, 12);
    const z = clamp(player.z + Math.sin(angle) * distance, -12, 12);
    if (isClearOfMap(x, z, 4.2)) return { x, z };
  }
  return { x: 10, z: 10 };
}

function restoreHealth(fraction) {
  const previousHealth = player.health;
  player.health = clamp(player.health + Math.round(player.maxHealth * fraction), 0, player.maxHealth);
  return Math.ceil(player.health - previousHealth);
}

function updateActionButtons() {
  if (!player || gameOver) {
    dashButton.disabled = true;
    dashButton.textContent = 'Dash · SHIFT';
    ultimateButton.disabled = true;
    ultimateButton.textContent = 'Ultimate · E';
    return;
  }
  dashButton.disabled = player.dashCooldown > 0;
  dashButton.textContent = player.dashCooldown > 0
    ? `Dash · ${player.dashCooldown.toFixed(1)}s`
    : 'Dash · SHIFT';
  ultimateButton.disabled = player.energy < 100;
  ultimateButton.textContent = player.energy >= 100
    ? 'Ultimate ready · E'
    : `Ultimate · ${Math.floor(player.energy)}%`;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function updateAbilityCard() {
  const hero = heroConfig[selectedHero];
  abilityName.textContent = hero.abilityName;
  abilityDescription.textContent = hero.abilityDescription;
  document.documentElement.style.setProperty('--hero-color', hero.color);
}

function updateSelectionControls() {
  const locked = gameStarted && !gameOver;
  heroOptions.forEach((option) => { option.disabled = locked; });
  mapOptions.forEach((option) => { option.disabled = locked; });
}

function showFeed(message) {
  const item = document.createElement('li');
  item.textContent = message;
  battleFeed.prepend(item);
  while (battleFeed.children.length > 6) battleFeed.removeChild(battleFeed.lastChild);
}

function formatTime(value) {
  const totalSeconds = Math.floor(value);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

function updateHud() {
  if (!player) return;
  const healthRatio = clamp(player.health / player.maxHealth, 0, 1);
  hud.hp.textContent = `${Math.max(0, Math.ceil(player.health))} / ${player.maxHealth}`;
  hud.hpProgress.style.width = `${healthRatio * 100}%`;
  hud.hp.closest('.health-hud').classList.toggle('low', healthRatio <= 0.5);
  hud.hp.closest('.health-hud').classList.toggle('critical', healthRatio <= 0.25);
  hud.energy.textContent = Math.max(0, Math.ceil(player.energy));
  hud.ammo.textContent = player.reloadTimer > 0
    ? `RELOADING ${player.reloadTimer.toFixed(1)}s`
    : `${player.ammo} / ${player.maxAmmo}`;
  hud.ammo.classList.toggle('reloading', player.reloadTimer > 0);
  hud.score.textContent = String(score);
  hud.wave.textContent = String(wave);
  hud.timer.textContent = formatTime(elapsed);
  hud.elimination.textContent = String(score);
  hud.combo.textContent = `x${combo}`;
  captureValue.textContent = `${Math.floor(objectiveProgress)}%`;
  captureProgressBar.style.width = `${objectiveProgress}%`;
  captureProgressBar.classList.toggle('contested', objectiveContested);
  const boss = enemies.find((enemy) => enemy.type === 'colossus');
  bossHealth.classList.toggle('hidden', !boss);
  if (boss) {
    bossHealthValue.textContent = `${Math.ceil(boss.health)} / ${Math.ceil(boss.maxHealth)}`;
    bossHealthProgress.style.width = `${clamp(boss.health / boss.maxHealth, 0, 1) * 100}%`;
  }
  updateAbilityButton();
  updateActionButtons();
}

function updateAbilityButton() {
  const ready = player && player.abilityCooldown <= 0 && !gameOver;
  const ability = heroConfig[selectedHero].abilityName;
  abilityButton.disabled = !ready;
  abilityButton.textContent = ready ? `${ability} · F` : `${ability} · ${player ? `${player.abilityCooldown.toFixed(1)}s` : 'F'}`;
}

function playTone(startFrequency, endFrequency, duration, type = 'sawtooth', volume = 0.04) {
  if (!audioEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    audioEnabled = false;
    updateAudioButtons();
    showFeed('Sound is unavailable in this browser.');
    return;
  }
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
  gain.gain.setValueAtTime(volume * masterVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function resetGame() {
  const hero = heroConfig[selectedHero];
  player = {
    x: 0, z: 0, yaw: 0, moveSpeed: hero.moveSpeed,
    damage: hero.damage, health: hero.maxHealth, maxHealth: hero.maxHealth,
    energy: 100, dashCooldown: 0, attackCooldown: 0, invuln: 0,
    abilityCooldown: 0, fireRate: hero.fireRate, fireColor: hero.fireColor,
    ammo: hero.magazineSize, maxAmmo: hero.magazineSize,
    reloadTimer: 0, reloadDuration: hero.reloadDuration
  };
  enemies = [];
  particles = [];
  tracers = [];
  projectiles = [];
  pickups = [];
  score = 0;
  wave = 1;
  elapsed = 0;
  spawnTimer = 0.6;
  combo = 1;
  comboTimer = 0;
  hitMarker = 0;
  lastBossWave = 0;
  dashFlash = 0;
  ultimateFlash = 0;
  objective = randomObjectivePosition();
  objectiveProgress = 0;
  objectiveTransition = 0;
  objectiveContested = false;
  gameOver = false;
  gameStarted = true;
  updateSelectionControls();
  overlay.classList.add('hidden');
  showFeed(`${hero.name} deployed. Lock in and hold the line.`);
  renderLeaderboard();
  updateHud();
  canvas.focus({ preventScroll: true });
  canvas.requestPointerLock?.();
}

function getViewPoint(x, z, height = 0) {
  const camera = player || { x: 0, z: 0, yaw: 0 };
  const focalLength = canvas.width / (2 * Math.tan(fieldOfView * Math.PI / 360));
  const dx = x - camera.x;
  const dz = z - camera.z;
  const sin = Math.sin(camera.yaw);
  const cos = Math.cos(camera.yaw);
  const depth = dx * sin + dz * cos;
  if (depth <= 0.15) return null;
  const lateral = dx * cos - dz * sin;
  const scale = focalLength / depth;
  return {
    x: canvas.width / 2 + lateral * scale,
    y: horizon + (eyeHeight - height) * scale,
    scale,
    depth
  };
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  const edge = arenaSize - 1;
  let x = randomBetween(-edge, edge);
  let z = randomBetween(-edge, edge);
  if (side === 0) z = -edge;
  if (side === 1) x = edge;
  if (side === 2) z = edge;
  if (side === 3) x = -edge;

  const isBoss = wave % 5 === 0 && lastBossWave !== wave;
  if (isBoss) lastBossWave = wave;
  const roll = Math.random();
  const type = isBoss ? 'colossus' : roll < 0.18 ? 'bulwark' : roll < 0.4 ? 'arcanist' : 'drifter';
  const health = isBoss
    ? 360 + wave * 38
    : (type === 'bulwark' ? 100 : type === 'arcanist' ? 58 : 50) + wave * 7 + Math.random() * 12;
  enemies.push({
    x, z, health, maxHealth: health,
    type,
    speed: (type === 'colossus' ? 0.62 : type === 'bulwark' ? 0.72 : type === 'arcanist' ? 0.92 : randomBetween(1.05, 1.55)) + wave * 0.04,
    damage: (type === 'colossus' ? 16 : type === 'bulwark' ? 11 : type === 'arcanist' ? 8 : 7) + wave * 0.65,
    color: type === 'colossus' ? '#ffc163' : type === 'arcanist' ? '#c28aff' : Math.random() > 0.5 ? '#ff5c77' : '#67d9ff',
    hitFlash: 0, attackCooldown: type === 'arcanist' ? randomBetween(0.7, 1.8) : 0,
    attackWindup: 0, slowTimer: 0
  });
  if (isBoss) showFeed(`Elite signal detected · The Colossus has entered the arena.`);
}

function fireWeapon() {
  if (!player || player.attackCooldown > 0 || gameOver) return;
  if (player.reloadTimer > 0) return;
  if (player.ammo <= 0) {
    reloadWeapon();
    return;
  }
  player.ammo -= 1;
  player.attackCooldown = player.fireRate;
  recoil = 0.14;
  tracers.push({ life: 0.1, hit: null, color: player.fireColor });
  playTone(190, 65, 0.11, 'sawtooth', 0.055);

  let target = null;
  let bestAngle = Infinity;
  for (const enemy of enemies) {
    const dx = enemy.x - player.x;
    const dz = enemy.z - player.z;
    const depth = dx * Math.sin(player.yaw) + dz * Math.cos(player.yaw);
    if (depth <= 0 || depth > 34) continue;
    const lateral = dx * Math.cos(player.yaw) - dz * Math.sin(player.yaw);
    const angle = Math.abs(Math.atan2(lateral, depth));
    const aimWindow = Math.atan2(0.24, depth);
    if (angle < aimWindow && angle < bestAngle && isClearShot(enemy.x, enemy.z)) {
      target = enemy;
      bestAngle = angle;
    }
  }

  if (target) {
    target.health -= player.damage;
    target.hitFlash = 0.14;
    hitMarker = 0.16;
    tracers[tracers.length - 1].hit = getViewPoint(target.x, target.z, 1.1);
    playTone(520, 180, 0.08, 'triangle', 0.035);
    if (target.health <= 0) destroyEnemy(enemies.indexOf(target));
  }
  updateHud();
  if (player.ammo === 0) reloadWeapon();
}

function reloadWeapon() {
  if (!player || player.reloadTimer > 0 || player.ammo === player.maxAmmo || gameOver) return;
  player.reloadTimer = player.reloadDuration;
  showFeed('Reloading weapon.');
  updateHud();
}

function performDash() {
  if (!player || player.dashCooldown > 0 || gameOver) return;
  const forward = keys.KeyS ? -1 : 1;
  moveEntity(
    player,
    Math.sin(player.yaw) * heroConfig[selectedHero].dashPower * forward * 0.35,
    Math.cos(player.yaw) * heroConfig[selectedHero].dashPower * forward * 0.35,
    0.55
  );
  player.dashCooldown = heroConfig[selectedHero].dashCooldown;
  player.invuln = 0.4;
  dashFlash = 0.35;
  playTone(110, 620, 0.25, 'triangle', 0.07);
  showFeed(`${heroConfig[selectedHero].name} surges forward.`);
}

function performAbility() {
  if (!player || player.abilityCooldown > 0 || gameOver) return;
  const hero = selectedHero;
  const config = heroConfig[hero];
  let hits = 0;
  player.abilityCooldown = config.abilityCooldown;

  if (hero === 'vanguard') {
    restoreHealth(0.1);
    for (const enemy of enemies) {
      if (Math.hypot(enemy.x - player.x, enemy.z - player.z) <= 5) {
        enemy.health -= 48;
        enemy.hitFlash = 0.18;
        hits += 1;
      }
    }
  } else if (hero === 'striker') {
    moveEntity(player, Math.sin(player.yaw) * 4, Math.cos(player.yaw) * 4, 0.55);
    player.invuln = 0.3;
    dashFlash = 0.28;
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dz = enemy.z - player.z;
      const depth = dx * Math.sin(player.yaw) + dz * Math.cos(player.yaw);
      const lateral = Math.abs(dx * Math.cos(player.yaw) - dz * Math.sin(player.yaw));
      if (depth > -1 && depth < 6 && lateral < 2.2) {
        enemy.health -= 65;
        enemy.hitFlash = 0.18;
        hits += 1;
      }
    }
  } else if (hero === 'oracle') {
    let bestAngle = Infinity;
    let target = null;
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dz = enemy.z - player.z;
      const depth = dx * Math.sin(player.yaw) + dz * Math.cos(player.yaw);
      const lateral = dx * Math.cos(player.yaw) - dz * Math.sin(player.yaw);
      const angle = Math.abs(Math.atan2(lateral, depth));
      if (depth > 0 && depth < 30 && angle < Math.atan2(0.7, depth) && angle < bestAngle) {
        target = enemy;
        bestAngle = angle;
      }
    }
    if (target) {
      target.health -= 58;
      target.hitFlash = 0.2;
      hits = 1;
      tracers.push({ life: 0.2, hit: getViewPoint(target.x, target.z, 1.1), color: config.color });
    }
  } else {
    for (const enemy of enemies) {
      if (Math.hypot(enemy.x - player.x, enemy.z - player.z) <= 8) {
        enemy.health -= 24;
        enemy.hitFlash = 0.18;
        enemy.slowTimer = 4;
        hits += 1;
      }
    }
  }

  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    if (enemies[i].health <= 0) destroyEnemy(i);
  }
  ultimateFlash = Math.max(ultimateFlash, 0.22);
  playTone(150, 560, 0.28, 'triangle', 0.06);
  showFeed(`${config.name} uses ${config.abilityName}${hits ? ` · ${hits} hit${hits === 1 ? '' : 's'}` : ''}.`);
  updateHud();
}

function performUltimate() {
  if (!player || gameOver || player.energy < 100) return;
  player.energy = 0;
  const hero = selectedHero;
  let hits = 0;
  ultimateFlash = 0.8;

  if (hero === 'vanguard') {
    restoreHealth(0.2);
  } else if (hero === 'striker') {
    moveEntity(player, Math.sin(player.yaw) * 5, Math.cos(player.yaw) * 5, 0.55);
  }

  if (hero === 'oracle') {
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dz = enemy.z - player.z;
      const depth = dx * Math.sin(player.yaw) + dz * Math.cos(player.yaw);
      const lateral = Math.abs(dx * Math.cos(player.yaw) - dz * Math.sin(player.yaw));
      if (depth > 0 && depth < 36 && lateral < 1.5) {
        enemy.health -= 130;
        enemy.hitFlash = 0.2;
        hits += 1;
      }
    }
  } else {
    for (const enemy of enemies) {
      const distance = Math.hypot(enemy.x - player.x, enemy.z - player.z);
      if (distance <= (hero === 'warden' ? 13 : 7)) {
        enemy.health -= hero === 'warden' ? 115 : 95;
        enemy.hitFlash = 0.2;
        if (hero === 'warden') enemy.slowTimer = 2.5;
        hits += 1;
      }
    }
  }

  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    if (enemies[i].health <= 0) destroyEnemy(i);
  }
  for (let i = 0; i < 18; i += 1) {
    particles.push({
      x: canvas.width / 2 + randomBetween(-100, 100),
      y: canvas.height * 0.56 + randomBetween(-70, 70),
      vx: randomBetween(-180, 180), vy: randomBetween(-150, 150),
      life: randomBetween(0.35, 0.8), color: heroConfig[hero].color,
      radius: randomBetween(2, 6)
    });
  }
  playTone(95, 760, 0.65, 'sawtooth', 0.08);
  showFeed(`${heroConfig[hero].name} unleashes an ultimate: ${hits} hit${hits === 1 ? '' : 's'}.`);
}

function destroyEnemy(index) {
  const enemy = enemies[index];
  const point = getViewPoint(enemy.x, enemy.z, 1);
  score += 1;
  if (score % 4 === 0 || enemy.type === 'colossus') {
    const pickupType = player.health < player.maxHealth - 20 ? 'repair' : 'charge';
    pickups.push({
      x: enemy.x, z: enemy.z,
      type: pickupType,
      life: 18
    });
    if (pickups.length > 8) pickups.shift();
    showFeed(pickupType === 'repair' ? 'Repair charge deployed.' : 'Energy cell deployed.');
  }
  combo = comboTimer > 0 ? Math.min(8, combo + 1) : 1;
  comboTimer = 2.5;
  player.energy = clamp(player.energy + 10, 0, 100);
  if (point) {
    for (let i = 0; i < 12; i += 1) {
      particles.push({
        x: point.x, y: point.y,
        vx: randomBetween(-100, 100), vy: randomBetween(-130, 50),
        life: randomBetween(0.2, 0.55), color: enemy.color,
        radius: randomBetween(2, 5)
      });
    }
  }
  enemies.splice(index, 1);
  syncScore(score);
  if (combo >= 3) showFeed(`${combo}× elimination streak!`);
  renderLeaderboard();
  updateHud();
  playTone(420, 120, 0.16, 'triangle', 0.045);
}

function update(dt) {
  if (!player || !gameStarted || gameOver) return;

  const horizontal = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const forward = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
  const length = Math.hypot(horizontal, forward) || 1;
  const speed = player.moveSpeed * dt;
  moveEntity(
    player,
    (Math.cos(player.yaw) * horizontal + Math.sin(player.yaw) * forward) / length * speed,
    (-Math.sin(player.yaw) * horizontal + Math.cos(player.yaw) * forward) / length * speed,
    0.55
  );
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.abilityCooldown = Math.max(0, player.abilityCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  if (player.reloadTimer > 0) {
    player.reloadTimer = Math.max(0, player.reloadTimer - dt);
    if (player.reloadTimer === 0) {
      player.ammo = player.maxAmmo;
      playTone(340, 620, 0.12, 'triangle', 0.035);
      showFeed('Weapon reloaded.');
    }
  }
  player.energy = clamp(player.energy + dt * 4, 0, 100);
  recoil = Math.max(0, recoil - dt);
  damageFlash = Math.max(0, damageFlash - dt * 2.5);
  dashFlash = Math.max(0, dashFlash - dt);
  ultimateFlash = Math.max(0, ultimateFlash - dt);
  hitMarker = Math.max(0, hitMarker - dt);
  comboTimer = Math.max(0, comboTimer - dt);
  if (comboTimer === 0) combo = 1;

  if (keys.Space || mouseFiring) fireWeapon();

  for (const enemy of enemies) {
    const dx = player.x - enemy.x;
    const dz = player.z - enemy.z;
    const distance = Math.hypot(dx, dz) || 1;
    const wasWindingUp = enemy.attackWindup > 0;
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    enemy.slowTimer = Math.max(0, enemy.slowTimer - dt);
    enemy.attackWindup = Math.max(0, enemy.attackWindup - dt);
    if (enemy.type === 'arcanist') {
      if (distance > 11) {
        enemy.x += dx / distance * enemy.speed * dt;
        enemy.z += dz / distance * enemy.speed * dt;
      } else if (distance < 7) {
        enemy.x -= dx / distance * enemy.speed * dt;
        enemy.z -= dz / distance * enemy.speed * dt;
      }
      if (!wasWindingUp && enemy.attackCooldown === 0 && distance < 18 && distance > 1.25) {
        enemy.attackWindup = 0.65;
        enemy.attackCooldown = 2.1;
      } else if (wasWindingUp && enemy.attackWindup === 0) {
        const aimDistance = Math.hypot(player.x - enemy.x, player.z - enemy.z) || 1;
        const projectileSpeed = 8.5;
        projectiles.push({
          x: enemy.x, z: enemy.z,
          vx: (player.x - enemy.x) / aimDistance * projectileSpeed,
          vz: (player.z - enemy.z) / aimDistance * projectileSpeed,
          damage: enemy.damage, color: enemy.color, life: 3
        });
        playTone(480, 240, 0.12, 'sine', 0.025);
      }
    } else if (enemy.type === 'colossus') {
      if (distance > 2.2) {
        enemy.x += dx / distance * enemy.speed * dt;
        enemy.z += dz / distance * enemy.speed * dt;
      }
      if (!wasWindingUp && enemy.attackCooldown === 0 && distance < 6) {
        enemy.attackWindup = 0.95;
        enemy.attackCooldown = 3.2;
      } else if (wasWindingUp && enemy.attackWindup === 0 && distance < 5 && player.invuln <= 0) {
        player.health -= enemy.damage * 1.5;
        player.invuln = 0.45;
        damageFlash = 0.9;
        ultimateFlash = Math.max(ultimateFlash, 0.22);
        showFeed('Colossus ground slam · evade the impact!');
        if (player.health <= 0) {
          endGame();
          return;
        }
      }
    } else if (distance > 1.25) {
      const slow = enemy.slowTimer > 0 ? 0.35 : 1;
      enemy.x += dx / distance * enemy.speed * slow * dt;
      enemy.z += dz / distance * enemy.speed * slow * dt;
    } else if (enemy.attackCooldown === 0 && player.invuln <= 0) {
      player.health -= enemy.damage;
      player.invuln = 0.35;
      enemy.attackCooldown = 0.85;
      damageFlash = 0.75;
      playTone(95, 42, 0.2, 'square', 0.06);
      showFeed('Incoming hit. Keep moving!');
      if (player.health <= 0) {
        endGame();
        return;
      }
    }
    moveEntity(enemy, 0, 0, enemy.type === 'colossus' ? 0.9 : 0.45);
  }

  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    projectile.x += projectile.vx * dt;
    projectile.z += projectile.vz * dt;
    projectile.life -= dt;
    if (!isClearOfMap(projectile.x, projectile.z)) {
      projectiles.splice(i, 1);
      continue;
    }
    if (Math.hypot(projectile.x - player.x, projectile.z - player.z) < 0.55) {
      if (player.invuln <= 0) {
        player.health -= projectile.damage;
        player.invuln = 0.28;
        damageFlash = 0.6;
        playTone(110, 50, 0.16, 'square', 0.045);
        if (player.health <= 0) {
          projectiles.splice(i, 1);
          endGame();
          return;
        }
      }
      projectiles.splice(i, 1);
    } else if (projectile.life <= 0 || Math.abs(projectile.x) > arenaSize || Math.abs(projectile.z) > arenaSize) {
      projectiles.splice(i, 1);
    }
  }

  for (let i = pickups.length - 1; i >= 0; i -= 1) {
    const pickup = pickups[i];
    pickup.life -= dt;
    if (Math.hypot(pickup.x - player.x, pickup.z - player.z) < 1.35) {
      if (pickup.type === 'repair') {
        const restored = restoreHealth(0.2);
        showFeed(`Field repair collected · +${restored} health.`);
      } else {
        player.energy = clamp(player.energy + 35, 0, 100);
        showFeed('Charge cell collected · +35 energy.');
      }
      playTone(280, 720, 0.2, 'sine', 0.045);
      pickups.splice(i, 1);
    } else if (pickup.life <= 0) {
      pickups.splice(i, 1);
    }
  }

  updateObjective(dt);

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    if (particle.life <= 0) particles.splice(i, 1);
  }
  for (let i = tracers.length - 1; i >= 0; i -= 1) {
    tracers[i].life -= dt;
    if (tracers[i].life <= 0) tracers.splice(i, 1);
  }

  elapsed += dt;
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    const nextWave = 1 + Math.floor(score / 8);
    if (nextWave > wave) showFeed(`Wave ${nextWave} · enemy pressure increasing.`);
    wave = nextWave;
    const amount = 1 + Math.min(2, Math.floor(wave / 2));
    for (let i = 0; i < amount; i += 1) spawnEnemy();
    spawnTimer = Math.max(0.85, 2.1 - wave * 0.07) + Math.random() * 0.45;
  }
  updateHud();
}

function updateObjective(dt) {
  if (!objective) return;
  if (objectiveTransition > 0) {
    objectiveTransition = Math.max(0, objectiveTransition - dt);
    if (objectiveTransition === 0) {
      objective = randomObjectivePosition();
      objectiveProgress = 0;
      showFeed('A new conduit has activated. Secure the zone!');
    }
    return;
  }

  const inside = Math.hypot(player.x - objective.x, player.z - objective.z) <= 4.2;
  objectiveContested = inside && enemies.some((enemy) => Math.hypot(enemy.x - objective.x, enemy.z - objective.z) <= 3.2);
  if (objectiveContested) {
    captureStatus.textContent = 'CONTESTED · clear the zone';
    objectiveProgress = Math.max(0, objectiveProgress - dt * 2);
  } else if (inside) {
    objectiveProgress = Math.min(100, objectiveProgress + dt * 16);
    captureStatus.textContent = objectiveProgress >= 100 ? 'CONDUIT SECURED' : 'Hold position to secure';
    if (objectiveProgress >= 100) {
      objectiveTransition = 2.5;
      player.energy = clamp(player.energy + 28, 0, 100);
      const restored = restoreHealth(0.15);
      showFeed(`Conduit secured · ${restored} health and energy restored.`);
      playTone(220, 880, 0.55, 'sine', 0.07);
    }
  } else {
    objectiveProgress = Math.max(0, objectiveProgress - dt * 1.5);
    captureStatus.textContent = 'Move into the conduit ring';
  }
}

function endGame() {
  gameOver = true;
  updateSelectionControls();
  overlayTitle.textContent = 'Mission failed';
  overlayText.textContent = `You reached ${score} eliminations in ${formatTime(elapsed)}. Re-deploy and try again.`;
  overlay.classList.remove('hidden');
  updateAbilityButton();
  updateActionButtons();
  document.exitPointerLock?.();
  showFeed('Front line collapsed. Resetting deployment.');
}

function drawBackground() {
  const palette = arenaMaps[selectedMap].palette;
  const sky = ctx.createLinearGradient(0, 0, 0, horizon + 70);
  sky.addColorStop(0, palette.sky[0]);
  sky.addColorStop(0.52, palette.sky[1]);
  sky.addColorStop(1, palette.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, horizon + 70);

  const lookShift = Math.sin(player?.yaw || 0) * 90;
  const haze = ctx.createRadialGradient(canvas.width * 0.52 + lookShift * 0.25, horizon * 0.72, 4, canvas.width * 0.52 + lookShift * 0.25, horizon * 0.72, canvas.width * 0.6);
  haze.addColorStop(0, palette.haze[0]);
  haze.addColorStop(0.4, palette.haze[1]);
  haze.addColorStop(1, 'rgba(31, 39, 101, 0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, canvas.width, horizon + 80);

  for (let i = 0; i < 96; i += 1) {
    const x = (i * 197 + 31) % canvas.width;
    const y = (i * 83 + 17) % Math.max(1, Math.floor(horizon * 0.74));
    const twinkle = 0.35 + (Math.sin(elapsed * 2 + i * 1.7) + 1) * 0.25;
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = i % 7 === 0 ? '#ffdc9b' : palette.stars;
    ctx.beginPath();
    ctx.arc(x, y, i % 9 === 0 ? 1.7 : 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const skylineShift = Math.sin(player?.yaw || 0) * 44;
  for (let i = 0; i < 18; i += 1) {
    const width = 32 + (i * 29 % 48);
    const height = 28 + (i * 47 % 76);
    const x = ((i * 91 + skylineShift + canvas.width) % (canvas.width + 90)) - 45;
    const y = horizon - height;
    ctx.fillStyle = i % 3 === 0 ? palette.sky[0] : palette.skyline;
    ctx.beginPath();
    ctx.moveTo(x, horizon + 5);
    ctx.lineTo(x, y + 9);
    ctx.lineTo(x + width * 0.32, y);
    ctx.lineTo(x + width * 0.7, y + 5);
    ctx.lineTo(x + width, y + 15);
    ctx.lineTo(x + width, horizon + 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = palette.windows;
    for (let windowY = y + 18; windowY < horizon - 5; windowY += 15) {
      ctx.fillRect(x + 7, windowY, 2, 4);
      ctx.fillRect(x + width - 10, windowY + 4, 2, 4);
    }
  }

  const ringX = canvas.width * 0.53 + lookShift * 0.55;
  const ringY = horizon * 0.82;
  ctx.save();
  ctx.translate(ringX, ringY);
  ctx.rotate(-0.15);
  ctx.strokeStyle = palette.ring;
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.ellipse(0, 0, canvas.width * 0.29, horizon * 0.58, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = palette.objective;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, canvas.width * 0.29, horizon * 0.58, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const floor = ctx.createLinearGradient(0, horizon, 0, canvas.height);
  floor.addColorStop(0, palette.floor[0]);
  floor.addColorStop(0.22, palette.floor[1]);
  floor.addColorStop(1, palette.floor[2]);
  ctx.fillStyle = floor;
  ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);

  const floorGlow = ctx.createRadialGradient(canvas.width * 0.5, horizon + 30, 2, canvas.width * 0.5, horizon + 30, canvas.width * 0.72);
  floorGlow.addColorStop(0, palette.glow[0]);
  floorGlow.addColorStop(0.44, palette.glow[1]);
  floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = floorGlow;
  ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);

  ctx.fillStyle = palette.objective;
  ctx.fillRect(0, horizon - 1, canvas.width, 2);

  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  for (let z = -arenaSize; z <= arenaSize; z += 3) {
    const left = getViewPoint(-arenaSize, z);
    const right = getViewPoint(arenaSize, z);
    if (!left || !right) continue;
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }
  for (let x = -arenaSize; x <= arenaSize; x += 3) {
    const near = getViewPoint(x, -arenaSize);
    const far = getViewPoint(x, arenaSize);
    if (!near || !far) continue;
    ctx.beginPath();
    ctx.moveTo(near.x, near.y);
    ctx.lineTo(far.x, far.y);
    ctx.stroke();
  }
  ctx.strokeStyle = palette.lanes;
  ctx.lineWidth = 2;
  for (const x of [-3.6, 3.6]) {
    const near = getViewPoint(x, -arenaSize);
    const far = getViewPoint(x, arenaSize);
    if (!near || !far) continue;
    ctx.beginPath();
    ctx.moveTo(near.x, near.y);
    ctx.lineTo(far.x, far.y);
    ctx.stroke();
  }
  drawArenaStructures();
  drawArenaWalls();
  drawObjective();
}

function drawObjective() {
  if (!objective) return;
  const pulse = 0.78 + Math.sin(elapsed * 3.4) * 0.16;
  const color = objectiveContested ? '#ff648e' : arenaMaps[selectedMap].palette.objective;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.lineWidth = 2;
  ctx.globalAlpha = pulse;

  let previous = null;
  const segments = 48;
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const point = getViewPoint(objective.x + Math.cos(angle) * 4.2, objective.z + Math.sin(angle) * 4.2);
    if (!point) {
      previous = null;
      continue;
    }
    if (previous) {
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    previous = point;
  }

  const base = getViewPoint(objective.x, objective.z);
  const crown = getViewPoint(objective.x, objective.z, 3.3);
  if (base && crown && base.x > -80 && base.x < canvas.width + 80) {
    const width = clamp(base.scale * 0.58, 5, 48);
    const crystal = ctx.createLinearGradient(base.x - width, crown.y, base.x + width, base.y);
    crystal.addColorStop(0, '#ffffff');
    crystal.addColorStop(0.35, color);
    crystal.addColorStop(1, `${color}00`);
    ctx.fillStyle = crystal;
    ctx.beginPath();
    ctx.moveTo(base.x, crown.y);
    ctx.lineTo(base.x + width * 0.48, (base.y + crown.y) / 2);
    ctx.lineTo(base.x, base.y);
    ctx.lineTo(base.x - width * 0.48, (base.y + crown.y) / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(base.x - 1.5, crown.y + 8, 3, Math.max(2, base.y - crown.y - 8));
  }
  ctx.restore();
}

function drawArenaStructures() {
  for (const structure of arenaMaps[selectedMap].landmarks) {
    const base = getViewPoint(structure.x, structure.z);
    const top = getViewPoint(structure.x, structure.z, structure.height);
    if (!base || !top || base.x < -160 || base.x > canvas.width + 160) continue;
    const halfWidth = clamp(base.scale * (structure.radius || 0.52), 4, structure.radius ? 52 : 70);
    const side = halfWidth * 0.42;
    const gradient = ctx.createLinearGradient(base.x - halfWidth, top.y, base.x + halfWidth, base.y);
    gradient.addColorStop(0, `${structure.color}dd`);
    gradient.addColorStop(0.38, structure.kind === 'factory' ? '#684247' : '#39406d');
    gradient.addColorStop(1, '#17182f');

    ctx.save();
    ctx.shadowColor = structure.color;
    ctx.shadowBlur = Math.min(20, base.scale * 0.16);
    if (structure.kind === 'factory') {
      ctx.fillStyle = '#151522';
      ctx.fillRect(base.x - halfWidth, top.y + side * 0.5, halfWidth * 2, base.y - top.y - side * 0.5);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(base.x - halfWidth, top.y + side * 0.5);
      ctx.lineTo(base.x - halfWidth * 0.72, top.y);
      ctx.lineTo(base.x + halfWidth * 0.52, top.y);
      ctx.lineTo(base.x + halfWidth, top.y + side * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#171520';
      ctx.fillRect(base.x - halfWidth * 0.58, top.y - side * 1.15, halfWidth * 0.26, side * 1.25);
      ctx.fillStyle = structure.color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(base.x - halfWidth * 0.36, top.y + side * 0.9, halfWidth * 0.72, Math.max(2, side * 0.14));
      ctx.fillRect(base.x + halfWidth * 0.42, top.y - side * 0.85, Math.max(2, halfWidth * 0.08), side * 0.52);
    } else if (structure.kind === 'crystal') {
      ctx.fillStyle = '#11152c';
      ctx.beginPath();
      ctx.moveTo(base.x, top.y);
      ctx.lineTo(base.x + halfWidth * 0.7, top.y + side * 0.8);
      ctx.lineTo(base.x + halfWidth * 0.38, base.y);
      ctx.lineTo(base.x - halfWidth * 0.45, base.y);
      ctx.lineTo(base.x - halfWidth * 0.7, top.y + side * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(base.x, top.y);
      ctx.lineTo(base.x + halfWidth * 0.7, top.y + side * 0.8);
      ctx.lineTo(base.x + halfWidth * 0.2, base.y - side * 0.15);
      ctx.lineTo(base.x - halfWidth * 0.14, base.y - side * 0.15);
      ctx.lineTo(base.x - halfWidth * 0.7, top.y + side * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.72;
      ctx.beginPath();
      ctx.moveTo(base.x, top.y + side * 0.15);
      ctx.lineTo(base.x + halfWidth * 0.12, base.y - side * 0.2);
      ctx.lineTo(base.x, base.y - side * 0.15);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = '#11152c';
      ctx.beginPath();
      ctx.moveTo(base.x - halfWidth, base.y);
      ctx.lineTo(base.x - halfWidth * 0.72, top.y + side);
      ctx.lineTo(base.x, top.y);
      ctx.lineTo(base.x + halfWidth, top.y + side * 0.6);
      ctx.lineTo(base.x + halfWidth, base.y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(base.x - halfWidth * 0.72, base.y);
      ctx.lineTo(base.x - halfWidth * 0.5, top.y + side);
      ctx.lineTo(base.x, top.y);
      ctx.lineTo(base.x + halfWidth * 0.7, top.y + side * 0.6);
      ctx.lineTo(base.x + halfWidth * 0.7, base.y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = structure.color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(base.x - 1.5, top.y + side, 3, Math.max(2, base.y - top.y - side));
    }
    ctx.restore();
  }
}

function drawArenaWalls() {
  const wallColor = arenaMaps[selectedMap].palette.wall;
  const corners = [
    [-arenaSize, -arenaSize], [arenaSize, -arenaSize],
    [arenaSize, arenaSize], [-arenaSize, arenaSize]
  ].map(([x, z]) => getViewPoint(x, z));
  ctx.strokeStyle = wallColor;
  ctx.lineWidth = 2;
  for (const corner of corners) {
    if (!corner) continue;
    const top = corner.y - corner.scale * 3.2;
    ctx.beginPath();
    ctx.moveTo(corner.x, corner.y);
    ctx.lineTo(corner.x, top);
    ctx.stroke();
  }
  const topCorners = corners.map((corner) => corner && ({
    x: corner.x,
    y: corner.y - corner.scale * 3.2
  }));
  ctx.beginPath();
  topCorners.forEach((corner, index) => {
    const next = topCorners[(index + 1) % topCorners.length];
    if (!corner || !next) return;
    ctx.moveTo(corner.x, corner.y);
    ctx.lineTo(next.x, next.y);
  });
  ctx.stroke();
}

function drawEnemy(enemy) {
  const point = getViewPoint(enemy.x, enemy.z, 1);
  if (!point || point.x < -160 || point.x > canvas.width + 160) return;
  const height = clamp(point.scale * (enemy.type === 'colossus' ? 3.2 : enemy.type === 'bulwark' ? 2.35 : 2.15), 16, canvas.height * 1.45);
  const width = height * (enemy.type === 'colossus' ? 0.74 : enemy.type === 'bulwark' ? 0.62 : 0.48);
  const x = point.x;
  const y = horizon + eyeHeight * Math.min(point.scale, height / 2.15);
  const color = enemy.hitFlash > 0 ? '#ffffff' : enemy.color;

  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y - 2, width * 0.72, Math.max(2, height * 0.075), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.shadowColor = color;
  ctx.shadowBlur = Math.min(32, point.scale * 0.28);
  const armor = ctx.createLinearGradient(x - width * 0.55, y - height, x + width * 0.55, y);
  armor.addColorStop(0, enemy.hitFlash > 0 ? '#ffffff' : '#f6f7ff');
  armor.addColorStop(0.24, color);
  armor.addColorStop(0.62, enemy.color === '#ff5c77' ? '#761e4d' : '#184b79');
  armor.addColorStop(1, '#101629');

  ctx.fillStyle = '#11172b';
  ctx.beginPath();
  ctx.moveTo(x - width * 0.23, y - height * 0.44);
  ctx.lineTo(x - width * 0.43, y - height * 0.1);
  ctx.lineTo(x - width * 0.28, y);
  ctx.lineTo(x - width * 0.04, y - height * 0.06);
  ctx.lineTo(x + width * 0.04, y - height * 0.06);
  ctx.lineTo(x + width * 0.28, y);
  ctx.lineTo(x + width * 0.43, y - height * 0.1);
  ctx.lineTo(x + width * 0.23, y - height * 0.44);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = armor;
  ctx.beginPath();
  ctx.moveTo(x - width * 0.25, y - height * 0.55);
  ctx.lineTo(x - width * 0.46, y - height * 0.49);
  ctx.lineTo(x - width * 0.53, y - height * 0.31);
  ctx.lineTo(x - width * 0.37, y - height * 0.23);
  ctx.lineTo(x - width * 0.21, y - height * 0.35);
  ctx.lineTo(x + width * 0.21, y - height * 0.35);
  ctx.lineTo(x + width * 0.37, y - height * 0.23);
  ctx.lineTo(x + width * 0.53, y - height * 0.31);
  ctx.lineTo(x + width * 0.46, y - height * 0.49);
  ctx.lineTo(x + width * 0.25, y - height * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#202844';
  ctx.beginPath();
  ctx.moveTo(x - width * 0.24, y - height * 0.56);
  ctx.lineTo(x - width * 0.16, y - height * 0.8);
  ctx.lineTo(x + width * 0.16, y - height * 0.8);
  ctx.lineTo(x + width * 0.24, y - height * 0.56);
  ctx.lineTo(x + width * 0.17, y - height * 0.35);
  ctx.lineTo(x - width * 0.17, y - height * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = armor;
  ctx.beginPath();
  ctx.ellipse(x, y - height * 0.86, width * 0.2, height * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#11172b';
  ctx.beginPath();
  ctx.moveTo(x - width * 0.14, y - height * 0.88);
  ctx.lineTo(x - width * 0.24, y - height * 1.04);
  ctx.lineTo(x - width * 0.04, y - height * 0.98);
  ctx.lineTo(x, y - height * 1.04);
  ctx.lineTo(x + width * 0.04, y - height * 0.98);
  ctx.lineTo(x + width * 0.24, y - height * 1.04);
  ctx.lineTo(x + width * 0.14, y - height * 0.88);
  ctx.closePath();
  ctx.fill();

  const coreRadius = width * (0.2 + Math.sin(elapsed * 6) * 0.015);
  const core = ctx.createRadialGradient(x, y - height * 0.48, 1, x, y - height * 0.48, coreRadius);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.28, color);
  core.addColorStop(1, `${color}00`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y - height * 0.48, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `${color}cc`;
  ctx.lineWidth = Math.max(1, point.scale * 0.018);
  ctx.beginPath();
  ctx.moveTo(x - width * 0.14, y - height * 0.73);
  ctx.lineTo(x + width * 0.14, y - height * 0.73);
  ctx.stroke();
  ctx.restore();

  const barWidth = width * 1.16;
  const barY = y - height * 1.08 - 8;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(x - barWidth / 2, barY, barWidth, 5);
  ctx.fillStyle = '#ff6a7f';
  ctx.fillRect(x - barWidth / 2, barY, barWidth * clamp(enemy.health / enemy.maxHealth, 0, 1), 5);

  if (enemy.type === 'arcanist' || enemy.type === 'colossus') {
    const elite = enemy.type === 'colossus';
    const charge = enemy.attackWindup > 0
      ? clamp(1 - enemy.attackWindup / (elite ? 0.95 : 0.65), 0, 1)
      : 0;
    const warningColor = elite ? '#ffc163' : '#bd76ff';
    const coreX = x;
    const coreY = y - height * 0.53;
    ctx.save();
    ctx.translate(coreX, coreY);
    ctx.rotate(elapsed * (enemy.attackWindup > 0 ? 3 : 0.8));
    ctx.strokeStyle = warningColor;
    ctx.globalAlpha = 0.5 + charge * 0.5;
    ctx.shadowColor = warningColor;
    ctx.shadowBlur = 12 + charge * 16;
    ctx.lineWidth = Math.max(1, point.scale * 0.025);
    ctx.beginPath();
    ctx.ellipse(0, 0, width * (elite ? 0.7 : 0.48) + charge * 12, height * (elite ? 0.2 : 0.12), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    if (enemy.attackWindup > 0) {
      ctx.save();
      ctx.globalAlpha = 0.16 + charge * 0.25;
      ctx.strokeStyle = warningColor;
      ctx.lineWidth = elite ? 3 : 2;
      if (elite) {
        ctx.beginPath();
        ctx.ellipse(x, y, width * (0.8 + charge * 0.35), height * 0.12, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        ctx.moveTo(x, coreY);
        ctx.lineTo(canvas.width / 2, horizon + 16);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    }
    if (elite) {
      ctx.save();
      ctx.fillStyle = '#ffe1a3';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLOSSUS', x, barY - 5);
      ctx.restore();
    }
  }
}

function drawProjectiles() {
  for (const projectile of projectiles) {
    const point = getViewPoint(projectile.x, projectile.z, 0.8);
    if (!point || point.x < -30 || point.x > canvas.width + 30) continue;
    const previous = getViewPoint(
      projectile.x - projectile.vx * 0.14,
      projectile.z - projectile.vz * 0.14,
      0.8
    );
    const radius = clamp(point.scale * 0.11, 3, 15);
    ctx.save();
    ctx.globalAlpha = clamp(projectile.life, 0.25, 1);
    ctx.strokeStyle = projectile.color;
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 20;
    ctx.lineWidth = Math.max(2, radius * 0.7);
    ctx.beginPath();
    ctx.moveTo(previous ? previous.x : point.x, previous ? previous.y : point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    const orb = ctx.createRadialGradient(point.x, point.y, 1, point.x, point.y, radius * 2.2);
    orb.addColorStop(0, '#ffffff');
    orb.addColorStop(0.28, projectile.color);
    orb.addColorStop(1, `${projectile.color}00`);
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawPickups() {
  for (const pickup of pickups) {
    const point = getViewPoint(pickup.x, pickup.z, 0.65);
    if (!point || point.x < -30 || point.x > canvas.width + 30) continue;
    const color = pickup.type === 'repair' ? '#72ffb5' : '#72dcff';
    const radius = clamp(point.scale * 0.12, 4, 17) * (0.86 + Math.sin(elapsed * 5) * 0.12);
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(elapsed * 0.9);
    ctx.globalAlpha = Math.min(1, pickup.life);
    ctx.shadowColor = color;
    ctx.shadowBlur = 22;
    ctx.fillStyle = 'rgba(10, 20, 42, 0.88)';
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.5, radius * 0.16);
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius, 0);
    ctx.lineTo(0, radius);
    ctx.lineTo(-radius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.rotate(-elapsed * 0.9);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(8, radius * 1.05)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pickup.type === 'repair' ? '+' : 'E', 0, 0);
    ctx.restore();
  }
}

function drawWeapon() {
  const moving = keys.KeyW || keys.KeyA || keys.KeyS || keys.KeyD;
  const sway = Math.sin(elapsed * (moving ? 13 : 7)) * (moving ? 9 : 4);
  const kick = recoil * 75;
  const x = canvas.width * 0.76;
  const y = canvas.height + 35 + kick + sway;
  const gradient = ctx.createLinearGradient(x - 115, y - 165, x + 130, y);
  gradient.addColorStop(0, '#334155');
  gradient.addColorStop(0.32, '#303e62');
  gradient.addColorStop(0.58, '#17162f');
  gradient.addColorStop(1, '#080913');

  ctx.save();
  ctx.shadowColor = `${skinColors[selectedSkin]}88`;
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#101329';
  ctx.beginPath();
  ctx.moveTo(x - 132, y);
  ctx.lineTo(x - 98, y - 121);
  ctx.lineTo(x - 40, y - 164);
  ctx.lineTo(x + 94, y - 151);
  ctx.lineTo(x + 142, y - 71);
  ctx.lineTo(x + 128, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x - 118, y);
  ctx.lineTo(x - 87, y - 114);
  ctx.lineTo(x - 37, y - 148);
  ctx.lineTo(x + 79, y - 140);
  ctx.lineTo(x + 125, y - 70);
  ctx.lineTo(x + 116, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#687da2';
  ctx.beginPath();
  ctx.moveTo(x - 39, y - 148);
  ctx.lineTo(x + 46, y - 142);
  ctx.lineTo(x + 63, y - 128);
  ctx.lineTo(x - 50, y - 132);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = skinColors[selectedSkin];
  ctx.globalAlpha = 0.22 + recoil * 3;
  ctx.beginPath();
  ctx.ellipse(x + 8, y - 137, 40, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#0a0d1b';
  ctx.beginPath();
  ctx.moveTo(x + 21, y - 119);
  ctx.lineTo(x + 79, y - 115);
  ctx.lineTo(x + 103, y - 76);
  ctx.lineTo(x + 30, y - 80);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `${skinColors[selectedSkin]}cc`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 35, y - 110);
  ctx.lineTo(x + 78, y - 106);
  ctx.stroke();

  ctx.fillStyle = '#1c2440';
  ctx.beginPath();
  ctx.moveTo(x - 64, y - 112);
  ctx.lineTo(x - 25, y - 107);
  ctx.lineTo(x - 10, y - 24);
  ctx.lineTo(x - 40, y - 3);
  ctx.lineTo(x - 78, y - 19);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#bd8b78';
  ctx.beginPath();
  ctx.ellipse(x - 48, y - 50, 24, 35, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#607184';
  ctx.fillRect(x - 37, y - 147, 72, 7);
  ctx.fillStyle = skinColors[selectedSkin];
  ctx.globalAlpha = 0.85;
  ctx.fillRect(x - 20, y - 137, 42, 3);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#0a1018';
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 78);
  ctx.lineTo(x + 48, y - 78);
  ctx.lineTo(x + 69, y - 4);
  ctx.lineTo(x - 27, y - 4);
  ctx.closePath();
  ctx.fill();

  const heroColor = heroConfig[selectedHero].color;
  ctx.shadowColor = heroColor;
  ctx.shadowBlur = 18;
  if (selectedHero === 'vanguard') {
    ctx.fillStyle = '#171a32';
    ctx.beginPath();
    ctx.moveTo(x - 172, y - 151);
    ctx.lineTo(x - 106, y - 170);
    ctx.lineTo(x - 79, y - 121);
    ctx.lineTo(x - 97, y - 45);
    ctx.lineTo(x - 150, y - 25);
    ctx.lineTo(x - 176, y - 91);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = heroColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = `${heroColor}99`;
    ctx.beginPath();
    ctx.moveTo(x - 148, y - 129);
    ctx.lineTo(x - 112, y - 143);
    ctx.lineTo(x - 103, y - 111);
    ctx.lineTo(x - 128, y - 78);
    ctx.closePath();
    ctx.fill();
  } else if (selectedHero === 'striker') {
    ctx.fillStyle = '#171a32';
    ctx.beginPath();
    ctx.moveTo(x - 188, y - 130);
    ctx.lineTo(x - 131, y - 143);
    ctx.lineTo(x - 112, y - 112);
    ctx.lineTo(x - 124, y - 93);
    ctx.lineTo(x - 183, y - 103);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = heroColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = heroColor;
    ctx.fillRect(x - 182, y - 125, 53, 5);
    ctx.fillRect(x - 176, y - 114, 39, 3);
  } else if (selectedHero === 'oracle') {
    ctx.strokeStyle = heroColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(x - 6, y - 187, 39, 17, -0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#10182b';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 216);
    ctx.lineTo(x + 9, y - 188);
    ctx.lineTo(x - 6, y - 160);
    ctx.lineTo(x - 21, y - 188);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#12182c';
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 158);
    ctx.lineTo(x + 135, y - 144);
    ctx.lineTo(x + 164, y - 95);
    ctx.lineTo(x + 42, y - 104);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = heroColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = `${heroColor}bb`;
    ctx.fillRect(x + 56, y - 139, 66, 8);
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(x + 120, y - 132, 25, 16);
  }
  ctx.shadowBlur = 0;

  if (recoil > 0.04) {
    const flash = ctx.createRadialGradient(x - 4, y - 147, 2, x - 4, y - 147, 50 + recoil * 120);
    flash.addColorStop(0, 'rgba(255,255,255,0.96)');
    flash.addColorStop(0.2, `${skinColors[selectedSkin]}dd`);
    flash.addColorStop(1, `${skinColors[selectedSkin]}00`);
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(x - 4, y - 147, 50 + recoil * 120, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawEffects() {
  for (const tracer of tracers) {
    ctx.globalAlpha = clamp(tracer.life * 10, 0, 1);
    ctx.strokeStyle = tracer.color;
    ctx.shadowColor = tracer.color;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.75, canvas.height * 0.78);
    ctx.lineTo(tracer.hit ? tracer.hit.x : canvas.width / 2, tracer.hit ? tracer.hit.y : horizon + 50);
    ctx.stroke();
    if (tracer.hit) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tracer.hit.x, tracer.hit.y, 14 - tracer.life * 35, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  for (const particle of particles) {
    ctx.globalAlpha = clamp(particle.life * 2.5, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawCrosshair() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const gap = 5 + recoil * 34;
  ctx.strokeStyle = hitMarker > 0 ? '#a7ffc9' : '#e9fbff';
  ctx.shadowColor = skinColors[selectedSkin];
  ctx.shadowBlur = 8;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - gap - 7, cy);
  ctx.lineTo(cx - gap, cy);
  ctx.moveTo(cx + gap, cy);
  ctx.lineTo(cx + gap + 7, cy);
  ctx.moveTo(cx, cy - gap - 7);
  ctx.lineTo(cx, cy - gap);
  ctx.moveTo(cx, cy + gap);
  ctx.lineTo(cx, cy + gap + 7);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 1, cy - 1, 2, 2);
  ctx.shadowBlur = 0;
}

function drawVignette() {
  const vignette = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.68
  );
  vignette.addColorStop(0, 'rgba(4, 7, 18, 0)');
  vignette.addColorStop(0.72, 'rgba(4, 7, 18, 0.04)');
  vignette.addColorStop(1, 'rgba(4, 7, 18, 0.46)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCombatOverlays() {
  if (dashFlash > 0) {
    const alpha = dashFlash * 0.34;
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.12, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
    gradient.addColorStop(0, 'rgba(70, 190, 255, 0)');
    gradient.addColorStop(1, `rgba(70, 190, 255, ${alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (ultimateFlash > 0) {
    const alpha = ultimateFlash * 0.2;
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.58, 8, canvas.width / 2, canvas.height * 0.58, canvas.width * 0.62);
    gradient.addColorStop(0, `rgba(255, 230, 255, ${alpha})`);
    gradient.addColorStop(0.26, `rgba(255, 100, 204, ${alpha * 0.65})`);
    gradient.addColorStop(1, 'rgba(110, 75, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawVignette();
}

function render() {
  drawBackground();
  [...enemies].sort((a, b) => {
    const da = (a.x - player.x) ** 2 + (a.z - player.z) ** 2;
    const db = (b.x - player.x) ** 2 + (b.z - player.z) ** 2;
    return db - da;
  }).forEach(drawEnemy);
  drawPickups();
  drawProjectiles();
  drawEffects();
  drawWeapon();
  drawCrosshair();
  drawCombatOverlays();
  if (damageFlash > 0) {
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 90, canvas.width / 2, canvas.height / 2, canvas.width * 0.65);
    gradient.addColorStop(0, 'rgba(255,35,65,0)');
    gradient.addColorStop(1, `rgba(255,35,65,${damageFlash * 0.55})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function loop(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min(0.033, (ts - lastTime) / 1000);
  lastTime = ts;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function bindControls() {
  window.addEventListener('keydown', (event) => {
    if (!settingsModal.classList.contains('hidden') || !controlsModal.classList.contains('hidden')) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (target?.closest('button') && (!gameStarted || event.code === 'Space')) return;
    keys[event.code] = true;
    if (gameStarted && !gameOver && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') performDash();
    if (event.code === 'KeyF') performAbility();
    if (event.code === 'KeyE' || event.code === 'KeyQ') performUltimate();
    if (event.code === 'KeyR') reloadWeapon();
  });
  window.addEventListener('keyup', (event) => { keys[event.code] = false; });
  window.addEventListener('blur', () => {
    Object.keys(keys).forEach((key) => { keys[key] = false; });
    mouseFiring = false;
  });

  canvas.addEventListener('click', () => {
    if (gameStarted && !gameOver) canvas.requestPointerLock?.();
  });
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
      canvas.addEventListener('mousemove', onMouseMove);
    } else {
      canvas.removeEventListener('mousemove', onMouseMove);
    }
  });
  function onMouseMove(event) {
    if (player) player.yaw += event.movementX * mouseSensitivity;
  }
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button === 0 && gameStarted) {
      mouseFiring = true;
      fireWeapon();
    }
  });
  window.addEventListener('pointerup', () => { mouseFiring = false; });
  window.addEventListener('pointercancel', () => { mouseFiring = false; });
}

function bindHeroSelection() {
  heroOptions.forEach((option) => {
    option.addEventListener('click', () => {
      if (gameStarted && !gameOver) {
        showFeed('Finish the deployment before changing hero.');
        return;
      }
      selectedHero = option.dataset.hero;
      heroOptions.forEach((item) => item.classList.toggle('active', item === option));
      updateAbilityCard();
      hud.hp.textContent = `${heroConfig[selectedHero].maxHealth} / ${heroConfig[selectedHero].maxHealth}`;
      hud.hpProgress.style.width = '100%';
      hud.hp.closest('.health-hud').classList.remove('low', 'critical');
      showFeed(`${heroConfig[selectedHero].name} selected.`);
    });
  });
}

function selectArena(mapKey) {
  const map = arenaMaps[mapKey];
  if (!map) return;
  selectedMap = mapKey;
  arenaMapName.textContent = map.name;
  document.documentElement.style.setProperty('--map-accent', map.palette.objective);
  mapOptions.forEach((option) => {
    const active = option.dataset.map === mapKey;
    option.classList.toggle('active', active);
    option.setAttribute('aria-pressed', String(active));
  });
}

function bindMapSelection() {
  mapOptions.forEach((option) => {
    option.addEventListener('click', () => {
      if (gameStarted && !gameOver) {
        showFeed('Finish the deployment before changing arena.');
        return;
      }
      selectArena(option.dataset.map);
      showFeed(`${arenaMaps[selectedMap].name} selected.`);
    });
  });
  selectArena(selectedMap);
}

function renderLeaderboard() {
  const rows = socialSnapshot.leaderboard;
  if (!socialSession || rows.length === 0) {
    const item = document.createElement('li');
    item.className = 'leaderboard-empty';
    item.textContent = socialSession ? 'No scores posted yet.' : 'Connect to view live server scores.';
    leaderboard.replaceChildren(item);
    return;
  }
  leaderboard.replaceChildren(...rows.map((entry, index) => {
    const item = document.createElement('li');
    item.classList.toggle('you', entry.id === socialSnapshot.player?.id);
    const rank = document.createElement('span');
    rank.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('span');
    name.textContent = entry.username;
    const presence = document.createElement('small');
    presence.className = `leaderboard-presence${entry.online ? ' online' : ''}`;
    presence.textContent = entry.online ? 'LIVE' : '';
    const points = document.createElement('strong');
    points.textContent = String(entry.bestScore);
    item.append(rank, name, presence, points);
    return item;
  }));
}

function updateNetworkStatus(status, message) {
  networkStatus.textContent = status;
  networkStatus.className = `network-status ${status.toLowerCase()}`;
  if (message) networkMessage.textContent = message;
}

async function apiRequest(route, { method = 'GET', body, token } = {}) {
  const headers = {};
  const authToken = token || socialSession?.token;
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(route, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  let payload = null;
  if (response.status !== 204) {
    try {
      payload = await response.json();
    } catch {
      throw new Error('The game server returned an invalid response.');
    }
  }
  if (!response.ok) throw new Error(payload?.error || `Game server request failed (${response.status}).`);
  return payload;
}

function renderFriends() {
  if (!socialSession) return;
  if (socialSnapshot.friends.length === 0) {
    const item = document.createElement('li');
    item.className = 'friend-list-empty';
    item.textContent = 'No friends yet. Share your code or add theirs.';
    friendList.replaceChildren(item);
    return;
  }
  friendList.replaceChildren(...socialSnapshot.friends.map((friend) => {
    const item = document.createElement('li');
    const presence = document.createElement('span');
    presence.className = `presence${friend.online ? ' online' : ' away'}`;
    const name = document.createElement('span');
    name.className = 'friend-name';
    name.textContent = friend.username;
    const status = document.createElement('small');
    status.textContent = friend.online ? 'ONLINE' : 'OFFLINE';
    const removeButton = document.createElement('button');
    removeButton.className = 'friend-remove';
    removeButton.type = 'button';
    removeButton.textContent = '×';
    removeButton.setAttribute('aria-label', `Remove ${friend.username} from friends`);
    removeButton.addEventListener('click', () => removeFriend(friend.id));
    item.append(presence, name, status, removeButton);
    return item;
  }));
}

function applySocialSnapshot(snapshot) {
  if (!snapshot?.player || !Array.isArray(snapshot.friends) || !Array.isArray(snapshot.leaderboard)) {
    throw new Error('The game server sent incomplete social data.');
  }
  socialSnapshot = snapshot;
  friendCode.textContent = snapshot.player.friendCode;
  friendTools.classList.remove('hidden');
  accountForm.classList.add('hidden');
  renderFriends();
  renderLeaderboard();
  updateNetworkStatus('ONLINE', `Connected as ${snapshot.player.username}. Scores and friend presence are live.`);
}

function readSavedSession() {
  try {
    const saved = window.localStorage.getItem('aether-rivals-session');
    if (!saved) return null;
    const session = JSON.parse(saved);
    if (typeof session.username === 'string' && typeof session.token === 'string') return session;
    window.localStorage.removeItem('aether-rivals-session');
    updateNetworkStatus('OFFLINE', 'Saved pilot profile was invalid. Connect again to create a profile.');
  } catch (error) {
    updateNetworkStatus('OFFLINE', `Could not read the saved pilot profile: ${error.message}`);
  }
  return null;
}

async function connectProfile(savedToken) {
  const username = usernameInput.value.trim();
  if (!username) {
    updateNetworkStatus('OFFLINE', 'Enter a pilot name to connect.');
    usernameInput.focus();
    return;
  }
  connectButton.disabled = true;
  updateNetworkStatus('CONNECTING', 'Connecting to the game server…');
  try {
    const result = await apiRequest('/api/session', {
      method: 'POST',
      body: { username, token: savedToken },
      token: savedToken
    });
    socialSession = { username: result.player.username, token: result.token };
    lastSyncedScore = result.player.bestScore;
    window.localStorage.setItem('aether-rivals-session', JSON.stringify(socialSession));
    applySocialSnapshot(result);
    startSocialUpdates();
  } catch (error) {
    updateNetworkStatus('OFFLINE', error.message);
    accountForm.classList.remove('hidden');
    friendTools.classList.add('hidden');
  } finally {
    connectButton.disabled = false;
  }
}

function startSocialUpdates() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  if (liveStream) liveStream.close();
  heartbeatTimer = setInterval(() => {
    apiRequest('/api/heartbeat', { method: 'POST' }).catch((error) => {
      updateNetworkStatus('RECONNECTING', `Server connection interrupted: ${error.message}`);
    });
  }, 15_000);
  connectLiveStream();
}

async function connectLiveStream() {
  if (!socialSession || !window.EventSource) return;
  try {
    const { ticket } = await apiRequest('/api/events-ticket', { method: 'POST' });
    const stream = new window.EventSource(`/api/events?ticket=${encodeURIComponent(ticket)}`);
    liveStream = stream;
    stream.addEventListener('snapshot', (event) => {
      try {
        applySocialSnapshot(JSON.parse(event.data));
      } catch (error) {
        updateNetworkStatus('OFFLINE', `Live social update failed: ${error.message}`);
      }
    });
    stream.onerror = () => {
      stream.close();
      if (liveStream === stream) liveStream = null;
      updateNetworkStatus('RECONNECTING', 'Live updates interrupted. Reconnecting…');
      scheduleLiveReconnect();
    };
  } catch (error) {
    updateNetworkStatus('RECONNECTING', `Live connection unavailable: ${error.message}`);
    scheduleLiveReconnect();
  }
}

function scheduleLiveReconnect() {
  if (liveReconnectTimer || !socialSession) return;
  liveReconnectTimer = setTimeout(() => {
    liveReconnectTimer = null;
    connectLiveStream();
  }, 3_000);
}

async function addFriend() {
  addFriendButton.disabled = true;
  try {
    const snapshot = await apiRequest('/api/friends', {
      method: 'POST',
      body: { friendCode: friendCodeInput.value }
    });
    applySocialSnapshot(snapshot);
    networkMessage.textContent = 'Friend added. You will both see each other’s online status.';
    friendCodeInput.value = '';
  } catch (error) {
    networkMessage.textContent = error.message;
  } finally {
    addFriendButton.disabled = false;
  }
}

async function removeFriend(friendId) {
  try {
    const snapshot = await apiRequest(`/api/friends/${encodeURIComponent(friendId)}`, { method: 'DELETE' });
    applySocialSnapshot(snapshot);
  } catch (error) {
    networkMessage.textContent = error.message;
  }
}

let socialSession = null;
let socialSnapshot = { player: null, friends: [], leaderboard: [] };
let heartbeatTimer = null;
let liveReconnectTimer = null;
let liveStream = null;
let lastSyncedScore = 0;
let queuedScore = 0;
let scoreSyncing = false;
let scoreRetryTimer = null;

function syncScore(value) {
  if (!socialSession || value <= lastSyncedScore) return;
  queuedScore = Math.max(queuedScore, value);
  processScoreQueue();
}

async function processScoreQueue() {
  if (scoreSyncing || scoreRetryTimer || !socialSession || queuedScore <= lastSyncedScore) return;
  const value = queuedScore;
  queuedScore = 0;
  scoreSyncing = true;
  try {
    applySocialSnapshot(await apiRequest('/api/score', { method: 'POST', body: { score: value } }));
    lastSyncedScore = Math.max(lastSyncedScore, value);
  } catch (error) {
    queuedScore = Math.max(queuedScore, value);
    updateNetworkStatus('RECONNECTING', `Score sync pending: ${error.message}`);
    scoreRetryTimer = setTimeout(() => {
      scoreRetryTimer = null;
      processScoreQueue();
    }, 5_000);
  } finally {
    scoreSyncing = false;
    if (queuedScore > lastSyncedScore && !scoreRetryTimer) processScoreQueue();
  }
}

function initializeSocial() {
  const saved = readSavedSession();
  if (saved) {
    usernameInput.value = saved.username;
    connectProfile(saved.token);
  } else {
    updateNetworkStatus('OFFLINE', 'Connect to the game server to see friends and live ranks.');
  }
}

function updateAudioButtons() {
  const label = audioEnabled ? 'Sound on' : 'Sound off';
  audioButton.textContent = label;
  settingsAudioButton.textContent = label;
  audioButton.setAttribute('aria-pressed', String(audioEnabled));
  settingsAudioButton.setAttribute('aria-pressed', String(audioEnabled));
}

function selectSocialView(selectedView) {
  socialTabs.forEach((tab) => {
    const active = tab.dataset.view === selectedView;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  socialViews.forEach((view) => view.classList.toggle('hidden', view.dataset.panel !== selectedView));
}

let dialogReturnFocus = null;

function openDialog(dialog, trigger, initialFocus) {
  dialogReturnFocus = trigger;
  dialog.classList.remove('hidden');
  initialFocus.focus();
}

function closeDialog(dialog) {
  if (dialog.classList.contains('hidden')) return;
  dialog.classList.add('hidden');
  dialogReturnFocus?.focus();
  dialogReturnFocus = null;
}

function bindSocialAndSettings() {
  socialTabs.forEach((tab) => {
    tab.addEventListener('click', () => selectSocialView(tab.dataset.view));
  });

  const navTargets = {
    deploy: heroOptions[0].parentElement,
    arena: canvas,
    battlefeed: battleFeed,
    ranked: leaderboard
  };
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item === button));
      if (button.dataset.nav === 'battlefeed') selectSocialView('feed');
      if (button.dataset.nav === 'ranked') selectSocialView('leaderboard');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      navTargets[button.dataset.nav]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  connectButton.addEventListener('click', () => connectProfile());
  addFriendButton.addEventListener('click', addFriend);
  friendCodeInput.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') addFriend();
  });

  skinOptions.forEach((option) => {
    option.addEventListener('click', () => {
      selectedSkin = option.dataset.skin;
      skinOptions.forEach((item) => item.classList.toggle('active', item === option));
      skinName.textContent = selectedSkin[0].toUpperCase() + selectedSkin.slice(1);
    });
  });

  settingsButton.addEventListener('click', () => openDialog(settingsModal, settingsButton, closeSettingsButton));
  controlsButton.addEventListener('click', () => openDialog(controlsModal, controlsButton, closeControlsButton));
  [[settingsModal, closeSettingsButton], [controlsModal, closeControlsButton]].forEach(([dialog, closeButton]) => {
    closeButton.addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });
  window.addEventListener('keydown', (event) => {
    const dialog = [settingsModal, controlsModal].find((item) => !item.classList.contains('hidden'));
    if (!dialog) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog(dialog);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  sensitivitySetting.addEventListener('input', () => {
    mouseSensitivity = Number(sensitivitySetting.value);
    document.getElementById('sensitivityValue').textContent = (mouseSensitivity * 100).toFixed(2);
  });
  fovSetting.addEventListener('input', () => {
    fieldOfView = Number(fovSetting.value);
    document.getElementById('fovValue').textContent = `${fieldOfView}°`;
  });
  volumeSetting.addEventListener('input', () => {
    masterVolume = Number(volumeSetting.value);
    document.getElementById('volumeValue').textContent = `${Math.round(masterVolume * 100)}%`;
  });
  [audioButton, settingsAudioButton].forEach((button) => {
    button.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      updateAudioButtons();
      if (audioEnabled) playTone(440, 660, 0.12, 'triangle', 0.04);
    });
  });
  renderLeaderboard();
  updateAudioButtons();
}

function bindButtons() {
  startButton.addEventListener('click', resetGame);
  dashButton.addEventListener('click', performDash);
  abilityButton.addEventListener('click', performAbility);
  ultimateButton.addEventListener('click', performUltimate);
  restartButton.addEventListener('click', resetGame);
  playButton.addEventListener('click', resetGame);

}

function init() {
  updateAbilityCard();
  bindControls();
  bindHeroSelection();
  bindMapSelection();
  bindSocialAndSettings();
  bindButtons();
  initializeSocial();
  updateHud();
  updateAbilityButton();
  updateActionButtons();
  updateSelectionControls();
  render();
  requestAnimationFrame(loop);
}

init();
