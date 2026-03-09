import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import TopImage from "../../img/slon-large.png";
import { Search, X, ChevronDown, Folder, Layers, ExternalLink, Eye, Table, CheckSquare, Cpu, Terminal, Tool, Book } from "react-feather";
import "./style.css";

// ✅ IMPORTANT: Put your published CSV links here (3 tabs)
const CSV_MAIN =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi6d5P12AvwsVh5EjWHZbX5Hyu5tXco2aECP8SXoCEiTMHaV3Lc_gb9XtXYFwJekd3nGdbKUrFVbNg/pub?gid=0&single=true&output=csv";

const CSV_NEW_CATEGORIES =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi6d5P12AvwsVh5EjWHZbX5Hyu5tXco2aECP8SXoCEiTMHaV3Lc_gb9XtXYFwJekd3nGdbKUrFVbNg/pub?gid=2078815382&single=true&output=csv";

const CSV_NEW_PRODUCTS =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi6d5P12AvwsVh5EjWHZbX5Hyu5tXco2aECP8SXoCEiTMHaV3Lc_gb9XtXYFwJekd3nGdbKUrFVbNg/pub?gid=743236726&single=true&output=csv";
const normalizeKey = (k) => String(k || "").trim().toLowerCase();
const clean = (v) => String(v || "").trim();

const formatText = (text) =>
    String(text || "")
        .split(";")
        .map((t) => t.trim())
        .filter(Boolean);

const parseCsv = async (url) => {
    const res = await axios.get(url);
    return new Promise((resolve) => {
        Papa.parse(res.data, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = (results.data || [])
                    .map((r) => {
                        const out = {};
                        Object.keys(r || {}).forEach((k) => (out[normalizeKey(k)] = r[k]));
                        return out;
                    })
                    .filter((r) => Object.values(r).some((v) => clean(v) !== ""));
                resolve(rows);
            },
        });
    });
};

