const classicTemplate = {
  page: {
    backgroundColor: "#fff",
    padding: "32px",
    color: "#52525b",
  },
  header: {
    padding: "8px",
    border: "1px solid #eee",
    marginBottom: "32px",
  },
  section: {
    marginBottom: "32px",
    paddingBottom: "32px",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "32px",
    color: "#18181b",
  },
  label: {
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    fontSize: "14px",
    letterSpacing: "1px",
    color: "#18181b",
  },
  itemRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: "10px",
    paddingBottom: "8px",
    marginBottom: "8px",
    borderBottom: "1px solid #eee",
  },
  totals: {
    flexDirection: "row" as const,
    gap: "40px",
    justifyContent: "space-between" as const,
    padding: "8px",
    border: "1px solid #eee",
    backgroundColor: "#f9f9f9",
    marginBottom: "32px",
    paddingBottom: "32px",
  },
  grandTotal: {
    fontSize: "22px",
    marginTop: "6px",
    color: "#18181b",
  },
  footer: {
    marginTop: "64px",
  },
};

export default classicTemplate;
