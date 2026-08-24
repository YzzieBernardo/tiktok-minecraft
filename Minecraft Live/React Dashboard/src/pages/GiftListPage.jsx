// ==========================================
// src/pages/GiftListPage.jsx
// ==========================================

import { zombieGiftListA } from '../../../gift/teamA/zombieGiftList.js'
import { mutantGiftListA } from '../../../gift/teamA/mutantGiftList.js'
import { zombieGiftListB } from '../../../gift/teamB/zombieGiftList.js'
import { mutantGiftListB } from '../../../gift/teamB/mutantGiftList.js'
import { bombList } from '../../../gift/bombList.js'

// ==========================================
// HELPER — Total mobs sa isang gift
// ==========================================

function totalNormal(gift) {
    return (gift.zombie || 0) +
           (gift.skeleton || 0) +
           (gift.creeper || 0) +
           (gift.enderman || 0)
}

function totalMutant(gift) {
    return (gift.mutantZombies || 0) +
           (gift.mutantSkeletons || 0) +
           (gift.mutantCreepers || 0) +
           (gift.mutantEndermen || 0) +
           (gift.mutantOthers || 0)
}

// ==========================================
// GIFT ROW COMPONENT
// ==========================================

function GiftRow({ id, zombie, mutant }) {
    const hasNormal = totalNormal(zombie) > 0
    const hasMutant = totalMutant(mutant) > 0

    return (
        <tr>
            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {zombie.name}
            </td>
            <td style={{ color: 'var(--accent-yellow)' }}>
                {zombie.coins}
            </td>

            {/* Normal Mobs */}
            <td>
                {hasNormal ? (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {zombie.zombie > 0 && <MobChip label="🧟" count={zombie.zombie} />}
                        {zombie.skeleton > 0 && <MobChip label="💀" count={zombie.skeleton} />}
                        {zombie.creeper > 0 && <MobChip label="💚" count={zombie.creeper} />}
                        {zombie.enderman > 0 && <MobChip label="🖤" count={zombie.enderman} />}
                    </div>
                ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
            </td>

            {/* Mutant Mobs */}
            <td>
                {hasMutant ? (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {mutant.mutantZombies > 0 && <MobChip label="☠️Z" count={mutant.mutantZombies} color="var(--accent-red)" />}
                        {mutant.mutantSkeletons > 0 && <MobChip label="☠️S" count={mutant.mutantSkeletons} color="var(--accent-red)" />}
                        {mutant.mutantCreepers > 0 && <MobChip label="☠️C" count={mutant.mutantCreepers} color="var(--accent-red)" />}
                        {mutant.mutantEndermen > 0 && <MobChip label="☠️E" count={mutant.mutantEndermen} color="var(--accent-red)" />}
                    </div>
                ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
            </td>

            {/* Total */}
            <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                {totalNormal(zombie) + totalMutant(mutant)}
            </td>
        </tr>
    )
}

function MobChip({ label, count, color = 'var(--text-secondary)' }) {
    return (
        <span style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '1px 6px',
            fontSize: '11px',
            color,
            whiteSpace: 'nowrap'
        }}>
            {label} ×{count}
        </span>
    )
}

// ==========================================
// TEAM TABLE
// ==========================================

function TeamTable({ zombieList, mutantList, teamColor, teamLabel }) {
    const ids = Object.keys(zombieList).sort(
    (a, b) => zombieList[a].coins - zombieList[b].coins
)
    return (
        <div className="card">
            <div className="card-title" style={{ color: teamColor }}>
                {teamLabel}
            </div>
            <table className="gift-table">
                <thead>
                    <tr>
                        <th>Gift</th>
                        <th>Coins</th>
                        <th>Normal Mobs</th>
                        <th>Mutant Mobs</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {ids.map(id => (
                        <GiftRow
                            key={id}
                            id={id}
                            zombie={zombieList[id]}
                            mutant={mutantList[id] || {}}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// ==========================================
// MAIN PAGE
// ==========================================

export default function GiftListPage() {
    return (
        <div>
            <div className="page-title">Gift List</div>
            <div className="page-subtitle">
                Lahat ng registered gifts — normal at mutant mobs
            </div>

            {/* Team A */}
            <TeamTable
                zombieList={zombieGiftListA}
                mutantList={mutantGiftListA}
                teamColor="var(--accent-red)"
                teamLabel="🔴 Team A Gifts"
            />

            {/* Team B */}
            <TeamTable
                zombieList={zombieGiftListB}
                mutantList={mutantGiftListB}
                teamColor="var(--accent-blue)"
                teamLabel="🔵 Team B Gifts"
            />

            {/* Bombs */}
            <div className="card">
                <div className="card-title" style={{ color: 'var(--accent-yellow)' }}>
                    💣 Ballistix Bombs — Neutral
                </div>
                <table className="gift-table">
                    <thead>
                        <tr>
                            <th>Gift</th>
                            <th>Coins</th>
                            <th>Blast Type</th>
                            <th>Fuse</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(bombList).map(([id, gift]) => (
                            <tr key={id}>
                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                    {gift.name}
                                </td>
                                <td style={{ color: 'var(--accent-yellow)' }}>
                                    {gift.coins}
                                </td>
                                <td style={{ color: 'var(--accent-purple)', textTransform: 'capitalize' }}>
                                    💥 {gift.blast}
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>
                                    {gift.fuse}ms
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}