# 🧠 AI-Powered BRD to JIRA Task Automation

Convert Business Requirement Documents (BRDs) directly into structured, actionable JIRA tasks — using OCR, LLMs, and task assignment logic.

> 🚀 Real-world example: From a messy Word/PDF BRD → clean epics, user stories, priorities, and auto-assigned developer tasks.

---

## 📌 Key Features

- 📥 **Smart Document Ingestion**: Upload BRDs via web, cloud drives, or email.
- 🔍 **OCR & Parsing Engine**: Understands PDFs, Word docs, images, and scanned notes.
- 🧹 **Text Cleaning & Structuring**: Segments BRDs into objectives, features, and functional sections.
- 🧠 **AI Context Extraction**: Uses LLMs (e.g., GPT-4, Mistral) to generate:
  - Epics
  - User stories
  - Tags
  - Priorities
  - Acceptance criteria
  - Skill mappings
- ⚙️ **Task Generator**: Creates developer- and QA-ready tasks.
- 🧑‍💻 **Task Assignment Engine**:
  - Rule-based or ML-based developer assignment
  - Based on tags, skills, and historical project data
- 🔗 **JIRA Sync (Coming Soon)**: Auto-push tasks via JIRA REST API

---
## Tech Stack

| Layer             | Technology                                 |
| ----------------- | ------------------------------------------ |
| Frontend          | React.js / Flutter (optional)              |
| Backend API       | Python + FastAPI                           |
| OCR Engine        | EasyOCR / Tesseract                        |
| AI/LLM            | Mistral / GPT-4 / OpenAI API               |
| Storage           | MongoDB / PostgreSQL (for tasks, metadata) |
| Task Assignment   | Rule-based logic / Scikit-learn ML model   |
| DevOps (Optional) | Docker, GitHub Actions, GitLab CI/CD       |


## 📁 Folder Structure

📦brd-to-jira-ai
 ┣ 📂backend/
 ┃ ┣ 📜main.py
 ┃ ┣ 📂ocr/
 ┃ ┣ 📂llm/
 ┃ ┣ 📂parser/
 ┃ ┣ 📂task_generator/
 ┃ ┗ 📂assignment_engine/
 ┣ 📂frontend/ (optional)
 ┣ 📂examples/
 ┣ 📜README.md
 ┗ 📜requirements.txt


## 🙌 Contributing
Pull requests are welcome! Open an issue first to discuss your idea. For major changes, please open a discussion first.

## 📃 License
MIT License © 2025 Ganesh Divekar

## 🌐 Follow the Project
💼 LinkedIn: [Ganesh Divekar](https://www.linkedin.com/in/ganesh-divekar-96a72bb7/)
