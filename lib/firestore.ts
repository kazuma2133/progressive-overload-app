// Firestore（データベース）を使用したデータ保存・取得機能

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  deleteField,
} from "firebase/firestore";
import { db } from "./firebase";
import { TrainingRecord, Comment, MonthlyGoal } from "./mockStorage";

const TRAINING_RECORDS_COLLECTION = "trainingRecords";
const MONTHLY_GOALS_COLLECTION = "monthlyGoals";
const LIKES_COLLECTION = "likes";

// FirestoreのTimestampをDate文字列に変換
function timestampToDateString(timestamp: any): string {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return timestamp || new Date().toISOString();
}

// Date文字列をFirestoreのTimestampに変換
function dateStringToTimestamp(dateString: string): Timestamp {
  return Timestamp.fromDate(new Date(dateString));
}

// トレーニング記録を保存
export async function saveTrainingRecord(data: {
  date: string;
  menuPhotoUrl?: string;
  bodyPhotoUrl?: string;
  memo: string;
  weight?: number;
}): Promise<string> {
  try {
    // Firestoreはundefinedをサポートしていないため、undefinedの値を除外
    const firestoreData: any = {
      date: data.date,
      memo: data.memo || "",
      createdAt: Timestamp.now(),
      comments: [],
      likes: 0,
    };
    
    // undefinedでない値のみを追加
    if (data.menuPhotoUrl !== undefined && data.menuPhotoUrl !== null) {
      firestoreData.menuPhotoUrl = data.menuPhotoUrl;
    }
    if (data.bodyPhotoUrl !== undefined && data.bodyPhotoUrl !== null) {
      firestoreData.bodyPhotoUrl = data.bodyPhotoUrl;
    }
    if (data.weight !== undefined && data.weight !== null) {
      firestoreData.weight = data.weight;
    }
    
    const docRef = await addDoc(collection(db, TRAINING_RECORDS_COLLECTION), firestoreData);
    return docRef.id;
  } catch (error) {
    console.error("記録の保存中にエラーが発生しました:", error);
    
    // エラーメッセージを改善
    if (error instanceof Error) {
      // Firestoreのエラーの場合
      if ((error as any).code) {
        const code = (error as any).code;
        if (code === "permission-denied") {
          throw new Error("保存の権限がありません。ログインしてください。");
        } else if (code === "unavailable") {
          throw new Error("ネットワークエラーが発生しました。接続を確認してください。");
        } else if (code === "invalid-argument") {
          throw new Error("データの形式が正しくありません。入力内容を確認してください。");
        }
      }
    }
    
    throw error;
  }
}

// トレーニング記録を取得（日付順、新しい順）
export async function getTrainingRecords(): Promise<TrainingRecord[]> {
  try {
    const q = query(
      collection(db, TRAINING_RECORDS_COLLECTION),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date,
        menuPhotoUrl: data.menuPhotoUrl || undefined,
        bodyPhotoUrl: data.bodyPhotoUrl || undefined,
        memo: data.memo || "",
        weight: data.weight || undefined,
        likes: data.likes || 0,
        createdAt: timestampToDateString(data.createdAt),
        comments: (data.comments || []).map((c: any) => ({
          ...c,
          createdAt: timestampToDateString(c.createdAt),
        })),
      } as TrainingRecord;
    });
  } catch (error) {
    console.error("記録の取得中にエラーが発生しました:", error);
    return [];
  }
}

// トレーニング記録を更新
export async function updateTrainingRecord(
  id: string,
  data: {
    date: string;
    menuPhotoUrl?: string;
    bodyPhotoUrl?: string;
    memo: string;
    weight?: number;
  }
): Promise<void> {
  try {
    // Firestoreはundefinedをサポートしていないため、undefinedの値を除外
    const firestoreData: any = {
      date: data.date,
      memo: data.memo || "",
    };
    
    // undefinedでない値のみを追加（undefinedの場合は更新しない）
    if (data.menuPhotoUrl !== undefined && data.menuPhotoUrl !== null) {
      firestoreData.menuPhotoUrl = data.menuPhotoUrl;
    } else if (data.menuPhotoUrl === null) {
      // nullの場合は、FirestoreのdeleteField()を使用して削除
      firestoreData.menuPhotoUrl = deleteField();
    }
    // undefinedの場合は、そのフィールドを更新しない（既存の値を保持）
    
    if (data.bodyPhotoUrl !== undefined && data.bodyPhotoUrl !== null) {
      firestoreData.bodyPhotoUrl = data.bodyPhotoUrl;
    } else if (data.bodyPhotoUrl === null) {
      firestoreData.bodyPhotoUrl = deleteField();
    }
    // undefinedの場合は、そのフィールドを更新しない（既存の値を保持）
    
    if (data.weight !== undefined && data.weight !== null) {
      firestoreData.weight = data.weight;
    } else if (data.weight === null) {
      firestoreData.weight = deleteField();
    }
    // undefinedの場合は、そのフィールドを更新しない（既存の値を保持）
    
    const docRef = doc(db, TRAINING_RECORDS_COLLECTION, id);
    await updateDoc(docRef, firestoreData);
  } catch (error) {
    console.error("記録の更新中にエラーが発生しました:", error);
    
    // エラーメッセージを改善
    if (error instanceof Error) {
      if ((error as any).code) {
        const code = (error as any).code;
        if (code === "invalid-argument") {
          throw new Error("データの形式が正しくありません。入力内容を確認してください。");
        }
      }
    }
    
    throw error;
  }
}

