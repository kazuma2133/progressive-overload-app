# Firebase実装案と手順書

## 📋 実装案の概要

### 現在の状態（モック版）
- データはブラウザの`localStorage`に保存
- 作成者と友人が同じデータを見ることができない

### Firebase実装後の状態
- データはFirebase Firestore（クラウドデータベース）に保存
- 画像はFirebase Storage（クラウドストレージ）に保存
- **作成者が保存した記録は、誰でも閲覧可能**（公開設定）
- **作成者のみがアップロード・編集・削除可能**（Firebase Authenticationで認証）

---

## 🏗️ アーキテクチャ

```
┌─────────────────┐
│   Next.js App   │
│  (フロントエンド) │
└────────┬────────┘
         │
         ├─── Firebase Authentication
         │    └─── 作成者のみログイン可能
         │
         ├─── Firestore Database
         │    └─── トレーニング記録を保存（全員閲覧可能）
         │
         └─── Firebase Storage
              └─── 画像ファイルを保存（全員閲覧可能）
```

### セキュリティルール

1. **Firestore（データベース）**
   - 読み取り：誰でも可能（公開）
   - 書き込み・更新・削除：認証済みユーザーのみ

2. **Storage（画像保存）**
   - 読み取り：誰でも可能（公開）
   - 書き込み・削除：認証済みユーザーのみ

3. **Authentication（認証）**
   - メールアドレス + パスワードでログイン
   - 作成者のみがアカウントを持つ

---

## 📦 必要なFirebaseサービス

1. **Firebase Authentication**
   - メールアドレス + パスワード認証
   - 作成者のみがログイン可能

2. **Cloud Firestore**
   - トレーニング記録（日付、メモ、体重など）を保存
   - コメント、いいね、月間目標も保存

3. **Firebase Storage**
   - トレーニングメニューの写真
   - 体の写真

---

## 🚀 実装手順

### ステップ1: Firebaseプロジェクトの作成

1. **Firebase Consoleにアクセス**
   - https://console.firebase.google.com/ にアクセス
   - Googleアカウントでログイン

2. **プロジェクトを作成**
   - 「プロジェクトを追加」をクリック
   - プロジェクト名を入力（例：`progressive-overload-app`）
   - Google Analyticsは任意（無効でもOK）
   - 「プロジェクトを作成」をクリック

3. **Webアプリを登録**
   - Firebase Consoleのホーム画面で「</>」アイコン（Webアプリを追加）をクリック
   - アプリのニックネームを入力（例：`progressive-overload-web`）
   - 「このアプリのFirebase Hostingも設定します」はチェック不要
   - 「アプリを登録」をクリック
   - **設定情報（API Keyなど）をコピー**（後で使用）

### ステップ2: Firebase Authenticationの設定

1. **Authenticationを有効化**
   - Firebase Consoleで「Authentication」を選択
   - 「始める」をクリック
   - 「メール/パスワード」を選択
   - 「有効にする」をクリック
   - 「保存」をクリック

2. **ユーザーを作成（作成者用）**
   - 「Authentication」→「ユーザー」タブ
   - 「ユーザーを追加」をクリック
   - メールアドレスとパスワードを入力
   - 「ユーザーを追加」をクリック
   - **このメールアドレスとパスワードをメモ**（ログイン時に使用）

### ステップ3: Firestore Databaseの設定

1. **Firestoreを有効化**
   - Firebase Consoleで「Firestore Database」を選択
   - 「データベースを作成」をクリック
   - **セキュリティルール**：**「本番モードで開始」を選択**（後でルールを設定）
   - ロケーションを選択（例：`asia-northeast1` - 東京）
   - 「有効にする」をクリック

