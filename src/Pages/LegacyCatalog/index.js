import React, { useEffect, useState, useMemo } from "react";
import MachinerySection from "../InfraSection/index";
import CategorySpecsModal from "../CategorySpecs/index";
import ProductionTimelineSection from "../TimelineSection/index";
import axios from "axios";
import Papa from "papaparse";
import {
  Type,
  Box,
  Image,
  Layers,
  X,
  Search,
  Tool,
  Zap,
  Sidebar,
  Shuffle,
  Sun,
  Folder,
  ChevronDown,
  Umbrella,
  ChevronsRight
} from "react-feather";
import "./style.css";
import TopImage from "../../img/slon-large.png";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi6d5P12AvwsVh5EjWHZbX5Hyu5tXco2aECP8SXoCEiTMHaV3Lc_gb9XtXYFwJekd3nGdbKUrFVbNg/pub?output=csv";

function LegacyCatalog() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const [openSpecs, setOpenSpecs] = useState([]);

  const [showMachinery, setShowMachinery] = useState(false);
  const [showCategorySpecs, setShowCategorySpecs] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  /* FETCH CSV */

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(CSV_URL);

      Papa.parse(response.data, {
        header: true,
        complete: (results) => {
          const active = results.data.filter(
            (item) => item.Status === "Active"
          );
          setData(active);
          setLoading(false);
        },
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    setShowCategorySpecs(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (search) {
      setShowCategorySpecs(false);
    }
  }, [search]);

  /* FILTER */

  const filteredProducts = useMemo(() => {
    const text = search.toLowerCase();
    return data.filter(
      (item) =>
        item.Name?.toLowerCase().includes(text) ||
        item.Category?.toLowerCase().includes(text) ||
        item["Product Code"]?.toLowerCase().includes(text)
    );
  }, [data, search]);

  const categories = useMemo(() => {
    return [...new Set(filteredProducts.map((p) => p.Category))];
  }, [filteredProducts]);

  /* AUTO OPEN IF CODE */

  useEffect(() => {
    if (!search) return;

    const exact = data.find(
      (item) =>
        item["Product Code"]?.toLowerCase() === search.toLowerCase()
    );

    if (exact) {
      setSelectedCategory(exact.Category);
      setHighlightedProduct(exact["Product Code"]);
    }
  }, [search, data]);

  const getCategoryIcon = (category) => {
    const name = category.toLowerCase();
    if (name.includes("channel"))
      return (
        <>
          <Type size={38} style={{ marginRight: "-9px" }} />
          <Sun size={12} style={{ marginBottom: "4px" }} />
        </>
      );
    if (name.includes("acrylic")) return (<Type size={38} />);
    if (name.includes("awning")) return <Umbrella size={38} />;
    if (name.includes("box")) return <Box size={38} />;
    if (name.includes("print")) return <Image size={38} />;
    if (name.includes("plaque")) return <Shuffle size={38} />;
    if (name.includes("fiber")) return <Zap size={38} />;
    if (name.includes("blade")) return <Sidebar size={38} />;
    if (name.includes("illuminated")) return <Sun size={38} />;
    if (name.includes("service")) return <Tool size={38} />;
    return <Layers size={38} />;
  };

  const clearSearch = () => setSearch("");

  return (
    <div className="container">

      <img src={TopImage} alt="SLON" className="logo fadeIn" />

      <div className="searchContainer fadeIn">
        <Search className="searchIcon" />
        <input
          type="text"
          placeholder="Search sign, category or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clearBtn" onClick={clearSearch}>
            <X size={24} style={{ color: "#333", marginBottom: "-5px" }} />
          </button>
        )}
      </div>

      {loading && (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading signs...</p>
        </div>
      )}

      {/* SEARCH TIPS */}

      {!loading && !search && (
        <div className="tipsContainer fadeIn">
          <p className="tipsTitle">Quick search examples:</p>
          <div className="suggestions">
            {["CLCS1001", "LBPS1201", "Letters", "Illuminated", "Service"].map((tip) => (
              <button
                key={tip}
                onClick={() => setSearch(tip)}
              >
                {tip}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div className="categoryGrid">
          {categories.map((cat, index) => {
            const productsInside = filteredProducts.filter(
              (p) => p.Category === cat
            );

            return (
              <div
                key={cat}
                className="categoryCard-legacy fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedCategory(cat)}
              >
                {getCategoryIcon(cat)}
                <h3>{cat}</h3>

                {/* SHOW PRODUCTS IF FEW CATEGORIES */}
                {categories.length <= 3 && (
                  <div className="miniProductList">
                    {productsInside.slice(0, 4).map((p) => (
                      <div key={p["Product Code"]} className="miniProductItem">
                        <span className="miniCode">{p["Product Code"]}</span>
                        <span className="miniSeparator"> — </span>
                        <span className="miniName">{p.Name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !search && !selectedCategory && (
        <div className={`machineryContainer ${showMachinery ? "open" : ""}`}>

          <button
            className="machineryButton"
            onClick={() => setShowMachinery(!showMachinery)}
          >
            <span> <ChevronsRight size={22} style={{ marginBottom: "-3px" }} /> Machinery / Infrastructure</span>
            <ChevronDown
              size={28}
              className={`machineryArrow ${showMachinery ? "rotate" : ""}`}
            />
          </button>

          <MachinerySection isOpen={showMachinery} />

          <div className={`machineryContainer ${showTimeline ? "open" : ""}`} style={{ marginTop: "30px" }}>

            <button
              className="machineryButton"
              onClick={() => setShowTimeline(!showTimeline)}
            >
              <span> <ChevronsRight size={22} style={{ marginBottom: "-3px" }} /> Production Timeline Standards</span>
              <ChevronDown
                size={28}
                className={`machineryArrow ${showTimeline ? "rotate" : ""}`}
              />
            </button>

            <ProductionTimelineSection isOpen={showTimeline} />

          </div>


        </div>
      )}

      {/* MODAL */}

      {selectedCategory && (
        <div
          className="modalOverlay"
          onClick={() => {
            setSelectedCategory(null);
            setHighlightedProduct(null);
            setOpenSpecs([]);
            setShowCategorySpecs(false);
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modalHeader">
              <div className="modalTitleWrapper">
                <h2>{selectedCategory}</h2>

                <button
                  className="categorySpecsBtn"
                  onClick={() => setShowCategorySpecs(true)}
                >
                  See category specifications
                </button>
              </div>

              <X
                size={28}
                style={{ cursor: "pointer" }}
                className="closeBtn"
                onClick={() => {
                  setSelectedCategory(null);
                  setHighlightedProduct(null);
                  setOpenSpecs([]);
                }}
              />
            </div>

            <div className="productGrid">
              {filteredProducts
                .filter((p) => p.Category === selectedCategory)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`productCard fadeIn ${highlightedProduct === item["Product Code"]
                      ? "highlight"
                      : ""
                      }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="imageWrapper">
                      {item.Picture && <img src={item.Picture} alt="" />}
                    </div>

                    <div className="cardContent">
                      <h4>{item.Name}</h4>
                      <span className="code">
                        {item["Product Code"]}
                      </span>

                      <p>{(item.Description|| "").split("➤")[1]?.trim() || ""}</p>

                      <button
                        className="specToggle"
                        onClick={() => {
                          const code = item["Product Code"];

                          if (openSpecs.includes(code)) {
                            setOpenSpecs(openSpecs.filter((c) => c !== code));
                          } else {
                            setOpenSpecs([...openSpecs, code]);
                          }
                        }}

                      >

                        <p style={{ color: "#333", fontWeight: "400", marginLeft: "-5px" }}>Specifications</p>

                        <ChevronDown
                          size={24}
                          className={`machineryArrow ${openSpecs.includes(item["Product Code"]) ? "rotate" : ""
                            }`}
                        />
                      </button>

                      {openSpecs.includes(item["Product Code"]) && (
                        <div className="specContent">
                          {/* <p><strong>Description:</strong> {item.Description}</p> */}
                          <p><strong>Materials:</strong> {item.Materials}</p>
                          {/* <p><strong>Finishing:</strong> {item.Finishing}</p> */}
                          <p><strong>Machines:</strong> {item.Machines}</p>
                          <p><strong>SFQ:</strong> {item.QuoteSpecs}</p>
                          <p><strong>Notes:</strong> {item.Notes}</p>
                        </div>
                      )}

                      {item.Drive && item.Drive !== "#N/A" && (
                        <a
                          href={item.Drive}
                          target="_blank"
                          rel="noreferrer"
                          className="driveLink"
                        >
                          <Folder size={18} style={{ marginRight: "10px", marginBottom: "-2px" }} /> Drive Folder
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {showCategorySpecs && selectedCategory && (
        <CategorySpecsModal
          category={selectedCategory}
          onClose={() => setShowCategorySpecs(false)}
        />
      )}


    </div>
  );
}

export default LegacyCatalog;
