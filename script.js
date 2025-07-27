const API_BASE_URL = 'https://c169a080-66fe-4290-9579-6403f25c388d-00-1tm2czosk7dde.picard.replit.dev';
const gameListEl = document.getElementById("gamesList");

window.addEventListener("load", () => {
  const savedBg = localStorage.getItem("skz_bg");
  if (savedBg) {
    document.body.classList.add("bg-" + savedBg);
    document.getElementById("bgSelect").value = savedBg;
  }

  fetch(`${API_BASE_URL}/api/games`)
    .then(res => res.json())
    .then(games => games.forEach(renderGameCard))
    .catch(err => console.error("❌ Error fetching games:", err));
});

document.getElementById("bgSelect").addEventListener("change", function () {
  document.body.className = "dark-theme";
  document.body.classList.add("bg-" + this.value);
  localStorage.setItem("skz_bg", this.value);
});

function renderGameCard(gameData) {
  const fullHTML = `
    <html><head><style>${gameData.css}</style></head>
    <body>${gameData.html}<script>${gameData.js}<\/script></body>
    </html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const gameUrl = URL.createObjectURL(blob);

  const card = document.createElement("div");
  card.className = "game-card";

  card.innerHTML = `
    <div class="game-thumbnail-container">
      <img src="${gameData.thumbnail}" alt="Game Thumbnail" />
      <div class="three-dots" onclick="toggleMenu(this)">⋮</div>
      <button class="play-btn" onclick="window.open('${gameUrl}', '_blank', 'width=800,height=600')">▶</button>
    </div>
    <div class="menu-dropdown" style="display:none;">
      <button onclick="removeGame(this)">🗑️ Remove</button>
    </div>
  `;

  gameListEl.appendChild(card);
}

function toggleMenu(dotBtn) {
  const dropdown = dotBtn.parentElement.nextElementSibling;
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function removeGame(button) {
  const card = button.closest(".game-card");
  const gameId = card.dataset.id;

  const userInput = prompt("Enter admin password to remove this game:");
  if (userInput !== "548918") {
    alert("❌ Incorrect password. Game not removed.");
    return;
  }

  fetch(`${API_BASE_URL}/api/games/${gameId}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => {
      card.remove();
      alert("✅ Game deleted from server.");
    })
    .catch(err => {
      console.error("❌ Deletion failed:", err);
      alert("❌ Could not delete game.");
    });
}
