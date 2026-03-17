import PostForm from '@/components/PostForm';

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
      <PostForm />
    </div>
  );
}
