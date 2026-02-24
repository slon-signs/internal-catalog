import React from "react";
import { X } from "react-feather";
import "./style.css";

function CategorySpecsModal({ category, onClose }) {
    if (!category) return null;

    const normalized = category.toLowerCase();

    const specsMap = {
        acrylic: {
            title: "Acrylic Letters",
            intro:
                "Dimensional letters and numbers fabricated from acrylic or PVC. Used for interior branding and exterior identification when properly specified.",
            rows: [
                { label: "Typical materials", value: "Acrylic, PVC, paint finishes, vinyl, studs, spacers, double-face tape. Optional: Octolux/Rowmark." },
                { label: "Machines commonly used", value: "CNC Router, Laser Cutter, UV Flatbed (JFX)." },
                { label: "Typical application", value: "Interior and exterior (finish dependent)." },
                { label: "Common limitations", value: "Non-illuminated unless combined with external lighting. Large letters may require reinforcement." },
                { label: "Typical production timeline", value: "2–3 weeks average." },
                { label: "Installation methods", value: "Stud mount, direct screw, standoffs, interior tape mount, template for installation required." }
            ]
        },

        awning: {
            title: "Awnings",
            intro:
                "Fabric awnings used for storefront visibility and weather protection.",
            rows: [
                { label: "Typical materials", value: "Aluminum frame (tubes), fabric canvas, painted graphics." },
                { label: "Machines commonly used", value: "Manual fabrication, welding equipment." },
                { label: "Typical application", value: "Exterior only." },
                { label: "Common limitations", value: "Permits are often required, and wind load considerations apply. Canvas replacement must be completed at the SLON shop, so removal of the existing sign (including the frame) and transport to the shop are always required." },
                { label: "Typical production timeline", value: "3–4 weeks." },
                { label: "Installation methods", value: "Anchored to facade structure." }
            ]
        },

        blade: {
            title: "Blade Double Faced Signs",
            intro:
                "Projecting signs mounted perpendicular to facade for pedestrian visibility.",
            rows: [
                { label: "Typical materials", value: "Aluminum cabinet / EX frames (EX-1, EX-7, etc), acrylic faces, LEDs (if illuminated)." },
                { label: "Machines commonly used", value: "CNC Router, Fiber Laser, UV Printer." },
                { label: "Typical application", value: "Exterior primarily." },
                { label: "Common limitations", value: "Structural anchoring required. Electrical required if illuminated." },
                { label: "Typical production timeline", value: "2–4 weeks depending on illumination." },
                { label: "Installation methods", value: "Wall brackets, through-bolting, template for installation required." }
            ]
        },

        box: {
            title: "Box Signs",
            intro:
                "Cabinet and light box signage including illuminated storefront signs.",
            rows: [
                { label: "Typical materials", value: "Aluminum cabinet / EX frames (EX-1, EX-7, etc) and angles, 3mm ACM, 3/16 acrylic face, LED modules (if illuminated), vinyl." },
                { label: "Machines commonly used", value: "Press-Breaker, CNC, Fiber Laser, JFX, CJV." },
                { label: "Typical application", value: "Exterior storefront signage." },
                { label: "Common limitations", value: "Electrical requirements and transport limitations must be considered. Push-through artwork must always be reviewed by the technical team before presenting the sign proposal to the client." },
                { label: "Typical production timeline", value: "2–4 weeks." },
                { label: "Installation methods", value: "Raceway mount, direct mount, rail system." }
            ]
        },

        channel: {
            title: "Channel Letters & Logos",
            intro:
                "Fabricated aluminum channel letters and illuminated logos for storefront branding.",
            rows: [
                { label: "Typical materials", value: "Aluminum returns, acrylic faces, LEDs, trims." },
                { label: "Machines commonly used", value: "CNC, Fiber Laser, ACCUBEND, UV Printer." },
                { label: "Typical application", value: "Exterior primarily. Classic channels (with trim on faces) are preferred due to faster production and better cost efficiency, while interior signs typically use trimless channels for a higher-end finish." },
                { label: "Common limitations", value: "Permits and electrical inspections may apply. Thin letter strokes (minimum approx. 1.25 in for classic channels and approx. 1.00 in for trimless channels) may require adjustment during pre-production." },
                { label: "Typical production timeline", value: "3–4 weeks illuminated, 2–3 non-illuminated." },
                { label: "Installation methods", value: "Rails, direct mount, backer panel, template for installation required." }
            ]
        },

        print: {
            title: "Printed Signs",
            intro:
                "Printed graphics for rigid or flexible substrates.",
            rows: [
                { label: "Typical materials", value: "Vinyl, ACM panels, acrylic, banners." },
                { label: "Machines commonly used", value: "CJV Roll Printer, JFX UV Flatbed." },
                { label: "Typical application", value: "Interior and exterior." },
                { label: "Common limitations", value: "Durability depends on substrate and exposure." },
                { label: "Typical production timeline", value: "1–2 weeks. Depending on quantity." },
                { label: "Installation methods", value: "Adhesive mount, panel mount." }
            ]
        },

        plaque: {
            title: "Plaques",
            intro:
                "Interior and exterior plaques fabricated in rigid materials.",
            rows: [
                { label: "Typical materials", value: "Acrylic, aluminum, PVC, pins and studs, D/F tape," },
                { label: "Machines commonly used", value: "CNC, Laser Cutter, UV Printer." },
                { label: "Typical application", value: "Interior primarily." },
                { label: "Common limitations", value: "Size constraints depending on substrate." },
                { label: "Typical production timeline", value: "1–2 weeks." },
                { label: "Installation methods", value: "Direct mount with D/F tape (or screws), standoffs, pins and spacers. Template for installation usually required." }
            ]
        },

        fiber: {
            title: "Fiber Laser Letters",
            intro:
                "Metal fabricated letters cut using fiber laser technology.",
            rows: [
                { label: "Typical materials", value: "Aluminum, steel." },
                { label: "Machines commonly used", value: "Fiber Laser Cutter." },
                { label: "Typical application", value: "Exterior and interior." },
                { label: "Common limitations", value: "Non-illuminated unless paired with lighting." },
                { label: "Typical production timeline", value: "2–3 weeks." },
                { label: "Installation methods", value: "Stud mount (spacers are optional), template for installation required." }
            ]
        },

        service: {
            title: "Services",
            intro:
                "Installation, maintenance, and service-related operations.",
            rows: [
                { label: "Typical materials", value: "Varies by scope." },
                { label: "Machines commonly used", value: "Service vehicles and tools." },
                { label: "Typical application", value: "Interior and exterior." },
                { label: "Common limitations", value: "Site access and safety requirements. Permits to block street may be required for external services.." },
                { label: "Typical production timeline", value: "Scheduled per availability." },
                { label: "Installation methods", value: "Scope dependent. Project documents and installation instructions are mandatory." }
            ]
        },

        pylon: {
            title: "Pylons",
            intro:
                "Large structural signage installed on foundations. Requires engineering, permits, and coordinated installation logistics.",
            rows: [
                { label: "Typical materials", value: "Aluminum structure (cage), aluminum cladding, acrylic faces, LEDs, electrical components, concrete foundation or underground poles." },
                { label: "Machines commonly used", value: "Fiber Laser, CNC, Press-Breaker, JFX (graphics when applicable)." },
                { label: "Typical application", value: "Exterior only." },
                { label: "Common limitations", value: "Engineering and municipal permits required; foundation and crane logistics; approval-dependent lead times." },
                { label: "Typical production timeline", value: "4+ weeks (project dependent)." },
                { label: "Installation methods", value: "Concrete footing, structural anchoring, crane placement, electrical coordination." }
            ]
        },

        illuminated: {
            title: "Specialty Illuminated",
            intro:
                "Specialty illuminated products frequently quoted alongside channel letters and cabinet signage.",
            rows: [
                { label: "Typical materials", value: "Aluminum, many type of acrylics and PVCs, LED modules or strip, pins/studas, fasteners, power supplies." },
                { label: "Machines commonly used", value: "CNC, Press-Breaker, Fiber Laser, JFX (printed faces when required)." },
                { label: "Typical application", value: "Exterior primarily; interior for premium branding." },
                { label: "Common limitations", value: "Electrical inspections may be required; wall condition and access constraints can impact installation. Artwork must always be reviewed by the technical team before presenting the sign proposal to the client." },
                { label: "Typical production timeline", value: "3–4 weeks illuminated; 2–3 weeks non-illuminated." },
                { label: "Installation methods", value: "Direct mount, rails, raceway, carrier/backer panel; electrical coordination per site." }
            ]
        },

        printed: {
            title: "Printed Films & Banners",
            intro:
                "Printed media solutions for windows, walls, vehicles, and temporary signage including laminations and die-cutting.",
            rows: [
                { label: "Typical materials", value: "Vinyl films, frosted/clear/perforated films, banner substrates, laminates, application tapes, optional grommets." },
                { label: "Machines commonly used", value: "CJV (roll printer), JFX (rigid UV printing), CNC (die-cut on rigid), finishing/lamination tools." },
                { label: "Typical application", value: "Interior and exterior (material dependent)." },
                { label: "Common limitations", value: "Surface preparation critical; lifespan depends on UV exposure and film type; lamination may be required. Dificult or imporssible to install film on exterior with temperature less than +4 or +5°C" },
                { label: "Typical production timeline", value: "1–2 weeks (typical)." },
                { label: "Installation methods", value: "Wet/dry application; squeegee installation; banners with grommets; wraps by trained installer." }
            ]
        },

    };


    const key = Object.keys(specsMap).find(k => normalized.includes(k));
    const data = specsMap[key] || {
        title: category,
        intro: "Specifications for this category will be added soon.",
        rows: []
    };

    return (
        <div className="categorySpecsOverlay" onClick={onClose}>
            <div className="categorySpecsModal" onClick={(e) => e.stopPropagation()}>
                <div className="categorySpecsHeader">
                    <h2>{data.title}</h2>
                    <X size={28} style={{ cursor: "pointer" }} onClick={onClose} />
                </div>

                <p className="categorySpecsIntro">{data.intro}</p>

                {data.rows.length > 0 && (
                    <table className="categorySpecsTable">
                        <tbody>
                            {data.rows.map((row, index) => (
                                <tr key={index}>
                                    <td className="labelCell">{row.label}</td>
                                    <td>{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default CategorySpecsModal;
