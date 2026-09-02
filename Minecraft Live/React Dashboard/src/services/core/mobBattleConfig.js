//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\services\core\mobBattleConfig.js
// ==========================================
// MOB BATTLE CONFIG
// ==========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const CONFIG_FILE =
    path.join(
        __dirname,
        'mobBattleConfig.json'
    );


// ==========================================
// DEFAULT CONFIG
// ==========================================

const defaultConfig = {

    // ==========================================
    // MOB NAME MODE
    // ==========================================
    //
    // tiktok
    //   Use the detected TikTok username.
    //
    // custom
    //   Use all saved custom names.
    //
    // specific
    //   Use one specific saved name ID.
    //
    nameMode: 'tiktok',

    // Used only when nameMode === 'specific'.
    specificNameId: null,

    names: [

        {
            id: 1,
            team: 'A',
            name: 'TEAM A'
        },

        {
            id: 2,
            team: 'B',
            name: 'TEAM B'
        }

    ]

};

// ==========================================
// RUNTIME CONFIG
// ==========================================

let config = {
    ...defaultConfig,
    names: [
        ...defaultConfig.names
    ]
};

// ==========================================
// CUSTOM NAME ROTATION
// ==========================================
//
// Used by "custom" mode.
//
// Each team gets its own rotation so that
// one mob receives one custom name before
// that name is reused.

let customNameIndexes = {
    A: 0,
    B: 0
};


// ==========================================
// LOAD CONFIG
// ==========================================

function loadMobBattleConfig() {

    try {

        if (!fs.existsSync(CONFIG_FILE)) {

            config = {
                ...defaultConfig,
                names: [
                    ...defaultConfig.names
                ]
            };

            saveMobBattleConfig();

            console.log(
                'Mob Battle: Config JSON created.'
            );

            return;
        }


        const fileData =
            fs.readFileSync(
                CONFIG_FILE,
                'utf8'
            );


        const parsed =
            JSON.parse(fileData);


        if (
            !parsed ||
            typeof parsed !== 'object' ||
            Array.isArray(parsed)
        ) {

            throw new Error(
                'Mob Battle config JSON must contain an object.'
            );

        }


config = {

    ...defaultConfig,

    ...parsed,

    nameMode:
        [
            'tiktok',
            'custom',
            'specific'
        ].includes(
            parsed.nameMode
        )
            ? parsed.nameMode
            : defaultConfig.nameMode,

    specificNameId:
        parsed.specificNameId !== undefined
            ? parsed.specificNameId
            : defaultConfig.specificNameId,

    names:
        Array.isArray(parsed.names)
            ? parsed.names
            : [
                ...defaultConfig.names
            ]

};


        console.log(
            'Mob Battle: Config loaded from JSON.'
        );

    } catch (error) {

        console.error(
            'Mob Battle: Failed to load config:',
            error
        );


        config = {
            ...defaultConfig,
            names: [
                ...defaultConfig.names
            ]
        };


        saveMobBattleConfig();
    }
}


// ==========================================
// SAVE CONFIG
// ==========================================

function saveMobBattleConfig() {

    try {

        fs.writeFileSync(
            CONFIG_FILE,
            JSON.stringify(
                config,
                null,
                4
            ),
            'utf8'
        );


        console.log(
            'Mob Battle: Config saved to JSON.'
        );


        return true;

    } catch (error) {

        console.error(
            'Mob Battle: Failed to save config:',
            error
        );


        return false;
    }
}


// ==========================================
// GET ALL NAMES
// ==========================================

export function getMobBattleNames() {

    return config.names.map(
        item => ({
            ...item
        })
    );
}


// ==========================================
// GET NAME MODE
// ==========================================

export function getMobBattleNameMode() {

    return {

        nameMode:
            config.nameMode || 'tiktok',

        specificNameId:
            config.specificNameId ?? null

    };

}


// ==========================================
// SET NAME MODE
// ==========================================

export function setMobBattleNameMode(
    data = {}
) {

    const validModes = [
        'tiktok',
        'custom',
        'specific'
    ];

    const nameMode =
        validModes.includes(
            data.nameMode
        )
            ? data.nameMode
            : 'tiktok';


    let specificNameId = null;


    if (
        nameMode === 'specific' &&
        data.specificNameId !== null &&
        data.specificNameId !== undefined
    ) {

        const selected =
            getMobBattleName(
                data.specificNameId
            );


        if (!selected) {

            throw new Error(
                'Selected custom name ID was not found.'
            );

        }


        specificNameId =
            Number(selected.id);

    }


    config.nameMode =
        nameMode;

    config.specificNameId =
        specificNameId;


    saveMobBattleConfig();


    console.log(
        'Mob Battle: Name mode changed.'
    );

    console.log(
        `Name mode: ${nameMode}`
    );

    console.log(
        `Specific name ID: ${
            specificNameId ?? 'none'
        }`
    );


    return {

        nameMode,

        specificNameId

    };

}

