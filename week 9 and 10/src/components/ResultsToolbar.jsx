function ResultsToolbar({ resultsText, savedCount, savedOnly, onToggleSavedOnly, onClearFilters, onClearData }) {
    return (
        <div className="results-toolbar">
            <p className="results-count" role="status" aria-live="polite">
                {resultsText}
            </p>

            <div className="toolbar-actions">
                <button
                    className="button button-small button-outline"
                    type="button"
                    aria-pressed={savedOnly}
                    onClick={onToggleSavedOnly}
                >
                    ♥ Saved only ({savedCount})
                </button>
                <button
                    className="button button-small button-outline"
                    type="button"
                    onClick={onClearFilters}
                >
                    Clear filters
                </button>
                <button
                    className="button button-small button-outline"
                    type="button"
                    onClick={onClearData}
                >
                    Clear saved data
                </button>
            </div>
        </div>
    );
}

export default ResultsToolbar;
