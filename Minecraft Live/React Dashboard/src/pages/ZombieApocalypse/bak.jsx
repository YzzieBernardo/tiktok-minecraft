import { useEffect, useState } from 'react'
import '../app.css'

const API_URL = 'http://localhost:3001'

export default function ZombieApocalypse() {

    const [state, setState] = useState({
        running: false,
        maxActiveZombies: 100,
        minSpawnRange: 100,
        maxSpawnRange: 120,
        activeZombies: 0,
        queuedZombies: 0,
    })

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [zombieGifts, setZombieGifts] = useState([])

    const [likeRewards, setLikeRewards] = useState([])

    const [likeRewardLoading, setLikeRewardLoading] = useState(false)
    const [likeRewardSaving, setLikeRewardSaving] = useState(false)

    const [editingLikeRewardId, setEditingLikeRewardId] = useState(null)

    const [followRewards, setFollowRewards] = useState([])

    const [followRewardLoading, setFollowRewardLoading] = useState(false)
    const [followRewardSaving, setFollowRewardSaving] = useState(false)

    const [editingFollowRewardId, setEditingFollowRewardId] = useState(null)

    const [likeRewardForm, setLikeRewardForm] = useState({
    likesRequired: 100,
    rewardType: 'mob',
    rewardName: 'minecraft:zombie',
    amount: 1,
})

const [followRewardForm, setFollowRewardForm] = useState({
    rewardType: 'mob',
    rewardName: 'minecraft:zombie',
    amount: 1,
})
    const [giftLoading, setGiftLoading] = useState(false)
    const [giftSaving, setGiftSaving] = useState(false)

const [giftForm, setGiftForm] = useState({
    id: '',
    name: '',
    rewardType: 'mob',
    rewardName: '',
    amount: 1,
})

const [editingGiftId, setEditingGiftId] = useState(null)


    useEffect(() => {

        async function loadStatus() {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/zombie-apocalypse/status`
                    )

                const data =
                    await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        'Failed to load Zombie Apocalypse'
                    )
                }

                setState({
                    running:
                        data.running ?? false,

                    maxActiveZombies:
                        data.maxActiveZombies ?? 100,

                    minSpawnRange:
                        data.minSpawnRange ?? 100,

                    maxSpawnRange:
                        data.maxSpawnRange ?? 120,

                    activeZombies:
                        data.activeZombies ?? 0,

                    queuedZombies:
                        data.queuedZombies ?? 0,
                })

            } catch (error) {

                console.error(
                    'Zombie Apocalypse state error:',
                    error
                )

                setError(error.message)
            }
        }

        loadStatus()

    }, [])


    async function toggleZombieApocalypse() {

        if (loading) return

        setLoading(true)
        setError('')

        try {

            const response =
                await fetch(
                    `${API_URL}/api/zombie-apocalypse/toggle`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',
                        },

                        body: JSON.stringify({
                            enabled:
                                !state.running,
                        }),
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    'Failed to toggle Zombie Apocalypse'
                )
            }

            setState(prev => ({
                ...prev,
                running:
                    data.running,
            }))

        } catch (error) {

            console.error(
                'Zombie Apocalypse toggle error:',
                error
            )

            setError(error.message)

        } finally {

            setLoading(false)

        }
    }


    async function saveConfig() {

        if (saving) return

        setSaving(true)
        setError('')

        try {

            const response =
                await fetch(
                    `${API_URL}/api/zombie-apocalypse/config`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json',
                        },

                        body: JSON.stringify({

                            maxActiveZombies:
                                Number(
                                    state.maxActiveZombies
                                ),

                            minSpawnRange:
                                Number(
                                    state.minSpawnRange
                                ),

                            maxSpawnRange:
                                Number(
                                    state.maxSpawnRange
                                ),

                        }),
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    'Failed to save configuration'
                )
            }

            const config =
                data.config

            setState(prev => ({
                ...prev,
                ...config,
            }))

        } catch (error) {

            console.error(
                'Zombie Apocalypse config error:',
                error
            )

            setError(error.message)

        } finally {

            setSaving(false)

        }
    }


    async function refreshStatus() {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/zombie-apocalypse/status`
                )

            const data =
                await response.json()

            if (!response.ok) return

            setState(prev => ({
                ...prev,

                running:
                    data.running ??
                    prev.running,

                activeZombies:
                    data.activeZombies ??
                    0,

                queuedZombies:
                    data.queuedZombies ??
                    0,
            }))

        } catch (error) {

            console.error(
                'Zombie Apocalypse refresh error:',
                error
            )

        }
    }


    useEffect(() => {

        const interval =
            setInterval(
                refreshStatus,
                2000
            )

        return () => {
            clearInterval(interval)
        }

    }, [])

    useEffect(() => {

    async function loadLikeRewards() {

        setLikeRewardLoading(true)

        try {

            const response =
                await fetch(
                    `${API_URL}/api/zombie-apocalypse/like-rewards`
                )

            const data =
                await response.json()

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Failed to load Like Rewards'
                )

            }

            setLikeRewards(
                data.rewards || []
            )

        } catch (error) {

            console.error(
                'Zombie Like Rewards load error:',
                error
            )

            setError(error.message)

        } finally {

            setLikeRewardLoading(false)

        }

    }

    loadLikeRewards()

}, [])

