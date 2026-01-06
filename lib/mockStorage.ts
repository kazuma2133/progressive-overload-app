// モック版：ローカルストレージに保存

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface MonthlyGoal {
  id: string;
  yearMonth: string; // YYYY-MM形式
  title: string; // 目標のタイトル
  targetValue?: number; // 目標値（体重、回数など）
  currentValue?: number; // 現在の値
  description?: string; // 目標の説明
  createdAt: string;
}

export interface TrainingRecord {
  id: string;
  date: string;
  menuPhotoUrl?: string; // トレーニングメニューの写真（任意）
  bodyPhotoUrl?: string; // 体の写真（任意）
  memo: string;
  weight?: number; // 体重（kg）
  likes?: number; // いいね数
  createdAt: string;
  comments?: Comment[];
}

const STORAGE_KEY = "trainingRecords";
const GOALS_STORAGE_KEY = "monthlyGoals";
const LIKES_STORAGE_KEY = "recordLikes"; // いいね済みの記録IDを保存

// ファイルをBase64に変換
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("ファイルの読み込みに失敗しました"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// トレーニング記録を保存
export async function saveTrainingRecord(data: {
  date: string;
  menuPhotoUrl?: string;
  bodyPhotoUrl?: string;
  memo: string;
  weight?: number;
}): Promise<string> {
  const records = getTrainingRecords();
  const newRecord: TrainingRecord = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    comments: [],
    likes: 0,
  };
  records.push(newRecord);
  // 日付順にソート（新しい順）
  records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return newRecord.id;
}

// トレーニング記録を取得
export function getTrainingRecords(): TrainingRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// トレーニング記録を削除
export function deleteTrainingRecord(id: string): void {
  const records = getTrainingRecords();
  const filtered = records.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// トレーニング記録を更新
export function updateTrainingRecord(
  id: string,
  data: {
    date: string;
    menuPhotoUrl?: string;
    bodyPhotoUrl?: string;
    memo: string;
    weight?: number;
  }
): void {
  const records = getTrainingRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = {
      ...records[index],
      ...data,
    };
    // 日付順にソート（新しい順）
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

// コメントを追加
export function addComment(recordId: string, text: string, author: string = "匿名"): void {
  const records = getTrainingRecords();
  const index = records.findIndex((r) => r.id === recordId);
  if (index !== -1) {
    if (!records[index].comments) {
      records[index].comments = [];
    }
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: new Date().toISOString(),
    };
    records[index].comments!.push(newComment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

// コメントを削除
export function deleteComment(recordId: string, commentId: string): void {
  const records = getTrainingRecords();
  const index = records.findIndex((r) => r.id === recordId);
  if (index !== -1 && records[index].comments) {
    records[index].comments = records[index].comments!.filter((c) => c.id !== commentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

// 月間目標を保存
export function saveMonthlyGoal(goal: Omit<MonthlyGoal, "id" | "createdAt">): string {
  const goals = getMonthlyGoals();
  const newGoal: MonthlyGoal = {
    id: Date.now().toString(),
    ...goal,
    createdAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  return newGoal.id;
}

// 月間目標を取得
export function getMonthlyGoals(): MonthlyGoal[] {
  const data = localStorage.getItem(GOALS_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 今月の目標を取得
export function getCurrentMonthGoal(): MonthlyGoal | null {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const goals = getMonthlyGoals();
  return goals.find((g) => g.yearMonth === yearMonth) || null;
}

// 月間目標を更新
export function updateMonthlyGoal(id: string, data: Partial<MonthlyGoal>): void {
  const goals = getMonthlyGoals();
  const index = goals.findIndex((g) => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...data };
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }
}

// 月間目標を削除
export function deleteMonthlyGoal(id: string): void {
  const goals = getMonthlyGoals();
  const filtered = goals.filter((g) => g.id !== id);
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(filtered));
}

// いいね済みの記録IDを取得
function getLikedRecordIds(): string[] {
  const data = localStorage.getItem(LIKES_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// いいね済みの記録IDを保存
function saveLikedRecordId(recordId: string): void {
  const likedIds = getLikedRecordIds();
  if (!likedIds.includes(recordId)) {
    likedIds.push(recordId);
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
  }
}

// いいねを削除
function removeLikedRecordId(recordId: string): void {
  const likedIds = getLikedRecordIds();
  const filtered = likedIds.filter((id) => id !== recordId);
  localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(filtered));
}

// 記録にいいねを追加
export function likeRecord(recordId: string): void {
  const records = getTrainingRecords();
  const index = records.findIndex((r) => r.id === recordId);
  if (index !== -1) {
    const isAlreadyLiked = getLikedRecordIds().includes(recordId);
    
    if (!isAlreadyLiked) {
      // いいねを追加
      records[index].likes = (records[index].likes || 0) + 1;
      saveLikedRecordId(recordId);
    } else {
      // いいねを削除
      records[index].likes = Math.max((records[index].likes || 0) - 1, 0);
      removeLikedRecordId(recordId);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

// 記録にいいね済みかどうかを確認
export function isRecordLiked(recordId: string): boolean {
  return getLikedRecordIds().includes(recordId);
}

