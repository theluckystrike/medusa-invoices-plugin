import { defineRouteConfig } from '@medusajs/admin-sdk';
import {
	ArrowDownTray as ArrowDownTrayIcon,
	DocumentText as DocumentTextIcon,
	SidebarRight as SidebarRightIcon,
} from '@medusajs/icons';
import {
	Button,
	Container,
	Drawer,
	Heading,
	Label,
	Select,
	Tabs,
	Text,
} from '@medusajs/ui';
import React from 'react';
import { PdfViewer } from '../../components/PdfViewer';
import RenderTemplateSettings, {
	type TemplateSettings,
} from '../../components/RenderTemplateSettings';

export default function Invoices() {
	const [templateSettings, setTemplateSettings] =
		React.useState<TemplateSettings>({
			style: 'clean',
			headerType: 'image',
			imageUrl: '',
			headerText: '',
			additionalHeaderContent: '',
			additionalFooterContent: '',
			business: {
				name: '',
				address: '',
				taxId: '',
				iban: '',
				swift: '',
			},
			autoGenerationTriggers: {
				orderCompleted: false,
				paymentCaptured: false,
				fulfillmentCreated: false,
			},
		});

	const orders = React.useMemo(
		() => [
			{ id: 'order_1', label: 'Order 1' },
			{ id: 'order_2', label: 'Order 2' },
			{ id: 'order_3', label: 'Order 3' },
		],
		[]
	);

	return (
		<Container className="divide-y p-0">
			<div className="px-6 flex justify-between max-sm:flex-col sm:items-center gap-4 py-4">
				<div>
					<Heading>Invoice Template Configuration</Heading>
					<Text className="text-ui-fg-subtle">
						Configure your invoice templates and preview them in real-time
					</Text>
				</div>
				<Drawer>
					<Drawer.Trigger asChild className="xl:hidden shrink-0">
						<Button variant="secondary">
							<SidebarRightIcon /> Template Settings
						</Button>
					</Drawer.Trigger>
					<Drawer.Content className="overflow-y-auto">
						<Drawer.Header>
							<Drawer.Title>Template Settings</Drawer.Title>
						</Drawer.Header>
						<div className="divide-y">
							<RenderTemplateSettings
								renderHeading={false}
								templateSettings={templateSettings}
								setTemplateSettings={setTemplateSettings}
							/>
						</div>
					</Drawer.Content>
				</Drawer>
			</div>
			<div className="px-6 gap-4 py-4 flex">
				<Container className="md:w-1/3 p-0 divide-y max-xl:hidden">
					<RenderTemplateSettings
						templateSettings={templateSettings}
						setTemplateSettings={setTemplateSettings}
					/>
				</Container>
				<Container className="xl:w-2/3 p-0 divide-y">
					<div className="px-6 flex items-center justify-between flex-wrap gap-2 py-4">
						<Heading level="h2">Live Preview</Heading>
						<Button variant="secondary" className="shrink-0">
							<ArrowDownTrayIcon />
							Download Preview
						</Button>
					</div>
					<div className="px-6 py-4">
						<Tabs defaultValue="dummy-data">
							<Tabs.List className="mb-4 w-full bg-ui-bg-base-hover rounded-full p-1">
								<Tabs.Trigger value="dummy-data" className="flex-1">
									Dummy Data
								</Tabs.Trigger>
								<Tabs.Trigger value="select-order" className="flex-1">
									Select Order
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="dummy-data">
								<Text className="mb-4 text-ui-fg-subtle">
									Using built-in sample order data for preview
								</Text>
								<PdfViewer templateSettings={templateSettings} />
							</Tabs.Content>
							<Tabs.Content value="select-order">
								<Label>Select Order</Label>
								<div className="w-[256px] mt-1 mb-4">
									<Select>
										<Select.Trigger>
											<Select.Value placeholder="Select an order" />
										</Select.Trigger>
										<Select.Content>
											{orders.map((item) => (
												<Select.Item key={item.id} value={item.id}>
													{item.label}
												</Select.Item>
											))}
										</Select.Content>
									</Select>
								</div>
								<PdfViewer templateSettings={templateSettings} />
							</Tabs.Content>
						</Tabs>
					</div>
				</Container>
			</div>
		</Container>
	);
}

export const config = defineRouteConfig({
	label: 'Invoices',
	icon: DocumentTextIcon,
});