2. **セキュリティルールを設定**
   - 「ルール」タブを選択
   - 以下のルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // トレーニング記録：誰でも読み取り可能、認証済みユーザーのみ書き込み可能
    match /trainingRecords/{recordId} {
      allow read: if true;  // 誰でも読み取り可能
      allow write: if request.auth != null;  // 認証済みユーザーのみ書き込み可能
    }
    
    // 月間目標：誰でも読み取り可能、認証済みユーザーのみ書き込み可能
    match /monthlyGoals/{goalId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // いいね情報：誰でも読み取り可能、認証済みユーザーのみ書き込み可能
    match /likes/{likeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

   - 「公開」をクリック

### ステップ4: Firebase Storageの設定

1. **Storageを有効化**
   - Firebase Consoleで「Storage」を選択
   - 「始める」をクリック
   - **セキュリティルール**：**「本番モードで開始」を選択**（後でルールを設定）
   - 「完了」をクリック

2. **セキュリティルールを設定**
   - 「ルール」タブを選択
   - 以下のルールを設定：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 画像ファイル：誰でも読み取り可能、認証済みユーザーのみ書き込み可能
    match /images/{allPaths=**} {
      allow read: if true;  // 誰でも読み取り可能
      allow write: if request.auth != null;  // 認証済みユーザーのみ書き込み可能
      allow delete: if request.auth != null;  // 認証済みユーザーのみ削除可能
    }
  }
}
```

   - 「公開」をクリック

---

## 💻 コード実装手順

### ステップ5: 必要なパッケージのインストール

```bash
npm install firebase
```

**注意**: 既にインストール済みの場合は、このステップはスキップしてください。

### ステップ6: Firebase設定ファイルの作成

1. **環境変数ファイルの作成**
   - プロジェクトのルートディレクトリに`.env.local`ファイルを作成
   - Firebase Consoleから取得した設定情報を記入：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

   **重要**: 
   - `.env.local`ファイルは既に`.gitignore`に含まれているため、Gitにコミットされません
   - 本番環境（Vercel）では、環境変数を手動で設定する必要があります（後述）

2. **Firebase初期化ファイルの確認**
   - `lib/firebase.ts`は既に作成済みです
   - 環境変数が正しく設定されていれば、自動的にFirebaseが初期化されます

### ステップ7: コード実装の確認

**注意**: 以下のファイルは既に作成済みです：
- `lib/firebase.ts` - Firebase初期化
- `lib/firebaseAuth.ts` - Firebase認証機能
- `lib/firestore.ts` - Firestoreデータ保存・取得機能
- `lib/firebaseStorage.ts` - Storage画像アップロード機能

これらのファイルが正しく動作することを確認してください。

### ステップ8: 既存コンポーネントの更新（重要）

既存のコンポーネントをFirebase版に更新する必要があります。以下のファイルを更新してください：

1. **PhotoUploadForm.tsx**
   - `mockStorage`の代わりに`firestore`と`firebaseStorage`を使用
   - 画像アップロードを`uploadPhoto`関数に変更

2. **TrainingRecordList.tsx**
   - `mockStorage`の代わりに`firestore`を使用
   - データ取得を非同期処理に変更

3. **その他のコンポーネント**
   - `CommentSection.tsx` - `firestore`を使用
   - `LikeButton.tsx` - `firestore`を使用
   - `MonthlyGoalCard.tsx` - `firestore`を使用
   - `EditRecordModal.tsx` - `firestore`と`firebaseStorage`を使用

4. **AuthModal.tsx**
   - `firebaseAuth`を使用してメールアドレス + パスワードでログイン

**注意**: これらの更新は、Firebaseプロジェクトの設定が完了してから行ってください。

---

## 🔐 セキュリティの注意点

1. **環境変数**
   - `.env.local`はGitにコミットしない（`.gitignore`に追加済み）
   - Vercelの環境変数設定で本番環境の値を設定

2. **セキュリティルール**
   - FirestoreとStorageのルールを必ず設定
   - 定期的にルールを確認

3. **認証情報**
   - 作成者のメールアドレスとパスワードは安全に管理
   - パスワードは強力なものを使用

---

## 📝 実装後の動作

### 作成者（ログイン済み）
- 記録のアップロード
- 記録の編集・削除
- 記録の閲覧

### 友人（ログインなし）
- 記録の閲覧（全記録が見える）
- コメントの投稿
- いいねの追加

---

## 🎯 実装の流れ

### フェーズ1: Firebaseプロジェクトのセットアップ（手動）
1. Firebase Consoleでプロジェクトを作成
2. Authentication、Firestore、Storageを有効化
3. セキュリティルールを設定
4. 作成者用のユーザーアカウントを作成

### フェーズ2: 環境変数の設定
1. `.env.local`ファイルを作成
2. Firebase Consoleから取得した設定情報を記入
3. ローカル環境で動作確認

### フェーズ3: コンポーネントの更新（コード実装）
1. 既存コンポーネントをFirebase版に更新
2. 動作確認

### フェーズ4: 本番環境へのデプロイ
1. Vercelの環境変数にFirebase設定を追加
2. GitHubにプッシュして自動デプロイ
3. 本番環境で動作確認

---

## 📝 実装後の動作確認チェックリスト

- [ ] ローカル環境でFirebase認証が動作する
- [ ] ローカル環境で記録の保存が動作する
- [ ] ローカル環境で記録の表示が動作する
- [ ] ローカル環境で画像のアップロードが動作する
- [ ] 本番環境でFirebase認証が動作する
- [ ] 本番環境で記録の保存が動作する
- [ ] 本番環境で記録の表示が動作する（友人も閲覧可能）
- [ ] 本番環境で画像のアップロードが動作する

---

## ❓ よくある質問

**Q: Firebaseは無料で使えますか？**
A: はい。Firebaseの無料プラン（Sparkプラン）で十分です。使用量が少ない限り、無料で利用できます。

**Q: データはどこに保存されますか？**
A: FirestoreとStorageのデータは、選択したロケーション（例：東京）に保存されます。

**Q: 友人が記録を編集・削除できませんか？**
A: いいえ。セキュリティルールで認証済みユーザーのみが書き込み可能に設定するため、友人は閲覧のみ可能です。

**Q: 画像の容量制限はありますか？**
A: Firebase Storageの無料プランでは、1日あたり1GBのダウンロード、5GBのストレージが利用可能です。

**Q: 既存のモック版のデータはどうなりますか？**
A: モック版のデータ（localStorage）は、Firebase実装後は使用されません。既存のデータをFirebaseに移行したい場合は、手動で再入力する必要があります。

**Q: 本番環境（Vercel）で環境変数を設定する方法は？**
A: Vercelダッシュボードで「Settings」→「Environment Variables」から、`.env.local`と同じ環境変数を設定してください。

