export default function CatalogManagement({
    catalogs,
    catalogDefinitions,
    openCatalog,
    catalogSearch,
    catalogsLoading,
    toggleCatalog,
    setCatalogSearch,
    getFilteredCatalogItems,
    refreshCatalogs,
    openCatalogAdd,
    openCatalogEdit,
    deleteCatalogItem
}) {
    function getMetadataLabel(catalogKey) {
        if (catalogKey === "armor") {
            return "SLOT";
        }

        if (
            catalogKey === "weapons" ||
            catalogKey === "tools"
        ) {
            return "TYPE";
        }

        if (catalogKey === "enchantments") {
            return "MAX LEVEL";
        }

        return null;
    }

    function getMetadataValue(catalogKey, item) {
        if (catalogKey === "armor") {
            return item.slot || "—";
        }

        if (
            catalogKey === "weapons" ||
            catalogKey === "tools"
        ) {
            return item.type || "—";
        }

        if (catalogKey === "enchantments") {
            return item.maxLevel ?? "—";
        }

        return null;
    }

    return (
        <section className="panel catalog-management-panel">

            {/* =====================================================
                HEADER
                ===================================================== */}

            <div className="catalog-management-header">

                <div className="catalog-management-heading">

                    <h2>
                        CATALOG MANAGEMENT
                    </h2>

                    <p>
                        Manage the Minecraft mobs and equipment
                        available in your loadout selectors.
                    </p>

                </div>


                <div className="catalog-management-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={refreshCatalogs}
                        disabled={catalogsLoading}
                    >
                        {catalogsLoading
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>


                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => openCatalogAdd()}
                    >
                        + Add
                    </button>

                </div>

            </div>


            {/* =====================================================
                CATALOG CATEGORIES
                ===================================================== */}

            <div className="catalog-category-list">

                {catalogDefinitions.map((catalog) => {

                    const isOpen =
                        openCatalog === catalog.key;

                    const items =
                        catalogs[catalog.key] || [];

                    const filteredItems =
                        getFilteredCatalogItems(
                            catalog.key
                        );

                    const metadataLabel =
                        getMetadataLabel(
                            catalog.key
                        );


                    return (
                        <div
                            key={catalog.key}
                            className={`catalog-category ${
                                isOpen
                                    ? "catalog-category-open"
                                    : ""
                            }`}
                        >

                            {/* =================================================
                                CATEGORY HEADER
                                ================================================= */}

                            <button
                                type="button"
                                className="catalog-category-header"
                                onClick={() =>
                                    toggleCatalog(
                                        catalog.key
                                    )
                                }
                            >

                                <span className="catalog-category-arrow">
                                    {isOpen ? "▼" : "▶"}
                                </span>


                                <span className="catalog-category-name">
                                    {catalog.label}
                                </span>


                                <span className="catalog-category-count">
                                    {items.length}
                                </span>

                            </button>


                            {/* =================================================
                                CATEGORY CONTENT
                                ================================================= */}

                            {isOpen && (

                                <div className="catalog-category-content">

                                    {/* =========================================
                                        SEARCH / ADD
                                        ========================================= */}

                                    <div className="catalog-search-row">

                                        <input
                                            type="text"
                                            value={
                                                catalogSearch[
                                                    catalog.key
                                                ] || ""
                                            }
                                            onChange={(event) =>
                                                setCatalogSearch(
                                                    (previous) => ({
                                                        ...previous,
                                                        [catalog.key]:
                                                            event.target.value
                                                    })
                                                )
                                            }
                                            placeholder={`Search ${catalog.label.toLowerCase()}...`}
                                        />


                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                openCatalogAdd(
                                                    catalog.key
                                                )
                                            }
                                        >
                                            + Add
                                        </button>

                                    </div>


                                    {/* =========================================
                                        TABLE
                                        ========================================= */}

                                    <div className="catalog-table-wrapper">

                                        <table className="catalog-table">

                                            <thead>

                                                <tr>

                                                    <th className="catalog-table-name">
                                                        NAME
                                                    </th>

                                                    <th className="catalog-table-id">
                                                        MINECRAFT ID
                                                    </th>

                                                    {metadataLabel && (
                                                        <th className="catalog-table-metadata">
                                                            {metadataLabel}
                                                        </th>
                                                    )}

                                                    <th className="catalog-table-actions">
                                                        ACTIONS
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {filteredItems.length === 0 ? (

                                                    <tr>

                                                        <td
                                                            colSpan={
                                                                metadataLabel
                                                                    ? 4
                                                                    : 3
                                                            }
                                                            className="catalog-table-empty"
                                                        >
                                                            {catalogSearch[
                                                                catalog.key
                                                            ]
                                                                ? "No matching items found."
                                                                : "No items found."}
                                                        </td>

                                                    </tr>

                                                ) : (

                                                    filteredItems.map(
                                                        (item) => (

                                                            <tr
                                                                key={
                                                                    item.id
                                                                }
                                                            >

                                                                {/* NAME */}

                                                                <td className="catalog-table-name">

                                                                    <span className="catalog-item-name">
                                                                        {item.name}
                                                                    </span>

                                                                </td>


                                                                {/* MINECRAFT ID */}

                                                                <td className="catalog-table-id">

                                                                    <code>
                                                                        {item.id}
                                                                    </code>

                                                                </td>


                                                                {/* METADATA */}

                                                                {metadataLabel && (

                                                                    <td className="catalog-table-metadata">

                                                                        <span>
                                                                            {getMetadataValue(
                                                                                catalog.key,
                                                                                item
                                                                            )}
                                                                        </span>

                                                                    </td>

                                                                )}


                                                                {/* ACTIONS */}

                                                                <td className="catalog-table-actions">

                                                                    <div className="catalog-item-actions">

                                                                        <button
                                                                            type="button"
                                                                            className="secondary-button"
                                                                            onClick={() =>
                                                                                openCatalogEdit(
                                                                                    catalog.key,
                                                                                    item
                                                                                )
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </button>


                                                                        <button
                                                                            type="button"
                                                                            className="danger-button"
                                                                            onClick={() =>
                                                                                deleteCatalogItem(
                                                                                    catalog.key,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                    </div>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            )}

                        </div>
                    );

                })}

            </div>

        </section>
    );
}