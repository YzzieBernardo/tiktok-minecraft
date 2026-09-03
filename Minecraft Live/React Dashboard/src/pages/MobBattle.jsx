//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\MobBattle.jsx
import { useEffect, useState } from "react";
import "../styles/mobBattle.css";

const API_URL = 'http://localhost:3001'

export default function MobBattle() {

    const [running, setRunning] = useState(false)
const [loading, setLoading] = useState(false)

const [teamANames, setTeamANames] =
    useState([])

const [teamBNames, setTeamBNames] =
    useState([])

const [newTeamAName, setNewTeamAName] =
    useState('')

const [newTeamBName, setNewTeamBName] =
    useState('')

const [error, setError] = useState('')

// ==========================================
// MOB NAME MODE
// ==========================================

const [nameMode, setNameMode] =
    useState('tiktok')

const [specificNameId, setSpecificNameId] =
    useState('')

const [nameModeLoading, setNameModeLoading] =
    useState(false)


        useEffect(() => {

            async function loadMobNames() {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/mob-battle/names`
                        )

                    const data =
                        await response.json()

                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            'Failed to load mob names'
                        )

                    }

                    const names =
                        Array.isArray(data.names)
                            ? data.names
                            : []

                    setTeamANames(
                        names.filter(
                            item => item.team === 'A'
                        )
                    )

                    setTeamBNames(
                        names.filter(
                            item => item.team === 'B'
                        )
                    )

                } catch (error) {

                    console.error(
                        'Mob Battle names error:',
                        error
                    )

                    setError(
                        error.message
                    )

                }

            }

            loadMobNames()

        }, [])


        useEffect(() => {

    async function loadNameMode() {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/name-mode`
                )

            const data =
                await response.json()

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Failed to load mob name mode'
                )

            }

            setNameMode(
                data.nameMode || 'tiktok'
            )

            setSpecificNameId(
                data.specificNameId ?? ''
            )

        } catch (error) {

            console.error(
                'Mob Battle name mode error:',
                error
            )

            setError(
                error.message
            )

        }

    }

    loadNameMode()

}, [])

    useEffect(() => {

        async function loadStatus() {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/mob-battle/status`
                    )

                const data =
                    await response.json()

                setRunning(
                    data.running
                )

            } catch (error) {

                console.error(
                    'Mob Battle status error:',
                    error
                )

            }

        }

        loadStatus()

    }, [])


    async function addTeamBName() {

    const name =
        newTeamBName.trim()

    if (!name) {

        setError(
            'Team B name is required.'
        )

        return
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/mob-battle/names`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        team: 'B',
                        name,
                    }),
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to save Team B name'
            )

        }

        setTeamBNames(
            previous => [
                ...previous,
                data.name
            ]
        )

        setNewTeamBName('')
        setError('')

    } catch (error) {

        console.error(
            'Team B name error:',
            error
        )

        setError(
            error.message
        )

    }

}

    async function addTeamAName() {

    const name =
        newTeamAName.trim()

    if (!name) {

        setError(
            'Team A name is required.'
        )

        return
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/mob-battle/names`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        team: 'A',
                        name,
                    }),
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to save Team A name'
            )

        }

        setTeamANames(
            previous => [
                ...previous,
                data.name
            ]
        )

        setNewTeamAName('')
        setError('')

    } catch (error) {

        console.error(
            'Team A name error:',
            error
        )

        setError(
            error.message
        )

    }

}

// ==========================================
// SELECT SPECIFIC NAME
// ==========================================

async function selectSpecificName(event) {

    const id =
        Number(
            event.target.value
        )

    if (!id) {
        return
    }

    await changeNameMode(
        'specific',
        id
    )

}


// ==========================================
// ALL CUSTOM NAMES
// ==========================================

const allCustomNames = [
    ...teamANames,
    ...teamBNames
]

// ==========================================
// CHANGE MOB NAME MODE
// ==========================================

async function changeNameMode(
    newMode,
    newSpecificId = null
) {

    setNameModeLoading(true)
    setError('')

    try {

        const response =
            await fetch(
                `${API_URL}/api/mob-battle/name-mode`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body:
                        JSON.stringify({
                            nameMode: newMode,

                            specificNameId:
                                newMode === 'specific'
                                    ? Number(
                                        newSpecificId
                                    )
                                    : null
                        })
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to change mob name mode'
            )

        }

        setNameMode(
            data.nameMode
        )

        setSpecificNameId(
            data.specificNameId ?? ''
        )

    } catch (error) {

        console.error(
            'Mob Battle name mode error:',
            error
        )

        setError(
            error.message
        )

    } finally {

        setNameModeLoading(false)

    }

}


    async function toggleMobBattle() {

        const enabled = !running

        setLoading(true)
        setError('')

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/toggle`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            enabled,
                        }),
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Mob Battle toggle failed'
                )

            }

            setRunning(
                data.running
            )

        } catch (error) {

            console.error(
                'Mob Battle toggle error:',
                error
            )

            setError(
                error.message
            )

        } finally {

            setLoading(false)

        }

    }

