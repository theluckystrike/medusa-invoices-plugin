// External packages
import { Button, clx, DropdownMenu, IconButton, Input } from '@medusajs/ui';
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
import { Editor, EditorContent, useEditor } from '@tiptap/react';
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
	editorProps?: Omit<TiptapEditorProps, 'content' | 'onChange'>;
};

const MenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [showColorPicker, setShowColorPicker] = React.useState(false);
	const [showLinkDialog, setShowLinkDialog] = React.useState(false);
	const [linkUrl, setLinkUrl] = React.useState('');

	if (!editor) {
		return null;
	}

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
				className="size-7"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
			>
				<Undo size={16} />
			</IconButton>

			{/* Redo */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().redo()}
			>
				<Redo size={16} />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Bold */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<BoldIcon size={16} />
			</IconButton>

			{/* Italic */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<ItalicIcon size={16} />
			</IconButton>

			{/* Underline */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
			>
				<UnderlineIcon size={16} />
			</IconButton>

			{/* Strike */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleStrike().run()}
			>
				<Strikethrough size={16} />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Link */}
			<DropdownMenu open={showLinkDialog} onOpenChange={setShowLinkDialog}>
				<DropdownMenu.Trigger asChild>
					<IconButton
						className="size-7"
						onClick={() => {
							if (editor.isActive('link')) {
								removeLink();
							} else {
								setShowLinkDialog(!showLinkDialog);
							}
						}}
					>
						<LinkIcon size={16} />
					</IconButton>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content className="flex gap-2">
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
				</DropdownMenu.Content>
			</DropdownMenu>

			{/* Color Picker */}
			<DropdownMenu open={showColorPicker} onOpenChange={setShowColorPicker}>
				<DropdownMenu.Trigger asChild>
					<IconButton
						className="size-7"
						onClick={() => setShowColorPicker(!showColorPicker)}
						style={{
							color: editor.isActive('textStyle')
								? editor.getAttributes('textStyle').color || undefined
								: undefined,
						}}
					>
						<Paintbrush size={16} />
					</IconButton>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<div
						className="grid gap-2 mb-4"
						style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
					>
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
								className="w-6 h-6 rounded hover:scale-110 transition-transform"
								style={{ backgroundColor: color }}
								title={color}
							/>
						))}
					</div>
					<Button
						onClick={() => {
							editor.chain().focus().unsetColor().run();
							setColor('');
							setShowColorPicker(false);
						}}
						className="w-full"
					>
						Remove Color
					</Button>
				</DropdownMenu.Content>
			</DropdownMenu>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Bullet List */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List size={16} />
			</IconButton>

			{/* Ordered List */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrdered size={16} />
			</IconButton>

			{/* Task List (Checklist) */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleTaskList().run()}
			>
				<LayoutList size={16} />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Text Alignment */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().setTextAlign('left').run()}
			>
				<AlignLeft size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().setTextAlign('center').run()}
			>
				<AlignCenter size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().setTextAlign('right').run()}
			>
				<AlignRight size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().setTextAlign('justify').run()}
			>
				<AlignJustify size={16} />
			</IconButton>

			<div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

			{/* Headings */}
			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			>
				<Heading1 size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<Heading2 size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				<Heading3 size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
			>
				<Heading4 size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
			>
				<Heading5 size={16} />
			</IconButton>

			<IconButton
				className="size-7"
				onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
			>
				<Heading6 size={16} />
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
					class: 'font-semibold mt-4 mb-2',
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class:
						'text-ui-bg-interactive underline cursor-pointer hover:text-blue-800',
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
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose focus:outline-none',
			},
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
					'[&_.tiptap]:outline-none [&_.tiptap]:min-h-[8rem] [&_.tiptap]:hover:bg-ui-bg-field-hover:hover [&_.tiptap]:caret-ui-fg-base [&_.tiptap]:prose [&_.tiptap]:prose-sm [&_.tiptap]:bg-ui-bg-field [&_.tiptap]:text-ui-fg-base [&_.tiptap]:p-4 [&_.tiptap]:transition-fg',
					// Placeholder styles for empty editor
					'[&_.tiptap_p.is-editor-empty:first-child::before]:float-left',
					'[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none',
					'[&_.tiptap_p.is-editor-empty:first-child::before]:h-0',
					'[&_.tiptap_.is-empty::before]:float-left',
					'[&_.tiptap_.is-empty::before]:pointer-events-none',
					'[&_.tiptap_.is-empty::before]:h-0',
					// List styles
					'[&_.tiptap-bullet-list]:list-disc [&_.tiptap-bullet-list]:ml-6',
					'[&_ul]:list-disc [&_ul]:ml-6',
					'[&_ol]:list-decimal [&_ol]:ml-6',
					'[&_li]:mb-1',
					'[&_.tiptap-bullet-list_li]:mb-1',
					'[&_.tiptap-ordered-list_li]:mb-1 [&_.tiptap-ordered-list]:list-decimal [&_.tiptap-ordered-list]:ml-6',
					// Text alignment styles
					'[&_.tiptap_[style*="text-align:_left"]]:text-left',
					'[&_.tiptap_[style*="text-align:_center"]]:text-center',
					'[&_.tiptap_[style*="text-align:_right"]]:text-right',
					'[&_.tiptap_[style*="text-align:_justify"]]:text-justify',
					// Heading styles
					'[&_.tiptap_h1]:text-4xl [&_.tiptap_h1]:leading-10 [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mt-6 [&_.tiptap_h1]:mb-4',
					'[&_.tiptap_h2]:text-3xl [&_.tiptap_h2]:leading-9 [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:mt-5 [&_.tiptap_h2]:mb-3',
					'[&_.tiptap_h3]:text-2xl [&_.tiptap_h3]:leading-8 [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:mb-3',
					'[&_.tiptap_h4]:text-xl [&_.tiptap_h4]:leading-7 [&_.tiptap_h4]:font-semibold [&_.tiptap_h4]:mt-4 [&_.tiptap_h4]:mb-2',
					'[&_.tiptap_h5]:text-lg [&_.tiptap_h5]:leading-6 [&_.tiptap_h5]:font-semibold [&_.tiptap_h5]:mt-3 [&_.tiptap_h5]:mb-2',
					'[&_.tiptap_h6]:text-base [&_.tiptap_h6]:leading-5 [&_.tiptap_h6]:font-semibold [&_.tiptap_h6]:mt-3 [&_.tiptap_h6]:mb-2',
					// Remove top margin from first element
					'[&_.tiptap_>*:first-child]:mt-0',
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
