//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\ZombieApocalypse\useZombieApocalypse.js
import {
    useEffect,
    useState,
} from 'react'

import {
    getZombieStatus,
    toggleZombieApocalypse,
    saveZombieConfig,

    getLikeRewards,
    createLikeReward,
    updateLikeReward,
    deleteLikeReward,

    getFollowRewards,
    createFollowReward,
    updateFollowReward,
    deleteFollowReward,

    getZombieGifts,
    createZombieGift,
    updateZombieGift,
    deleteZombieGift,
} from './zombieApi'

export default function useZombieApocalypse() {

const [state, setState] = useState({
    running: false,

    maxActiveZombies: null,
    minSpawnRange: null,
    maxSpawnRange: null,

    activeZombies: 0,
    queuedZombies: 0,
    totalSpawned: 0,
})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [likeRewards, setLikeRewards] = useState([])
    const [likeRewardLoading, setLikeRewardLoading] = useState(false)
    const [likeRewardSaving, setLikeRewardSaving] = useState(false)
    const [editingLikeRewardId, setEditingLikeRewardId] = useState(null)

    const [followRewards, setFollowRewards] = useState([])
    const [followRewardLoading, setFollowRewardLoading] = useState(false)
    const [followRewardSaving, setFollowRewardSaving] = useState(false)
    const [editingFollowRewardId, setEditingFollowRewardId] = useState(null)

    const [zombieGifts, setZombieGifts] = useState([])
    const [giftLoading, setGiftLoading] = useState(false)
    const [giftSaving, setGiftSaving] = useState(false)
    const [editingGiftId, setEditingGiftId] = useState(null)

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

    const [giftForm, setGiftForm] = useState({
        id: '',
        name: '',
        rewardType: 'mob',
        rewardName: '',
        amount: 1,
    })


   async function refreshStatus() {

    try {

        const data =
            await getZombieStatus()

        setState(prev => ({
            ...prev,

            // LIVE STATUS
            running:
                data.running ??
                prev.running,

            activeZombies:
                data.activeZombies ??
                0,

            queuedZombies:
                data.queuedZombies ??
                0,

            // LIVE CONFIGURATION
            maxActiveZombies:
                data.maxActiveZombies ??
                prev.maxActiveZombies,

            minSpawnRange:
                data.minSpawnRange ??
                prev.minSpawnRange,

            maxSpawnRange:
                data.maxSpawnRange ??
                prev.maxSpawnRange,
        }))

    } catch (error) {

        console.error(
            'Zombie Apocalypse refresh error:',
            error
        )

    }
}


    useEffect(() => {

        async function loadStatus() {

            try {

                const data =
                    await getZombieStatus()

setState({
    running: data.running ?? false,

    maxActiveZombies:
        data.maxActiveZombies ?? null,

    minSpawnRange:
        data.minSpawnDistance ?? null,

    maxSpawnRange:
        data.maxSpawnDistance ?? null,

    activeZombies:
        data.activeZombies ?? 0,

    queuedZombies:
        data.queuedZombies ?? 0,

    totalSpawned:
        data.totalSpawned ?? 0,
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


    async function toggleApocalypse() {

        if (loading) return

        setLoading(true)
        setError('')

        try {

            const data =
                await toggleZombieApocalypse(
                    !state.running
                )

     setState(prev => ({
    ...prev,

    running: data.running ?? prev.running,

    activeZombies: data.activeZombies ?? 0,
    queuedZombies: data.queuedZombies ?? 0,

    totalSpawned: data.totalSpawned ?? prev.totalSpawned,

    maxActiveZombies:
        data.maxActiveZombies ?? prev.maxActiveZombies,

minSpawnRange:
    data.minSpawnDistance ??
    prev.minSpawnRange,

maxSpawnRange:
    data.maxSpawnDistance ??
    prev.maxSpawnRange,
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


   async function saveConfig(config) {

    if (saving) return

    setSaving(true)
    setError('')

    try {

      const data =
    await saveZombieConfig({

        maxActiveZombies:
            Number(
                config.maxActiveZombies
            ),

        minSpawnDistance:
            Number(
                config.minSpawnRange
            ),

        maxSpawnDistance:
            Number(
                config.maxSpawnRange
            ),

    })

        setState(prev => ({
            ...prev,
            ...data.config,
        }))

    } catch (error) {

        console.error(
            'Zombie Apocalypse config error:',
            error
        )

        setError(error.message)

        throw error

    } finally {

        setSaving(false)

    }
}

    useEffect(() => {

        async function loadLikeRewards() {

            setLikeRewardLoading(true)

            try {

                const data =
                    await getLikeRewards()

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

                const data =
                    await getFollowRewards()

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

                const data =
                    await getZombieGifts()

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


    function editLikeReward(reward) {

        setEditingLikeRewardId(
            reward.id
        )

        setLikeRewardForm({
            likesRequired:
                reward.likesRequired,

            rewardType:
                reward.rewardType,

            rewardName:
                reward.rewardName,

            amount:
                reward.amount,
        })
    }


    async function saveLikeReward() {

        if (likeRewardSaving) return

        setLikeRewardSaving(true)
        setError('')

        try {

            const isEditing =
                editingLikeRewardId !== null

            const reward = {
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
            }

            const data = isEditing
                ? await updateLikeReward(
                    editingLikeRewardId,
                    reward
                )
                : await createLikeReward(
                    reward
                )

            setLikeRewards(prev => {

                if (isEditing) {

                    return prev.map(item =>
                        item.id ===
                        editingLikeRewardId
                            ? data.reward
                            : item
                    )
                }

                return [
                    ...prev,
                    data.reward,
                ]
            })

            resetLikeReward()

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


    async function deleteLikeRewardItem(id) {

        setError('')

        try {

            await deleteLikeReward(id)

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


    function resetLikeReward() {

        setEditingLikeRewardId(null)

        setLikeRewardForm({
            likesRequired: 100,
            rewardType: 'mob',
            rewardName: 'minecraft:zombie',
            amount: 1,
        })
    }


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


    async function saveFollowReward() {

        if (followRewardSaving) return

        setFollowRewardSaving(true)
        setError('')

        try {

            const isEditing =
                editingFollowRewardId !== null

            const reward = {

                rewardType:
                    followRewardForm.rewardType,

                rewardName:
                    followRewardForm.rewardName,

                amount:
                    Number(
                        followRewardForm.amount
                    ),
            }

            const data = isEditing
                ? await updateFollowReward(
                    editingFollowRewardId,
                    reward
                )
                : await createFollowReward(
                    reward
                )

            setFollowRewards(prev => {

                if (isEditing) {

                    return prev.map(item =>
                        item.id ===
                        editingFollowRewardId
                            ? data.reward
                            : item
                    )
                }

                return [
                    ...prev,
                    data.reward,
                ]
            })

            resetFollowReward()

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


    async function deleteFollowRewardItem(id) {

        setError('')

        try {

            await deleteFollowReward(id)

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


    function resetFollowReward() {

        setEditingFollowRewardId(null)

        setFollowRewardForm({
            rewardType: 'mob',
            rewardName: 'minecraft:zombie',
            amount: 1,
        })
    }


    function editZombieGift(gift) {

        setEditingGiftId(gift.id)

        setGiftForm({

            id:
                gift.id,

            name:
                gift.name,

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


    async function saveZombieGift() {

        if (giftSaving) return

        setGiftSaving(true)
        setError('')

        try {

            const isEditing =
                editingGiftId !== null

            const gift = {

                giftId:
                    Number(
                        giftForm.id
                    ),

                giftName:
                    giftForm.name,

                action:
                    giftForm.rewardType === 'mob'
                        ? 'spawn_mob'
                        : 'give_item',

                rewardName:
                    giftForm.rewardName,

                amount:
                    Number(
                        giftForm.amount
                    ),
            }

            const data = isEditing
                ? await updateZombieGift(
                    editingGiftId,
                    gift
                )
                : await createZombieGift(
                    gift
                )

            setZombieGifts(prev => {

                if (isEditing) {

                    return prev.map(item =>
                        item.id ===
                        editingGiftId
                            ? data.gift
                            : item
                    )
                }

                return [
                    ...prev,
                    data.gift,
                ]
            })

            resetZombieGift()

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


    async function deleteZombieGiftItem(id) {

        setError('')

        try {

            await deleteZombieGift(id)

            setZombieGifts(prev =>
                prev.filter(
                    gift =>
                        gift.id !== id
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


    function resetZombieGift() {

        setEditingGiftId(null)

        setGiftForm({
            id: '',
            name: '',
            rewardType: 'mob',
            rewardName: '',
            amount: 1,
        })
    }


    return {

        state,
        setState,

        loading,
        saving,
        error,

        toggleApocalypse,
        saveConfig,

        likeRewards,
        likeRewardLoading,
        likeRewardSaving,
        editingLikeRewardId,
        likeRewardForm,
        setLikeRewardForm,
        editLikeReward,
        saveLikeReward,
        deleteLikeReward:
            deleteLikeRewardItem,
        resetLikeReward,

        followRewards,
        followRewardLoading,
        followRewardSaving,
        editingFollowRewardId,
        followRewardForm,
        setFollowRewardForm,
        editFollowReward,
        saveFollowReward,
        deleteFollowReward:
            deleteFollowRewardItem,
        resetFollowReward,

        zombieGifts,
        giftLoading,
        giftSaving,
        editingGiftId,
        giftForm,
        setGiftForm,
        editZombieGift,
        saveZombieGift,
        deleteZombieGift:
        deleteZombieGiftItem,
        resetZombieGift,
    }
}