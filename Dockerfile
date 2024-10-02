# ベースイメージ
FROM node:19


# 作業ディレクトリの作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションの全てのファイルをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "serve"]

# ポート8080を公開
EXPOSE 8080
