// ==========================================
// src/pages/OverviewPage.jsx
// ==========================================

export default function OverviewPage({ status, logs }) {

    const { tiktok, minecraft, stats } = status

    return (
        <div>
            <div className="page-title">Overview</div>
            <div className="page-subtitle">Live status ng iyong Mob Battle system</div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-box">
                    <div className="stat-number" style={{ color: 'var(--accent-red)' }}>
                        {stats.totalLikes}
                    </div>
                    <div className="stat-label">❤️ Likes</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number" style={{ color: 'var(--accent-blue)' }}>
                        {stats.totalFollows}
                    </div>
                    <div className="stat-label">➕ Follows</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number" style={{ color: 'var(--accent-yellow)' }}>
                        {stats.totalGifts}
                    </div>
                    <div className="stat-label">🎁 Gifts</div>
                </div>
            </div>

            {/* Connection Status */}
            <div className="card">
                <div className="card-title">Connection Status</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                🎵 TikTok LIVE
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                @{tiktok.username}
                                {tiktok.roomId ? ` · Room ${tiktok.roomId}` : ''}
                            </div>
                        </div>
                        <div className={`status-badge ${tiktok.connected ? 'connected' : 'disconnected'}`}>
                            <span className="status-dot" />
                            {tiktok.connected ? 'Live' : 'Offline'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                ⛏️ Minecraft (LCon)
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                ws://localhost:8115
                            </div>
                        </div>
                        <div className={`status-badge ${minecraft.connected ? 'connected' : 'disconnected'}`}>
                            <span className="status-dot" />
                            {minecraft.connected ? 'Connected' : 'Offline'}
                        </div>
                    </div>

                </div>
            </div>

            {/* Live Log */}
            <div className="card">
                <div className="card-title">Live Event Log</div>
                <div className="log-feed">
                    {logs.length === 0 && (
                        <div className="log-entry">Waiting for events...</div>
                    )}
                    {logs.map(log => (
                        <div key={log.id} className={`log-entry ${log.type}`}>
                            <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>
                                {log.time}
                            </span>
                            {log.message}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}