export default function SpawnQueue({
    queuedZombies,
}) {

    return (
        <section className="za-card">

            <div className="za-card-title">
                SPAWN QUEUE
            </div>

            <div className="za-queue-row">

                <div>

                    <div className="za-label">
                        Queued Zombies
                    </div>

                    <div className="za-description">
                        Zombies waiting for an
                        available spawn slot.
                    </div>

                </div>

                <div className="za-queue-count">
                    {queuedZombies}
                </div>

            </div>

        </section>
    )
}