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
			color: '#18181b',
		},
		section: {
			marginBottom: 32,
			paddingBottom: 32,
		},
		heading: {
			fontSize: '36px',
			fontWeight: 'bold',
			marginBottom: 32,
		},
		image: {
			height: '32px',
			width: 'auto',
		},
		label: {
			fontWeight: 'semibold',
		},
		grandTotal: {
			fontWeight: 'bold',
			fontSize: '22px',
			marginTop: '6px',
		},
	},
	classic: {
		page: {
			backgroundColor: '#fff',
			padding: 32,
			color: '#18181b',
		},
		section: {
			marginBottom: 32,
			paddingBottom: 32,
		},
		heading: {
			fontSize: '36px',
			fontWeight: 'bold',
			marginBottom: 32,
		},
		image: {
			height: '32px',
			width: 'auto',
		},
		label: {
			fontWeight: 'semibold',
		},
		grandTotal: {
			fontWeight: 'bold',
			fontSize: '22px',
			marginTop: '6px',
		},
	},
	compact: {
		page: {
			backgroundColor: '#fff',
			padding: 12,
			fontSize: '12px',
			color: '#52525b',
		},
		section: {
			marginBottom: 12,
			paddingBottom: 12,
		},
		heading: {
			fontSize: '20px',
			fontWeight: 'medium',
			marginBottom: 12,
			color: '#18181b',
		},
		image: {
			height: '24px',
			width: 'auto',
		},
		label: {
			fontWeight: 'medium',
			color: '#18181b',
		},
		grandTotal: {
			fontSize: '15px',
			marginTop: '6px',
			color: '#18181b',
		},
	},
});

type PdfViewerProps = {
	templateSettings: TemplateSettings;
};

export const PdfViewer: React.FC<PdfViewerProps> = ({ templateSettings }) => (
	<PDFViewer showToolbar={false} height="100%" width="100%">
		<Document>
			<Page size="A4" style={templateStyles[templateSettings.style].page}>
				{templateSettings.headerType === 'heading' &&
					templateSettings.headerText && (
						<Text style={templateStyles[templateSettings.style].heading}>
							{templateSettings.headerText}
						</Text>
					)}
				{templateSettings.headerType === 'image' &&
					templateSettings.imageUrl && (
						<Image
							src={templateSettings.imageUrl}
							style={templateStyles[templateSettings.style].image}
						/>
					)}
				{templateSettings.additionalHeaderContent &&
					templateSettings.additionalHeaderContent}
				<View style={templateStyles[templateSettings.style].section}>
					<Text style={templateStyles[templateSettings.style].heading}>
						Invoice
					</Text>
					<Text>
						<Text style={templateStyles[templateSettings.style].label}>
							Invoice number:
						</Text>{' '}
						#4234234
					</Text>
					<Text>
						<Text style={templateStyles[templateSettings.style].label}>
							Invoice date:
						</Text>{' '}
						{new Date().toLocaleDateString()}
					</Text>
					<Text>
						<Text style={templateStyles[templateSettings.style].label}>
							Order ID:
						</Text>{' '}
						#fsdfsdg
					</Text>
				</View>

				<View
					style={[
						templateStyles[templateSettings.style].section,
						{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
						},
					]}
				>
					<View>
						<Text style={templateStyles[templateSettings.style].label}>
							Bill to:
						</Text>
						<Text>Lorem ipsum</Text>
						<Text>Soltanska 45b, 21000</Text>
						<Text>+385 99 543 2345</Text>
					</View>

					<View>
						<Text style={templateStyles[templateSettings.style].label}>
							Ship to:
						</Text>
						<Text>Lorem ipsum</Text>
						<Text>Soltanska 45b, 21000</Text>
						<Text>+385 99 543 2345</Text>
					</View>
				</View>
				<View style={templateStyles[templateSettings.style].section}>
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
							<Text style={templateStyles[templateSettings.style].label}>
								Item Title
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={templateStyles[templateSettings.style].label}>
								SKU
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={templateStyles[templateSettings.style].label}>
								QTY
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={templateStyles[templateSettings.style].label}>
								Unit price
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={templateStyles[templateSettings.style].label}>
								Line total
							</Text>
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
				<View style={templateStyles[templateSettings.style].section}>
					<View
						style={{
							flexDirection: 'row',
							gap: '40px',
							justifyContent: 'flex-end',
						}}
					>
						<View style={{ gap: '6px' }}>
							<Text style={templateStyles[templateSettings.style].label}>
								Subtotal:
							</Text>
							<Text style={templateStyles[templateSettings.style].label}>
								Discount:
							</Text>
							<Text style={templateStyles[templateSettings.style].label}>
								Shipping:
							</Text>
							<Text style={templateStyles[templateSettings.style].label}>
								Tax:
							</Text>
							<Text style={templateStyles[templateSettings.style].grandTotal}>
								Grand Total:
							</Text>
						</View>
						<View style={{ gap: '6px' }}>
							<Text>$234.00</Text>
							<Text>$2.00</Text>
							<Text>$234.00</Text>
							<Text>$234.00</Text>
							<Text style={templateStyles[templateSettings.style].grandTotal}>
								$234.00
							</Text>
						</View>
					</View>
				</View>
				{(templateSettings.business.name ||
					templateSettings.business.address ||
					templateSettings.business.taxId ||
					templateSettings.business.iban ||
					templateSettings.business.swift) && (
					<View
						style={[
							templateStyles[templateSettings.style].section,
							{ borderBottom: 'none', marginBottom: '64px' },
						]}
					>
						{templateSettings.business.name && (
							<Text>{templateSettings.business.name}</Text>
						)}
						{templateSettings.business.address && (
							<Text>{templateSettings.business.address}</Text>
						)}
						{templateSettings.business.taxId && (
							<Text>Tax ID: {templateSettings.business.taxId}</Text>
						)}
						{templateSettings.business.iban && (
							<Text>IBAN: {templateSettings.business.iban}</Text>
						)}
						{templateSettings.business.swift && (
							<Text>SWIFT: {templateSettings.business.swift}</Text>
						)}
					</View>
				)}
				<View
					style={[
						templateStyles[templateSettings.style].section,
						{ borderBottom: 'none' },
					]}
				>
					<Text>Thank you for your business!</Text>
				</View>
			</Page>
		</Document>
	</PDFViewer>
);
