import { useEffect, useMemo, useState } from "react";   
import SearchableSelect from "./SearchableSelect";


export default function MobBattlefield({
    loadouts = [],
}) {

        // ==========================================
    // TEAM LOADOUT DRAFT STORAGE
    // ==========================================

    const TEAM_LOADOUT_DRAFT_KEY =
        "mobBattlefieldTeamLoadoutDraft";
    // ==========================================
    // BATTLEFIELD SETTINGS
    // ==========================================

    const [width, setWidth] = useState(100);
    const [length, setLength] = useState(100);

const [teamAPosition, setTeamAPosition] = useState({
    x: "",
    y: "",
    z: "",
});

const [teamBPosition, setTeamBPosition] = useState({
    x: "",
    y: "",
    z: "",
});

    const [direction, setDirection] = useState("+X");
const [battlefieldLoading, setBattlefieldLoading] = useState(true);
const [battlefieldSaving, setBattlefieldSaving] = useState(false);
const [battlefieldMessage, setBattlefieldMessage] = useState("");
const [battlefieldSpawning, setBattlefieldSpawning] = useState(false);



    // ==========================================
    // TEAM ASSIGNMENTS
    // ==========================================

    const [teamALoadouts, setTeamALoadouts] = useState([]);
    const [teamBLoadouts, setTeamBLoadouts] = useState([]);


    // ==========================================
    // AVAILABLE LOADOUTS
    // ==========================================

const availableLoadouts = useMemo(() => {
    if (!Array.isArray(loadouts)) {
        return [];
    }

    return loadouts.filter(
        loadout =>
            loadout &&
            loadout.id !== undefined &&
            loadout.enabled !== false
    );
}, [loadouts]);
    // ==========================================
    // GET LOADOUT BY ID
    // ==========================================

    function getLoadout(loadoutId) {
        return loadouts.find(
            loadout =>
                String(loadout.id) ===
                String(loadoutId)
        );
    }

// ==========================================
// BATTLEFIELD SUMMARY
// ==========================================

const battlefield = useMemo(() => {
    const teamAX = Number(teamAPosition.x);
    const teamAY = Number(teamAPosition.y);
    const teamAZ = Number(teamAPosition.z);

    const teamBX = Number(teamBPosition.x);
    const teamBY = Number(teamBPosition.y);
    const teamBZ = Number(teamBPosition.z);

    const validTeamA =
        Number.isFinite(teamAX) &&
        Number.isFinite(teamAY) &&
        Number.isFinite(teamAZ);

    const validTeamB =
        Number.isFinite(teamBX) &&
        Number.isFinite(teamBY) &&
        Number.isFinite(teamBZ);

    const battlefieldWidth = Number(width);
    const battlefieldLength = Number(length);

    const validSize =
        Number.isFinite(battlefieldWidth) &&
        Number.isFinite(battlefieldLength) &&
        battlefieldWidth > 0 &&
        battlefieldLength > 0;

    return {
        ready:
            validTeamA &&
            validTeamB &&
            validSize,

        teamA: {
            position: validTeamA
                ? {
                      x: teamAX,
                      y: teamAY,
                      z: teamAZ,
                  }
                : null,

            width: validSize
                ? battlefieldWidth
                : 0,

            length: validSize
                ? battlefieldLength
                : 0,
        },

        teamB: {
            position: validTeamB
                ? {
                      x: teamBX,
                      y: teamBY,
                      z: teamBZ,
                  }
                : null,

            width: validSize
                ? battlefieldWidth
                : 0,

            length: validSize
                ? battlefieldLength
                : 0,
        },

        direction,

        width: validSize
            ? battlefieldWidth
            : 0,

        length: validSize
            ? battlefieldLength
            : 0,
    };
}, [
    teamAPosition,
    teamBPosition,
    width,
    length,
    direction,
]);
    // ==========================================
// LOAD BATTLEFIELD ON OPEN
// ==========================================

useEffect(() => {
    loadSavedBattlefield();
}, []);

// ==========================================
// AUTO-SAVE TEAM LOADOUT DRAFT
// ==========================================

useEffect(() => {
    if (battlefieldLoading) {
        return;
    }

    try {
        localStorage.setItem(
            TEAM_LOADOUT_DRAFT_KEY,
            JSON.stringify({
                teamA: teamALoadouts,
                teamB: teamBLoadouts,
                direction,
            })
        );
    } catch (error) {
        console.warn(
            "Failed to save Team Loadout draft:",
            error
        );
    }
}, [
    teamALoadouts,
    teamBLoadouts,
    battlefieldLoading,
]);

// ==========================================
// LOAD SAVED BATTLEFIELD
// ==========================================

const loadSavedBattlefield = async () => {
    try {
        setBattlefieldLoading(true);
        setBattlefieldMessage("");

  const response = await fetch(
    "http://localhost:3001/api/mob-battle/battlefield"
);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error ||
                "Failed to load Battlefield configuration."
            );
        }

 
        const saved = data.battlefield;

        if (!saved) {
            return;
        }

     setTeamAPosition({
    x:
        saved.teamAPosition?.x ??
        saved.center?.x ??
        "",
    y:
        saved.teamAPosition?.y ??
        saved.center?.y ??
        "",
    z:
        saved.teamAPosition?.z ??
        saved.center?.z ??
        "",
});

setTeamBPosition({
    x:
        saved.teamBPosition?.x ??
        saved.center?.x ??
        "",
    y:
        saved.teamBPosition?.y ??
        saved.center?.y ??
        "",
    z:
        saved.teamBPosition?.z ??
        saved.center?.z ??
        "",
});

        setWidth(
            saved.width ?? 100
        );

        setLength(
            saved.length ?? 100
        );

        setDirection(
            saved.direction ?? "+Z"
        );

        // ==========================================
        // LOAD TEAM LOADOUTS
        // ==========================================

        let draftLoaded = false;

        try {
            const savedDraft =
                localStorage.getItem(
                    TEAM_LOADOUT_DRAFT_KEY
                );

            if (savedDraft) {
                const draft =
                    JSON.parse(savedDraft);

                if (
                    Array.isArray(draft.teamA) ||
                    Array.isArray(draft.teamB)
                ) {
                    setTeamALoadouts(
                        Array.isArray(draft.teamA)
                            ? draft.teamA
                            : []
                    );

                    setTeamBLoadouts(
                        Array.isArray(draft.teamB)
                            ? draft.teamB
                            : []
                    );

                    draftLoaded = true;

                    console.log(
                        "Mob Battle Team Loadout draft restored."
                    );
                }
            }
        } catch (draftError) {
            console.warn(
                "Failed to restore Team Loadout draft:",
                draftError
            );
        }

        // No local draft = use server-saved data
        if (!draftLoaded) {
            setTeamALoadouts(
                Array.isArray(saved.teamA)
                    ? saved.teamA.map(row => ({
                        id: `${Date.now()}-${Math.random()}`,
                        loadoutId:
                            row.loadoutId || "",
                        amount:
                            Number(row.amount) || 1,
                    }))
                    : []
            );

            setTeamBLoadouts(
                Array.isArray(saved.teamB)
                    ? saved.teamB.map(row => ({
                        id: `${Date.now()}-${Math.random()}`,
                        loadoutId:
                            row.loadoutId || "",
                        amount:
                            Number(row.amount) || 1,
                    }))
                    : []
            );
        }

        console.log(
            "Mob Battle Battlefield loaded:",
            saved
        );

    } catch (error) {

        console.error(
            "Failed to load Battlefield:",
            error
        );

        setBattlefieldMessage(
            error.message ||
            "Failed to load Battlefield."
        );

    } finally {

        setBattlefieldLoading(false);
    }
};

    // ==========================================
    // GET MINECRAFT POSITION
    // ==========================================

  const handleSetPosition = async team => {
    try {
        const response = await fetch(
            "http://localhost:3001/api/mob-battle/battlefield/position"
        );

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Failed to get Minecraft position (${response.status}): ${errorText.slice(
                    0,
                    200
                )}`
            );
        }

        const data = await response.json();

        if (!data.success || !data.position) {
            throw new Error(
                data.error ||
                    "Failed to get Minecraft position."
            );
        }

        const position = {
            x: data.position.x,
            y: data.position.y,
            z: data.position.z,
        };

        if (team === "A") {
            setTeamAPosition(position);
        }

        if (team === "B") {
            setTeamBPosition(position);
        }

        console.log(
            `Minecraft position for Team ${team}:`,
            position
        );
    } catch (error) {
        console.error(
            "Failed to get Minecraft position:",
            error
        );

        alert(
            error.message ||
                "Unable to get Minecraft position."
        );
    }
};

// ==========================================
// SAVE BATTLEFIELD
// ==========================================

const handleSaveBattlefield = async () => {
    try {

        setBattlefieldSaving(true);
        setBattlefieldMessage("");

       const battlefieldData = {
    teamAPosition: {
        x: Number(teamAPosition.x),
        y: Number(teamAPosition.y),
        z: Number(teamAPosition.z),
    },

    teamBPosition: {
        x: Number(teamBPosition.x),
        y: Number(teamBPosition.y),
        z: Number(teamBPosition.z),
    },

    width: Number(width),

    length: Number(length),

    direction,

    teamA: teamALoadouts.map(row => ({
        loadoutId: row.loadoutId,
        amount: Number(row.amount) || 1,
    })),

    teamB: teamBLoadouts.map(row => ({
        loadoutId: row.loadoutId,
        amount: Number(row.amount) || 1,
    })),
};

       const response = await fetch(
    "http://localhost:3001/api/mob-battle/battlefield",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(
                    battlefieldData
                ),
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error ||
                "Failed to save Battlefield."
            );
        }

        setBattlefieldMessage(
            "Battlefield saved successfully."
        );

        console.log(
            "Mob Battle Battlefield saved:",
            data.battlefield
        );

    } catch (error) {

        console.error(
            "Failed to save Battlefield:",
            error
        );

        setBattlefieldMessage(
            error.message ||
            "Failed to save Battlefield."
        );

    } finally {

        setBattlefieldSaving(false);
    }
};

// ==========================================
// SPAWN BATTLEFIELD
// ==========================================

const handleSpawnBattlefield = async () => {
    try {
        setBattlefieldSpawning(true);
        setBattlefieldMessage("");

        // Make sure the battlefield has a valid center.
      // ==========================================
// VALIDATE TEAM A POSITION
// ==========================================

const teamAX = Number(teamAPosition.x);
const teamAY = Number(teamAPosition.y);
const teamAZ = Number(teamAPosition.z);

if (
    !Number.isFinite(teamAX) ||
    !Number.isFinite(teamAY) ||
    !Number.isFinite(teamAZ)
) {
    throw new Error(
        "Set a valid Minecraft spawn position for Team A first."
    );
}

// ==========================================
// VALIDATE TEAM B POSITION
// ==========================================

const teamBX = Number(teamBPosition.x);
const teamBY = Number(teamBPosition.y);
const teamBZ = Number(teamBPosition.z);

if (
    !Number.isFinite(teamBX) ||
    !Number.isFinite(teamBY) ||
    !Number.isFinite(teamBZ)
) {
    throw new Error(
        "Set a valid Minecraft spawn position for Team B first."
    );
}

        const battlefieldWidth = Number(width);
        const battlefieldLength = Number(length);

        if (
            !Number.isFinite(battlefieldWidth) ||
            !Number.isFinite(battlefieldLength) ||
            battlefieldWidth <= 0 ||
            battlefieldLength <= 0
        ) {
            throw new Error(
                "Battlefield width and length must be greater than 0."
            );
        }

        if (teamATotal <= 0 && teamBTotal <= 0) {
            throw new Error(
                "Add at least one loadout to Team A or Team B."
            );
        }

        if (teamATotal + teamBTotal > 500) {
            throw new Error(
                "Battlefield spawn is limited to 500 mobs."
            );
        }

        const hasInvalidTeamALoadout =
            teamALoadouts.some(
                row =>
                    !row.loadoutId ||
                    Number(row.amount) <= 0
            );

        const hasInvalidTeamBLoadout =
            teamBLoadouts.some(
                row =>
                    !row.loadoutId ||
                    Number(row.amount) <= 0
            );

        if (
            hasInvalidTeamALoadout ||
            hasInvalidTeamBLoadout
        ) {
            throw new Error(
                "Every Battlefield loadout must have a loadout selected and a valid amount."
            );
        }

const battlefieldData = {
    teamAPosition: {
        x: teamAX,
        y: teamAY,
        z: teamAZ,
    },

    teamBPosition: {
        x: teamBX,
        y: teamBY,
        z: teamBZ,
    },

    width: battlefieldWidth,

    length: battlefieldLength,

    direction,

    teamA: teamALoadouts.map(row => ({
        loadoutId: row.loadoutId,
        amount: Number(row.amount) || 1,
    })),

    teamB: teamBLoadouts.map(row => ({
        loadoutId: row.loadoutId,
        amount: Number(row.amount) || 1,
    })),
};
      const response = await fetch(
    "http://localhost:3001/api/mob-battle/battlefield/spawn",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(
                    battlefieldData
                ),
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error ||
                "Failed to spawn Battlefield."
            );
        }

        setBattlefieldMessage(
            "Battlefield spawned successfully."
        );

        console.log(
            "Mob Battle Battlefield spawned:",
            data.result
        );

    } catch (error) {

        console.error(
            "Failed to spawn Battlefield:",
            error
        );

        setBattlefieldMessage(
            error.message ||
            "Failed to spawn Battlefield."
        );

    } finally {

        setBattlefieldSpawning(false);
    }
};

    // ==========================================
    // ADD TEAM LOADOUT
    // ==========================================

    const addTeamLoadout = team => {
        const setter =
            team === "A"
                ? setTeamALoadouts
                : setTeamBLoadouts;

        setter(current => [
            ...current,
            {
                id: `${Date.now()}-${Math.random()}`,

                loadoutId: "",

                amount: 1,
            },
        ]);
    };

    // ==========================================
    // UPDATE TEAM LOADOUT
    // ==========================================

    const updateTeamLoadout = (
        team,
        rowId,
        field,
        value
    ) => {
        const setter =
            team === "A"
                ? setTeamALoadouts
                : setTeamBLoadouts;

        setter(current =>
            current.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        [field]: value,
                    }
                    : row
            )
        );
    };

    // ==========================================
    // REMOVE TEAM LOADOUT
    // ==========================================

    const removeTeamLoadout = (
        team,
        rowId
    ) => {
        const setter =
            team === "A"
                ? setTeamALoadouts
                : setTeamBLoadouts;

        setter(current =>
            current.filter(
                row =>
                    row.id !== rowId
            )
        );
    };

    // ==========================================
    // TEAM TOTALS
    // ==========================================

    const teamATotal = useMemo(() => {
        return teamALoadouts.reduce(
            (total, row) =>
                total +
                Math.max(
                    0,
                    Number(row.amount) || 0
                ),
            0
        );
    }, [teamALoadouts]);

    const teamBTotal = useMemo(() => {
        return teamBLoadouts.reduce(
            (total, row) =>
                total +
                Math.max(
                    0,
                    Number(row.amount) || 0
                ),
            0
        );
    }, [teamBLoadouts]);

    // ==========================================
    // LOADOUT SELECT HANDLER
    // ==========================================

    const handleLoadoutChange = (
        team,
        rowId,
        value
    ) => {
        const loadoutId =
            typeof value === "object"
                ? String(
                    value?.value ??
                    value?.id ??
                    ""
                )
                : String(value ?? "");

        updateTeamLoadout(
            team,
            rowId,
            "loadoutId",
            loadoutId
        );
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <section className="mob-battlefield">

            {/* ==========================================
                HEADER
            ========================================== */}

           <div className="mob-battlefield-header">

    <div>
        <h2>
            Battlefield
        </h2>

        <p>
            Configure the battlefield
            area and prepare the
            teams for war.
        </p>
    </div>

  <div className="mob-battlefield-header-actions">

    <button
        type="button"
        className="secondary-button"
        onClick={loadSavedBattlefield}
        disabled={
            battlefieldLoading ||
            battlefieldSaving
        }
    >
        {battlefieldLoading
            ? "Loading..."
            : "Load Saved"}
    </button>

    <button
        type="button"
        className="primary-button"
        onClick={handleSaveBattlefield}
        disabled={
            battlefieldLoading ||
            battlefieldSaving
        }
    >
        {battlefieldSaving
            ? "Saving..."
            : "Save Battlefield"}
    </button>

    <button
        type="button"
        className="primary-button"
        onClick={handleSpawnBattlefield}
        disabled={
            battlefieldLoading ||
            battlefieldSaving ||
            battlefieldSpawning
        }
    >
        {battlefieldSpawning
            ? "Spawning..."
            : "Spawn Battlefield"}
    </button>

</div>
</div>

{battlefieldMessage && (
    <div className="mob-battlefield-message">
        {battlefieldMessage}
    </div>
)}

            {/* ==========================================
                BATTLEFIELD SIZE
            ========================================== */}

            <section className="mob-battlefield-section">

                <div className="mob-battlefield-section-header">

                    <h3>
                        Battlefield Size
                    </h3>

                    <span>
                        Per Team
                    </span>

                </div>

                <div className="mob-battlefield-size-grid">

                    <label>
                        <span>
                            Width
                        </span>

                        <input
                            type="number"
                            min="1"
                            value={width}
                            onChange={event =>
                                setWidth(
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label>
                        <span>
                            Length
                        </span>

                        <input
                            type="number"
                            min="1"
                            value={length}
                            onChange={event =>
                                setLength(
                                    event.target.value
                                )
                            }
                        />
                    </label>

                </div>

            </section>

{/* ==========================================
    TEAM SPAWN POSITIONS
========================================== */}

<section className="mob-battlefield-section">

    <div className="mob-battlefield-section-header">

        <div>
            <h3>
                Team Spawn Positions
            </h3>

            <span>
                Set the exact Minecraft spawn
                position for each team.
            </span>
        </div>

    </div>

    <div className="mob-battlefield-loadout-teams">

        {/* ======================================
            TEAM A POSITION
        ====================================== */}

        <div className="mob-battlefield-team-loadouts">

            <div className="mob-battlefield-team-header">

                <div>
                    <h4>
                        TEAM A SPAWN POSITION
                    </h4>

                    <span>
                        Exact Minecraft coordinates
                    </span>
                </div>

            </div>

            <div className="mob-battlefield-coordinate-grid">

                {["x", "y", "z"].map(axis => (
                    <label key={`team-a-${axis}`}>

                        <span>
                            {axis.toUpperCase()}
                        </span>

                        <input
                            type="number"
                            value={
                                teamAPosition[axis]
                            }
                            placeholder={
                                `${axis.toUpperCase()} coordinate`
                            }
                            onChange={event =>
                                setTeamAPosition(
                                    previous => ({
                                        ...previous,
                                        [axis]:
                                            event.target.value,
                                    })
                                )
                            }
                        />

                    </label>
                ))}

            </div>

            <button
                type="button"
                className="mob-battlefield-position-button"
                onClick={() =>
                    handleSetPosition("A")
                }
            >
                Get My Minecraft Position
            </button>

        </div>


        {/* ======================================
            TEAM B POSITION
        ====================================== */}

        <div className="mob-battlefield-team-loadouts">

            <div className="mob-battlefield-team-header">

                <div>
                    <h4>
                        TEAM B SPAWN POSITION
                    </h4>

                    <span>
                        Exact Minecraft coordinates
                    </span>
                </div>

            </div>

            <div className="mob-battlefield-coordinate-grid">

                {["x", "y", "z"].map(axis => (
                    <label key={`team-b-${axis}`}>

                        <span>
                            {axis.toUpperCase()}
                        </span>

                        <input
                            type="number"
                            value={
                                teamBPosition[axis]
                            }
                            placeholder={
                                `${axis.toUpperCase()} coordinate`
                            }
                            onChange={event =>
                                setTeamBPosition(
                                    previous => ({
                                        ...previous,
                                        [axis]:
                                            event.target.value,
                                    })
                                )
                            }
                        />

                    </label>
                ))}

            </div>

            <button
                type="button"
                className="mob-battlefield-position-button"
                onClick={() =>
                    handleSetPosition("B")
                }
            >
                Get My Minecraft Position
            </button>

        </div>

    </div>

</section>

            {/* ==========================================
                DIRECTION
            ========================================== */}

            <section className="mob-battlefield-section">

                <div className="mob-battlefield-section-header">

                    <h3>
                        Battlefield Direction
                    </h3>

                    <span>
                        Team A → Team B
                    </span>

                </div>

                <select
                    value={direction}
                    onChange={event =>
                        setDirection(
                            event.target.value
                        )
                    }
                >
                    <option value="+X">
                        +X
                    </option>

                    <option value="-X">
                        -X
                    </option>

                    <option value="+Z">
                        +Z
                    </option>

                    <option value="-Z">
                        -Z
                    </option>
                </select>

            </section>

            {/* ==========================================
                TEAM LOADOUTS
            ========================================== */}

            <section className="mob-battlefield-section">

                <div className="mob-battlefield-section-header">

                    <div>
                        <h3>
                            Team Loadouts
                        </h3>

                        <span>
                            Assign existing mob loadouts
                            to each team.
                        </span>
                    </div>

                </div>

                <div className="mob-battlefield-loadout-teams">

                    {/* ======================================
                        TEAM A
                    ====================================== */}

                    <div className="mob-battlefield-team-loadouts">

                        <div className="mob-battlefield-team-header">

                            <div>
                                <h4>
                                    TEAM A
                                </h4>

                                <span>
                                    {teamATotal} mobs
                                </span>
                            </div>

                     <button
    type="button"
    className="secondary-button"
    onClick={() => addTeamLoadout("A")}
>
    + Add Loadout
</button>

                        </div>

                        {teamALoadouts.length === 0 ? (

                            <div className="mob-battlefield-loadout-empty">
                                No loadouts assigned.
                            </div>

                        ) : (

                            <div className="mob-battlefield-assignment-list">

                                {teamALoadouts.map(row => {

                                    const selectedLoadout =
                                        getLoadout(
                                            row.loadoutId
                                        );

                                    return (
                                        <div
                                            className="mob-battlefield-assignment-row"
                                            key={row.id}
                                        >

                                            <div className="field-group">

                                                <label>
                                                    LOADOUT
                                                </label>

          <SearchableSelect
    value={row.loadoutId}
    options={availableLoadouts}
    onChange={(value) =>
        updateTeamLoadout(
            "A",
            row.id,
            "loadoutId",
            value
        )
    }
    placeholder="Select loadout..."
/>                                   
</div>

                                            <div className="field-group quantity-field">

                                                <label>
                                                    AMOUNT
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={
                                                        row.amount
                                                    }
                                                    onChange={event =>
                                                        updateTeamLoadout(
                                                            "A",
                                                            row.id,
                                                            "amount",
                                                            Math.max(
                                                                1,
                                                                Math.floor(
                                                                    Number(
                                                                        event.target.value
                                                                    ) || 1
                                                                )
                                                            )
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="mob-battlefield-assignment-info">

                                                {selectedLoadout && (
                                                    <span>
                                                        {selectedLoadout.name}
                                                    </span>
                                                )}

                                            </div>

                                            <button
                                                type="button"
                                                className="danger-button"
                                                onClick={() =>
                                                    removeTeamLoadout(
                                                        "A",
                                                        row.id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    );
                                })}

                            </div>

                        )}

                    </div>

                    {/* ======================================
                        TEAM B
                    ====================================== */}

                    <div className="mob-battlefield-team-loadouts">

                        <div className="mob-battlefield-team-header">

                            <div>
                                <h4>
                                    TEAM B
                                </h4>

                                <span>
                                    {teamBTotal} mobs
                                </span>
                            </div>

                 <button
    type="button"
    className="secondary-button"
    onClick={() => addTeamLoadout("B")}
>
    + Add Loadout
</button>

                        </div>

                        {teamBLoadouts.length === 0 ? (

                            <div className="mob-battlefield-loadout-empty">
                                No loadouts assigned.
                            </div>

                        ) : (

                            <div className="mob-battlefield-assignment-list">

                                {teamBLoadouts.map(row => {

                                    const selectedLoadout =
                                        getLoadout(
                                            row.loadoutId
                                        );

                                    return (
                                        <div
                                            className="mob-battlefield-assignment-row"
                                            key={row.id}
                                        >

                                            <div className="field-group">

                                                <label>
                                                    LOADOUT
                                                </label>

<SearchableSelect
    value={row.loadoutId}
    options={availableLoadouts}
    onChange={(value) =>
        updateTeamLoadout(
            "B",
            row.id,
            "loadoutId",
            value
        )
    }
    placeholder="Select loadout..."
/>                       </div>

                                            <div className="field-group quantity-field">

                                                <label>
                                                    AMOUNT
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={
                                                        row.amount
                                                    }
                                                    onChange={event =>
                                                        updateTeamLoadout(
                                                            "B",
                                                            row.id,
                                                            "amount",
                                                            Math.max(
                                                                1,
                                                                Math.floor(
                                                                    Number(
                                                                        event.target.value
                                                                    ) || 1
                                                                )
                                                            )
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="mob-battlefield-assignment-info">

                                                {selectedLoadout && (
                                                    <span>
                                                        {selectedLoadout.name}
                                                    </span>
                                                )}

                                            </div>

                                            <button
                                                type="button"
                                                className="danger-button"
                                                onClick={() =>
                                                    removeTeamLoadout(
                                                        "B",
                                                        row.id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    );
                                })}

                            </div>

                        )}

                    </div>

                </div>

            </section>

            {/* ==========================================
                CALCULATED BATTLEFIELD
            ========================================== */}

            <section className="mob-battlefield-section">

                <div className="mob-battlefield-section-header">

                    <h3>
                        Calculated Battlefield
                    </h3>

                    <span>
                        Automatic
                    </span>

                </div>

                <div className="mob-battlefield-calculation-grid">

                    {/* TEAM A */}

                    <div className="mob-battlefield-card team-a">

                        <span>
                            Team A
                        </span>

                        <strong>
                            {battlefield.teamA.width}
                            {" × "}
                            {battlefield.teamA.length}
                        </strong>

                     <small>
    {teamATotal} mobs

    {battlefield.teamA.position && (
        <>
            <br />

            Spawn:{" "}
            {battlefield.teamA.position.x}
            {", "}
            {battlefield.teamA.position.y}
            {", "}
            {battlefield.teamA.position.z}
        </>
    )}
</small>

                    </div>

                    {/* TEAM B */}

                    <div className="mob-battlefield-card team-b">

                        <span>
                            Team B
                        </span>

                        <strong>
                            {battlefield.teamB.width}
                            {" × "}
                            {battlefield.teamB.length}
                        </strong>

                      <small>
    {teamBTotal} mobs

    {battlefield.teamB.position && (
        <>
            <br />

            Spawn:{" "}
            {battlefield.teamB.position.x}
            {", "}
            {battlefield.teamB.position.y}
            {", "}
            {battlefield.teamB.position.z}
        </>
    )}
</small>

                    </div>

                    {/* TOTAL */}

                  {/* TOTAL */}

<div className="mob-battlefield-card total">

    <span>
        Total Battlefield
    </span>

    <strong>
        {battlefield.width}
        {" × "}
        {battlefield.length}
    </strong>

    <small>
        {teamATotal + teamBTotal}
        {" total mobs"}

        <br />

        Team A:{" "}
        {battlefield.teamA.position
            ? `${battlefield.teamA.position.x}, ${battlefield.teamA.position.y}, ${battlefield.teamA.position.z}`
            : "Not set"}

        <br />

        Team B:{" "}
        {battlefield.teamB.position
            ? `${battlefield.teamB.position.x}, ${battlefield.teamB.position.y}, ${battlefield.teamB.position.z}`
            : "Not set"}
    </small>

</div>

                </div>

            </section>

            {/* ==========================================
                BATTLEFIELD PREVIEW
            ========================================== */}

            <section className="mob-battlefield-section">

                <div className="mob-battlefield-section-header">

                    <h3>
                        Battlefield Preview
                    </h3>

                    <span>
                        {direction}
                    </span>

                </div>

                <div className="mob-battlefield-preview">

                    <div className="battlefield-team battlefield-team-a">

                        <span>
                            TEAM A
                        </span>

                        <small>
                            {teamATotal} mobs
                        </small>

                        <small>
                            {battlefield.teamA.width}
                            {" × "}
                            {battlefield.teamA.length}
                        </small>

                    </div>

                    <div className="battlefield-center-line">

                        <span>
                            WAR ZONE
                        </span>

                    </div>

                    <div className="battlefield-team battlefield-team-b">

                        <span>
                            TEAM B
                        </span>

                        <small>
                            {teamBTotal} mobs
                        </small>

                        <small>
                            {battlefield.teamB.width}
                            {" × "}
                            {battlefield.teamB.length}
                        </small>

                    </div>

                </div>

            </section>

        </section>
    );
}