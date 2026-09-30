export default function CatalogItemModal({
    open,
    editingItem,
    form,
    catalogDefinitions,
    setForm,
    onClose,
    onSave,
    saving
}) {

    if (!open) {
        return null;
    }

    const isEditing = editingItem !== null;

    const selectedCatalog =
        catalogDefinitions.find(
            item => item.key === form.catalog
        );

    function updateField(field, value) {

        setForm(previous => ({
            ...previous,
            [field]: value
        }));

    }

    return (
        <div className="catalog-modal-backdrop">

            <div className="catalog-modal">

                <div className="catalog-modal-header">

                    <div>
                        <h3>
                            {isEditing
                                ? "EDIT CATALOG ITEM"
                                : "ADD CATALOG ITEM"}
                        </h3>

                        <p>
                            {isEditing
                                ? "Update this catalog entry."
                                : "Add a new entry to the selected catalog."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="catalog-modal-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        ×
                    </button>

                </div>


                <div className="catalog-modal-body">

                    {/* CATALOG */}

                    <div className="field-group">

                        <label>
                            CATALOG
                        </label>

                        <select
                            value={form.catalog}
                            onChange={event =>
                                updateField(
                                    "catalog",
                                    event.target.value
                                )
                            }
                            disabled={isEditing || saving}
                        >

                            {catalogDefinitions.map(
                                catalog => (

                                    <option
                                        key={catalog.key}
                                        value={catalog.key}
                                    >
                                        {catalog.label}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ID */}

                    <div className="field-group">

                        <label>
                            ID
                        </label>

                        <input
                            type="text"
                            value={form.id}
                            onChange={event =>
                                updateField(
                                    "id",
                                    event.target.value
                                )
                            }
                            placeholder={
                                form.catalog === "mobs"
                                    ? "minecraft:zombie"
                                    : "minecraft:diamond_sword"
                            }
                            disabled={saving}
                        />

                    </div>


                    {/* DISPLAY NAME */}

                    <div className="field-group">

                        <label>
                            DISPLAY NAME
                        </label>

                        <input
                            type="text"
                            value={form.name}
                            onChange={event =>
                                updateField(
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder={
                                selectedCatalog?.label ||
                                "Display name"
                            }
                            disabled={saving}
                        />

                    </div>


                    {/* ARMOR SLOT */}

                    {form.catalog === "armor" && (

                        <div className="field-group">

                            <label>
                                ARMOR SLOT
                            </label>

                            <select
                                value={form.slot}
                                onChange={event =>
                                    updateField(
                                        "slot",
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                            >

                                <option value="">
                                    Select slot...
                                </option>

                                <option value="helmet">
                                    Helmet
                                </option>

                                <option value="chestplate">
                                    Chestplate
                                </option>

                                <option value="leggings">
                                    Leggings
                                </option>

                                <option value="boots">
                                    Boots
                                </option>

                            </select>

                        </div>

                    )}


                    {/* WEAPON / TOOL TYPE */}

                    {(
                        form.catalog === "weapons" ||
                        form.catalog === "tools"
                    ) && (

                        <div className="field-group">

                            <label>
                                TYPE
                            </label>

                            <input
                                type="text"
                                value={form.type}
                                onChange={event =>
                                    updateField(
                                        "type",
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    form.catalog === "weapons"
                                        ? "sword"
                                        : "pickaxe"
                                }
                                disabled={saving}
                            />

                        </div>

                    )}


                    {/* ENCHANTMENT MAX LEVEL */}

                    {form.catalog === "enchantments" && (

                        <div className="field-group">

                            <label>
                                MAX LEVEL
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={form.maxLevel}
                                onChange={event =>
                                    updateField(
                                        "maxLevel",
                                        Math.max(
                                            1,
                                            Math.floor(
                                                Number(
                                                    event.target.value
                                                ) || 1
                                            )
                                        )
                                    )
                                }
                                disabled={saving}
                            />

                        </div>

                    )}

                </div>


                <div className="catalog-modal-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={onSave}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : isEditing
                                ? "Save Changes"
                                : "Add Item"}
                    </button>

                </div>

            </div>

        </div>
    );
}