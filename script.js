const gameListEl = document.getElementById("gamesList");
const uploadForm = document.getElementById("uploadForm");
const password = "548918";

// === Backend URL ===
const API_BASE = "https://c169a080-66fe-4290-9579-6403f25c388d-00-1tm2czosk7dde.picard.replit.dev";

// === Fetch and display games from backend ===
async function displayGames() {
  gameListEl.innerHTML = "Loading games...";

  try {
    const res = await fetch(`${API_BASE}/api/games`);
    const games = await res.json();

    gameListEl.innerHTML = "";

    if (games.length === 0) {
      gameListEl.innerHTML = "<p>No games found.</p>";
      return;
    }

    games.forEach((game) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${game.thumbnail}" alt="${game.title}" class="thumbnail" />
        <h3>${game.title}</h3>
        <button onclick="playGame('${game._id}')">🎮 Play</button>
      `;
      gameListEl.appendChild(card);
    });
  } catch (error) {
    gameListEl.innerHTML = "<p>Error loading games.</p>";
    console.error("Error fetching games:", error);
  }
}

// === Play game by ID ===
function playGame(gameId) {
  const playUrl = `${API_BASE}/api/games/${gameId}/play`;
  window.open(playUrl, "_blank");
}

// === Upload a new game ===
if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);
    const enteredPassword = formData.get("password");

    if (enteredPassword !== password) {
      alert("❌ Incorrect password.");
      return;
    }

    const title = formData.get("title");
    const html = formData.get("html");
    const thumbnail = formData.get("thumbnail");

    if (!title || !html || !thumbnail) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    const newGame = {
      title,
      html,
      thumbnail
    };

    try {
      const res = await fetch(`${API_BASE}/api/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame)
      });

      if (!res.ok) throw new Error("Failed to upload");

      alert("✅ Game uploaded successfully!");
      uploadForm.reset();
      displayGames(); // refresh list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Error uploading game.");
    }
  });
}

// === Auto-run when page loads ===
window.addEventListener("load", displayGames);
