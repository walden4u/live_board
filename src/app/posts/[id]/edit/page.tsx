'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';
import { Post } from '@/lib/types';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const record = await pb.collection('posts').getOne<Post>(params.id as string);
        if (pb.authStore.record?.id !== record.author) {
          router.push('/');
          return;
        }
        setPost(record);
      } catch (err) {
        console.error(err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">로딩 중...</div>;
  }

  if (!post) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>
      <PostForm post={post} />
    </div>
  );
}
