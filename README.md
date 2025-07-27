# Notes App

Application web de prise de notes avec partage, authentification et interface moderne (Next.js + FastAPI + PostgreSQL).

---

### 📝 Fonctionnalités principales
_Authentification JWT_
_Création, édition, suppression de notes_
_Partage de notes avec d'autres utilisateurs_
_Notes publiques via lien unique_
_Recherche et filtres_

## Structure du projet 
 ```bash
backend/
  api/
  db/
  main.py
  requirements.txt
frontend/
  app/
  components/
  context/
  lib/
  public/
  next.config.js
  package.json
[docker-compose.yml](http://_vscodecontentref_/0)
```
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


cd frontend
npm install
npm run dev
# Accède à http://localhost:3000
Backend (API docs) : http://localhost:8000/docs



# Pour Docker
DATABASE_URL=postgres://postgres:1234@db:5432/notesdb
SERVER_HOST=0.0.0.0
ACCESS_TOKEN_EXPIRE_MINUTES=40






📂 Structure du projet

backend/
frontend/
[docker-compose.yml](http://_vscodecontentref_/0)
README.md
