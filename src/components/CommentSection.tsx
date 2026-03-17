'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { Comment } from '@/lib/types';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const result = await pb.collection('comments').getList<Comment>(1, 50, {
        filter: `post = "${postId}"`,
        sort: 'created',
        expand: 'author',
      });
      setComments(result.items);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pb.authStore.isValid || !content.trim()) return;

    setLoading(true);
    try {
      await pb.collection('comments').create({
        content: content.trim(),
        post: postId,
        author: pb.authStore.record!.id,
      });
      setContent('');
      fetchComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await pb.collection('comments').delete(commentId);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>

      {pb.authStore.isValid && (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            등록
          </button>
        </form>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{comment.expand?.author?.name || '익명'}</span>
                <span>{new Date(comment.created).toLocaleString('ko-KR')}</span>
              </div>
              {pb.authStore.record?.id === comment.author && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
