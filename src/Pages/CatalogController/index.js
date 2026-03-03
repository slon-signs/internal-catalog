import React, { useState } from "react";
import LegacyCatalog from "../LegacyCatalog";
import CatalogV2 from "../CatalogV2";
import "./style.css";

function CatalogController() {
    const [mode, setMode] = useState("v2"); // default = V2

    // ✅ EASY ON/OFF FLAGS (V2 only)
    const SHOW_SUB_PRODUCTS = true;          // MAIN repeated items under product
    const SHOW_NOT_CATEGORIZED = true;       // MAIN rows missing C or D
    const SHOW_INACTIVE_PRODUCTS = true;     // NEW_PRODUCTS Active = "No"

    return (
        <div>
            <div className="catalogToggleWrapper">
                <div className="catalogTogglePill">
                    <button
                        className={`toggleBtn ${mode === "v2" ? "active" : ""}`}
                        onClick={() => setMode("v2")}
                        style={{fontSize:"14px", fontFamily:"sans-serif"}}
                    >
                        New Catalog
                    </button>

                    <button
                        className={`toggleBtn ${mode === "legacy" ? "active" : ""}`}
                        onClick={() => setMode("legacy")}
                    >
                        Legacy
                    </button>

                    <span
                        className="toggleSlider"
                        style={{ transform: mode === "v2" ? "translateX(0px)" : "translateX(130px)" }}
                    />
                </div>
            </div>

            {mode === "v2" ? (
                <CatalogV2
                    SHOW_SUB_PRODUCTS={SHOW_SUB_PRODUCTS}
                    SHOW_NOT_CATEGORIZED={SHOW_NOT_CATEGORIZED}
                    SHOW_INACTIVE_PRODUCTS={SHOW_INACTIVE_PRODUCTS}
                />
            ) : (
                <LegacyCatalog />
            )}
        </div>
    );
}

export default CatalogController;