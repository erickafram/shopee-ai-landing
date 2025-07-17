#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demo Completo - Sistema de Extração de IMAGENS e COMENTÁRIOS REAIS
Demonstra o uso integrado dos sistemas híbrido + imagens reais
"""

import requests
import json
import time
import os

def check_servers():
    """Verificar se os servidores estão rodando"""
    servers = {
        "Híbrido Inteligente": "http://localhost:5000/health",
        "Imagens Reais": "http://localhost:5001/health"
    }
    
    print("🔍 Verificando servidores...")
    print("=" * 50)
    
    all_running = True
    for name, url in servers.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: ATIVO")
            else:
                print(f"❌ {name}: Erro {response.status_code}")
                all_running = False
        except Exception as e:
            print(f"❌ {name}: INATIVO ({e})")
            all_running = False
    
    print()
    return all_running

def extract_complete_data(url):
    """Extrair dados completos (estruturados + imagens + comentários)"""
    print(f"🔍 Extraindo dados COMPLETOS de: {url}")
    print("-" * 80)
    
    try:
        # 1. Extrair dados estruturados (sistema híbrido)
        print("📊 Extraindo dados estruturados...")
        hybrid_response = requests.post(
            "http://localhost:5000/api/extract",
            json={"url": url},
            timeout=30
        )
        
        if hybrid_response.status_code == 200:
            hybrid_data = hybrid_response.json()
            print("✅ Dados estruturados extraídos!")
            
            # Mostrar dados básicos
            if hybrid_data.get('success'):
                product = hybrid_data['data']
                print(f"📝 Nome: {product.get('name', 'N/A')}")
                print(f"💰 Preço: {product.get('price', 'N/A')}")
                print(f"⭐ Avaliação: {product.get('rating', 'N/A')}")
                print(f"📦 Vendidos: {product.get('sold', 'N/A')}")
                
                # Verificar se tem imagens reais
                if product.get('real_images'):
                    print(f"🖼️ Imagens reais: {len(product['real_images'])}")
                    for i, img in enumerate(product['real_images'][:3], 1):
                        if isinstance(img, dict):
                            print(f"   {i}. {img.get('url', 'N/A')}")
                            if img.get('local_path'):
                                print(f"      💾 Salva em: {img['local_path']}")
                
                # Verificar se tem comentários reais
                if product.get('real_reviews'):
                    print(f"💬 Comentários reais: {len(product['real_reviews'])}")
                    for i, review in enumerate(product['real_reviews'][:2], 1):
                        preview = review[:100] + "..." if len(review) > 100 else review
                        print(f"   {i}. {preview}")
                
                # Mostrar se foi enriquecido com dados reais
                if product.get('enhanced_with_real_data'):
                    print("🎯 Dados enriquecidos com informações REAIS!")
                
                return product
        else:
            print(f"❌ Erro ao extrair dados estruturados: {hybrid_response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro na extração: {e}")
    
    return None

def main():
    """Função principal do demo"""
    print("🖼️ DEMO COMPLETO - Extração de IMAGENS e COMENTÁRIOS REAIS")
    print("=" * 80)
    print()
    
    # Verificar servidores
    if not check_servers():
        print("❌ ERRO: Nem todos os servidores estão rodando!")
        print()
        print("📋 Para iniciar os servidores:")
        print("   1. Terminal 1: python scraper_hybrid_intelligent.py")
        print("   2. Terminal 2: python shopee_real_images_scraper.py")
        print("   Ou use: start_real_images.bat")
        return
    
    # URLs de teste
    test_urls = [
        {
            "name": "Sapato Masculino Loafer",
            "url": "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
        },
        {
            "name": "Tablet Infantil",
            "url": "https://shopee.com.br/Tablet-Infantil-Mil07-6Gb-RAM-128GB-Astronauta-Kids-Controle-Parental-i.1296642221.22898317592"
        },
        {
            "name": "Display iPhone X",
            "url": "https://shopee.com.br/5.8-Incell-Amoled-Display-Para-Iphone-X-Frontal-Oled-Tela-HD-VIVID-LCD-i.1077684928.22992491377"
        }
    ]
    
    print("🧪 Testando extração COMPLETA...")
    print()
    
    results = []
    
    for i, item in enumerate(test_urls, 1):
        print(f"🔍 TESTE {i}: {item['name']}")
        print("=" * 80)
        
        result = extract_complete_data(item['url'])
        if result:
            results.append({
                'name': item['name'],
                'data': result
            })
        
        print()
        time.sleep(2)  # Pausa entre testes
    
    # Resumo final
    print("📋 RESUMO DOS TESTES")
    print("=" * 80)
    
    for result in results:
        print(f"📦 {result['name']}:")
        data = result['data']
        
        # Imagens
        real_images = data.get('real_images', [])
        if real_images:
            print(f"   🖼️ {len(real_images)} imagens reais extraídas")
        else:
            print(f"   🖼️ Nenhuma imagem real extraída")
        
        # Comentários
        real_reviews = data.get('real_reviews', [])
        if real_reviews:
            print(f"   💬 {len(real_reviews)} comentários reais extraídos")
        else:
            print(f"   💬 Nenhum comentário real extraído")
        
        # Status de enriquecimento
        if data.get('enhanced_with_real_data'):
            print(f"   ✅ Dados enriquecidos com informações reais")
        else:
            print(f"   ⚠️ Dados não enriquecidos (usando base inteligente)")
        
        print()
    
    # Verificar pasta de imagens
    images_dir = "real_images"
    if os.path.exists(images_dir):
        images = [f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.png', '.jpeg'))]
        print(f"📁 Pasta de imagens: {len(images)} imagens salvas em '{images_dir}'")
    else:
        print("📁 Pasta de imagens não encontrada")
    
    print()
    print("🏁 Demo concluído!")
    print("🎯 Sistema integrado funcionando: Dados estruturados + Imagens reais + Comentários reais")

if __name__ == '__main__':
    main() 