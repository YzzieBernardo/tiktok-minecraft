//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\ZombieApocalypse\components\ApocalypseToggle.jsx
export default function ApocalypseToggle({
    running,
    loading,
    onToggle,
}) {
    return (
        <section className="za-card">

            <div className="za-card-title">
                ZOMBIE APOCALYPSE
            </div>

            <div className="za-status-row">

                <div>
                    <div className="za-label">
                        Zombie Spawning
                    </div>

                    <div className="za-description">
                        {running
                            ? 'Zombie Apocalypse is active.'
                            : 'Zombie Apocalypse is disabled.'}
                    </div>
                </div>

                <button
                    className={
                        running
                            ? 'btn btn-primary'
                            : 'btn btn-ghost'
                    }
                    onClick={onToggle}
                    disabled={loading}
                >
                    {loading
                        ? 'Working...'
                        : running
                            ? '🟢 ON'
                            : '🔴 OFF'}
                </button>

            </div>

        </section>
    );
}