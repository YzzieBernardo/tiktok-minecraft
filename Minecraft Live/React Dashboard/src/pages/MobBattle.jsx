import { useEffect, useState } from "react";
import "../styles/mobBattle.css";

import MobBattleControl from "./mobBattle/MobBattleControl";
import MobNameSource from "./mobBattle/MobNameSource";
import CatalogManagement from "./mobBattle/CatalogManagement";
import CatalogItemModal from "./mobBattle/CatalogItemModal";
import MobLoadouts from "./mobBattle/MobLoadouts";
import MobLoadoutSpawner from "./mobBattle/MobLoadoutSpawner";
import MobLoadoutEffects from "./mobBattle/MobLoadoutEffects";
import MobBattlefield from "./mobBattle/MobBattlefield";
const API_URL = "http://localhost:3001";

// ==========================================
// CATALOG DEFINITIONS
// ==========================================

const catalogDefinitions = [
    {
        key: "mobs",
        label: "Mobs",
    },
    {
        key: "armor",
        label: "Armor",
    },
    {
        key: "weapons",
        label: "Weapons",
    },
    {
        key: "tools",
        label: "Tools",
    },
    {
        key: "items",
        label: "Items",
    },
    {
        key: "enchantments",
        label: "Enchantments",
    },

    {
    key: "effects",
    label: "Effects",
},
];

// ==========================================
// EMPTY LOADOUT
// ==========================================

const emptyLoadout = {
    name: "",
    mobId: "",
    amount: 1,

    armor: {
        helmet: "",
        chestplate: "",
        leggings: "",
        boots: "",
    },

    weapon: {
        mainHand: "",
        offHand: "",
    },

    enchantments: [],

    effects: [],

    enabled: true,
};

// ==========================================
// EMPTY CATALOG FORM
// ==========================================

function createEmptyCatalogForm(catalog = "mobs") {
    return {
        catalog,
        id: "",
        name: "",
        slot: "",
        type: "",
        maxLevel: 1,
    };
}

// ==========================================
// MOB BATTLE PAGE
// ==========================================

