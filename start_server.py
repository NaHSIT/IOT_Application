import http.server
import socketserver
import os
import sys

# Define port
PORT = 8080

# Change to the web directory
web_dir = r"E:\AndroidStudio_prj\IOT_PC_Web"
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n✅ 成功启动本地 Web 服务器！")
        print(f"🌐 请在浏览器中输入以下网址打开：")
        print(f"👉 http://localhost:{PORT}")
        print(f"👉 http://127.0.0.1:{PORT}")
        print(f"\n(按 Ctrl+C 停止服务器)")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 服务器已停止。")
    sys.exit(0)
except Exception as e:
    print(f"\n❌ 启动服务器失败: {e}")