useEffect(() => {

    async function loadFollowRewards() {

        setFollowRewardLoading(true)

        try {

            const response =
                await fetch(
                    `${API_URL}/api/zombie-apocalypse/follow-rewards`
                )

            const data =
                await response.json()

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Failed to load Follow Rewards'
                )

            }

            setFollowRewards(
                data.rewards || []
            )

        } catch (error) {

            console.error(
                'Zombie Follow Rewards load error:',
                error
            )

            setError(error.message)

        } finally {

            setFollowRewardLoading(false)

        }

    }

    loadFollowRewards()

}, [])

    useEffect(() => {

    async function loadZombieGifts() {
        

        setGiftLoading(true)

        try {

            const response =
                await fetch(
                    `${API_URL}/api/zombie-apocalypse/gifts`
                )

            const data =
                await response.json()

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Failed to load Zombie Gifts'
                )

            }

            setZombieGifts(
                data.gifts || []
            )

        } catch (error) {

            console.error(
                'Zombie Gift load error:',
                error
            )

            setError(error.message)

        } finally {

            setGiftLoading(false)

        }

    }

    loadZombieGifts()

}, [])

function editFollowReward(reward) {

    setEditingFollowRewardId(
        reward.id
    )

    setFollowRewardForm({

        rewardType:
            reward.rewardType,

        rewardName:
            reward.rewardName,

        amount:
            reward.amount,

    })
}

async function deleteFollowReward(id) {

    setError('')

    try {

        const response =
            await fetch(
                `${API_URL}/api/zombie-apocalypse/follow-rewards/${id}`,
                {
                    method: 'DELETE',
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to delete Follow Reward'
            )

        }

        setFollowRewards(prev =>
            prev.filter(
                reward =>
                    reward.id !== id
            )
        )

    } catch (error) {

        console.error(
            'Zombie Follow Reward delete error:',
            error
        )

        setError(error.message)

    }
}

async function deleteLikeReward(id) {

    setError('')

    try {

        const response =
            await fetch(
                `${API_URL}/api/zombie-apocalypse/like-rewards/${id}`,
                {
                    method: 'DELETE',
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to delete Like Reward'
            )

        }

        setLikeRewards(prev =>
            prev.filter(
                reward =>
                    reward.id !== id
            )
        )

    } catch (error) {

        console.error(
            'Zombie Like Reward delete error:',
            error
        )

        setError(error.message)

    }

}

