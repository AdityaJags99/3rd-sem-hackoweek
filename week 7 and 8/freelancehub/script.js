/* =========================================
   FREELANCEHUB - script.js
   Week 7: Callbacks, Promises, async/await
   Week 8: fetch, DOM manipulation, Events, localStorage
   ========================================= */

'use strict';

/* -----------------------------------------
   1. CONSTANTS AND STATE
   ----------------------------------------- */

const DATA_URL = './freelancers.json';

const STORAGE_KEYS = {
    profiles: 'freelancehub:profiles',
    projects: 'freelancehub:projects',
    favorites: 'freelancehub:favorites',
    filters: 'freelancehub:filters'
};

const AVATAR_COLORS = ['purple', 'orange', 'green'];

const CATEGORY_ROLES = {
    development: 'Web Developer',
    design: 'UI/UX Designer',
    writing: 'Content Writer',
    marketing: 'Digital Marketer',
    data: 'Data Scientist',
    other: 'Freelancer'
};

const state = {
    baseFreelancers: [],     // loaded with fetch
    customFreelancers: [],   // created by the user, kept in localStorage
    favorites: [],           // ids of saved freelancers
    filters: { skill: '', category: '', rate: '', savedOnly: false },
    loadError: false
};

/* -----------------------------------------
   2. DOM REFERENCES (Week 8: DOM selection)
   ----------------------------------------- */

const $ = (selector) => document.querySelector(selector);

const dom = {
    searchForm: $('#search-form'),
    skillInput: $('#skill-search'),
    categorySelect: $('#category-search'),
    rateSelect: $('#budget-search'),
    freelancersSection: $('#freelancers'),
    grid: $('#freelancer-grid'),
    resultsCount: $('#results-count'),
    savedToggle: $('#saved-toggle'),
    clearFilters: $('#clear-filters'),
    clearData: $('#clear-data'),
    joinForm: $('#join-form'),
    joinStatus: $('#join-status'),
    projectForm: $('#project-form'),
    projectStatus: $('#project-status'),
    preferredInput: $('#preferred-freelancer'),
    requiredSkill: $('#required-skill')
};

/* -----------------------------------------
   3. HELPER FUNCTIONS
   ----------------------------------------- */

// Promise-based delay: resolves after "ms" milliseconds.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Debounce: waits until the user stops typing before running the callback.
function debounce(callback, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// Builds an element safely (textContent, never innerHTML).
function createElement(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    const { className, text, attrs = {} } = options;

    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;

    Object.entries(attrs).forEach(([name, value]) => {
        node.setAttribute(name, value);
    });

    children.forEach((child) => node.append(child));
    return node;
}

function setStatus(element, message, type = 'success') {
    element.textContent = message;
    element.className = `form-status form-status-${type}`;
    element.hidden = false;
}

function setBusy(button, isBusy, busyText) {
    if (isBusy) {
        button.dataset.originalText = button.textContent.trim();
        button.textContent = busyText;
    } else {
        button.textContent = button.dataset.originalText;
    }
    button.disabled = isBusy;
}

/* -----------------------------------------
   4. LOCAL STORAGE (Week 8)
   ----------------------------------------- */

const storage = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            console.warn(`Could not read "${key}" from localStorage.`, error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Could not save "${key}" to localStorage.`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Could not remove "${key}" from localStorage.`, error);
        }
    }
};

/* -----------------------------------------
   5. ASYNCHRONOUS JAVASCRIPT (Week 7)
   ----------------------------------------- */

/* 5a. CALLBACK style:
   The function does not return anything. It calls
   onSuccess or onError when the (simulated) work is done. */
function simulateServerCallback(data, onSuccess, onError) {
    setTimeout(() => {
        if (!data) {
            onError(new Error('No data received by the server.'));
            return;
        }
        onSuccess({ ...data, savedAt: new Date().toISOString() });
    }, 700);
}

/* 5b. PROMISE style:
   The same callback function wrapped in a Promise, so it can be
   used with .then()/.catch() or await. */
