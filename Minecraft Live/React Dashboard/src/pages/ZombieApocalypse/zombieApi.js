const API_URL = 'http://localhost:3001'

async function request(url, options = {}) {
    const response = await fetch(
        `${API_URL}${url}`,
        options
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error || 'Request failed'
        )
    }

    return data
}

export async function getZombieStatus() {
    return request(
        '/api/zombie-apocalypse/status'
    )
}

export async function toggleZombieApocalypse(enabled) {
    return request(
        '/api/zombie-apocalypse/toggle',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                enabled,
            }),
        }
    )
}

export async function saveZombieConfig(config) {
    return request(
        '/api/zombie-apocalypse/config',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        }
    )
}

export async function getLikeRewards() {
    return request(
        '/api/zombie-apocalypse/like-rewards'
    )
}

export async function createLikeReward(reward) {
    return request(
        '/api/zombie-apocalypse/like-rewards',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reward),
        }
    )
}

export async function updateLikeReward(id, reward) {
    return request(
        `/api/zombie-apocalypse/like-rewards/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reward),
        }
    )
}

export async function deleteLikeReward(id) {
    return request(
        `/api/zombie-apocalypse/like-rewards/${id}`,
        {
            method: 'DELETE',
        }
    )
}

export async function getFollowRewards() {
    return request(
        '/api/zombie-apocalypse/follow-rewards'
    )
}

export async function createFollowReward(reward) {
    return request(
        '/api/zombie-apocalypse/follow-rewards',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reward),
        }
    )
}

export async function updateFollowReward(id, reward) {
    return request(
        `/api/zombie-apocalypse/follow-rewards/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reward),
        }
    )
}

export async function deleteFollowReward(id) {
    return request(
        `/api/zombie-apocalypse/follow-rewards/${id}`,
        {
            method: 'DELETE',
        }
    )
}

export async function getZombieGifts() {
    return request(
        '/api/zombie-apocalypse/gifts'
    )
}

export async function createZombieGift(gift) {
    return request(
        '/api/zombie-apocalypse/gifts',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gift),
        }
    )
}

export async function updateZombieGift(id, gift) {
    return request(
        `/api/zombie-apocalypse/gifts/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gift),
        }
    )
}

export async function deleteZombieGift(id) {
    return request(
        `/api/zombie-apocalypse/gifts/${id}`,
        {
            method: 'DELETE',
        }
    )
}

// =========================================================
// MOB NAME SOURCE
// =========================================================

export async function getZombieMobNameSource() {
    return request(
        '/api/zombie-apocalypse/mob-name-source'
    )
}

export async function saveZombieMobNameSource(source) {
    return request(
        '/api/zombie-apocalypse/mob-name-source/source',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source,
            }),
        }
    )
}

export async function addZombieMobName(name) {
    return request(
        '/api/zombie-apocalypse/mob-name-source/names',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
            }),
        }
    )
}

export async function deleteZombieMobName(id) {
    return request(
        `/api/zombie-apocalypse/mob-name-source/names/${id}`,
        {
            method: 'DELETE',
        }
    )
}

export async function selectZombieMobName(id) {
    return request(
        '/api/zombie-apocalypse/mob-name-source/specific',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
            }),
        }
    )
}