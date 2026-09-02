//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\ZombieApocalypse\components\LiveStatus.jsx
export default function LiveStatus({
    activeZombies,
    maxActiveZombies,
    queuedZombies,
}) {

    return (
        <section className="za-card">

            <div className="za-card-title">
                LIVE STATUS
            </div>

            <div className="za-stats-grid">

                <div className="za-stat">

                    <div className="za-stat-label">
                        ACTIVE ZOMBIES
                    </div>

                    <div className="za-stat-value">
                        {activeZombies}
                    </div>

                </div>


                <div className="za-stat">

                    <div className="za-stat-label">
                        ZOMBIE LIMIT
                    </div>

                    <div className="za-stat-value">
                        {maxActiveZombies}
                    </div>

                </div>


                <div className="za-stat">

                    <div className="za-stat-label">
                        QUEUED
                    </div>

                    <div className="za-stat-value">
                        {queuedZombies}
                    </div>

                </div>

            </div>

        </section>
    )
}