// ==========================================
// src/pages/SocialPage.jsx
// ==========================================

export default function SocialPage({ status }) {

    const { stats } = status

    return (
        <div>
            <div className="page-title">Likes & Follows</div>
            <div className="page-subtitle">Social events at mob rewards</div>

            <div className="stats-row">
                <div className="stat-box">
                    <div className="stat-number" style={{ color: 'var(--accent-red)' }}>
                        {stats.totalLikes}
                    </div>
                    <div className="stat-label">❤️ Total Likes</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number" style={{ color: 'var(--accent-blue)' }}>
                        {stats.totalFollows}
                    </div>
                    <div className="stat-label">➕ Total Follows</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number" style={{ color: 'var(--accent-green)' }}>
                        {stats.totalGifts}
                    </div>
                    <div className="stat-label">🎁 Total Gifts</div>
                </div>
            </div>

            <div className="card">
                <div className="card-title">Like Rewards — 🔴 Team A</div>
                <div className="toggle-row">
                    <div className="toggle-info">
                        <strong>Every 100 Likes</strong>
                        <span>3 Zombie + 3 Skeleton + 3 Creeper + 3 Enderman → Team A</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-title">Follow Rewards — 🔵 Team B</div>
                <div className="toggle-row">
                    <div className="toggle-info">
                        <strong>Every New Follow</strong>
                        <span>10 Zombie + 10 Skeleton + 10 Creeper + 10 Enderman → Team B</span>
                    </div>
                </div>
            </div>

        </div>
    )
}