import React from "react";
import "./style.css";

function ProductionTimelineSection({ isOpen }) {
    if (!isOpen) return null;

    return (
        <div className="machineryWrapper open">
            <div className="machineryContent">

                <hr style={{ marginTop: "0px" }}></hr>
                <h2>Production Timeline Standards (Typical)</h2>

                <p>
                    Timelines below are general planning references used during quoting and internal scheduling.
                    Final lead times may vary based on scope complexity, permit requirements, approvals, and production queue.
                </p>

                <table className="machineryTable">
                    <thead>
                        <tr>
                            <th>Sign Type</th>
                            <th>Typical Lead Time</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Printed films & banners</strong></td>
                            <td>1–2 weeks</td>
                            <td>Includes printing, finishing, and pre-install coordination if required.</td>
                        </tr>
                        <tr>
                            <td><strong>Non-illuminated signs</strong></td>
                            <td>2–3 weeks</td>
                            <td>Includes fabrication, finishing, and pre-install coordination.</td>
                        </tr>
                        <tr>
                            <td><strong>Large illuminated signs (channel letters, cabinets, light boxes)</strong></td>
                            <td>3–4 weeks</td>
                            <td>Includes electrical components, assembly, testing, and approvals.</td>
                        </tr>
                        <tr>
                            <td><strong>Large structural projects (pylons, awnings)</strong></td>
                            <td>4+ weeks</td>
                            <td>Engineering, foundations, permits, and logistics may extend lead time.</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default ProductionTimelineSection;
