@echo off
title Sistema Completo de Extração Shopee - IMAGENS REAIS
echo 🖼️ Iniciando Sistema COMPLETO de Extração da Shopee...
echo ================================================================
echo 🎯 Recursos: Dados estruturados + IMAGENS REAIS + COMENTÁRIOS REAIS
echo ================================================================

echo.
echo 🔧 Preparando ambiente...
pip install -r requirements.txt --upgrade --quiet

echo 🚗 Corrigindo ChromeDriver...
python -c "import chromedriver_autoinstaller; chromedriver_autoinstaller.install()" >nul 2>&1

echo 📁 Criando pastas necessárias...
if not exist "real_images" mkdir real_images

echo.
echo 🚀 Iniciando servidores em paralelo...
echo ================================================================

echo Servidor 1: Sistema Híbrido Inteligente (porta 5000)
echo Servidor 2: Extração de Imagens Reais (porta 5001)
echo.

REM Iniciar servidor híbrido em uma nova janela
start "Servidor Híbrido" cmd /k "echo 🧠 Servidor Híbrido Inteligente && python scraper_hybrid_intelligent.py"

REM Aguardar um pouco
timeout /t 3 >nul

REM Iniciar servidor de imagens em uma nova janela
start "Servidor Imagens" cmd /k "echo 🖼️ Servidor de Imagens Reais && python shopee_real_images_scraper.py"

echo ⏳ Aguardando servidores iniciarem...
timeout /t 10 >nul

echo.
echo 🧪 Executando demo do sistema completo...
echo ================================================================
python demo_real_images.py

echo.
echo 📋 INSTRUÇÕES DE USO:
echo ================================================================
echo 🌐 Acesse: http://localhost:5000 (Sistema Principal)
echo 🖼️ Imagens: http://localhost:5001 (Servidor de Imagens)
echo.
echo 📁 As imagens reais são salvas na pasta: real_images/
echo 💬 Comentários reais são extraídos automaticamente
echo.
echo 🔧 Para testar manualmente:
echo    python demo_real_images.py
echo    python test_real_images.py
echo.

pause 