const DEFAULT_INSTANCE_URL = ""; 

function extractVideoId(url) {
  if (!url) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.has("v")) return u.searchParams.get("v");

      const parts = u.pathname.split("/");
      return parts[parts.length - 1];
    }
  } catch (e) {}

  const match = url.match(/[a-zA-Z0-9_-]{11}/);
  return match ? match[0] : null;
}


const statusEl = document.getElementById("status");
const infoEl = document.getElementById("programInfo");
const playerContainer = document.getElementById("playerContainer");
const placeholder = document.getElementById("playerPlaceholder");
const inputUrl = document.getElementById("instanceUrl");
const loadBtn = document.getElementById("loadBtn");
const miniGuide = document.getElementById("miniGuide");
const channelSelect = document.getElementById("channelSelect");

const themeToggle = document.getElementById("themeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const playerOverlay = document.getElementById("playerOverlay");
const nowBar = document.getElementById("nowBar");
const nowBarTitle = document.getElementById("nowBarTitle");
const nowBarMeta = document.getElementById("nowBarMeta");
const nowBarProgress = document.getElementById("nowBarProgress");
const upNextOverlay = document.getElementById("upNextOverlay");
const upNextCountdown = document.getElementById("upNextCountdown");
const upNextTitle = document.getElementById("upNextTitle");
const startingSoonBadge = document.getElementById("startingSoonBadge");
const toastContainer = document.getElementById("toastContainer");


inputUrl.value = DEFAULT_INSTANCE_URL;

let instanceData = null;
let timeline = [];
let fullTimeline = [];
let currentProgram = null;
let iframeEl = null;
let tickTimer = null;
let selectedChannel = "all"; 


window.addEventListener("DOMContentLoaded", () => {
  loadInstance("auto");
});


loadBtn.addEventListener("click", () => {
  const url = inputUrl.value.trim();
  if (!url) return alert("Please enter the JSON URL.");
  loadInstance(url);
});

themeToggle.addEventListener("click", () => {
  const isLight = document.body.getAttribute("data-theme") === "light";
  document.body.setAttribute("data-theme", isLight ? "dark" : "light");
  themeToggle.textContent = isLight ? "🌙" : "☀️";
});

refreshBtn.addEventListener("click", () => {
  showToast("Refreshing schedule…");
  loadInstance("auto");
});
document.body.setAttribute("data-theme", "dark");

async function loadInstance(url) {
  clearInterval(tickTimer);
  statusEl.textContent = "Loading...";

  try {
    
    if (url !== "auto") {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
    }

   
    const now = new Date();
    const currentSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const currentMinutes = Math.floor(currentSeconds / 10); 

    const video1Start = currentMinutes - 1;
    const video1End = currentMinutes + 1; 

    const video2Start = currentMinutes + 1;
    const video2End = currentMinutes + 2; 

    const video3Start = currentMinutes + 2;
    const video3End = currentMinutes + 3; 

    const video4Start = currentMinutes + 3;
    const video4End = currentMinutes + 4; 

    const video5Start = currentMinutes + 4;
    const video5End = currentMinutes + 100; 

    const res2 = await fetch("instanceData.json");
    instanceData = await res2.json();

    statusEl.textContent = "Schedule loaded";

    prepareTimeline();
    startTicker();
  } catch (err) {
    statusEl.textContent = "Error loading JSON";
    infoEl.textContent = err.message;
  }
}



function prepareTimeline() {
  fullTimeline = [];

  const channels = instanceData.channels || [];


  channelSelect.innerHTML = '<option value="all">All Channels</option>';
  channels.forEach((ch) => {
    const option = document.createElement('option');
    option.value = ch.channel_name;
    option.textContent = ch.channel_name;
    channelSelect.appendChild(option);
    
    (ch.programs || []).forEach((p) => {
      const startMinutes = p.start;
      const endMinutes = p.end;
      const videoId = extractVideoId(p.link);

      const startDate = minutesToDate(startMinutes);
      const endDate = minutesToDate(endMinutes);

      fullTimeline.push({
        channel_id: ch.channel_id,
        channel_name: ch.channel_name,
        startDate,
        endDate,
        durationMin: endMinutes - startMinutes,
        videoId,
        raw_start: startMinutes,
        raw_end: endMinutes,
        genre: p.genre,
        score: p.score,
        program_id: p.program_id,
      });

    });
  });


  fullTimeline.sort((a, b) => a.startDate - b.startDate);

  filterTimelineByChannel();

  infoEl.innerHTML = `Loaded ${timeline.length} programs for ${selectedChannel === 'all' ? 'all channels' : selectedChannel}.`;
  renderMiniGuide();
}

function filterTimelineByChannel() {
  if (selectedChannel === "all") {
    timeline = [...fullTimeline];
  } else {
    timeline = fullTimeline.filter(p => p.channel_name === selectedChannel);
  }

  currentProgram = null;
}

channelSelect.addEventListener('change', (e) => {
  selectedChannel = e.target.value;
  filterTimelineByChannel();
  infoEl.innerHTML = `Switched to ${selectedChannel === 'all' ? 'all channels' : selectedChannel}. Loaded ${timeline.length} programs.`;
  tick(); 
});

function minutesToDate(min) {
  const d = new Date();
  const hours = Math.floor(min / 60);
  const minutes = min % 60;

  d.setHours(hours, minutes, 0, 0);
  return d;
}



function startTicker() {
  tickTimer = setInterval(() => tick(), 1000);
  tick();
}

function tick() {
  const now = new Date();

  const active = timeline.find((p) => now >= p.startDate && now < p.endDate);
  const next = timeline.find((p) => p.startDate > now);

  if (active) {
    if (currentProgram !== active) {
      currentProgram = active;
      playProgram(active);
      showToast(`Program started: ${active.channel_name}`);
    }

    updateProgramUI(active, now, next);
  } else {

    if (iframeEl) {
      iframeEl.remove();
      iframeEl = null;
    }
    placeholder.style.display = "block";
    if (playerOverlay) playerOverlay.classList.remove("hidden");

    currentProgram = null;

    renderIdleInfo(next);
    updateNowBar(null);
    updateUpNextUI(null, next, now);
  }

  renderMiniGuide();
}


function playProgram(p) {
  if (!p.videoId) {
    placeholder.innerText = "No video found.";
    placeholder.style.display = "block";
    if (playerOverlay) playerOverlay.classList.remove("hidden");
    return;
  }

  const embed = `https://www.youtube.com/embed/${p.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;

  if (iframeEl) iframeEl.remove();

  iframeEl = document.createElement("iframe");
  iframeEl.src = embed;
  iframeEl.width = "100%";
  iframeEl.height = "100%";
  iframeEl.frameBorder = "0";
  iframeEl.allow = "autoplay; fullscreen; picture-in-picture";
  iframeEl.allowFullscreen = true;

  playerContainer.appendChild(iframeEl);
  placeholder.style.display = "none";
  if (playerOverlay) playerOverlay.classList.add("hidden");

  renderProgramInfo(p, new Date());
  updateNowBar(p);
}

function genreToIcon(genre) {
  if (!genre) return "📺";
  const g = genre.toLowerCase();
  if (g.includes("news")) return "📰";
  if (g.includes("kids")) return "👶";
  if (g.includes("game")) return "🎮";
  if (g.includes("drama")) return "🎭";
  if (g.includes("talk")) return "🎙️";
  return "📺";
}

function renderProgramInfo(p, now) {
  if (!p) {
    infoEl.innerHTML = "";
    return;
  }

  const elapsedMs = Math.max(0, now - p.startDate);
  const totalMs = Math.max(1, p.endDate - p.startDate);
  const percent = Math.min(100, (elapsedMs / totalMs) * 100);

  const startStr = p.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const endStr = p.endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  infoEl.innerHTML = `
    <div class="program-header">
      <div class="program-channel">
        <div class="channel-avatar">${genreToIcon(p.genre)}</div>
        <div>
          <div class="program-channel-name">${p.channel_name}</div>
          <div class="program-id">${p.program_id || ""}</div>
        </div>
      </div>
      <div class="live-dot"></div>
    </div>
    <div class="badges-row">
      <span class="badge badge-genre">
        ${genreToIcon(p.genre)} ${p.genre || "Program"}
      </span>
      <span class="badge badge-score">
        ⭐ Score: ${p.score != null ? p.score : "?"}
      </span>
      <span class="badge">
        ⏱ ${p.durationMin} min
      </span>
    </div>
    <div class="program-times">
      <span>${startStr} – ${endStr}</span>
      <span>${percent.toFixed(0)}% watched</span>
    </div>
    <div class="program-progress">
      <div class="program-progress-bar" id="programProgressBar"></div>
    </div>
  `;

  const bar = document.getElementById("programProgressBar");
  if (bar) {
    bar.style.width = `${percent}%`;
  }
}


function renderIdleInfo(next) {
  if (!next) {
    infoEl.innerHTML = `
      <div class="program-header">
        <div class="program-channel">
          <div class="channel-avatar">📺</div>
          <div>
            <div class="program-channel-name">No more programs</div>
            <div class="program-id">Today</div>
          </div>
        </div>
      </div>
      <div class="badges-row">
        <span class="badge">⏹ Idle</span>
      </div>
      <div class="program-times">
        <span>Schedule finished for this channel.</span>
      </div>
    `;
    return;
  }

  const startStr = next.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  infoEl.innerHTML = `
    <div class="program-header">
      <div class="program-channel">
        <div class="channel-avatar">${genreToIcon(next.genre)}</div>
        <div>
          <div class="program-channel-name">No program playing</div>
          <div class="program-id">Up next</div>
        </div>
      </div>
    </div>
    <div class="badges-row">
      <span class="badge badge-genre">
        ${genreToIcon(next.genre)} ${next.genre || "Program"}
      </span>
    </div>
    <div class="program-times">
      <span>Next: ${next.channel_name}</span>
      <span>Starts at ${startStr}</span>
    </div>
  `;
}


function updateProgramUI(active, now, next) {
  renderProgramInfo(active, now);

  const totalMs = Math.max(1, active.endDate - active.startDate);
  const elapsedMs = Math.max(0, now - active.startDate);
  const percent = Math.min(100, (elapsedMs / totalMs) * 100);

  const bar = document.getElementById("programProgressBar");
  if (bar) {
    bar.style.width = `${percent}%`;
  }

  const floatTitle = document.getElementById("floatingTitle");
  if (floatTitle) {
    floatTitle.textContent = `🔴 LIVE — ${active.channel_name}`;
  }

  updateNowBar(active);

  updateUpNextUI(active, next, now);
}


function updateNowBar(active) {
  if (!nowBar || !nowBarTitle || !nowBarMeta || !nowBarProgress) return;

  if (!active) {
    nowBarTitle.textContent = "Nothing playing";
    nowBarMeta.textContent = "";
    nowBarProgress.style.width = "0%";
    return;
  }

  const startStr = active.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const endStr = active.endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  nowBarTitle.textContent = `Playing now: ${active.channel_name}`;
  nowBarMeta.textContent = `${startStr} – ${endStr} • ${active.genre || "Program"}`;

  const totalMs = Math.max(1, active.endDate - active.startDate);
  const elapsedMs = Math.max(0, Date.now() - active.startDate.getTime());
  const percent = Math.min(100, (elapsedMs / totalMs) * 100);

  nowBarProgress.style.width = `${percent}%`;
}

function updateUpNextUI(active, next, now) {
  if (!upNextOverlay || !upNextCountdown || !upNextTitle || !startingSoonBadge) return;

  if (!next) {
    upNextOverlay.classList.add("hidden");
    startingSoonBadge.classList.add("hidden");
    return;
  }

  const diffMs = next.startDate - now;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec <= 0) {
    upNextOverlay.classList.add("hidden");
    startingSoonBadge.classList.add("hidden");
    return;
  }

  if (diffSec <= 60) {
    upNextOverlay.classList.remove("hidden");
    upNextCountdown.textContent = diffSec;
    upNextTitle.textContent = `${next.channel_name} • ${next.genre || "Program"}`;
  } else {
    upNextOverlay.classList.add("hidden");
  }


  if (diffSec <= 10) {
    startingSoonBadge.classList.remove("hidden");
  } else {
    startingSoonBadge.classList.add("hidden");
  }
}

function renderMiniGuide() {
  if (!miniGuide || !timeline.length) {
    miniGuide.innerHTML = "No schedule loaded.";
    return;
  }

  const now = new Date();
  const active = timeline.find((p) => now >= p.startDate && now < p.endDate);
  const next = timeline.find((p) => p.startDate > now);
  const later = timeline
    .filter((p) => p.startDate > now && (!next || p.startDate > next.startDate))
    .slice(0, 3);

  const items = [];

  if (active) items.push({ label: "Now", type: "now", p: active });
  if (next) items.push({ label: "Next", type: "next", p: next });
  later.forEach((p) => items.push({ label: "Later", type: "later", p }));

  miniGuide.innerHTML = items
    .map(({ label, type, p }) => {
      const startStr = p.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const thumb = p.videoId
        ? `https://img.youtube.com/vi/${p.videoId}/mqdefault.jpg`
        : "";
      return `
        <div class="guide-item ${type === "now" ? "now" : ""}">
          <img class="guide-thumb" src="${thumb}" alt="" loading="lazy" />
          <div class="guide-meta">
            <div class="guide-meta-top">
              <span class="guide-channel">${label}: ${p.channel_name}</span>
              <span class="guide-time">${startStr}</span>
            </div>
            <div class="guide-genre">
              ${genreToIcon(p.genre)} ${p.genre || ""}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function showToast(message) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon">📺</span>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 2500);

}
