import PocketBase from 'pocketbase';

// 항상 /pb 프록시를 통해 접근 (브라우저/서버 모두)
// 서버에서는 next.config.ts의 rewrite가 /pb → http://pocketbase:8090으로 변환
const pb = new PocketBase('/pb');

pb.autoCancellation(false);

export default pb;
