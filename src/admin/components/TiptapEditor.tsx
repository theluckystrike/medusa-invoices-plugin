// External packages
import { Button, clx, IconButton, Input } from '@medusajs/ui';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold as BoldIcon,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	Italic as ItalicIcon,
	LayoutList,
	Link as LinkIcon,
	List,
	ListOrdered,
	Paintbrush,
	Redo,
	Strikethrough,
	Underline as UnderlineIcon,
	Undo,
} from 'lucide-react';
import * as React from 'react';

interface TiptapEditorProps {
	content?: string;
	onChange?: (content: string) => void;
	className?: string;
	isInvalid?: boolean;
	disabled?: boolean;
}

export type TiptapEditorFieldProps = {
	name: string;
	label?: string;
	// labelProps?: Forms.LabelProps;
	editorProps?: Omit<TiptapEditorProps, 'content' | 'onChange'>;
	// subLabelProps?: Forms.SubLabelProps;
};

const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
	const [showColorPicker, setShowColorPicker] = React.useState(false);
	const [showLinkDialog, setShowLinkDialog] = React.useState(false);
	const [linkUrl, setLinkUrl] = React.useState('');
	const linkDialogRef = React.useRef<HTMLDivElement>(null);
	const colorPickerRef = React.useRef<HTMLDivElement>(null);

	if (!editor) {
		return null;
	}

	// Close modals when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				linkDialogRef.current &&
				!linkDialogRef.current.contains(event.target as Node)
			) {
				setShowLinkDialog(false);
				setLinkUrl('');
			}
			if (
				colorPickerRef.current &&
				!colorPickerRef.current.contains(event.target as Node)
			) {
				setShowColorPicker(false);
			}
		};

		if (showLinkDialog || showColorPicker) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [showLinkDialog, showColorPicker]);

	const addLink = () => {
		if (linkUrl) {
			editor.chain().focus().setLink({ href: linkUrl }).run();
			setLinkUrl('');
			setShowLinkDialog(false);
		}
	};

	const removeLink = () => {
		editor.chain().focus().unsetLink().run();
	};

	const setColor = (color: string) => {
		editor.chain().focus().setColor(color).run();
		setShowColorPicker(false);
	};

	return (
		<div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
			{/* Undo */}
			<IconButton
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
			>
				<Undo />
			</IconButton>

			{/* Redo */}
			<IconButton
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().redo()}
			>
				<Redo />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Bold */}
			<IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
				<BoldIcon />
			</IconButton>

			{/* Italic */}
			<IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
				<ItalicIcon />
			</IconButton>

			{/* Underline */}
			<IconButton
				onClick={() => editor.chain().focus().toggleUnderline().run()}
			>
				<UnderlineIcon />
			</IconButton>

			{/* Strike */}
			<IconButton onClick={() => editor.chain().focus().toggleStrike().run()}>
				<Strikethrough />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Link */}
			<div className="relative">
				<IconButton
					onClick={() => {
						if (editor.isActive('link')) {
							removeLink();
						} else {
							setShowLinkDialog(!showLinkDialog);
						}
					}}
				>
					<LinkIcon />
				</IconButton>

				{showLinkDialog && (
					<div
						ref={linkDialogRef}
						className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64"
					>
						<div className="flex gap-2">
							<Input
								type="url"
								placeholder="Enter URL..."
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										addLink();
									} else if (e.key === 'Escape') {
										setShowLinkDialog(false);
										setLinkUrl('');
									}
								}}
								className="h-auto w-40"
								autoFocus
							/>
							<Button onClick={addLink}>Add</Button>
							<Button
								onClick={() => {
									setShowLinkDialog(false);
									setLinkUrl('');
								}}
							>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Color Picker */}
			<div className="relative">
				<IconButton
					onClick={() => setShowColorPicker(!showColorPicker)}
					style={{
						color: editor.isActive('textStyle')
							? editor.getAttributes('textStyle').color || undefined
							: undefined,
					}}
				>
					<Paintbrush />
				</IconButton>

				{showColorPicker && (
					<div
						ref={colorPickerRef}
						className="absolute w-max top-10 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
					>
						<div className="grid grid-cols-6 gap-2">
							{[
								'#000000',
								'#374151',
								'#6B7280',
								'#EF4444',
								'#F97316',
								'#EAB308',
								'#22C55E',
								'#10B981',
								'#06B6D4',
								'#3B82F6',
								'#6366F1',
								'#8B5CF6',
								'#EC4899',
								'#F43F5E',
								'#64748B',
								'#78716C',
								'#DC2626',
								'#EA580C',
								'#CA8A04',
								'#16A34A',
								'#059669',
								'#0891B2',
								'#2563EB',
								'#4F46E5',
								'#7C3AED',
								'#C026D3',
								'#BE185D',
								'#E11D48',
							].map((color) => (
								<button
									key={color}
									onClick={() => setColor(color)}
									className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
									style={{ backgroundColor: color }}
									title={color}
								/>
							))}
						</div>
						<div className="mt-2 pt-2 border-t border-gray-200">
							<button
								onClick={() => editor.chain().focus().unsetColor().run()}
								className="w-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
							>
								Remove Color
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Bullet List */}
			<IconButton
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List />
			</IconButton>

			{/* Ordered List */}
			<IconButton
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrdered />
			</IconButton>

			{/* Task List (Checklist) */}
			<IconButton onClick={() => editor.chain().focus().toggleTaskList().run()}>
				<LayoutList />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Text Alignment */}
			<IconButton
				onClick={() => editor.chain().focus().setTextAlign('left').run()}
			>
				<AlignLeft />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().setTextAlign('center').run()}
			>
				<AlignCenter />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().setTextAlign('right').run()}
			>
				<AlignRight />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().setTextAlign('justify').run()}
			>
				<AlignJustify />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Headings */}
			<IconButton
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			>
				<Heading1 />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<Heading2 />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				<Heading3 />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
			>
				<Heading4 />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
			>
				<Heading5 />
			</IconButton>

			<IconButton
				onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
			>
				<Heading6 />
			</IconButton>
		</div>
	);
};

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
	content = '',
	onChange,
	className,
	isInvalid = false,
	disabled = false,
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: false,
				orderedList: false,
				listItem: false,
				bold: false,
				italic: false,
				strike: false,
				heading: false,
			}),
			Bold,
			Italic,
			Underline,
			Strike,
			BulletList.configure({
				HTMLAttributes: {
					class: 'tiptap-bullet-list',
				},
			}),
			OrderedList.configure({
				HTMLAttributes: {
					class: 'tiptap-ordered-list',
				},
			}),
			ListItem,
			TaskList.configure({
				HTMLAttributes: {
					class: 'tiptap-task-list',
				},
			}),
			TaskItem.configure({
				HTMLAttributes: {
					class: 'tiptap-task-item',
				},
				nested: true,
			}),
			Heading.configure({
				levels: [1, 2, 3, 4, 5, 6],
				HTMLAttributes: {
					class: 'tiptap-heading',
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'tiptap-link',
				},
			}),
			TextStyle,
			Color,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		content,
		editable: !disabled,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
	});

	React.useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [editor, content]);

	const editorClasses = clx(
		'rounded-md shadow-borders-base',
		isInvalid && 'border-red-600',
		className
	);

	return (
		<div className={editorClasses}>
			{!disabled && <MenuBar editor={editor} />}
			<EditorContent
				editor={editor}
				className={clx(
					// ProseMirror base styles
					'[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[8rem] [&_.ProseMirror]:hover:bg-ui-bg-field-hover:hover [&_.ProseMirror]:caret-ui-fg-base [&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:bg-ui-bg-field [&_.ProseMirror]:text-ui-fg-base [&_.ProseMirror]:p-4 [&_.ProseMirror]:transition-fg',
					// Placeholder styles for empty editor
					'[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
					'[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
					'[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
					'[&_.ProseMirror_.is-empty::before]:float-left',
					'[&_.ProseMirror_.is-empty::before]:pointer-events-none',
					'[&_.ProseMirror_.is-empty::before]:h-0',
					// List styles
					'[&_.tiptap-bullet-list]:list-disc [&_.tiptap-bullet-list]:ml-6',
					'[&_.tiptap-ordered-list]:list-decimal [&_.tiptap-ordered-list]:ml-6',
					'[&_ul]:list-disc [&_ul]:ml-6',
					'[&_ol]:list-decimal [&_ol]:ml-6',
					'[&_li]:mb-1',
					'[&_.tiptap-bullet-list_li]:mb-1',
					'[&_.tiptap-ordered-list_li]:mb-1',
					// Text alignment styles
					'[&_.ProseMirror_[style*="text-align:_left"]]:text-left',
					'[&_.ProseMirror_[style*="text-align:_center"]]:text-center',
					'[&_.ProseMirror_[style*="text-align:_right"]]:text-right',
					'[&_.ProseMirror_[style*="text-align:_justify"]]:text-justify',
					// Heading styles
					'[&_.tiptap-heading]:font-semibold [&_.tiptap-heading]:mt-4 [&_.tiptap-heading]:mb-2',
					'[&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:leading-10 [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-4',
					'[&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:leading-9 [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-3',
					'[&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:leading-8 [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-3',
					'[&_.ProseMirror_h4]:text-xl [&_.ProseMirror_h4]:leading-7 [&_.ProseMirror_h4]:font-semibold [&_.ProseMirror_h4]:mt-4 [&_.ProseMirror_h4]:mb-2',
					'[&_.ProseMirror_h5]:text-lg [&_.ProseMirror_h5]:leading-6 [&_.ProseMirror_h5]:font-semibold [&_.ProseMirror_h5]:mt-3 [&_.ProseMirror_h5]:mb-2',
					'[&_.ProseMirror_h6]:text-base [&_.ProseMirror_h6]:leading-5 [&_.ProseMirror_h6]:font-semibold [&_.ProseMirror_h6]:mt-3 [&_.ProseMirror_h6]:mb-2',
					// Remove top margin from first element
					'[&_.ProseMirror_>*:first-child]:mt-0',
					// Link styles
					'[&_.tiptap-link]:text-blue-600 [&_.tiptap-link]:underline [&_.tiptap-link]:cursor-pointer hover:[&_.tiptap-link]:text-blue-800',
					// Task list styles (based on official Tiptap examples)
					'[&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:ml-0 [&_ul[data-type="taskList"]]:p-0',
					'[&_ul[data-type="taskList"]_li]:flex [&_ul[data-type="taskList"]_li]:items-start [&_ul[data-type="taskList"]_li]:mb-1',
					'[&_ul[data-type="taskList"]_li>label]:flex-none [&_ul[data-type="taskList"]_li>label]:mr-2 [&_ul[data-type="taskList"]_li>label]:select-none',
					'[&_ul[data-type="taskList"]_li>div]:flex-1',
					'[&_ul[data-type="taskList"]_input[type="checkbox"]]:cursor-pointer',
					'[&_ul[data-type="taskList"]]:!ml-2'
				)}
			/>
		</div>
	);
};

export default TiptapEditor;
