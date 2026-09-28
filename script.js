const sky = document.getElementById("sky");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const hint = document.getElementById("hint");
const celebrate = document.getElementById("celebrate");

const hints = [
  "O não fugiu… 🎀",
  "Ele não quer ser escolhido.",
  "Tenta o sim, ele fica quietinho.",
  "O laço já decidiu por você.",
];
let escapes = 0;

function sprinkle(extra = 0) {
  const bits = ["♡", "🎀", "✿", "♥"];
  const count = 14 + extra;
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("span");
    el.className = "float";
    el.textContent = bits[i % bits.length];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${14 + Math.random() * 22}px`;
    el.style.animationDuration = `${7 + Math.random() * 8}s`;
    el.style.animationDelay = `${-Math.random() * 12}s`;
    el.style.color = i % 3 === 0 ? "#ff4f93" : "#ff8fba";
    sky.appendChild(el);
  }
}

function overlaps(x, y, width, height, rect, pad = 16) {
  return (
    x < rect.right + pad &&
    x + width > rect.left - pad &&
    y < rect.bottom + pad &&
    y + height > rect.top - pad
  );
}

function flee(clientX, clientY) {
  const rect = no.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const margin = 10;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  const yesRect = yes.getBoundingClientRect();
  let x = margin;
  let y = margin;

  for (let i = 0; i < 24; i += 1) {
    const nx = margin + Math.random() * (maxX - margin);
    const ny = margin + Math.random() * (maxY - margin);
    const moved = Math.hypot(nx - rect.left, ny - rect.top) > 110;
    const clearOfFinger =
      clientX == null ||
      Math.hypot(clientX - (nx + width / 2), clientY - (ny + height / 2)) > 130;
    const clearOfYes = !overlaps(nx, ny, width, height, yesRect);
    x = nx;
    y = ny;
    if (moved && clearOfFinger && clearOfYes) break;
  }

  no.classList.add("away");
  no.style.left = `${x}px`;
  no.style.top = `${y}px`;
  no.style.width = `${width}px`;

  hint.textContent = hints[Math.min(escapes, hints.length - 1)];
  escapes += 1;
}

yes.addEventListener("click", () => {
  celebrate.hidden = false;
  sprinkle(18);
});

no.addEventListener("mouseenter", (event) => {
  flee(event.clientX, event.clientY);
});

no.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    flee(touch.clientX, touch.clientY);
  },
  { passive: false }
);

no.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") return;
  event.preventDefault();
  flee(event.clientX, event.clientY);
});

no.addEventListener("click", (event) => {
  event.preventDefault();
  flee(event.clientX, event.clientY);
});

no.addEventListener("keydown", (event) => {
  event.preventDefault();
  flee();
});

window.addEventListener("resize", () => {
  if (!no.classList.contains("away")) return;
  const maxX = window.innerWidth - no.offsetWidth - 10;
  const maxY = window.innerHeight - no.offsetHeight - 10;
  const left = Math.min(parseFloat(no.style.left) || 10, maxX);
  const top = Math.min(parseFloat(no.style.top) || 10, maxY);
  no.style.left = `${Math.max(10, left)}px`;
  no.style.top = `${Math.max(10, top)}px`;
});

sprinkle();
