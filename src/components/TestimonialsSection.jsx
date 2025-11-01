import React from "react";

const TestimonialsSection = ({ data }) => {
    return (
        <section className="testimonials-section" style={styles.section}>
            <h2 style={styles.heading}>What Our Users Say</h2>
            <div style={styles.list}>
                {data.items.map((quote, index) => (
                    <div key={index} style={styles.card}>
                        <p style={styles.quote}>{quote}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: "3rem 1rem",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
    },
    heading: {
        fontSize: "1.8rem",
        fontWeight: "600",
        marginBottom: "1.5rem",
        color: "#333",
    },
    list: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "1rem",
        maxWidth: "280px",
        minHeight: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    quote: {
        fontStyle: "italic",
        color: "#444",
        fontSize: "1rem",
    },
};

export default TestimonialsSection;
