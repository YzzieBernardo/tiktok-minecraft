import { useState } from "react";

import "../../../app.css";
import "../../../styles/zombieApocalypse.css";

import useZombieApocalypse from "../useZombieApocalypse";

import ApocalypseHeader from "./ApocalypseHeader";
import ApocalypseToggle from "./ApocalypseToggle";
import LiveStatus from "./LiveStatus";
import SpawnConfiguration from "./SpawnConfiguration";
import SpawnQueue from "./SpawnQueue";

import LikeRewards from "./LikeRewards";
import FollowRewards from "./FollowRewards";
import ZombieGiftRewards from "./ZombieGiftRewards";

export default function ZombieApocalypse() {

    const {
        state,
        loading,
        saving,
        error,

        toggleApocalypse,
        saveConfig,

        // LIKE REWARDS
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

        // FOLLOW REWARDS
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

        // GIFT REWARDS
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

    } = useZombieApocalypse();


    const [managementModal, setManagementModal] = useState(null);


    function openManagement(type) {
        setManagementModal(type);
    }


    function closeManagement() {

        if (managementModal === "like") {
            resetLikeReward();
        }

        if (managementModal === "follow") {
            resetFollowReward();
        }

        if (managementModal === "gift") {
            resetZombieGift();
        }

        setManagementModal(null);
    }


    const likePreview = likeRewards.slice(0, 4);
    const followPreview = followRewards.slice(0, 4);
    const giftPreview = zombieGifts.slice(0, 4);


    return (
        <div className="za-page">

            {/* =====================================================
                HEADER
                ===================================================== */}

            <ApocalypseHeader />


            {/* =====================================================
                SYSTEM STATUS
                ===================================================== */}

            <section className="za-status-card">

                <div className="za-status-card-header">
                    <div className="za-status-card-title">
                        <span className="za-section-icon">
                            ☣
                        </span>

                        SYSTEM STATUS
                    </div>

                    <div className="za-refresh-status">
                        <span className="za-live-dot" />
                        Auto-refresh: <strong>ON</strong>
                    </div>
                </div>


                <div className="za-status-content">

                    <ApocalypseToggle
                        running={state.running}
                        loading={loading}
                        onToggle={toggleApocalypse}
                    />


                                <LiveStatus
                    activeZombies={state.activeZombies}
                    maxActiveZombies={state.maxActiveZombies}
                    queuedZombies={state.queuedZombies}
                    totalSpawned={state.totalSpawned}
                />

                </div>

            </section>


            {/* =====================================================
                SPAWN CONFIGURATION
                ===================================================== */}

            <SpawnConfiguration
                state={state}
                saving={saving}
                onSave={saveConfig}
            />


            {/* =====================================================
                SPAWN QUEUE
                ===================================================== */}

            <SpawnQueue
                queuedZombies={state.queuedZombies}
            />


            {/* =====================================================
                REWARD MANAGEMENT
                ===================================================== */}

            <div className="za-management-grid">


                {/* =================================================
                    LIKE REWARDS
                    ================================================= */}

                <section className="za-card za-management-card">

                    <div className="za-management-header">

                        <div className="za-management-title">

                            <span className="za-management-icon za-like-icon">
                                ♥
                            </span>

                            LIKE REWARDS

                        </div>

                        <span className="za-live-badge">
                            LIVE
                        </span>

                    </div>


                    <div className="za-management-stats">

                        <div className="za-management-stat">

                            <span className="za-management-stat-label">
                                Total Milestones
                            </span>

                            <strong>
                                {likeRewards.length}
                            </strong>

                            <span className="za-management-stat-subtitle">
                                Configured
                            </span>

                        </div>


                        <div className="za-management-stat">

                            <span className="za-management-stat-label">
                                Total Rewards
                            </span>

                            <strong>
                                {likeRewards.length}
                            </strong>

                            <span className="za-management-stat-subtitle">
                                Available
                            </span>

                        </div>

                    </div>


                    <div className="za-management-table-wrapper">

                        <table className="za-table">

                            <thead>

                                <tr>
                                    <th>Milestone</th>
                                    <th>Reward</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                </tr>

                            </thead>


                            <tbody>

                                {likePreview.length === 0 ? (

                                    <tr>
                                        <td colSpan="4">
                                            No Like Rewards configured.
                                        </td>
                                    </tr>

                                ) : (

                                    likePreview.map(reward => (

                                        <tr key={reward.id}>

                                            <td>
                                                {reward.likesRequired} Likes
                                            </td>

                                            <td>
                                                {reward.rewardName || "None"}
                                            </td>

                                            <td>
                                                {reward.rewardType === "item"
                                                    ? "Item"
                                                    : "Mob"}
                                            </td>

                                            <td>
                                                x{reward.amount ?? 0}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>


                        {likeRewards.length > 4 && (
                            <div className="za-management-more">
                                +{likeRewards.length - 4} more rewards...
                            </div>
                        )}

                    </div>


                    <button
                        className="za-management-button za-like-button"
                        onClick={() => openManagement("like")}
                    >
                        Manage Like Rewards
                    </button>

                </section>


                {/* =================================================
                    FOLLOW REWARDS
                    ================================================= */}

                <section className="za-card za-management-card">

                    <div className="za-management-header">

                        <div className="za-management-title">

                            <span className="za-management-icon za-follow-icon">
                                ●
                            </span>

                            FOLLOW REWARDS

                        </div>

                        <span className="za-live-badge">
                            LIVE
                        </span>

                    </div>


                    <div className="za-management-stats">

                        <div className="za-management-stat">

                            <span className="za-management-stat-label">
                                Total Rewards
                            </span>

                            <strong>
                                {followRewards.length}
                            </strong>

                            <span className="za-management-stat-subtitle">
                                Configured
                            </span>

                        </div>


                        <div className="za-management-stat">

                            <span className="za-management-stat-label">
                                Total Given
                            </span>

                            <strong>
                                —
                            </strong>

                            <span className="za-management-stat-subtitle">
                                This Session
                            </span>

                        </div>

                    </div>


                    <div className="za-management-table-wrapper">

                        <table className="za-table">

                            <thead>

                                <tr>
                                    <th>Reward</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                </tr>

                            </thead>


                            <tbody>

                                {followPreview.length === 0 ? (

                                    <tr>
                                        <td colSpan="3">
                                            No Follow Rewards configured.
                                        </td>
                                    </tr>

                                ) : (

                                    followPreview.map(reward => (

                                        <tr key={reward.id}>

                                            <td>
                                                {reward.rewardName || "None"}
                                            </td>

                                            <td>
                                                {reward.rewardType === "item"
                                                    ? "Item"
                                                    : "Mob"}
                                            </td>

                                            <td>
                                                x{reward.amount ?? 0}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>


                        {followRewards.length > 4 && (
                            <div className="za-management-more">
                                +{followRewards.length - 4} more rewards...
                            </div>
                        )}

                    </div>


                    <button
                        className="za-management-button za-follow-button"
                        onClick={() => openManagement("follow")}
                    >
                        Manage Follow Rewards
                    </button>

                </section>


                {/* =================================================
                    GIFT REWARDS
                    ================================================= */}

                <section className="za-card za-management-card">

                    <div className="za-management-header">

                        <div className="za-management-title">

                            <span className="za-management-icon za-gift-icon">
                                ◆
                            </span>

                            GIFT REWARDS

                        </div>

                        <span className="za-live-badge">
                            LIVE
                        </span>

                    </div>


                    <div className="za-management-stats">

                        <div className="za-management-stat">

                            <span className="za-management-stat-label">
                                Total Gifts
                            </span>

                            <strong>
                                {zombieGifts.length}
                            </strong>

                            <span className="za-management-stat-subtitle">
                                Configured
                            </span>

                        </div>


                        <div className="za-management-stat">

                            <span className="za-management-stat-label">
                                Total Given
                            </span>

                            <strong>
                                —
                            </strong>

                            <span className="za-management-stat-subtitle">
                                This Session
                            </span>

                        </div>

                    </div>


                    <div className="za-management-table-wrapper">

                        <table className="za-table">

                            <thead>

                                <tr>
                                    <th>Gift</th>
                                    <th>Reward</th>
                                    <th>Amount</th>
                                </tr>

                            </thead>


                            <tbody>

                                {giftPreview.length === 0 ? (

                                    <tr>
                                        <td colSpan="3">
                                            No Zombie Apocalypse gifts configured.
                                        </td>
                                    </tr>

                                ) : (

                                    giftPreview.map(gift => (

                                        <tr key={gift.id}>

                                            <td>
                                                {gift.name || gift.id}
                                            </td>

                                            <td>
                                                {gift.rewardName || "None"}
                                            </td>

                                            <td>
                                                x{gift.amount ?? 0}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>


                        {zombieGifts.length > 4 && (
                            <div className="za-management-more">
                                +{zombieGifts.length - 4} more gifts...
                            </div>
                        )}

                    </div>


                    <button
                        className="za-management-button za-gift-button"
                        onClick={() => openManagement("gift")}
                    >
                        Manage Gift Rewards
                    </button>

                </section>

            </div>


            {/* =====================================================
                LIKE REWARD MODAL
                ===================================================== */}

            {managementModal === "like" && (

                <div
                    className="za-modal-overlay"
                    onMouseDown={event => {

                        if (
                            event.target === event.currentTarget
                        ) {
                            closeManagement();
                        }

                    }}
                >

                    <div className="za-modal za-reward-modal">

                        <div className="za-modal-header">

                            <div>
                                <h2>
                                    Manage Like Rewards
                                </h2>

                                <p>
                                    Configure TikTok like milestones and rewards.
                                </p>
                            </div>

                            <button
                                className="za-modal-close"
                                onClick={closeManagement}
                            >
                                ×
                            </button>

                        </div>


                        <div className="za-modal-body">

                            <LikeRewards
                                rewards={likeRewards}
                                loading={likeRewardLoading}
                                saving={likeRewardSaving}
                                editingId={editingLikeRewardId}
                                form={likeRewardForm}
                                setForm={setLikeRewardForm}
                                onEdit={editLikeReward}
                                onSave={saveLikeReward}
                                onDelete={deleteLikeReward}
                                onCancel={resetLikeReward}
                            />

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                FOLLOW REWARD MODAL
                ===================================================== */}

            {managementModal === "follow" && (

                <div
                    className="za-modal-overlay"
                    onMouseDown={event => {

                        if (
                            event.target === event.currentTarget
                        ) {
                            closeManagement();
                        }

                    }}
                >

                    <div className="za-modal za-reward-modal">

                        <div className="za-modal-header">

                            <div>
                                <h2>
                                    Manage Follow Rewards
                                </h2>

                                <p>
                                    Configure rewards given to new followers.
                                </p>
                            </div>

                            <button
                                className="za-modal-close"
                                onClick={closeManagement}
                            >
                                ×
                            </button>

                        </div>


                        <div className="za-modal-body">

                            <FollowRewards
                                rewards={followRewards}
                                loading={followRewardLoading}
                                saving={followRewardSaving}
                                editingId={editingFollowRewardId}
                                form={followRewardForm}
                                setForm={setFollowRewardForm}
                                onEdit={editFollowReward}
                                onSave={saveFollowReward}
                                onDelete={deleteFollowReward}
                                onCancel={resetFollowReward}
                            />

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                GIFT REWARD MODAL
                ===================================================== */}

            {managementModal === "gift" && (

                <div
                    className="za-modal-overlay"
                    onMouseDown={event => {

                        if (
                            event.target === event.currentTarget
                        ) {
                            closeManagement();
                        }

                    }}
                >

                    <div className="za-modal za-reward-modal">

                        <div className="za-modal-header">

                            <div>
                                <h2>
                                    Manage Gift Rewards
                                </h2>

                                <p>
                                    Configure TikTok gifts and their rewards.
                                </p>
                            </div>

                            <button
                                className="za-modal-close"
                                onClick={closeManagement}
                            >
                                ×
                            </button>

                        </div>


                        <div className="za-modal-body">

                            <ZombieGiftRewards
                                gifts={zombieGifts}
                                loading={giftLoading}
                                saving={giftSaving}
                                editingId={editingGiftId}
                                form={giftForm}
                                setForm={setGiftForm}
                                onEdit={editZombieGift}
                                onSave={saveZombieGift}
                                onDelete={deleteZombieGift}
                                onCancel={resetZombieGift}
                            />

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                ERROR
                ===================================================== */}

            {error && (

                <section className="za-card">

                    <div className="za-error">
                        Error: {error}
                    </div>

                </section>

            )}

        </div>
    );
}