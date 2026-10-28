// FreelanceHub - Weeks 5 & 6: Modern JavaScript ES6+
import { freelancers as starterFreelancers } from "./data.js";

// let/const: use const for stable references and let when reassignment is needed.
const freelancerGrid = document.querySelector("#freelancer-grid");
const searchForm = document.querySelector("#search-form");
const skillSearch = document.querySelector("#skill-search");
const categorySearch = document.querySelector("#category-search");
const budgetSearch = document.querySelector("#budget-search");
const resultsMessage = document.querySelector("#search-results-message");
const freelancerForm = document.querySelector("#freelancer-form");
const projectForm = document.querySelector("#project-form");

let freelancerList = [...starterFreelancers]; // Spread syntax copies the array.
let nextId = Math.max(...freelancerList.map(({ id }) => id)) + 1;

// Template literals create readable HTML strings. Destructuring extracts object fields.
const createFreelancerCard = ({
    name, initials, role, bio, skills, rate, availability, avatarClass
}) => `
    <article class="freelancer-card">
        <div class="profile-top">
            <div class="avatar ${avatarClass}" aria-hidden="true">${initials}</div>
            <span class="availability"><span class="status-dot"></span>${availability}</span>
        </div>
        <h3>${name}</h3>
        <p class="role">${role}</p>
        <p class="bio">${bio}</p>
        <ul class="skill-list" aria-label="Skills">
            ${skills.map(skill => `<li>${skill}</li>`).join("")}
        </ul>
        <div class="card-footer">
            <p class="rate"><strong>₹${Number(rate).toLocaleString("en-IN")}</strong>/hour</p>
            <a class="button button-small" href="#hire" aria-label="Hire ${name}">Hire Me</a>
        </div>
    </article>
`;

// Rest syntax collects any number of skills into one array.
const normalizeSkills = (...skillGroups) =>
    skillGroups.flat().map(skill => skill.trim()).filter(Boolean);

// map() renders cards; reduce() calculates a total for the results message.
const renderFreelancers = (list = freelancerList) => {
    freelancerGrid.innerHTML = list.length
        ? list.map(createFreelancerCard).join("")
        : `<div class="empty-state"><h3>No freelancers found</h3><p>Try changing your skill, category, or rate filters.</p></div>`;

    const totalHourlyRate = list.reduce((total, { rate }) => total + Number(rate), 0);
    const averageRate = list.length ? Math.round(totalHourlyRate / list.length) : 0;
    resultsMessage.textContent = list.length
        ? `Showing ${list.length} freelancer${list.length === 1 ? "" : "s"} · Average listed rate: ₹${averageRate.toLocaleString("en-IN")}/hour`
        : "No matching profiles. Try different search options.";
};

// filter() applies all search conditions. some() checks skill matches.
const searchFreelancers = () => {
    const searchTerm = skillSearch.value.trim().toLowerCase();
    const category = categorySearch.value;
    const maxRate = budgetSearch.value ? Number(budgetSearch.value) : Infinity;

    const matchingFreelancers = freelancerList.filter(({ name, role, skills, bio, category: profileCategory, rate }) => {
        const searchableText = [name, role, bio, ...skills].join(" ").toLowerCase();
        const skillMatches = !searchTerm || searchableText.includes(searchTerm)
            || skills.some(skill => skill.toLowerCase().includes(searchTerm));
        const categoryMatches = !category || profileCategory === category;
        const rateMatches = Number(rate) <= maxRate;
        return skillMatches && categoryMatches && rateMatches;
    });

    // every() demonstrates a whole-list check; used to give a useful search hint.
    const allAvailable = matchingFreelancers.length > 0
        && matchingFreelancers.every(({ availability }) => availability === "Available");
    renderFreelancers(matchingFreelancers);

    if (allAvailable && matchingFreelancers.length > 0) {
        resultsMessage.textContent += " · All matching freelancers are available";
    }
};

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchFreelancers();
    document.querySelector("#freelancers").scrollIntoView({ behavior: "smooth" });
});

[skillSearch, categorySearch, budgetSearch].forEach(control => {
    control.addEventListener("input", searchFreelancers);
    control.addEventListener("change", searchFreelancers);
});

// find() checks for a matching category configuration before creating a profile.
const categoryDetails = [
    { value: "development", label: "Web Development", role: "Web Developer", avatarClass: "avatar-purple" },
    { value: "design", label: "UI/UX Design", role: "UI/UX Designer", avatarClass: "avatar-orange" },
    { value: "writing", label: "Content Writing", role: "Content Writer", avatarClass: "avatar-green" },
    { value: "marketing", label: "Digital Marketing", role: "Digital Marketer", avatarClass: "avatar-orange" },
    { value: "data", label: "Data Science", role: "Data Analyst", avatarClass: "avatar-green" },
    { value: "other", label: "Other", role: "Freelancer", avatarClass: "avatar-purple" }
];

const showFormMessage = (form, message) => {
    let messageElement = form.querySelector(".form-message");
    if (!messageElement) {
        messageElement = document.createElement("p");
        messageElement.className = "form-message";
        messageElement.setAttribute("role", "status");
        form.append(messageElement);
    }
    messageElement.textContent = message;
};

freelancerForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(freelancerForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const category = String(formData.get("profession"));
    const skillsText = String(formData.get("skills"));
    const rate = Number(formData.get("hourly-rate"));
    const availabilityValue = String(formData.get("availability"));
    const categoryInfo = categoryDetails.find(item => item.value === category);

    // some() rejects a skills list that contains only blank entries.
    const skills = normalizeSkills(skillsText.split(","));
    if (!skills.some(skill => skill.length > 0)) {
        showFormMessage(freelancerForm, "Please enter at least one skill.");
        return;
    }

    const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
    const availabilityLabels = {
        "full-time": "Available · Full-time",
        "part-time": "Available · Part-time",
        "project-based": "Available · Project-based"
    };

    // Object spread adds the new profile while retaining the existing profile properties.
    const newFreelancer = {
        id: nextId++,
        name,
        initials,
        role: categoryInfo?.role ?? "Freelancer",
        category,
        bio: `${name} offers ${skills.join(", ")} services and is ready to collaborate on projects.`,
        skills,
        rate,
        availability: availabilityLabels[availabilityValue],
        avatarClass: categoryInfo?.avatarClass ?? "avatar-purple",
        email
    };

    freelancerList = [...freelancerList, newFreelancer];
    freelancerForm.reset();
    renderFreelancers();
    showFormMessage(freelancerForm, `Profile created for ${name}. It is now visible in Featured Freelancers for this session.`);
    document.querySelector("#freelancers").scrollIntoView({ behavior: "smooth" });
});

projectForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectTitle = String(formData.get("project-title")).trim();
    const requiredSkill = String(formData.get("required-skill"));
    const budget = Number(formData.get("budget"));

    // find() converts the category value into a readable label.
    const selectedCategory = categoryDetails.find(({ value }) => value === requiredSkill);
    showFormMessage(
        projectForm,
        `Demo submission received: "${projectTitle}" needs ${selectedCategory?.label ?? "a suitable skill"} with a budget of ₹${budget.toLocaleString("en-IN")}. This is only shown in your browser; nothing was sent to a server.`
    );
    projectForm.reset();
});

// Initial page render.
renderFreelancers();
