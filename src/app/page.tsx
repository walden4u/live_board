import PostList from '@/components/PostList';

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">게시글 목록</h1>
      <PostList />
    </div>
  );
}
