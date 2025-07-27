const gameListEl = document.getElementById("gamesList");
const password = "548918";
const API_BASE_URL = "https://c169a080-66fe-4290-9579-6403f25c388d-00-1tm2czosk7dde.picard.replit.dev";

// === Restore background on load ===
window.addEventListener("load", () => {
  const savedBg = localStorage.getItem("skz_bg");
  if (savedBg) {
    document.body.classList.add("bg-" + savedBg);
    document.getElementById("bgSelect").value = savedBg;
  }

  // Fetch games from backend
  fetch(`${API_BASE_URL}/api/games`)
    .then(res => res.json())
    .then(games => {
      games.forEach(game => renderGameCard(game));
    })
    .catch(err => console.error("❌ Error fetching games:", err));
});

// === Background selection logic ===
document.getElementById("bgSelect").addEventListener("change", function () {
  document.body.classList.forEach(cls => {
    if (cls.startsWith("bg-")) document.body.classList.remove(cls);
  });

  const selected = this.value;
  document.body.classList.add("bg-" + selected);
  localStorage.setItem("skz_bg", selected);
});

// === Upload Button ===
document.getElementById("uploadBtn")?.addEventListener("click", () => {
  const userInput = prompt("Enter admin password:");
  if (userInput !== password) {
    alert("❌ Incorrect password. Upload denied.");
    return;
  }

  const htmlFile = document.getElementById("htmlFile").files[0];
  const cssFile = document.getElementById("cssFile").files[0];
  const jsFile = document.getElementById("jsFile").files[0];
  const thumbnail = document.getElementById("thumbnailFile").files[0];

  if (!htmlFile || !cssFile || !jsFile || !thumbnail) {
    alert("⚠️ Please upload all required files.");
    return;
  }

  const formData = new FormData();
  formData.append("html", htmlFile);
  formData.append("css", cssFile);
  formData.append("js", jsFile);
  formData.append("thumbnail", thumbnail);

  fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((game) => {
      alert("✅ Game uploaded successfully!");
      renderGameCard(game);
    })
    .catch((err) => {
      console.error("❌ Upload failed:", err);
      alert("❌ Upload error");
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
      <button onclick="removeGame(this)">🗑️ Remove</button>
    </div>
    <div class="game-content" style="display:none;">${gameFrame}</div>
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

// === Toggle Menu ===
function toggleMenu(dotBtn) {
  const dropdown = dotBtn.parentElement.nextElementSibling;
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// === Remove Game from Backend ===
function removeGame(button) {
  const card = button.closest(".game-card");
  const gameId = card.dataset.id;

  const userInput = prompt("Enter admin password to remove this game:");
  if (userInput !== password) {
    alert("❌ Incorrect password. Game not removed.");
    return;
  }

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
