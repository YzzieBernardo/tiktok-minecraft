// ==========================================
// MOB BATTLE BATTLEFIELD
// Position Calculator
// ==========================================

const DEFAULT_SPAWN_MARGIN = 5;
const DEFAULT_MOB_SPACING = 2;

// ==========================================
// NORMALIZE BOUNDS
// ==========================================

function normalizeBounds(bounds) {
    if (!bounds) {
        throw new Error(
            "Battlefield bounds are required."
        );
    }

    const minX = Number(bounds.minX);
    const maxX = Number(bounds.maxX);
    const minZ = Number(bounds.minZ);
    const maxZ = Number(bounds.maxZ);
    const y = Number(bounds.y ?? bounds.minY);

    if (
        !Number.isFinite(minX) ||
        !Number.isFinite(maxX) ||
        !Number.isFinite(minZ) ||
        !Number.isFinite(maxZ) ||
        !Number.isFinite(y)
    ) {
        throw new Error(
            "Battlefield bounds contain invalid coordinates."
        );
    }

    return {
        minX: Math.min(minX, maxX),
        maxX: Math.max(minX, maxX),
        minZ: Math.min(minZ, maxZ),
        maxZ: Math.max(minZ, maxZ),
        y,
    };
}

// ==========================================
// CALCULATE FORMATION GRID
// ==========================================

function calculateGrid(
    amount,
    width,
    length,
    spacing
) {
    if (amount <= 0) {
        return {
            columns: 0,
            rows: 0,
        };
    }

    /*
     * We try to make the formation as compact
     * and balanced as possible.
     */

    const maxColumns = Math.max(
        1,
        Math.floor(
            (width - 1) / spacing
        ) + 1
    );

    const columns = Math.min(
        amount,
        maxColumns
    );

    const rows = Math.ceil(
        amount / columns
    );

    /*
     * If the calculated rows do not fit,
     * reduce the number of columns until
     * the formation fits the available area.
     */

    let finalColumns = columns;
    let finalRows = rows;

    while (
        finalRows > 1 &&
        (finalRows - 1) * spacing + 1 > length
    ) {
        finalColumns += 1;

        if (finalColumns > amount) {
            finalColumns = amount;
            break;
        }

        finalRows = Math.ceil(
            amount / finalColumns
        );
    }

    return {
        columns: finalColumns,
        rows: finalRows,
    };
}

// ==========================================
// CALCULATE SPAWN POSITIONS
// ==========================================

export function calculateSpawnPositions(
    bounds,
    amount,
    options = {}
) {
    const normalizedBounds =
        normalizeBounds(bounds);

    const requestedAmount =
        Math.max(
            0,
            Math.floor(Number(amount) || 0)
        );

    if (requestedAmount === 0) {
        return [];
    }

    const margin = Math.max(
        0,
        Number(
            options.margin ??
            DEFAULT_SPAWN_MARGIN
        )
    );

    const spacing = Math.max(
        1,
        Number(
            options.spacing ??
            DEFAULT_MOB_SPACING
        )
    );

    const minX =
        normalizedBounds.minX + margin;

    const maxX =
        normalizedBounds.maxX - margin;

    const minZ =
        normalizedBounds.minZ + margin;

    const maxZ =
        normalizedBounds.maxZ - margin;

    const availableWidth =
        maxX - minX;

    const availableLength =
        maxZ - minZ;

    /*
     * If the margin makes the spawn area
     * too small, fail instead of spawning
     * outside the battlefield.
     */

    if (
        availableWidth < 0 ||
        availableLength < 0
    ) {
        throw new Error(
            "Spawn margin is too large for the battlefield."
        );
    }

    const grid =
        calculateGrid(
            requestedAmount,
            availableWidth,
            availableLength,
            spacing
        );

    if (
        grid.columns <= 0 ||
        grid.rows <= 0
    ) {
        throw new Error(
            "Unable to calculate a valid mob formation."
        );
    }

    const positions = [];

    /*
     * Center the complete formation
     * inside the available spawn area.
     */

    const formationWidth =
        (grid.columns - 1) * spacing;

    const formationLength =
        (grid.rows - 1) * spacing;

    const startX =
        minX +
        (availableWidth - formationWidth) / 2;

    const startZ =
        minZ +
        (availableLength - formationLength) / 2;

    for (
        let index = 0;
        index < requestedAmount;
        index++
    ) {
        const row =
            Math.floor(
                index / grid.columns
            );

        const column =
            index % grid.columns;

        positions.push({
            x:
                startX +
                column * spacing,

            y:
                normalizedBounds.y,

            z:
                startZ +
                row * spacing,

            index: index + 1,
        });
    }

    return positions;
}

// ==========================================
// CALCULATE TEAM SPAWN POSITIONS
// ==========================================

export function calculateTeamSpawnPositions(
    team,
    bounds,
    amount,
    options = {}
) {
    if (team !== "A" && team !== "B") {
        throw new Error(
            "Team must be A or B."
        );
    }

    return calculateSpawnPositions(
        bounds,
        amount,
        options
    );
}

// ==========================================
// CALCULATE LOADOUT SPAWN POSITIONS
// ==========================================

export function calculateLoadoutSpawnPositions(
    loadout,
    bounds,
    options = {}
) {
    if (!loadout) {
        throw new Error(
            "Loadout is required."
        );
    }

    const amount =
        Math.max(
            0,
            Math.floor(
                Number(loadout.amount) || 0
            )
        );

    return calculateSpawnPositions(
        bounds,
        amount,
        options
    );
}