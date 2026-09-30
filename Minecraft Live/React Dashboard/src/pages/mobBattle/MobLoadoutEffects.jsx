// ==========================================
// MOB LOADOUT EFFECTS
// ==========================================
//
// Reusable Effects editor for Mob Battle
// loadouts.
//
// IMPORTANT:
// This component only manages the UI/data
// for loadout effects.
//
// It does NOT handle:
// - Minecraft spawning
// - Mob Loadout CRUD API
// - Catalog Management
// - TikTok teams
// - Zombie Apocalypse
// ==========================================

import { useMemo, useState } from "react";
import SearchableSelect from "./SearchableSelect";


// ==========================================
// COMPONENT
// ==========================================

export default function MobLoadoutEffects({
    effects = [],
    effectCatalog = [],
    onChange,
}) {

    // ==========================================
    // NEW EFFECT FORM
    // ==========================================

    const [newEffectId, setNewEffectId] =
        useState("");

    const [newEffectLevel, setNewEffectLevel] =
        useState(1);

    const [newEffectDuration, setNewEffectDuration] =
        useState(5);

    const [newEffectDurationUnit, setNewEffectDurationUnit] =
        useState("minutes");


    // ==========================================
    // NORMALIZE EFFECT CATALOG
    // ==========================================

    const normalizedCatalog = useMemo(() => {

        return effectCatalog
            .filter(effect => effect)
            .map(effect => {

                if (typeof effect === "string") {

                    return {
                        id: effect,
                        name: effect,
                    };
                }

                return {
                    id: effect.id || "",
                    name:
                        effect.name ||
                        effect.label ||
                        effect.id ||
                        "",
                };
            })
            .filter(effect => effect.id);

    }, [effectCatalog]);


    // ==========================================
    // FORMAT EFFECT NAME
    // ==========================================

    function formatEffectName(id) {

        if (!id) {
            return "Unknown Effect";
        }

        const catalogEffect =
            normalizedCatalog.find(
                effect =>
                    effect.id.toLowerCase() ===
                    id.toLowerCase()
            );

        if (catalogEffect?.name) {
            return catalogEffect.name;
        }

        const cleanName =
            id
                .replace(/^minecraft:/, "")
                .replace(/_/g, " ");

        return cleanName
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );
    }


    // ==========================================
    // CONVERT DURATION TO TICKS
    // ==========================================

    function durationToTicks(
        duration,
        unit
    ) {

        const value =
            Number(duration);

        if (!Number.isFinite(value) || value <= 0) {
            return 20;
        }

        if (unit === "seconds") {
            return Math.round(value * 20);
        }

        if (unit === "minutes") {
            return Math.round(value * 60 * 20);
        }

        if (unit === "hours") {
            return Math.round(value * 60 * 60 * 20);
        }

        return Math.round(value);
    }


    // ==========================================
    // TICKS TO DISPLAY DURATION
    // ==========================================

    function formatDuration(ticks) {

        const totalSeconds =
            Math.max(
                0,
                Math.floor(Number(ticks || 0) / 20)
            );

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;


        if (hours > 0) {

            return `${hours}h ${minutes}m`;
        }

        if (minutes > 0) {

            return `${minutes}m ${seconds}s`;
        }

        return `${seconds}s`;
    }


    // ==========================================
    // ADD EFFECT
    // ==========================================

    function addEffect() {

        if (!newEffectId) {
            return;
        }


        const level =
            Math.max(
                1,
                Math.min(
                    255,
                    Number(newEffectLevel) || 1
                )
            );


        const duration =
            durationToTicks(
                newEffectDuration,
                newEffectDurationUnit
            );


        const newEffect = {

            id: newEffectId,

            // UI level is 1-based.
            // Minecraft amplifier is 0-based.
            amplifier: level - 1,

            duration,

        };


        onChange([
            ...effects,
            newEffect,
        ]);


        // Reset form

        setNewEffectId("");

        setNewEffectLevel(1);

        setNewEffectDuration(5);

        setNewEffectDurationUnit(
            "minutes"
        );
    }


    // ==========================================
    // REMOVE EFFECT
    // ==========================================

    function removeEffect(index) {

        const updatedEffects =
            effects.filter(
                (_, effectIndex) =>
                    effectIndex !== index
            );

        onChange(updatedEffects);
    }


    // ==========================================
    // UPDATE EFFECT LEVEL
    // ==========================================

    function updateEffectLevel(
        index,
        level
    ) {

        const updatedEffects =
            effects.map(
                (effect, effectIndex) => {

                    if (
                        effectIndex !== index
                    ) {
                        return effect;
                    }

                    const normalizedLevel =
                        Math.max(
                            1,
                            Math.min(
                                255,
                                Number(level) || 1
                            )
                        );

                    return {
                        ...effect,
                        amplifier:
                            normalizedLevel - 1,
                    };
                }
            );

        onChange(updatedEffects);
    }


    // ==========================================
    // UPDATE EFFECT DURATION
    // ==========================================

    function updateEffectDuration(
        index,
        duration
    ) {

        const updatedEffects =
            effects.map(
                (effect, effectIndex) => {

                    if (
                        effectIndex !== index
                    ) {
                        return effect;
                    }

                    return {
                        ...effect,
                        duration:
                            Math.max(
                                20,
                                Number(duration) || 20
                            ),
                    };
                }
            );

        onChange(updatedEffects);
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="mob-loadout-effects">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="mob-loadout-effects-header">

                <div>

                    <div className="mob-loadout-effects-label">
                        EFFECTS
                    </div>

                    <h3>
                        Potion Effects
                    </h3>

                    <p>
                        Give this mob temporary effects
                        when the loadout is spawned.
                    </p>

                </div>

                <div className="mob-loadout-effects-count">
                    {effects.length}
                </div>

            </div>


            {/* ======================================
                EXISTING EFFECTS
            ====================================== */}

            {effects.length > 0 ? (

                <div className="mob-loadout-effects-list">

                    {effects.map(
                        (effect, index) => {

                            const level =
                                Number(
                                    effect.amplifier ?? 0
                                ) + 1;


                            return (
                                <div
                                    key={`${effect.id}-${index}`}
                                    className="mob-loadout-effect-row"
                                >

                                    {/* EFFECT NAME */}

                                    <div className="mob-loadout-effect-info">

                                        <strong>
                                            {formatEffectName(
                                                effect.id
                                            )}
                                        </strong>

                                        <small>
                                            {effect.id}
                                        </small>

                                    </div>


                                    {/* LEVEL */}

                                    <div className="mob-loadout-effect-control">

                                        <label>
                                            Level
                                        </label>

                                        <select
                                            value={level}
                                            onChange={event =>
                                                updateEffectLevel(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                        >

                                            {Array.from(
                                                {
                                                    length: 10,
                                                },
                                                (_, levelIndex) => (
                                                    <option
                                                        key={
                                                            levelIndex + 1
                                                        }
                                                        value={
                                                            levelIndex + 1
                                                        }
                                                    >
                                                        {levelIndex + 1}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* DURATION */}

                                    <div className="mob-loadout-effect-control">

                                        <label>
                                            Duration
                                        </label>

                                        <input
                                            type="text"
                                            value={formatDuration(
                                                effect.duration
                                            )}
                                            readOnly
                                        />

                                    </div>


                                    {/* REMOVE */}

                                    <button
                                        type="button"
                                        className="mob-loadout-effect-remove"
                                        onClick={() =>
                                            removeEffect(
                                                index
                                            )
                                        }
                                        aria-label={
                                            `Remove ${formatEffectName(
                                                effect.id
                                            )}`
                                        }
                                    >
                                        ×
                                    </button>

                                </div>
                            );
                        }
                    )}

                </div>

            ) : (

                <div className="mob-loadout-effects-empty">

                    <span>
                        No effects added
                    </span>

                    <small>
                        Add Strength, Resistance,
                        Speed, Regeneration, and more.
                    </small>

                </div>

            )}


            {/* ======================================
                ADD EFFECT
            ====================================== */}

            <div className="mob-loadout-effects-add">

                <div className="mob-loadout-effects-add-title">
                    ADD EFFECT
                </div>


                <div className="mob-loadout-effects-add-grid">

                    {/* EFFECT */}

                    <div className="mob-loadout-effect-control">

                        <label>
                            Effect
                        </label>

                      <SearchableSelect
    value={newEffectId}
    onChange={setNewEffectId}
    options={normalizedCatalog}
    placeholder="Select effect..."
    searchPlaceholder="Search effects..."
    getOptionValue={effect => effect.id}
    getOptionLabel={effect => effect.name}
/>

                    </div>


                    {/* LEVEL */}

                    <div className="mob-loadout-effect-control">

                        <label>
                            Level
                        </label>

                        <select
                            value={newEffectLevel}
                            onChange={event =>
                                setNewEffectLevel(
                                    event.target.value
                                )
                            }
                        >

                            {Array.from(
                                {
                                    length: 10,
                                },
                                (_, index) => (

                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {index + 1}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* DURATION */}

                    <div className="mob-loadout-effect-control">

                        <label>
                            Duration
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={
                                newEffectDuration
                            }
                            onChange={event =>
                                setNewEffectDuration(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* UNIT */}

                    <div className="mob-loadout-effect-control">

                        <label>
                            Unit
                        </label>

                        <select
                            value={
                                newEffectDurationUnit
                            }
                            onChange={event =>
                                setNewEffectDurationUnit(
                                    event.target.value
                                )
                            }
                        >

                            <option value="seconds">
                                Seconds
                            </option>

                            <option value="minutes">
                                Minutes
                            </option>

                            <option value="hours">
                                Hours
                            </option>

                        </select>

                    </div>


                    {/* ADD BUTTON */}

                    <button
                        type="button"
                        className="minecraft-button mob-loadout-effect-add-button"
                        onClick={addEffect}
                        disabled={
                            !newEffectId
                        }
                    >
                        + Add Effect
                    </button>

                </div>

            </div>

        </div>
    );
}