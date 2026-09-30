import { useEffect, useState } from "react";
import SearchableSelect from "./SearchableSelect";
import MobLoadoutEffects from "./MobLoadoutEffects";

const ENCHANTMENT_TARGETS = [
    {
        id: "full_armor",
        name: "Full Armor",
    },
    {
        id: "helmet",
        name: "Helmet",
    },
    {
        id: "chestplate",
        name: "Chestplate",
    },
    {
        id: "leggings",
        name: "Leggings",
    },
    {
        id: "boots",
        name: "Boots",
    },
    {
        id: "main_hand",
        name: "Main Hand",
    },
    {
        id: "off_hand",
        name: "Off Hand",
    },
];

const ARMOR_TARGETS = [
    "helmet",
    "chestplate",
    "leggings",
    "boots",
];

function normalizeId(id) {
    return String(id || "").trim().toLowerCase();
}

function getSelectValue(value) {
    if (typeof value === "string") {
        return value;
    }

    if (value && typeof value === "object") {
        return value.id || "";
    }

    return "";
}
function getItemType(item) {
    if (!item) {
        return null;
    }

    const id = normalizeId(item.id);

    // ==========================================
    // EXACT EQUIPMENT TYPES
    // Check ID first so Bow/Crossbow are not
    // incorrectly returned as "ranged".
    // ==========================================

    if (id.endsWith(":bow")) {
        return "bow";
    }

    if (id.endsWith(":crossbow")) {
        return "crossbow";
    }

    if (id.endsWith(":trident")) {
        return "trident";
    }

    if (id.endsWith(":fishing_rod")) {
        return "fishing_rod";
    }

    if (id.endsWith(":shield")) {
        return "shield";
    }

    if (id.endsWith(":shears")) {
        return "shears";
    }

    if (id.endsWith(":flint_and_steel")) {
        return "flint_and_steel";
    }

    if (id.endsWith(":brush")) {
        return "brush";
    }

    if (id.endsWith(":carrot_on_a_stick")) {
        return "carrot_on_a_stick";
    }

    if (id.endsWith(":warped_fungus_on_a_stick")) {
        return "warped_fungus_on_a_stick";
    }

    if (id.endsWith(":mace")) {
        return "mace";
    }

    // ==========================================
    // ARMOR
    // ==========================================

    if (item.slot) {
        return String(item.slot).trim().toLowerCase();
    }

    if (id.includes("helmet")) {
        return "helmet";
    }

    if (id.includes("chestplate")) {
        return "chestplate";
    }

    if (id.includes("leggings")) {
        return "leggings";
    }

    if (id.includes("boots")) {
        return "boots";
    }

    // ==========================================
    // TOOLS / MELEE WEAPONS
    // ==========================================

    if (id.includes("sword")) {
        return "sword";
    }

    if (id.includes("pickaxe")) {
        return "pickaxe";
    }

    if (id.includes("shovel")) {
        return "shovel";
    }

    if (id.includes("hoe")) {
        return "hoe";
    }

    if (id.includes("axe")) {
        return "axe";
    }

    // ==========================================
    // FALLBACK TO CATALOG TYPE
    // ==========================================

    if (item.type) {
        return String(item.type).trim().toLowerCase();
    }

    return null;
}

