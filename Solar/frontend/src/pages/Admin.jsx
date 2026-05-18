import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

function Admin() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        async function fetchRequests() {
            try {
                const response = await fetch("/api/submissions");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load submissions.");
                }

                setRequests(data.requests || []);
            } catch (fetchError) {
                setError(fetchError.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);

    return (
        <>
            <Navbar />

            <main className="admin-page" style={{ padding: "60px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                        {t('nav.admin')}
                    </h1>

                    <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
                        Review all saved contact requests submitted through the form.
                    </p>

                    {loading && <p>Loading submissions...</p>}
                    {error && (
                        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "1rem", borderRadius: "0.75rem" }}>
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={headerCell}>ID</th>
                                        <th style={headerCell}>Name</th>
                                        <th style={headerCell}>Email</th>
                                        <th style={headerCell}>Phone</th>
                                        <th style={headerCell}>Message</th>
                                        <th style={headerCell}>Status</th>
                                        <th style={headerCell}>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: "1rem", textAlign: "center" }}>
                                                No submissions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((item) => (
                                            <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                                <td style={bodyCell}>{item.id}</td>
                                                <td style={bodyCell}>{item.name}</td>
                                                <td style={bodyCell}>{item.email}</td>
                                                <td style={bodyCell}>{item.phone}</td>
                                                <td style={bodyCell}>{item.message}</td>
                                                <td style={bodyCell}>{item.status}</td>
                                                <td style={bodyCell}>{item.created_at}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

const headerCell = {
    textAlign: "left",
    padding: "1rem",
    borderBottom: "2px solid #e5e7eb",
    background: "#f8fafc",
    fontWeight: 700,
    color: "#111827",
};

const bodyCell = {
    padding: "1rem",
    verticalAlign: "top",
    color: "#374151",
};

export default Admin;
