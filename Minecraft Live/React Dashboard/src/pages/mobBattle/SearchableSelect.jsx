import { useEffect, useMemo, useRef, useState } from 'react';

export default function SearchableSelect({
    value,
    options = [],
    onChange,
    placeholder = 'Select...',
    disabled = false,
    getOptionLabel = (option) => option?.name || option?.id || '',
    getOptionValue = (option) => option?.id || '',
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedOption = options.find(
        (option) =>
            String(getOptionValue(option)) === String(value)
    );

    const selectedLabel = selectedOption
        ? getOptionLabel(selectedOption)
        : '';

    function normalizeSearch(value) {
        return String(value || '')
            .toLowerCase()
            .trim()
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ');
    }

const filteredOptions = useMemo(() => {
    const query = normalizeSearch(search);

    // No search = show everything
    if (!query) {
        return options;
    }

    const queryWithoutNamespace = query.replace(
        /^minecraft:/,
        ''
    );

    return options
        .map((option, index) => {
            const label = normalizeSearch(
                getOptionLabel(option)
            );

            const value = normalizeSearch(
                getOptionValue(option)
            );

            const valueWithoutNamespace =
                value.replace(/^minecraft:/, '');

            // -----------------------------------------
            // STRICT MATCH CHECK
            // -----------------------------------------

            const labelMatches =
                label.includes(query);

            const valueMatches =
                value.includes(query) ||
                valueWithoutNamespace.includes(
                    queryWithoutNamespace
                );

            // If neither the name nor ID matches,
            // this option MUST NOT appear.
            if (!labelMatches && !valueMatches) {
                return null;
            }

            // -----------------------------------------
            // SEARCH PRIORITY
            // -----------------------------------------

            let score = 0;

            if (label === query) {
                score = 1000;
            } else if (label.startsWith(query)) {
                score = 900;
            } else if (
                valueWithoutNamespace ===
                queryWithoutNamespace
            ) {
                score = 850;
            } else if (
                valueWithoutNamespace.startsWith(
                    queryWithoutNamespace
                )
            ) {
                score = 800;
            } else if (labelMatches) {
                score = 700;
            } else if (valueMatches) {
                score = 600;
            }

            return {
                option,
                index,
                score,
            };
        })
        .filter(Boolean)
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }

            return a.index - b.index;
        })
        .map((result) => result.option);
}, [
    options,
    search,
    getOptionLabel,
    getOptionValue,
]);
    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            'mousedown',
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            );
        };
    }, []);

    useEffect(() => {
        if (open && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [open]);

    function handleToggle() {
        if (disabled) {
            return;
        }

        setOpen((current) => !current);
    }

    function handleSelect(option) {
        const optionValue = getOptionValue(option);

        onChange(optionValue);

        setSearch('');
        setOpen(false);
    }

    function handleClear() {
        onChange('');

        setSearch('');
        setOpen(false);
    }

    return (
        <div
            ref={containerRef}
            className="searchable-select"
        >
            <button
                type="button"
                className={`searchable-select-trigger ${
                    open ? 'open' : ''
                }`}
                onClick={handleToggle}
                disabled={disabled}
            >
                <span
                    className={
                        selectedLabel
                            ? 'searchable-select-value'
                            : 'searchable-select-placeholder'
                    }
                >
                    {selectedLabel || placeholder}
                </span>

                <span className="searchable-select-arrow">
                    {open ? '▲' : '▼'}
                </span>
            </button>

            {open && (
                <div className="searchable-select-menu">
                    <div className="searchable-select-search">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search..."
                            autoComplete="off"
                        />
                    </div>

                    {selectedLabel && (
                        <button
                            type="button"
                            className="searchable-select-clear"
                            onClick={handleClear}
                        >
                            Clear selection
                        </button>
                    )}

                    <div className="searchable-select-options">
                        {filteredOptions.length === 0 ? (
                            <div className="searchable-select-empty">
                                No results found.
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const optionValue =
                                    getOptionValue(option);

                                const optionLabel =
                                    getOptionLabel(option);

                                const isSelected =
                                    String(optionValue) ===
                                    String(value);

                                return (
                                    <button
                                        type="button"
                                        key={String(optionValue)}
                                        className={`searchable-select-option ${
                                            isSelected
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleSelect(option)
                                        }
                                    >
                                        <span className="searchable-select-option-name">
                                            {optionLabel}
                                        </span>

                                        {optionValue && (
                                            <small className="searchable-select-option-id">
                                                {optionValue}
                                            </small>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}