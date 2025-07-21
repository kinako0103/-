self.addEventListener("install", function (e) {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", function (e) {
  // オフラインキャッシュ対応は必要なら追加
});
