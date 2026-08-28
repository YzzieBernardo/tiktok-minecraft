export default function Sidebar({
    activePage,
    onNavigate,
    status,
    onRefresh,
    giftFilterEnabled,
    onToggleGiftFilter,
    minecraftLoading,
    onStartMinecraft,
    onStopMinecraft,
    botRunning,
    botLoading,
    onStartBot,
    onStopBot,
}) {
    
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

                {/* MINECRAFT CONTROL */}
                <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        fontWeight: 600,
                        letterSpacing: '0.5px'
                    }}>
                        MINECRAFT LCON
                    </div>
                    
                    <button
                        className={`btn ${minecraftConnected ? 'btn-ghost' : 'btn-primary'}`}
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            borderColor: minecraftConnected
                                ? 'var(--accent-red)'
                                : 'var(--accent-green)',
                            color: minecraftConnected
                                ? 'var(--accent-red)'
                                : 'var(--accent-green)'
                        }}
                        disabled={minecraftLoading}
                        onClick={
                            minecraftConnected
                                ? onStopMinecraft
                                : onStartMinecraft
                        }
                    >
                        {minecraftLoading
                            ? 'Connecting...'
                            : minecraftConnected
                                ? '⏹ Disconnect Minecraft'
                                : '▶ Connect Minecraft'
                        }
                    </button>

                    <div style={{
                        marginTop: '7px',
                        textAlign: 'center',
                        fontSize: '11px',
                        color: minecraftConnected
                            ? 'var(--accent-green)'
                            : 'var(--text-muted)'
                    }}>
                        {minecraftConnected
                            ? 'LCon is connected'
                            : 'LCon is disconnected'
                        }
                    </div>
                </div>
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

      
{/* GIFT FILTER */}
<div
    style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)'
    }}
>
    <div style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        marginBottom: '8px',
        fontWeight: 600,
        letterSpacing: '0.5px'
    }}>
        GIFT FILTER
    </div>

    <button
        className="btn btn-ghost"
        style={{
            width: '100%',
            justifyContent: 'center',
            borderColor: giftFilterEnabled
                ? 'var(--accent-green)'
                : 'var(--accent-red)',
            color: giftFilterEnabled
                ? 'var(--accent-green)'
                : 'var(--accent-red)'
        }}
        onClick={onToggleGiftFilter}
    >
        {giftFilterEnabled
            ? '🟢 Gift Filter ON'
            : '🔴 Gift Filter OFF'
        }
    </button>

    <div style={{
        marginTop: '7px',
        textAlign: 'center',
        fontSize: '11px',
        color: giftFilterEnabled
            ? 'var(--accent-green)'
            : 'var(--text-muted)'
    }}>
        {giftFilterEnabled
            ? 'Gift + number messages are blocked'
            : 'Gift messages are allowed'
        }
    </div>
</div>

            {/* Bot Start / Stop */}
<div
    style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)'
    }}
>
    <button
        className="btn btn-ghost"
        style={{
            width: '100%',
            justifyContent: 'center'
        }}
        onClick={botRunning ? onStopBot : onStartBot}
        disabled={botLoading}
    >
        {botLoading
            ? '⏳ Starting...'
            : botRunning
                ? '■ Stop Bot'
                : '▶ Start Bot'
        }
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