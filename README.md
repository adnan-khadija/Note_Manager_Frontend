# Notes App

Application web de prise de notes avec partage, authentification et interface moderne (Next.js + FastAPI + PostgreSQL).

---

## 🚀 Lancer le projet

### 1. **Test en local (sans Docker)**

#### **Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Vérifie que le fichier .env contient :
# DATABASE_URL=postgres://postgres:1234@localhost:5432/notesdb
uvicorn main:app --reload --host 0.0.0.0 --port 8000

#### **Backend**
cd frontend
npm install
npm run dev
# Accède à http://localhost:3000
Base de données
Lance PostgreSQL localement (par exemple avec Docker Desktop ou un service local) :
2. Test avec Docker (recommandé)
Frontend : http://localhost:3000
Backend (API docs) : http://localhost:8000/docs
La base PostgreSQL est gérée automatiquement dans un conteneur.

# Pour test local
DATABASE_URL=postgres://postgres:1234@localhost:5432/notesdb

# Pour Docker
DATABASE_URL=postgres://postgres:1234@db:5432/notesdb
SERVER_HOST=0.0.0.0
ACCESS_TOKEN_EXPIRE_MINUTES=40

📝 Fonctionnalités principales
Authentification JWT
Création, édition, suppression de notes
Partage de notes avec d'autres utilisateurs
Notes publiques via lien unique
Recherche et filtres

📂 Structure du projet

backend/
frontend/
[docker-compose.yml](http://_vscodecontentref_/0)
README.md
