'use client'

import { useEditor, EditorContent, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { useEffect, useState } from 'react'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo, Table as TableIcon, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { marked } from 'marked'
import TurndownService from 'turndown'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    disabled?: boolean
}

const turndownService = new TurndownService({
    codeBlockStyle: 'fenced'
})

// Custom FontSize extension
const FontSize = Extension.create({
    name: 'fontSize',

    addGlobalAttributes() {
        return [
            {
                types: ['textStyle'],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {}
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`
                            }
                        },
                    },
                },
            },
        ]
    },
})

interface ToolbarButtonProps {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
}

const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }: ToolbarButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded hover:bg-slate-100 transition-colors ${isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
)

export function RichTextEditor({ content, onChange, disabled = false }: RichTextEditorProps) {
    const [zoom, setZoom] = useState(100)
    const [showTableDialog, setShowTableDialog] = useState(false)
    const [tableRows, setTableRows] = useState('3')
    const [tableCols, setTableCols] = useState('3')

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontSize,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: '', // Initial content set via useEffect
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            const markdown = turndownService.turndown(html)
            onChange(markdown)
        },
        editable: !disabled,
        immediatelyRender: false,
    })

    // Sync content from prop to editor (one-way sync on mount or when content changes externally significantly)
    // Note: We need to be careful not to overwrite cursor position or active typing.
    // For this simple implementation, we'll only set content if the editor is empty or if it's a completely new document.
    // A more robust approach would involve comparing the markdown.
    useEffect(() => {
        if (editor && content) {
            const currentContent = turndownService.turndown(editor.getHTML())
            if (currentContent !== content && !editor.isFocused) {
                // Convert markdown to HTML
                const html = marked.parse(content) as string
                editor.commands.setContent(html)
            } else if (editor.isEmpty && content) {
                const html = marked.parse(content) as string
                editor.commands.setContent(html)
            }
        }
    }, [content, editor])

    // Update editable state
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled)
        }
    }, [disabled, editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    disabled={disabled}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    disabled={disabled}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    disabled={disabled}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    disabled={disabled}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    disabled={disabled}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    disabled={disabled}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    disabled={disabled}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    disabled={disabled}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Font Family Dropdown */}
                <select
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    disabled={disabled}
                    className="px-2 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    title="Font Family"
                >
                    <option value="">Default</option>
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                </select>

                {/* Font Size Selector */}
                <select
                    onChange={(e) => {
                        const size = e.target.value
                        if (size) {
                            editor.chain().focus().setMark('textStyle', { fontSize: size }).run()
                        } else {
                            editor.chain().focus().unsetMark('textStyle').run()
                        }
                    }}
                    disabled={disabled}
                    className="px-2 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    title="Font Size"
                >
                    <option value="">Size</option>
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                </select>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Table Controls */}
                <ToolbarButton
                    onClick={() => setShowTableDialog(true)}
                    disabled={disabled}
                    title="Insert Table"
                >
                    <TableIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Zoom Controls */}
                <ToolbarButton
                    onClick={() => setZoom(prev => Math.min(prev + 10, 200))}
                    disabled={disabled}
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setZoom(prev => Math.max(prev - 10, 50))}
                    disabled={disabled}
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setZoom(100)}
                    disabled={disabled}
                    title="Reset Zoom"
                >
                    <RotateCcw className="w-4 h-4" />
                </ToolbarButton>
                <span className="text-xs text-slate-500 px-2">{zoom}%</span>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo() || disabled}
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo() || disabled}
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-auto bg-white">
                <div
                    className="cursor-text min-h-full"
                    onClick={() => editor.chain().focus().run()}
                    style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'top left',
                    }}
                >
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Table Dimension Dialog */}
            {showTableDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-80">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Insert Table</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Rows
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={tableRows}
                                    onChange={(e) => setTableRows(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Columns
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={tableCols}
                                    onChange={(e) => setTableCols(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowTableDialog(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const rows = parseInt(tableRows) || 3
                                    const cols = parseInt(tableCols) || 3
                                    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
                                    setShowTableDialog(false)
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
