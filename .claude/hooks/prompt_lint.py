#!/usr/bin/env python3
import sys, json
data = json.load(sys.stdin)
p = data.get("prompt","")
bad = ["完全自動で危険操作", "非公認APIを使う"]
if any(b in p for b in bad):
    sys.stderr.write("プロンプトに禁止表現。修正して再送してください。\n")
    sys.exit(2)  # ブロック
print("")  # stdoutはコンテキストに注入される（UserPromptSubmit）
sys.exit(0)