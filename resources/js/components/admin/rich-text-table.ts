import { goToNextCell, tableEditing } from '@tiptap/pm/tables';
import { mergeAttributes, Node } from '@tiptap/react';

/** Roles that prosemirror-tables uses to recognise the table node types. */
const TABLE_ROLES: Record<string, string> = {
    table: 'table',
    tableRow: 'row',
    tableCell: 'cell',
    tableHeader: 'header_cell',
};

function spanAttribute(name: 'colspan' | 'rowspan') {
    return {
        default: 1,
        parseHTML: (element: HTMLElement) =>
            Number(element.getAttribute(name)) || 1,
        renderHTML: (attributes: Record<string, number>) =>
            attributes[name] > 1 ? { [name]: attributes[name] } : {},
    };
}

function cellAttributes() {
    return {
        colspan: spanAttribute('colspan'),
        rowspan: spanAttribute('rowspan'),
        colwidth: { default: null, rendered: false },
    };
}

const Table = Node.create({
    name: 'table',
    group: 'block',
    content: 'tableRow+',
    isolating: true,

    extendNodeSchema: (extension) => ({
        tableRole: TABLE_ROLES[extension.name],
    }),

    parseHTML: () => [{ tag: 'table' }],

    renderHTML: ({ HTMLAttributes }) => [
        'table',
        mergeAttributes(HTMLAttributes),
        ['tbody', 0],
    ],

    addKeyboardShortcuts() {
        return {
            Tab: () =>
                goToNextCell(1)(this.editor.state, this.editor.view.dispatch),
            'Shift-Tab': () =>
                goToNextCell(-1)(this.editor.state, this.editor.view.dispatch),
        };
    },

    addProseMirrorPlugins: () => [tableEditing()],
});

const TableRow = Node.create({
    name: 'tableRow',
    content: '(tableCell | tableHeader)*',

    parseHTML: () => [{ tag: 'tr' }],

    renderHTML: ({ HTMLAttributes }) => [
        'tr',
        mergeAttributes(HTMLAttributes),
        0,
    ],
});

const TableCell = Node.create({
    name: 'tableCell',
    content: 'block+',
    isolating: true,

    addAttributes: cellAttributes,

    parseHTML: () => [{ tag: 'td' }],

    renderHTML: ({ HTMLAttributes }) => [
        'td',
        mergeAttributes(HTMLAttributes),
        0,
    ],
});

const TableHeader = Node.create({
    name: 'tableHeader',
    content: 'block+',
    isolating: true,

    addAttributes: cellAttributes,

    parseHTML: () => [{ tag: 'th' }],

    renderHTML: ({ HTMLAttributes }) => [
        'th',
        mergeAttributes(HTMLAttributes),
        0,
    ],
});

/**
 * Table support for the rich text editor, so tables pasted from Word or Excel
 * are kept, including merged cells. Word's own styling is not carried over.
 */
export const richTextTableExtensions = [
    Table,
    TableRow,
    TableCell,
    TableHeader,
];
