// components/forms/TextEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Minus,
  Redo,
  Undo,
  X,
  Type,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', 
  '#800080', '#008080', '#FFC0CB', '#A52A2A', '#808080',
  '#FFFFFF', '#FFE4E1', '#98FB98', '#87CEEB', '#FFD700'
];

export function TextEditor({ 
  value, 
  onChange, 
  className,
  placeholder = 'اكتب هنا...'
}: TextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Color,
      TextStyle,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem', 'bulletList', 'orderedList'],
        defaultAlignment: 'right',
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert min-h-[200px] focus:outline-none max-w-none rtl',
          'prose-headings:text-foreground',
          'prose-p:text-foreground',
          'prose-strong:text-foreground',
          'prose-em:text-foreground',
          'prose-li:text-foreground'
        ),
      },
    },
  });

  if (!editor || !mounted) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const ToolbarButton = ({ onClick, active, disabled, icon: Icon, title }: any) => {
    return (
      <Button
        type="button"
        variant={active ? "default" : "ghost"}
        size="icon"
        onClick={onClick}
        disabled={disabled}
        className="h-8 w-8"
        title={title}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className={cn(
      "border rounded-lg bg-background", 
      "dark:border-neutral-800",
      className
    )}>
      <div className="flex flex-wrap gap-1 border-b p-1 dark:border-neutral-800">
        {/* Theme Toggle */}
        <ToolbarButton
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          icon={theme === 'dark' ? Sun : Moon}
          title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Undo & Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={Undo}
          title="تراجع"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={Redo}
          title="إعادة"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            editor.chain().focus().focus().run();
          }}
          active={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="عنوان رئيسي"
        />
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            editor.chain().focus().focus().run();
          }}
          active={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="عنوان فرعي"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
          title="غامق"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="مائل"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={UnderlineIcon}
          title="تحته خط"
        />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="لون النص"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2" align="start">
            <div className="grid grid-cols-5 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={List}
          title="قائمة نقطية"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="قائمة رقمية"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().setTextAlign('left').run();
            editor.chain().focus().focus().run();
          }}
          active={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="محاذاة لليسار"
        />
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().setTextAlign('center').run();
            editor.chain().focus().focus().run();
          }}
          active={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="توسيط"
        />
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().setTextAlign('right').run();
            editor.chain().focus().focus().run();
          }}
          active={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="محاذاة لليمين"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Link & Image */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('link') ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-2">
              <input
                type="url"
                placeholder="أدخل الرابط"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <Button onClick={addLink} size="sm">
                إضافة رابط
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-2">
              <input
                type="url"
                placeholder="أدخل رابط الصورة"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <Button onClick={addImage} size="sm">
                إضافة صورة
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          icon={X}
          title="مسح التنسيق"
        />
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}