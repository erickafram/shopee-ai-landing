@echo off
echo 🚀 Iniciando Sistema Completo Shopee AI Landing
echo.

echo 📡 Iniciando servidor Python híbrido...
start "Servidor Python" python scraper_hybrid_intelligent.py

timeout /t 3

echo 🌐 Iniciando frontend...
start "Frontend" npm run dev

echo.
echo ✅ Sistema iniciado!
echo 📡 Servidor Python: http://localhost:5000
echo 🌐 Frontend: http://localhost:8080
echo.
echo Pressione qualquer tecla para fechar...
pause 