export default function MobBattle() {

    // ==========================================
    // MOB BATTLE CONTROL
    // ==========================================

    const [running, setRunning] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // ==========================================
    // EXISTING MOB NAME SYSTEM
    // ==========================================

    const [teamANames, setTeamANames] = useState([]);
    const [teamBNames, setTeamBNames] = useState([]);

    const [newTeamAName, setNewTeamAName] = useState("");
    const [newTeamBName, setNewTeamBName] = useState("");

    // ==========================================
    // MOB NAME MODE
    // ==========================================

    const [nameMode, setNameMode] = useState("tiktok");
    const [specificNameId, setSpecificNameId] = useState("");
    const [nameModeLoading, setNameModeLoading] = useState(false);

    // ==========================================
    // MOB LOADOUTS
    // ==========================================

    const [loadouts, setLoadouts] = useState([]);
    const [loadoutsLoading, setLoadoutsLoading] = useState(false);
    const [loadoutSaving, setLoadoutSaving] = useState(false);

    const [editingLoadoutId, setEditingLoadoutId] = useState(null);
    const [showLoadoutForm, setShowLoadoutForm] = useState(false);

const [loadoutForm, setLoadoutForm] = useState({
    ...emptyLoadout,

    armor: {
        ...emptyLoadout.armor,
    },

    weapon: {
        ...emptyLoadout.weapon,
    },

    enchantments: [],

    effects: [],
});

    // ==========================================
    // CATALOGS
    // ==========================================

    const [catalogs, setCatalogs] = useState({
        mobs: [],
        armor: [],
        weapons: [],
        tools: [],
        items: [],
        enchantments: [],
        effects: [],
    });

    const [openCatalog, setOpenCatalog] = useState(null);
    const [catalogSearch, setCatalogSearch] = useState({});
    const [catalogsLoading, setCatalogsLoading] = useState(false);

    // ==========================================
    // CATALOG MODAL
    // ==========================================

    const [catalogModalOpen, setCatalogModalOpen] = useState(false);

    const [editingCatalogItem, setEditingCatalogItem] =
        useState(null);

    const [catalogForm, setCatalogForm] = useState(
        createEmptyCatalogForm()
    );

    const [catalogSaving, setCatalogSaving] = useState(false);

    // ==========================================
    // LOAD MOB NAMES
    // ==========================================

    useEffect(() => {

        async function loadMobNames() {

            try {

                const response = await fetch(
                    `${API_URL}/api/mob-battle/names`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Failed to load mob names"
                    );
                }

                const names = Array.isArray(data.names)
                    ? data.names
                    : [];

                setTeamANames(
                    names.filter(
                        item => item.team === "A"
                    )
                );

                setTeamBNames(
                    names.filter(
                        item => item.team === "B"
                    )
                );

            } catch (error) {

                console.error(
                    "Mob Battle names error:",
                    error
                );

                setError(error.message);

            }

        }

        loadMobNames();

    }, []);

    // ==========================================
    // LOAD MOB NAME MODE
    // ==========================================

    useEffect(() => {

        async function loadNameMode() {

            try {

                const response = await fetch(
                    `${API_URL}/api/mob-battle/name-mode`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Failed to load mob name mode"
                    );
                }

                setNameMode(
                    data.nameMode || "tiktok"
                );

                setSpecificNameId(
                    data.specificNameId ?? ""
                );

            } catch (error) {

                console.error(
                    "Mob Battle name mode error:",
                    error
                );

                setError(error.message);

            }

        }

        loadNameMode();

    }, []);

    // ==========================================
    // LOAD MOB BATTLE STATUS
    // ==========================================

    useEffect(() => {

        async function loadStatus() {

            try {

                const response = await fetch(
                    `${API_URL}/api/mob-battle/status`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Failed to load Mob Battle status"
                    );
                }

                setRunning(
                    Boolean(data.running)
                );

            } catch (error) {

                console.error(
                    "Mob Battle status error:",
                    error
                );

                setError(error.message);

            }

        }

        loadStatus();

    }, []);

  useEffect(() => {

    async function loadMobBattleData() {

        setLoadoutsLoading(true);
        setCatalogsLoading(true);
        setError("");

        try {

            const loadoutsPromise = fetch(
                `${API_URL}/api/mob-battle/loadouts`
            ).then(async response => {

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Failed to load mob loadouts"
                    );
                }

                return data;

            });

            const catalogsPromise =
                fetchAllCatalogs();

            const [
                loadoutsData,
                nextCatalogs
            ] = await Promise.all([
                loadoutsPromise,
                catalogsPromise
            ]);

            // ------------------------------------------
            // CATALOGS FIRST
            // ------------------------------------------

            setCatalogs(nextCatalogs);

            // ------------------------------------------
            // ONLY ACCEPT VALID LOADOUT OBJECTS
            // ------------------------------------------

const nextLoadouts = Array.isArray(loadoutsData.loadouts)
    ? loadoutsData.loadouts
    : [];

console.log(
    "Mob Battle UI: Loadouts received from API:",
    JSON.stringify(nextLoadouts, null, 2)
);

setLoadouts(nextLoadouts);
        } catch (error) {

            console.error(
                "Mob Battle data error:",
                error
            );

            setError(
                error.message ||
                "Failed to load Mob Battle data"
            );

        } finally {

            setLoadoutsLoading(false);
            setCatalogsLoading(false);

        }

    }

    loadMobBattleData();

}, []);
    // ==========================================
    // FETCH ALL CATALOGS
    // ==========================================

    async function fetchAllCatalogs() {

        const results = await Promise.all(
            catalogDefinitions.map(
                async catalog => {

                    const response = await fetch(
                        `${API_URL}/api/mob-battle/catalog/${catalog.key}`
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.error ||
                            `Failed to load ${catalog.label} catalog`
                        );
                    }

                    return [
                        catalog.key,
                        Array.isArray(data.items)
                            ? data.items
                            : [],
                    ];

                }
            )
        );

        return Object.fromEntries(results);
    }

    // ==========================================
    // LOAD / REFRESH CATALOGS
    // ==========================================

    async function refreshCatalogs() {

        setCatalogsLoading(true);
        setError("");

        try {

            const nextCatalogs =
                await fetchAllCatalogs();

            setCatalogs(nextCatalogs);

        } catch (error) {

            console.error(
                "Refresh catalogs error:",
                error
            );

            setError(error.message);

        } finally {

            setCatalogsLoading(false);

        }
    }


    // ==========================================
    // TOGGLE CATALOG
    // ==========================================

    function toggleCatalog(catalogName) {

        setOpenCatalog(previous =>
            previous === catalogName
                ? null
                : catalogName
        );

    }

    // ==========================================
    // FILTER CATALOG ITEMS
    // ==========================================

    function getFilteredCatalogItems(catalogName) {

        const items =
            catalogs[catalogName] || [];

        const search =
            (
                catalogSearch[catalogName] ||
                ""
            )
                .trim()
                .toLowerCase();

        if (!search) {
            return items;
        }

        return items.filter(item =>
            String(item.name || "")
                .toLowerCase()
                .includes(search) ||
            String(item.id || "")
                .toLowerCase()
                .includes(search)
        );
    }

    // ==========================================
    // OPEN ADD CATALOG ITEM
    // ==========================================

    function openCatalogAdd(catalogName = null) {

        const targetCatalog =
            catalogName ||
            openCatalog ||
            "mobs";

        setEditingCatalogItem(null);

        setCatalogForm(
            createEmptyCatalogForm(
                targetCatalog
            )
        );

        setCatalogModalOpen(true);

    }

    // ==========================================
    // OPEN EDIT CATALOG ITEM
    // ==========================================

    function openCatalogEdit(
        catalogName,
        item
    ) {

        setEditingCatalogItem({
            catalog: catalogName,
            originalId: item.id,
        });

        setCatalogForm({

            catalog: catalogName,

            id:
                item.id ||
                "",

            name:
                item.name ||
                "",

            slot:
                item.slot ||
                "",

            type:
                item.type ||
                "",

            maxLevel:
                item.maxLevel ??
                1,

        });

        setCatalogModalOpen(true);

    }

    // ==========================================
    // CLOSE CATALOG MODAL
    // ==========================================

    function closeCatalogModal() {

        if (catalogSaving) {
            return;
        }

        setCatalogModalOpen(false);

        setEditingCatalogItem(null);

        setCatalogForm(
            createEmptyCatalogForm()
        );

    }

    // ==========================================
    // SAVE CATALOG ITEM
    // ==========================================

    async function saveCatalogItem() {

        const catalog =
            catalogForm.catalog;

        const id =
            catalogForm.id.trim();

        const name =
            catalogForm.name.trim();

        if (!id) {
            setError(
                "Catalog ID is required."
            );
            return;
        }

        if (!name) {
            setError(
                "Display name is required."
            );
            return;
        }

        setCatalogSaving(true);
        setError("");

        try {

            const isEditing =
                editingCatalogItem !== null;

            const originalId =
                editingCatalogItem?.originalId;

            const url = isEditing
                ? `${API_URL}/api/mob-battle/catalog/${catalog}/${encodeURIComponent(originalId)}`
                : `${API_URL}/api/mob-battle/catalog/${catalog}`;

            const payload = {
                id,
                name,
            };

            if (
                catalog === "armor" &&
                catalogForm.slot.trim()
            ) {
                payload.slot =
                    catalogForm.slot.trim();
            }

            if (
                (
                    catalog === "weapons" ||
                    catalog === "tools"
                ) &&
                catalogForm.type.trim()
            ) {
                payload.type =
                    catalogForm.type.trim();
            }

            if (
                catalog === "enchantments"
            ) {

                payload.maxLevel =
                    Math.max(
                        1,
                        Math.floor(
                            Number(
                                catalogForm.maxLevel
                            ) || 1
                        )
                    );

            }

            const response =
                await fetch(
                    url,
                    {
                        method:
                            isEditing
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to save catalog item"
                );
            }

            await refreshCatalogs();

            setCatalogModalOpen(false);
            setEditingCatalogItem(null);
            setCatalogForm(
                createEmptyCatalogForm()
            );

        } catch (error) {

            console.error(
                "Save catalog item error:",
                error
            );

            setError(error.message);

        } finally {

            setCatalogSaving(false);

        }
    }

    // ==========================================
    // DELETE CATALOG ITEM
    // ==========================================

    async function deleteCatalogItem(
        catalogName,
        id
    ) {

        const confirmed =
            window.confirm(
                `Delete "${id}" from the ${catalogName} catalog?`
            );

        if (!confirmed) {
            return;
        }

        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/catalog/${catalogName}/${encodeURIComponent(id)}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to delete catalog item"
                );
            }

            await refreshCatalogs();

        } catch (error) {

            console.error(
                "Delete catalog item error:",
                error
            );

            setError(error.message);

        }
    }

    // ==========================================
    // ADD TEAM B NAME
    // ==========================================

    async function addTeamBName() {

        const name =
            newTeamBName.trim();

        if (!name) {
            setError(
                "Team B name is required."
            );
            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/names`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                team: "B",
                                name,
                            }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to save Team B name"
                );
            }

            setTeamBNames(
                previous => [
                    ...previous,
                    data.name,
                ]
            );

            setNewTeamBName("");
            setError("");

        } catch (error) {

            console.error(
                "Team B name error:",
                error
            );

            setError(error.message);

        }
    }

    // ==========================================
    // ADD TEAM A NAME
    // ==========================================

    async function addTeamAName() {

        const name =
            newTeamAName.trim();

        if (!name) {
            setError(
                "Team A name is required."
            );
            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/names`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                team: "A",
                                name,
                            }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to save Team A name"
                );
            }

            setTeamANames(
                previous => [
                    ...previous,
                    data.name,
                ]
            );

            setNewTeamAName("");
            setError("");

        } catch (error) {

            console.error(
                "Team A name error:",
                error
            );

            setError(error.message);

        }
    }

    // ==========================================
    // SAVED MOB NAME CRUD
    // ==========================================

    async function addMobName(data) {

        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/names`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(data),
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Failed to create mob name"
                );

            }


            const saved =
                result.name;


            if (saved.team === "A") {

                setTeamANames(
                    previous => [
                        ...previous,
                        saved,
                    ]
                );

            } else {

                setTeamBNames(
                    previous => [
                        ...previous,
                        saved,
                    ]
                );

            }


            return saved;

        } catch (error) {

            console.error(
                "Create mob name error:",
                error
            );

            setError(
                error.message ||
                "Failed to create mob name"
            );

            throw error;

        }

    }


    // ==========================================
    // UPDATE SAVED MOB NAME
    // ==========================================

    async function updateMobName(
        id,
        data
    ) {

        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/names/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(data),
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Failed to update mob name"
                );

            }


            const updated =
                result.name;


            // ==========================================
            // UPDATE BOTH TEAM LISTS
            // ==========================================

            setTeamANames(
                previous =>
                    previous
                        .filter(
                            item =>
                                Number(item.id) !==
                                Number(id)
                        )
                        .concat(
                            updated.team === "A"
                                ? [updated]
                                : []
                        )
            );


            setTeamBNames(
                previous =>
                    previous
                        .filter(
                            item =>
                                Number(item.id) !==
                                Number(id)
                        )
                        .concat(
                            updated.team === "B"
                                ? [updated]
                                : []
                        )
            );


            // ==========================================
            // FIX SPECIFIC NAME IF NEEDED
            // ==========================================

            if (
                Number(specificNameId) ===
                Number(id)
            ) {

                if (updated.team !== "A" &&
                    updated.team !== "B") {

                    setSpecificNameId("");

                }

            }


            return updated;

        } catch (error) {

            console.error(
                "Update mob name error:",
                error
            );

            setError(
                error.message ||
                "Failed to update mob name"
            );

            throw error;

        }

    }


    // ==========================================
    // DELETE SAVED MOB NAME
    // ==========================================

    async function deleteMobName(id) {

        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/names/${id}`,
                    {
                        method: "DELETE",
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Failed to delete mob name"
                );

            }


            // ==========================================
            // REMOVE FROM TEAM A
            // ==========================================

            setTeamANames(
                previous =>
                    previous.filter(
                        item =>
                            Number(item.id) !==
                            Number(id)
                    )
            );


            // ==========================================
            // REMOVE FROM TEAM B
            // ==========================================

            setTeamBNames(
                previous =>
                    previous.filter(
                        item =>
                            Number(item.id) !==
                            Number(id)
                    )
            );


            // ==========================================
            // CLEAR SPECIFIC NAME IF DELETED
            // ==========================================

            if (
                Number(specificNameId) ===
                Number(id)
            ) {

                setSpecificNameId("");

                if (nameMode === "specific") {

                    await changeNameMode(
                        "tiktok"
                    );

                }

            }

        } catch (error) {

            console.error(
                "Delete mob name error:",
                error
            );

            setError(
                error.message ||
                "Failed to delete mob name"
            );

            throw error;

        }

    }


    // ==========================================
    // ALL CUSTOM NAMES
    // ==========================================

    const allCustomNames = [
        ...teamANames,
        ...teamBNames,
    ];

    // ==========================================
    // CHANGE MOB NAME MODE
    // ==========================================

    async function changeNameMode(
        newMode,
        newSpecificId = null
    ) {

        setNameModeLoading(true);
        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/name-mode`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                nameMode:
                                    newMode,

                                specificNameId:
                                    newMode === "specific"
                                        ? Number(
                                            newSpecificId
                                        )
                                        : null,
                            }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to change mob name mode"
                );
            }

            setNameMode(
                data.nameMode
            );

            setSpecificNameId(
                data.specificNameId ?? ""
            );

        } catch (error) {

            console.error(
                "Mob Battle name mode error:",
                error
            );

            setError(error.message);

        } finally {

            setNameModeLoading(false);

        }
    }

    // ==========================================
    // SELECT SPECIFIC NAME
    // ==========================================

    async function selectSpecificName(event) {

        const id =
            Number(
                event.target.value
            );

        if (!id) {
            return;
        }

        await changeNameMode(
            "specific",
            id
        );
    }

    // ==========================================
    // TOGGLE MOB BATTLE
    // ==========================================

    async function toggleMobBattle() {

        const enabled =
            !running;

        setLoading(true);
        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/toggle`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                enabled,
                            }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Mob Battle toggle failed"
                );
            }

            setRunning(
                Boolean(data.running)
            );

        } catch (error) {

            console.error(
                "Mob Battle toggle error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }

    // ==========================================
    // OPEN NEW LOADOUT FORM
    // ==========================================

    function openNewLoadoutForm() {

        setEditingLoadoutId(null);

        setLoadoutForm({
            ...emptyLoadout,

            armor: {
                ...emptyLoadout.armor,
            },

            weapon: {
                ...emptyLoadout.weapon,
            },

            enchantments: [],
            effects: [],
        });

        setShowLoadoutForm(true);
    }

    // ==========================================
    // OPEN EDIT LOADOUT FORM
    // ==========================================

    function openEditLoadoutForm(loadout) {

        setEditingLoadoutId(
            loadout.id
        );

        setLoadoutForm({

            ...emptyLoadout,

            ...loadout,

            armor: {
                ...emptyLoadout.armor,
                ...(loadout.armor || {}),
            },

            weapon: {
                ...emptyLoadout.weapon,
                ...(loadout.weapon || {}),
            },

            enchantments:
                Array.isArray(
                    loadout.enchantments
                )
                    ? loadout.enchantments
                    : [],
                    effects:
    Array.isArray(
        loadout.effects
    )
        ? loadout.effects
        : [],
        });

        setShowLoadoutForm(true);
    }

    // ==========================================
    // CLOSE LOADOUT FORM
    // ==========================================

  function closeLoadoutForm() {

    setShowLoadoutForm(false);
    setEditingLoadoutId(null);

}

    // ==========================================
    // UPDATE LOADOUT FIELD
    // ==========================================

    function updateLoadoutField(
        field,
        value
    ) {

        setLoadoutForm(previous => ({
            ...previous,
            [field]: value,
        }));

    }

    // ==========================================
    // UPDATE ARMOR
    // ==========================================

    function updateLoadoutArmor(
        slot,
        value
    ) {

        setLoadoutForm(previous => ({
            ...previous,

            armor: {
                ...previous.armor,
                [slot]: value,
            },
        }));

    }

    // ==========================================
    // UPDATE WEAPON
    // ==========================================

    function updateLoadoutWeapon(
        slot,
        value
    ) {

        setLoadoutForm(previous => ({
            ...previous,

            weapon: {
                ...previous.weapon,
                [slot]: value,
            },
        }));

    }

    

// ==========================================
// UPDATE ENCHANTMENTS
// ==========================================

function updateLoadoutEnchantments(
    enchantments
) {

    setLoadoutForm(previous => ({
        ...previous,
        enchantments: Array.isArray(enchantments)
            ? enchantments
            : [],
    }));

}

// ==========================================
// UPDATE EFFECTS
// ==========================================

function updateLoadoutEffects(effects) {

    setLoadoutForm(previous => ({
        ...previous,

        effects:
            Array.isArray(effects)
                ? effects
                : [],
    }));

}
    // ==========================================
    // SAVE LOADOUT
    // ==========================================

    async function saveLoadout() {

        if (!loadoutForm.name.trim()) {
            setError(
                "Loadout name is required."
            );
            return;
        }

        if (!loadoutForm.mobId) {
            setError(
                "Mob type is required."
            );
            return;
        }

        setLoadoutSaving(true);
        setError("");

        try {

            const isEditing =
                editingLoadoutId !== null;

            const url = isEditing
                ? `${API_URL}/api/mob-battle/loadouts/${editingLoadoutId}`
                : `${API_URL}/api/mob-battle/loadouts`;

            const payload = {
                ...loadoutForm,

                name:
                    loadoutForm.name.trim(),

                mobId:
                    loadoutForm.mobId,

                amount:
                    Math.max(
                        1,
                        Math.floor(
                            Number(
                                loadoutForm.amount
                            ) || 1
                        )
                    ),

                armor: {
                    ...emptyLoadout.armor,
                    ...(loadoutForm.armor || {}),
                },

                weapon: {
                    ...emptyLoadout.weapon,
                    ...(loadoutForm.weapon || {}),
                },

                enchantments:
                    Array.isArray(
                        loadoutForm.enchantments
                    )
                        ? loadoutForm.enchantments
                        : [],

                        effects:
    Array.isArray(
        loadoutForm.effects
    )
        ? loadoutForm.effects
        : [],

                enabled:
                    Boolean(
                        loadoutForm.enabled
                    ),
            };

            const response =
                await fetch(
                    url,
                    {
                        method:
                            isEditing
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to save loadout"
                );
            }

           const savedLoadout = data.loadout;

if (!savedLoadout) {
    throw new Error(
        "Loadout saved, but server returned no loadout."
    );
}

if (isEditing) {
    setLoadouts(previous =>
        previous.map(item =>
            Number(item.id) === Number(editingLoadoutId)
                ? savedLoadout
                : item
        )
    );
} else {
    setLoadouts(previous => [
        ...previous,
        savedLoadout
    ]);
}

closeLoadoutForm();

        } catch (error) {

            console.error(
                "Save loadout error:",
                error
            );

            setError(
                error.message ||
                "Failed to save loadout"
            );

        } finally {

            setLoadoutSaving(false);

        }
    }

    // ==========================================
    // DELETE LOADOUT
    // ==========================================

    async function deleteLoadout(id) {

        const confirmed =
            window.confirm(
                "Delete this mob loadout?"
            );

        if (!confirmed) {
            return;
        }

        setError("");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/loadouts/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to delete loadout"
                );
            }

            setLoadouts(previous =>
                previous.filter(
                    item =>
                        Number(item.id) !==
                        Number(id)
                )
            );

        } catch (error) {

            console.error(
                "Delete loadout error:",
                error
            );

            setError(error.message);

        }
    }

    // ==========================================
    // TOGGLE LOADOUT ENABLED
    // ==========================================

    async function toggleLoadoutEnabled(
        loadout
    ) {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/mob-battle/loadouts/${loadout.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                enabled:
                                    !loadout.enabled,
                            }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to update loadout status"
                );
            }

            setLoadouts(previous =>
                previous.map(item =>
                    Number(item.id) ===
                    Number(loadout.id)
                        ? data.loadout
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Toggle loadout error:",
                error
            );

            setError(error.message);

        }
    }

    // ==========================================
    // RENDER
    // ==========================================

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
                ERROR
            ========================================== */}

            {error && (
                <div className="minecraft-error">
                    {error}
                </div>
            )}

            {/* ==========================================
                MOB BATTLE CONTROL
            ========================================== */}

            <MobBattleControl
                running={running}
                loading={loading}
                toggleMobBattle={toggleMobBattle}
            />

            {/* ==========================================
                MOB NAME SOURCE
            ========================================== */}

      <MobNameSource
    nameMode={nameMode}
    specificNameId={specificNameId}
    allCustomNames={allCustomNames}
    nameModeLoading={nameModeLoading}
    changeNameMode={changeNameMode}
    selectSpecificName={selectSpecificName}
    addMobName={addMobName}
    updateMobName={updateMobName}
    deleteMobName={deleteMobName}
