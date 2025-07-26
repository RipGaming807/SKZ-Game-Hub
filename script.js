const gameListEl = document.getElementById("gamesList");
const BACKEND_URL = "https://skz-backend-zunair.repl.co";
const password = "548918"; // Only admin upload access

// === Restore background and saved games on load ===
window.addEventListener("load", () => {
  const savedBg = localStorage.getItem("skz_bg");
  if (savedBg) {
    document.body.classList.add("bg-" + savedBg);
    document.getElementById("bgSelect").value = savedBg;
  }

  fetch(`${BACKEND_URL}/games`)
    .then(res => res.json())
    .then(games => {
      games.forEach(game => renderGameCard(game));
    })
    .catch(err => console.error("Games load nahi hue:", err));
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

// === Upload Button with Password Gate ===
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

  fetch(`${BACKEND_URL}/upload`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert("✅ Game uploaded successfully!");
      renderGameCard(data); // render new uploaded game
    })
    .catch(err => {
      console.error("❌ Upload error:", err);
      alert("❌ Upload failed.");
    });
});

// === Render Game Card with layout ===
function renderGameCard(gameData) {
  const gameFrame = `
    <style>${gameData.css}</style>
    ${gameData.html}
    <script>${gameData.js}<\/script>
  `;

  const card = document.createElement("div");
  card.className = "game-card";

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

// === Preview game in popup ===
function previewGame(button) {
  const gameHTML = button.closest(".game-card").querySelector(".game-content").innerHTML;
  const win = window.open("", "_blank", "width=800,height=600");
  win.document.write(gameHTML);
  win.document.close();
}

// === Toggle 3-dot menu ===
function toggleMenu(dotBtn) {
  const dropdown = dotBtn.parentElement.nextElementSibling;
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// === Remove game after password ===
function removeGame(button) {
  const userInput = prompt("Enter admin password to remove this game:");
  if (userInput !== password) {
    alert("❌ Incorrect password. Game not removed.");
    return;
  }

  const card = button.closest(".game-card");
  card.remove(); // frontend remove only (optional: backend delete in future)
}
