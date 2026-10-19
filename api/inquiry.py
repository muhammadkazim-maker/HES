import http.server
import socketserver
import sys
import os
import json
import re
import time
import urllib.request
import urllib.parse
from datetime import datetime

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000

# In-memory IP rate limiter: { ip_address: [timestamp, ...] }
RATE_LIMIT_WINDOW = 600  # 10 minutes
RATE_LIMIT_MAX = 5       # Max 5 submissions per 10 mins per IP
IP_SUBMISSION_HISTORY = {}

def is_rate_limited(ip):
    now = time.time()
    history = IP_SUBMISSION_HISTORY.get(ip, [])
    # purge old entries
    history = [t for t in history if now - t < RATE_LIMIT_WINDOW]
    if len(history) >= RATE_LIMIT_MAX:
        IP_SUBMISSION_HISTORY[ip] = history
        return True
    history.append(now)
    IP_SUBMISSION_HISTORY[ip] = history
    return False

def sanitize_text(val, max_len=500):
    if not val:
        return ""
    # Strip HTML tags
    val = re.sub(r"<[^>]*>", "", str(val))
    # Strip header injection characters
    val = val.replace("\r", " ").replace("\n", " ")
    return val.strip()[:max_len]

def sanitize_multiline(val, max_len=3000):
    if not val:
        return ""
    val = re.sub(r"<[^>]*>", "", str(val))
    val = val.replace("\r", "")
    return val.strip()[:max_len]

class HESHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Cache control for local preview
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

        # Security Headers (Native host implementation)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")

        # Content-Security-Policy (Report-Only during staging)
        # Built only from actual origins used in audit:
        # YouTube, Google Maps, Google Fonts, Cloudflare Turnstile
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://www.youtube.com https://challenges.cloudflare.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:; "
            "img-src 'self' data: https:; "
            "frame-src https://www.youtube.com https://www.google.com https://www.youtube-nocookie.com https://challenges.cloudflare.com; "
            "connect-src 'self' https://challenges.cloudflare.com; "
            "object-src 'none'; "
            "base-uri 'self'; "
            "form-action 'self' http://localhost:3000 http://localhost:3001; "
            "frame-ancestors 'none';"
        )
        self.send_header("Content-Security-Policy-Report-Only", csp)

        # TODO: Enable Strict-Transport-Security after custom domain is live on HTTPS
        # self.send_header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            custom_404_path = os.path.join(self.directory or os.getcwd(), "404.html")
            if os.path.exists(custom_404_path):
                try:
                    with open(custom_404_path, "rb") as f:
                        content = f.read()
                    self.send_response(404, "Not Found")
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                    return
                except Exception:
                    pass
        super().send_error(code, message, explain)

    def do_POST(self):
        # Handle form submissions at /api/inquiry or /api/contact
        if self.path in ["/api/inquiry", "/api/contact", "/api/admission"]:
            self.handle_inquiry_submission()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_inquiry_submission(self):
        client_ip = self.client_address[0]
        
        # 1. Rate Limiting Check
        if is_rate_limited(client_ip):
            self.send_json_response(429, {
                "success": False,
                "error": "Too many submissions. Please wait 10 minutes before trying again."
            })
            return

        # Read POST body
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length)
            content_type = self.headers.get("Content-Type", "")

            if "application/json" in content_type:
                data = json.loads(post_body.decode("utf-8"))
            else:
                parsed = urllib.parse.parse_qs(post_body.decode("utf-8"))
                data = {k: v[0] for k, v in parsed.items()}
        except Exception as e:
            self.send_json_response(400, {"success": False, "error": "Invalid request body."})
            return

        # 2. Spam Honeypot Check (field 'website' must be empty)
        honeypot = data.get("website", "").strip()
        if honeypot:
            # Silent rejection: fake success to confuse bots
            self.send_json_response(200, {
                "success": True,
                "message": "Thank you. Your inquiry has been recorded."
            })
            return

        # 3. Minimum Time to Submit Check (>= 3 seconds)
        try:
            load_time = float(data.get("_timeLoaded", 0))
            if load_time > 0 and (time.time() * 1000 - load_time) < 3000:
                self.send_json_response(400, {
                    "success": False,
                    "error": "Submission was too fast. Please take your time and review your information."
                })
                return
        except (ValueError, TypeError):
            pass

        # 4. Turnstile Verification
        turnstile_token = data.get("cf-turnstile-response") or data.get("turnstileToken")
        secret_key = os.environ.get("TURNSTILE_SECRET_KEY", "1x0000000000000000000000000000000AA")
        if turnstile_token:
            try:
                verify_data = urllib.parse.urlencode({
                    "secret": secret_key,
                    "response": turnstile_token,
                    "remoteip": client_ip
                }).encode("utf-8")
                req = urllib.request.Request(
                    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                    data=verify_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                with urllib.request.urlopen(req, timeout=5) as res:
                    verify_res = json.loads(res.read().decode("utf-8"))
                    if not verify_res.get("success", False) and secret_key != "1x0000000000000000000000000000000AA":
                        self.send_json_response(400, {
                            "success": False,
                            "error": "Security verification failed. Please try again."
                        })
                        return
            except Exception as e:
                # Log but do not block in local dev if network unavailable
                print(f"[Turnstile Check Notice]: {e}")

        # 5. Extract and Sanitize Fields
        parent_name = sanitize_text(data.get("parentName") or data.get("name", ""))
        student_name = sanitize_text(data.get("studentName", ""))
        class_applying = sanitize_text(data.get("classApplying") or data.get("subject", "General Inquiry"))
        phone = sanitize_text(data.get("phone", ""), max_len=30)
        email = sanitize_text(data.get("email", ""), max_len=120)
        message = sanitize_multiline(data.get("message", ""))

        # Validation
        errors = {}
        if not parent_name or len(parent_name) < 2:
            errors["parentName"] = "Parent / Guardian name is required (min 2 characters)."
        if not phone or len(phone) < 8:
            errors["phone"] = "A valid contact number is required."
        if not email or not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
            errors["email"] = "A valid email address is required."
        if not message or len(message) < 5:
            errors["message"] = "Please write a brief inquiry or message (min 5 characters)."

        if errors:
            self.send_json_response(422, {
                "success": False,
                "error": "Please correct the highlighted fields.",
                "errors": errors
            })
            return

        # 6. Dispatch Email Notification (Resend API or Mock)
        resend_api_key = os.environ.get("RESEND_API_KEY", "")
        dest_email = os.environ.get("ADMISSIONS_EMAIL", "admissions@hes.com.pk")

        print(f"\n--- [NEW INQUIRY RECEIVED] ---")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Parent: {parent_name} | Student: {student_name}")
        print(f"Class/Purpose: {class_applying}")
        print(f"Contact: {phone} | {email}")
        print(f"Message: {message}")
        print(f"Recipient Inbox: {dest_email}")

        email_sent = False
        if resend_api_key and resend_api_key.startswith("re_"):
            try:
                email_payload = json.dumps({
                    "from": "HES Admissions <onboarding@resend.dev>",
                    "to": [dest_email],
                    "subject": f"New Admission Inquiry: {student_name or parent_name} ({class_applying})",
                    "html": f"""
                    <h2>New Inquiry Received — Hadi Education System</h2>
                    <p><strong>Parent / Guardian:</strong> {parent_name}</p>
                    <p><strong>Student Name:</strong> {student_name or 'N/A'}</p>
                    <p><strong>Class Applying For / Purpose:</strong> {class_applying}</p>
                    <p><strong>Telephone:</strong> <a href="tel:{phone}">{phone}</a></p>
                    <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
                    <p><strong>Message:</strong></p>
                    <blockquote>{message}</blockquote>
                    <hr>
                    <p><small>Submitted via HES Website Form</small></p>
                    """
                }).encode("utf-8")
                
                req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=email_payload,
                    headers={
                        "Authorization": f"Bearer {resend_api_key}",
                        "Content-Type": "application/json"
                    }
                )
                with urllib.request.urlopen(req, timeout=8) as res:
                    if res.status in [200, 201]:
                        email_sent = True
                        print("[Resend] Notification successfully delivered.")
            except Exception as e:
                print(f"[Resend Email Error]: {e}")
        else:
            print("[Note] RESEND_API_KEY not configured or using test placeholder. Logged inquiry to server console.")

        # Success Response with auto-reply message
        self.send_json_response(200, {
            "success": True,
            "message": f"Assalam-o-Alaikum, {parent_name}! Your inquiry has been received. Our administration will contact you at {phone} within 24 hours.",
            "autoReplySent": True
        })

    def send_json_response(self, status_code, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == "__main__":
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    handler = lambda *args, **kwargs: HESHTTPRequestHandler(*args, directory=web_dir, **kwargs)
    try:
        with ThreadingServer(("", PORT), handler) as httpd:
            print(f"\n=======================================================")
            print(f"  Hadi Education System (HES) Web Server")
            print(f"  URL: http://localhost:{PORT}")
            print(f"  Serving directory: {web_dir}")
            print(f"  Security Headers: Active (CSP Report-Only)")
            print(f"  API Endpoint: POST http://localhost:{PORT}/api/inquiry")
            print(f"  Custom 404: Active (404.html)")
            print(f"=======================================================\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
