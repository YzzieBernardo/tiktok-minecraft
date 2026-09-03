export default function LiveStatus({
    activeZombies,
    maxActiveZombies,
    queuedZombies,
    totalSpawned,
}) {
    return (
        <div className="za-live-metrics">

            {/* ACTIVE ZOMBIES */}

            <div className="za-live-metric">

                <div className="za-live-metric-icon za-zombie-metric-icon">
                    ☠
                </div>

                <div className="za-live-metric-content">

                    <div className="za-live-metric-label">
                        ACTIVE ZOMBIES
                    </div>

                    <div className="za-live-metric-value">
                        {activeZombies ?? "—"}
                    </div>

                    <div className="za-live-metric-subtitle">
                        <span className="za-live-dot" />
                        Live
                    </div>

                </div>

            </div>


            {/* ZOMBIE LIMIT */}

            <div className="za-live-metric">

                <div className="za-live-metric-icon za-limit-metric-icon">
                    ♟
                </div>

                <div className="za-live-metric-content">

                    <div className="za-live-metric-label">
                        ZOMBIE LIMIT
                    </div>

                    <div className="za-live-metric-value">
                        {maxActiveZombies ?? "—"}
                    </div>

                    <div className="za-live-metric-subtitle">
                        Maximum
                    </div>

                </div>

            </div>


            {/* SPAWN QUEUE */}

            <div className="za-live-metric">

                <div className="za-live-metric-icon za-queue-metric-icon">
                    ◷
                </div>

                <div className="za-live-metric-content">

                    <div className="za-live-metric-label">
                        SPAWN QUEUE
                    </div>

                    <div className="za-live-metric-value">
                        {queuedZombies ?? 0}
                    </div>

                    <div className="za-live-metric-subtitle">
                        Queued
                    </div>

                </div>

            </div>

            {/* TOTAL SPAWNED */}

            <div className="za-live-metric">

                <div className="za-live-metric-icon za-total-metric-icon">
                    ☠
                </div>

                <div className="za-live-metric-content">

                    <div className="za-live-metric-label">
                        TOTAL SPAWNED
                    </div>

                    <div className="za-live-metric-value">
                        {totalSpawned ?? 0}
                    </div>

                    <div className="za-live-metric-subtitle">
                        Total
                    </div>

                </div>

            </div>

        </div>
    );
}