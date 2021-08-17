# aws-appsync-chat-terminal-sample

AWS AppSync を利用した TypeScript x node.js 製チャットアプリのサンプル(terminal)

## AWS AppSync 側

### データソース

適当な名前で、データソースタイプ「なし」で作成（ローカルデータソース）。

### スキーマ

```
type Mutation {
	addPost(id: ID!, content: String, send_at: String): Post!
}

type Post {
	id: ID!
	content: String
	send_at: String
}

type Query {
	getPost(id: ID!): Post
}

type Subscription {
	onAddPost: Post
		@aws_subscribe(mutations: ["addPost"])
}

schema {
	query: Query
	mutation: Mutation
	subscription: Subscription
}
```

``addPost`` の Resolver に、作成したデータソースを指定。

#### リクエストマッピングテンプレート

```
{
    "version": "2017-02-28",
    "payload": $util.toJson($context.arguments)
}
```

#### レスポンスマッピングテンプレート

```
$util.toJson($context.result)
```

### 動作確認

クエリで

```
mutation MyMutation {
  addPost(id: "76", content: "dddddd") {
    id,
    content
  }
}
```

を投げて、同じデータが返却されれば OK。


## クライアント側

node 14.17.0 が必要です。
### 1. この repo を clone する

### 2. clone してできたディレクトリの中で ``npm ci`` する

### 3. VSCode の人は、 ``chatconsole.code-workspace`` を開く

### 4. ``src/aws-exports.ts`` を編集する

AWS AppSync コンソールの設定にある、API URL、API KEY をそれぞれ ``aws_appsync_graphqlEndpoint``, ``aws_appsync_apiKey`` に貼り付ける。

### 5. VSCode は F5、terminal では ``npm run start`` で起動

eof
