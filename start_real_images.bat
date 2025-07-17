@echo off
echo 🖼️ Iniciando Sistema de Extração de IMAGENS REAIS da Shopee...
echo ================================================================

echo 🔧 Instalando/Atualizando dependências...
pip install -r requirements.txt --upgrade

echo 🚗 Corrigindo versão do ChromeDriver...
python -c "import chromedriver_autoinstaller; chromedriver_autoinstaller.install()"

echo 📁 Criando pasta para imagens...
if not exist "real_images" mkdir real_images

echo 🖼️ Iniciando servidor de extração de IMAGENS REAIS...
echo Servidor rodará em: http://localhost:5001
echo Endpoint: http://localhost:5001/api/extract-real
echo.
echo ⚠️  IMPORTANTE: Este servidor extrai IMAGENS REAIS e COMENTÁRIOS REAIS!
echo.

python shopee_real_images_scraper.py

pause 