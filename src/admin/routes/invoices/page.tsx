import { defineRouteConfig } from '@medusajs/admin-sdk';
import { ArrowDownTray, DocumentText, SidebarRight } from '@medusajs/icons';
import {
	Button,
	Checkbox,
	Container,
	Drawer,
	Heading,
	Input,
	Label,
	RadioGroup,
	Select,
	Tabs,
	Text,
	Textarea,
} from '@medusajs/ui';
import React from 'react';
import TiptapEditor from '../../components/TiptapEditor';

const orders = [
	{ id: 'order_1', label: 'Order 1' },
	{ id: 'order_2', label: 'Order 2' },
	{ id: 'order_3', label: 'Order 3' },
];

const renderTemplateSettings = ({
	headerType,
	setHeaderType,
	renderHeading = true,
}: {
	headerType: string;
	setHeaderType: React.Dispatch<React.SetStateAction<string>>;
	renderHeading?: boolean;
}) => (
	<>
		<div className="px-6 py-4">
			{renderHeading && (
				<Heading level="h2" className="mb-4">
					Template Settings
				</Heading>
			)}
			<Label htmlFor="template-style">Style</Label>
			<RadioGroup id="template-style" className="mt-1">
				<RadioGroup.ChoiceBox
					value="clean"
					label="Clean"
					description="A clean template style"
				/>
				<RadioGroup.ChoiceBox
					value="classic"
					label="Classic"
					description="A classic template style"
				/>
				<RadioGroup.ChoiceBox
					value="compact"
					label="Compact"
					description="A compact template style"
				/>
			</RadioGroup>
		</div>
		<div className="px-6 py-4">
			<Heading level="h2" className="mb-4">
				Header / Logo
			</Heading>
			<RadioGroup
				value={headerType}
				onValueChange={setHeaderType}
				className="flex gap-3 justify-between flex-wrap"
			>
				<div className="flex items-center gap-x-1.5">
					<RadioGroup.Item value="image" id="image" />
					<Label htmlFor="image">Image</Label>
				</div>
				<div className="flex items-center gap-x-1.5">
					<RadioGroup.Item value="heading" id="heading" />
					<Label htmlFor="heading">Heading</Label>
				</div>
				<div className="flex items-center gap-x-1.5">
					<RadioGroup.Item value="none" id="none" />
					<Label htmlFor="none">None</Label>
				</div>
			</RadioGroup>
			{headerType === 'image' && (
				<div className="mt-3">
					<Label htmlFor="image-url">Image URL</Label>
					<Input
						placeholder="https://example.com/image.jpg"
						id="image-url"
						className="mt-1"
					/>
				</div>
			)}
			{headerType === 'heading' && (
				<div className="mt-3">
					<Label htmlFor="header-text">Header Text</Label>
					<Input placeholder="My Company" id="header-text" className="mt-1" />
				</div>
			)}
		</div>
		<div className="px-6 py-4">
			<Heading level="h2" className="mb-4">
				Additional Content
			</Heading>
			<Label>Header Content</Label>
			<TiptapEditor className="mb-3 mt-1" />
			<Label htmlFor="footer-additional-text">Footer Content</Label>
			<Textarea
				placeholder="Additional footer content"
				id="footer-additional-text"
				className="mt-1 max-h-40"
			/>
		</div>
		<div className="px-6 py-4">
			<Heading level="h2" className="mb-4">
				Bussiness Information
			</Heading>
			<Label htmlFor="business-name">Bussiness Name</Label>
			<Input
				placeholder="My Company"
				id="business-name"
				className="mt-1 mb-3"
			/>
			<Label htmlFor="address">Address</Label>
			<Textarea
				placeholder="Bussiness address"
				id="address"
				className="mt-1 mb-3 max-h-40"
			/>
			<Label htmlFor="tax-id">Tax / VAT ID</Label>
			<Input
				placeholder="Tax identification number"
				id="tax-id"
				className="mt-1 mb-4"
			/>
			<div className="flex gap-3 flex-wrap">
				<div className="flex-1">
					<Label htmlFor="iban">IBAN</Label>
					<Input
						placeholder="International Bank Account Number"
						id="iban"
						className="mt-1"
					/>
				</div>
				<div className="flex-1">
					<Label htmlFor="swift">SWIFT</Label>
					<Input placeholder="SWIFT/BIC code" id="swift" className="mt-1" />
				</div>
			</div>
		</div>
		<div className="px-6 py-4">
			<Heading level="h2" className="mb-4">
				Auto-generation Triggers
			</Heading>
			<div className="flex items-center gap-x-1.5 mb-3">
				<Checkbox id="order-completed" />
				<Label htmlFor="order-completed">Order Completed</Label>
			</div>
			<div className="flex items-center gap-x-1.5 mb-3">
				<Checkbox id="payment-captured" />
				<Label htmlFor="payment-captured">Payment Captured</Label>
			</div>
			<div className="flex items-center gap-x-1.5">
				<Checkbox id="fulfillment-created" />
				<Label htmlFor="fulfillment-created">Fulfillment Created</Label>
			</div>
		</div>
		<div className="px-6 py-4">
			<Button className="w-full">
				<DocumentText />
				Save Template Configuration
			</Button>
		</div>
	</>
);