export default function MobLoadouts({
    loadouts,
    catalogs,
    loadoutsLoading,
    loadoutSaving,
    editingLoadoutId,
    showLoadoutForm,
    loadoutForm,

    openNewLoadoutForm,
    openEditLoadoutForm,
    closeLoadoutForm,

    updateLoadoutField,
    updateLoadoutArmor,
    updateLoadoutWeapon,
    updateLoadoutEnchantments,
    updateLoadoutEffects,

    saveLoadout,
    deleteLoadout,
    toggleLoadoutEnabled,
}) {

  console.log(
    "MobLoadouts received loadouts:",
    JSON.stringify(loadouts, null, 2)
);
const [selectedEnchantmentId, setSelectedEnchantmentId] =
    useState("");
const [selectedEnchantmentLevel, setSelectedEnchantmentLevel] =
    useState(1);

const [extendEnchantmentLevel, setExtendEnchantmentLevel] =
    useState(false);

const [allowIncompatibleEnchantments, setAllowIncompatibleEnchantments] =
    useState(false);

const [applyToAllArmor, setApplyToAllArmor] =
    useState(false);

const [enchantmentError, setEnchantmentError] =
    useState("");

const [selectedEnchantmentTarget, setSelectedEnchantmentTarget] =
    useState("");

    const enchantments = Array.isArray(loadoutForm?.enchantments)
        ? loadoutForm.enchantments
        : [];

    const armor = loadoutForm?.armor || {
        helmet: "",
        chestplate: "",
        leggings: "",
        boots: "",
    };

    const weapon = loadoutForm?.weapon || {
        mainHand: "",
        offHand: "",
    };

    const equipmentCatalog = [
        ...(catalogs?.weapons || []),
        ...(catalogs?.tools || []),
        ...(catalogs?.items || []),
    ];

    function findEquipmentItem(itemId) {
        if (!itemId) {
            return null;
        }

        return equipmentCatalog.find(
            item => normalizeId(item.id) === normalizeId(itemId)
        ) || null;
    }

   function getTargetEquipmentTypes(target) {
    if (target === "full_armor") {
        return ARMOR_TARGETS.map(slot => {
            if (!armor[slot]) {
                return null;
            }

            return slot;
        });
    }

    if (ARMOR_TARGETS.includes(target)) {
        if (!armor[target]) {
            return [];
        }

        return [target];
    }

    if (target === "main_hand") {
        const item = findEquipmentItem(weapon.mainHand);

        if (!item) {
            return [];
        }

        const type = getItemType(item);

        return type ? [type] : [];
    }

    if (target === "off_hand") {
        const item = findEquipmentItem(weapon.offHand);

        if (!item) {
            return [];
        }

        const type = getItemType(item);

        return type ? [type] : [];
    }

    return [];
}

    function isEnchantmentCompatibleWithTarget(
        enchantment,
        target
    ) {
        if (!enchantment?.appliesTo) {
            return false;
        }

        const targetTypes =
            getTargetEquipmentTypes(target);

        if (targetTypes.length === 0) {
            return false;
        }

     if (target === "full_armor") {
    return targetTypes.some(type =>
        enchantment.appliesTo.includes(type)
    );
}

        return targetTypes.every(type =>
            enchantment.appliesTo.includes(type)
        );
    }

    function getTargetOptions() {
        const options = [];

        const hasFullArmor =
            ARMOR_TARGETS.every(
                slot => Boolean(armor[slot])
            );

        if (hasFullArmor) {
            options.push(
                ENCHANTMENT_TARGETS.find(
                    target =>
                        target.id === "full_armor"
                )
            );
        }

        ARMOR_TARGETS.forEach(slot => {
            if (armor[slot]) {
                options.push(
                    ENCHANTMENT_TARGETS.find(
                        target =>
                            target.id === slot
                    )
                );
            }
        });

        if (weapon.mainHand) {
            options.push(
                ENCHANTMENT_TARGETS.find(
                    target =>
                        target.id === "main_hand"
                )
            );
        }

        if (weapon.offHand) {
            options.push(
                ENCHANTMENT_TARGETS.find(
                    target =>
                        target.id === "off_hand"
                )
            );
        }

        return options.filter(Boolean);
    }

const targetOptions = getTargetOptions();

const selectedTargetIsAvailable =
    targetOptions.some(
        target =>
            target.id === selectedEnchantmentTarget
    );

    const effectiveEnchantmentTarget =
    selectedTargetIsAvailable
        ? selectedEnchantmentTarget
        : "";

useEffect(() => {
    if (!effectiveEnchantmentTarget) {
        setSelectedEnchantmentTarget("");
        setSelectedEnchantmentId("");
        setSelectedEnchantmentLevel(1);
        setExtendEnchantmentLevel(false);
        setAllowIncompatibleEnchantments(false);
        setApplyToAllArmor(false);
        setEnchantmentError("");
        return;
    }

    if (
        selectedEnchantmentTarget !==
        effectiveEnchantmentTarget
    ) {
        setSelectedEnchantmentTarget(
            effectiveEnchantmentTarget
        );

        setSelectedEnchantmentId("");
        setSelectedEnchantmentLevel(1);
        setExtendEnchantmentLevel(false);
        setAllowIncompatibleEnchantments(false);
        setApplyToAllArmor(false);
        setEnchantmentError("");
    }
}, [
    effectiveEnchantmentTarget,
    selectedEnchantmentTarget,
]);

const availableEnchantments =
    (catalogs?.enchantments || []).filter(
        enchantment => {
            if (!effectiveEnchantmentTarget) {
                return false;
            }

            const normalizedEnchantmentId =
                normalizeId(enchantment.id);

            // For Full Armor, the actual saved entries are stored per
            // armor slot (helmet/chestplate/leggings/boots). Hide the
            // enchantment only when it is already applied to every
            // equipped armor slot that supports that enchantment.
            // This prevents the dropdown from filling with entries that
            // have already been fully assigned.
            if (effectiveEnchantmentTarget === "full_armor") {
                const equippedArmorTargets =
                    ARMOR_TARGETS.filter(slot => Boolean(armor[slot]));

                const compatibleArmorTargets =
                    equippedArmorTargets.filter(slot =>
                        isEnchantmentCompatibleWithTarget(
                            enchantment,
                            slot
                        )
                    );

                const isFullyApplied =
                    enchantments.some(
                        existing =>
                            normalizeId(existing.id) ===
                                normalizedEnchantmentId &&
                            existing.target === "full_armor"
                    ) ||
                    (compatibleArmorTargets.length > 0 &&
                        compatibleArmorTargets.every(slot =>
                            enchantments.some(
                                existing =>
                                    normalizeId(existing.id) ===
                                        normalizedEnchantmentId &&
                                    existing.target === slot
                            )
                        ));

                if (isFullyApplied) {
                    return false;
                }
            } else {
                const alreadyExists =
                    enchantments.some(
                        existing =>
                            normalizeId(existing.id) ===
                                normalizedEnchantmentId &&
                            existing.target ===
                                effectiveEnchantmentTarget
                    );

                if (alreadyExists) {
                    return false;
                }
            }

            return isEnchantmentCompatibleWithTarget(
                enchantment,
                effectiveEnchantmentTarget
            );
        }
    );
    const selectedEnchantment =
        (catalogs?.enchantments || []).find(
            enchantment =>
                normalizeId(enchantment.id) ===
                normalizeId(selectedEnchantmentId)
        );

    const selectedEnchantmentMaxLevel =
        Math.max(
            1,
            Number(
                selectedEnchantment?.maxLevel
            ) || 1
        );

        const selectedEnchantmentAllowedMaxLevel =
    extendEnchantmentLevel
        ? 255
        : selectedEnchantmentMaxLevel;

 function handleTargetChange(target) {
        setSelectedEnchantmentTarget(target);
        setSelectedEnchantmentId("");
        setSelectedEnchantmentLevel(1);
        setExtendEnchantmentLevel(false);
        setAllowIncompatibleEnchantments(false);
        setApplyToAllArmor(false);
        setEnchantmentError("");
    }

   

function addEnchantment() {
    setEnchantmentError("");

    if (
        !selectedEnchantmentId ||
        !effectiveEnchantmentTarget
    ) {
        return;
    }

    const catalogItem =
        (catalogs?.enchantments || []).find(
            item =>
                normalizeId(item.id) ===
                normalizeId(selectedEnchantmentId)
        );

    if (!catalogItem) {
        setEnchantmentError(
            "Selected enchantment was not found in the catalog."
        );
        return;
    }

    /*
     * Full Armor + Apply to All Armor:
     * apply to every equipped armor slot that
     * is compatible with this enchantment.
     *
     * Otherwise apply only to the selected target.
     */
    const targetsToAdd =
        effectiveEnchantmentTarget === "full_armor" &&
        applyToAllArmor
            ? ARMOR_TARGETS.filter(slot => Boolean(armor[slot]))
            : [effectiveEnchantmentTarget];

    const level = Math.min(
        Math.max(
            1,
            Number(selectedEnchantmentLevel) || 1
        ),
        selectedEnchantmentAllowedMaxLevel
    );

    const additions = [];

    for (const target of targetsToAdd) {
        if (
            !isEnchantmentCompatibleWithTarget(
                catalogItem,
                target
            )
        ) {
            continue;
        }

        const alreadyExists =
            enchantments.some(
                enchantment =>
                    normalizeId(enchantment.id) ===
                        normalizeId(selectedEnchantmentId) &&
                    enchantment.target === target
            );

        if (alreadyExists) {
            continue;
        }

        /*
         * Normal mode:
         * enforce catalog incompatibility rules.
         *
         * Override mode:
         * allow normally incompatible enchantments.
         *
         * Both directions are checked so the catalog
         * does not need to duplicate every pair.
         */
        if (!allowIncompatibleEnchantments) {
            const selectedId =
                normalizeId(selectedEnchantmentId);

            const selectedIncompatible =
                Array.isArray(catalogItem.incompatibleWith)
                    ? catalogItem.incompatibleWith
                    : [];

            const hasConflict =
                [...enchantments, ...additions].some(
                    existing => {
                        if (existing.target !== target) {
                            return false;
                        }

                        const existingId =
                            normalizeId(existing.id);

                        const existingCatalogItem =
                            (catalogs?.enchantments || []).find(
                                item =>
                                    normalizeId(item.id) ===
                                    existingId
                            );

                        const existingIncompatible =
                            Array.isArray(
                                existingCatalogItem?.incompatibleWith
                            )
                                ? existingCatalogItem.incompatibleWith
                                : [];

                        return (
                            selectedIncompatible.some(
                                incompatibleId =>
                                    normalizeId(
                                        incompatibleId
                                    ) === existingId
                            ) ||
                            existingIncompatible.some(
                                incompatibleId =>
                                    normalizeId(
                                        incompatibleId
                                    ) === selectedId
                            )
                        );
                    }
                );

            if (hasConflict) {
                setEnchantmentError(
                    `${catalogItem.name || selectedEnchantmentId} is already incompatible with an existing enchantment.`
                );
                return;
            }
        }

additions.push({
    id: selectedEnchantmentId,
    level: level,
    target: target,
    ...(allowIncompatibleEnchantments
        ? { allowIncompatible: true }
        : {})
});
    }

    if (additions.length === 0) {
        setEnchantmentError(
            "No compatible target is available for this enchantment."
        );
        return;
    }

    updateLoadoutEnchantments([
        ...enchantments,
        ...additions
    ]);

    /*
     * Keep the Target selected so another enchantment
     * can be added immediately.
     */
    setSelectedEnchantmentId("");
    setSelectedEnchantmentLevel(1);
    setExtendEnchantmentLevel(false);
    setAllowIncompatibleEnchantments(false);
    setApplyToAllArmor(false);
    setEnchantmentError("");
}

    function removeEnchantment(id, target) {
        const normalizedId = normalizeId(id);

        updateLoadoutEnchantments(
            enchantments.filter(
                enchantment =>
                    !(
                        normalizeId(enchantment.id) === normalizedId &&
                        enchantment.target === target
                    )
            )
        );

        setEnchantmentError("");
    }

    function getTargetLabel(target) {
        return (
            ENCHANTMENT_TARGETS.find(
                option =>
                    option.id === target
            )?.name ||
            target ||
            "Unknown"
        );
    }

    function formatEffectDuration(ticks) {
    const totalSeconds = Math.ceil(
        Number(ticks || 0) / 20
    );

    if (totalSeconds <= 0) {
        return "0 seconds";
    }

    if (totalSeconds % 3600 === 0) {
        const hours = totalSeconds / 3600;
        return `${hours} hour${hours === 1 ? "" : "s"}`;
    }

    if (totalSeconds % 60 === 0) {
        const minutes = totalSeconds / 60;
        return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    }

    return `${totalSeconds} second${totalSeconds === 1 ? "" : "s"}`;
}

    return (
        <section className="panel mob-loadouts-panel">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="panel-header loadout-header">

                <div>

                    <h2>
                        MOB LOADOUTS
                    </h2>

                    <p>
                        Create complete mob configurations that can
                        later be used by Mob Battle and the Spin Wheel.
                    </p>

                </div>

                {!showLoadoutForm && (
                    <button
                        type="button"
                        className="primary-button"
                        onClick={openNewLoadoutForm}
                    >
                        + Add Loadout
                    </button>
                )}

            </div>

            {/* ==========================================
                LOADOUT FORM
            ========================================== */}

            {showLoadoutForm && (

                <div className="loadout-form">

                    {/* ==========================================
                        FORM HEADER
                    ========================================== */}

                    <div className="loadout-form-title">

                        <div>

                            <h3>
                                {editingLoadoutId !== null
                                    ? "EDIT LOADOUT"
                                    : "NEW LOADOUT"}
                            </h3>

                            <p>
                                Configure the mob, equipment, and quantity.
                            </p>

                        </div>

                    </div>

                    {/* ==========================================
                        BASIC SETTINGS
                    ========================================== */}

                    <div className="loadout-section">

                        <h4>
                            BASIC SETTINGS
                        </h4>

                        <div className="loadout-grid loadout-grid-basic">

                            <div className="field-group">

                                <label>
                                    LOADOUT NAME
                                </label>

                                <input
                                    type="text"
                                    value={loadoutForm.name}
                                    onChange={event =>
                                        updateLoadoutField(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Diamond Zombie Squad"
                                />

                            </div>

                            <div className="field-group">

                                <label>
                                    MOB TYPE
                                </label>

                                <SearchableSelect
                                    value={loadoutForm.mobId}
                                    options={catalogs.mobs}
                                   onChange={value =>
    updateLoadoutField(
        "mobId",
        getSelectValue(value)
    )
}
                                    placeholder="Select mob..."
                                    emptyText="No mobs found."
                                />

                            </div>

                            <div className="field-group quantity-field">

                                <label>
                                    QUANTITY
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={loadoutForm.amount}
                                    onChange={event => {
                                        const value =
                                            Number(
                                                event.target.value
                                            );

                                        updateLoadoutField(
                                            "amount",
                                            Number.isFinite(value) &&
                                            value >= 1
                                                ? Math.floor(value)
                                                : 1
                                        );
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                        ARMOR
                    ========================================== */}

                    <div className="loadout-section">

                        <h4>
                            ARMOR
                        </h4>

                        <div className="loadout-grid loadout-grid-four">

                            <div className="field-group">

                                <label>
                                    HELMET
                                </label>

                                <SearchableSelect
                                    value={armor.helmet}
                                    options={catalogs.armor.filter(
                                        item =>
                                            item.slot === "helmet"
                                    )}
                                   onChange={value =>
    updateLoadoutArmor(
        "helmet",
        getSelectValue(value)
    )
}
                                    placeholder="None"
                                    emptyText="No helmets found."
                                />

                            </div>

                            <div className="field-group">

                                <label>
                                    CHESTPLATE
                                </label>

                                <SearchableSelect
                                    value={armor.chestplate}
                                    options={catalogs.armor.filter(
                                        item =>
                                            item.slot === "chestplate"
                                    )}
onChange={value =>
    updateLoadoutArmor(
        "chestplate",
        getSelectValue(value)
    )
}
                                    placeholder="None"
                                    emptyText="No chestplates found."
                                />

                            </div>

                            <div className="field-group">

                                <label>
                                    LEGGINGS
                                </label>

                                <SearchableSelect
                                    value={armor.leggings}
                                    options={catalogs.armor.filter(
                                        item =>
                                            item.slot === "leggings"
                                    )}
                               onChange={value =>
    updateLoadoutArmor(
        "leggings",
        getSelectValue(value)
    )
}
                                    placeholder="None"
                                    emptyText="No leggings found."
                                />

                            </div>

                            <div className="field-group">

                                <label>
                                    BOOTS
                                </label>

                                <SearchableSelect
                                    value={armor.boots}
                                    options={catalogs.armor.filter(
                                        item =>
                                            item.slot === "boots"
                                    )}
                                    onChange={value =>
                                            updateLoadoutArmor(
                                                "boots",
                                                getSelectValue(value)
                                            )
                                    }
                                    placeholder="None"
                                    emptyText="No boots found."
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                        WEAPONS
                    ========================================== */}

                    <div className="loadout-section">

                        <h4>
                            WEAPONS
                        </h4>

                        <div className="loadout-grid loadout-grid-two">

                            <div className="field-group">

                                <label>
                                    MAIN HAND
                                </label>

                                <SearchableSelect
                                    value={weapon.mainHand}
                                    options={[
                                        ...catalogs.weapons,
                                        ...catalogs.tools
                                    ]}
                                   onChange={value =>
    updateLoadoutWeapon(
        "mainHand",
        getSelectValue(value)
    )
}
                                    placeholder="None"
                                    emptyText="No weapons or tools found."
                                />

                            </div>

                            <div className="field-group">

                                <label>
                                    OFF HAND
                                </label>

                                <SearchableSelect
                                    value={weapon.offHand}
                                    options={[
                                        ...catalogs.weapons,
                                        ...catalogs.items
                                    ]}
                                   onChange={value =>
    updateLoadoutWeapon(
        "offHand",
        getSelectValue(value)
    )
}
                                    placeholder="None"
                                    emptyText="No items found."
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                        ENCHANTMENTS
                    ========================================== */}

                    <div className="loadout-section">

                        <h4>
                            ENCHANTMENTS
                        </h4>

                        <div className="enchantment-controls">

                            <div className="enchantment-control-grid">

                                <div className="field-group enchantment-target-field">
                                    <label>
                                        TARGET
                                    </label>

                                    <select
                                        value={effectiveEnchantmentTarget}
                                        onChange={event =>
                                            handleTargetChange(
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select target...
                                        </option>

                                        {targetOptions.map(target => (
                                            <option
                                                key={target.id}
                                                value={target.id}
                                            >
                                                {target.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group enchantment-select-field">
                                    <label>
                                        ENCHANTMENT
                                    </label>

                                    <SearchableSelect
                                        value={selectedEnchantmentId}
                                        options={availableEnchantments}
                                        onChange={value => {
                                            setSelectedEnchantmentId(
                                                getSelectValue(value)
                                            );
                                            setSelectedEnchantmentLevel(1);
                                            setExtendEnchantmentLevel(false);
                                            setEnchantmentError("");
                                        }}
                                        placeholder={
                                            effectiveEnchantmentTarget
                                                ? "Select enchantment..."
                                                : "Select target first..."
                                        }
                                        emptyText={
                                            effectiveEnchantmentTarget
                                                ? "No compatible enchantments found."
                                                : "Select a target first."
                                        }
                                    />
                                </div>

                            </div>

                            <div className="enchantment-options-section">
                                <div className="enchantment-options-title">
                                    ENCHANTMENT OPTIONS
                                </div>

                                <div className="enchantment-options-grid">

                                    {effectiveEnchantmentTarget === "full_armor" && (
                                        <div
                                            className={`enchantment-option-card ${
                                                applyToAllArmor
                                                    ? "is-active"
                                                    : ""
                                            }`}
                                        >
                                            <label className="checkbox-label enchantment-option-label">
                                                <input
                                                    type="checkbox"
                                                    checked={applyToAllArmor}
                                                    onChange={event =>
                                                        setApplyToAllArmor(
                                                            event.target.checked
                                                        )
                                                    }
                                                />

                                                <span>
                                                    <strong>
                                                        Apply to All Armor
                                                    </strong>
                                                    <small>
                                                        Apply this enchantment
                                                        to every compatible
                                                        equipped armor piece.
                                                    </small>
                                                </span>
                                            </label>
                                        </div>
                                    )}

                                    <div
                                        className={`enchantment-option-card ${
                                            allowIncompatibleEnchantments
                                                ? "is-active"
                                                : ""
                                        }`}
                                    >
                                        <label className="checkbox-label enchantment-option-label">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    allowIncompatibleEnchantments
                                                }
                                                onChange={event => {
                                                    setAllowIncompatibleEnchantments(
                                                        event.target.checked
                                                    );
                                                    setEnchantmentError("");
                                                }}
                                                disabled={
                                                    !effectiveEnchantmentTarget
                                                }
                                            />

                                            <span>
                                                <strong>
                                                    Allow Incompatible Enchantments
                                                </strong>
                                                <small>
                                                    Override normal
                                                    incompatibility rules.
                                                </small>
                                            </span>
                                        </label>
                                    </div>

                                    <div
                                        className={`enchantment-option-card ${
                                            extendEnchantmentLevel
                                                ? "is-active"
                                                : ""
                                        }`}
                                    >
                                        <label className="checkbox-label enchantment-option-label">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    extendEnchantmentLevel
                                                }
                                                onChange={event => {
                                                    const checked =
                                                        event.target.checked;

                                                    setExtendEnchantmentLevel(
                                                        checked
                                                    );

                                                    setSelectedEnchantmentLevel(
                                                        current => {
                                                            const maxLevel =
                                                                checked
                                                                    ? 255
                                                                    : selectedEnchantmentMaxLevel;

                                                            return Math.min(
                                                                Math.max(
                                                                    1,
                                                                    Number(current) || 1
                                                                ),
                                                                maxLevel
                                                            );
                                                        }
                                                    );
                                                }}
                                                disabled={
                                                    !selectedEnchantmentId
                                                }
                                            />

                                            <span>
                                                <strong>
                                                    Extend Level
                                                </strong>
                                                <small>
                                                    Normal max:{" "}
                                                    {selectedEnchantmentMaxLevel}
                                                    {" • "}
                                                    Extended max: 255
                                                </small>
                                            </span>
                                        </label>
                                    </div>

                                </div>
                            </div>

                            <div className="enchantment-level-row">
                                <div className="field-group enchantment-level-field">
                                    <label>
                                        LEVEL
                                    </label>

                                    <select
                                        value={selectedEnchantmentLevel}
                                        onChange={event =>
                                            setSelectedEnchantmentLevel(
                                                Number(event.target.value)
                                            )
                                        }
                                        disabled={!selectedEnchantmentId}
                                    >
                                        {Array.from(
                                            {
                                                length:
                                                    selectedEnchantmentAllowedMaxLevel
                                            },
                                            (_, index) => index + 1
                                        ).map(level => (
                                            <option
                                                key={level}
                                                value={level}
                                            >
                                                Level {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {enchantmentError && (
                                <div
                                    className="enchantment-error"
                                    role="alert"
                                >
                                    {enchantmentError}
                                </div>
                            )}

                            <div className="enchantment-add-button">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={addEnchantment}
                                    disabled={
                                        !selectedEnchantmentId ||
                                        !selectedEnchantmentTarget
                                    }
                                >
                                    + Add Enchantment
                                </button>
                            </div>

                        </div>
                        <div className="enchantment-list">

                            {enchantments.length === 0 ? (

                                <div className="enchantment-empty">
                                    No enchantments added.
                                </div>

                            ) : (

                                enchantments.map(
                                    (enchantment, index) => {

                                        const catalogItem =
                                            catalogs.enchantments.find(
                                                item =>
                                                    normalizeId(
                                                        item.id
                                                    ) ===
                                                    normalizeId(
                                                        enchantment.id
                                                    )
                                            );

                                        return (
                                            <div
                                                className="enchantment-row"
                                                key={`${enchantment.id}-${enchantment.target}-${index}`}
                                            >

                                                <div className="enchantment-info">

                                                    <strong>
                                                        {catalogItem?.name ||
                                                            enchantment.id}
                                                    </strong>

                                                    <span>
                                                        Level{" "}
                                                        {enchantment.level}
                                                    </span>

                                                    <span>
                                                        {getTargetLabel(
                                                            enchantment.target
                                                        )}
                                                    </span>

                                                    {enchantment.allowIncompatible === true && (
                                                        <span>
                                                            Incompatible Override
                                                        </span>
                                                    )}

                                                </div>

                                                <button
                                                    type="button"
                                                    className="danger-button"
                                                    onClick={() =>
                                                        removeEnchantment(
                                                            enchantment.id,
                                                            enchantment.target
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        );
                                    }
                                )

                            )}

                        </div>

                    </div>

                    {/* ==========================================
                        ENABLED
                    ========================================== */}

                    <div className="loadout-enabled">

                        <label className="checkbox-label">

                            <input
                                type="checkbox"
                                checked={
                                    loadoutForm.enabled
                                }
                                onChange={event =>
                                    updateLoadoutField(
                                        "enabled",
                                        event.target.checked
                                    )
                                }
                            />

                            <span>
                                Enabled
                            </span>

                        </label>

                    </div>


                 {/* ==========================================
                       EFFECTS
                   ========================================== */}

                   <MobLoadoutEffects
                       effects={
                           Array.isArray(loadoutForm?.effects)
                               ? loadoutForm.effects
                               : []
                       }
                       effectCatalog={
                           Array.isArray(catalogs?.effects)
                               ? catalogs.effects
                               : []
                       }
                       onChange={updateLoadoutEffects}
                   />

                    {/* ==========================================
                        FORM ACTIONS
                    ========================================== */}

                    <div className="loadout-form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={closeLoadoutForm}
                            disabled={loadoutSaving}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={saveLoadout}
                            disabled={loadoutSaving}
                        >
                            {loadoutSaving
                                ? "Saving..."
                                : editingLoadoutId !== null
                                    ? "Save Changes"
                                    : "Create Loadout"}
                        </button>

                    </div>

                </div>

            )}

        {/*
    ==========================================
    LOADOUT LIST
    ==========================================
*/}

<div className="loadout-list">

    <div className="loadout-list-header">

        <div>

            <h3>
                YOUR LOADOUTS
            </h3>

            <span>
                {loadouts.length}{" "}
                {loadouts.length === 1
                    ? "loadout"
                    : "loadouts"}
            </span>

        </div>

    </div>


    {loadoutsLoading ? (

        <div className="loadout-empty-state">

            <p>
                Loading loadouts...
            </p>

        </div>

    ) : loadouts.length === 0 ? (

        <div className="loadout-empty-state">

            <div className="empty-icon">
                +
            </div>

            <h3>
                No mob loadouts yet.
            </h3>

            <p>
                Click{" "}
                <strong>
                    + Add Loadout
                </strong>{" "}
                to create your first mob configuration.
            </p>

        </div>

    ) : (

        <div className="loadout-cards">

            {loadouts.map(loadout => {

                const mob =
                    catalogs.mobs.find(
                        item =>
                            normalizeId(item.id) ===
                            normalizeId(loadout.mobId)
                    );


                const armorPieces = [
                    loadout.armor?.helmet,
                    loadout.armor?.chestplate,
                    loadout.armor?.leggings,
                    loadout.armor?.boots
                ].filter(Boolean).length;


                const equipmentCatalog = [
                    ...catalogs.weapons,
                    ...catalogs.tools,
                    ...catalogs.items
                ];


                const mainHand =
                    equipmentCatalog.find(
                        item =>
                            normalizeId(item.id) ===
                            normalizeId(
                                loadout.weapon?.mainHand
                            )
                    );


                const offHand =
                    equipmentCatalog.find(
                        item =>
                            normalizeId(item.id) ===
                            normalizeId(
                                loadout.weapon?.offHand
                            )
                    );


                const loadoutEnchantments =
                    Array.isArray(loadout.enchantments)
                        ? loadout.enchantments
                        : [];


                const loadoutEffects =
                    Array.isArray(loadout.effects)
                        ? loadout.effects
                        : [];


                return (

                    <div
                        className={`loadout-card ${
                            loadout.enabled
                                ? ""
                                : "loadout-disabled"
                        }`}
                        key={loadout.id}
                    >

                        {/* ==========================================
                            MAIN LOADOUT CONTENT
                        ========================================== */}

                        <div className="loadout-card-main">


                            {/* ==========================================
                                TITLE
                            ========================================== */}

                            <div className="loadout-card-title">

                                <h3>
                                    {loadout.name}
                                </h3>

                                <span
                                    className={`status-badge ${
                                        loadout.enabled
                                            ? "status-on"
                                            : "status-off"
                                    }`}
                                >
                                    {loadout.enabled
                                        ? "ON"
                                        : "OFF"}
                                </span>

                            </div>


                            {/* ==========================================
                                MOB + QUANTITY
                            ========================================== */}

                            <div className="loadout-card-mob">

                                {mob?.name ||
                                    loadout.mobId ||
                                    "Unknown Mob"}

                                <span>
                                    × {loadout.amount}
                                </span>

                            </div>


                            {/* ==========================================
                                LOADOUT DETAILS
                            ========================================== */}

                            <div className="loadout-card-details">


                                {/* ======================================
                                    ARMOR
                                ====================================== */}

                                <div>

                                    <span>
                                        ARMOR
                                    </span>

                                    <strong>
                                        {armorPieces === 0
                                            ? "None"
                                            : `${armorPieces} piece${
                                                armorPieces === 1
                                                    ? ""
                                                    : "s"
                                            }`}
                                    </strong>

                                </div>


                                {/* ======================================
                                    MAIN HAND
                                ====================================== */}

                                <div>

                                    <span>
                                        MAIN HAND
                                    </span>

                                    <strong>
                                        {mainHand?.name ||
                                            "None"}
                                    </strong>

                                </div>


                                {/* ======================================
                                    OFF HAND
                                ====================================== */}

                                <div>

                                    <span>
                                        OFF HAND
                                    </span>

                                    <strong>
                                        {offHand?.name ||
                                            "None"}
                                    </strong>

                                </div>


                                {/* ======================================
                                    ENCHANTMENTS
                                ====================================== */}

                                <div className="loadout-card-enchantments">

                                    <span>
                                        ENCHANTMENTS
                                    </span>

                                    <strong>

                                        {loadoutEnchantments.length === 0
                                            ? (
                                                "None"
                                            )
                                            : (
                                                loadoutEnchantments.map(
                                                    (
                                                        enchantment,
                                                        index
                                                    ) => {

                                                        const catalogItem =
                                                            (
                                                                catalogs.enchantments ||
                                                                []
                                                            ).find(
                                                                item =>
                                                                    normalizeId(
                                                                        item.id
                                                                    ) ===
                                                                    normalizeId(
                                                                        enchantment.id
                                                                    )
                                                            );


                                                        return (

                                                            <span
                                                                key={
                                                                    `${enchantment.id}-${enchantment.target}-${index}`
                                                                }
                                                                className="enchantment-summary"
                                                            >

                                                                {index > 0 &&
                                                                    " • "}

                                                                {catalogItem?.name ||
                                                                    enchantment.id}

                                                                {" "}

                                                                {enchantment.level}

                                                                {" — "}

                                                                {getTargetLabel(
                                                                    enchantment.target
                                                                )}

                                                            </span>

                                                        );

                                                    }
                                                )
                                            )}

                                    </strong>

                                </div>


                                {/* ======================================
                                    EFFECTS
                                ====================================== */}

                                <div className="loadout-card-effects">

                                    <span>
                                        EFFECTS
                                    </span>

                                    <strong>

                                        {loadoutEffects.length === 0
                                            ? (
                                                "None"
                                            )
                                            : (
                                                loadoutEffects.map(
                                                    (
                                                        effect,
                                                        index
                                                    ) => {

                                                        const catalogItem =
                                                            (
                                                                catalogs.effects ||
                                                                []
                                                            ).find(
                                                                item =>
                                                                    normalizeId(
                                                                        item.id
                                                                    ) ===
                                                                    normalizeId(
                                                                        effect.id
                                                                    )
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
                                                            totalSeconds >=
                                                            3600
                                                        ) {

                                                            const hours =
                                                                Math.floor(
                                                                    totalSeconds /
                                                                    3600
                                                                );

                                                            durationText =
                                                                `${hours} hour${
                                                                    hours === 1
                                                                        ? ""
                                                                        : "s"
                                                                }`;

                                                        } else if (
                                                            totalSeconds >=
                                                            60
                                                        ) {

                                                            const minutes =
                                                                Math.floor(
                                                                    totalSeconds /
                                                                    60
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

                                                            <span
                                                                key={
                                                                    `${effect.id}-${index}`
                                                                }
                                                                className="effect-summary"
                                                            >

                                                                {index > 0 &&
                                                                    " • "}

                                                                {catalogItem?.name ||
                                                                    effect.id}

                                                                {" "}

                                                                {level}

                                                                {" — "}

                                                                {durationText}

                                                            </span>

                                                        );

                                                    }
                                                )
                                            )}

                                    </strong>

                                </div>


                            </div>


                        </div>


                        {/* ==========================================
                            ACTIONS
                        ========================================== */}

                        <div className="loadout-card-actions">

                            <button
                                type="button"
                                className={`status-toggle ${
                                    loadout.enabled
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    toggleLoadoutEnabled(
                                        loadout
                                    )
                                }
                            >
                                {loadout.enabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </button>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    openEditLoadoutForm(
                                        loadout
                                    )
                                }
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                    deleteLoadout(
                                        loadout.id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>


                    </div>

                );

            })}

        </div>

    )}


</div>
                     

                 

        </section>)}

           

      