function simulateServer(data) {
    return new Promise((resolve, reject) => {
        simulateServerCallback(data, resolve, reject);
    });
}

/* 5c. fetch + async/await:
   Loads the freelancer list from freelancers.json. */
async function fetchFreelancers() {
    const response = await fetch(DATA_URL);

    // fetch only rejects on network errors, so check HTTP status manually.
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

async function loadFreelancers() {
    state.loadError = false;
    showGridMessage('Loading freelancers...');
    dom.grid.setAttribute('aria-busy', 'true');

    try {
        // Promise.all waits for BOTH promises: the data and a short delay
        // so the loading message does not flash too quickly.
        const [freelancers] = await Promise.all([fetchFreelancers(), wait(400)]);
        state.baseFreelancers = freelancers;
    } catch (error) {
        console.error('Could not load freelancers:', error);
        state.loadError = true;
    } finally {
        dom.grid.setAttribute('aria-busy', 'false');
    }

    applyFilters();
}

/* -----------------------------------------
   6. RENDERING (Week 8: DOM manipulation)
   ----------------------------------------- */

const getAllFreelancers = () => [
    ...state.baseFreelancers,
    ...state.customFreelancers
];

function showGridMessage(message, showRetry = false) {
    const box = createElement('div', { className: 'grid-message' }, [
        createElement('p', { text: message })
    ]);

    if (showRetry) {
        box.append(
            createElement('button', {
                className: 'button button-small retry-button',
                text: 'Try again',
                attrs: { type: 'button' }
            })
        );
    }

    dom.grid.replaceChildren(box);
}

function getInitials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');
}

function createFreelancerCard(freelancer, index) {
    const isSaved = state.favorites.includes(freelancer.id);
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

    // Top row: avatar + favourite button + availability
    const avatar = createElement('div', {
        className: `avatar avatar-${color}`,
        text: getInitials(freelancer.name),
        attrs: { 'aria-hidden': 'true' }
    });

    const favoriteButton = createElement('button', {
        className: 'favorite-button',
        text: isSaved ? '♥' : '♡',
        attrs: {
            type: 'button',
            'data-id': freelancer.id,
            'aria-pressed': String(isSaved),
            'aria-label': `${isSaved ? 'Remove' : 'Save'} ${freelancer.name}`
        }
    });

    const availability = createElement(
        'span',
        { className: `availability${freelancer.available ? '' : ' is-busy'}` },
        [
            createElement('span', { className: 'status-dot' }),
            document.createTextNode(freelancer.available ? ' Available' : ' Booked')
        ]
    );

    const profileTop = createElement('div', { className: 'profile-top' }, [
        avatar,
        createElement('div', { className: 'profile-actions' }, [
            availability,
            favoriteButton
        ])
    ]);

    // Skills
    const skillList = createElement(
        'ul',
        { className: 'skill-list', attrs: { 'aria-label': 'Skills' } },
        freelancer.skills.map((skill) => createElement('li', { text: skill }))
    );

    // Footer: rate + hire link
    const rate = createElement('p', { className: 'rate' }, [
        createElement('strong', { text: `₹${freelancer.rate.toLocaleString('en-IN')}` }),
        document.createTextNode('/hour')
    ]);

    const hireLink = createElement('a', {
        className: 'button button-small hire-link',
        text: 'Hire Me',
        attrs: {
            href: '#hire',
            'data-name': freelancer.name,
            'data-category': freelancer.category,
            'aria-label': `Hire ${freelancer.name}`
        }
    });

    return createElement(
        'article',
        { className: 'freelancer-card', attrs: { 'data-id': freelancer.id } },
        [
            profileTop,
            createElement('h3', { text: freelancer.name }),
            createElement('p', { className: 'role', text: freelancer.role }),
            createElement('p', { className: 'bio', text: freelancer.bio }),
            skillList,
            createElement('div', { className: 'card-footer' }, [rate, hireLink])
        ]
    );
}

