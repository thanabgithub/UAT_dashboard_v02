  GNU nano 4.8                   deploy-app-3001.sh                   Modified  
#!/usr/bin/bash
source .venv/bin/activate
pipenv shell 
python preload.py > echo
