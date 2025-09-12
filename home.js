window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loaderWrap");
    loader.classList.add("hidden");
    loader.setAttribute("aria-hidden", "true");
    const mc = document.getElementById("mainContent");
    mc.style.opacity = "1";
    mc.style.transform = "translateY(0)";
    initCarousel();
  }, 1000); // a bit longer so ink spill animation is visible
});


fetch("https://api.quotable.io/random")
  .then(r => r.json())
  .then(d => {
    document.getElementById("qTxt").textContent = d.content;
    document.getElementById("qWho").textContent = "— " + d.author;
  })
  .catch(() => {
    document.getElementById("qTxt").textContent = "Write your own story.";
    document.getElementById("qWho").textContent = "— Novelite";
  });

(function notificationsInit(){
  const badge = document.getElementById("notiBadge");
  const list = document.getElementById("notiList");
  const noti = JSON.parse(localStorage.getItem("novelite_notifications") || "[]");
  badge.textContent = noti.length || 0;
  list.innerHTML = noti.length ? noti.map(n => `<div style="padding:10px;border-bottom:1px solid rgba(0,0,0,.04)">${n}</div>`).join("") : '<div class="empty">No notifications</div>';
  document.getElementById("openNoti").addEventListener("click", () => openModal("notiModal"));
})();

(function coachInit(){
  const c = document.getElementById("coach");
  if (c && localStorage.getItem("novelite_coach_dismissed")) c.remove();
  document.getElementById("kidsBtn").addEventListener("click", () => alert("Kids section coming soon"));
})();

function openModal(id){ const el = document.getElementById(id); el.classList.add("show"); el.setAttribute("aria-hidden","false"); }
function closeModal(id){ const el = document.getElementById(id); el.classList.remove("show"); el.setAttribute("aria-hidden","true"); }
document.querySelectorAll(".close-x").forEach(btn => btn.addEventListener("click", e => closeModal(e.target.dataset.close)));
["notiModal","loginModal","signupModal","profileModal"].forEach(id => {
  const m = document.getElementById(id);
  if (m) m.addEventListener("click", e => { if (e.target === m) closeModal(id); });
});

const mostReadGrid = document.getElementById("mostRead");
const emptyState = document.getElementById("emptyState");
const books = [];
if (books.length === 0) {
  emptyState.style.display = "flex";
} else {
  books.forEach(b => {
    const a = document.createElement("article");
    a.className = "card";
    a.innerHTML = `<img class="cover" src="${b.img}" alt="${b.title}"><div class="meta"><div class="title">${b.title}</div><div class="by">by ${b.by}</div></div>`;
    mostReadGrid.appendChild(a);
  });
}

const openProfileBtn = document.getElementById("openProfile");
const loginBtn = document.getElementById("openLogin");
const signupBtn = document.getElementById("openSignup");
const doLogin = document.getElementById("doLogin");
const doSignup = document.getElementById("doSignup");
const signOutBtn = document.getElementById("signOutBtn");

function isLogged(){ return !!localStorage.getItem("novelite_user"); }
function getUser(){ return JSON.parse(localStorage.getItem("novelite_user") || "null"); }
function setUser(u){ localStorage.setItem("novelite_user", JSON.stringify(u)); }

function populateProfile(){
  const u = getUser() || { name: "Guest", email: "—", xp: 0, gems: 0 };
  document.getElementById("pName").textContent = u.name || "Reader";
  document.getElementById("pEmail").textContent = u.email || "—";
  document.getElementById("pXP").textContent = u.xp ?? 0;
  document.getElementById("pGems").textContent = u.gems ?? 0;
}

function updateEntryPoints(){
  if (isLogged()){
    loginBtn.textContent = "Logged In";
    loginBtn.disabled = true;
    document.getElementById("navProfileBtn").addEventListener("click", e => { e.preventDefault(); populateProfile(); openModal("profileModal"); });
    openProfileBtn.onclick = () => { populateProfile(); openModal("profileModal"); };
  } else {
    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
    document.getElementById("navProfileBtn").addEventListener("click", e => { e.preventDefault(); openModal("loginModal"); });
    openProfileBtn.onclick = () => openModal("loginModal");
  }
}
updateEntryPoints();

loginBtn.addEventListener("click", () => openModal("loginModal"));
signupBtn.addEventListener("click", () => openModal("signupModal"));

