const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const savedUsersDiv = document.getElementById("savedUsers");

loadSavedUsers();

/* Search GitHub User */

async function searchUser() {

  const username = document.getElementById("searchInput").value.trim();

  if (!username) {
    alert("Please enter a GitHub username");
    return;
  }

  profileDiv.innerHTML = `
    <p style="text-align:center;">Loading profile...</p>
  `;

  reposDiv.innerHTML = `
    <p style="text-align:center;">Loading repositories...</p>
  `;

  try {

    /* Fetch User */

    const userRes = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!userRes.ok) {
      throw new Error("GitHub user not found");
    }

    const user = await userRes.json();

    /* Fetch Repositories */

    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = await repoRes.json();

    displayProfile(user);

    displayRepos(repos);

  } catch (error) {

    profileDiv.innerHTML = `
      <p style="color:red; text-align:center;">
        ❌ ${error.message}
      </p>
    `;

    reposDiv.innerHTML = "";
  }
}

/* Display Profile */

function displayProfile(user) {

  profileDiv.innerHTML = `
  
    <div class="card">

      <img src="${user.avatar_url}" />

      <h2>
        ${user.name || user.login}
      </h2>

      <p class="bio">
        ${
          user.bio ||
          "Passionate developer exploring JavaScript and APIs 🚀"
        }
      </p>

      <div class="stats">
        👥 Followers: ${user.followers}
        |
        📦 Repositories: ${user.public_repos}
      </div>

      <button
        class="save-btn"
        onclick="saveUser('${user.login}')"
      >
        ⭐ Save Developer
      </button>

    </div>
  `;
}

/* Display Repositories */

function displayRepos(repos) {

  if (repos.length === 0) {

    reposDiv.innerHTML = `
      <p>No repositories found.</p>
    `;

    return;
  }

  reposDiv.innerHTML = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map(repo => `
    
      <div class="repo-card">

        <a href="${repo.html_url}" target="_blank">
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

/* Save Developer */

function saveUser(username) {

  let savedUsers =
    JSON.parse(localStorage.getItem("savedUsers")) || [];

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

/* Load Saved Developers */

function loadSavedUsers() {

  let savedUsers =
    JSON.parse(localStorage.getItem("savedUsers")) || [];

  if (savedUsers.length === 0) {

    savedUsersDiv.innerHTML = `
      <p>No saved developers yet.</p>
    `;

    return;
  }

  savedUsersDiv.innerHTML = savedUsers
    .map(user => `
      <div class="saved-user">
        ⭐ ${user}
      </div>
    `)
    .join('');
}
