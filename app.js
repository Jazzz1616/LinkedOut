const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const savedUsersDiv = document.getElementById("savedUsers");
const toast = document.getElementById("toast");

let currentRepos = [];

loadSavedUsers();

/* ENTER KEY */

document
  .getElementById("searchInput")
  .addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
      searchUser();
    }
});

/* SEARCH USER */

async function searchUser() {

  const username =
    document.getElementById("searchInput")
    .value
    .trim();

  if (!username) {
    showToast("Please enter a username");
    return;
  }

  profileDiv.innerHTML = `
    <div class="loader"></div>
  `;

  reposDiv.innerHTML = "";

  try {

    /* FETCH USER */

    const userRes = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!userRes.ok) {
      throw new Error("GitHub user not found");
    }

    const user = await userRes.json();

    /* FETCH REPOS */

    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = await repoRes.json();

    currentRepos = repos;

    displayProfile(user, repos);

    displayRepos(repos);

  } catch (error) {

    profileDiv.innerHTML = `
      <p style="color:red; text-align:center;">
        ❌ ${error.message}
      </p>
    `;
  }
}

/* DISPLAY PROFILE */

function displayProfile(user, repos) {

  const languages = [
    ...new Set(
      repos
      .map(repo => repo.language)
      .filter(Boolean)
    )
  ];

  profileDiv.innerHTML = `
  
    <div class="card">

      <img src="${user.avatar_url}" />

      <h2>
        ${user.name || user.login}
      </h2>

      <p class="bio">
        ${
          user.bio ||
          "Passionate JavaScript developer 🚀"
        }
      </p>

      <div class="stats">

        👥 Followers: ${user.followers}<br>

        ➕ Following: ${user.following}<br>

        📦 Repositories: ${user.public_repos}<br>

        🏢 Company:
        ${user.company || "Not specified"}<br>

        📍 Location:
        ${user.location || "Unknown"}<br>

        📅 Joined:
        ${new Date(user.created_at)
          .toLocaleDateString()}

      </div>

      <div class="skills">

        ${languages.map(lang => `
          <span class="skill">
            ${lang}
          </span>
        `).join('')}

      </div>

      <div class="profile-buttons">

        <button
          onclick="saveUser('${user.login}')"
        >
          ⭐ Save
        </button>

        <button
          onclick="copyUsername('${user.login}')"
        >
          📋 Copy Username
        </button>

        <a
          href="${user.html_url}"
          target="_blank"
          class="profile-link"
        >
          🔗 GitHub Profile
        </a>

      </div>

    </div>
  `;
}

/* DISPLAY REPOS */

function displayRepos(repos) {

  if (repos.length === 0) {

    reposDiv.innerHTML = `
      <p>No repositories found.</p>
    `;

    return;
  }

  reposDiv.innerHTML = repos

    .sort((a, b) =>
      b.stargazers_count - a.stargazers_count
    )

    .slice(0, 8)

    .map(repo => `
    
      <div class="repo-card">

        <a
          href="${repo.html_url}"
          target="_blank"
        >
          🚀 ${repo.name}
        </a>

        <p>
          ${
            repo.description ||
            "No description available"
          }
        </p>

        <div class="repo-stats">

          ⭐ ${repo.stargazers_count}
          |
          🍴 ${repo.forks_count}

        </div>

        <div class="language-tag">

          🛠 ${repo.language || "Unknown"}

        </div>

      </div>
    `)

    .join('');
}

/* FILTER REPOS */

function filterRepos() {

  const search =
    document.getElementById("repoSearch")
    .value
    .toLowerCase();

  const filtered = currentRepos.filter(repo =>
    repo.name.toLowerCase().includes(search)
  );

  displayRepos(filtered);
}

/* SAVE USER */

function saveUser(username) {

  let savedUsers =
    JSON.parse(
      localStorage.getItem("savedUsers")
    ) || [];

  if (!savedUsers.includes(username)) {

    savedUsers.push(username);

    localStorage.setItem(
      "savedUsers",
      JSON.stringify(savedUsers)
    );

    loadSavedUsers();

    showToast("Developer saved!");

  } else {

    showToast("Developer already saved!");
  }
}

/* REMOVE USER */

function removeUser(username) {

  let savedUsers =
    JSON.parse(
      localStorage.getItem("savedUsers")
    ) || [];

  savedUsers =
    savedUsers.filter(user => user !== username);

  localStorage.setItem(
    "savedUsers",
    JSON.stringify(savedUsers)
  );

  loadSavedUsers();

  showToast("Developer removed");
}

/* LOAD SAVED USERS */

function loadSavedUsers() {

  let savedUsers =
    JSON.parse(
      localStorage.getItem("savedUsers")
    ) || [];

  if (savedUsers.length === 0) {

    savedUsersDiv.innerHTML = `
      <p>No saved developers yet.</p>
    `;

    return;
  }

  savedUsersDiv.innerHTML = savedUsers

    .map(user => `
    
      <div class="saved-user">

        <span>
          ⭐ ${user}
        </span>

        <button
          class="remove-btn"
          onclick="removeUser('${user}')"
        >
          Remove
        </button>

      </div>
    `)

    .join('');
}

/* COPY USERNAME */

function copyUsername(username) {

  navigator.clipboard.writeText(username);

  showToast("Username copied!");
}

/* TOAST */

function showToast(message) {

  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
