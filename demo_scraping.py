#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demo do Sistema de Scraping da Shopee
Demonstra como extrair dados reais de produtos
"""

import requests
import json
import time
import sys

def test_server_health():
    """Testar se o servidor está rodando"""
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Servidor está ativo!")
            return True
        else:
            print(f"❌ Servidor retornou status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Servidor não está rodando!")
        print("💡 Inicie o servidor com: python scraper_server.py")
        return False
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        return False

def extract_product_data(url):
    """Extrair dados de um produto"""
    print(f"\n🔍 Extraindo dados de: {url}")
    
    try:
        response = requests.post(
            'http://localhost:5000/api/extract',
            json={'url': url},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if 'error' in data:
                print(f"❌ Erro: {data['error']}")
                return None
            
            print("✅ Dados extraídos com sucesso!")
            print(f"📝 Nome: {data.get('name', 'N/A')}")
            print(f"💰 Preço: {data.get('price', 'N/A')}")
            if data.get('originalPrice'):
                print(f"💸 Preço Original: {data.get('originalPrice')}")
            print(f"🖼️ Imagens: {len(data.get('images', []))} encontradas")
            print(f"⭐ Rating: {data.get('rating', 'N/A')}")
            print(f"👥 Reviews: {data.get('reviews', 'N/A')}")
            print(f"📂 Categoria: {data.get('category', 'N/A')}")
            
            if data.get('variations'):
                variations = data['variations']
                if variations.get('colors'):
                    print(f"🎨 Cores: {', '.join(variations['colors'])}")
                if variations.get('sizes'):
                    print(f"📏 Tamanhos: {', '.join(variations['sizes'])}")
            
            return data
            
        else:
            print(f"❌ Erro HTTP {response.status_code}: {response.text}")
            return None
            
    except requests.exceptions.Timeout:
        print("❌ Timeout na extração (> 30s)")
        return None
    except Exception as e:
        print(f"❌ Erro na extração: {e}")
        return None

def main():
    print("🕷️ Demo do Sistema de Scraping Real da Shopee")
    print("=" * 50)
    
    # Testar se o servidor está rodando
    if not test_server_health():
        return
    
    # URLs de teste
    test_urls = [
        "https://shopee.com.br/Tablet-Infantil-Mil07-6Gb-RAM-128GB-Astronauta-Kids-Controle-Parental-i.1296642221.22898317592",
        "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
    ]
    
    # Se o usuário passou uma URL como argumento
    if len(sys.argv) > 1:
        url = sys.argv[1]
        print(f"\n🔗 URL fornecida pelo usuário: {url}")
        extract_product_data(url)
    else:
        # Testar URLs de exemplo
        for i, url in enumerate(test_urls, 1):
            print(f"\n📋 Teste {i}/{len(test_urls)}")
            result = extract_product_data(url)
            
            if result:
                # Salvar resultado em arquivo JSON
                filename = f"produto_{i}.json"
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(result, f, ensure_ascii=False, indent=2)
                print(f"💾 Dados salvos em: {filename}")
            
            if i < len(test_urls):
                print("\n⏳ Aguardando 2 segundos...")
                time.sleep(2)
    
    print("\n🏁 Demo concluída!")
    print("\n💡 Para testar com sua própria URL:")
    print("   python demo_scraping.py 'https://shopee.com.br/seu-produto'")

if __name__ == '__main__':
    main() 