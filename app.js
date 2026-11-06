const list = document.querySelector("#internship-list");
const statusMessage = document.querySelector("#status-message");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const domainFilter = document.querySelector("#domain-filter");
const modeFilter = document.querySelector("#mode-filter");
const filterForm = document.querySelector("#filter-form");
const detailsDialog = document.querySelector("#details-dialog");
const applyDialog = document.querySelector("#apply-dialog");
let internships = [];

function showStatus(title, message, retry = false) {
  statusMessage.hidden = false;
  statusMessage.replaceChildren();
  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("span");
  copy.textContent = message;
  statusMessage.append(heading, copy);
  if (retry) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Try again";
    button.addEventListener("click", loadInternships);
    statusMessage.append(button);
  }
}

async function loadInternships() {
  list.setAttribute("aria-busy", "true");
  list.replaceChildren();
  statusMessage.hidden = true;
  resultsCount.textContent = "Loading opportunities…";
  try {
    const response = await fetch("data/internships.json");
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.internships)) throw new Error("The internship data has an unexpected format.");
    internships = payload.internships;
    populateDomains();
    renderInternships();
  } catch (error) {
    resultsCount.textContent = "Opportunities unavailable";
    showStatus("We couldn’t load the listings.", "Check your connection or run this project with a local development server, then try again.", true);
    console.error("Internship data loading failed:", error);
  } finally {
    list.setAttribute("aria-busy", "false");
  }
}

function populateDomains() {
  const selected = domainFilter.value;
  const domains = [...new Set(internships.map(item => item.domain))].sort();
  domainFilter.replaceChildren(new Option("All domains", ""));
  domains.forEach(domain => domainFilter.add(new Option(domain, domain)));
  domainFilter.value = domains.includes(selected) ? selected : "";
}

function getFilteredInternships() {
  const query = searchInput.value.trim().toLowerCase();
  return internships.filter(item => {
    const searchable = [item.title, item.domain, item.mode, item.location, ...item.skills].join(" ").toLowerCase();
    return searchable.includes(query)
      && (!domainFilter.value || item.domain === domainFilter.value)
      && (!modeFilter.value || item.mode === modeFilter.value);
  });
}

function makePill(text, className) {
  const pill = document.createElement("span");
  pill.className = className;
  pill.textContent = text;
  return pill;
}

function renderInternships() {
  const filtered = getFilteredInternships();
  list.replaceChildren();
  statusMessage.hidden = filtered.length > 0;
  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "opportunity" : "opportunities"} found`;
  if (!filtered.length) {
    showStatus("No matching opportunities.", "Try another keyword or clear one of your filters.");
    return;
  }
  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "internship-card";
    const top = document.createElement("div");
    top.className = "card-top";
    top.append(makePill(item.domain, "domain-pill"), makePill(item.mode, "mode-pill"));
    const title = document.createElement("h3");
    title.textContent = item.title;
    const location = document.createElement("p");
    location.className = "card-location";
    location.textContent = `⌖  ${item.location}`;
    const skills = document.createElement("div");
    skills.className = "skill-list";
    skills.setAttribute("aria-label", "Required skills");
    item.skills.forEach(skill => skills.append(makePill(skill, "skill")));
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    const openings = document.createElement("span");
    openings.className = "openings";
    openings.textContent = `${item.openings} ${item.openings === 1 ? "opening" : "openings"}`;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const details = document.createElement("button");
    details.className = "small-button";
    details.type = "button";
    details.textContent = "Details";
    details.setAttribute("aria-label", `View details for ${item.title}`);
    details.addEventListener("click", () => openDetails(item));
    const apply = document.createElement("button");
    apply.className = "small-button primary";
    apply.type = "button";
    apply.textContent = "Apply ↗";
    apply.setAttribute("aria-label", `Open demo application for ${item.title}`);
    apply.addEventListener("click", () => openApplication(item));
    actions.append(details, apply);
    bottom.append(openings, actions);
    card.append(top, title, location, skills, bottom);
    list.append(card);
  });
}

function openDetails(item) {
  const content = document.querySelector("#details-content");
  content.replaceChildren();
  const title = document.createElement("h2");
  title.className = "dialog-role";
  title.id = "details-title";
  title.textContent = item.title;
  const description = document.createElement("p");
  description.className = "dialog-description";
  description.textContent = item.description;
  const meta = document.createElement("div");
  meta.className = "dialog-meta";
  [item.domain, item.mode, item.location, `${item.openings} openings`].forEach(value => meta.append(makePill(value, "domain-pill")));
  const skillsTitle = document.createElement("h3");
  skillsTitle.textContent = "Skills to bring";
  const skills = document.createElement("p");
  skills.textContent = item.skills.join(" · ");
  const button = document.createElement("button");
  button.className = "primary-button";
  button.type = "button";
  button.textContent = "Apply for this role";
  button.addEventListener("click", () => {
    detailsDialog.close();
    openApplication(item);
  });
  content.append(title, description, meta, skillsTitle, skills, button);
  detailsDialog.showModal();
}

function openApplication(item) {
  document.querySelector("#application-role").value = item.title;
  document.querySelector("#apply-title").textContent = `Apply: ${item.title}`;
  document.querySelector("#application-feedback").textContent = "";
  applyDialog.showModal();
  document.querySelector("#applicant-name").focus();
}

filterForm.addEventListener("input", renderInternships);
filterForm.addEventListener("change", renderInternships);
filterForm.addEventListener("reset", () => {
  requestAnimationFrame(renderInternships);
});
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});
[detailsDialog, applyDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});
document.querySelector("#application-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  document.querySelector("#application-feedback").textContent = "Thanks! Your demo application was validated locally. Nothing was sent.";
  form.reset();
});

loadInternships();
