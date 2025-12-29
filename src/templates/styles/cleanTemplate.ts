const cleanTemplate = {
  page: {
    backgroundColor: "#fff",
    padding: "32px",
    color: "#52525b",
  },
  header: {},
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
  },
  totals: {
    flexDirection: "row" as const,
    gap: "40px",
    justifyContent: "flex-end" as const,
    marginBottom: "32px",
    paddingBottom: "32px",
  },
  grandTotal: {
    fontWeight: "bold",
    fontSize: "22px",
    marginTop: "6px",
    color: "#18181b",
  },
  footer: {
    marginTop: "64px",
  },
};

export default cleanTemplate;
