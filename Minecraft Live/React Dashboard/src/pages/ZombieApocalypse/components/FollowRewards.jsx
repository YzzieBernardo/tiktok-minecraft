import { useEffect, useState } from "react";

export default function FollowRewards({
    rewards,
    loading,
    saving,
    editingId,
    form,
    setForm,
    onSave,
    onEdit,
    onDelete,
    onCancel,
}) {
    const [manageOpen, setManageOpen] = useState(false);

    function openManage() {
        setManageOpen(true);
    }

    function closeManage() {
        setManageOpen(false);

        if (editingId !== null) {
            onCancel();
        }
    }

    function handleEdit(reward) {
        onEdit(reward);
        setManageOpen(true);
    }

    function handleAddNew() {
        if (editingId !== null) {
            onCancel();
        }
    }

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape" && manageOpen) {
                closeManage();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [manageOpen, editingId]);

    const visibleRewards = rewards.slice(0, 4);

    return (
        <>
            <section className="za-card za-management-card">

                <div className="za-management-header">

                    <div className="za-management-title">
                        <span className="za-management-icon za-follow-icon">
                            ●
                        </span>

                        <span>
                            FOLLOW REWARDS
                        </span>
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
                            {rewards.length}
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
                                <th>
                                    REWARD
                                </th>

                                <th>
                                    TYPE
                                </th>

                                <th>
                                    AMOUNT
                                </th>
                            </tr>
                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="3">
                                        Loading...
                                    </td>
                                </tr>

                            ) : visibleRewards.length === 0 ? (

                                <tr>
                                    <td colSpan="3">
                                        No Follow Rewards configured.
                                    </td>
                                </tr>

                            ) : (

                                visibleRewards.map(reward => (

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

                </div>


                {rewards.length > 4 && (
                    <div className="za-management-more">
                        +{rewards.length - 4} more rewards...
                    </div>
                )}


                <button
                    type="button"
                    className="za-management-button za-follow-button"
                    onClick={openManage}
                >
                    Manage Follow Rewards
                </button>

            </section>


            {manageOpen && (

                <div
                    className="za-modal-overlay"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            closeManage();
                        }
                    }}
                >

                    <div className="za-modal za-reward-modal">

                        <div className="za-modal-header">

                            <div>

                                <h2>
                                    {editingId !== null
                                        ? "Edit Follow Reward"
                                        : "Follow Rewards"}
                                </h2>

                                <p>
                                    Configure rewards given when a viewer follows.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="za-modal-close"
                                onClick={closeManage}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        <div className="za-modal-body">

                            <div className="za-reward-management-toolbar">

                                <div>
                                    <strong>
                                        Configured Rewards
                                    </strong>

                                    <span>
                                        {rewards.length} reward
                                        {rewards.length !== 1 ? "s" : ""}
                                    </span>
                                </div>


                                {editingId !== null && (

                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={handleAddNew}
                                    >
                                        + Add New
                                    </button>

                                )}

                            </div>


                            <div className="za-management-editor">

                                <div className="za-modal-field">

                                    <label>
                                        Reward Type
                                    </label>

                                    <select
                                        value={form.rewardType}
                                        onChange={event =>
                                            setForm(prev => ({
                                                ...prev,
                                                rewardType:
                                                    event.target.value,
                                                rewardName: "",
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

                                </div>


                                <div className="za-modal-field">

                                    <label>
                                        {form.rewardType === "mob"
                                            ? "Mob Name"
                                            : "Item Name"}
                                    </label>

                                    <input
                                        type="text"
                                        placeholder={
                                            form.rewardType === "mob"
                                                ? "minecraft:zombie"
                                                : "minecraft:diamond"
                                        }
                                        value={form.rewardName}
                                        onChange={event =>
                                            setForm(prev => ({
                                                ...prev,
                                                rewardName:
                                                    event.target.value,
                                            }))
                                        }
                                    />

                                </div>


                                <div className="za-modal-field">

                                    <label>
                                        {form.rewardType === "mob"
                                            ? "Mob Amount"
                                            : "Item Amount"}
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={form.amount}
                                        onChange={event =>
                                            setForm(prev => ({
                                                ...prev,
                                                amount:
                                                    event.target.value,
                                            }))
                                        }
                                    />

                                </div>


                                <div className="za-modal-actions">

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={onSave}
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingId !== null
                                                ? "Save Changes"
                                                : "Add Follow Reward"}
                                    </button>


                                    {editingId !== null && (

                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            onClick={onCancel}
                                            disabled={saving}
                                        >
                                            Cancel Edit
                                        </button>

                                    )}

                                </div>

                            </div>


                        <div className="za-management-list za-follow-management-list">
                                <div className="za-management-list-header">

                                    <span>
                                        REWARD
                                    </span>

                                    <span>
                                        TYPE
                                    </span>

                                    <span>
                                        AMOUNT
                                    </span>

                                    <span>
                                        ACTIONS
                                    </span>

                                </div>


                                {loading ? (

                                    <div className="za-management-empty">
                                        Loading Follow Rewards...
                                    </div>

                                ) : rewards.length === 0 ? (

                                    <div className="za-management-empty">
                                        No Follow Rewards configured.
                                    </div>

                                ) : (

                                    rewards.map(reward => (

                                        <div
                                            className="za-management-list-row"
                                            key={reward.id}
                                        >

                                            <span>
                                                {reward.rewardName || "None"}
                                            </span>

                                            <span>
                                                {reward.rewardType === "item"
                                                    ? "Item"
                                                    : "Mob"}
                                            </span>

                                            <span>
                                                x{reward.amount ?? 0}
                                            </span>

                                            <span className="za-management-actions">

                                                <button
                                                    type="button"
                                                    className="btn btn-ghost"
                                                    onClick={() =>
                                                        handleEdit(reward)
                                                    }
                                                    disabled={saving}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-ghost"
                                                    onClick={() =>
                                                        onDelete(reward.id)
                                                    }
                                                    disabled={saving}
                                                >
                                                    Delete
                                                </button>

                                            </span>

                                        </div>

                                    ))

                                )}

                            </div>

                        </div>


                        <div className="za-modal-footer">

                            <button
                                type="button"
                                className="za-modal-cancel"
                                onClick={closeManage}
                                disabled={saving}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </>
    );
}