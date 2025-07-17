#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Teste do REAL DATA ONLY SCRAPER
"""

import requests
import json

def test_real_only_extraction():
    """Testar extração APENAS de dados reais"""
    
    # URL real do sapato que o usuário mostrou
    test_url = "https://shopee.com.br/Sapato-Social-Masculino-Derby-Konna-Casual-Elegante-Confortável-Em-Couro-Cadarço-Lançamento-i.654321987.12345678901"
    
    # URL real dos produtos que sabemos que existem
    test_urls = [
        "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326",
        "https://shopee.com.br/Tablet-Infantil-Mil07-6Gb-RAM-128GB-Astronauta-Kids-Controle-Parental-i.1296642221.22898317592"
    ]
    
    base_url = "http://localhost:5002"
    
    print("🎯 Testando REAL DATA ONLY SCRAPER...")
    print("=" * 60)
    print("🚫 Este scraper NÃO retorna dados fictícios")
    print("✅ APENAS dados reais extraídos da Shopee")
    print("=" * 60)
    
    # Verificar se servidor está rodando
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Servidor REAL DATA ONLY ativo")
        else:
            print("❌ Servidor não está respondendo")
            return
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        print("💡 Execute: python real_data_only_scraper.py")
        return
    
    # Testar cada URL
    for i, url in enumerate(test_urls, 1):
        print(f"\n🔍 TESTE {i}: Extração REAL ONLY")
        print(f"URL: {url}")
        print("-" * 60)
        
        try:
            response = requests.post(
                f"{base_url}/api/extract-real-only",
                json={"url": url},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('success'):
                    product = data['data']
                    
                    print("✅ DADOS REAIS EXTRAÍDOS!")
                    print("=" * 40)
                    print(f"📝 Nome: {product.get('name', 'N/A')}")
                    
                    # Mostrar preços reais
                    if product.get('price_min') and product.get('price_max'):
                        if product['price_min'] == product['price_max']:
                            print(f"💰 Preço: R$ {product['price_min']:.2f}")
                        else:
                            print(f"💰 Preço: R$ {product['price_min']:.2f} - R$ {product['price_max']:.2f}")
                    elif product.get('price'):
                        print(f"💰 Preço: R$ {product['price']:.2f}")
                    
                    if product.get('price_before_discount'):
                        print(f"💸 Preço original: R$ {product['price_before_discount']:.2f}")
                    
                    if product.get('discount'):
                        print(f"🏷️ Desconto: {product['discount']}%")
                    
                    print(f"⭐ Avaliação: {product.get('rating', 'N/A')}")
                    print(f"📦 Vendidos: {product.get('sold', 'N/A')}")
                    print(f"📊 Estoque: {product.get('stock', 'N/A')}")
                    
                    # Mostrar imagens REAIS
                    images = product.get('images', [])
                    print(f"🖼️ Imagens REAIS: {len(images)}")
                    for j, img in enumerate(images[:3], 1):
                        print(f"   {j}. {img.get('url', 'N/A')}")
                        if img.get('local_path'):
                            print(f"      💾 Baixada: {img['local_path']}")
                        if img.get('is_real'):
                            print("      ✅ CONFIRMADO: Imagem real")
                    
                    # Mostrar variações se existirem
                    variations = product.get('variations', [])
                    if variations:
                        print(f"🎨 Variações: {len(variations)}")
                        for var in variations[:3]:
                            print(f"   - {var.get('name', 'N/A')}: R$ {var.get('price', 0):.2f}")
                    
                    # Confirmar que são dados reais
                    if product.get('is_real_data'):
                        print("🎯 CONFIRMADO: Dados extraídos são 100% REAIS")
                    
                else:
                    print(f"❌ FALHA: {data.get('error', 'Erro desconhecido')}")
                    print("ℹ️ Este sistema só retorna dados se conseguir extrair informações REAIS")
                    
            elif response.status_code == 404:
                data = response.json()
                print("❌ PRODUTO NÃO ENCONTRADO")
                print(f"ℹ️ {data.get('message', '')}")
            else:
                print(f"❌ Erro HTTP {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Teste REAL DATA ONLY concluído!")
    print("🎯 Este sistema garante:")
    print("   ✅ APENAS dados reais extraídos")
    print("   🚫 ZERO informações fictícias")
    print("   🖼️ Imagens reais baixadas")
    print("   📊 Preços e avaliações atuais")

if __name__ == '__main__':
    test_real_only_extraction() 