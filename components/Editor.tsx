// components/Editor.tsx
import { Editor } from '@tinymce/tinymce-react';

const MyEditor = () => {
  const handleEditorChange = (content: string, editor: any) => {
    console.log('Content was updated:', content);
  };

  return (
    <div>
      <Editor
        apiKey="your-tinymce-api-key" // إذا كنت تستخدم النسخة السحابية
        initialValue="<p>Start typing...</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'searchreplace', 'wordcount'],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help',
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default MyEditor;
