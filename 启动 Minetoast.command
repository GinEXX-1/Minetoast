#!/bin/zsh

set -u

PROJECT_DIR="${0:A:h}"
APP_URL="http://localhost:4173"

fail() {
  print -u2 "\n启动失败：$1"
  read -r "?按回车关闭此窗口。"
  exit 1
}

cd "$PROJECT_DIR" || fail "无法进入项目目录：$PROJECT_DIR"

command -v node >/dev/null 2>&1 || fail "未找到 Node.js。请安装 Node.js 24 后重试。"
command -v pnpm >/dev/null 2>&1 || fail "未找到 pnpm。请先启用 Corepack 或安装 pnpm 11。"

NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
[[ "$NODE_MAJOR" == "24" ]] || fail "项目需要 Node.js 24；当前版本为 $(node -v)。"

if curl --silent --fail "$APP_URL" >/dev/null 2>&1; then
  print "Minetoast 已在运行，正在打开浏览器：$APP_URL"
  open "$APP_URL"
  exit 0
fi

if [[ ! -d node_modules ]]; then
  print "首次启动：正在安装项目依赖……"
  pnpm install --frozen-lockfile || fail "依赖安装失败。请检查网络和 pnpm 输出后重试。"
fi

print "正在启动 Minetoast……"
pnpm dev &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM

for attempt in {1..90}; do
  if curl --silent --fail "$APP_URL" >/dev/null 2>&1; then
    print "服务已就绪，正在打开浏览器：$APP_URL"
    open "$APP_URL"
    wait "$SERVER_PID"
    exit $?
  fi

  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    fail "开发服务器提前退出。请查看上方错误信息。"
  fi

  sleep 1
done

fail "等待服务启动超时。请查看上方日志确认端口 4173 和 4174 未被占用。"
