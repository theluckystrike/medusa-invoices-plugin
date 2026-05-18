import { JSONContent } from "@tiptap/react";

type TipTapNodeComponents = {
  View: any;
  Text: any;
  Link: any;
};

type RenderTipTapNode = {
  node: JSONContent | undefined | null;
  index?: number;
  tipTapStyles: Record<string, any>;
  components: TipTapNodeComponents;
  isLast?: boolean;
};

type RenderTextWithMarks = {
  node: JSONContent;
  key: number;
  components: TipTapNodeComponents;
};

const renderTextWithMarks = ({ node, key, components }: RenderTextWithMarks) => {
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
  isLast = false,
}: RenderTipTapNode): any => {
  if (!node) return null;

  const { View, Text } = components;
  const { type, content = [], attrs = {} } = node;

  switch (type) {
    case "doc":
      return content.map((child, i) =>
        renderTipTapNode({
          node: child,
          index: i,
          tipTapStyles,
          components,
          isLast: i === content.length - 1,
        }),
      );

    case "paragraph":
      if (!content || content.length === 0) {
        return (
          <View key={index} style={tipTapStyles.paragraph}>
            <Text> </Text>
          </View>
        );
      }

      return (
        <View
          key={index}
          style={[
            tipTapStyles.paragraph,
            {
              textAlign: attrs.textAlign || "left",
            },
          ]}
        >
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
      return (() => {
        let headingStyle = tipTapStyles.heading3;

        switch (attrs.level || 1) {
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
        }

        return (
          <View
            key={index}
            style={[
              headingStyle,
              {
                textAlign: attrs.textAlign || "left",
                marginBottom: isLast ? 0 : headingStyle.marginBottom,
              },
            ]}
          >
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
      })();

    case "bulletList":
      return (
        <View key={index} style={{ marginBottom: isLast ? 0 : 8, marginLeft: 10 }}>
          {content.map((child, i) =>
            renderTipTapNode({
              node: child,
              index: i,
              tipTapStyles,
              components,
              isLast: i === content.length - 1,
            }),
          )}
        </View>
      );

    case "orderedList":
      return (() => {
        const start = attrs.start || 1;

        return (
          <View key={index} style={{ marginBottom: isLast ? 0 : 8, marginLeft: 10 }}>
            {content.map((child, i) =>
              renderTipTapNode({
                node: { ...child, _orderNumber: start + i },
                index: i,
                tipTapStyles,
                components,
                isLast: i === content.length - 1,
              }),
            )}
          </View>
        );
      })();

    case "listItem":
      return (() => {
        const isOrdered = node._orderNumber !== undefined;
        const itemNumber = node._orderNumber || 1;

        return (
          <View
            key={index}
            style={[
              tipTapStyles.listItem,
              { marginBottom: isLast ? 0 : tipTapStyles.listItem.marginBottom },
            ]}
          >
            <Text style={isOrdered ? tipTapStyles.orderedNumber : tipTapStyles.bullet}>
              {isOrdered ? `${itemNumber}. ` : "• "}
            </Text>
            <View style={{ flex: 1 }}>
              {content.map((child, i) =>
                renderTipTapNode({
                  node: child,
                  index: i,
                  tipTapStyles,
                  components,
                  isLast: i === content.length - 1,
                }),
              )}
            </View>
          </View>
        );
      })();

    case "text":
      return renderTextWithMarks({ node, key: index, components });

    default:
      if (content && content.length > 0) {
        return content.map((child, i) =>
          renderTipTapNode({
            node: child,
            index: i,
            tipTapStyles,
            components,
            isLast: i === content.length - 1,
          }),
        );
      }

      return null;
  }
};

export default renderTipTapNode;