doLogin?.addEventListener("click", () => {
  const e = document.getElementById("lgEmail").value.trim();
  const p = document.getElementById("lgPass").value;
  if (!e || !p) return alert("Fill in email and password");
  setUser({ name: e.split("@")[0], email: e, xp: 120, gems: 8 });
  closeModal("loginModal");
  updateEntryPoints();
  alert("Welcome back, " + e.split("@")[0] + "!");
});

doSignup?.addEventListener("click", () => {
  const n = document.getElementById("suName").value.trim();
  const e = document.getElementById("suEmail").value.trim();
  const p = document.getElementById("suPass").value;
  if (!n || !e || !p) return alert("Please fill registration fields");
  setUser({ name: n, email: e, xp: 0, gems: 0 });
  closeModal("signupModal");
  updateEntryPoints();
  alert("Welcome to Novelite, " + n + "!");
});

signOutBtn?.addEventListener("click", () => {
  localStorage.removeItem("novelite_user");
  closeModal("profileModal");
  updateEntryPoints();
  alert("Signed out");
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", function(e){
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const pulse = document.createElement("span");
    pulse.style.cssText = `position:absolute;left:${x-6}px;top:${y-6}px;width:12px;height:12px;border-radius:999px;background:rgba(255,215,0,0.9);transform:scale(0);opacity:.9;pointer-events:none;z-index:2;transition:transform .55s cubic-bezier(.2,.9,.28,1),opacity .6s ease;`;
    this.appendChild(pulse);
    requestAnimationFrame(()=>{ pulse.style.transform = "scale(18)"; pulse.style.opacity = "0"; });
    setTimeout(()=> pulse.remove(), 700);
  });
});

function initCarousel(){
  const items = [
    { title: "The Silent Dawn", author: "Amara K.", blurb: "A haunting tale of resilience in a world rebuilding after collapse.", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop" },
    { title: "Whispers of the Lagoon", author: "David O.", blurb: "An enchanting journey into folklore, love, and sacrifice.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop" },
    { title: "Fragments of Tomorrow", author: "Lena R.", blurb: "Sci-fi exploration of humanity’s choices in a fractured future.", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop" }
  ];

  const track = document.getElementById("carouselTrack");
  track.innerHTML = "";

  const buildItem = it => {
    return `<div class="carousel-item">
      <img class="carousel-cover" src="${it.img}" alt="${it.title}">
      <div class="carousel-meta">
        <div class="carousel-title">${it.title}</div>
        <div style="font-size:13px;color:#666;margin-bottom:8px">by ${it.author}</div>
        <div class="carousel-blurb">${it.blurb}</div>
      </div>
    </div>`;
  };

  track.insertAdjacentHTML("beforeend", buildItem(items[items.length - 1]));
  items.forEach(it => track.insertAdjacentHTML("beforeend", buildItem(it)));
  track.insertAdjacentHTML("beforeend", buildItem(items[0]));

  const slides = Array.from(track.children);
  let index = 1;

  const getSlideWidth = () => slides[0].getBoundingClientRect().width + 14;

  let slideWidth = getSlideWidth();
  const setPosition = () => { track.style.transform = `translateX(${-index * slideWidth}px)`; };
  setPosition();

  window.addEventListener("resize", () => {
    slideWidth = getSlideWidth();
    track.style.transition = "none";
    setPosition();
    setTimeout(() => { track.style.transition = "transform .5s cubic-bezier(.2,.9,.3,1)"; }, 20);
  });

  const prev = document.getElementById("carouselPrev");
  const next = document.getElementById("carouselNext");

  function moveSlide(n){
    index += n;
    track.style.transition = "transform .5s cubic-bezier(.2,.9,.3,1)";
    setPosition();
  }

  prev.addEventListener("click", () => moveSlide(-1));
  next.addEventListener("click", () => moveSlide(1));

  track.addEventListener("transitionend", () => {
    if (index === 0) {
      track.style.transition = "none";
      index = items.length;
      setPosition();
      setTimeout(() => track.style.transition = "transform .5s cubic-bezier(.2,.9,.3,1)", 20);
    }
    if (index === items.length + 1) {
      track.style.transition = "none";
      index = 1;
      setPosition();
      setTimeout(() => track.style.transition = "transform .5s cubic-bezier(.2,.9,.3,1)", 20);
    }
  });

  let autoplay = setInterval(() => moveSlide(1), 5000);
  const wrap = document.getElementById("editorsCarouselWrap");
  wrap.addEventListener("mouseenter", () => clearInterval(autoplay));
  wrap.addEventListener("mouseleave", () => autoplay = setInterval(() => moveSlide(1), 5000));
}
