// components/forms/TextEditor.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  value?: string;
  onChange: (content: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const [editorValue, setEditorValue] = useState(value || "");

  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const handleEditorChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <ReactQuill
      value={editorValue}
      onChange={handleEditorChange}
      theme="snow"
      formats={[
        "header", "font", "size", "bold", "italic", "underline",
        "list", "bullet", "link", "image", "align"
      ]}
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline"],
          ["link"],
          [{ color: [] }, { background: [] }],
          ["image"],
          [{ align: [] }],
          ["clean"],
        ],
      }}
    />
  );
}