import { Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import { JSONContent } from '@tiptap/react';

const tiptapStyles = StyleSheet.create({
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  heading4: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 6,
  },
  heading5: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 4,
  },
  heading6: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 20,
  },
  orderedNumber: {
    width: 20,
  },
});

const renderTextWithMarks = (node: JSONContent, key: number) => {
  const { text = '', marks = [] } = node;
  
  // Proveri koji markovi postoje
  const hasBold = marks.some(m => m.type === 'bold');
  const hasItalic = marks.some(m => m.type === 'italic');
  const hasUnderline = marks.some(m => m.type === 'underline');
  const hasStrike = marks.some(m => m.type === 'strike');
  const linkMark = marks.find(m => m.type === 'link');
  const textStyleMark = marks.find(m => m.type === 'textStyle');
  
  // Pripremi stilove
  const textStyles: any = {};
  
  // Font family - kombinacije bold i italic
  if (hasBold && hasItalic) {
    textStyles.fontFamily = 'Helvetica-BoldOblique';
  } else if (hasBold) {
    textStyles.fontFamily = 'Helvetica-Bold';
  } else if (hasItalic) {
    textStyles.fontFamily = 'Helvetica-Oblique';
  }
  
  // Text decoration
  if (hasUnderline && hasStrike) {
    textStyles.textDecoration = 'underline line-through';
  } else if (hasUnderline) {
    textStyles.textDecoration = 'underline';
  } else if (hasStrike) {
    textStyles.textDecoration = 'line-through';
  }
  
  // Color iz textStyle
  if (textStyleMark && textStyleMark.attrs?.color) {
    textStyles.color = textStyleMark.attrs.color;
  }
  
  // Ako je link
  if (linkMark && linkMark.attrs?.href) {
    return (
      <Link 
        key={key} 
        src={linkMark.attrs.href} 
        style={{ 
          color: textStyles.color || 'blue', 
          textDecoration: 'underline',
          ...textStyles 
        }}
      >
        {text}
      </Link>
    );
  }
  
  // Običan tekst
  return (
    <Text key={key} style={textStyles}>
      {text}
    </Text>
  );
};

// Glavna funkcija za renderiranje Tiptap JSON-a
export const renderTiptapNode = (node: JSONContent | undefined | null, index: number = 0): any => {
  if (!node) return null;
  
  const { type, content = [], attrs = {} } = node;
  
  switch (type) {
    case 'doc':
      return content.map((child, i) => renderTiptapNode(child, i));
      
    case 'paragraph':
      // Prazni paragraf
      if (!content || content.length === 0) {
        return <View key={index} style={{ marginBottom: 8 }}><Text> </Text></View>;
      }
      
      // Paragraf sa sadržajem
      const textAlign = attrs.textAlign || 'left';
      return (
        <View key={index} style={[tiptapStyles.paragraph, { textAlign }]}>
          <Text>
            {content.map((child, i) => 
              child.type === 'text' 
                ? renderTextWithMarks(child, i) 
                : renderTiptapNode(child, i)
            )}
          </Text>
        </View>
      );
      
    case 'heading':
      const level = attrs.level || 1;
      let headingStyle;
      
      switch (level) {
        case 1: headingStyle = tiptapStyles.heading1; break;
        case 2: headingStyle = tiptapStyles.heading2; break;
        case 3: headingStyle = tiptapStyles.heading3; break;
        case 4: headingStyle = tiptapStyles.heading4; break;
        case 5: headingStyle = tiptapStyles.heading5; break;
        case 6: headingStyle = tiptapStyles.heading6; break;
        default: headingStyle = tiptapStyles.heading3;
      }
      
      const headingAlign = attrs.textAlign || 'left';
      
      return (
        <View key={index} style={[headingStyle, { textAlign: headingAlign }]}>
          <Text>
            {content.map((child, i) => 
              child.type === 'text' 
                ? renderTextWithMarks(child, i) 
                : renderTiptapNode(child, i)
            )}
          </Text>
        </View>
      );
      
    case 'bulletList':
      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 10 }}>
          {content.map((child, i) => renderTiptapNode(child, i))}
        </View>
      );
      
    case 'orderedList':
      const start = attrs.start || 1;
      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 10 }}>
          {content.map((child, i) => {
            // Prosljedimo broj stavke kao context
            const itemNumber = start + i;
            return renderTiptapNode({ ...child, _orderNumber: itemNumber }, i);
          })}
        </View>
      );
      
    case 'listItem':
      const isOrdered = node._orderNumber !== undefined;
      const itemNumber = node._orderNumber || 1;
      
      return (
        <View key={index} style={tiptapStyles.listItem}>
          <Text style={isOrdered ? tiptapStyles.orderedNumber : tiptapStyles.bullet}>
            {isOrdered ? `${itemNumber}. ` : '• '}
          </Text>
          <View style={{ flex: 1 }}>
            {content.map((child, i) => renderTiptapNode(child, i))}
          </View>
        </View>
      );
      
    case 'text':
      return renderTextWithMarks(node, index);
      
    default:
      // Fallback za nepoznate tipove
      if (content && content.length > 0) {
        return content.map((child, i) => renderTiptapNode(child, i));
      }
      return null;
  }
};

export default renderTiptapNode;