// ==========================================
// src/pages/TikTokPage.jsx
// ==========================================

export default function TikTokPage({ status }) {

    const { tiktok } = status

    return (
        <div>
            <div className="page-title">TikTok Connection</div>
            <div className="page-subtitle">Status ng iyong TikTok LIVE connection</div>

            <div className="card">
                <div className="card-title">Connection Info</div>

                <div className="form-group">
                    <label className="form-label">TikTok Username</label>
                    <input
                        className="form-input"
                        value={`@${tiktok.username}`}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Room ID</label>
                    <input
                        className="form-input"
                        value={tiktok.roomId || 'Not connected'}
                        readOnly
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`status-badge ${tiktok.connected ? 'connected' : 'disconnected'}`}>
                        <span className="status-dot" />
                        {tiktok.connected ? 'Live Now' : 'Offline'}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {tiktok.connected
                            ? 'Receiving TikTok events'
                            : 'Start your TikTok LIVE para kumonekta'}
                    </span>
                </div>
            </div>

            <div className="card">
                <div className="card-title">How It Works</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                        { step: '1', text: 'I-start ang bot: node index.js', color: 'var(--accent-blue)' },
                        { step: '2', text: 'Mag-live ka sa TikTok bilang @' + tiktok.username, color: 'var(--accent-green)' },
                        { step: '3', text: 'Automatic na kumokonekta ang bot sa iyong LIVE', color: 'var(--accent-yellow)' },
                        { step: '4', text: 'Gifts → Mobs spawning sa Minecraft!', color: 'var(--accent-purple)' },
                    ].map(item => (
                        <div key={item.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '24px', height: '24px',
                                borderRadius: '50%',
                                background: item.color,
                                color: '#000',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: 700,
                                flexShrink: 0
                            }}>
                                {item.step}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingTop: '3px' }}>
                                {item.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}