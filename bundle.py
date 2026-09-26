import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

COMPONENTS = [
    "src/components/BreathingCanvas.jsx",
    "src/components/Navbar.jsx",
    "src/components/Hero.jsx",
    "src/components/About.jsx",
    "src/components/Skills.jsx",
    "src/components/Projects.jsx",
    "src/components/LiveGitHubHub.jsx",
    "src/components/Education.jsx",
    "src/components/LearningJourney.jsx",
    "src/components/VisitorInteractions.jsx",
    "src/components/Contact.jsx",
    "src/components/Footer.jsx",
    "src/components/ProjectModal.jsx",
    "src/components/CodeQuiz.jsx",
    "src/components/ShortcutsModal.jsx",
    "src/components/AssistantBot.jsx",
    "src/App.jsx",
    "src/main.jsx",
]

def bundle():
    bundle_parts = []
    for rel in COMPONENTS:
        path = os.path.join(BASE_DIR, rel.replace("/", os.sep))
        if not os.path.exists(path):
            print(f"Warning: {path} not found")
            continue
        with open(path, "r", encoding="utf-8") as f:
            code = f.read()
        header = f"// ===== {rel} =====\n"
        bundle_parts.append(header + code.strip() + "\n")

    full_bundle = "\n".join(bundle_parts)

    # 1. Update app.bundle.jsx
    bundle_path = os.path.join(BASE_DIR, "app.bundle.jsx")
    with open(bundle_path, "w", encoding="utf-8") as f:
        f.write(full_bundle)
    print(f"Updated: {bundle_path} ({len(full_bundle)} bytes)")

    # 2. Update index.html inline script
    index_path = os.path.join(BASE_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    pattern = re.compile(r"(<script type=[\"']text/babel[\"']>)([\s\S]*?)(</script>)")
    match = pattern.search(html)
    if not match:
        print("Error: Could not find <script type='text/babel'> tag in index.html")
        return

    new_html = html[:match.start(2)] + "\n\n" + full_bundle + "\n  " + html[match.end(2):]
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"Updated: {index_path} ({len(new_html)} bytes)")
    print("Done! Components bundled successfully.")

if __name__ == "__main__":
    bundle()
