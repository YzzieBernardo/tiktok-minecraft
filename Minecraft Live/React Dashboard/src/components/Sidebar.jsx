export default function Sidebar({ activePage, onNavigate, status, onRefresh }) {

    const tiktokConnected = status?.tiktok?.connected
    const minecraftConnected = status?.minecraft?.connected

    const navItems = [
        {
            section: 'OVERVIEW',
            items: [
                { id: 'overview', icon: '📊', label: 'Overview' },
            ]
        },
        {
            section: 'TIKTOK',
            items: [
                { id: 'tiktok', icon: '🎵', label: 'TikTok Connection' },
                { id: 'social', icon: '❤️', label: 'Likes & Follows' },
                { id: 'gifts', icon: '🎁', label: 'Gift List' },
            ]
        },
        {
            section: 'MINECRAFT',
            items: [
                { id: 'minecraft', icon: '⛏️', label: 'Minecraft' },
            ]
        },
    ]

    return (
        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <h1>⚔️ Mob Battle</h1>
                <p>TikTok × Minecraft</p>
            </div>

            {/* Status Pills */}
            <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            }}>
                <div className={`status-badge ${tiktokConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-dot" />
                    TikTok {tiktokConnected ? 'Live' : 'Offline'}
                </div>
                <div className={`status-badge ${minecraftConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-dot" />
                    Minecraft {minecraftConnected ? 'Connected' : 'Offline'}
                </div>
            </div>

            {/* Refresh Button */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={onRefresh}
                >
                    🔄 Refresh Status
                </button>
            </div>

            {/* Nav Items */}
            {navItems.map(section => (
                <div className="sidebar-section" key={section.section}>
                    <div className="sidebar-section-label">{section.section}</div>
                    {section.items.map(item => (
                        <div
                            key={item.id}
                            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>
            ))}

        </div>
    )
}