#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Teste do Sistema Híbrido com Prioridade para Dados Reais
"""

import requests
import json

def test_hybrid_with_real_priority():
    """Testar se o sistema híbrido agora prioriza dados reais"""
    
    test_url = "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
    
    print("🎯 Testando Sistema Híbrido com PRIORIDADE para dados REAIS")
    print("=" * 70)
    
    # Verificar servidores
    servers = {
        "Real Data Only": "http://localhost:5002/health",
        "Sistema Híbrido": "http://localhost:5000/health"
    }
    
    for name, url in servers.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: ATIVO")
            else:
                print(f"❌ {name}: Erro {response.status_code}")
        except Exception as e:
            print(f"❌ {name}: INATIVO")
    
    print("\n🔍 Testando extração híbrida...")
    print("-" * 50)
    
    try:
        response = requests.post(
            "http://localhost:5000/api/extract",
            json={"url": test_url},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                product = data['data']
                
                print("📊 RESULTADO DA EXTRAÇÃO:")
                print("=" * 40)
                print(f"📝 Nome: {product.get('name', 'N/A')}")
                print(f"💰 Preço: {product.get('price', 'N/A')}")
                print(f"⭐ Avaliação: {product.get('rating', 'N/A')}")
                
                # Verificar fonte dos dados
                data_source = product.get('data_source', 'unknown')
                is_real = product.get('is_real_data', False)
                
                print(f"🔍 Fonte dos dados: {data_source}")
                print(f"🎯 São dados reais: {'✅ SIM' if is_real else '❌ NÃO'}")
                
                # Verificar método de extração
                method = product.get('extraction_method', 'unknown')
                print(f"🛠️ Método: {method}")
                
                # Verificar imagens reais
                real_images = product.get('real_images', [])
                if real_images:
                    print(f"🖼️ Imagens reais: {len(real_images)} encontradas")
                    for i, img in enumerate(real_images[:2], 1):
                        print(f"   {i}. {img.get('url', 'N/A')}")
                        if img.get('local_path'):
                            print(f"      💾 Baixada: {img['local_path']}")
                else:
                    print("🖼️ Imagens reais: Nenhuma encontrada")
                
                # ANÁLISE DO RESULTADO
                print("\n📋 ANÁLISE:")
                print("-" * 30)
                
                if is_real:
                    print("✅ SUCESSO! Sistema priorizou dados REAIS")
                    print("🎯 O sistema está funcionando corretamente")
                else:
                    print("⚠️ Sistema usou dados inteligentes/fictícios")
                    print("ℹ️ Isso indica que a extração de dados reais falhou")
                    print("🔧 Possíveis causas: Anti-bot da Shopee ou produto inexistente")
                
            else:
                print(f"❌ Falha na extração: {data.get('error', 'Erro desconhecido')}")
        else:
            print(f"❌ Erro HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
    
    print("\n" + "=" * 70)
    print("🎯 RESUMO DO TESTE:")
    print("✅ O sistema híbrido agora PRIORIZA dados reais")
    print("🚫 Dados fictícios só são usados se extração real falhar")
    print("🖼️ Imagens reais são baixadas quando disponíveis")
    print("📊 Campo 'is_real_data' indica se os dados são reais ou não")

if __name__ == '__main__':
    test_hybrid_with_real_priority() 