/>

            {/* ==========================================
                MOB LOADOUTS
            ========================================== */}

           <MobLoadouts
    loadouts={loadouts}
    catalogs={catalogs}
    loadoutsLoading={loadoutsLoading}
    loadoutSaving={loadoutSaving}
    editingLoadoutId={editingLoadoutId}
    showLoadoutForm={showLoadoutForm}
    loadoutForm={loadoutForm}
    openNewLoadoutForm={openNewLoadoutForm}
    openEditLoadoutForm={openEditLoadoutForm}
    closeLoadoutForm={closeLoadoutForm}
    updateLoadoutField={updateLoadoutField}
    updateLoadoutArmor={updateLoadoutArmor}
    updateLoadoutWeapon={updateLoadoutWeapon}
    updateLoadoutEnchantments={
        updateLoadoutEnchantments
    }
    updateLoadoutEffects={
    updateLoadoutEffects
}
    saveLoadout={saveLoadout}
    deleteLoadout={deleteLoadout}
    toggleLoadoutEnabled={toggleLoadoutEnabled}
/>
<MobBattlefield
    loadouts={loadouts}
/>

            {/* ==========================================
                CATALOG MANAGEMENT
            ========================================== */}

            <CatalogManagement
                catalogs={catalogs}
                catalogDefinitions={catalogDefinitions}
                openCatalog={openCatalog}
                catalogSearch={catalogSearch}
                catalogsLoading={catalogsLoading}
                toggleCatalog={toggleCatalog}
                setCatalogSearch={setCatalogSearch}
                getFilteredCatalogItems={
                    getFilteredCatalogItems
                }
                refreshCatalogs={refreshCatalogs}
                openCatalogAdd={openCatalogAdd}
                openCatalogEdit={openCatalogEdit}
                deleteCatalogItem={deleteCatalogItem}
            />

            {/* ==========================================
                CATALOG ITEM MODAL
            ========================================== */}

            <CatalogItemModal
                open={catalogModalOpen}
                editingItem={editingCatalogItem}
                form={catalogForm}
                catalogDefinitions={catalogDefinitions}
                setForm={setCatalogForm}
                onClose={closeCatalogModal}
                onSave={saveCatalogItem}
                saving={catalogSaving}
            />

        </div>
    );
}

