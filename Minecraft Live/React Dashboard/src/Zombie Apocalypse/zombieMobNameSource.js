import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(
    __dirname,
    'zombieMobNameSource.json'
);

const defaultData = {
    source: 'tiktok',
    selectedNameId: null,
    names: [],
};

// ==========================================
// ENSURE JSON FILE EXISTS
// ==========================================

function ensureFileExists() {
    if (fs.existsSync(FILE_PATH)) {
        return;
    }

    fs.writeFileSync(
        FILE_PATH,
        JSON.stringify(
            defaultData,
            null,
            4
        ),
        'utf8'
    );

    console.log(
        'Created zombieMobNameSource.json'
    );
}

// ==========================================
// LOAD DATA
// ==========================================

function loadData() {
    ensureFileExists();

    try {
        const raw =
            fs.readFileSync(
                FILE_PATH,
                'utf8'
            );

        const parsed =
            JSON.parse(raw);

        const names =
            Array.isArray(parsed.names)
                ? parsed.names
                    .map((item) => ({
                        id: Number(item.id),
                        name: String(
                            item.name ?? ''
                        ).trim(),
                    }))
                    .filter(
                        (item) =>
                            Number.isInteger(
                                item.id
                            ) &&
                            item.id > 0 &&
                            item.name
                    )
                : [];

        return {
            source:
                parsed.source === 'custom' ||
                parsed.source === 'specific'
                    ? parsed.source
                    : 'tiktok',

            selectedNameId:
                Number.isInteger(
                    Number(
                        parsed.selectedNameId
                    )
                )
                    ? Number(
                          parsed.selectedNameId
                      )
                    : null,

            names,
        };
    } catch (error) {
        console.error(
            'Failed to read zombieMobNameSource.json:',
            error
        );

        return {
            ...defaultData,
            names: [],
        };
    }
}

// ==========================================
// SAVE DATA
// ==========================================

function saveData(data) {
    fs.writeFileSync(
        FILE_PATH,
        JSON.stringify(
            data,
            null,
            4
        ),
        'utf8'
    );
}

// ==========================================
// GET MOB NAME SOURCE
// ==========================================

export function getZombieMobNameSource() {
    return loadData();
}

// ==========================================
// SET MOB NAME SOURCE
// ==========================================

export function setZombieMobNameSource(
    source
) {
    const allowedSources = [
        'tiktok',
        'custom',
        'specific',
    ];

    if (
        !allowedSources.includes(
            source
        )
    ) {
        throw new Error(
            'Invalid mob name source.'
        );
    }

    const data = loadData();

    // CUSTOM REQUIRES AT LEAST ONE NAME

    if (
        source === 'custom' &&
        data.names.length === 0
    ) {
        throw new Error(
            'Add at least one custom mob name first.'
        );
    }

    // SPECIFIC REQUIRES SELECTED NAME

    if (
        source === 'specific' &&
        !data.selectedNameId
    ) {
        throw new Error(
            'Select a saved mob name first.'
        );
    }

    data.source = source;

    saveData(data);

    return data;
}

// ==========================================
// GET NEXT ID
// ==========================================

function getNextId(names) {
    if (!names.length) {
        return 1;
    }

    return (
        Math.max(
            ...names.map(
                (item) =>
                    Number(item.id) || 0
            )
        ) + 1
    );
}

// ==========================================
// ADD CUSTOM MOB NAME
// ==========================================

export function addZombieMobName(name) {
    const normalizedName =
        String(name || '').trim();

    if (!normalizedName) {
        throw new Error(
            'Custom mob name is required.'
        );
    }

    const data = loadData();

    // CASE-INSENSITIVE DUPLICATE CHECK

    const duplicate =
        data.names.some(
            (item) =>
                String(item.name)
                    .trim()
                    .toLowerCase() ===
                normalizedName.toLowerCase()
        );

    if (duplicate) {
        throw new Error(
            'This custom mob name already exists.'
        );
    }

    const newName = {
        id: getNextId(
            data.names
        ),
        name: normalizedName,
    };

    data.names.push(newName);

    saveData(data);

    return newName;
}

// ==========================================
// DELETE CUSTOM MOB NAME
// ==========================================

export function deleteZombieMobName(
    id
) {
    const numericId = Number(id);

    if (
        !Number.isInteger(
            numericId
        )
    ) {
        return null;
    }

    const data = loadData();

    const index =
        data.names.findIndex(
            (item) =>
                Number(item.id) ===
                numericId
        );

    if (index === -1) {
        return null;
    }

    const removed =
        data.names.splice(
            index,
            1
        )[0];

    // CLEAR SELECTED NAME IF DELETED

    if (
        Number(
            data.selectedNameId
        ) === numericId
    ) {
        data.selectedNameId = null;

        // SPECIFIC CAN NO LONGER BE USED

        if (
            data.source ===
            'specific'
        ) {
            data.source = 'tiktok';
        }
    }

    saveData(data);

    return removed;
}

// ==========================================
// SELECT SPECIFIC MOB NAME
// ==========================================

export function selectZombieMobName(
    id
) {
    const numericId = Number(id);

    if (
        !Number.isInteger(
            numericId
        )
    ) {
        throw new Error(
            'Invalid mob name ID.'
        );
    }

    const data = loadData();

    const selected =
        data.names.find(
            (item) =>
                Number(item.id) ===
                numericId
        );

    if (!selected) {
        throw new Error(
            'Saved mob name not found.'
        );
    }

    data.selectedNameId =
        numericId;

    saveData(data);

    return data;
}

// ==========================================
// RESOLVE ZOMBIE MOB NAME
// ==========================================

export function resolveZombieMobName({
    tiktokUsername = '',
} = {}) {
    const data = loadData();

    const username =
        String(
            tiktokUsername || ''
        ).trim();

    // ======================================
    // TIKTOK SOURCE
    // ======================================

    if (
        data.source ===
        'tiktok'
    ) {
        return (
            username ||
            'TikTok User'
        );
    }

    // ======================================
    // SPECIFIC SOURCE
    // ======================================

    if (
        data.source ===
        'specific'
    ) {
        const selected =
            data.names.find(
                (item) =>
                    Number(item.id) ===
                    Number(
                        data.selectedNameId
                    )
            );

        if (selected) {
            return selected.name;
        }

        return (
            username ||
            'Zombie'
        );
    }

    // ======================================
    // CUSTOM SOURCE
    // RANDOM FROM ALL SAVED NAMES
    // ======================================

    const availableNames =
        data.names;

    if (
        availableNames.length === 0
    ) {
        return (
            username ||
            'Zombie'
        );
    }

    const randomIndex =
        Math.floor(
            Math.random() *
                availableNames.length
        );

    return availableNames[
        randomIndex
    ].name;
}