function renderGrid(freelancers) {
    if (freelancers.length === 0) {
        if (state.loadError) {
            showGridMessage(
                'We could not load the freelancer list. If you opened index.html directly, ' +
                'run it with a local server (for example VS Code Live Server).',
                true
            );
        } else {
            showGridMessage('No freelancers match your search. Try changing the filters.');
        }
        return;
    }

    // DocumentFragment: build everything first, insert once.
    const fragment = document.createDocumentFragment();
    freelancers.forEach((freelancer, index) => {
        fragment.append(createFreelancerCard(freelancer, index));
    });
    dom.grid.replaceChildren(fragment);
}

function updateSavedToggle() {
    const count = state.favorites.length;
    dom.savedToggle.textContent = `♥ Saved only (${count})`;
    dom.savedToggle.setAttribute('aria-pressed', String(state.filters.savedOnly));
}

/* -----------------------------------------
   7. FILTERING AND SEARCH
   ----------------------------------------- */

function applyFilters() {
    const { skill, category, rate, savedOnly } = state.filters;
    const query = skill.trim().toLowerCase();
    const maxRate = rate ? Number(rate) : Infinity;
    const all = getAllFreelancers();

    const matches = all.filter((freelancer) => {
        const searchable = [freelancer.name, freelancer.role, ...freelancer.skills]
            .join(' ')
            .toLowerCase();

        return (
            (!query || searchable.includes(query)) &&
            (!category || freelancer.category === category) &&
            freelancer.rate <= maxRate &&
            (!savedOnly || state.favorites.includes(freelancer.id))
        );
    });

    renderGrid(matches);
    updateSavedToggle();

    dom.resultsCount.textContent = state.loadError && all.length === 0
        ? ''
        : `Showing ${matches.length} of ${all.length} freelancers`;
}

function readFiltersFromForm() {
    state.filters.skill = dom.skillInput.value;
    state.filters.category = dom.categorySelect.value;
    state.filters.rate = dom.rateSelect.value;
    storage.set(STORAGE_KEYS.filters, state.filters);
    applyFilters();
}

function restoreFilters() {
    const saved = storage.get(STORAGE_KEYS.filters, null);
    if (saved) {
        state.filters = { ...state.filters, ...saved };
    }
    dom.skillInput.value = state.filters.skill;
    dom.categorySelect.value = state.filters.category;
    dom.rateSelect.value = state.filters.rate;
}

function clearFilters() {
    state.filters = { skill: '', category: '', rate: '', savedOnly: false };
    dom.searchForm.reset();
    storage.set(STORAGE_KEYS.filters, state.filters);
    applyFilters();
}

/* -----------------------------------------
   8. FAVOURITES (localStorage)
   ----------------------------------------- */

function toggleFavorite(id) {
    const index = state.favorites.indexOf(id);

    if (index === -1) {
        state.favorites.push(id);
    } else {
        state.favorites.splice(index, 1);
    }

    storage.set(STORAGE_KEYS.favorites, state.favorites);
    applyFilters();

    // Re-rendering replaces the button, so give focus back to it.
    dom.grid.querySelector(`.favorite-button[data-id="${id}"]`)?.focus();
}

/* -----------------------------------------
   9. FORMS (events + async/await)
   ----------------------------------------- */

async function handleJoinSubmit(event) {
    event.preventDefault(); // stop the page from reloading

    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const data = new FormData(form);

    const category = data.get('profession');
    const availability = data.get('availability');

    const profile = {
        id: `p-${Date.now()}`,
        name: data.get('name').trim(),
        role: CATEGORY_ROLES[category] || 'Freelancer',
        category,
        bio: `Available for ${availability.replace('-', ' ')} work.`,
        skills: data.get('skills')
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean),
        rate: Number(data.get('hourly-rate')),
        available: true
    };

    setBusy(submitButton, true, 'Saving...');
    dom.joinStatus.hidden = true;

    try {
        const savedProfile = await simulateServer(profile);

        state.customFreelancers.push(savedProfile);
        const stored = storage.set(STORAGE_KEYS.profiles, state.customFreelancers);

        if (!stored) {
            throw new Error('Your browser blocked local storage.');
        }

        applyFilters();
        form.reset();
        setStatus(
            dom.joinStatus,
            `Welcome, ${savedProfile.name}! Your profile is now listed under Featured freelancers.`
        );
    } catch (error) {
        console.error(error);
        setStatus(dom.joinStatus, `Something went wrong: ${error.message}`, 'error');
    } finally {
        setBusy(submitButton, false);
    }
}

