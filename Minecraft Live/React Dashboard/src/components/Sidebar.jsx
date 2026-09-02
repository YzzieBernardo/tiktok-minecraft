//Minecraft Live/React Dashboard/src/components/Sidebar.jsx
const navigationSections = [
    {
        section: 'Overview',
        items: [{ id: 'overview', icon: '▦', label: 'Overview' }],
    },
    {
        section: 'TikTok Live',
        items: [
            { id: 'tiktok', icon: '◉', label: 'TikTok Connection' },
            { id: 'social', icon: '♥', label: 'Likes & Follows' },
            { id: 'gifts', icon: '◆', label: 'Gift List' },
        ],
    },
{
    section: 'Minecraft',
    items: [{ id: 'minecraft', icon: '◈', label: 'Minecraft' }],
},
{
    section: 'Zombie Apocalypse',
    items: [
        {
            id: 'zombie-apocalypse',
            icon: '☠',
            label: 'Zombie Apocalypse',
        },
    ],
},

{
    section: 'Mob Battle',
    items: [
        {
            id: 'mob-battle',
            icon: '⚔',
            label: 'Mob Battle',
        },
    ],
},
]

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

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="sidebar-kicker">Live control center</span>
                <h1>Mob Battle</h1>
                <p>TikTok × Minecraft</p>
            </div>

            <div className="sidebar-controls">
                <section className="sidebar-panel">
                    <div className="sidebar-panel-heading">
                        <span>Minecraft LCon</span>
                        <span className={`connection-indicator ${minecraftConnected ? 'is-online' : ''}`} />
                    </div>
                    <button
                        className={`btn sidebar-action ${minecraftConnected ? 'btn-danger-outline' : 'btn-primary'}`}
                        disabled={minecraftLoading}
                        onClick={minecraftConnected ? onStopMinecraft : onStartMinecraft}
                    >
                        {minecraftLoading
                            ? 'Connecting…'
                            : minecraftConnected
                                ? 'Disconnect Minecraft'
                                : 'Connect Minecraft'}
                    </button>
                    <p className="sidebar-helper">
                        {minecraftConnected ? 'LCon is connected' : 'Waiting for LCon'}
                    </p>
                </section>

                <div className="status-stack" aria-label="Connection status">
                    <div className={`status-badge ${tiktokConnected ? 'connected' : 'disconnected'}`}>
                        <span className="status-dot" />
                        TikTok {tiktokConnected ? 'Live' : 'Offline'}
                    </div>
                    <div className={`status-badge ${minecraftConnected ? 'connected' : 'disconnected'}`}>
                        <span className="status-dot" />
                        Minecraft {minecraftConnected ? 'Connected' : 'Offline'}
                    </div>
                </div>

                <button className="btn btn-ghost sidebar-action" onClick={onRefresh}>
                    Refresh status
                </button>

                <section className="sidebar-panel sidebar-panel-compact">
                    <div className="sidebar-panel-heading">Gift chat filter</div>
                    <button
                        className={`btn sidebar-action ${giftFilterEnabled ? 'btn-success-outline' : 'btn-danger-outline'}`}
                        onClick={onToggleGiftFilter}
                    >
                        {giftFilterEnabled ? 'Gift filter on' : 'Gift filter off'}
                    </button>
                    <p className="sidebar-helper">
                        {giftFilterEnabled
                            ? 'Gift + number messages are blocked'
                            : 'Gift messages are allowed'}
                    </p>
                </section>

                <button
                    className={`btn sidebar-action ${botRunning ? 'btn-danger-outline' : 'btn-success-outline'}`}
                    onClick={botRunning ? onStopBot : onStartBot}
                    disabled={botLoading}
                >
                    {botLoading ? 'Working…' : botRunning ? 'Stop bot' : 'Start bot'}
                </button>
            </div>

            <nav className="sidebar-navigation" aria-label="Dashboard navigation">
                {navigationSections.map(section => (
                    <div className="sidebar-section" key={section.section}>
                        <div className="sidebar-section-label">{section.section}</div>
                        {section.items.map(item => (
                            <button
                                key={item.id}
                                className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className="icon" aria-hidden="true">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    )
}
