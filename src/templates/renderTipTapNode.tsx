import { JSONContent } from "@tiptap/react";

type TipTapNodeComponents = {
  View: any;
  Text: any;
  Link: any;
};

type RenderTipTapNode = {
  node: JSONContent | undefined | null;
  index: number;
  tipTapStyles: Record<string, any>;
  components: TipTapNodeComponents;
};

type RenderTextWithMarks = {
  node: JSONContent;
  key: number;
  components: TipTapNodeComponents;
};

const renderTextWithMarks = ({
  node,
  key,
  components,
}: RenderTextWithMarks) => {
  const { Text, Link } = components;
  const { text = "", marks = [] } = node;

  const hasBold = marks.some((m) => m.type === "bold");
  const hasItalic = marks.some((m) => m.type === "italic");
  const hasUnderline = marks.some((m) => m.type === "underline");
  const hasStrike = marks.some((m) => m.type === "strike");
  const linkMark = marks.find((m) => m.type === "link");
  const textStyleMark = marks.find((m) => m.type === "textStyle");

  const textStyles: any = {};

  if (hasBold && hasItalic) {
    textStyles.fontFamily = "Helvetica-BoldOblique";
  } else if (hasBold) {
    textStyles.fontFamily = "Helvetica-Bold";
  } else if (hasItalic) {
    textStyles.fontFamily = "Helvetica-Oblique";
  }

  if (hasUnderline && hasStrike) {
    textStyles.textDecoration = "underline line-through";
  } else if (hasUnderline) {
    textStyles.textDecoration = "underline";
  } else if (hasStrike) {
    textStyles.textDecoration = "line-through";
  }

  if (textStyleMark && textStyleMark.attrs?.color) {
    textStyles.color = textStyleMark.attrs.color;
  }

  if (linkMark && linkMark.attrs?.href) {
    return (
      <Link
        key={key}
        src={linkMark.attrs.href}
        style={{
          color: textStyles.color || "blue",
          textDecoration: "underline",
          ...textStyles,
        }}
      >
        {text}
      </Link>
    );
  }

  return (
    <Text key={key} style={textStyles}>
      {text}
    </Text>
  );
};

export const renderTipTapNode = ({
  node,
  index = 0,
  tipTapStyles,
  components,
}: RenderTipTapNode): any => {
  if (!node) return null;

  const { View, Text } = components;
  const { type, content = [], attrs = {} } = node;

  switch (type) {
    case "doc":
      return content.map((child, i) =>
        renderTipTapNode({ node: child, index: i, tipTapStyles, components }),
      );

    case "paragraph":
      if (!content || content.length === 0) {
        return (
          <View key={index} style={{ marginBottom: 8 }}>
            <Text> </Text>
          </View>
        );
      }

      const textAlign = attrs.textAlign || "left";
      return (
        <View key={index} style={[tipTapStyles.paragraph, { textAlign }]}>
          <Text>
            {content.map((child, i) =>
              child.type === "text"
                ? renderTextWithMarks({ node: child, key: i, components })
                : renderTipTapNode({
                    node: child,
                    index: i,
                    tipTapStyles,
                    components,
                  }),
            )}
          </Text>
        </View>
      );

    case "heading":
      const level = attrs.level || 1;
      let headingStyle;

      switch (level) {
        case 1:
          headingStyle = tipTapStyles.heading1;
          break;
        case 2:
          headingStyle = tipTapStyles.heading2;
          break;
        case 3:
          headingStyle = tipTapStyles.heading3;
          break;
        case 4:
          headingStyle = tipTapStyles.heading4;
          break;
        case 5:
          headingStyle = tipTapStyles.heading5;
          break;
        case 6:
          headingStyle = tipTapStyles.heading6;
          break;
        default:
          headingStyle = tipTapStyles.heading3;
      }

      const headingAlign = attrs.textAlign || "left";

      return (
        <View key={index} style={[headingStyle, { textAlign: headingAlign }]}>
          <Text>
            {content.map((child, i) =>
              child.type === "text"
                ? renderTextWithMarks({ node: child, key: i, components })
                : renderTipTapNode({
                    node: child,
                    index: i,
                    tipTapStyles,
                    components,
                  }),
            )}
          </Text>
        </View>
      );

    case "bulletList":
      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 10 }}>
          {content.map((child, i) =>
            renderTipTapNode({
              node: child,
              index: i,
              tipTapStyles,
              components,
            }),
          )}
        </View>
      );

    case "orderedList":
      const start = attrs.start || 1;
      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 10 }}>
          {content.map((child, i) => {
            const itemNumber = start + i;
            return renderTipTapNode({
              node: { ...child, _orderNumber: itemNumber },
              index: i,
              tipTapStyles,
              components,
            });
          })}
        </View>
      );

    case "listItem":
      const isOrdered = node._orderNumber !== undefined;
      const itemNumber = node._orderNumber || 1;

      return (
        <View key={index} style={tipTapStyles.listItem}>
          <Text
            style={isOrdered ? tipTapStyles.orderedNumber : tipTapStyles.bullet}
          >
            {isOrdered ? `${itemNumber}. ` : "• "}
          </Text>
          <View style={{ flex: 1 }}>
            {content.map((child, i) =>
              renderTipTapNode({
                node: child,
                index: i,
                tipTapStyles,
                components,
              }),
            )}
          </View>
        </View>
      );

    case "text":
      return renderTextWithMarks({ node, key: index, components });

    default:
      if (content && content.length > 0) {
        return content.map((child, i) =>
          renderTipTapNode({ node: child, index: i, tipTapStyles, components }),
        );
      }
      return null;
  }
};

export default renderTipTapNode;
