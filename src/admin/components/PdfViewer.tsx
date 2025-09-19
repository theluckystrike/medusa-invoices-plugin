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
			padding: '32px',
			color: '#52525b',
		},
		header: {},
		section: {
			marginBottom: '32px',
			paddingBottom: '32px',
		},
		heading: {
			fontSize: '36px',
			fontWeight: 'bold',
			marginBottom: '32px',
			color: '#18181b',
		},
		label: {
			fontWeight: 'bold',
			textTransform: 'uppercase' as const,
			fontSize: '14px',
			letterSpacing: '1px',
			color: '#18181b',
		},
		itemRow: {
			display: 'flex' as const,
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			gap: '10px',
			paddingBottom: '8px',
			marginBottom: '8px',
		},
		totals: {
			flexDirection: 'row' as const,
			gap: '40px',
			justifyContent: 'flex-end' as const,
			marginBottom: '32px',
			paddingBottom: '32px',
		},
		grandTotal: {
			fontWeight: 'bold',
			fontSize: '22px',
			marginTop: '6px',
			color: '#18181b',
		},
		footer: {
			marginTop: '64px',
		},
	},
	classic: {
		page: {
			backgroundColor: '#fff',
			padding: '32px',
			color: '#52525b',
		},
		header: {
			padding: '8px',
			border: '1px solid #eee',
			marginBottom: '32px',
		},
		section: {
			marginBottom: '32px',
			paddingBottom: '32px',
		},
		heading: {
			fontSize: '36px',
			fontWeight: 'bold',
			marginBottom: '32px',
			color: '#18181b',
		},
		label: {
			fontWeight: 'bold',
			textTransform: 'uppercase' as const,
			fontSize: '14px',
			letterSpacing: '1px',
			color: '#18181b',
		},
		itemRow: {
			display: 'flex' as const,
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			gap: '10px',
			paddingBottom: '8px',
			marginBottom: '8px',
			borderBottom: '1px solid #eee',
		},
		totals: {
			flexDirection: 'row' as const,
			gap: '40px',
			justifyContent: 'space-between' as const,
			padding: '8px',
			border: '1px solid #eee',
			backgroundColor: '#f9f9f9',
			marginBottom: '32px',
			paddingBottom: '32px',
		},
		grandTotal: {
			fontSize: '22px',
			marginTop: '6px',
			color: '#18181b',
		},
		footer: {
			marginTop: '64px',
		},
	},
	compact: {
		page: {
			backgroundColor: '#fff',
			padding: '12px',
			fontSize: '12px',
			color: '#52525b',
		},
		header: {},
		section: {
			marginBottom: '12px',
			paddingBottom: '12px',
		},
		heading: {
			fontSize: '20px',
			fontWeight: 'medium',
			marginBottom: '12px',
			color: '#18181b',
		},
		label: {
			fontWeight: 'bold',
			textTransform: 'uppercase' as const,
			fontSize: '10px',
			letterSpacing: '1px',
			color: '#18181b',
		},
		itemRow: {
			display: 'flex' as const,
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			gap: '10px',
			paddingBottom: '8px',
			marginBottom: '8px',
		},
		totals: {
			flexDirection: 'row' as const,
			gap: '40px',
			justifyContent: 'flex-end' as const,
			marginBottom: '12px',
			paddingBottom: '12px',
		},
		grandTotal: {
			fontSize: '15px',
			marginTop: '6px',
			color: '#18181b',
		},
		footer: {
			marginTop: '64px',
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
				<View
					render={() =>
						templateSettings.headerType === 'heading' &&
						templateSettings.headerText && (
							<Text style={templateStyles[templateSettings.style].heading}>
								{templateSettings.headerText}
							</Text>
						)
					}
				/>
				<View
					render={() =>
						templateSettings.headerType === 'image' &&
						templateSettings.imageUrl && (
							<Image
								src={templateSettings.imageUrl}
								style={{
									width: 'auto',
									height: '40px',
									objectFit: 'contain',
									marginBottom: '20px',
								}}
							/>
						)
					}
				/>
				<View
					render={() =>
						templateSettings.additionalHeaderContent && (
							<View style={templateStyles[templateSettings.style].header}>
								{templateSettings.additionalHeaderContent}
							</View>
						)
					}
				/>
				<View style={templateStyles[templateSettings.style].section}>
					<Text style={templateStyles[templateSettings.style].heading}>
						Invoice
					</Text>
					<Text style={{ marginBottom: '2px' }}>
						<Text style={templateStyles[templateSettings.style].label}>
							Invoice number:
						</Text>{' '}
						#4234234
					</Text>
					<Text style={{ marginBottom: '2px' }}>
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
						<Text
							style={[
								templateStyles[templateSettings.style].label,
								{ marginBottom: '2px' },
							]}
						>
							Bill to:
						</Text>
						<Text style={{ marginBottom: '2px' }}>Lorem ipsum</Text>
						<Text style={{ marginBottom: '2px' }}>Soltanska 45b, 21000</Text>
						<Text>+385 99 543 2345</Text>
					</View>

					<View>
						<Text
							style={[
								templateStyles[templateSettings.style].label,
								{ marginBottom: '2px' },
							]}
						>
							Ship to:
						</Text>
						<Text style={{ marginBottom: '2px' }}>Lorem ipsum</Text>
						<Text style={{ marginBottom: '2px' }}>Soltanska 45b, 21000</Text>
						<Text>+385 99 543 2345</Text>
					</View>
				</View>
				<View
					style={[
						templateStyles[templateSettings.style].section,
						templateSettings.style === 'compact'
							? { borderBottom: '1px solid #eee' }
							: {},
					]}
				>
					<View
						style={[
							templateStyles[templateSettings.style].itemRow,
							{
								marginBottom: '16px',
							},
						]}
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
					<View style={templateStyles[templateSettings.style].itemRow}>
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
					<View style={templateStyles[templateSettings.style].itemRow}>
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
				<View style={templateStyles[templateSettings.style].totals}>
					<View style={{ gap: '6px' }}>
						<Text>Subtotal:</Text>
						<Text>Discount:</Text>
						<Text>Shipping:</Text>
						<Text>Tax:</Text>
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

				<View
					style={templateStyles[templateSettings.style].section}
					render={() =>
						(templateSettings.business.name ||
							templateSettings.business.address ||
							templateSettings.business.taxId ||
							templateSettings.business.iban ||
							templateSettings.business.swift) && (
							<>
								{templateSettings.business.name && (
									<Text style={{ marginBottom: '4px' }}>
										{templateSettings.business.name}
									</Text>
								)}
								{templateSettings.business.address && (
									<Text style={{ marginBottom: '4px' }}>
										{templateSettings.business.address}
									</Text>
								)}
								{templateSettings.business.taxId && (
									<Text style={{ marginBottom: '4px' }}>
										Tax ID: {templateSettings.business.taxId}
									</Text>
								)}
								{templateSettings.business.iban && (
									<Text style={{ marginBottom: '4px' }}>
										IBAN: {templateSettings.business.iban}
									</Text>
								)}
								{templateSettings.business.swift && (
									<Text>SWIFT: {templateSettings.business.swift}</Text>
								)}
							</>
						)
					}
				/>

				{templateSettings.additionalFooterContent && (
					<View style={templateStyles[templateSettings.style].footer}>
						{templateSettings.additionalFooterContent}
					</View>
				)}
			</Page>
		</Document>
	</PDFViewer>
);
