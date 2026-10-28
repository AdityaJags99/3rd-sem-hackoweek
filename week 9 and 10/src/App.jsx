import { useState, useEffect } from 'react';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import SearchForm from './components/SearchForm.jsx';
import FreelancersSection from './components/FreelancersSection.jsx';
import JoinSection from './components/JoinSection.jsx';
import HireSection from './components/HireSection.jsx';
import Footer from './components/Footer.jsx';

import { fetchFreelancers, wait } from './api.js';
import { storage } from './storage.js';
import { STORAGE_KEYS, EMPTY_FILTERS } from './constants.js';
import { getErrorMessage } from './errors.js';

/* Reading from localStorage can fail (StorageError), so we catch it and
   fall back to a default value instead of crashing the whole app. */
function readSaved(key, fallback) {
    try {
        return storage.get(key, fallback);
    } catch (error) {
        console.warn(error.message);
        return fallback;
    }
}

function saveQuietly(key, value) {
    try {
        storage.set(key, value);
    } catch (error) {
        console.warn(error.message);
    }
}

function App() {
    /* ---------- State (Hooks: useState) ----------
       This state is shared by several components, so it lives here in
       their closest common parent ("lifting state up") and is passed
       down as props. */
    const [baseFreelancers, setBaseFreelancers] = useState([]);   // from freelancers.json
    const [customFreelancers, setCustomFreelancers] = useState(
        () => readSaved(STORAGE_KEYS.profiles, [])                // created by the user
    );
    const [favorites, setFavorites] = useState(
        () => readSaved(STORAGE_KEYS.favorites, [])
    );
    const [filters, setFilters] = useState(
        () => ({ ...EMPTY_FILTERS, ...readSaved(STORAGE_KEYS.filters, {}) })
    );

    const [status, setStatus] = useState('loading');   // 'loading' | 'success' | 'error'
    const [loadError, setLoadError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);     // changing it loads the data again
    const [hireRequest, setHireRequest] = useState(null);
    const [notice, setNotice] = useState('');

    /* ---------- Effects (Hooks: useEffect) ---------- */

    // 1. Load the JSON file when the app starts (and again on "Try again").
    useEffect(() => {
        let ignore = false;   // stops old requests from updating state after cleanup

        async function loadFreelancers() {
            setStatus('loading');
            setLoadError('');

            try {
                const [freelancers] = await Promise.all([fetchFreelancers(), wait(400)]);
                if (!ignore) {
                    setBaseFreelancers(freelancers);
                    setStatus('success');
                }
            } catch (error) {
                console.error(error);
                if (!ignore) {
                    setLoadError(getErrorMessage(error));
                    setStatus('error');
                }
            }
        }

        loadFreelancers();

        return () => {
            ignore = true;   // cleanup function
        };
    }, [reloadKey]);

    // 2. Save favourites whenever they change.
    useEffect(() => {
        saveQuietly(STORAGE_KEYS.favorites, favorites);
    }, [favorites]);

    // 3. Save filters whenever they change.
    useEffect(() => {
        saveQuietly(STORAGE_KEYS.filters, filters);
    }, [filters]);

    /* ---------- Derived data (calculated on every render, no extra state) ---------- */
    const allFreelancers = [...baseFreelancers, ...customFreelancers];
    const query = filters.skill.trim().toLowerCase();
    const maxRate = filters.rate ? Number(filters.rate) : Infinity;

    const visibleFreelancers = allFreelancers.filter((freelancer) => {
        const searchable = [freelancer.name, freelancer.role, ...freelancer.skills]
            .join(' ')
            .toLowerCase();

        return (
            (!query || searchable.includes(query)) &&
            (!filters.category || freelancer.category === filters.category) &&
            freelancer.rate <= maxRate &&
            (!filters.savedOnly || favorites.includes(freelancer.id))
        );
    });

    let resultsText = '';
    if (!(status === 'error' && allFreelancers.length === 0) && status !== 'loading') {
        resultsText = `Showing ${visibleFreelancers.length} of ${allFreelancers.length} freelancers`;
    }
    if (notice) {
        resultsText += `${resultsText ? ' - ' : ''}${notice}`;
    }

    /* ---------- Event handlers (passed down as props) ---------- */

    function handleFilterChange(name, value) {
        setFilters((current) => ({ ...current, [name]: value }));
        setNotice('');
    }

    function handleSearch() {
        document.getElementById('freelancers')?.scrollIntoView({ behavior: 'smooth' });
    }

    function handleToggleSavedOnly() {
        setFilters((current) => ({ ...current, savedOnly: !current.savedOnly }));
        setNotice('');
    }

    function handleClearFilters() {
        setFilters(EMPTY_FILTERS);
        setNotice('');
    }

    function handleToggleFavorite(id) {
        setFavorites((current) =>
            current.includes(id)
                ? current.filter((savedId) => savedId !== id)
                : [...current, id]
        );
        setNotice('');
    }

    // Called by JoinSection. If localStorage fails, StorageError is thrown
    // here and caught by the try/catch inside JoinSection's submit handler.
    function handleAddFreelancer(profile) {
        const updated = [...customFreelancers, profile];
        storage.set(STORAGE_KEYS.profiles, updated);
        setCustomFreelancers(updated);
    }

    function handleHire(freelancer) {
        // A new object each time, so the effect in HireSection runs on every click.
        setHireRequest({ name: freelancer.name, category: freelancer.category });
    }

    function handleClearData() {
        if (!confirm('Remove all saved profiles, projects and favourites from this browser?')) {
            return;
        }

        try {
            Object.values(STORAGE_KEYS).forEach((key) => storage.remove(key));
        } catch (error) {
            console.error(error);
            setNotice(getErrorMessage(error));
            return;
        }

        setCustomFreelancers([]);
        setFavorites([]);
        setFilters(EMPTY_FILTERS);
        setNotice('saved data cleared.');
    }

    /* ---------- Component composition ---------- */
    return (
        <>
            <Header />

            <main id="home">
                <Hero />

                <SearchForm
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                />

                <FreelancersSection
                    toolbarProps={{
                        resultsText,
                        savedCount: favorites.length,
                        savedOnly: filters.savedOnly,
                        onToggleSavedOnly: handleToggleSavedOnly,
                        onClearFilters: handleClearFilters,
                        onClearData: handleClearData
                    }}
                    gridProps={{
                        status,
                        errorMessage: loadError,
                        freelancers: visibleFreelancers,
                        favorites,
                        onToggleFavorite: handleToggleFavorite,
                        onHire: handleHire,
                        onRetry: () => setReloadKey((key) => key + 1)
                    }}
                />

                <JoinSection onAddFreelancer={handleAddFreelancer} />
                <HireSection hireRequest={hireRequest} />
            </main>

            <Footer />
        </>
    );
}

export default App;