async function saveLikeReward() {

    if (likeRewardSaving) return

    setLikeRewardSaving(true)
    setError('')

    try {

        const isEditing =
            editingLikeRewardId !== null

        const url =
            isEditing
                ? `${API_URL}/api/zombie-apocalypse/like-rewards/${editingLikeRewardId}`
                : `${API_URL}/api/zombie-apocalypse/like-rewards`

        const method =
            isEditing
                ? 'PUT'
                : 'POST'

        const response =
            await fetch(
                url,
                {
                    method,

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({

                        likesRequired:
                            Number(
                                likeRewardForm.likesRequired
                            ),

                        rewardType:
                            likeRewardForm.rewardType,

                        rewardName:
                            likeRewardForm.rewardName,

                        amount:
                            Number(
                                likeRewardForm.amount
                            ),

                    }),
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to save Like Reward'
            )

        }

        setLikeRewards(prev => {

            if (isEditing) {

                return prev.map(reward =>
                    reward.id === editingLikeRewardId
                        ? data.reward
                        : reward
                )

            }

            return [
                ...prev,
                data.reward
            ]

        })

        setLikeRewardForm({
            likesRequired: 100,
            rewardType: 'mob',
            rewardName: 'minecraft:zombie',
            amount: 1,
        })

        setEditingLikeRewardId(null)

    } catch (error) {

        console.error(
            'Zombie Like Reward save error:',
            error
        )

        setError(error.message)

    } finally {

        setLikeRewardSaving(false)

    }

}

async function saveFollowReward() {

    if (followRewardSaving) return

    setFollowRewardSaving(true)
    setError('')

    try {

        const isEditing =
            editingFollowRewardId !== null

        const url =
            isEditing
                ? `${API_URL}/api/zombie-apocalypse/follow-rewards/${editingFollowRewardId}`
                : `${API_URL}/api/zombie-apocalypse/follow-rewards`

        const method =
            isEditing
                ? 'PUT'
                : 'POST'

        const response =
            await fetch(
                url,
                {
                    method,

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({

                        rewardType:
                            followRewardForm.rewardType,

                        rewardName:
                            followRewardForm.rewardName,

                        amount:
                            Number(
                                followRewardForm.amount
                            ),

                    }),
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to save Follow Reward'
            )

        }

        setFollowRewards(prev => {

            if (isEditing) {

                return prev.map(reward =>
                    reward.id === editingFollowRewardId
                        ? data.reward
                        : reward
                )

            }

            return [
                ...prev,
                data.reward
            ]

        })

        setFollowRewardForm({

            rewardType:
                'mob',

            rewardName:
                'minecraft:zombie',

            amount:
                1,

        })

        setEditingFollowRewardId(null)

    } catch (error) {

        console.error(
            'Zombie Follow Reward save error:',
            error
        )

        setError(error.message)

    } finally {

        setFollowRewardSaving(false)

    }
}

async function saveZombieGift() {

    if (giftSaving) return

    setGiftSaving(true)
    setError('')

    try {

        const isEditing =
            editingGiftId !== null

        const url =
            isEditing
                ? `${API_URL}/api/zombie-apocalypse/gifts/${editingGiftId}`
                : `${API_URL}/api/zombie-apocalypse/gifts`

        const method =
            isEditing
                ? 'PUT'
                : 'POST'

        const response =
            await fetch(
                url,
                {
                    method,

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

body: JSON.stringify({

    giftId:
        Number(giftForm.id),

    giftName:
        giftForm.name,

    action:
        giftForm.rewardType === 'mob'
            ? 'spawn_mob'
            : 'give_item',

    rewardName:
        giftForm.rewardName,

    amount:
        Number(giftForm.amount),

}),
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to save Zombie Gift'
            )

        }

        setZombieGifts(prev => {

            if (isEditing) {

                return prev.map(gift =>
                    gift.id === editingGiftId
                        ? data.gift
                        : gift
                )

            }

            return [
                ...prev,
                data.gift
            ]

        })

            setGiftForm({
            id: '',
            name: '',
            rewardType: 'mob',
            rewardName: '',
            amount: 1,
        })
        setEditingGiftId(null)

    } catch (error) {

        console.error(
            'Zombie Gift save error:',
            error
        )

        setError(error.message)

    } finally {

        setGiftSaving(false)

    }
}