return (
    <div className="page">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="page-header">

            <h1>
                Mob Battle
            </h1>

            <p>
                Mob Battle control and team combat
            </p>

        </div>


        {/* ==========================================
            MOB BATTLE CONTROL
        ========================================== */}

        <section className="minecraft-card mob-battle-control-card">

            <div className="mob-battle-control">

                {/* STATUS */}

                <div className="mob-battle-status">

                    <div className="minecraft-card-title">
                        MOB BATTLE STATUS
                    </div>

                    <div
                        className={`minecraft-status ${
                            running
                                ? 'is-online'
                                : ''
                        }`}
                    >

                        <span className="status-dot" />

                        {running
                            ? 'ONLINE'
                            : 'OFFLINE'}

                    </div>

                </div>


                {/* DESCRIPTION */}

                <div className="mob-battle-description">

                    <div className="mob-battle-description-title">
                        Mob Battle
                    </div>

                    <p className="minecraft-helper">

                        Mob Battle controls
                        gift-based mob spawning
                        and team combat.

                    </p>

                    <p className="minecraft-helper">

                        When enabled, eligible
                        TikTok gifts can spawn
                        mobs for their assigned team.

                    </p>

                </div>


                {/* CONTROL BUTTON */}

                <div className="mob-battle-control-actions">

                    <button
                        className={`btn ${
                            running
                                ? 'btn-danger-outline'
                                : 'btn-primary'
                        }`}
                        onClick={toggleMobBattle}
                        disabled={loading}
                    >

                        {loading
                            ? 'Working...'
                            : running
                                ? '⚔ Turn OFF'
                                : '⚔ Turn ON'}

                    </button>

                </div>

            </div>

        </section>


        {/* ==========================================
            MOB NAME SOURCE
        ========================================== */}

        <section className="minecraft-card mob-name-mode-card">

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
                        nameMode === 'tiktok'
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        changeNameMode('tiktok')
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

                        {nameMode === 'tiktok'
                            ? '●'
                            : '○'}

                    </div>

                </button>


                {/* ==========================================
                    02 — ALL CUSTOM NAMES
                ========================================== */}

                <button
                    type="button"
                    className={`mob-name-mode-option ${
                        nameMode === 'custom'
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        changeNameMode('custom')
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

                        {nameMode === 'custom'
                            ? '●'
                            : '○'}

                    </div>

                </button>


                {/* ==========================================
                    03 — SPECIFIC NAME
                ========================================== */}

                <button
                    type="button"
                    className={`mob-name-mode-option ${
                        nameMode === 'specific'
                            ? 'active'
                            : ''
                    }`}
                    onClick={() => {

                        if (
                            allCustomNames.length === 0
                        ) {
                            return
                        }

                        const first =
                            allCustomNames[0]

                        changeNameMode(
                            'specific',
                            first.id
                        )

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

                        {nameMode === 'specific'
                            ? '●'
                            : '○'}

                    </div>

                </button>

            </div>


            {/* ==========================================
                SPECIFIC NAME DROPDOWN
            ========================================== */}

            {nameMode === 'specific' && (

                <div className="mob-specific-name">

                    <label>
                        SELECT SAVED NAME
                    </label>

                    <select
                        value={
                            specificNameId ?? ''
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
                                    {' — '}
                                    {item.name}
                                    {' — Team '}
                                    {item.team}

                                </option>

                            )
                        )}

                    </select>

                </div>

            )}

        </section>


        {/* ==========================================
            CUSTOM MOB NAMES
        ========================================== */}

        <section className="minecraft-card">

            <div className="minecraft-card-title">
                CUSTOM MOB NAMES
            </div>

            <p className="minecraft-helper">

                Add custom names that can be randomly
                assigned to mobs when no TikTok
                username is available.

            </p>


            {/* ==========================================
                TEAM A
            ========================================== */}

            <div className="custom-team-panel">

                <div className="custom-team-title team-a">
                    TEAM A / RED
                </div>

                <div className="custom-name-input-row">

                    <input
                        type="text"
                        value={newTeamAName}
                        onChange={(event) =>
                            setNewTeamAName(
                                event.target.value
                            )
                        }
                        placeholder="Enter Team A name"
                        className="minecraft-input custom-name-input"
                    />

                    <button
                        className="btn btn-primary custom-name-add"
                        onClick={addTeamAName}
                    >
                        Add Name
                    </button>

                </div>


                <div className="custom-name-list">

                    {teamANames.length === 0 ? (

                        <div className="custom-name-empty">
                            No Team A names yet.
                        </div>

                    ) : (

                        teamANames.map(item => (

                            <div
                                key={item.id}
                                className="custom-name-item"
                            >

                                <span className="custom-name-text">
                                    {item.name}
                                </span>

                                <span className="custom-name-id">
                                    #{item.id}
                                </span>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* ==========================================
                TEAM B
            ========================================== */}

            <div className="custom-team-panel">

                <div className="custom-team-title team-b">
                    TEAM B / BLUE
                </div>

                <div className="custom-name-input-row">

                    <input
                        type="text"
                        value={newTeamBName}
                        onChange={(event) =>
                            setNewTeamBName(
                                event.target.value
                            )
                        }
                        placeholder="Enter Team B name"
                        className="minecraft-input custom-name-input"
                    />

                    <button
                        className="btn btn-primary custom-name-add"
                        onClick={addTeamBName}
                    >
                        Add Name
                    </button>

                </div>


                <div className="custom-name-list">

                    {teamBNames.length === 0 ? (

                        <div className="custom-name-empty">
                            No Team B names yet.
                        </div>

                    ) : (

                        teamBNames.map(item => (

                            <div
                                key={item.id}
                                className="custom-name-item"
                            >

                                <span className="custom-name-text">
                                    {item.name}
                                </span>

                                <span className="custom-name-id">
                                    #{item.id}
                                </span>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </section>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

            <section className="minecraft-card">

                <p className="minecraft-error">
                    Error: {error}
                </p>

            </section>

        )}

    </div>
)
}