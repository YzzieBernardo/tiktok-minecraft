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

    return (
        <section className="za-card">

            <div className="za-card-title">
                ZOMBIE GIFT REWARDS
            </div>


            <div className="za-gift-form">

                <label className="za-field">

                    <span>
                        TikTok Gift ID
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={form.id}
                        disabled={
                            editingId !== null
                        }
                        onChange={event =>
                            setForm(prev => ({
                                ...prev,
                                id:
                                    event.target.value,
                            }))
                        }
                    />

                </label>


                <label className="za-field">

                    <span>
                        Gift Name
                    </span>

                    <input
                        type="text"
                        value={form.name}
                        onChange={event =>
                            setForm(prev => ({
                                ...prev,
                                name:
                                    event.target.value,
                            }))
                        }
                    />

                </label>


                <label className="za-field">

                    <span>
                        Reward Type
                    </span>

                    <select
                        value={form.rewardType}
                        onChange={event =>
                            setForm(prev => ({
                                ...prev,
                                rewardType:
                                    event.target.value,
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
                                : 'minecraft:bread'
                        }
                        value={
                            form.rewardName
                        }
                        onChange={event =>
                            setForm(prev => ({
                                ...prev,
                                rewardName:
                                    event.target.value,
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
                        value={
                            form.amount
                        }
                        onChange={event =>
                            setForm(prev => ({
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
                    onClick={onSave}
                    disabled={saving}
                >
                    {saving
                        ? 'Saving...'
                        : editingId !== null
                            ? 'Update Gift'
                            : 'Add Gift'}
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
                            <th>TikTok ID</th>
                            <th>Gift</th>
                            <th>Type</th>
                            <th>Reward</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>

                    </thead>


                    <tbody>

                        {loading ? (

                            <tr>
                                <td colSpan="6">
                                    Loading gifts...
                                </td>
                            </tr>

                        ) : gifts.length === 0 ? (

                            <tr>
                                <td colSpan="6">
                                    No Zombie Apocalypse gifts configured.
                                </td>
                            </tr>

                        ) : (

                            gifts.map(gift => (

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
                                                    onEdit(gift)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-ghost"
                                                onClick={() =>
                                                    onDelete(
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
    )
}