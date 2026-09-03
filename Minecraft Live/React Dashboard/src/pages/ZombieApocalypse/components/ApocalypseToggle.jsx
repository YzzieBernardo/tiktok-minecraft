export default function ApocalypseToggle({
    running,
    loading,
    onToggle,
}) {
    return (
        <div className="za-system-toggle">

            <div className="za-system-toggle-indicator">

                <div
                    className={
                        running
                            ? "za-power-light za-power-on"
                            : "za-power-light za-power-off"
                    }
                />

            </div>


            <div className="za-system-toggle-info">

                <div className="za-system-toggle-status">
                    {loading
                        ? "..."
                        : running
                            ? "ON"
                            : "OFF"}
                </div>

                <div className="za-system-toggle-description">
                    {running
                        ? "Zombie Apocalypse is active"
                        : "Zombie Apocalypse is disabled"}
                </div>

            </div>


            <button
                type="button"
                className="za-system-toggle-button"
                onClick={onToggle}
                disabled={loading}
            >
                {loading
                    ? "Working..."
                    : running
                        ? "Disable"
                        : "Enable"}
            </button>

        </div>
    );
}