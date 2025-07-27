const gameListEl = document.getElementById("gamesList");
const API_BASE_URL = "https://c169a080-66fe-4290-9579-6403f25c388d-00-1tm2czosk7dde.picard.replit.dev";

// === Load background and games on window load ===
window.addEventListener("load", () => {
  const savedBg = localStorage.getItem("skz_bg");
  if (savedBg) {
    document.body.classList.add("bg-" + savedBg);
    document.getElementById("bgSelect").value = savedBg;
  }

  fetch(`${API_BASE_URL}/api/games`)
    .then((res) => res.json())
    .then((games) => {
      games.forEach((game) => renderGameCard(game));
    })
    .catch((err) => console.error("❌ Error fetching games:", err));
});

// === Background selection ===
document.getElementById("bgSelect").addEventListener("change", function () {
  document.body.classList.forEach((cls) => {
    if (cls.startsWith("bg-")) document.body.classList.remove(cls);
  });

  const selected = this.value;
  document.body.classList.add("bg-" + selected);
  localStorage.setItem("skz_bg", selected);
});

// === Login system ===
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value;
  if (!email) return alert("⚠️ Email required");

  fetch(`${API_BASE_URL}/api/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      const code = prompt("🔒 Enter verification code sent to your email:");
      fetch(`${API_BASE_URL}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert("✅ Logged in successfully");
            localStorage.setItem("user_email", email);
            location.reload();
          } else {
            alert("❌ Verification failed");
          }
        });
    });
});

// === Render Game Card ===
function renderGameCard(gameData) {
  const gameFrame = `
    <style>${gameData.css}</style>
    ${gameData.html}
    <script>${gameData.js}<\/script>
  `;

  const card = document.createElement("div");
  card.className = "game-card";
  card.dataset.id = gameData._id || "";

  card.innerHTML = `
    <div class="game-thumbnail-container">
      <img src="${gameData.thumbnail}" alt="Game Thumbnail" />
      <div class="three-dots" onclick="toggleMenu(this)">⋮</div>
      <button class="play-btn" onclick="previewGame(this)">▶</button>
    </div>
    <div class="menu-dropdown" style="display:none;">
      ${isAdmin() ? `<button onclick="removeGame(this)">🗑️ Remove</button>` : ""}
    </div>
    <div class="game-content" style="display:none;">${gameFrame}</div>
  `;

  gameListEl.appendChild(card);
}

function isAdmin() {
  return localStorage.getItem("user_email") === "admin@skz.com";
}

function previewGame(button) {
  const gameHTML = button.closest(".game-card").querySelector(".game-content").innerHTML;
  const win = window.open("", "_blank", "width=800,height=600");
  win.document.write(gameHTML);
  win.document.close();
}

function toggleMenu(dotBtn) {
  const dropdown = dotBtn.parentElement.nextElementSibling;
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function removeGame(button) {
  const card = button.closest(".game-card");
  const gameId = card.dataset.id;

  if (!isAdmin()) return alert("❌ Only admin can delete games");

  fetch(`${API_BASE_URL}/api/games/${gameId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      card.remove();
      alert("✅ Game deleted from server.");
    })
    .catch((err) => {
      console.error("❌ Deletion failed:", err);
      alert("❌ Could not delete game.");
    });
}
