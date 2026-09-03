export default function ApocalypseHeader() {
    return (
        <header className="za-header">

            <div className="za-header-left">

                <div className="za-header-icon">
                    ☣
                </div>

                <div className="za-header-text">

                    <h1>
                        Zombie Apocalypse
                    </h1>

                    <p>
                        Live monitor and control for Zombie Apocalypse system.
                    </p>

                </div>

            </div>


            <div className="za-header-right">

                <div className="za-auto-refresh">

                    <span className="za-live-dot" />

                    <span>
                        Auto-refresh:
                    </span>

                    <strong>
                        ON
                    </strong>

                </div>
            </div>

        </header>
    );
}