# oauth2-example-js

[RFC6749](https://datatracker.ietf.org/doc/html/rfc6749) の仕様に従ってOAuth2.0認可サーバーを実装したサンプル

## シーケンス図

![sequence-ciagram](https://user-images.githubusercontent.com/28677705/142768839-0a95ac01-5b01-4b35-b8d2-4cee0388cfc2.png)

## 起動

docker-compose で立ち上がるようになっています。

```
docker-compose up
```

### サービス一覧

サービス | ドメイン | 説明
---|---|---
にゃーん | localhost:3000 | **にゃーんボタン**を押すとポップが出るだけのアプリ
つぶやきったー | localhost:9000 | つぶやきを投稿できるアプリ
OAuth2管理サーバー | localhost:9001 | OAuthのClient等を管理するサービス

## DBテーブル一覧

```
mysql> show tables;
+----------------------------+
| Tables_in_tsubuyaki        |
+----------------------------+
| access_tokens              |
| apps                       |
| apps_scopes                |
| authorization_codes        |
| authorization_codes_scopes |
| clients                    |
| redirect_uris              |
| refresh_tokens             |
| schema_migrations          |
| scopes                     |
| statuses                   |
| users                      |
+----------------------------+
```

### ER図

![er-diagram](https://user-images.githubusercontent.com/28677705/142769081-c1372793-9da6-4814-a420-7fd34d01c4c6.png)
