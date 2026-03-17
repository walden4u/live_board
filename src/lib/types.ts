import { RecordModel } from 'pocketbase';

export interface Post extends RecordModel {
  title: string;
  content: string;
  author: string;
  views: number;
  expand?: {
    author?: User;
  };
}

export interface Comment extends RecordModel {
  content: string;
  post: string;
  author: string;
  expand?: {
    author?: User;
  };
}

export interface User extends RecordModel {
  email: string;
  name: string;
  avatar: string;
}
