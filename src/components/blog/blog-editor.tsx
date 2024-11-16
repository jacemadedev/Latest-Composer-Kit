'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogEditorToolbar } from './blog-editor-toolbar'
import { useEffect } from 'react'

interface BlogEditorProps {
  content: string
  onChange: (content: string) => void
  isLoading?: boolean
}

export function BlogEditor({ content, onChange, isLoading = false }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    // Fix SSR hydration mismatch
    enableInputRules: false,
    enablePasteRules: false,
    immediatelyRender: false,
  })

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) {
    return null
  }

  return (
    <Card className="flex min-h-[600px] flex-col">
      <CardHeader>
        <CardTitle>Blog Post Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <BlogEditorToolbar editor={editor} />
        <div className="flex-grow overflow-y-auto rounded-lg border bg-background">
          <EditorContent editor={editor} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => editor.commands.clearContent()}
          disabled={isLoading}
        >
          Clear
        </Button>
      </CardFooter>
    </Card>
  )
}
