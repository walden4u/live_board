import PocketBase from 'pocketbase';

// 브라우저에서는 Next.js 프록시(/pb)를 통해 접근
// 서버에서는 내부 URL 또는 환경변수 사용
const url = typeof window !== 'undefined'
  ? '/pb'
  : (process.env.POCKETBASE_INTERNAL_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://pocketbase:8090');

const pb = new PocketBase(url);

pb.autoCancellation(false);

export default pb;
