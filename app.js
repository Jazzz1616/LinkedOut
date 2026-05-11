const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const savedUsersDiv = document.getElementById("savedUsers");

let currentRepos = [];

loadSavedUsers();

/* ENTER KEY SUPPORT */

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
    alert("Please enter a GitHub username");
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

    /* FETCH REPOSITORIES */

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

  /* Collect languages */

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

        👥 Followers: ${user.followers}
        |
        📦 Repositories: ${user.public_repos}
        |
        📍 ${user.location || "Unknown"}

      </div>

      <div class="skills">

        ${languages.map(lang => `
          <span class="skill">
            ${lang}
          </span>
        `).join('')}

      </div>

      <button
        onclick="saveUser('${user.login}')"
      >
        ⭐ Save Developer
      </button>

    </div>
  `;
}

/* DISPLAY REPOSITORIES */

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
          |
          🛠 ${repo.language || "Unknown"}

        </div>

      </div>
    `)

    .join('');
}

/* FILTER REPOSITORIES */

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

    alert("Developer saved!");

  } else {

    alert("Developer already saved!");
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