// ==========================================
// GET ONE NAME
// ==========================================

export function getMobBattleName(id) {

    return (
        config.names.find(
            item =>
                Number(item.id) ===
                Number(id)
        ) ||
        null
    );
}
// ==========================================
// GET MOB NAME FOR SPAWN
// ==========================================

export function getMobBattleSpawnName(
    team,
    donorName = null
) {

    // ==========================================
    // MODE 1 — TIKTOK VIEWER
    // ==========================================

    if (
        config.nameMode === 'tiktok'
    ) {

        const detectedName =
            String(
                donorName || ''
            ).trim();


        if (detectedName) {

            return detectedName;

        }


        return team === 'A'
            ? 'TEAM A'
            : team === 'B'
                ? 'TEAM B'
                : 'MOB';

    }


    // ==========================================
    // MODE 2 — ALL CUSTOM NAMES
    // ==========================================

    if (
        config.nameMode === 'custom'
    ) {

        return getRandomMobBattleName(
            team
        );

    }


    // ==========================================
    // MODE 3 — SPECIFIC CUSTOM NAME
    // ==========================================

    if (
        config.nameMode === 'specific'
    ) {

        const selected =
            getMobBattleName(
                config.specificNameId
            );


        if (
            selected &&
            selected.team === team
        ) {

            return selected.name;

        }


        // If selected ID belongs to the
        // wrong team, use an available
        // name from that team instead.

        return getRandomMobBattleName(
            team
        );

    }


    return team === 'A'
        ? 'TEAM A'
        : team === 'B'
            ? 'TEAM B'
            : 'MOB';

}

// ==========================================
// GET RANDOM TEAM NAME
// ==========================================

export function getRandomMobBattleName(team) {

    const teamNames =
        config.names.filter(
            item =>
                item.team === team
        );


    if (!teamNames.length) {

        return team === 'A'
            ? 'TEAM A'
            : team === 'B'
                ? 'TEAM B'
                : 'MOB';
    }


    const currentIndex =
        customNameIndexes[team] ?? 0;


    const selected =
        teamNames[
            currentIndex %
            teamNames.length
        ];


    customNameIndexes[team] =
        (
            currentIndex + 1
        ) %
        teamNames.length;


    return selected.name;
}

// ==========================================
// CREATE NAME
// ==========================================

export function createMobBattleName(
    data = {}
) {

    const team =
        data.team === 'B'
            ? 'B'
            : 'A';


    const name =
        String(
            data.name || ''
        ).trim();


    if (!name) {

        throw new Error(
            'Mob name is required.'
        );
    }


    const maxId =
        config.names.reduce(
            (
                highest,
                item
            ) =>
                Math.max(
                    highest,
                    Number(item.id) || 0
                ),
            0
        );


    const newName = {

        id:
            maxId + 1,

        team,

        name

    };


    config.names.push(
        newName
    );


    saveMobBattleConfig();


    return {
        ...newName
    };
}


// ==========================================
// UPDATE NAME
// ==========================================

export function updateMobBattleName(
    id,
    data = {}
) {

    const item =
        getMobBattleName(id);


    if (!item) {

        return null;
    }


    if (
        data.team !== undefined
    ) {

        item.team =
            data.team === 'B'
                ? 'B'
                : 'A';
    }


    if (
        data.name !== undefined
    ) {

        const name =
            String(
                data.name || ''
            ).trim();


        if (!name) {

            throw new Error(
                'Mob name is required.'
            );
        }


        item.name =
            name;
    }


    saveMobBattleConfig();


    return {
        ...item
    };
}


// ==========================================
// DELETE NAME
// ==========================================

export function deleteMobBattleName(id) {

    const index =
        config.names.findIndex(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (index === -1) {

        return false;
    }


    config.names.splice(
        index,
        1
    );


    saveMobBattleConfig();


    return true;
}


// ==========================================
// LOAD ON START
// ==========================================

loadMobBattleConfig();