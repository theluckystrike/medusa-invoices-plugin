const getTemp = async () => {
  const React = await import("react");
  const ReactPDF = await import("@react-pdf/renderer");
  const { Document, Page, View, Text } = ReactPDF;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4" },
      React.createElement(
        View,
        null,
        React.createElement(Text, null, "Josip Vojkovic"),
      ),
    ),
  );
};

export default getTemp;
