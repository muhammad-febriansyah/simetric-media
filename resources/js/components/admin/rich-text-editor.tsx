'use no memo';

import { Placeholder } from '@tiptap/extensions';
import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { LucideIcon } from 'lucide-react';
import {
    BoldIcon,
    Heading2Icon,
    Heading3Icon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    QuoteIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    UnderlineIcon,
    Undo2Icon,
    UnlinkIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type RichTextEditorProps = {
    id: string;
    name: string;
    label: string;
    defaultValue?: string | null;
    placeholder: string;
    invalid?: boolean;
    /** Smaller editor with fewer tools, e.g. for FAQ answers. */
    compact?: boolean;
};

type ToolbarAction = {
    label: string;
    icon: LucideIcon;
    isActive: (editor: Editor) => boolean;
    run: (editor: Editor) => void;
    compact?: boolean;
};

const formattingActions: ToolbarAction[] = [
    {
        label: 'Tebal',
        icon: BoldIcon,
        isActive: (editor) => editor.isActive('bold'),
        run: (editor) => editor.chain().focus().toggleBold().run(),
        compact: true,
    },
    {
        label: 'Miring',
        icon: ItalicIcon,
        isActive: (editor) => editor.isActive('italic'),
        run: (editor) => editor.chain().focus().toggleItalic().run(),
        compact: true,
    },
    {
        label: 'Garis bawah',
        icon: UnderlineIcon,
        isActive: (editor) => editor.isActive('underline'),
        run: (editor) => editor.chain().focus().toggleUnderline().run(),
    },
];

const blockActions: ToolbarAction[] = [
    {
        label: 'Subjudul',
        icon: Heading2Icon,
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
        run: (editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        label: 'Subjudul kecil',
        icon: Heading3Icon,
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
        run: (editor) =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        label: 'Daftar poin',
        icon: ListIcon,
        isActive: (editor) => editor.isActive('bulletList'),
        run: (editor) => editor.chain().focus().toggleBulletList().run(),
        compact: true,
    },
    {
        label: 'Daftar bernomor',
        icon: ListOrderedIcon,
        isActive: (editor) => editor.isActive('orderedList'),
        run: (editor) => editor.chain().focus().toggleOrderedList().run(),
        compact: true,
    },
    {
        label: 'Kutipan',
        icon: QuoteIcon,
        isActive: (editor) => editor.isActive('blockquote'),
        run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
];

function ToolbarToggle({
    editor,
    action,
}: {
    editor: Editor;
    action: ToolbarAction;
}) {
    const isActive = useEditorState({
        editor,
        selector: ({ editor: current }) => action.isActive(current),
    });
    const Icon = action.icon;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    pressed={isActive}
                    onPressedChange={() => action.run(editor)}
                    aria-label={action.label}
                >
                    <Icon />
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
        </Tooltip>
    );
}

function ToolbarButton({
    label,
    icon: Icon,
    onClick,
    disabled,
}: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-8"
                    onClick={onClick}
                    disabled={disabled}
                    aria-label={label}
                >
                    <Icon />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

function LinkControl({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const isActive = useEditorState({
        editor,
        selector: ({ editor: current }) => current.isActive('link'),
    });

    const openPopover = (nextOpen: boolean) => {
        if (nextOpen) {
            setUrl(editor.getAttributes('link').href ?? '');
        }

        setOpen(nextOpen);
    };

    const applyLink = () => {
        const href = url.trim();

        if (href === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href })
                .run();
        }

        setOpen(false);
    };

    return (
        <>
            <Popover open={open} onOpenChange={openPopover}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isActive}
                                aria-label="Tautan"
                            >
                                <LinkIcon />
                            </Toggle>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Tautan</TooltipContent>
                </Tooltip>
                <PopoverContent align="start" className="flex w-80 gap-2">
                    <Input
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                applyLink();
                            }
                        }}
                        placeholder="https://contoh.com"
                        aria-label="URL tautan"
                        className="h-9"
                    />
                    <Button type="button" size="sm" onClick={applyLink}>
                        <LinkIcon data-icon="inline-start" />
                        Pasang
                    </Button>
                </PopoverContent>
            </Popover>
            {isActive && (
                <ToolbarButton
                    label="Hapus tautan"
                    icon={UnlinkIcon}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .extendMarkRange('link')
                            .unsetLink()
                            .run()
                    }
                />
            )}
        </>
    );
}

function Toolbar({ editor, compact }: { editor: Editor; compact: boolean }) {
    const history = useEditorState({
        editor,
        selector: ({ editor: current }) => ({
            canUndo: current.can().undo(),
            canRedo: current.can().redo(),
        }),
    });
    const visible = (action: ToolbarAction) => !compact || action.compact;

    return (
        <div
            role="toolbar"
            aria-label="Format teks"
            className="flex flex-wrap items-center gap-1 border-b border-input px-2 py-1.5"
        >
            {formattingActions.filter(visible).map((action) => (
                <ToolbarToggle
                    key={action.label}
                    editor={editor}
                    action={action}
                />
            ))}
            <LinkControl editor={editor} />
            <Separator orientation="vertical" className="mx-1 h-5!" />
            {blockActions.filter(visible).map((action) => (
                <ToolbarToggle
                    key={action.label}
                    editor={editor}
                    action={action}
                />
            ))}
            <Separator orientation="vertical" className="mx-1 h-5!" />
            <ToolbarButton
                label="Hapus format"
                icon={RemoveFormattingIcon}
                onClick={() =>
                    editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
            />
            <div className="ml-auto flex items-center gap-1">
                <ToolbarButton
                    label="Urungkan"
                    icon={Undo2Icon}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!history.canUndo}
                />
                <ToolbarButton
                    label="Ulangi"
                    icon={Redo2Icon}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!history.canRedo}
                />
            </div>
        </div>
    );
}

/**
 * Rich text field for long content. The HTML is submitted through a hidden input
 * named `name` and sanitized on the server before it is saved.
 */
export function RichTextEditor({
    id,
    name,
    label,
    defaultValue,
    placeholder,
    invalid = false,
    compact = false,
}: RichTextEditorProps) {
    const [html, setHtml] = useState(defaultValue ?? '');

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                codeBlock: false,
                link: {
                    openOnClick: false,
                    autolink: true,
                    defaultProtocol: 'https',
                },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: defaultValue ?? '',
        editorProps: {
            attributes: {
                id,
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-label': label,
                'aria-invalid': invalid ? 'true' : 'false',
                class: cn(
                    'rich-text px-4 py-3 text-sm outline-none',
                    compact ? 'min-h-28' : 'min-h-56',
                ),
            },
        },
        onUpdate: ({ editor: current }) =>
            setHtml(current.isEmpty ? '' : current.getHTML()),
    });

    return (
        <div
            data-invalid={invalid || undefined}
            className="overflow-hidden rounded-xl border border-input bg-card transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-invalid:border-destructive data-invalid:ring-destructive/20"
        >
            {editor ? (
                <>
                    <Toolbar editor={editor} compact={compact} />
                    <EditorContent editor={editor} />
                </>
            ) : (
                <div className={compact ? 'min-h-36' : 'min-h-64'} />
            )}
            <input type="hidden" name={name} value={html} />
        </div>
    );
}
