@echo off
title Sistema Completo Shopee + Extensão - MELHORADO
echo 🚀 Iniciando Sistema COMPLETO Shopee + Extensão Chrome
echo ================================================================
echo 🔧 Recursos Aprimorados:
echo ✅ Extensão Chrome CORRIGIDA (sem problemas de CORS)
echo ✅ Servidor JSON para upload (porta 5007)
echo ✅ Servidor de Scraping inteligente (porta 5000)
echo ✅ Frontend React (porta automática)
echo ================================================================

echo.
echo 🔧 Preparando ambiente...
pip install -r requirements.txt --upgrade --quiet >nul 2>&1

echo.
echo 🚀 Iniciando servidores em paralelo...
echo ================================================================

echo Servidor 1: JSON Landing Generator (porta 5007)
start "Servidor JSON" cmd /k "echo 🎯 JSON LANDING PAGE GENERATOR && python json_landing_generator.py"

REM Aguardar um pouco
timeout /t 3 >nul

echo Servidor 2: Scraping Híbrido Inteligente (porta 5000)
start "Servidor Scraping" cmd /k "echo 🧠 SCRAPER HÍBRIDO INTELIGENTE && python scraper_hybrid_intelligent.py"

REM Aguardar mais um pouco
timeout /t 5 >nul

echo Servidor 3: Frontend React
start "Frontend React" cmd /k "echo 🌐 FRONTEND REACT && npm run dev"

echo.
echo ⏳ Aguardando servidores iniciarem...
timeout /t 8 >nul

echo.
echo 🧪 Abrindo página de teste da extensão...
start http://localhost:8081/extesion/test_extension.html

echo.
echo 📋 INSTRUÇÕES DE USO COMPLETAS:
echo ================================================================
echo 🌐 SERVIDORES ATIVOS:
echo    • JSON Generator: http://localhost:5007
echo    • Scraper Inteligente: http://localhost:5000  
echo    • Frontend React: http://localhost:8081
echo.
echo 🔧 EXTENSÃO CHROME:
echo    1. Vá para: chrome://extensions/
echo    2. Ative "Modo do desenvolvedor"
echo    3. Clique "Carregar sem compactação" 
echo    4. Selecione a pasta: extesion/
echo.
echo 🛍️ TESTAR EXTENSÃO:
echo    1. Abra uma página da Shopee
echo    2. Clique no ícone da extensão
echo    3. Clique "Extrair Dados"
echo    4. O JSON será baixado automaticamente
echo.
echo 📊 CARREGAR JSON NO SISTEMA:
echo    1. Acesse: http://localhost:8081/dashboard/create
echo    2. Faça upload do JSON extraído
echo    3. Gere sua landing page automática
echo.
echo 🔍 TESTE DE INTEGRAÇÃO:
echo    • Teste automático: extesion/test_extension.html
echo    • URLs de teste incluídas no arquivo
echo.
echo 🎯 MELHORIAS IMPLEMENTADAS:
echo    ✅ Problema de CORS resolvido
echo    ✅ Seletores CSS atualizados
echo    ✅ Apenas URLs de imagens (sem download)
echo    ✅ Permissões expandidas no manifest
echo    ✅ Código simplificado e otimizado
echo.
echo ================================================================

pause 