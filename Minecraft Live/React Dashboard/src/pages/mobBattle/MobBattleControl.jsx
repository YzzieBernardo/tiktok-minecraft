//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\pages\mobBattle\MobBattleControl.jsx
export default function MobBattleControl({
    running,
    loading,
    toggleMobBattle
}) {

    return (
        <section className="minecraft-card mob-battle-control-card">

            <div className="mob-battle-control">

                {/* ==========================================
                    STATUS
                    ========================================== */}

                <div className="mob-battle-status">

                    <div className="minecraft-card-title">
                        MOB BATTLE STATUS
                    </div>

                    <div
                        className={`minecraft-status ${
                            running
                                ? "is-online"
                                : ""
                        }`}
                    >

                        <span className="status-dot" />

                        {running
                            ? "ONLINE"
                            : "OFFLINE"}

                    </div>

                </div>


                {/* ==========================================
                    DESCRIPTION
                    ========================================== */}

                <div className="mob-battle-description">

                    <div className="mob-battle-description-title">
                        Mob Battle
                    </div>

                    <p className="minecraft-helper">
                        Mob Battle controls
                        gift-based mob spawning
                        and team combat.
                    </p>

                    <p className="minecraft-helper">
                        When enabled, eligible
                        TikTok gifts can spawn
                        mobs for their assigned team.
                    </p>

                </div>


                {/* ==========================================
                    CONTROL BUTTON
                    ========================================== */}

                <div className="mob-battle-control-actions">

                    <button
                        type="button"
                        className={`btn ${
                            running
                                ? "btn-danger-outline"
                                : "btn-primary"
                        }`}
                        onClick={toggleMobBattle}
                        disabled={loading}
                    >

                        {loading
                            ? "Working..."
                            : running
                                ? "⚔ Turn OFF"
                                : "⚔ Turn ON"}

                    </button>

                </div>

            </div>

        </section>
    );
}