async function deleteZombieGift(id) {

    setError('')

    try {

        const response =
            await fetch(
                `${API_URL}/api/zombie-apocalypse/gifts/${id}`,
                {
                    method: 'DELETE',
                }
            )

        const data =
            await response.json()

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to delete Zombie Gift'
            )

        }

        setZombieGifts(prev =>
            prev.filter(
                gift => gift.id !== id
            )
        )

    } catch (error) {

        console.error(
            'Zombie Gift delete error:',
            error
        )

        setError(error.message)

    }
}

function editZombieGift(gift) {

    setEditingGiftId(gift.id)

    setGiftForm({
        id: gift.id,
        name: gift.name,

        rewardType:
            gift.action === 'give_item'
                ? 'item'
                : 'mob',

        rewardName:
            gift.rewardName ?? '',

        amount:
            gift.amount ?? 1,
    })
}

    return (

        <div className="page">

            <div className="page-header">

                <h1>
                    Zombie Apocalypse
                </h1>

                <p>
                    Control zombie spawning,
                    limits, range and TikTok rewards.
                </p>

            </div>


            {/* STATUS */}
            <section className="za-card">

                <div className="za-card-title">
                    ZOMBIE APOCALYPSE
                </div>

                <div className="za-status-row">

                    <div>

                        <div className="za-label">
                            Zombie Spawning
                        </div>

                        <div className="za-description">

                            {state.running
                                ? 'Zombie Apocalypse is active.'
                                : 'Zombie Apocalypse is disabled.'}

                        </div>

                    </div>


                    <button
                        className={
                            state.running
                                ? 'btn btn-primary'
                                : 'btn btn-ghost'
                        }
                        onClick={
                            toggleZombieApocalypse
                        }
                        disabled={loading}
                    >

                        {loading
                            ? 'Working...'
                            : state.running
                                ? '🟢 ON'
                                : '🔴 OFF'}

                    </button>

                </div>

            </section>


            {/* LIVE STATUS */}

            <section className="za-card">

                <div className="za-card-title">
                    LIVE STATUS
                </div>

                <div className="za-stats-grid">

                    <div className="za-stat">

                        <div className="za-stat-label">
                            ACTIVE ZOMBIES
                        </div>

                        <div className="za-stat-value">
                            {state.activeZombies}
                        </div>

                    </div>


                    <div className="za-stat">

                        <div className="za-stat-label">
                            ZOMBIE LIMIT
                        </div>

                        <div className="za-stat-value">
                            {state.maxActiveZombies}
                        </div>

                    </div>


                    <div className="za-stat">

                        <div className="za-stat-label">
                            QUEUED
                        </div>

                        <div className="za-stat-value">
                            {state.queuedZombies}
                        </div>

                    </div>

                </div>

            </section>


            {/* SPAWN CONFIG */}

            <section className="za-card">

                <div className="za-card-title">
                    SPAWN CONFIGURATION
                </div>

                <div className="za-config-grid">

                    <label className="za-field">

                        <span>
                            Maximum Zombies
                        </span>

                        <input
                            type="number"
                            min="1"
                            value={
                                state.maxActiveZombies
                            }
                            onChange={event =>
                                setState(prev => ({
                                    ...prev,
                                    maxActiveZombies:
                                        event.target.value,
                                }))
                            }
                        />

                    </label>


                    <label className="za-field">

                        <span>
                            Minimum Spawn Range
                        </span>

                        <input
                            type="number"
                            min="1"
                            value={
                                state.minSpawnRange
                            }
                            onChange={event =>
                                setState(prev => ({
                                    ...prev,
                                    minSpawnRange:
                                        event.target.value,
                                }))
                            }
                        />

                    </label>


                    <label className="za-field">

                        <span>
                            Maximum Spawn Range
                        </span>

                        <input
                            type="number"
                            min="1"
                            value={
                                state.maxSpawnRange
                            }
                            onChange={event =>
                                setState(prev => ({
                                    ...prev,
                                    maxSpawnRange:
                                        event.target.value,
                                }))
                            }
                        />

                    </label>

                </div>


                <div className="za-actions">

                    <button
                        className="btn btn-primary"
                        onClick={saveConfig}
                        disabled={saving}
                    >

                        {saving
                            ? 'Saving...'
                            : 'Save Configuration'}

                    </button>

                </div>

            </section>


            {/* QUEUE */}

            {/* LIKE REWARDS */}

<section className="za-card">

    <div className="za-card-title">
        LIKE REWARDS
    </div>

    <div className="za-description">
        Reward players when the TikTok like milestone is reached.
    </div>

    {/* LIKE REWARD FORM */}

    <div className="za-gift-form">

        <label className="za-field">
            <span>Likes Required</span>

            <input
                type="number"
                min="1"
                value={likeRewardForm.likesRequired}
                onChange={event =>
                    setLikeRewardForm(prev => ({
                        ...prev,
                        likesRequired: event.target.value,
                    }))
                }
            />
        </label>


        <label className="za-field">
            <span>Reward Type</span>

            <select
                value={likeRewardForm.rewardType}
                onChange={event =>
                    setLikeRewardForm(prev => ({
                        ...prev,
                        rewardType: event.target.value,
                        rewardName: '',
                        amount: 1,
                    }))
                }
            >
                <option value="mob">
                    Mob
                </option>

                <option value="item">
                    Item
                </option>
            </select>
        </label>


        <label className="za-field">
            <span>
                {likeRewardForm.rewardType === 'mob'
                    ? 'Mob Name'
                    : 'Item Name'}
            </span>

            <input
                type="text"
                placeholder={
                    likeRewardForm.rewardType === 'mob'
                        ? 'minecraft:zombie'
                        : 'minecraft:bread'
                }
                value={likeRewardForm.rewardName}
                onChange={event =>
                    setLikeRewardForm(prev => ({
                        ...prev,
                        rewardName: event.target.value,
                    }))
                }
            />
        </label>


        <label className="za-field">
            <span>
                {likeRewardForm.rewardType === 'mob'
                    ? 'Mob Amount'
                    : 'Item Amount'}
            </span>

            <input
                type="number"
                min="1"
                value={likeRewardForm.amount}
                onChange={event =>
                    setLikeRewardForm(prev => ({
                        ...prev,
                        amount: event.target.value,
                    }))
                }
            />
        </label>

    </div>


    {/* LIKE FORM ACTIONS */}

    <div className="za-actions">

        <button
            className="btn btn-primary"
            onClick={saveLikeReward}
            disabled={likeRewardSaving}
        >
            {likeRewardSaving
                ? 'Saving...'
                : editingLikeRewardId !== null
                    ? 'Update Like Reward'
                    : 'Add Like Reward'}
        </button>


        {editingLikeRewardId !== null && (

            <button
                className="btn btn-ghost"
                onClick={() => {

                    setEditingLikeRewardId(null)

                    setLikeRewardForm({
                        likesRequired: 100,
                        rewardType: 'mob',
                        rewardName: 'minecraft:zombie',
                        amount: 1,
                    })

                }}
            >
                Cancel
            </button>

        )}

    </div>


    {/* LIKE REWARD TABLE */}

    <div className="za-table-wrapper">

        <table className="za-table">

            <thead>

                <tr>
                    <th>Likes</th>
                    <th>Type</th>
                    <th>Reward</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>

            </thead>


            <tbody>

                {likeRewardLoading ? (

                    <tr>
                        <td colSpan="5">
                            Loading like rewards...
                        </td>
                    </tr>

                ) : likeRewards.length === 0 ? (

                    <tr>
                        <td colSpan="5">
                            No Like Rewards configured.
                        </td>
                    </tr>

                ) : (

                    likeRewards.map(reward => (

                        <tr key={reward.id}>

                            <td>
                                {reward.likesRequired}
                            </td>

                            <td>
                                {reward.rewardType === 'item'
                                    ? 'Item'
                                    : 'Mob'}
                            </td>

                            <td>
                                {reward.rewardName || 'None'}
                            </td>

                            <td>
                                {reward.amount ?? 0}
                            </td>

                            <td>

                                <div className="za-table-actions">

                                    <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            editLikeReward(reward)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            deleteLikeReward(
                                                reward.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>

    </div>

</section>

            {/* ZOMBIE GIFT REWARDS */}

<section className="za-card">



    {/* FOLLOW REWARDS */}

<section className="za-card">

    <div className="za-card-title">
        ZOMBIE FOLLOW REWARDS
    </div>

    <div className="za-gift-form">

        <label className="za-field">

            <span>
                Reward Type
            </span>

            <select
                value={followRewardForm.rewardType}
                onChange={event =>
                    setFollowRewardForm(prev => ({
                        ...prev,

                        rewardType:
                            event.target.value,

                        rewardName:
                            '',

                        amount:
                            1,
                    }))
                }
            >

                <option value="mob">
                    Mob
                </option>

                <option value="item">
                    Item
                </option>

            </select>

        </label>


        <label className="za-field">

            <span>
                {followRewardForm.rewardType === 'mob'
                    ? 'Mob Name'
                    : 'Item Name'}
            </span>

            <input
                type="text"

                placeholder={
                    followRewardForm.rewardType === 'mob'
                        ? 'minecraft:zombie'
                        : 'minecraft:diamond'
                }

                value={
                    followRewardForm.rewardName
                }

                onChange={event =>
                    setFollowRewardForm(prev => ({
                        ...prev,

                        rewardName:
                            event.target.value,
                    }))
                }
            />

        </label>


        <label className="za-field">

            <span>
                {followRewardForm.rewardType === 'mob'
                    ? 'Mob Amount'
                    : 'Item Amount'}
            </span>

            <input
                type="number"
                min="1"

                value={
                    followRewardForm.amount
                }

                onChange={event =>
                    setFollowRewardForm(prev => ({
                        ...prev,

                        amount:
                            event.target.value,
                    }))
                }
            />

        </label>

    </div>


    <div className="za-actions">

        <button
            className="btn btn-primary"
            onClick={saveFollowReward}
            disabled={followRewardSaving}
        >

            {followRewardSaving
                ? 'Saving...'
                : editingFollowRewardId !== null
                    ? 'Update Follow Reward'
                    : 'Add Follow Reward'}

        </button>


        {editingFollowRewardId !== null && (

            <button
                className="btn btn-ghost"
                onClick={() => {

                    setEditingFollowRewardId(null)

                    setFollowRewardForm({

                        rewardType:
                            'mob',

                        rewardName:
                            'minecraft:zombie',

                        amount:
                            1,

                    })

                }}
            >
                Cancel
            </button>

        )}

    </div>


    <div className="za-table-wrapper">

        <table className="za-table">

            <thead>

                <tr>

                    <th>
                        Type
                    </th>

                    <th>
                        Reward
                    </th>

                    <th>
                        Amount
                    </th>

                    <th>
                        Actions
                    </th>

                </tr>

            </thead>


            <tbody>

                {followRewardLoading ? (

                    <tr>

                        <td colSpan="4">
                            Loading Follow Rewards...
                        </td>

                    </tr>

                ) : followRewards.length === 0 ? (

                    <tr>

                        <td colSpan="4">
                            No Follow Rewards configured.
                        </td>

                    </tr>

                ) : (

                    followRewards.map(reward => (

                        <tr key={reward.id}>

                            <td>
                                {reward.rewardType === 'item'
                                    ? 'Item'
                                    : 'Mob'}
                            </td>

                            <td>
                                {reward.rewardName || 'None'}
                            </td>

                            <td>
                                {reward.amount ?? 0}
                            </td>

                            <td>

                                <div className="za-table-actions">

                                    <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            editFollowReward(
                                                reward
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            deleteFollowReward(
                                                reward.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>

    </div>

</section>

    <div className="za-card-title">
        ZOMBIE GIFT REWARDS
    </div>

   {/* GIFT FORM */}

<div className="za-gift-form">

    <label className="za-field">
        <span>TikTok Gift ID</span>

        <input
            type="number"
            min="1"
            value={giftForm.id}
            disabled={editingGiftId !== null}
            onChange={event =>
                setGiftForm(prev => ({
                    ...prev,
                    id: event.target.value,
                }))
            }
        />
    </label>


    <label className="za-field">
        <span>Gift Name</span>

        <input
            type="text"
            value={giftForm.name}
            onChange={event =>
                setGiftForm(prev => ({
                    ...prev,
                    name: event.target.value,
                }))
            }
        />
    </label>


    <label className="za-field">
        <span>Reward Type</span>

        <select
            value={giftForm.rewardType}
            onChange={event =>
                setGiftForm(prev => ({
                    ...prev,
                    rewardType: event.target.value,
                    rewardName: '',
                    amount: 1,
                }))
            }
        >
            <option value="mob">
                Mob
            </option>

            <option value="item">
                Item
            </option>
        </select>
    </label>


    <label className="za-field">
        <span>
            {giftForm.rewardType === 'mob'
                ? 'Mob Name'
                : 'Item Name'}
        </span>

        <input
            type="text"
            placeholder={
                giftForm.rewardType === 'mob'
                    ? 'minecraft:zombie'
                    : 'minecraft:bread'
            }
            value={giftForm.rewardName}
            onChange={event =>
                setGiftForm(prev => ({
                    ...prev,
                    rewardName: event.target.value,
                }))
            }
        />
    </label>


    <label className="za-field">
        <span>
            {giftForm.rewardType === 'mob'
                ? 'Mob Amount'
                : 'Item Amount'}
        </span>

        <input
            type="number"
            min="1"
            value={giftForm.amount}
            onChange={event =>
                setGiftForm(prev => ({
                    ...prev,
                    amount: event.target.value,
                }))
            }
        />
    </label>

</div>


    {/* FORM ACTIONS */}

    <div className="za-actions">

        <button
            className="btn btn-primary"
            onClick={saveZombieGift}
            disabled={giftSaving}
        >
            {giftSaving
                ? 'Saving...'
                : editingGiftId !== null
                    ? 'Update Gift'
                    : 'Add Gift'}
        </button>


        {editingGiftId !== null && (

            <button
                className="btn btn-ghost"
                onClick={() => {

                    setEditingGiftId(null)

                 setGiftForm({
                    id: '',
                    name: '',
                    rewardType: 'mob',
                    rewardName: '',
                    amount: 1,
                })

                }}
            >
                Cancel
            </button>

        )}

    </div>


    {/* GIFT TABLE */}

    <div className="za-table-wrapper">

        <table className="za-table">

            <thead>

                <tr>
                  <th>TikTok ID</th>
                    <th>Gift</th>
                    <th>Type</th>
                    <th>Reward</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>

            </thead>


            <tbody>

                {giftLoading ? (

                    <tr>
                        <td colSpan="6">
                            Loading gifts...
                        </td>
                    </tr>

                ) : zombieGifts.length === 0 ? (

                    <tr>
                        <td colSpan="6">
                            No Zombie Apocalypse gifts configured.
                        </td>
                    </tr>

                ) : (

                    zombieGifts.map(gift => (

                        <tr key={gift.id}>

                            <td>
                                {gift.id}
                            </td>

                            <td>
                                {gift.name}
                            </td>

                            <td>
                            {gift.action === 'give_item'
                                ? 'Item'
                                : 'Mob'}
                        </td>

                        <td>
                            {gift.rewardName || 'None'}
                        </td>

                        <td>
                            {gift.amount ?? 0}
                        </td>
                            <td>

                                <div className="za-table-actions">

                                    <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            editZombieGift(gift)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            deleteZombieGift(
                                                gift.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>

    </div>

</section>

            <section className="za-card">

                <div className="za-card-title">
                    SPAWN QUEUE
                </div>

                <div className="za-queue-row">

                    <div>

                        <div className="za-label">
                            Queued Zombies
                        </div>

                        <div className="za-description">
                            Zombies waiting for an
                            available spawn slot.
                        </div>

                    </div>

                    <div className="za-queue-count">
                        {state.queuedZombies}
                    </div>

                </div>

            </section>


            {/* ERROR */}

            {error && (

                <section className="za-card">

                    <div className="za-error">
                        Error: {error}
                    </div>

                </section>

            )}

        </div>

    )
}