function CatalogV2({
    SHOW_SUB_PRODUCTS = true,
    SHOW_NOT_CATEGORIZED = true,
    SHOW_INACTIVE_PRODUCTS = true,
    onOpenLegacyCode,
}) {
    const [loading, setLoading] = useState(true);

    const [mainRows, setMainRows] = useState([]);
    const [categoriesRows, setCategoriesRows] = useState([]);
    const [productsRows, setProductsRows] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // open sub-products per product key (ex: FLCT-ACRY-STD)
    const [openSub, setOpenSub] = useState([]);

    const [carouselIndex, setCarouselIndex] = useState({});

    const [openNotCat, setOpenNotCat] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);

    const [selectedNotCat, setSelectedNotCat] = useState(null);
    const [driveModal, setDriveModal] = useState({ open: false, message: "" });

    const [selectedSubProduct, setSelectedSubProduct] = useState(null);

    // ✅ Fetch 3 CSVs
    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const [m, c, p] = await Promise.all([
                    parseCsv(CSV_MAIN),
                    parseCsv(CSV_NEW_CATEGORIES),
                    parseCsv(CSV_NEW_PRODUCTS),
                ]);

                setMainRows(m);
                setCategoriesRows(c);
                setProductsRows(p);
            } catch (e) {
                console.error("CatalogV2 CSV load failed:", e);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    // ✅ Map: NEW_CATEGORIES
    // expected headers: ABBREVIATION, NAME
    const categories = useMemo(() => {
        return (categoriesRows || [])
            .map((r) => ({
                code: clean(r["abbreviation"] || r["abbr"] || r["code"]),
                name: clean(r["name"]),
                folder: clean(r["folder"]),
            }))
            .filter((x) => x.code && x.name);
    }, [categoriesRows]);

    const categoriesByCode = useMemo(() => {
        const map = {};
        categories.forEach((c) => (map[c.code] = c.name));
        return map;
    }, [categories]);

    // ✅ Map: NEW_PRODUCTS
    // expected headers: Product, Product name, Prefix, Sufix, Picture, Active, Approved, Description
    const allProducts = useMemo(() => {
        return (productsRows || [])
            .map((r) => {
                const product = clean(r["product"] || r["products"] || r["product code"]);
                const productName = clean(r["product name"] || r["productname"] || r["name"]);
                const pictureRaw = clean(r["picture"] || r["image"] || r["photo"]);
                const pictures = pictureRaw
                    ? pictureRaw.split(";").map((p) => p.trim()).filter(Boolean)
                    : [];
                const active = clean(r["active"] || r["status"]);
                const approved = clean(r["approved"]);
                const spreadsheet = clean(r["spreadsheet"] || r["spreadsheets"]);
                const description = clean(
                    r["description"] ||
                    r["desc"] ||
                    r["product description"] ||
                    r["productdescription"]
                );

                // ✅ strong fallbacks
                const rawPrefix = clean(r["prefix"]);
                const rawSuffix = clean(r["sufix"] || r["suffix"]);

                const split = product ? product.split("-") : [];
                const prefixFromProduct = split[0] ? split[0].trim() : "";
                const suffixFromProduct = split.length > 1 ? split.slice(1).join("-").trim() : "";

                // ✅ Source of truth = PRODUCT code (if present)
                const prefix = prefixFromProduct || rawPrefix;
                const suffix = suffixFromProduct || rawSuffix;

                const driveFolder = clean(r["drive folder"] || r["drive"] || r["folder"]);

                return { product, productName, prefix, suffix, pictures, active, approved, description, driveFolder, spreadsheet };
            })
            .filter((p) => p.product && p.prefix && p.suffix);
    }, [productsRows]);

    const activeProducts = useMemo(() => {
        return allProducts.filter((p) => normalizeKey(p.active) === "yes");
    }, [allProducts]);

    const inactiveProducts = useMemo(() => {
        return allProducts.filter((p) => normalizeKey(p.active) !== "yes");
    }, [allProducts]);

    // ✅ MAIN mapping
    // expected headers in MAIN:
    // Product Code, Name, NEW CATEGORY, NEW CODE, Description, Picture, Drive, Notes, Materials, Machines, Finishing, QuoteSpecs
    const main = useMemo(() => {
        return (mainRows || []).map((r) => ({
            productCode: clean(r["product code"]),
            name: clean(r["name"]),
            newCategory: clean(r["new category"]),
            newCode: clean(r["new code"]),
            description: clean(r["description"]),
            picture: clean(r["picture"]),
            drive: clean(r["drive"]),
            notes: clean(r["notes"]),
            materials: clean(r["materials"]),
            machines: clean(r["machines"]),
            finishing: clean(r["finishing"]),
            quoteSpecs: clean(r["quotespecs"] || r["quote specs"] || r["sfq"]),
            installationDetails: clean(r["installation"] || r["installation details"]),
            type: clean(r["type"]),
        }));
    }, [mainRows]);

    // ✅ Not categorized signs: MAIN rows missing C or D
    const notCategorized = useMemo(() => {
        return main
            .filter((r) => !clean(r.newCategory) || !clean(r.newCode))
            .filter((r) => r.productCode);
    }, [main]);

    // ✅ Build category codes (from active products)
    const usedCategoryCodes = useMemo(() => {
        const set = new Set();

        // from products
        activeProducts.forEach((p) => p.prefix && set.add(p.prefix));

        // fallback from categories sheet (so grid is never empty)
        categories.forEach((c) => c.code && set.add(c.code));

        return Array.from(set);
    }, [activeProducts, categories]);

    // ✅ Category cards list (prefers NEW_CATEGORIES order)
    const displayedCategories = useMemo(() => {
        const fromSheet = categories.filter((c) => usedCategoryCodes.includes(c.code));
        const fromProductsMissing = usedCategoryCodes
            .filter((code) => !fromSheet.some((x) => x.code === code))
            .map((code) => ({ code, name: code, folder: "" }));

        return [...fromSheet, ...fromProductsMissing];
    }, [categories, usedCategoryCodes]);

    const clearSearch = () => setSearch("");

    // ✅ Search filter across:
    // - Category name/code
    // - Product / Product name
    // - Also MAIN product codes (for quick lookup)
    const filteredCategoryCards = useMemo(() => {
        const t = search.toLowerCase().trim();
        if (!t) return displayedCategories;

        return displayedCategories.filter((c) => {
            const catName = (c.name || "").toLowerCase();
            const catCode = (c.code || "").toLowerCase();

            const hasProducts = activeProducts.some((p) => {
                if (p.prefix !== c.code) return false;
                return (
                    p.product.toLowerCase().includes(t) ||
                    (p.productName || "").toLowerCase().includes(t) ||
                    (p.description || "").toLowerCase().includes(t)
                );
            });

            const hasMainCode = main.some((r) => (r.productCode || "").toLowerCase() === t);

            // ✅ NEW: search MAIN items that belong to THIS category
            const hasMainTextMatch = main.some((r) => {
                if (clean(r.newCategory) !== clean(c.code)) return false;

                return (
                    (r.name || "").toLowerCase().includes(t) ||
                    (r.description || "").toLowerCase().includes(t) ||
                    (r.newCode || "").toLowerCase().includes(t)
                );
            });

            return (
                catName.includes(t) ||
                catCode.includes(t) ||
                hasProducts ||
                hasMainCode ||
                hasMainTextMatch
            );
        });
    }, [displayedCategories, search, activeProducts, main]);

    useEffect(() => {
        if (!search) return;

        if (filteredCategoryCards.length === 1 && !selectedCategory) {
            setSelectedCategory(filteredCategoryCards[0]);
        }
    }, [filteredCategoryCards, search, selectedCategory]);

    // ✅ Auto-open when user types exact MAIN Product Code or NEW_PRODUCTS product code
    useEffect(() => {
        const t = search.toLowerCase().trim();
        if (!t) return;

        const matchProduct = activeProducts.find((p) => (p.product || "").toLowerCase() === t);
        if (matchProduct?.prefix) {
            const catName = categoriesByCode[matchProduct.prefix] || matchProduct.prefix;
            setSelectedCategory({ code: matchProduct.prefix, name: catName });
            return;
        }

        const matchMain = main.find((r) => (r.productCode || "").toLowerCase() === t);
        if (matchMain?.newCategory) {
            const catName = categoriesByCode[matchMain.newCategory] || matchMain.newCategory;
            setSelectedCategory({ code: matchMain.newCategory, name: catName });
            return;
        }
    }, [search, activeProducts, main, categoriesByCode]);

    // ✅ Products in selected category
    const productsInCategory = useMemo(() => {
        if (!selectedCategory?.code) return [];
        const t = search.toLowerCase().trim();

        const list = activeProducts.filter((p) => p.prefix === selectedCategory.code);

        if (!t) return list;

        return list.filter(
            (p) =>
                (p.product || "").toLowerCase().includes(t) ||
                (p.productName || "").toLowerCase().includes(t) ||
                (p.description || "").toLowerCase().includes(t)
        );
    }, [selectedCategory, activeProducts, search]);

    const mainInCategory = useMemo(() => {
        if (!selectedCategory?.code) return [];
        const t = search.toLowerCase().trim();

        return main
            .filter((r) => clean(r.newCategory) === clean(selectedCategory.code))
            .filter((r) => {
                if (!t) return true;

                return (
                    (r.productCode || "").toLowerCase().includes(t) ||
                    (r.name || "").toLowerCase().includes(t) ||
                    (r.description || "").toLowerCase().includes(t) ||
                    (r.newCode || "").toLowerCase().includes(t)
                );
            });
    }, [main, selectedCategory, search]);

    const getCategoryPreview = (code) => {
        const t = search.toLowerCase().trim();

        // If searching, try to find matching product first
        if (t) {
            const match = activeProducts.find(
                (p) =>
                    p.prefix === code &&
                    (
                        (p.product || "").toLowerCase().includes(t) ||
                        (p.productName || "").toLowerCase().includes(t) ||
                        (p.description || "").toLowerCase().includes(t)
                    ) &&
                    p.pictures?.length
            );

            if (match) return match.pictures[0];
        }

        // fallback (original behavior)
        const first = activeProducts.find((p) => p.prefix === code && p.pictures?.length);
        return first?.pictures?.[0] || "";
    };

    // ✅ Sub-products from MAIN for a given NEW_PRODUCTS item (prefix+suffix)
    const getSubProducts = (prefix, suffix) => {
        return main
            .filter((r) => clean(r.newCategory) === clean(prefix) && clean(r.newCode) === clean(suffix))
            .filter((r) => r.name || r.description || r.picture);
    };

    return (
        <div className="container">
            <img src={TopImage} alt="SLON" className="logo fadeIn" />

            <div className="searchContainer fadeIn">
                <Search className="searchIcon" />
                <input
                    type="text"
                    placeholder="Search category, product or code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className="clearBtn" onClick={clearSearch}>
                        <X size={24} style={{ color: "#333", marginBottom: "-5px" }} />
                    </button>
                )}
                {/* SEARCH TIPS */}

                {!loading && !search && (
                    <div className="tipsContainer fadeIn">
                        <p className="tipsTitle">Quick search examples:</p>

                        <div className="suggestions">
                            {[
                                "FILL-HALO-STD",
                                "Letters",
                                "Illuminated",
                                "Service",
                                "CABI-PUSH-CST",
                            ].map((tip) => (
                                <button key={tip} onClick={() => setSearch(tip)}>
                                    {tip}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            {loading && (
                <div className="loadingWrapper">
                    <div className="spinner"></div>
                    <p>Loading Catalog V2...</p>
                </div>
            )}

            {!loading && (
                <>

                    {/* CATEGORY GRID */}
                    <div className="categoryGrid-catV2">
                        {filteredCategoryCards.map((cat, index) => (
                            <div
                                key={cat.code}
                                className="categoryCard fadeIn"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                <div className="catTop">
                                    <div className="catIcon">
                                        <Layers size={16} />
                                    </div>
                                    <p className="catV2Code">{cat.code}</p>

                                </div>
                                <div className="catText">
                                    <h3 className="catV2Title">{cat.name}</h3>
                                </div>

                                <div className="catPreview">
                                    {getCategoryPreview(cat.code) ? (
                                        <img src={getCategoryPreview(cat.code)} alt="" />
                                    ) : (
                                        <div className="catPreviewPh" />
                                    )}
                                </div>

                                <div className="catV2Meta">
                                    <span className="catV2Count">
                                        <strong>{activeProducts.filter((p) => p.prefix === cat.code).length}</strong> item(s)
                                    </span>

                                    {cat.folder && (
                                        <button
                                            className="catFolderBtn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(cat.folder, "_blank", "noreferrer");
                                            }}
                                        >
                                            <Folder size={16} />
                                            Category Folder
                                            {/* <ExternalLink size={14} style={{ marginBottom: "-2px" }} /> */}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* SPECIAL SECTIONS */}
                    {(SHOW_NOT_CATEGORIZED || SHOW_INACTIVE_PRODUCTS) && (
                        <div className="specialSections fadeIn">

                            {/* {SHOW_NOT_CATEGORIZED && (
                                <div className="specialBlock">
                                    <button
                                        className={`specialHeaderBtn ${openNotCat ? "open" : ""}`}
                                        onClick={() => setOpenNotCat(!openNotCat)}
                                        type="button"
                                    >
                                        <div className="specialHeaderLeft">
                                            <h3>Not Categorized Signs</h3>
                                            <span className="specialBadge">{notCategorized.length}</span>
                                        </div>
                                        <ChevronDown className={`specialArrow ${openNotCat ? "rotate" : ""}`} size={20} />
                                    </button>

                                    <div className={`specialBody ${openNotCat ? "open" : ""}`}>
                                        {notCategorized.length === 0 ? (
                                            <p className="specialEmpty">Nothing here 🎉</p>
                                        ) : (
                                            <div className="notCatCards">
                                                {notCategorized.slice(0, 80).map((r, idx) => (
                                                    <button
                                                        key={`${r.productCode}-${idx}`}
                                                        className="notCatCard"
                                                        type="button"
                                                        onClick={() => setSelectedNotCat(r)}
                                                        title="Open details"
                                                    >
                                                        <div className="notCatImg">
                                                            {r.picture ? <img src={r.picture} alt="" /> : <div className="notCatPh" />}
                                                        </div>
                                                        <div className="notCatInfo">
                                                            <div className="notCatCode">{r.productCode}</div>
                                                            <div className="notCatName">{r.name || ""}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )} */}

                            {SHOW_INACTIVE_PRODUCTS && (
                                <div className="specialBlock">
                                    <button
                                        className={`specialHeaderBtn ${openInactive ? "open" : ""}`}
                                        onClick={() => setOpenInactive(!openInactive)}
                                        type="button"
                                    >
                                        <div className="specialHeaderLeft">
                                            <h3>Inactive Products</h3>
                                            <span className="specialBadge">{inactiveProducts.length}</span>
                                        </div>
                                        <ChevronDown className={`specialArrow ${openInactive ? "rotate" : ""}`} size={20} />
                                    </button>

                                    <div className={`specialBody ${openInactive ? "open" : ""}`}>
                                        {inactiveProducts.length === 0 ? (
                                            <p className="specialEmpty">Nothing here 🎉</p>
                                        ) : (
                                            <div className="inactiveList">
                                                {inactiveProducts.slice(0, 80).map((p, idx) => (
                                                    <div key={`${p.product}-${idx}`} className="inactiveItem">
                                                        <div className="inactiveLeft">
                                                            <div className="inactiveTitle">{p.productName || p.product}</div>
                                                            <div className="inactiveCode">{p.product}</div>
                                                        </div>
                                                        <div className="inactiveRight">{p.prefix}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* MODAL */}
            {selectedCategory && !loading && (
                <div
                    className="modalOverlay"
                    onClick={() => {
                        setSearch("");
                        setSelectedCategory(null);
                        setOpenSub([]);
                    }}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader-catV2">
                            <div className="modalTitleWrapper">
                                <h2>{selectedCategory.name}</h2>


                                <p className="modalSubTitle">
                                    <span className="modalCatPill">Category</span>
                                    <span className="modalCatCode">{selectedCategory.code}</span>
                                </p>
                            </div>

                            <X
                                size={28}
                                style={{ cursor: "pointer" }}
                                className="closeBtn"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory(null);
                                    setOpenSub([]);
                                }}
                            />
                        </div>

                        <div className="seeAllDiv">
                            {search && (
                                <button
                                    className="seeAllBtn"
                                    onClick={() => setSearch("")}
                                >
                                    <Eye size={16} style={{ marginBottom: "-3px", marginRight: "10px" }} />
                                    See all products of this category
                                </button>
                            )}
                        </div>


                        {productsInCategory.length === 0 && (
                            <div className="emptyCategoryBox">
                                <div className="emptyCategoryTitle">
                                    No NEW products found in this category ({selectedCategory.code}).
                                </div>

                                <div className="emptyCategorySub">
                                    Showing Sub-products instead:
                                </div>

                                <div className="subGrid">
                                    {mainInCategory.slice(0, 80).map((s, i) => (
                                        <div key={`main-${s.productCode || i}`} className="subCard">
                                            <div className="subImg">
                                                {s.picture ? <img src={s.picture} alt="" /> : <div className="subImgPh" />}
                                            </div>

                                            <div className="subInfo">
                                                <div className="subName">
                                                    {s.name || "—"} | {s.productCode || ""}
                                                </div>

                                                <div className="subDesc" style={{ marginLeft: "0px" }}>
                                                    {s.description || ""}
                                                </div>

                                                <div className="subName" style={{ fontSize: "12px", marginBlock: "20px", fontWeight: "500" }}>
                                                    Product code: <br></br> <strong style={{ fontSize: "16px" }}> {selectedCategory.code}-{s.newCode || ""} </strong>
                                                </div>

                                                {/* {s.drive && s.drive !== "#N/A" && (
                                                    <a
                                                        href={s.drive}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="subDrive"
                                                    >
                                                        <Folder size={16} style={{ marginRight: "8px", marginBottom: "-2px" }} />
                                                        Drive
                                                    </a>
                                                )} */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="productGrid">
                            {productsInCategory.map((item, index) => {
                                const key = item.product;
                                const sub = SHOW_SUB_PRODUCTS ? getSubProducts(item.prefix, item.suffix) : [];

                                return (
                                    <div
                                        key={key}
                                        className={`productCard fadeIn`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="imageWrapper">
                                            {item.pictures?.length > 0 && (
                                                <img
                                                    src={
                                                        item.pictures[
                                                        carouselIndex[item.product] || 0
                                                        ]
                                                    }
                                                    alt=""
                                                />
                                            )}
                                        </div>

                                        <div className="cardContent">
                                            <h4 style={{ marginBlock: "5px" }}>{item.productName || item.product}</h4>
                                            <span className="code" style={{ marginBottom: "15px" }}>{item.product}</span>

                                            {/* DESCRIPTION ABOVE COUNT */}
                                            {item.description && (
                                                <p className="v2Description">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="v2ActionRow">

                                                {/* NUMBER OF SIGNS */}
                                                {/* <div className="v2CountRow">
                                                    <span className="v2CountBadge">
                                                        {sub.length} sign(s)
                                                    </span>
                                                </div> */}

                                                {/* DRIVE FOLDER */}
                                                <button
                                                    type="button"
                                                    className="catFolderBtn"
                                                    onClick={() => {
                                                        if (item.driveFolder) {
                                                            window.open(item.driveFolder, "_blank", "noreferrer");
                                                        } else {
                                                            setDriveModal({ open: true, message: "Drive folder not available" });
                                                        }
                                                    }}
                                                >
                                                    <Folder size={17} style={{ marginBottom: "0px" }} />
                                                    Product Folder
                                                    {/* <ExternalLink size={13} style={{ marginBottom: "1px" }} /> */}
                                                </button>

                                                {/* SPREADSHEET ABOVE COUNT */}
                                                <button
                                                    type="button"
                                                    className="catSpreadsheetBtn"
                                                    onClick={() => {
                                                        if (item.spreadsheet) {
                                                            window.open(item.spreadsheet, "_blank", "noreferrer");
                                                        } else {
                                                            setDriveModal({ open: true, message: "Spreadsheet not available" });
                                                        }
                                                    }}
                                                >
                                                    <Table size={17} style={{ marginBottom: "0px" }} />
                                                    <span >Spreadsheet</span>
                                                    <ExternalLink size={13} style={{ marginBottom: "1px", marginLeft: "1px" }} />
                                                </button>
                                            </div>

                                            {/* MINI CAROUSEL */}
                                            {/* {item.pictures?.length > 1 && ( */}
                                            <div className="miniCarousel">
                                                {item.pictures.map((pic, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={pic}
                                                        alt=""
                                                        className={`miniThumb ${(carouselIndex[item.product] || 0) === idx
                                                            ? "active"
                                                            : ""
                                                            }`}
                                                        onClick={() =>
                                                            setCarouselIndex({
                                                                ...carouselIndex,
                                                                [item.product]: idx,
                                                            })
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            {/* )} */}

                                            {/* NOT CATEGORIZED DETAILS MODAL */}
                                            {/* {selectedNotCat && (
                                                <div
                                                    className="modalOverlay"
                                                    onClick={() => setSelectedNotCat(null)}
                                                >
                                                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                                                        <div className="modalHeader">
                                                            <div className="modalTitleWrapper">
                                                                <h2>{selectedNotCat.name || selectedNotCat.productCode}</h2>
                                                                <p className="modalSubTitle">
                                                                    <span className="modalCatPill">Legacy Code</span>
                                                                    <span className="modalCatCode">{selectedNotCat.productCode}</span>
                                                                </p>
                                                            </div>

                                                            <X
                                                                size={28}
                                                                style={{ cursor: "pointer" }}
                                                                className="closeBtn"
                                                                onClick={() => setSelectedNotCat(null)}
                                                            />
                                                        </div>

                                                        <div className="notCatDetailBody">
                                                            <div className="notCatDetailTop">
                                                                <div className="notCatDetailImg">
                                                                    {selectedNotCat.picture ? <img src={selectedNotCat.picture} alt="" /> : <div className="notCatDetailPh" />}
                                                                </div>

                                                                <div className="notCatDetailInfo">
                                                                    {selectedNotCat.description && <p className="notCatDetailDesc">{selectedNotCat.description}</p>}

                                                                    <div className="notCatDetailActions">
                                                                        <button
                                                                            type="button"
                                                                            className="v2PrimaryBtn"
                                                                            onClick={() => onOpenLegacyCode?.(selectedNotCat.productCode)}
                                                                        >
                                                                            Open in Legacy
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="v2DriveBtn"
                                                                            onClick={() => {
                                                                                if (selectedNotCat.drive && selectedNotCat.drive !== "#N/A") {
                                                                                    window.open(selectedNotCat.drive, "_blank", "noreferrer");
                                                                                } else {
                                                                                    setDriveModal({ open: true, message: "Drive folder not available" });
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Folder size={16} style={{ marginBottom: "-2px" }} />
                                                                            Drive Folder
                                                                            <ExternalLink size={14} style={{ marginBottom: "-2px" }} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="notCatDetailGrid">
                                                                {selectedNotCat.materials && (
                                                                    <div className="notCatDetailBox">
                                                                        <div className="notCatDetailLabel">Materials</div>
                                                                        <div className="notCatDetailText">{selectedNotCat.materials}</div>
                                                                    </div>
                                                                )}

                                                                {selectedNotCat.machines && (
                                                                    <div className="notCatDetailBox">
                                                                        <div className="notCatDetailLabel">Machines</div>
                                                                        <div className="notCatDetailText">{selectedNotCat.machines}</div>
                                                                    </div>
                                                                )}

                                                                {selectedNotCat.finishing && (
                                                                    <div className="notCatDetailBox">
                                                                        <div className="notCatDetailLabel">Finishing</div>
                                                                        <div className="notCatDetailText">{selectedNotCat.finishing}</div>
                                                                    </div>
                                                                )}

                                                                {selectedNotCat.quoteSpecs && (
                                                                    <div className="notCatDetailBox">
                                                                        <div className="notCatDetailLabel">SFQ</div>
                                                                        <div className="notCatDetailText">{selectedNotCat.quoteSpecs}</div>
                                                                    </div>
                                                                )}

                                                                {selectedNotCat.notes && (
                                                                    <div className="notCatDetailBox">
                                                                        <div className="notCatDetailLabel">Notes</div>
                                                                        <div className="notCatDetailText">{selectedNotCat.notes}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )} */}


                                            {/* SUB-PRODUCTS (FROM MAIN) */}
                                            {SHOW_SUB_PRODUCTS && (
                                                <>
                                                    <button
                                                        className="specToggle"
                                                        onClick={() => {
                                                            if (openSub.includes(key)) {
                                                                setOpenSub(openSub.filter((k) => k !== key));
                                                            } else {
                                                                setOpenSub([...openSub, key]);
                                                            }
                                                        }}
                                                    >
                                                        <p style={{ color: "#333", fontWeight: "400", marginLeft: "-5px" }}>
                                                            Sub-products ({sub.length})
                                                        </p>

                                                        <ChevronDown
                                                            size={24}
                                                            className={`machineryArrow ${openSub.includes(key) ? "rotate" : ""
                                                                }`}
                                                        />
                                                    </button>

                                                    {openSub.includes(key) && (
                                                        <div className="subProductsWrap">
                                                            {sub.length === 0 ? (
                                                                <p className="subEmpty">No sub-products found in MAIN.</p>
                                                            ) : (
                                                                <div className="subGrid">
                                                                    {sub.map((s, i) => (
                                                                        <div
                                                                            key={`${key}-sub-${i}`}
                                                                            className="subCard"
                                                                            onClick={() => setSelectedSubProduct(s)}
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            <div className="subImg">
                                                                                {s.picture ? <img src={s.picture} alt="" /> : <div className="subImgPh" />}
                                                                            </div>
                                                                            <div className="subInfo">
                                                                                <div className="subName">{s.name || "—"} <h4 style={{ color: "#c53b3b" }}>{s.productCode || ""}</h4></div>
                                                                                <div className="subDesc">{s.description || ""}</div>

                                                                                {/* {s.drive && s.drive !== "#N/A" && (
                                                                                    <a
                                                                                        href={s.drive}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="subDrive"
                                                                                    >
                                                                                        <Folder size={16} style={{ marginRight: "8px", marginBottom: "-2px" }} />
                                                                                        Drive
                                                                                    </a>
                                                                                )} */}
                                                                            </div>

                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {selectedSubProduct && (
                <div
                    className="modalOverlay"
                    onClick={() => setSelectedSubProduct(null)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <div className="modalHeader">
                            <div className="modalTitleWrapper">
                                <h2>{selectedSubProduct.name || selectedSubProduct.productCode}</h2>

                                <p className="modalSubTitle">
                                    <span className="modalCatPill">Legacy Code</span>
                                    <span className="modalCatCode">{selectedSubProduct.productCode}</span>
                                </p>
                            </div>

                            <X
                                size={28}
                                style={{ cursor: "pointer" }}
                                className="closeBtn"
                                onClick={() => setSelectedSubProduct(null)}
                            />
                        </div>

                        <div className="notCatDetailBody">

                            <div className="notCatDetailTop">

                                <div className="notCatDetailImg">
                                    {selectedSubProduct.picture ? (
                                        <img src={selectedSubProduct.picture} alt="" />
                                    ) : (
                                        <div className="notCatDetailPh" />
                                    )}
                                </div>

                                <div className="notCatDetailInfo">

                                    {selectedSubProduct.description && (
                                        <p className="notCatDetailDesc">
                                            {/* {selectedSubProduct.description} */}
                                            {formatText(selectedSubProduct.description).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </p>
                                    )}

                                    {selectedSubProduct.drive && selectedSubProduct.drive !== "#N/A" && (
                                        <button
                                            className="v2DriveBtn"
                                            onClick={() =>
                                                window.open(selectedSubProduct.drive, "_blank", "noreferrer")
                                            }
                                        >
                                            <Folder size={16} style={{ marginBottom: "-2px" }} />
                                            Drive Folder
                                        </button>
                                    )}
                                </div>

                            </div>

                            <div className="notCatDetailGrid">

                                {selectedSubProduct.materials && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel"><Book size={17} style={{ marginBottom: "-3px", marginRight:"10PX" }} /> Typical Materials</div>
                                        <div className="notCatDetailText">
                                            {formatText(selectedSubProduct.materials).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSubProduct.machines && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel"><Cpu size={17} style={{ marginBottom: "-3px", marginRight:"10PX" }} /> Machines</div>
                                        <div className="notCatDetailText">
                                            {/* {selectedSubProduct.machines} */}
                                            {formatText(selectedSubProduct.machines).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSubProduct.installationDetails && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel"><Tool size={17} style={{ marginBottom: "-3px", marginRight:"10PX" }} /> Installation details</div>
                                        <div className="notCatDetailText">
                                            {formatText(selectedSubProduct.installationDetails).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSubProduct.finishing && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel"><CheckSquare size={17} style={{ marginBottom: "-3px", marginRight:"10PX" }} /> Finishing</div>
                                        <div className="notCatDetailText">
                                            {/* {selectedSubProduct.finishing} */}
                                            {formatText(selectedSubProduct.finishing).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSubProduct.quoteSpecs && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel"><CheckSquare size={17} style={{ marginBottom: "-3px", marginRight:"10PX" }} /> SFQ</div>
                                        <div className="notCatDetailText">
                                            {/* {selectedSubProduct.quoteSpecs} */}
                                            {formatText(selectedSubProduct.quoteSpecs).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSubProduct.notes && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel"><Terminal size={17} style={{ marginBottom: "-3px", marginRight:"10PX" }}  /> Notes</div>
                                        <div className="notCatDetailText">
                                            {/* {selectedSubProduct.notes} */}
                                            {formatText(selectedSubProduct.notes).map((line, i) => (
                                                <p key={i}>{line}.</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedSubProduct.type && (
                                    <div className="notCatDetailBox">
                                        <div className="notCatDetailLabel">TYPE</div>

                                        <div
                                            className={`typeBadge ${selectedSubProduct.type.toLowerCase() === "standard"
                                                    ? "typeStandard"
                                                    : "typeCustom"
                                                }`}
                                        >
                                            {selectedSubProduct.type}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GLOBAL DRIVE MODAL */}
            {driveModal.open && (
                <div
                    className="modalOverlay"
                    onClick={() => setDriveModal({ open: false, message: "" })}
                >
                    <div
                        className="miniModal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="miniModalTitle">Info</div>
                        <div className="miniModalMsg">{driveModal.message}</div>
                        <button
                            type="button"
                            className="miniModalBtn"
                            onClick={() =>
                                setDriveModal({ open: false, message: "" })
                            }
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CatalogV2;