import { createContext, useContext, useState, useMemo, useCallback } from 'react';

import { useFreelancers } from '../hooks/useFreelancers.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { storage, readSaved } from '../storage.js';
import { STORAGE_KEYS, EMPTY_FILTERS } from '../constants.js';
import { AppError, getErrorMessage } from '../errors.js';

/* ---------- useContext (Week 11) ----------
   Before: App passed filters, favourites and handlers down through props.
   Now:    one Provider holds them and any component can read them with
           useFreelance(), with no prop drilling. */

const FreelanceContext = createContext(null);

export function FreelanceProvider({ children }) {
    const { freelancers: baseFreelancers, status, error: loadError, reload } = useFreelancers();

    // Profiles are saved explicitly (see addFreelancer) so a StorageError
    // can be reported by the form. Favourites and filters use the custom hook.
    const [customFreelancers, setCustomFreelancers] = useState(
        () => readSaved(STORAGE_KEYS.profiles, [])
    );
    const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
    const [storedFilters, setFilters] = useLocalStorage(STORAGE_KEYS.filters, EMPTY_FILTERS);
    const [notice, setNotice] = useState('');

    const filters = useMemo(
        () => ({ ...EMPTY_FILTERS, ...storedFilters }),
        [storedFilters]
    );

    // The input updates instantly, the list only re-filters after typing stops.
    const debouncedSkill = useDebounce(filters.skill, 250);

    /* ---------- useMemo: only recalculate when the inputs change ---------- */

    const freelancers = useMemo(
        () => [...baseFreelancers, ...customFreelancers],
        [baseFreelancers, customFreelancers]
    );

    const visibleFreelancers = useMemo(() => {
        const query = debouncedSkill.trim().toLowerCase();
        const maxRate = filters.rate ? Number(filters.rate) : Infinity;

        return freelancers.filter((freelancer) => {
            const searchable = [freelancer.name, freelancer.role, ...freelancer.skills]
                .join(' ')
                .toLowerCase();

            return (
                (!query || searchable.includes(query)) &&
                (!filters.category || freelancer.category === filters.category) &&
                freelancer.rate <= maxRate
            );
        });
    }, [freelancers, debouncedSkill, filters.category, filters.rate]);

    const visibleSaved = useMemo(
        () => visibleFreelancers.filter((freelancer) => favorites.includes(freelancer.id)),
        [visibleFreelancers, favorites]
    );

    const stats = useMemo(() => {
        const total = freelancers.length;
        const available = freelancers.filter((freelancer) => freelancer.available).length;
        const totalRate = freelancers.reduce((sum, freelancer) => sum + freelancer.rate, 0);

        return {
            total,
            available,
            averageRate: total ? Math.round(totalRate / total) : 0
        };
    }, [freelancers]);

    /* ---------- useCallback: stable functions ----------
       FreelancerCard is wrapped in React.memo. If toggleFavorite were a new
       function on every render, every card would re-render each time. */

    const updateFilter = useCallback((name, value) => {
        setFilters((current) => ({ ...current, [name]: value }));
        setNotice('');
    }, [setFilters]);

    const clearFilters = useCallback(() => {
        setFilters(EMPTY_FILTERS);
        setNotice('');
    }, [setFilters]);

    const toggleFavorite = useCallback((id) => {
        setFavorites((current) =>
            current.includes(id)
                ? current.filter((savedId) => savedId !== id)
                : [...current, id]
        );
        setNotice('');
    }, [setFavorites]);

    // If localStorage fails, storage.set throws a StorageError that the
    // join form catches in its own try/catch.
    const addFreelancer = useCallback((profile) => {
        const updated = [...customFreelancers, profile];
        storage.set(STORAGE_KEYS.profiles, updated);
        setCustomFreelancers(updated);
    }, [customFreelancers]);

    const getFreelancerById = useCallback(
        (id) => freelancers.find((freelancer) => freelancer.id === id),
        [freelancers]
    );

    const clearSavedData = useCallback(() => {
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
        setNotice('Saved data cleared.');
    }, [setFavorites, setFilters]);

    // The context value is memoised too, so consumers only re-render
    // when something they can read has really changed.
    const value = useMemo(() => ({
        freelancers,
        visibleFreelancers,
        visibleSaved,
        stats,
        status,
        loadError,
        reload,
        filters,
        updateFilter,
        clearFilters,
        favorites,
        toggleFavorite,
        addFreelancer,
        getFreelancerById,
        clearSavedData,
        notice
    }), [
        freelancers, visibleFreelancers, visibleSaved, stats, status, loadError, reload,
        filters, updateFilter, clearFilters, favorites, toggleFavorite, addFreelancer,
        getFreelancerById, clearSavedData, notice
    ]);

    return (
        <FreelanceContext.Provider value={value}>
            {children}
        </FreelanceContext.Provider>
    );
}

// Custom hook wrapping useContext, with a clear error if it is used incorrectly.
export function useFreelance() {
    const context = useContext(FreelanceContext);

    if (context === null) {
        throw new AppError('useFreelance must be used inside <FreelanceProvider>.');
    }
    return context;
}
