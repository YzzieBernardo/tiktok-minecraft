import { useState } from "react";

import {
    getZombieMobNameSource,
    saveZombieMobNameSource,
    addZombieMobName,
    deleteZombieMobName,
    selectZombieMobName,
} from "../zombieApi";

export default function SpawnConfiguration({
    state,
    saving,
    onSave,
}) {
    const [open, setOpen] = useState(false);

    // ==========================================
    // MOB NAME SOURCE
    // ==========================================

    const [nameSourceOpen, setNameSourceOpen] = useState(false);

    const [nameSource, setNameSource] = useState("tiktok");

    const [selectedNameId, setSelectedNameId] = useState(null);

    const [customNames, setCustomNames] = useState([]);

    const [newCustomName, setNewCustomName] = useState("");

    const [nameSourceLoading, setNameSourceLoading] = useState(false);
    const [addingCustomName, setAddingCustomName] = useState(false);
const [nameSaveMessage, setNameSaveMessage] = useState("");

    // ==========================================
    // SPAWN CONFIGURATION FORM
    // DO NOT REMOVE
    // ==========================================

    const [form, setForm] = useState({
        maxActiveZombies:
            state.maxActiveZombies ?? "",

        minSpawnRange:
            state.minSpawnRange ?? "",

        maxSpawnRange:
            state.maxSpawnRange ?? "",
    });

    // ==========================================
    // OPEN SPAWN CONFIGURATION
    // ==========================================

    function openModal() {
        setForm({
            maxActiveZombies:
                state.maxActiveZombies ?? "",

            minSpawnRange:
                state.minSpawnRange ?? "",

            maxSpawnRange:
                state.maxSpawnRange ?? "",
        });

        setOpen(true);
    }

    // ==========================================
    // CLOSE SPAWN CONFIGURATION
    // ==========================================

    function closeModal() {
        if (saving) return;

        setOpen(false);
    }

    // ==========================================
    // SAVE SPAWN CONFIGURATION
    // ==========================================

    async function handleSave() {
        await onSave(form);

        setOpen(false);
    }

    // ==========================================
    // OPEN NAME SOURCE MODAL
    // ==========================================

    async function openNameSourceModal() {
        setNameSourceLoading(true);

        try {
            const data =
                await getZombieMobNameSource();

            setNameSource(
                data.source ?? "tiktok"
            );

            setSelectedNameId(
                data.selectedNameId ?? null
            );

            setCustomNames(
                Array.isArray(data.names)
                    ? data.names
                    : []
            );

            setNewCustomName("");

            setNameSourceOpen(true);
        } catch (error) {
            console.error(
                "Failed to load mob name source:",
                error
            );

            alert(
                error.message ||
                "Failed to load mob name source."
            );
        } finally {
            setNameSourceLoading(false);
        }
    }

    // ==========================================
    // CLOSE NAME SOURCE MODAL
    // ==========================================

    function closeNameSourceModal() {
        setNameSourceOpen(false);
    }

    // ==========================================
    // SELECT NAME SOURCE
    // ==========================================

    async function selectNameSource(source) {
        try {
            if (source === "specific") {
                if (!selectedNameId) {
                    alert(
                        "Select a saved name first."
                    );

                    return;
                }

                const data =
                    await saveZombieMobNameSource(
                        "specific"
                    );

                setNameSource(
                    data.source ?? "specific"
                );

                return;
            }

            const data =
                await saveZombieMobNameSource(
                    source
                );

            setNameSource(
                data.source ?? source
            );
        } catch (error) {
            console.error(
                "Failed to save mob name source:",
                error
            );

            alert(
                error.message ||
                "Failed to save mob name source."
            );
        }
    }

    // ==========================================
    // ADD CUSTOM NAME
    // ==========================================
async function addCustomName() {
    const name = newCustomName.trim();

    if (!name) {
        alert("Enter a custom mob name first.");
        return;
    }

    if (addingCustomName) {
        return;
    }

    setAddingCustomName(true);
    setNameSaveMessage("");

    try {
        // ==========================================
        // SAVE NAME TO SERVER
        // ==========================================

        await addZombieMobName(name);

        // ==========================================
        // RELOAD THE ACTUAL JSON DATA FROM SERVER
        // ==========================================

        const data =
            await getZombieMobNameSource();

        // ==========================================
        // UPDATE THE LIST FROM SERVER
        // ==========================================

        setCustomNames(
            Array.isArray(data.names)
                ? data.names
                : []
        );

        // Keep selected name in sync
        setSelectedNameId(
            data.selectedNameId ?? null
        );

        // Keep source in sync
        setNameSource(
            data.source ?? "tiktok"
        );

        // Clear input
        setNewCustomName("");

        // Success message
        setNameSaveMessage(
            `"${name}" successfully added.`
        );

    } catch (error) {
        console.error(
            "Failed to add custom mob name:",
            error
        );

        alert(
            error.message ||
            "Failed to add custom mob name."
        );

    } finally {
        setAddingCustomName(false);
    }
}
    // ==========================================
    // REMOVE CUSTOM NAME
    // ==========================================

    async function removeCustomName(id) {
        try {
            await deleteZombieMobName(id);

            setCustomNames((prev) =>
                prev.filter(
                    (item) =>
                        Number(item.id) !==
                        Number(id)
                )
            );

            if (
                Number(selectedNameId) ===
                Number(id)
            ) {
                setSelectedNameId(null);
            }
        } catch (error) {
            console.error(
                "Failed to delete custom mob name:",
                error
            );

            alert(
                error.message ||
                "Failed to delete custom mob name."
            );
        }
    }

    // ==========================================
    // SELECT SPECIFIC CUSTOM NAME
    // ==========================================

    async function handleSpecificNameChange(id) {
        if (!id) {
            setSelectedNameId(null);
            return;
        }

        const numericId = Number(id);

        if (!Number.isInteger(numericId)) {
            return;
        }

        try {
            const data =
                await selectZombieMobName(
                    numericId
                );

            setSelectedNameId(
                data.selectedNameId
            );

            const sourceData =
                await saveZombieMobNameSource(
                    "specific"
                );

            setNameSource(
                sourceData.source ??
                "specific"
            );
        } catch (error) {
            console.error(
                "Failed to select specific mob name:",
                error
            );

            alert(
                error.message ||
                "Failed to select specific mob name."
            );
        }
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>
            {/* ==========================================
                SPAWN CONFIGURATION
                DO NOT REMOVE
            ========================================== */}

            <section className="za-spawn-card">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="za-spawn-header">

                    <div className="za-spawn-header-left">

                        <div className="za-spawn-icon">
                            ⚙
                        </div>

                        <div>
                            <h2>
                                SPAWN CONFIGURATION
                            </h2>

                            <p className="za-spawn-subtitle">
                                Current server configuration for zombie spawning.
                            </p>
                        </div>

                    </div>

                    {/* ==================================
                        RIGHT SIDE BUTTONS
                    ================================== */}

                    <div className="za-spawn-header-actions">

                        {/* MOB NAME SOURCE */}

                        <button
                            type="button"
                            className="za-name-source-button"
                            onClick={
                                openNameSourceModal
                            }
                        >
                            <span className="za-edit-button-icon">
                                ✎
                            </span>

                            Mob Name Source
                        </button>

                        {/* EXISTING SPAWN CONFIG EDIT */}

                        <button
                            type="button"
                            className="za-edit-button"
                            onClick={openModal}
                        >
                            <span className="za-edit-button-icon">
                                ✎
                            </span>

                            Edit Configuration
                        </button>

                    </div>

                </div>

                {/* ==========================================
                    CONFIGURATION
                    DO NOT REMOVE
                ========================================== */}

                <div className="za-config-grid">

                    {/* MAXIMUM ZOMBIES */}

                    <div className="za-config-stat">

                        <div className="za-config-icon za-config-zombie-icon">
                            ☠
                        </div>

                        <div className="za-config-content">

                            <span className="za-config-label">
                                MAXIMUM ZOMBIES
                            </span>

                            <div className="za-config-value-row">

                                <strong>
                                    {state.maxActiveZombies ??
                                        "—"}
                                </strong>

                                <span>
                                    zombies
                                </span>

                            </div>

                            <p className="za-config-description">
                                Upper limit of active zombies.
                            </p>

                        </div>

                    </div>

                    {/* MINIMUM SPAWN RANGE */}

                    <div className="za-config-stat">

                        <div className="za-config-icon za-config-range-icon">
                            ◎
                        </div>

                        <div className="za-config-content">

                            <span className="za-config-label">
                                MINIMUM SPAWN RANGE
                            </span>

                            <div className="za-config-value-row">

                                <strong>
                                    {state.minSpawnRange ??
                                        "—"}
                                </strong>

                                <span>
                                    blocks
                                </span>

                            </div>

                            <p className="za-config-description">
                                Minimum distance from players.
                            </p>

                        </div>

                    </div>

                    {/* MAXIMUM SPAWN RANGE */}

                    <div className="za-config-stat">

                        <div className="za-config-icon za-config-range-icon">
                            ◉
                        </div>

                        <div className="za-config-content">

                            <span className="za-config-label">
                                MAXIMUM SPAWN RANGE
                            </span>

                            <div className="za-config-value-row">

                                <strong>
                                    {state.maxSpawnRange ??
                                        "—"}
                                </strong>

                                <span>
                                    blocks
                                </span>

                            </div>

                            <p className="za-config-description">
                                Maximum distance from players.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    FOOTER
                ========================================== */}

                <div className="za-config-footer">

                    <div className="za-config-source">

                        <span className="za-status-dot" />

                        Configuration loaded from server

                    </div>

                    <div className="za-config-loaded">

                        Last updated:

                        <strong>
                            —
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==========================================
                SPAWN CONFIGURATION MODAL
                DO NOT REMOVE
            ========================================== */}

            {open && (
                <div
                    className="za-modal-overlay"
                    onMouseDown={closeModal}
                >

                    <div
                        className="za-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="za-modal-header">

                            <div>

                                <h2>
                                    Edit Spawn Configuration
                                </h2>

                                <p>
                                    Configure zombie spawning limits and distance.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="za-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        {/* BODY */}

                        <div className="za-modal-body">

                            {/* MAXIMUM ZOMBIES */}

                            <div className="za-modal-field">

                                <div className="za-modal-field-icon">
                                    ☠
                                </div>

                                <div className="za-modal-field-content">

                                    <label>
                                        Maximum Zombies
                                    </label>

                                    <small>
                                        Maximum number of active zombies.
                                    </small>

                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            form.maxActiveZombies
                                        }
                                        onChange={(event) =>
                                            setForm({
                                                ...form,

                                                maxActiveZombies:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>

                            </div>


                            {/* MINIMUM SPAWN RANGE */}

                            <div className="za-modal-field">

                                <div className="za-modal-field-icon">
                                    ◎
                                </div>

                                <div className="za-modal-field-content">

                                    <label>
                                        Minimum Spawn Range
                                    </label>

                                    <small>
                                        Minimum distance from players in blocks.
                                    </small>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            form.minSpawnRange
                                        }
                                        onChange={(event) =>
                                            setForm({
                                                ...form,

                                                minSpawnRange:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>

                            </div>


                            {/* MAXIMUM SPAWN RANGE */}

                            <div className="za-modal-field">

                                <div className="za-modal-field-icon">
                                    ◉
                                </div>

                                <div className="za-modal-field-content">

                                    <label>
                                        Maximum Spawn Range
                                    </label>

                                    <small>
                                        Maximum distance from players in blocks.
                                    </small>

                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            form.maxSpawnRange
                                        }
                                        onChange={(event) =>
                                            setForm({
                                                ...form,

                                                maxSpawnRange:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="za-modal-footer">

                            <button
                                type="button"
                                className="za-modal-cancel"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="za-modal-save"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Configuration"}
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* ==========================================
                MOB NAME SOURCE MODAL
            ========================================== */}

            {nameSourceOpen && (
                <div
                    className="za-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeNameSourceModal();
                        }
                    }}
                >

                    <div
                        className="za-modal za-name-source-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* ==================================
                            HEADER
                        ================================== */}

                        <div className="za-modal-header">

                            <div>

                                <h2>
                                    MOB NAME SOURCE
                                </h2>

                                <p>
                                    Choose which name source Zombie Apocalypse uses for each spawned mob.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="za-modal-close"
                                onClick={
                                    closeNameSourceModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* ==================================
                            BODY
                        ================================== */}

                        <div className="za-modal-body">

                            {nameSourceLoading ? (

                                <div className="za-custom-name-empty">
                                    Loading mob name source...
                                </div>

                            ) : (

                                <div className="za-name-source-options">

                                    {/* ==================================
                                        01 — TIKTOK NAMES
                                    ================================== */}

                                    <button
                                        type="button"
                                        className={`za-name-source-option ${
                                            nameSource ===
                                            "tiktok"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectNameSource(
                                                "tiktok"
                                            )
                                        }
                                    >

                                        <span className="za-name-source-number">
                                            01
                                        </span>

                                        <span className="za-name-source-content">

                                            <strong>
                                                TikTok Names
                                            </strong>

                                            <small>
                                                Use the detected TikTok username.
                                            </small>

                                        </span>

                                        <span className="za-name-source-radio">

                                            {nameSource ===
                                                "tiktok" && (
                                                <span />
                                            )}

                                        </span>

                                    </button>


                                    {/* ==================================
                                        02 — ALL CUSTOM NAMES
                                    ================================== */}

                                    <button
                                        type="button"
                                        className={`za-name-source-option ${
                                            nameSource ===
                                            "custom"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectNameSource(
                                                "custom"
                                            )
                                        }
                                    >

                                        <span className="za-name-source-number">
                                            02
                                        </span>

                                        <span className="za-name-source-content">

                                            <strong>
                                                All Custom Names
                                            </strong>

                                            <small>
                                                Randomly use a saved custom name.
                                            </small>

                                        </span>

                                        <span className="za-name-source-radio">

                                            {nameSource ===
                                                "custom" && (
                                                <span />
                                            )}

                                        </span>

                                    </button>


                                    {/* ==================================
                                        CUSTOM MOB NAMES
                                        SHOWN WHEN CUSTOM IS ACTIVE
                                    ================================== */}

                                    {nameSource ===
                                        "custom" && (
                                        <div className="za-custom-name-source-panel">

                                            <div className="za-custom-name-source-title">
                                                CUSTOM MOB NAMES
                                            </div>

                                            <p className="za-custom-name-source-description">
                                                Manage saved custom names used by Zombie Apocalypse.
                                            </p>

                                            <div className="za-custom-name-input-row">

                                                <input
                                                    type="text"
                                                    value={
                                                        newCustomName
                                                    }
                                                    placeholder="Enter custom name"
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setNewCustomName(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    onKeyDown={(
                                                        event
                                                    ) => {
                                                        if (
                                                            event.key ===
                                                            "Enter"
                                                        ) {
                                                            event.preventDefault();

                                                            addCustomName();
                                                        }
                                                    }}
                                                />

                                              <button
                                                type="button"
                                                onClick={addCustomName}
                                                disabled={addingCustomName}
                                            >
                                                {addingCustomName
                                                    ? "Adding..."
                                                    : "Add Name"}
                                            </button>

                                            </div>

                                            <div className="za-custom-name-source-list">
                                                {nameSaveMessage && (
                                                    <div className="za-custom-name-success">
                                                        {nameSaveMessage}
                                                    </div>
                                                )}

                                                {customNames.length ===
                                                    0 && (
                                                    <div className="za-custom-name-empty">
                                                        No custom names saved yet.
                                                    </div>
                                                )}

                                                {customNames.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <div
                                                            key={
                                                                item.id
                                                            }
                                                            className="za-custom-name-source-item"
                                                        >

                                                            <div className="za-custom-name-source-item-left">

                                                                <strong>
                                                                    {
                                                                        item.name
                                                                    }
                                                                </strong>

                                                            </div>

                                                            <span className="za-custom-name-source-id">
                                                                #
                                                                {
                                                                    item.id
                                                                }
                                                            </span>

                                                            <button
                                                                type="button"
                                                                className="za-custom-name-delete"
                                                                onClick={() =>
                                                                    removeCustomName(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                ×
                                                            </button>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>
                                    )}


                                    {/* ==================================
                                        03 — SPECIFIC NAME
                                    ================================== */}

                                    <button
                                        type="button"
                                        className={`za-name-source-option ${
                                            nameSource ===
                                            "specific"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectNameSource(
                                                "specific"
                                            )
                                        }
                                    >

                                        <span className="za-name-source-number">
                                            03
                                        </span>

                                        <span className="za-name-source-content">

                                            <strong>
                                                Specific Name
                                            </strong>

                                            <small>
                                                Use one exact saved name by ID.
                                            </small>

                                        </span>

                                        <span className="za-name-source-radio">

                                            {nameSource ===
                                                "specific" && (
                                                <span />
                                            )}

                                        </span>

                                    </button>


                                    {/* ==================================
                                        SPECIFIC NAME SELECTOR
                                    ================================== */}

                                    {nameSource ===
                                        "specific" && (
                                        <div className="za-specific-name-select">

                                            <label>
                                                SELECT SAVED NAME
                                            </label>

                                            <select
                                                value={
                                                    selectedNameId ??
                                                    ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleSpecificNameChange(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Select a saved name
                                                </option>

                                                {customNames.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <option
                                                            key={
                                                                item.id
                                                            }
                                                            value={
                                                                item.id
                                                            }
                                                        >
                                                            #
                                                            {
                                                                item.id
                                                            }
                                                            {" — "}
                                                            {
                                                                item.name
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>
                                    )}

                                </div>

                            )}

                        </div>


                        {/* ==================================
                            FOOTER
                        ================================== */}

                        <div className="za-modal-footer">

                            <button
                                type="button"
                                className="za-modal-cancel"
                                onClick={
                                    closeNameSourceModal
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}