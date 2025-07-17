#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Teste do Shopee Real Images Scraper
"""

import requests
import json
import time

def test_real_extraction():
    """Testar extração de imagens e comentários reais"""
    
    # URLs de teste
    test_urls = [
        "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326",
        "https://shopee.com.br/Tablet-Infantil-Mil07-6Gb-RAM-128GB-Astronauta-Kids-Controle-Parental-i.1296642221.22898317592",
        "https://shopee.com.br/5.8-Incell-Amoled-Display-Para-Iphone-X-Frontal-Oled-Tela-HD-VIVID-LCD-i.1077684928.22992491377"
    ]
    
    base_url = "http://localhost:5001"
    
    print("🧪 Testando extração de IMAGENS REAIS...")
    print("=" * 60)
    
    # Verificar se servidor está rodando
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Servidor ATIVO")
        else:
            print("❌ Servidor não está respondendo")
            return
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        print("💡 Execute: python shopee_real_images_scraper.py")
        return
    
    # Testar cada URL
    for i, url in enumerate(test_urls, 1):
        print(f"\n🔍 Teste {i}: {url}")
        print("-" * 60)
        
        try:
            # Fazer request
            response = requests.post(
                f"{base_url}/api/extract-real",
                json={"url": url},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('success'):
                    product = data['data']
                    
                    print(f"✅ SUCESSO!")
                    print(f"📝 Nome: {product.get('name', 'N/A')}")
                    print(f"💰 Preço: {product.get('price', 'N/A')}")
                    print(f"⭐ Avaliação: {product.get('rating', 'N/A')}")
                    
                    # Mostrar imagens
                    images = product.get('images', [])
                    print(f"🖼️ Imagens encontradas: {len(images)}")
                    for j, img in enumerate(images[:3], 1):  # Mostrar só as 3 primeiras
                        if isinstance(img, dict):
                            print(f"   {j}. {img.get('url', 'N/A')}")
                            if img.get('local_path'):
                                print(f"      💾 Salva em: {img['local_path']}")
                        else:
                            print(f"   {j}. {img}")
                    
                    # Mostrar comentários
                    reviews = product.get('reviews', [])
                    print(f"💬 Comentários encontrados: {len(reviews)}")
                    for j, review in enumerate(reviews[:2], 1):  # Mostrar só os 2 primeiros
                        preview = review[:100] + "..." if len(review) > 100 else review
                        print(f"   {j}. {preview}")
                    
                else:
                    print(f"❌ FALHA: {data.get('error', 'Erro desconhecido')}")
            else:
                print(f"❌ Erro HTTP {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
        
        time.sleep(2)  # Pausa entre testes
    
    print("\n" + "=" * 60)
    print("🏁 Testes concluídos!")
    print("📁 Verifique a pasta 'real_images' para ver as imagens baixadas")

if __name__ == '__main__':
    test_real_extraction() 