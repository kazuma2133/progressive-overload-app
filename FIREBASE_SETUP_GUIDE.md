# Firebase Console プロジェクト作成ガイド

## 📋 目次
1. [Firebase Consoleにアクセス](#1-firebase-consoleにアクセス)
2. [プロジェクトを作成](#2-プロジェクトを作成)
3. [Webアプリを登録](#3-webアプリを登録)
4. [Authenticationを有効化](#4-authenticationを有効化)
5. [Firestore Databaseを有効化](#5-firestore-databaseを有効化)
6. [Firebase Storageを有効化](#6-firebase-storageを有効化)
7. [環境変数の取得](#7-環境変数の取得)

---

## 1. Firebase Consoleにアクセス

### ステップ1-1: Firebase Consoleを開く
1. ブラウザで以下のURLにアクセス：
   ```
   https://console.firebase.google.com/
   ```
2. Googleアカウントでログインします
   - 既にGoogleアカウントにログインしている場合は、そのまま進みます
   - ログインしていない場合は、Googleアカウントでログインしてください

### ステップ1-2: Firebase Consoleの画面を確認
- ログイン後、Firebase Consoleのホーム画面が表示されます
- 既存のプロジェクトがある場合は、プロジェクト一覧が表示されます
- 初めての場合は、「プロジェクトを追加」ボタンが表示されます

---

## 2. プロジェクトを作成

### ステップ2-1: プロジェクト作成を開始
1. Firebase Consoleのホーム画面で「**プロジェクトを追加**」ボタンをクリック
   - または、左上の「プロジェクトを追加」リンクをクリック

### ステップ2-2: プロジェクト名を入力
1. **プロジェクト名**を入力
   - 例：`progressive-overload-app`
   - プロジェクト名は後から変更できませんが、表示名は変更可能です
   - プロジェクトIDは自動生成されます（後で確認できます）

2. 「**続行**」ボタンをクリック

### ステップ2-3: Google Analyticsの設定（任意）
1. **Google Analyticsを有効にするか選択**
   - **推奨：有効にする**（無料で利用可能）
   - 無効にしても問題ありませんが、後で有効化できます

2. Analyticsを有効にする場合：
   - **Google Analyticsアカウント**を選択
     - 既存のアカウントがある場合は選択
     - ない場合は「アカウントを作成」を選択
   - **Analyticsの場所**を選択（例：日本）

3. 「**続行**」ボタンをクリック

### ステップ2-4: プロジェクトの作成を完了
1. プロジェクトの作成が開始されます
   - 数秒〜1分程度かかります
   - 「プロジェクトの準備ができました」というメッセージが表示されたら完了

2. 「**続行**」ボタンをクリック
   - Firebase Consoleのプロジェクトホーム画面に移動します

---

## 3. Webアプリを登録

### ステップ3-1: Webアプリの追加を開始
1. プロジェクトホーム画面で、**「</>」アイコン**（Webアプリを追加）をクリック
   - または、「プロジェクトの概要」セクションの「Webアプリを追加」をクリック

### ステップ3-2: アプリの登録情報を入力
1. **アプリのニックネーム**を入力
   - 例：`progressive-overload-web`
   - この名前は後から変更可能です

2. **「このアプリのFirebase Hostingも設定します」**
   - **チェックを外す**（今回は不要です）
   - Firebase Hostingは使用しません（Vercelを使用します）

3. 「**アプリを登録**」ボタンをクリック

### ステップ3-3: 設定情報をコピー
1. **Firebase設定情報**が表示されます
   - 以下のような形式で表示されます：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

2. **この情報をコピーして保存してください**
   - 後で`.env.local`ファイルに記入します
   - または、画面を開いたまま次のステップに進みます

3. 「**続行**」ボタンをクリック
   - 次のステップ（SDKの追加）はスキップしてOKです

---

## 4. Authenticationを有効化

### ステップ4-1: Authenticationに移動

Firebase ConsoleでAuthenticationにアクセスする方法は2つあります：

#### 方法1: 左側のメニューから（推奨）
1. Firebase Consoleの**左側のメニュー**を確認
   - 画面の左端に縦に並んだメニューがあります
   - メニュー項目の一覧が表示されています

2. **「Authentication」**という項目を探す
   - メニューの上から下に向かって見ていきます
   - 「Authentication」という文字列を探します
   - アイコンは「🔐」のような鍵のアイコンが表示されている場合があります

3. **「Authentication」をクリック**
   - クリックすると、Authenticationの画面に移動します

#### 方法2: プロジェクトホーム画面から
1. Firebase Consoleの**プロジェクトホーム画面**を確認
   - プロジェクトを作成した直後の画面です
   - または、左上のプロジェクト名をクリックして「プロジェクトの概要」を選択

2. **「Authentication」カード**を探す
   - 画面中央に複数のカード（四角いボックス）が表示されています
   - 例：「Authentication」「Firestore Database」「Storage」など

3. **「Authentication」カードをクリック**
   - カードをクリックすると、Authenticationの画面に移動します

#### 見つからない場合
- 左側のメニューが折りたたまれている場合：
  - 画面左上の「☰」（ハンバーガーメニュー）アイコンをクリックしてメニューを展開
- プロジェクトホーム画面に戻る場合：
  - 左上のプロジェクト名をクリック → 「プロジェクトの概要」を選択

### ステップ4-2: Authenticationを開始
1. 「**始める**」ボタンをクリック

### ステップ4-3: メール/パスワード認証を有効化
1. 「**メール/パスワード**」をクリック
   - 認証プロバイダーの一覧が表示されます

2. 「**メール/パスワード**」の行をクリック
   - または、「メール/パスワード」の右側の「有効にする」をクリック

3. **「有効にする」**をクリック
   - メール/パスワード認証が有効になります

4. 「**保存**」ボタンをクリック

### ステップ4-4: 作成者用のユーザーアカウントを作成

#### ステップ4-4-1: 「ユーザー」タブに移動
1. Authentication画面の**上部**を確認
   - 画面の上部にタブが並んでいます
   - 例：「**サインイン方法**」「**ユーザー**」「**テンプレート**」など

2. **「ユーザー」タブをクリック**
   - 「ユーザー」というタブを探してクリックします
   - クリックすると、ユーザー一覧画面が表示されます

#### ステップ4-4-2: ユーザー追加画面を開く
1. 画面の上部（または右上）を確認
   - 「**ユーザーを追加**」というボタンがあります
   - または「**+ ユーザーを追加**」というボタン

2. **「ユーザーを追加」ボタンをクリック**
   - クリックすると、ユーザー追加のダイアログ（ポップアップ）が表示されます

#### ステップ4-4-3: ユーザー情報を入力
1. **メールアドレスを入力**
   - 「メール」または「Email」という入力欄があります
   - 作成者のメールアドレスを入力します
   - 例：`your-email@example.com`
   - ⚠️ **重要**：このメールアドレスは後でログイン時に使用します

2. **パスワードを入力**
   - 「パスワード」または「Password」という入力欄があります
   - 強力なパスワードを入力します
   - **要件**：
     - 最低6文字以上
     - 英数字と記号を含むことを推奨
     - 例：`Progressive2024!`
   - ⚠️ **重要**：このパスワードは後でログイン時に使用します

3. **パスワードの確認（表示されている場合）**
   - 「パスワードを確認」という入力欄がある場合、同じパスワードを再入力します

#### ステップ4-4-4: ユーザーを追加
1. **「ユーザーを追加」ボタンをクリック**
   - ダイアログの下部（または右上）に「ユーザーを追加」ボタンがあります
   - クリックすると、ユーザーが作成されます

2. **成功メッセージを確認**
   - 「ユーザーが正常に追加されました」などのメッセージが表示されます
   - ユーザー一覧に新しいユーザーが表示されます

#### ステップ4-4-5: ユーザー情報をメモ
1. **メールアドレスとパスワードをメモ**
   - 後でアプリにログインする際に使用します
   - 安全な場所に保存してください
   - 例：パスワードマネージャー、メモアプリなど

2. **メモする情報**
   - メールアドレス：`your-email@example.com`
   - パスワード：`Progressive2024!`（実際のパスワード）

#### トラブルシューティング

**Q: 「ユーザー」タブが見つかりません**
A: 
- Authentication画面の上部にタブが表示されているか確認してください
- 画面をリロード（F5キー）してみてください
- ブラウザの画面幅が狭い場合、タブが折りたたまれている可能性があります

**Q: 「ユーザーを追加」ボタンが見つかりません**
A:
- 画面の右上を確認してください
- 画面をスクロールして確認してください
- ブラウザのズームを100%に設定してみてください

**Q: パスワードの要件がわかりません**
A:
- 最低6文字以上
- 英数字を含む
- 記号を含むことを推奨（例：`!`, `@`, `#`, `$`など）
- 例：`Progressive2024!`、`MyPass123!`など

**Q: ユーザーを追加した後、どこで確認できますか？**
A:
- 「ユーザー」タブのユーザー一覧に表示されます
- メールアドレス、作成日時などが表示されます

---

## 5. Firestore Databaseを有効化

### ステップ5-1: Firestore Databaseに移動
1. 左側のメニューから「**Firestore Database**」をクリック
   - または、プロジェクトホーム画面の「Firestore Database」カードをクリック

### ステップ5-2: データベースを作成
1. 「**データベースを作成**」ボタンをクリック

### ステップ5-3: セキュリティルールを選択
1. **「本番モードで開始」を選択**
   - ⚠️ **重要**：「テストモードで開始」は選択しないでください
   - 後でセキュリティルールを設定します

2. 「**次へ**」ボタンをクリック

### ステップ5-4: ロケーションを選択
1. **ロケーション（リージョン）を選択**
   - 推奨：**`asia-northeast1`**（東京）
   - 日本に最も近いリージョンです
   - 他のリージョンでも動作しますが、パフォーマンスに影響があります

2. 「**有効にする**」ボタンをクリック
   - データベースの作成が開始されます
   - 数秒〜1分程度かかります

### ステップ5-5: セキュリティルールを設定
1. Firestore Database画面の「**ルール**」タブをクリック

2. 以下のルールをコピーして貼り付け：

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

3. 「**公開**」ボタンをクリック
   - セキュリティルールが保存されます

---

## 6. Firebase Storageを有効化

### ステップ6-1: Storageに移動
1. 左側のメニューから「**Storage**」をクリック
   - または、プロジェクトホーム画面の「Storage」カードをクリック

### ステップ6-2: Storageを開始
1. 「**始める**」ボタンをクリック

### ステップ6-3: セキュリティルールを選択
1. **「本番モードで開始」を選択**
   - ⚠️ **重要**：「テストモードで開始」は選択しないでください
   - 後でセキュリティルールを設定します

2. 「**次へ**」ボタンをクリック

### ステップ6-4: ロケーションを選択
1. **ロケーション（リージョン）を選択**
   - Firestoreと同じロケーションを選択することを推奨
   - 推奨：**`asia-northeast1`**（東京）

2. 「**完了**」ボタンをクリック
   - Storageの作成が開始されます
   - 数秒〜1分程度かかります

### ステップ6-5: セキュリティルールを設定
1. Storage画面の「**ルール**」タブをクリック

2. 以下のルールをコピーして貼り付け：

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

3. 「**公開**」ボタンをクリック
   - セキュリティルールが保存されます

---

## 7. 環境変数の取得

### ステップ7-1: プロジェクトの設定画面に移動

#### 方法1: 左上のプロジェクト名から
1. Firebase Consoleの**左上**を確認
   - プロジェクト名が表示されています（例：「progressive-overload-app」）

2. **プロジェクト名をクリック**
   - クリックすると、メニューが表示されます

3. **「プロジェクトの設定」をクリック**
   - メニューの中に「プロジェクトの設定」という項目があります
   - クリックすると、設定画面に移動します

#### 方法2: 左側のメニューから
1. 左側のメニューを確認
   - 画面の左端に縦に並んだメニューがあります

2. **「⚙️ プロジェクトの設定」**を探す
   - メニューの下部に「⚙️ プロジェクトの設定」という項目があります
   - 歯車のアイコンが表示されています

3. **「プロジェクトの設定」をクリック**
   - クリックすると、設定画面に移動します

### ステップ7-2: 一般タブで設定情報を確認

1. **「一般」タブが選択されていることを確認**
   - 設定画面の上部にタブが表示されています
   - 「一般」「サービスアカウント」「権限」など
   - 「一般」タブが選択されていることを確認してください

2. **画面を下にスクロール**
   - 設定画面を下にスクロールします

3. **「マイアプリ」セクションを探す**
   - 画面の下の方に「**マイアプリ**」というセクションがあります
   - 先ほど登録したWebアプリが表示されています
   - アプリの名前（例：「progressive-overload-web」）が表示されています

### ステップ7-3: 設定情報をコピー（詳細手順）

#### 7-3-1: 設定情報の表示形式を確認

「マイアプリ」セクションには、以下のような形式で設定情報が表示されています：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

または、各項目が個別に表示されている場合もあります。

#### 7-3-2: 各項目をコピーする方法

**方法1: コードブロック全体をコピー（推奨）**

1. **「設定を表示」または「設定をコピー」ボタンを探す**
   - アプリの右側に「設定を表示」や「設定をコピー」というボタンがある場合があります
   - そのボタンをクリックすると、設定情報が表示されます

2. **コードブロックをコピー**
   - コードブロック全体を選択（マウスでドラッグ）
   - `Ctrl + C`（Windows）または `Cmd + C`（Mac）でコピー

**方法2: 各項目を個別にコピー**

1. **apiKeyをコピー**
   - `apiKey: "AIzaSy..."` の部分を探す
   - 引用符（`"`）の中の文字列をコピー
   - 例：`AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

2. **authDomainをコピー**
   - `authDomain: "your-project.firebaseapp.com"` の部分を探す
   - 引用符の中の文字列をコピー
   - 例：`your-project.firebaseapp.com`

3. **projectIdをコピー**
   - `projectId: "your-project-id"` の部分を探す
   - 引用符の中の文字列をコピー
   - 例：`your-project-id`

4. **storageBucketをコピー**
   - `storageBucket: "your-project.appspot.com"` の部分を探す
   - 引用符の中の文字列をコピー
   - 例：`your-project.appspot.com`

5. **messagingSenderIdをコピー**
   - `messagingSenderId: "123456789012"` の部分を探す
   - 引用符の中の文字列をコピー
   - 例：`123456789012`

6. **appIdをコピー**
   - `appId: "1:123456789012:web:abcdefghijklmnop"` の部分を探す
   - 引用符の中の文字列をコピー
   - 例：`1:123456789012:web:abcdefghijklmnop`

#### 7-3-3: コピーした情報をメモ

各項目をコピーしたら、一時的にメモ帳やテキストエディタに貼り付けて保存しておくと便利です：

```
apiKey: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
authDomain: your-project.firebaseapp.com
projectId: your-project-id
storageBucket: your-project.appspot.com
messagingSenderId: 123456789012
appId: 1:123456789012:web:abcdefghijklmnop
```

### ステップ7-4: .env.localファイルを作成

#### 7-4-1: ファイルの場所を確認

1. プロジェクトのルートディレクトリを確認
   - `progressive-overload-app` フォルダの中
   - `package.json` がある場所と同じ階層

2. `.env.local`ファイルを作成
   - 既に存在する場合は、編集します
   - 存在しない場合は、新規作成します

#### 7-4-2: 環境変数を記入

1. `.env.local`ファイルを開く
   - テキストエディタ（メモ帳、VS Codeなど）で開きます

2. 以下の形式で記入：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

3. **実際の値に置き換える**
   - `=` の右側を、Firebase Consoleからコピーした値に置き換えます
   - 例：
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=progressive-overload-app.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=progressive-overload-app
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=progressive-overload-app.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
     NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
     ```

4. **ファイルを保存**
   - `Ctrl + S`（Windows）または `Cmd + S`（Mac）で保存

#### 7-4-3: 注意事項

- **引用符（`"`）は不要**
  - Firebase Consoleでは `"AIzaSy..."` のように引用符で囲まれていますが、`.env.local`では引用符は不要です
  - 例：`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...`（引用符なし）

- **スペースは入れない**
  - `=` の前後にスペースを入れないでください
  - 正：`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...`
  - 誤：`NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSy...`

- **改行は1行1項目**
  - 各環境変数は1行に1つずつ記入します

---

## 📝 設定情報のコピー手順（まとめ）

1. **プロジェクトの設定画面に移動**
   - 左上のプロジェクト名 → 「プロジェクトの設定」
   - または、左側のメニュー → 「⚙️ プロジェクトの設定」

2. **「一般」タブを確認**
   - 画面を下にスクロール

3. **「マイアプリ」セクションを探す**
   - 登録したWebアプリが表示されています

4. **設定情報をコピー**
   - 各項目（apiKey、authDomainなど）をコピー

5. **`.env.local`ファイルに記入**
   - コピーした値を、環境変数として記入

---

## ❓ よくある質問

**Q: 「マイアプリ」セクションが見つかりません**
A: 
- 画面を下にスクロールして確認してください
- 「一般」タブが選択されているか確認してください
- Webアプリを登録したか確認してください

**Q: 設定情報が表示されません**
A:
- 「設定を表示」ボタンをクリックしてみてください
- アプリの右側に「⚙️」アイコンがある場合、クリックして設定を表示できます

**Q: コピーした値に引用符が含まれています**
A:
- `.env.local`ファイルに記入する際は、引用符を削除してください
- 例：`"AIzaSy..."` → `AIzaSy...`

**Q: .env.localファイルがどこにあるかわかりません**
A:
- プロジェクトのルートディレクトリ（`progressive-overload-app`フォルダ）に作成します
- `package.json`がある場所と同じ階層です

---

## ✅ 完了チェックリスト

- [ ] Firebaseプロジェクトを作成した
- [ ] Webアプリを登録した
- [ ] 設定情報をコピーした
- [ ] Authenticationを有効化した
- [ ] メール/パスワード認証を有効化した
- [ ] 作成者用のユーザーアカウントを作成した
- [ ] Firestore Databaseを作成した
- [ ] Firestoreのセキュリティルールを設定した
- [ ] Firebase Storageを作成した
- [ ] Storageのセキュリティルールを設定した
- [ ] `.env.local`ファイルを作成して環境変数を設定した

---

## 🎯 次のステップ

Firebaseプロジェクトのセットアップが完了したら、次はコンポーネントの更新に進みます。

詳細は`FIREBASE_IMPLEMENTATION.md`を参照してください。

---

## ❓ よくある質問

**Q: プロジェクト名を間違えました。変更できますか？**
A: プロジェクト名（表示名）は変更可能です。「プロジェクトの設定」→「一般」タブで変更できます。ただし、プロジェクトIDは変更できません。

**Q: セキュリティルールを間違えました。修正できますか？**
A: はい。Firestore DatabaseやStorageの「ルール」タブでいつでも修正できます。

**Q: ユーザーアカウントのパスワードを忘れました。**
A: Firebase Consoleの「Authentication」→「ユーザー」タブで、ユーザーを選択して「パスワードをリセット」できます。

**Q: 環境変数の値がわかりません。**
A: 「プロジェクトの設定」→「一般」タブの「マイアプリ」セクションで確認できます。

