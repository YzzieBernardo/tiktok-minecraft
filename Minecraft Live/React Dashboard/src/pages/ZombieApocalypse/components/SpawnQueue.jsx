export default function SpawnQueue({ queuedZombies = 0 }) {
    return (
        <section className="za-queue-card">

            <div className="za-queue-icon">
                ◷
            </div>

            <div className="za-queue-content">
                <div className="za-queue-title">
                    SPAWN QUEUE
                </div>

                <div className="za-queue-label">
                    Queued Zombies
                </div>

                <p className="za-queue-description">
                    Zombies waiting for an available spawn slot.
                </p>
            </div>

            <div className="za-queue-count">
                {queuedZombies}
            </div>

        </section>
    );
}