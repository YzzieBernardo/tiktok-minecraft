//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\mobBattle\MobLoadoutSpawner.jsx
// ==========================================
// MOB LOADOUT SPAWNER
// ==========================================
//
// Separate UI for spawning existing Mob Battle
// loadouts.
//
// IMPORTANT:
// This does NOT modify:
// - MobLoadouts CRUD
// - Catalog Management
// - Mob Name Source
// - TikTok teams.js
// - Zombie Apocalypse
// ==========================================

import { useMemo, useState } from "react";

const API_URL = "http://localhost:3001";


// ==========================================
// COMPONENT
// ==========================================

export default function MobLoadoutSpawner({
    loadouts = [],
    catalogs = {},
    running = false,
}) {

    // ==========================================
    // SELECTED LOADOUT
    // ==========================================

    const [selectedLoadoutId, setSelectedLoadoutId] =
        useState("");


    // ==========================================
    // SELECTED TEAM
    // ==========================================

    const [selectedTeam, setSelectedTeam] =
        useState("A");


    // ==========================================
    // SPAWN STATE
    // ==========================================

    const [spawning, setSpawning] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // ==========================================
    // ENABLED LOADOUTS
    // ==========================================

    const enabledLoadouts = useMemo(
        () =>
            loadouts.filter(
                loadout =>
                    loadout &&
                    loadout.enabled !== false
            ),
        [loadouts]
    );


    // ==========================================
    // SELECTED LOADOUT OBJECT
    // ==========================================

    const selectedLoadout =
        enabledLoadouts.find(
            loadout =>
                String(loadout.id) ===
                String(selectedLoadoutId)
        ) || null;


    // ==========================================
    // SPAWN LOADOUT
    // ==========================================

    async function spawnLoadout() {

        // ------------------------------------------
        // VALIDATE LOADOUT
        // ------------------------------------------

        if (!selectedLoadoutId) {

            setError(
                "Please select a loadout."
            );

            setMessage("");

            return;
        }


        // ------------------------------------------
        // VALIDATE MOB BATTLE STATUS
        // ------------------------------------------

        if (!running) {

            setError(
                "Mob Battle is currently OFF."
            );

            setMessage("");

            return;
        }


        setSpawning(true);
        setError("");
        setMessage("");


        try {

            // ------------------------------------------
            // API REQUEST
            // ------------------------------------------

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/loadouts/${selectedLoadoutId}/spawn`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                team:
                                    selectedTeam,
                            }),
                    }
                );


            const data =
                await response.json();


            // ------------------------------------------
            // HANDLE ERROR
            // ------------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to spawn Mob Battle loadout."
                );
            }


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            const result =
                data.result || {};


            setMessage(
                `Spawned ${result.spawned || 0} ` +
                `${result.mobId || "mob"} ` +
                `for Team ${result.team || selectedTeam}.`
            );


        } catch (error) {

            console.error(
                "Mob Loadout Spawner error:",
                error
            );


            setError(
                error.message ||
                "Failed to spawn loadout."
            );


        } finally {

            setSpawning(false);
        }
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <section className="minecraft-card mob-loadout-spawner">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="minecraft-card-header">

                <div>

                    <h2>
                        Spawn Mob Loadout
                    </h2>

                    <p>
                        Spawn an existing Mob Battle
                        loadout into Minecraft.
                    </p>

                </div>

            </div>


            {/* ==========================================
                FORM
            ========================================== */}

            <div className="mob-loadout-spawner-form">

                {/* ==========================================
                    LOADOUT
                ========================================== */}

                <div className="minecraft-form-group">

                    <label>
                        Loadout
                    </label>

                    <select
                        value={selectedLoadoutId}
                        onChange={event => {

                            setSelectedLoadoutId(
                                event.target.value
                            );

                            setMessage("");
                            setError("");
                        }}
                        disabled={
                            spawning ||
                            enabledLoadouts.length === 0
                        }
                    >

                        <option value="">
                            Select a loadout...
                        </option>

                        {enabledLoadouts.map(
                            loadout => (
                                <option
                                    key={loadout.id}
                                    value={loadout.id}
                                >
                                    {loadout.name}
                                    {" — "}
                                    {loadout.mobId}
                                    {" × "}
                                    {loadout.amount}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {/* ==========================================
                    TEAM
                ========================================== */}

                <div className="minecraft-form-group">

                    <label>
                        Team
                    </label>

                    <select
                        value={selectedTeam}
                        onChange={event => {

                            setSelectedTeam(
                                event.target.value
                            );

                            setMessage("");
                            setError("");
                        }}
                        disabled={spawning}
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
    SELECTED LOADOUT PREVIEW
========================================== */}

{selectedLoadout && (

    <div className="mob-loadout-spawner-preview">

        {/* PREVIEW HEADER */}

        <div className="mob-loadout-spawner-preview-header">

            <div>

                <span className="mob-loadout-preview-label">
                    SELECTED LOADOUT
                </span>

                <strong className="mob-loadout-preview-name">
                    {selectedLoadout.name}
                </strong>

            </div>

            <span className="mob-loadout-preview-team">
                Team {selectedTeam}
            </span>

        </div>


        {/* BASIC INFORMATION */}

        <div className="mob-loadout-spawner-preview-grid">

            <div className="mob-loadout-spawner-preview-item">

                <span>
                    Mob
                </span>

                <strong>
                    {selectedLoadout.mobId}
                </strong>

            </div>


            <div className="mob-loadout-spawner-preview-item">

                <span>
                    Quantity
                </span>

                <strong>
                    {selectedLoadout.amount}
                </strong>

            </div>


            <div className="mob-loadout-spawner-preview-item">

                <span>
                    Team
                </span>

                <strong>
                    Team {selectedTeam}
                </strong>

            </div>

        </div>


       {/* ==========================================
                        EQUIPMENT PREVIEW
                    ========================================== */}

                    <div className="mob-loadout-equipment-preview">

                        {/* ==========================================
                            ARMOR
                        ========================================== */}

                        <div className="mob-loadout-equipment-section">

                            <div className="mob-loadout-equipment-title">
                                ARMOR
                            </div>

                            <div className="mob-loadout-equipment-grid">

                                <div className="mob-loadout-equipment-item">

                                    <span>
                                        Helmet
                                    </span>

                                    <strong>
                                        {selectedLoadout.armor?.helmet || "None"}
                                    </strong>

                                </div>


                                <div className="mob-loadout-equipment-item">

                                    <span>
                                        Chestplate
                                    </span>

                                    <strong>
                                        {selectedLoadout.armor?.chestplate || "None"}
                                    </strong>

                                </div>


                                <div className="mob-loadout-equipment-item">

                                    <span>
                                        Leggings
                                    </span>

                                    <strong>
                                        {selectedLoadout.armor?.leggings || "None"}
                                    </strong>

                                </div>


                                <div className="mob-loadout-equipment-item">

                                    <span>
                                        Boots
                                    </span>

                                    <strong>
                                        {selectedLoadout.armor?.boots || "None"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* ==========================================
                            WEAPONS
                        ========================================== */}

                        <div className="mob-loadout-equipment-section">

                            <div className="mob-loadout-equipment-title">
                                WEAPONS
                            </div>

                            <div className="mob-loadout-equipment-grid">

                                <div className="mob-loadout-equipment-item">

                                    <span>
                                        Main Hand
                                    </span>

                                    <strong>
                                        {selectedLoadout.weapon?.mainHand || "None"}
                                    </strong>

                                </div>


                                <div className="mob-loadout-equipment-item">

                                    <span>
                                        Off Hand
                                    </span>

                                    <strong>
                                        {selectedLoadout.weapon?.offHand || "None"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* ==========================================
                            ENCHANTMENTS
                        ========================================== */}

                        <div className="mob-loadout-equipment-section">

                            <div className="mob-loadout-equipment-title">
                                ENCHANTMENTS
                            </div>

                            {selectedLoadout.enchantments?.length > 0 ? (

                                <div className="mob-loadout-enchantments">

                                    {selectedLoadout.enchantments.map(
                                        (enchantment, index) => (

                                            <div
                                                key={`${enchantment.id}-${index}`}
                                                className="mob-loadout-enchantment"
                                            >

                                                <strong>
                                                    {enchantment.id}
                                                </strong>

                                                <span>
                                                    Level {enchantment.level}
                                                </span>

                                                <small>
                                                    {enchantment.target}
                                                </small>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="mob-loadout-no-enchantments">
                                    No enchantments
                                </div>

                            )}

                        </div>


                        {/* ==========================================
                            EFFECTS
                        ========================================== */}

                        <div className="mob-loadout-equipment-section mob-loadout-spawner-effects">

                            <div className="mob-loadout-equipment-title">
                                EFFECTS
                            </div>

                            {!Array.isArray(selectedLoadout.effects) ||
                            selectedLoadout.effects.length === 0 ? (

                                <div className="mob-loadout-spawner-effects-empty">
                                    None
                                </div>

                            ) : (

                                <div className="mob-loadout-spawner-effects-list">

                                    {selectedLoadout.effects.map(
                                        (effect, index) => {

                                            const catalogItem =
                                                (catalogs?.effects || []).find(
                                                    item =>
                                                        String(item.id)
                                                            .trim()
                                                            .toLowerCase() ===
                                                        String(effect.id)
                                                            .trim()
                                                            .toLowerCase()
                                                );

                                            const level =
                                                Number(
                                                    effect.amplifier || 0
                                                ) + 1;

                                            const totalSeconds =
                                                Math.ceil(
                                                    Number(
                                                        effect.duration || 0
                                                    ) / 20
                                                );

                                            let durationText;

                                            if (
                                                totalSeconds >= 3600
                                            ) {

                                                const hours =
                                                    Math.floor(
                                                        totalSeconds / 3600
                                                    );

                                                durationText =
                                                    `${hours} hour${
                                                        hours === 1
                                                            ? ""
                                                            : "s"
                                                    }`;

                                            } else if (
                                                totalSeconds >= 60
                                            ) {

                                                const minutes =
                                                    Math.floor(
                                                        totalSeconds / 60
                                                    );

                                                durationText =
                                                    `${minutes} minute${
                                                        minutes === 1
                                                            ? ""
                                                            : "s"
                                                    }`;

                                            } else {

                                                durationText =
                                                    `${totalSeconds} second${
                                                        totalSeconds === 1
                                                            ? ""
                                                            : "s"
                                                    }`;
                                            }

                                            return (
                                                <div
                                                    key={`${effect.id}-${index}`}
                                                    className="mob-loadout-spawner-effect-chip"
                                                >

                                                    <strong>
                                                        {catalogItem?.name ||
                                                            effect.id}
                                                    </strong>

                                                    <span>
                                                        Level {level}
                                                    </span>

                                                    <span>
                                                        {durationText}
                                                    </span>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}




                {/* ==========================================
                    SPAWN BUTTON
                ========================================== */}

                <button
                    type="button"
                    className="minecraft-button"
                    onClick={spawnLoadout}
                    disabled={
                        spawning ||
                        !selectedLoadoutId ||
                        !running ||
                        enabledLoadouts.length === 0
                    }
                >

                    {spawning
                        ? "Spawning..."
                        : "Spawn Loadout"}

                </button>


                {/* ==========================================
                    SUCCESS MESSAGE
                ========================================== */}

                {message && (

                    <div className="minecraft-success">

                        {message}

                    </div>

                )}


                {/* ==========================================
                    ERROR MESSAGE
                ========================================== */}

                {error && (

                    <div className="minecraft-error">

                        {error}

                    </div>

                )}

            </div>

        </section>
    );
}