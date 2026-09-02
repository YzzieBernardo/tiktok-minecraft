export default function SpawnConfiguration({
    state,
    setState,
    saving,
    onSave,
}) {

    return (
        <section className="za-card">

            <div className="za-card-title">
                SPAWN CONFIGURATION
            </div>

            <div className="za-config-grid">

                <label className="za-field">

                    <span>
                        Maximum Zombies
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={
                            state.maxActiveZombies
                        }
                        onChange={event =>
                            setState(prev => ({
                                ...prev,
                                maxActiveZombies:
                                    event.target.value,
                            }))
                        }
                    />

                </label>


                <label className="za-field">

                    <span>
                        Minimum Spawn Range
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={
                            state.minSpawnRange
                        }
                        onChange={event =>
                            setState(prev => ({
                                ...prev,
                                minSpawnRange:
                                    event.target.value,
                            }))
                        }
                    />

                </label>


                <label className="za-field">

                    <span>
                        Maximum Spawn Range
                    </span>

                    <input
                        type="number"
                        min="1"
                        value={
                            state.maxSpawnRange
                        }
                        onChange={event =>
                            setState(prev => ({
                                ...prev,
                                maxSpawnRange:
                                    event.target.value,
                            }))
                        }
                    />

                </label>

            </div>


            <div className="za-actions">

                <button
                    className="btn btn-primary"
                    onClick={onSave}
                    disabled={saving}
                >
                    {saving
                        ? 'Saving...'
                        : 'Save Configuration'}
                </button>

            </div>

        </section>
    )
}