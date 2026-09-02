//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\ZombieApocalypse\components\ZombieApocalypse.jsx
import "../../../app.css";


import useZombieApocalypse from "../useZombieApocalypse";

import ApocalypseHeader from "./ApocalypseHeader";
import ApocalypseToggle from "./ApocalypseToggle";
import FollowRewards from "./FollowRewards";
import LikeRewards from "./LikeRewards";
import LiveStatus from "./LiveStatus";
import SpawnConfiguration from "./SpawnConfiguration";
import SpawnQueue from "./SpawnQueue";
import ZombieGiftRewards from "./ZombieGiftRewards";

export default function ZombieApocalypse() {

    const {

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
        deleteLikeReward,
        resetLikeReward,


        followRewards,
        followRewardLoading,
        followRewardSaving,
        editingFollowRewardId,
        followRewardForm,
        setFollowRewardForm,
        editFollowReward,
        saveFollowReward,
        deleteFollowReward,
        resetFollowReward,


        zombieGifts,
        giftLoading,
        giftSaving,
        editingGiftId,
        giftForm,
        setGiftForm,
        editZombieGift,
        saveZombieGift,
        deleteZombieGift,
        resetZombieGift,

    } = useZombieApocalypse()


    return (

        <div className="page">

            <ApocalypseHeader />


            <ApocalypseToggle
                running={state.running}
                loading={loading}
                onToggle={toggleApocalypse}
            />


            <LiveStatus
                activeZombies={
                    state.activeZombies
                }
                maxActiveZombies={
                    state.maxActiveZombies
                }
                queuedZombies={
                    state.queuedZombies
                }
            />


            <SpawnConfiguration
                state={state}
                setState={setState}
                saving={saving}
                onSave={saveConfig}
            />


            <LikeRewards
                rewards={likeRewards}
                loading={likeRewardLoading}
                saving={likeRewardSaving}
                editingId={
                    editingLikeRewardId
                }
                form={likeRewardForm}
                setForm={
                    setLikeRewardForm
                }
                onSave={
                    saveLikeReward
                }
                onEdit={
                    editLikeReward
                }
                onDelete={
                    deleteLikeReward
                }
                onCancel={
                    resetLikeReward
                }
            />


            <FollowRewards
                rewards={followRewards}
                loading={followRewardLoading}
                saving={followRewardSaving}
                editingId={
                    editingFollowRewardId
                }
                form={followRewardForm}
                setForm={
                    setFollowRewardForm
                }
                onSave={
                    saveFollowReward
                }
                onEdit={
                    editFollowReward
                }
                onDelete={
                    deleteFollowReward
                }
                onCancel={
                    resetFollowReward
                }
            />


            <ZombieGiftRewards
                gifts={zombieGifts}
                loading={giftLoading}
                saving={giftSaving}
                editingId={
                    editingGiftId
                }
                form={giftForm}
                setForm={
                    setGiftForm
                }
                onSave={
                    saveZombieGift
                }
                onEdit={
                    editZombieGift
                }
                onDelete={
                    deleteZombieGift
                }
                onCancel={
                    resetZombieGift
                }
            />


            <SpawnQueue
                queuedZombies={
                    state.queuedZombies
                }
            />


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