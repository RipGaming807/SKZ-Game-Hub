const gameListEl = document.getElementById("gamesList");

// === Theme and Background Restore ===
window.addEventListener("load", async () => {
  const savedBg = localStorage.getItem("skz_bg");
  if (savedBg) {
    document.body.classList.add("bg-" + savedBg);
    document.getElementById("bgSelect").value = savedBg;
  }

  const savedTheme = localStorage.getItem("skz_theme") || "dark";
  document.body.classList.add(savedTheme + "-theme");
  document.getElementById("themeToggle").value = savedTheme;

  const res = await fetch("https://your-replit-url.repl.co/games");
  const games = await res.json();
  games.forEach(game => renderGameCard(game));
});

// === Background Selection ===
document.getElementById("bgSelect").addEventListener("change", function () {
  document.body.classList.forEach(cls => {
    if (cls.startsWith("bg-")) document.body.classList.remove(cls);
  });

  const selected = this.value;
  document.body.classList.add("bg-" + selected);
  localStorage.setItem("skz_bg", selected);
});

// === Theme Switcher ===
document.getElementById("themeToggle").addEventListener("change", function () {
  document.body.classList.remove("dark-theme", "light-theme");
  document.body.classList.add(this.value + "-theme");
  localStorage.setItem("skz_theme", this.value);
});

// === Render Game Cards ===
function renderGameCard(gameData) {
  const card = document.createElement("div");
  card.className = "game-card";

  card.innerHTML = `
    <div class="game-thumbnail-container">
      <img src="https://your-replit-url.repl.co${gameData.thumbnail}" />
      <button class="play-btn" onclick="previewGame(${gameData.id})">▶</button>
    </div>
  `;

  gameListEl.appendChild(card);
}

function previewGame(id) {
  window.open(`https://your-replit-url.repl.co/play/${id}`, "_blank", "width=800,height=600");
}
