import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3001'

const emptyGift = {
    id: '',
    name: '',
    coins: 0,
    kind: 'mobs',
    quantity: 1,
    team: 'A',
    zombie: 0,
    skeleton: 0,
    creeper: 0,
    enderman: 0,
    mutantCreepers: 0,
    mutantZombies: 0,
    mutantEndermen: 0,
    mutantSkeletons: 0,
    mutantOthers: 0,
    blast: '',
    fuse: 100,
}

const normalMobFields = ['zombie', 'skeleton', 'creeper', 'enderman']
const mutantMobFields = [
    'mutantCreepers',
    'mutantZombies',
    'mutantEndermen',
    'mutantSkeletons',
    'mutantOthers',
]

function toFormGift(gift) {
    return {
        ...emptyGift,
        ...gift,
        id: String(gift.id),
        kind: gift.blast ? 'bomb' : 'mobs',
        team: gift.team || 'A',
    }
}

function getTotal(gift, fields) {
    return fields.reduce((total, field) => total + Number(gift[field] || 0), 0)
}

function GiftForm({ gift, onCancel, onSaved }) {
    const [form, setForm] = useState(gift)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const isEditing = Boolean(gift.id)

    function updateField(event) {
        const { name, value } = event.target
        setForm(previousForm => ({ ...previousForm, [name]: value }))
    }

   async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
        const response = await fetch(
            isEditing
                ? `${API_URL}/api/gifts/${form.id}`
                : `${API_URL}/api/gifts`,
            {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    quantity: form.kind === 'bomb'
                        ? Number(form.quantity) || 1
                        : 1,
                }),
            },
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Could not save gift')
        }

        onSaved(data.gift)
    } catch (saveError) {
        setError(saveError.message)
    } finally {
        setSaving(false)
    }
}
    return (
        <form className="card" onSubmit={submit}>
            <div className="card-title">
                {isEditing ? `Edit Gift #${form.id}` : 'Add TikTok Gift'}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="gift-id">TikTok Gift ID</label>
                <input
                    id="gift-id"
                    className="form-input"
                    name="id"
                    type="number"
                    min="1"
                    value={form.id}
                    onChange={updateField}
                    disabled={isEditing}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="gift-name">Gift name</label>
                <input
                    id="gift-name"
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="gift-coins">Coins</label>
                <input
                    id="gift-coins"
                    className="form-input"
                    name="coins"
                    type="number"
                    min="0"
                    value={form.coins}
                    onChange={updateField}
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="gift-kind">Reward type</label>
                <select
                    id="gift-kind"
                    className="form-input"
                    name="kind"
                    value={form.kind}
                    onChange={updateField}
                >
                    <option value="mobs">Mob reward</option>
                    <option value="bomb">Ballistix bomb</option>
                </select>
            </div>

            {form.kind === 'bomb' ? (
                <>
                   <div className="form-group">
                    <label className="form-label" htmlFor="gift-quantity">
                        Quantity
                    </label>
                    <input
                        id="gift-quantity"
                        className="form-input"
                        name="quantity"
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={updateField}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="gift-fuse">Fuse (ms)</label>
                        <input
                            id="gift-fuse"
                            className="form-input"
                            name="fuse"
                            type="number"
                            min="0"
                            value={form.fuse}
                            onChange={updateField}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="form-group">
                        <label className="form-label" htmlFor="gift-team">Team</label>
                        <select
                            id="gift-team"
                            className="form-input"
                            name="team"
                            value={form.team}
                            onChange={updateField}
                        >
                            <option value="A">Red Team</option>
                            <option value="B">Blue Team</option>
                        </select>
                    </div>
                    <MobFields title="Normal mobs" fields={normalMobFields} form={form} onChange={updateField} />
                    <MobFields title="Mutant mobs" fields={mutantMobFields} form={form} onChange={updateField} />
                </>
            )}

            {error && <div className="form-error">{error}</div>}

            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" disabled={saving} type="submit">
                    {saving ? 'Saving...' : isEditing ? 'Save Gift' : 'Add Gift'}
                </button>
                {isEditing && (
                    <button className="btn btn-ghost" onClick={onCancel} type="button">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

function MobFields({ title, fields, form, onChange }) {
    return (
        <div className="form-group">
            <div className="form-label">{title}</div>
            <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                {fields.map(field => (
                    <label key={field} style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {field.replace('mutant', 'Mutant ')}
                        <input
                            className="form-input"
                            name={field}
                            type="number"
                            min="0"
                            value={form[field]}
                            onChange={onChange}
                        />
                    </label>
                ))}
            </div>
        </div>
    )
}

function GiftTable({ title, color, gifts, onEdit, onDelete, bombList = false, managing }) {
    return (
        <div className="card">
            <div className="card-title" style={{ color }}>{title}</div>
            <table className="gift-table">
                <thead>
                    <tr>
                        <th>TikTok ID</th>
                        <th>Gift</th>
                        <th>Coins</th>
                        {bombList
                        ? <><th>Blast</th><th>Fuse</th><th>Quantity</th></>
                        : <><th>Normal</th><th>Mutant</th></>}
                        {managing && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {gifts.map(gift => (
                        <tr key={gift.id}>
                            <td style={{ color: 'var(--accent-purple)' }}>{gift.id}</td>
                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{gift.name}</td>
                            <td style={{ color: 'var(--accent-yellow)' }}>{gift.coins}</td>
                       {bombList ? (
    <>
        <td style={{ textTransform: 'capitalize' }}>{gift.blast}</td>
        <td>{gift.fuse}ms</td>
        <td>{gift.quantity ?? 1}</td>
    </>
) : (
                                <>
                                    <td>{getTotal(gift, normalMobFields)}</td>
                                    <td>{getTotal(gift, mutantMobFields)}</td>
                                </>
                            )}
                            {managing && (
                                <td style={{ display: 'flex', gap: '6px' }}>
                                    <button className="btn btn-ghost" onClick={() => onEdit(gift)} type="button">Edit</button>
                                    <button className="btn btn-ghost" onClick={() => onDelete(gift)} type="button">Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {!gifts.length && (
                        <tr><td colSpan={managing ? 6 : 5}>No gifts in this group.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default function GiftListPage() {
    const [gifts, setGifts] = useState([])
    const [editingGift, setEditingGift] = useState(null)
    const [managing, setManaging] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isCurrent = true

        fetch(`${API_URL}/api/gifts`)
            .then(async response => {
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Could not load gifts')
                }

                return data
            })
            .then(data => {
                if (isCurrent) {
                    setGifts(data)
                }
            })
            .catch(loadError => {
                if (isCurrent) {
                    setError(loadError.message)
                }
            })
            .finally(() => {
                if (isCurrent) {
                    setLoading(false)
                }
            })

        return () => {
            isCurrent = false
        }
    }, [])

    async function deleteGift(gift) {
        if (!window.confirm(`Delete ${gift.name} (TikTok ID ${gift.id})?`)) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/gifts/${gift.id}`, { method: 'DELETE' })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Could not delete gift')
            }

            setGifts(previousGifts => previousGifts.filter(item => item.id !== gift.id))
            if (editingGift?.id === gift.id) {
                setEditingGift(null)
            }
        } catch (deleteError) {
            setError(deleteError.message)
        }
    }

    function handleSaved(savedGift) {
        setGifts(previousGifts => {
            const exists = previousGifts.some(gift => gift.id === savedGift.id)
            const nextGifts = exists
                ? previousGifts.map(gift => gift.id === savedGift.id ? savedGift : gift)
                : [...previousGifts, savedGift]

            return nextGifts
        })
        setEditingGift(null)
    }

    function toggleManager() {
        setManaging(previousManaging => !previousManaging)
        setEditingGift(null)
    }

    function startEditing(gift) {
        setEditingGift(gift)
        setManaging(true)
    }

    const sortByCoins = (first, second) => first.coins - second.coins
    const redGifts = gifts.filter(gift => !gift.blast && gift.team === 'A').sort(sortByCoins)
    const blueGifts = gifts.filter(gift => !gift.blast && gift.team === 'B').sort(sortByCoins)
    const bombGifts = gifts.filter(gift => gift.blast).sort(sortByCoins)

    return (
        <div>
            <div className="page-title">Gift List Manager</div>
            <div className="page-subtitle">TikTok Gift IDs, teams, mob rewards, and Ballistix bombs</div>

            <div style={{ margin: '16px 0' }}>
                <button className="btn btn-primary" onClick={toggleManager} type="button">
                    {managing ? 'Close Gift Manager' : 'Manage Gift List'}
                </button>
            </div>

            {managing && (
                <GiftForm
                    key={editingGift?.id || 'new'}
                    gift={editingGift ? toFormGift(editingGift) : emptyGift}
                    onCancel={() => setEditingGift(null)}
                    onSaved={handleSaved}
                />
            )}

            {error && <div className="form-error">{error}</div>}
            {loading ? (
                <div className="card">Loading gifts...</div>
            ) : (
                <>
                    <GiftTable title="Red Team Gifts" color="var(--accent-red)" gifts={redGifts} onEdit={startEditing} onDelete={deleteGift} managing={managing} />
                    <GiftTable title="Blue Team Gifts" color="var(--accent-blue)" gifts={blueGifts} onEdit={startEditing} onDelete={deleteGift} managing={managing} />
                    <GiftTable title="Ballistix Bombs" color="var(--accent-yellow)" gifts={bombGifts} onEdit={startEditing} onDelete={deleteGift} bombList managing={managing} />
                </>
            )}
        </div>
    )
}
