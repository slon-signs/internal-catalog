import React from "react";
import "./style.css";

function MachinerySection({ isOpen }) {
    if (!isOpen) return null;

    return (
        <div className="machineryContent">

            <hr style={{ marginTop: "-10px" }}></hr>
            <h2>SLON Signs Production Infrastructure</h2>

            <p>
                This section summarizes the core in-house machinery used to fabricate
                the products described in this manual. Understanding available equipment
                helps sales, technical sales and estimators propose realistic solutions
                and timelines.
            </p>

            <table className="machineryTable">
                <thead>
                    <tr>
                        <th>Machine</th>
                        <th>Primary Capability</th>
                        <th>Notes / Typical Applications</th>
                    </tr>
                </thead>
                <tbody>


                    <tr>
                        <td><strong>CJV (Roll Printer)</strong></td>
                        <td>Print & Cut Roll-to-Roll Inkjet Printer</td>
                        <td>
                            • Maximum print width: 1,610 mm (63.4")<br />
                            • Supports media up to 1,620 mm (63.8")<br />
                            • Max. Media thickness: 1.0 mm <br />
                            • Print resolution up to 1,440 dpi<br />
                            • Eco-Solvent and Dye-Sub ink configurations<br />
                            • Ink Types: SS21 / BS3 / BS4 / ES3 (Eco-Solvent), Sb53 / Sb54 (Dye-Sub)<br />
                            • USB and LAN connectivity<br />
                            • Operating Environment: 20–30°C, 35–65% RH<br />
                            • Ideal for banners, decals, wraps, window and wall graphics
                        </td>
                    </tr>

                    <tr>
                        <td><strong>JFX (UV Flatbed Printer)</strong></td>
                        <td>UV-LED Flatbed Printing for Rigid & Flexible Substrates</td>
                        <td>
                            • Type: UV-LED Flatbed Printer<br />
                            • Maximum print area: 2,500 × 1,300 mm (98.4" × 51.2")<br />
                            • Handles materials up to 50 mm (2.0") thick<br />
                            • Resolution up to 1,200 dpi<br />
                            • Ink Options: LUS-120 / LUS-150 / LUS-200 / LUS-350 / LH-100<br />
                            • Vacuum table hold-down system<br />
                            • Print Accuracy: ±0.3 mm (or ±0.3%)<br />
                            • Power Requirement: 200–240V, Single Phase, less than 12A<br />
                            • Ideal for panels, plaques, direct-to-substrate signage
                        </td>
                    </tr>

                    <tr>
                        <td><strong>CNC (Router)</strong></td>
                        <td>CNC Routing & Precision Shaping</td>
                        <td>
                            • HSD 9kW (12HP) air-cooled spindle<br />
                            • Variable speed: 6,000–24,000 RPM<br />
                            • Working area: 1480 × 3050 mm (approx. 5' × 10')<br />
                            • Cuts wood, ACM, aluminum, PVC, acrylic and plastics<br />
                            • Ideal for letters, panels, structural components and custom shapes
                        </td>
                    </tr>

                    <tr>
                        <td><strong>Thunder Laser NOVA 63 – 130W</strong></td>
                        <td>CO₂ Laser Cutting & Engraving</td>
                        <td>
                            • 130W laser system<br />
                            • Working area: 63" × 39.4" × 9.1"<br />
                            • High-precision cutting and engraving<br />
                            • Works with acrylic, wood, plastics, thin PVC, paper and Rowmark<br />
                            • Best suited for detailed interior signage and small-format components
                        </td>
                    </tr>


                    {/* <tr>
                            <td><strong>CJV (Roll Printer)</strong></td>
                            <td>Roll printer for flexible substrates (vinyl, banner, films).</td>
                            <td>Up to 60" width. Typical use: window graphics, wall graphics, decals, banners, perforated film, wraps.</td>
                        </tr>

                        <tr>
                            <td><strong>JFX (UV Flatbed Printer)</strong></td>
                            <td>UV printer for films and rigid substrates (ACM, aluminum, PVC, acrylic, clear vinyl, opaque film, etc.).</td>
                            <td>Table approx. 98" x 51". Typical use: plaques/panels, rigid signage prints, direct-to-substrate UV printing.</td>
                        </tr>

                        <tr>
                            <td><strong>CNC (Router)</strong></td>
                            <td>Router cutting for rigid materials and shaped components; also supports die-cut through film when applied to rigid substrates.</td>
                            <td>Table approx. 5' x 12'. Typical use: letters, backers, boxes, panels, custom shapes; cuts ACM, acrylic, aluminum, PVC, Rowmark, Octolux.</td>
                        </tr>

                        <tr>
                            <td><strong>Laser Cutter</strong></td>
                            <td>Precision laser cutting for acrylic, Rowmark, paper, thin PVC and small-format parts.</td>
                            <td>Table approx. 62" x 39". Typical use: small letters, intricate interior plaques, template parts.</td>
                        </tr> */}


                    <tr>
                        <td><strong>Fiber Laser</strong></td>
                        <td>Industrial metal cutting for aluminum/steel (high power).</td>
                        <td>Approx. cutting are: 5' x 10'. Used for thick metals and structural components. Not suitable for acrylic/plastics.</td>
                    </tr>

                    <tr>
                        <td><strong>Press-Breaker (Folding Machine)</strong></td>
                        <td>Metal folding/bending for aluminum sheets, including thicker gauges.</td>
                        <td>Typical use: box/cabinet fabrication, channel letter returns, brackets, structural folds.</td>
                    </tr>

                    <tr>
                        <td><strong>ASCENT</strong></td>
                        <td>Folding aluminum (returns) for trimless channel letters.</td>
                        <td>Used to fold returns of trimless channel letters.</td>
                    </tr>

                    <tr>
                        <td><strong>ACCUBEND</strong></td>
                        <td>Folding aluminum (returns) for classic channel letters (with trim on faces).</td>
                        <td>Used to fold returns of classic channel letters.</td>
                    </tr>

                    <tr>
                        <td><strong>Stitching machine</strong></td>
                        <td>Aluminum stapler.</td>
                        <td>Used to staple returns on backs of classic channel letters.</td>
                    </tr>

                    <tr>
                        <td><strong>Panel Saw</strong></td>
                        <td>Straight cut for rigid substrate.</td>
                        <td>Manual cut of ACM, Aluminum, Octolux, Acrylic, PVC, etc.</td>
                    </tr>

                </tbody>
            </table>

        </div>
    );
}

export default MachinerySection;
