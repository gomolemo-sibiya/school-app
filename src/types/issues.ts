
export type IssueStatus = 'submitted' | 'will-address' | 'addressed' | 'will-not-address';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  studentId: string;
  studentName: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  comments?: string;
}
