const compactTemplate = {
  page: {
    backgroundColor: "#fff",
    padding: "12px",
    fontSize: "12px",
    color: "#52525b",
  },
  header: {},
  section: {
    marginBottom: "12px",
    paddingBottom: "12px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "medium",
    marginBottom: "12px",
    color: "#18181b",
  },
  label: {
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    fontSize: "10px",
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
  },
  totals: {
    flexDirection: "row" as const,
    gap: "40px",
    justifyContent: "flex-end" as const,
    marginBottom: "12px",
    paddingBottom: "12px",
  },
  grandTotal: {
    fontSize: "15px",
    marginTop: "6px",
    color: "#18181b",
  },
  footer: {
    marginTop: "64px",
  },
};

export default compactTemplate;
