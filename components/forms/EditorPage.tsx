"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';

const EditorPage = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Start typing here...',
      }),
    ],
    content: '<p>Start typing here...</p>',
  });

  const handleSave = () => {
    const content = editor?.getHTML();
    // هنا يمكن إرسال المحتوى إلى الخادم أو تخزينه في قاعدة البيانات
    console.log(content);
  };

  return (
    <div className="editor-container w-full max-w-3xl mx-auto p-4">
      <div className="editor-header text-center mb-4">
        <h1 className="text-2xl font-bold">Create Your Content</h1>
        <p className="text-gray-500">Create content like Notion with a block-based editor</p>
      </div>
      
      {/* محتوى المحرر */}
      <EditorContent editor={editor} />

      {/* زر حفظ المحتوى */}
      <Button onClick={handleSave} className="mt-4">Save Content</Button>
    </div>
  );
};

export default EditorPage;
