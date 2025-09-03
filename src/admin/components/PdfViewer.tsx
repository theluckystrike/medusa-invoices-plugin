import {
	Document,
	Image,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer';
import React from 'react';
import { TemplateSettings } from './RenderTemplateSettings';

const templateStyles = StyleSheet.create({
	clean: {
		page: {
			backgroundColor: '#fff',
			padding: 32,
		},
		header: {},
		invoiceMeta: {},
		addresses: {},
		lineItems: {},
		totals: {},
		footer: {},
		section: {
			marginBottom: 12,
			paddingBottom: 12,
			borderBottom: '1px solid #eee',
		},
		heading: {
			fontSize: 20,
			marginBottom: 8,
		},
		image: {
			width: '100%',
			height: 'auto',
			marginBottom: 12,
		},
	},
});

type PdfViewerProps = {
	templateSettings: TemplateSettings;
};

export const PdfViewer: React.FC<PdfViewerProps> = ({ templateSettings }) => (
	<PDFViewer width="100%" height="auto" showToolbar={false}>
		<Document>
			<Page
				size="A4"
				style={
					templateStyles[templateSettings.style as keyof typeof templateStyles]
						.page
				}
			>
				{templateSettings.headerType !== 'none' && (
					<View
						style={
							templateStyles[
								templateSettings.style as keyof typeof templateStyles
							].header
						}
					>
						{templateSettings.headerType === 'heading' ? (
							<Text
								style={
									templateStyles[
										templateSettings.style as keyof typeof templateStyles
									].heading
								}
							>
								{templateSettings.headerText}
							</Text>
						) : templateSettings.headerType === 'image' ? (
							<Image
								src={templateSettings.imageUrl}
								style={
									templateStyles[
										templateSettings.style as keyof typeof templateStyles
									].image
								}
							/>
						) : null}
						{templateSettings.additionalHeaderContent && (
							<Text>{templateSettings.additionalHeaderContent}</Text>
						)}
					</View>
				)}
				<View
					style={
						templateStyles[
							templateSettings.style as keyof typeof templateStyles
						].invoiceMeta
					}
				>
					<Text>Invoice number: #4234234</Text>
					<Text>Invoice date: {new Date().toLocaleDateString()}</Text>
					<Text>Order id: #fsdfsdg</Text>
				</View>
				<View
					style={[
						templateStyles[
							templateSettings.style as keyof typeof templateStyles
						].section,
						{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
						},
					]}
				>
					<View>
						<Text>Bill to:</Text>
						<Text>John Doe</Text>
						<Text>john.doe@example.com</Text>
						<Text>123 Main St</Text>
						<Text>City, State, ZIP</Text>
					</View>
					<View>
						<Text>Ship to:</Text>
						<Text>123 Main St</Text>
						<Text>City, State, ZIP</Text>
					</View>
				</View>
				<View
					style={
						templateStyles[
							templateSettings.style as keyof typeof templateStyles
						].section
					}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '10px',
							marginBottom: '16px',
						}}
					>
						<View style={{ flex: 1 }}>
							<Text>Item Title</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>SKU</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>QTY</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>Unit price</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>Line total</Text>
						</View>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '10px',
							marginBottom: '8px',
						}}
					>
						<View style={{ flex: 1 }}>
							<Text>Premium Widget</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>SKU123</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>1</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>$100.00</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>$100.00</Text>
						</View>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '10px',
							marginBottom: '8px',
						}}
					>
						<View style={{ flex: 1 }}>
							<Text>Standard Service</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>SKU4324</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>4</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>$134.00</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>$134.00</Text>
						</View>
					</View>
				</View>
				<View
					style={
						templateStyles[
							templateSettings.style as keyof typeof templateStyles
						].section
					}
				>
					<View
						style={{
							flexDirection: 'row',
							gap: '40px',
							justifyContent: 'flex-end',
						}}
					>
						<View style={{ gap: '6px' }}>
							<Text>Subtotal:</Text>
							<Text>Discount:</Text>
							<Text>Shipping:</Text>
							<Text>Tax:</Text>
							<Text>Grand Total:</Text>
						</View>
						<View style={{ gap: '6px' }}>
							<Text>$234.00</Text>
							<Text>$2.00</Text>
							<Text>$234.00</Text>
							<Text>$234.00</Text>
							<Text>$234.00</Text>
						</View>
					</View>
				</View>
				<View
					style={[
						templateStyles[
							templateSettings.style as keyof typeof templateStyles
						].section,
						{ borderBottom: 'none', marginBottom: '64px' },
					]}
				>
					<Text style={{ marginBottom: '32px' }}>Tekla Fabrics</Text>
					<Text style={{ marginBottom: '6px' }}>Soltanska 26b, Split</Text>
					<Text style={{ marginBottom: '6px' }}>Tax ID: 4234234234234234</Text>
					<Text style={{ marginBottom: '6px' }}>IBAN: 4234234234234234</Text>
					<Text>SWIFT: 2343</Text>
				</View>
				<View
					style={[
						templateStyles[
							templateSettings.style as keyof typeof templateStyles
						].section,
						{ borderBottom: 'none' },
					]}
				>
					<Text>Thank you for your business!</Text>
				</View>
			</Page>
		</Document>
	</PDFViewer>
);
