const API_BASE_URL = 'https://c169a080-66fe-4290-9579-6403f25c388d-00-1tm2czosk7dde.picard.replit.dev';
const gameListEl = document.getElementById("gamesList");

// === Restore Background on Load ===
window.addEventListener("load", () => {
  const savedBg = localStorage.getItem("skz_bg");
  if (savedBg) {
    document.body.classList.add("bg-" + savedBg);
    document.getElementById("bgSelect").value = savedBg;
  }

  fetch(`${API_BASE_URL}/api/games`)
    .then(res => res.json())
    .then(games => games.forEach(renderGameCard))
    .catch(err => console.error("Error loading games:", err));
});

// === Background Theme Logic ===
document.getElementById("bgSelect").addEventListener("change", function () {
  document.body.className = "dark-theme";
  document.body.classList.add("bg-" + this.value);
  localStorage.setItem("skz_bg", this.value);
});

// === Render Game Card ===
function renderGameCard(gameData) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.innerHTML = `
    <div class="game-thumbnail-container">
      <img src="${gameData.thumbnail}" alt="Game Thumbnail" />
      <div class="three-dots" onclick="toggleMenu(this)">⋮</div>
      <button class="play-btn" onclick="previewGame(this)">▶</button>
    </div>
    <div class="game-content" style="display:none;">
      <style>${gameData.css}</style>
      ${gameData.html}
      <script>${gameData.js}<\/script>
    </div>
  `;
  gameListEl.appendChild(card);
}

// === Preview Game in Popup ===
function previewGame(button) {
  const gameHTML = button.closest(".game-card").querySelector(".game-content").innerHTML;
  const win = window.open("", "_blank", "width=800,height=600");
  win.document.write(gameHTML);
  win.document.close();
}

// === Toggle Menu (Optional Future Actions) ===
function toggleMenu(dotBtn) {
  const dropdown = dotBtn.parentElement.nextElementSibling;
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
