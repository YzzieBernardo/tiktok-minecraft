import { useState } from "react";
export default function MobNameSource({
    nameMode,
    specificNameId,
    allCustomNames,
    nameModeLoading,
    changeNameMode,
    selectSpecificName,
    addMobName,
    updateMobName,
    deleteMobName
}) {
    const [search, setSearch] = useState("");
    const [showNameForm, setShowNameForm] = useState(false);
    const [editingName, setEditingName] = useState(null);
    const [nameForm, setNameForm] = useState({
        name: "",
        team: "A"
    });

    const [deleteTarget, setDeleteTarget] = useState(null);

    // ==========================================
    // FILTER SAVED NAMES
    // ==========================================

    const filteredNames =
        allCustomNames.filter(item => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return true;
            }

            return (
                String(item.id)
                    .toLowerCase()
                    .includes(query) ||

                String(item.name || "")
                    .toLowerCase()
                    .includes(query) ||

                String(item.team || "")
                    .toLowerCase()
                    .includes(query)
            );

        });


    // ==========================================
    // OPEN ADD FORM
    // ==========================================

    const openAddName = () => {

        setEditingName(null);

        setNameForm({
            name: "",
            team: "A"
        });

        setShowNameForm(true);

    };


    // ==========================================
    // OPEN EDIT FORM
    // ==========================================

    const openEditName = (item) => {

        setEditingName(item);

        setNameForm({
            name: item.name || "",
            team: item.team || "A"
        });

        setShowNameForm(true);

    };


    // ==========================================
    // CLOSE FORM
    // ==========================================

    const closeNameForm = () => {

        setShowNameForm(false);

        setEditingName(null);

        setNameForm({
            name: "",
            team: "A"
        });

    };


    // ==========================================
    // UPDATE FORM
    // ==========================================

    const updateNameForm = (field, value) => {

        setNameForm(previous => ({
            ...previous,
            [field]: value
        }));

    };


    // ==========================================
    // SAVE NAME
    // ==========================================

    const handleSaveName = async () => {

        const name =
            nameForm.name
                .trim();

        if (!name) {
            return;
        }


        if (editingName) {

            await updateMobName(
                editingName.id,
                {
                    name,
                    team: nameForm.team
                }
            );

        } else {

            await addMobName({
                name,
                team: nameForm.team
            });

        }

        closeNameForm();

    };


    // ==========================================
    // CONFIRM DELETE
    // ==========================================

    const confirmDeleteName = async () => {

        if (!deleteTarget) {
            return;
        }

        await deleteMobName(
            deleteTarget.id
        );

        setDeleteTarget(null);

    };


    return (
        <section className="minecraft-card mob-name-mode-card">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="minecraft-card-title">
                MOB NAME SOURCE
            </div>

            <p className="minecraft-helper">
                Choose which name source Mob Battle
                uses for each spawned mob.
            </p>


            {/* ==========================================
                NAME MODE OPTIONS
            ========================================== */}

            <div className="mob-name-mode-options">

                {/* ==========================================
                    01 — TIKTOK NAMES
                ========================================== */}

                <button
                    type="button"
                    className={`mob-name-mode-option ${
                        nameMode === "tiktok"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        changeNameMode("tiktok")
                    }
                    disabled={nameModeLoading}
                >

                    <div className="mob-name-mode-number">
                        01
                    </div>

                    <div className="mob-name-mode-content">

                        <strong>
                            TikTok Names
                        </strong>

                        <span>
                            Use the detected TikTok username.
                        </span>

                    </div>

                    <div className="mob-name-mode-radio">

                        {nameMode === "tiktok"
                            ? "●"
                            : "○"}

                    </div>

                </button>


                {/* ==========================================
                    02 — ALL CUSTOM NAMES
                ========================================== */}

                <button
                    type="button"
                    className={`mob-name-mode-option ${
                        nameMode === "custom"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        changeNameMode("custom")
                    }
                    disabled={nameModeLoading}
                >

                    <div className="mob-name-mode-number">
                        02
                    </div>

                    <div className="mob-name-mode-content">

                        <strong>
                            All Custom Names
                        </strong>

                        <span>
                            Randomly use a saved name
                            from the mob's team.
                        </span>

                    </div>

                    <div className="mob-name-mode-radio">

                        {nameMode === "custom"
                            ? "●"
                            : "○"}

                    </div>

                </button>


                {/* ==========================================
                    03 — SPECIFIC NAME
                ========================================== */}

                <button
                    type="button"
                    className={`mob-name-mode-option ${
                        nameMode === "specific"
                            ? "active"
                            : ""
                    }`}
                    onClick={() => {

                        if (
                            allCustomNames.length === 0
                        ) {
                            return;
                        }

                        const first =
                            allCustomNames[0];

                        changeNameMode(
                            "specific",
                            first.id
                        );

                    }}
                    disabled={
                        nameModeLoading ||
                        allCustomNames.length === 0
                    }
                >

                    <div className="mob-name-mode-number">
                        03
                    </div>

                    <div className="mob-name-mode-content">

                        <strong>
                            Specific Name
                        </strong>

                        <span>
                            Use one exact saved name by ID.
                        </span>

                    </div>

                    <div className="mob-name-mode-radio">

                        {nameMode === "specific"
                            ? "●"
                            : "○"}

                    </div>

                </button>

            </div>


            {/* ==========================================
                SPECIFIC NAME DROPDOWN
            ========================================== */}

            {nameMode === "specific" && (

                <div className="mob-specific-name">

                    <label>
                        SELECT SAVED NAME
                    </label>

                    <select
                        value={
                            specificNameId ?? ""
                        }
                        onChange={
                            selectSpecificName
                        }
                        disabled={
                            nameModeLoading
                        }
                    >

                        <option value="">
                            Select a saved name...
                        </option>

                        {allCustomNames.map(
                            item => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    #{item.id}
                                    {" — "}
                                    {item.name}
                                    {" — Team "}
                                    {item.team}

                                </option>

                            )
                        )}

                    </select>

                </div>

            )}


            {/* ==========================================
                SAVED MOB NAMES
            ========================================== */}

            <div className="saved-mob-names">

                {/* ==========================================
                    SAVED NAMES HEADER
                ========================================== */}

                <div className="saved-mob-names-header">

                    <div>

                        <strong>
                            SAVED MOB NAMES
                        </strong>

                        <span>
                            Manage custom names used by
                            Mob Battle.
                        </span>

                    </div>

                    <button
                        type="button"
                        className="minecraft-button"
                        onClick={openAddName}
                    >
                        + ADD NAME
                    </button>

                </div>


                {/* ==========================================
                    SEARCH
                ========================================== */}

                <div className="saved-mob-names-search">

                    <input
                        type="text"
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search saved names..."
                    />

                </div>


                {/* ==========================================
                    TABLE
                ========================================== */}

                <div className="saved-mob-names-table-wrapper">

                    <table className="saved-mob-names-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    MOB NAME
                                </th>

                                <th>
                                    TEAM
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredNames.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="saved-mob-names-empty"
                                    >
                                        No saved mob names found.
                                    </td>

                                </tr>

                            ) : (

                                filteredNames.map(
                                    item => (

                                        <tr
                                            key={item.id}
                                        >

                                            <td>
                                                #{item.id}
                                            </td>

                                            <td>
                                                {item.name}
                                            </td>

                                            <td>
                                                Team {item.team}
                                            </td>

                                            <td>

                                                <div className="saved-mob-names-actions">

                                                    <button
                                                        type="button"
                                                        className="minecraft-button small"
                                                        onClick={() =>
                                                            openEditName(item)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="minecraft-button small danger"
                                                        onClick={() =>
                                                            setDeleteTarget(item)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==========================================
                ADD / EDIT MODAL
            ========================================== */}

            {showNameForm && (

                <div className="mob-name-modal-overlay">

                    <div className="mob-name-modal">

                        <div className="minecraft-card-title">

                            {editingName
                                ? "EDIT MOB NAME"
                                : "ADD MOB NAME"}

                        </div>


                        {/* ==========================================
                            NAME
                        ========================================== */}

                        <div className="mob-name-form-field">

                            <label>
                                MOB NAME
                            </label>

                            <input
                                type="text"
                                value={nameForm.name}
                                onChange={event =>
                                    updateNameForm(
                                        "name",
                                        event.target.value
                                    )
                                }
                                placeholder="Enter mob name..."
                                autoFocus
                            />

                        </div>


                        {/* ==========================================
                            TEAM
                        ========================================== */}

                        <div className="mob-name-form-field">

                            <label>
                                TEAM
                            </label>

                            <select
                                value={nameForm.team}
                                onChange={event =>
                                    updateNameForm(
                                        "team",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="A">
                                    Team A
                                </option>

                                <option value="B">
                                    Team B
                                </option>

                            </select>

                        </div>


                        {/* ==========================================
                            BUTTONS
                        ========================================== */}

                        <div className="mob-name-modal-actions">

                            <button
                                type="button"
                                className="minecraft-button"
                                onClick={closeNameForm}
                            >
                                CANCEL
                            </button>

                            <button
                                type="button"
                                className="minecraft-button"
                                onClick={handleSaveName}
                                disabled={
                                    !nameForm.name.trim()
                                }
                            >
                                {editingName
                                    ? "SAVE CHANGES"
                                    : "SAVE"}
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==========================================
                DELETE CONFIRMATION
            ========================================== */}

            {deleteTarget && (

                <div className="mob-name-modal-overlay">

                    <div className="mob-name-modal">

                        <div className="minecraft-card-title">
                            DELETE MOB NAME
                        </div>

                        <p className="minecraft-helper">

                            Are you sure you want to delete:

                        </p>

                        <strong className="delete-name-preview">

                            {deleteTarget.name}

                        </strong>

                        <p className="minecraft-helper">

                            This action cannot be undone.

                        </p>


                        <div className="mob-name-modal-actions">

                            <button
                                type="button"
                                className="minecraft-button"
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
                            >
                                CANCEL
                            </button>

                            <button
                                type="button"
                                className="minecraft-button danger"
                                onClick={
                                    confirmDeleteName
                                }
                            >
                                DELETE
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}