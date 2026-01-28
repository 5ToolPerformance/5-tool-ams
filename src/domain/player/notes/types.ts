export interface PlayerNoteCardData {
  id: string;
  content: string;
  createdAt: string;
  type: string;
  author: {
    id: string;
    name: string;
    role?: string;
  };
}
