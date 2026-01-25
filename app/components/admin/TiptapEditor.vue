<template>
  <div class="tiptap-editor">
    <!-- 툴바 -->
    <div class="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <UButton
        size="xs"
        :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-bold"
        title="굵게"
        @click="editor?.chain().focus().toggleBold().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-italic"
        title="기울임"
        @click="editor?.chain().focus().toggleItalic().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('underline') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-underline"
        title="밑줄"
        @click="editor?.chain().focus().toggleUnderline().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('strike') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-strikethrough"
        title="취소선"
        @click="editor?.chain().focus().toggleStrike().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'neutral'"
        variant="ghost"
        title="제목 1"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </UButton>
      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'neutral'"
        variant="ghost"
        title="제목 2"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </UButton>

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <UButton
        size="xs"
        :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-list-bullet"
        title="리스트"
        @click="editor?.chain().focus().toggleBulletList().run()"
      />
    </div>

    <!-- 에디터 본문 -->
    <EditorContent
      :editor="editor"
      class="prose prose-lg dark:prose-invert max-w-none p-4 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg focus-within:ring-2 focus-within:ring-primary"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Underline } from '@tiptap/extension-underline'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()


let isUpdatingFromEditor = false

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Image,
    Link.configure({
      openOnClick: false
    }),
    Underline,
    Placeholder.configure({
      placeholder: '본문을 입력하세요...'
    })
  ],
  onUpdate: ({ editor }) => {
    isUpdatingFromEditor = true
    const html = editor.getHTML()
    emit('update:modelValue', html)
    nextTick(() => {
      isUpdatingFromEditor = false
    })
  }
})

watch(() => props.modelValue, (newValue) => {
  // 에디터에서 업데이트한 경우 무시 (커서 위치 보존)
  if (isUpdatingFromEditor || !editor.value || !newValue) return

  if (newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.tiptap-editor :deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
}
</style>
