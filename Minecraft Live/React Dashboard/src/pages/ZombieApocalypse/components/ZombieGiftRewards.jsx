import { useEffect, useState } from "react";

export default function ZombieGiftRewards({
    gifts,
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

    function handleEdit(gift) {
        onEdit(gift);
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

    const visibleGifts = gifts.slice(0, 4);

    return (
        <>
            <section className="za-card za-management-card">

                <div className="za-management-header">

                    <div className="za-management-title">

                        <span className="za-management-icon za-gift-icon">
                            ◆
                        </span>

                        <span>
                            GIFT REWARDS
                        </span>

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
                            {gifts.length}
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
                                    GIFT
                                </th>

                                <th>
                                    REWARD
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

                            ) : visibleGifts.length === 0 ? (

                                <tr>
                                    <td colSpan="3">
                                        No Zombie Apocalypse gifts configured.
                                    </td>
                                </tr>

                            ) : (

                                visibleGifts.map(gift => (

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

                </div>


                {gifts.length > 4 && (
                    <div className="za-management-more">
                        +{gifts.length - 4} more gifts...
                    </div>
                )}


                <button
                    type="button"
                    className="za-management-button za-gift-button"
                    onClick={openManage}
                >
                    Manage Gift Rewards
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
                                        ? "Edit Gift Reward"
                                        : "Gift Rewards"}
                                </h2>

                                <p>
                                    Configure TikTok gifts and their Zombie Apocalypse rewards.
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
                                        Configured Gifts
                                    </strong>

                                    <span>
                                        {gifts.length} gift
                                        {gifts.length !== 1 ? "s" : ""}
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
                                        TikTok Gift ID
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={form.id}
                                        disabled={editingId !== null}
                                        onChange={event =>
                                            setForm(prev => ({
                                                ...prev,
                                                id:
                                                    event.target.value,
                                            }))
                                        }
                                    />

                                </div>


                                <div className="za-modal-field">

                                    <label>
                                        Gift Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Rose"
                                        value={form.name}
                                        onChange={event =>
                                            setForm(prev => ({
                                                ...prev,
                                                name:
                                                    event.target.value,
                                            }))
                                        }
                                    />

                                </div>


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
                                                : "minecraft:bread"
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
                                                : "Add Gift Reward"}
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


                            <div className="za-management-list">

                                <div className="za-management-list-header">

                                    <span>
                                        GIFT
                                    </span>

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
                                        Loading Zombie Gifts...
                                    </div>

                                ) : gifts.length === 0 ? (

                                    <div className="za-management-empty">
                                        No Zombie Apocalypse gifts configured.
                                    </div>

                                ) : (

                                    gifts.map(gift => (

                                        <div
                                            className="za-management-list-row"
                                            key={gift.id}
                                        >

                                            <span>
                                                {gift.name || gift.id}
                                            </span>

                                            <span>
                                                {gift.rewardName || "None"}
                                            </span>

                                            <span>
                                                {gift.action === "give_item"
                                                    ? "Item"
                                                    : "Mob"}
                                            </span>

                                            <span>
                                                x{gift.amount ?? 0}
                                            </span>

                                            <span className="za-management-actions">

                                                <button
                                                    type="button"
                                                    className="btn btn-ghost"
                                                    onClick={() =>
                                                        handleEdit(gift)
                                                    }
                                                    disabled={saving}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-ghost"
                                                    onClick={() =>
                                                        onDelete(gift.id)
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