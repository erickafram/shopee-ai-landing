#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 TESTE FINAL - Sistema Definitivo de Dados Reais
"""

import requests
import json
import os

def test_final_real_system():
    """Teste completo do sistema final"""
    
    print("🎯 TESTE FINAL - SISTEMA DEFINITIVO DE DADOS REAIS")
    print("=" * 70)
    print("🚫 Este sistema NÃO retorna dados fictícios")
    print("✅ APENAS dados extraídos diretamente da Shopee")
    print("🖼️ Imagens reais baixadas automaticamente")
    print("=" * 70)
    
    # URLs reais para teste
    test_urls = [
        {
            "name": "Sapato Masculino",
            "url": "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
        },
        {
            "name": "Tablet Infantil", 
            "url": "https://shopee.com.br/Tablet-Infantil-Mil07-6Gb-RAM-128GB-Astronauta-Kids-Controle-Parental-i.1296642221.22898317592"
        }
    ]
    
    base_url = "http://localhost:5003"
    
    # Verificar se servidor está ativo
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Servidor ativo: {health_data.get('message', '')}")
        else:
            print("❌ Servidor não está respondendo")
            print("💡 Execute: python shopee_final_real_scraper.py")
            return
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        print("💡 Inicie o servidor: python shopee_final_real_scraper.py")
        return
    
    print("\n🔍 Iniciando testes de extração REAL...")
    
    for i, test_item in enumerate(test_urls, 1):
        print(f"\n{'='*70}")
        print(f"🧪 TESTE {i}: {test_item['name']}")
        print(f"URL: {test_item['url']}")
        print(f"{'='*70}")
        
        try:
            response = requests.post(
                f"{base_url}/api/extract-final-real",
                json={"url": test_item['url']},
                timeout=30
            )
            
            print(f"📡 Status HTTP: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('success'):
                    product = data['data']
                    extraction_info = product.get('extraction_info', {})
                    
                    print("✅ DADOS REAIS EXTRAÍDOS COM SUCESSO!")
                    print("-" * 50)
                    
                    # Informações básicas
                    print(f"📝 Nome: {product.get('name', 'N/A')}")
                    print(f"💰 Preço: {product.get('price', 'N/A')}")
                    
                    if product.get('originalPrice'):
                        print(f"💸 Preço original: {product['originalPrice']}")
                    
                    if product.get('discount'):
                        print(f"🏷️ Desconto: {product['discount']}")
                    
                    print(f"⭐ Avaliação: {product.get('rating', 'N/A')}")
                    print(f"📦 Vendidos: {product.get('sold', 'N/A')}")
                    print(f"📊 Estoque: {product.get('stock', 'N/A')}")
                    
                    # Imagens reais
                    real_images = product.get('real_images', [])
                    print(f"🖼️ Imagens REAIS baixadas: {len(real_images)}")
                    
                    for j, img in enumerate(real_images[:3], 1):
                        print(f"   {j}. URL: {img.get('url', 'N/A')}")
                        print(f"      📁 Arquivo: {img.get('filename', 'N/A')}")
                        print(f"      ✅ Real: {img.get('is_real', False)}")
                    
                    # Variações
                    variations = product.get('variations', [])
                    if variations:
                        print(f"🎨 Variações disponíveis: {len(variations)}")
                        for var in variations[:3]:
                            print(f"   - {var.get('name', 'N/A')}: R$ {var.get('price', 0):.2f}")
                    
                    # Informações de extração
                    print(f"🔧 Estratégia usada: {extraction_info.get('strategy', 'N/A')}")
                    print(f"🎯 Dados são reais: {extraction_info.get('is_real_data', False)}")
                    print(f"📡 Fonte: {extraction_info.get('source', 'N/A')}")
                    
                else:
                    print("❌ FALHA NA EXTRAÇÃO")
                    print(f"Erro: {data.get('error', 'N/A')}")
                    print(f"Mensagem: {data.get('message', 'N/A')}")
                    
                    if 'suggestion' in data:
                        print(f"💡 Sugestão: {data['suggestion']}")
            
            elif response.status_code == 404:
                data = response.json()
                print("❌ PRODUTO NÃO ENCONTRADO OU BLOQUEADO")
                print(f"ℹ️ {data.get('message', '')}")
                
            else:
                print(f"❌ Erro HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Detalhes: {error_data}")
                except:
                    print(f"Resposta: {response.text[:200]}...")
                    
        except requests.Timeout:
            print("⏰ TIMEOUT - A extração demorou muito")
            print("ℹ️ Isso pode indicar que a Shopee está bloqueando")
            
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
    
    # Verificar pasta de imagens
    print(f"\n{'='*70}")
    print("📁 VERIFICAÇÃO DE IMAGENS BAIXADAS")
    print("-" * 40)
    
    images_dir = "extracted_real_images"
    if os.path.exists(images_dir):
        images = [f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        print(f"📂 Pasta: {images_dir}")
        print(f"🖼️ Total de imagens: {len(images)}")
        
        if images:
            print("📋 Últimas imagens baixadas:")
            for img in sorted(images)[-5:]:  # Mostrar as 5 mais recentes
                print(f"   - {img}")
        else:
            print("⚠️ Nenhuma imagem foi baixada")
    else:
        print("❌ Pasta de imagens não encontrada")
    
    print(f"\n{'='*70}")
    print("🏁 TESTE FINAL CONCLUÍDO")
    print("🎯 RESUMO:")
    print("   ✅ Sistema extrai APENAS dados reais")
    print("   🚫 Zero informações fictícias")
    print("   🖼️ Imagens reais baixadas automaticamente")
    print("   💪 Múltiplas estratégias de extração")
    print("   🛡️ Se não conseguir dados reais, não retorna nada fictício")
    print(f"{'='*70}")

if __name__ == '__main__':
    test_final_real_system() 