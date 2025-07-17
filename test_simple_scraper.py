#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Teste simples do undetected-chromedriver
"""

import undetected_chromedriver as uc
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_undetected_chrome():
    """Testar se o undetected-chromedriver funciona"""
    driver = None
    try:
        print("🚀 Iniciando teste do undetected-chromedriver...")
        
        # Configurar opções
        options = uc.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--window-size=1366,768')
        
        print("🔧 Criando driver Chrome...")
        driver = uc.Chrome(options=options)
        
        print("✅ Driver criado com sucesso!")
        print("🌐 Navegando para Shopee...")
        
        # Testar navegação básica
        driver.get("https://shopee.com.br")
        time.sleep(5)
        
        print("📄 Título da página:", driver.title)
        
        # Verificar se carregou
        if "shopee" in driver.title.lower():
            print("✅ Shopee carregou com sucesso!")
            
            # Tentar navegar para um produto
            print("🔍 Navegando para produto de teste...")
            test_url = "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
            driver.get(test_url)
            time.sleep(10)
            
            print("📄 Título da página do produto:", driver.title)
            
            # Verificar se conseguiu carregar algum conteúdo
            h1_elements = driver.find_elements("tag name", "h1")
            if h1_elements:
                print(f"✅ Encontrados {len(h1_elements)} elementos H1")
                for i, h1 in enumerate(h1_elements[:3]):
                    text = h1.text.strip()
                    if text:
                        print(f"   H1 {i+1}: {text}")
            else:
                print("❌ Nenhum elemento H1 encontrado")
            
            # Verificar se há elementos de preço
            price_selectors = [
                '[class*="price"]',
                '[data-testid*="price"]'
            ]
            
            for selector in price_selectors:
                elements = driver.find_elements("css selector", selector)
                if elements:
                    print(f"💰 Encontrados {len(elements)} elementos de preço com seletor: {selector}")
                    for elem in elements[:3]:
                        text = elem.text.strip()
                        if text and 'R$' in text:
                            print(f"   Preço: {text}")
                    break
            
            # Salvar screenshot para debug
            driver.save_screenshot("debug_shopee.png")
            print("📸 Screenshot salvo como debug_shopee.png")
            
        else:
            print("❌ Falha ao carregar Shopee")
            
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        
    finally:
        if driver:
            try:
                driver.quit()
                print("🔚 Driver fechado")
            except:
                pass

if __name__ == "__main__":
    test_undetected_chrome() 