export default function Invoices() {
	const [headerType, setHeaderType] = React.useState('image');

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
							<SidebarRight /> Template Settings
						</Button>
					</Drawer.Trigger>
					<Drawer.Content className="overflow-y-auto">
						<Drawer.Header>
							<Drawer.Title>Template Settings</Drawer.Title>
						</Drawer.Header>
						<div className="divide-y">
							{renderTemplateSettings({
								headerType,
								setHeaderType,
								renderHeading: false,
							})}
						</div>
					</Drawer.Content>
				</Drawer>
			</div>
			<div className="px-6 gap-4 py-4 flex">
				<Container className="md:w-1/3 p-0 divide-y max-xl:hidden">
					{renderTemplateSettings({ headerType, setHeaderType })}
				</Container>
				<Container className="xl:w-2/3 p-0 divide-y">
					<div className="px-6 flex items-center justify-between flex-wrap gap-2 py-4">
						<Heading level="h2">Live Preview</Heading>
						<Button variant="secondary" className="shrink-0">
							<ArrowDownTray />
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
								<Container className="divide-y p-0">
									<div className="px-6 py-4">
										<Heading>My Company Name</Heading>
									</div>
									<div className="px-6 py-4">
										<Text className="text-ui-fg-subtle">
											1234 Street Name, City, Country
										</Text>
										<Text className="text-ui-fg-subtle">
											Invoice Date: January 1, 2023
										</Text>
										<Text className="text-ui-fg-subtle">
											Invoice Number: INV-123456
										</Text>
										<Text className="text-ui-fg-subtle">
											Customer Name: John Doe
										</Text>
										<Text className="text-ui-fg-subtle">
											Customer Email: john.doe@example.com
										</Text>
									</div>
									<div className="px-6 py-4">
										<Heading>Order Items</Heading>
										<Text className="text-ui-fg-subtle">
											Item 1: Product Name (x1)
										</Text>
										<Text className="text-ui-fg-subtle">
											Item 2: Product Name (x2)
										</Text>
										<Text className="text-ui-fg-subtle">
											Item 3: Product Name (x1)
										</Text>
									</div>
									<div className="px-6 py-4">
										<Text>Thank you for your business!</Text>
									</div>
								</Container>
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
								<Container className="divide-y p-0">
									<div className="px-6 py-4">
										<Heading>My Company Name</Heading>
									</div>
									<div className="px-6 py-4">
										<Text className="text-ui-fg-subtle">
											1234 Street Name, City, Country
										</Text>
										<Text className="text-ui-fg-subtle">
											Invoice Date: January 1, 2023
										</Text>
										<Text className="text-ui-fg-subtle">
											Invoice Number: INV-123456
										</Text>
										<Text className="text-ui-fg-subtle">
											Customer Name: John Doe
										</Text>
										<Text className="text-ui-fg-subtle">
											Customer Email: john.doe@example.com
										</Text>
									</div>
									<div className="px-6 py-4">
										<Heading>Order Items</Heading>
										<Text className="text-ui-fg-subtle">
											Item 1: Product Name (x1)
										</Text>
										<Text className="text-ui-fg-subtle">
											Item 2: Product Name (x2)
										</Text>
										<Text className="text-ui-fg-subtle">
											Item 3: Product Name (x1)
										</Text>
									</div>
									<div className="px-6 py-4">
										<Text>Thank you for your business!</Text>
									</div>
								</Container>
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
	icon: DocumentText,
});