async function handleProjectSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const project = Object.fromEntries(new FormData(form));
    project.id = `job-${Date.now()}`;

    setBusy(submitButton, true, 'Submitting...');
    dom.projectStatus.hidden = true;

    // Promise chain version (.then/.catch/.finally) of the same idea.
    simulateServer(project)
        .then((savedProject) => {
            const projects = storage.get(STORAGE_KEYS.projects, []);
            projects.push(savedProject);

            if (!storage.set(STORAGE_KEYS.projects, projects)) {
                throw new Error('Your browser blocked local storage.');
            }

            form.reset();
            setStatus(
                dom.projectStatus,
                `Thanks! "${savedProject['project-title']}" was submitted. ` +
                `You have ${projects.length} saved project(s) in this browser.`
            );
        })
        .catch((error) => {
            console.error(error);
            setStatus(dom.projectStatus, `Something went wrong: ${error.message}`, 'error');
        })
        .finally(() => setBusy(submitButton, false));
}

function prefillProjectForm({ name, category }) {
    dom.preferredInput.value = name;

    // Only set the select if that option exists.
    const hasOption = [...dom.requiredSkill.options].some(
        (option) => option.value === category
    );
    if (hasOption) dom.requiredSkill.value = category;
}

/* -----------------------------------------
   10. CLEAR SAVED DATA
   ----------------------------------------- */

function clearSavedData() {
    if (!confirm('Remove all saved profiles, projects and favourites from this browser?')) {
        return;
    }

    Object.values(STORAGE_KEYS).forEach((key) => storage.remove(key));

    state.customFreelancers = [];
    state.favorites = [];
    clearFilters();
    dom.resultsCount.textContent += ' - saved data cleared.';
}

/* -----------------------------------------
   11. EVENT LISTENERS (Week 8: Events)
   ----------------------------------------- */

function setupEventListeners() {
    // Search form: submit, typing (debounced) and select changes
    dom.searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        readFiltersFromForm();
        dom.freelancersSection.scrollIntoView({ behavior: 'smooth' });
    });

    dom.skillInput.addEventListener('input', debounce(readFiltersFromForm, 250));
    dom.categorySelect.addEventListener('change', readFiltersFromForm);
    dom.rateSelect.addEventListener('change', readFiltersFromForm);

    // Toolbar buttons
    dom.savedToggle.addEventListener('click', () => {
        state.filters.savedOnly = !state.filters.savedOnly;
        storage.set(STORAGE_KEYS.filters, state.filters);
        applyFilters();
    });
    dom.clearFilters.addEventListener('click', clearFilters);
    dom.clearData.addEventListener('click', clearSavedData);

    // Event delegation: ONE listener handles every card, even cards
    // that are created later.
    dom.grid.addEventListener('click', (event) => {
        const favoriteButton = event.target.closest('.favorite-button');
        if (favoriteButton) {
            toggleFavorite(favoriteButton.dataset.id);
            return;
        }

        const hireLink = event.target.closest('.hire-link');
        if (hireLink) {
            prefillProjectForm(hireLink.dataset);
            return;
        }

        if (event.target.closest('.retry-button')) {
            loadFreelancers();
        }
    });

    // Registration and project forms
    dom.joinForm.addEventListener('submit', handleJoinSubmit);
    dom.projectForm.addEventListener('submit', handleProjectSubmit);
}

/* -----------------------------------------
   12. INITIALISE THE APP
   ----------------------------------------- */

async function init() {
    state.customFreelancers = storage.get(STORAGE_KEYS.profiles, []);
    state.favorites = storage.get(STORAGE_KEYS.favorites, []);

    restoreFilters();
    setupEventListeners();
    await loadFreelancers();
}

init();
