@echo off
echo 🚀 Iniciando Sistema Completo Shopee AI Landing
echo.

echo 📦 Instalando dependências Python...
pip install -r requirements.txt --quiet

echo 📡 Iniciando servidor Python...
start "Servidor Python" python json_landing_generator.py

timeout /t 5

echo 🌐 Iniciando frontend...
start "Frontend" npm run dev

echo.
echo ✅ Sistema iniciado!
echo 📡 Servidor Python: http://localhost:5007
echo 🌐 Frontend: http://localhost:8080
echo.
echo Pressione qualquer tecla para fechar...
pause 