// トレーニング記録を削除
export async function deleteTrainingRecord(id: string): Promise<void> {
  try {
    const docRef = doc(db, TRAINING_RECORDS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("記録の削除中にエラーが発生しました:", error);
    throw error;
  }
}

// コメントを追加
export async function addComment(
  recordId: string,
  text: string,
  author: string = "匿名"
): Promise<void> {
  try {
    const docRef = doc(db, TRAINING_RECORDS_COLLECTION, recordId);
    
    // 現在の記録を取得
    const records = await getTrainingRecords();
    const record = records.find((r) => r.id === recordId);
    if (!record) {
      throw new Error("記録が見つかりません");
    }

    const currentComments = record.comments || [];
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: new Date().toISOString(),
    };

    await updateDoc(docRef, {
      comments: [...currentComments, newComment],
    });
  } catch (error) {
    console.error("コメントの追加中にエラーが発生しました:", error);
    throw error;
  }
}

// コメントを削除
export async function deleteComment(
  recordId: string,
  commentId: string
): Promise<void> {
  try {
    const docRef = doc(db, TRAINING_RECORDS_COLLECTION, recordId);
    
    // 現在の記録を取得
    const records = await getTrainingRecords();
    const record = records.find((r) => r.id === recordId);
    if (!record) {
      throw new Error("記録が見つかりません");
    }

    const currentComments = record.comments || [];
    const updatedComments = currentComments.filter(
      (c: Comment) => c.id !== commentId
    );

    await updateDoc(docRef, {
      comments: updatedComments,
    });
  } catch (error) {
    console.error("コメントの削除中にエラーが発生しました:", error);
    throw error;
  }
}

// 月間目標を保存
export async function saveMonthlyGoal(
  goal: Omit<MonthlyGoal, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, MONTHLY_GOALS_COLLECTION), {
      ...goal,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("月間目標の保存中にエラーが発生しました:", error);
    throw error;
  }
}

// 今月の月間目標を取得
export async function getMonthlyGoalForCurrentMonth(): Promise<MonthlyGoal | null> {
  try {
    const goals = await getMonthlyGoals();
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return goals.find((g) => g.yearMonth === currentYearMonth) || null;
  } catch (error) {
    console.error("月間目標の取得中にエラーが発生しました:", error);
    return null;
  }
}

// 全ての月間目標を取得
export async function getMonthlyGoals(): Promise<MonthlyGoal[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, MONTHLY_GOALS_COLLECTION)
    );
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        yearMonth: data.yearMonth,
        title: data.title,
        targetValue: data.targetValue || undefined,
        currentValue: data.currentValue || undefined,
        description: data.description || undefined,
        createdAt: timestampToDateString(data.createdAt),
      } as MonthlyGoal;
    });
  } catch (error) {
    console.error("月間目標の取得中にエラーが発生しました:", error);
    return [];
  }
}

// 月間目標を更新
export async function updateMonthlyGoal(
  id: string,
  data: Partial<Omit<MonthlyGoal, "id" | "createdAt" | "yearMonth">>
): Promise<void> {
  try {
    const docRef = doc(db, MONTHLY_GOALS_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("月間目標の更新中にエラーが発生しました:", error);
    throw error;
  }
}

// 月間目標を削除
export async function deleteMonthlyGoal(id: string): Promise<void> {
  try {
    const docRef = doc(db, MONTHLY_GOALS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("月間目標の削除中にエラーが発生しました:", error);
    throw error;
  }
}

// いいねの状態を管理
export async function getLikedRecords(): Promise<string[]> {
  try {
    const querySnapshot = await getDocs(collection(db, LIKES_COLLECTION));
    return querySnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("いいね情報の取得中にエラーが発生しました:", error);
    return [];
  }
}

export async function isRecordLiked(recordId: string): Promise<boolean> {
  try {
    const likedRecords = await getLikedRecords();
    return likedRecords.includes(recordId);
  } catch (error) {
    return false;
  }
}

export async function toggleLike(recordId: string): Promise<number> {
  try {
    // 記録を取得していいね数を更新
    const records = await getTrainingRecords();
    const record = records.find((r) => r.id === recordId);
    if (!record) {
      return 0;
    }

    const isLiked = await isRecordLiked(recordId);
    const newLikes = isLiked ? Math.max(0, (record.likes || 1) - 1) : (record.likes || 0) + 1;

    // 記録のいいね数を更新
    const docRef = doc(db, TRAINING_RECORDS_COLLECTION, recordId);
    await updateDoc(docRef, { likes: newLikes });

    // いいね情報を更新（簡易版：localStorageを使用）
    // 注意：Firestoreのいいね管理は複雑なため、簡易的にlocalStorageで管理
    // 本番環境では、ユーザーIDベースのいいね管理を推奨

    return newLikes;
  } catch (error) {
    console.error("いいねの更新中にエラーが発生しました:", error);
    throw error;
  }
}

