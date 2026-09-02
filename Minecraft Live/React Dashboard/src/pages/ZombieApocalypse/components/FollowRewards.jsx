//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\ZombieApocalypse\components\FollowRewards.jsx
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
    return (
        <section className="za-card">

            <div className="za-card-title">
                ZOMBIE FOLLOW REWARDS
            </div>

            <div className="za-gift-form">

                <label className="za-field">
                    <span>Reward Type</span>

                    <select
                        value={form.rewardType}
                        onChange={event =>
                            setForm(prev => ({
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
                        {form.rewardType === 'mob'
                            ? 'Mob Name'
                            : 'Item Name'}
                    </span>

                    <input
                        type="text"
                        placeholder={
                            form.rewardType === 'mob'
                                ? 'minecraft:zombie'
                                : 'minecraft:diamond'
                        }
                        value={form.rewardName}
                        onChange={event =>
                            setForm(prev => ({
                                ...prev,
                                rewardName: event.target.value,
                            }))
                        }
                    />

                </label>

                <label className="za-field">

                    <span>
                        {form.rewardType === 'mob'
                            ? 'Mob Amount'
                            : 'Item Amount'}
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={form.amount}
                        onChange={event =>
                            setForm(prev => ({
                                ...prev,
                                amount: event.target.value,
                            }))
                        }
                    />

                </label>

            </div>

            <div className="za-actions">

                <button
                    className="btn btn-primary"
                    onClick={onSave}
                    disabled={saving}
                >
                    {saving
                        ? 'Saving...'
                        : editingId !== null
                            ? 'Update Follow Reward'
                            : 'Add Follow Reward'}
                </button>

                {editingId !== null && (
                    <button
                        className="btn btn-ghost"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}

            </div>

            <div className="za-table-wrapper">

                <table className="za-table">

                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Reward</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td colSpan="4">
                                    Loading Follow Rewards...
                                </td>
                            </tr>

                        ) : rewards.length === 0 ? (

                            <tr>
                                <td colSpan="4">
                                    No Follow Rewards configured.
                                </td>
                            </tr>

                        ) : (

                            rewards.map(reward => (

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
                                                    onEdit(reward)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-ghost"
                                                onClick={() =>
                                                    onDelete(reward.id)
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
    );
}