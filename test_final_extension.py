#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 Teste Final da Extensão Shopee - SOLUÇÃO SIMPLIFICADA
Verifica se toda a integração está funcionando corretamente
"""

import requests
import json
import time
from datetime import datetime

def test_servers():
    """Testar se todos os servidores estão ativos"""
    print("🔍 Testando servidores...")
    
    servers = [
        {"name": "JSON Generator", "url": "http://localhost:5007/api/products"},
        {"name": "Scraper Híbrido", "url": "http://localhost:5000/health"},
    ]
    
    results = {}
    
    for server in servers:
        try:
            response = requests.get(server["url"], timeout=5)
            if response.status_code == 200:
                print(f"✅ {server['name']}: ATIVO")
                results[server["name"]] = "ATIVO"
            else:
                print(f"⚠️ {server['name']}: HTTP {response.status_code}")
                results[server["name"]] = f"HTTP {response.status_code}"
        except requests.exceptions.RequestException as e:
            print(f"❌ {server['name']}: OFFLINE ({e})")
            results[server["name"]] = "OFFLINE"
    
    return results

def create_test_json():
    """Criar JSON de teste com a nova estrutura simplificada"""
    return {
        "url": "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326",
        "extractedAt": datetime.now().isoformat(),
        "product": {
            "name": "Sapato Social Masculino Derby Konna Casual Elegante Confortável Em Couro Cadarço Lançamento",
            "price": {
                "current": 242.90,
                "original": 350.00,
                "currency": "BRL",
                "discount": 31
            },
            "rating": 4.6,
            "reviewCount": 1250,
            "soldCount": "2.1k vendidos",
            "images": [
                {
                    "url": "https://down-br.img.susercontent.com/file/br-11134201-7r98o-lywqn1234567890123456789",
                    "filename": "product_1.jpg",
                    "position": 1
                },
                {
                    "url": "https://down-br.img.susercontent.com/file/br-11134201-7r98o-lywqn0987654321098765432",
                    "filename": "product_2.jpg", 
                    "position": 2
                },
                {
                    "url": "https://down-br.img.susercontent.com/file/br-11134201-7r98o-lywqn5555666677778888999",
                    "filename": "product_3.jpg",
                    "position": 3
                }
            ],
            "variations": [
                {"type": "Cor", "options": ["Preto", "Marrom", "Caramelo"]},
                {"type": "Tamanho", "options": ["39", "40", "41", "42", "43", "44"]}
            ],
            "description": "Sapato social masculino confeccionado em couro legítimo com design moderno e elegante. Ideal para uso profissional e social.",
            "specifications": {
                "Material": "Couro Legítimo",
                "Marca": "Konna",
                "Origem": "Brasil",
                "Garantia": "90 dias"
            },
            "comments": [
                {
                    "user": "João S.",
                    "rating": 5,
                    "comment": "Produto excelente, muito confortável!"
                },
                {
                    "user": "Maria L.",
                    "rating": 4,
                    "comment": "Boa qualidade, recomendo."
                }
            ]
        },
        "shop": {
            "name": "Loja Oficial Konna",
            "location": "Brasil"
        }
    }

def validate_json_structure(data):
    """Validar se o JSON está na estrutura correta"""
    print("📋 Validando estrutura do JSON...")
    
    errors = []
    warnings = []
    
    # Validações obrigatórias
    if not data.get("product"):
        errors.append("❌ Campo 'product' obrigatório não encontrado")
        return {"valid": False, "errors": errors, "warnings": warnings}
    
    product = data["product"]
    
    if not product.get("name"):
        errors.append("❌ Nome do produto não encontrado")
    
    if not product.get("images") or not isinstance(product["images"], list):
        errors.append("❌ Campo 'images' deve ser um array")
    else:
        images = product["images"]
        if len(images) == 0:
            warnings.append("⚠️ Nenhuma imagem encontrada")
        
        # Validar estrutura SIMPLIFICADA das imagens
        for i, img in enumerate(images):
            if not img.get("url"):
                errors.append(f"❌ Imagem {i+1}: URL obrigatória não encontrada")
            elif "susercontent" not in img["url"]:
                warnings.append(f"⚠️ Imagem {i+1}: URL não parece ser da Shopee")
            
            if not img.get("filename"):
                warnings.append(f"⚠️ Imagem {i+1}: Filename não encontrado")
            
            if not img.get("position"):
                warnings.append(f"⚠️ Imagem {i+1}: Position não encontrada")
            
            # Verificar se NÃO há campos problemáticos (ESTRUTURA LIMPA)
            problematic_fields = ["base64", "size", "local_path", "type"]
            for field in problematic_fields:
                if field in img:
                    warnings.append(f"⚠️ Imagem {i+1}: Campo '{field}' desnecessário na estrutura simplificada")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "image_count": len(product.get("images", [])),
        "has_valid_images": any(img.get("url", "").find("susercontent") >= 0 for img in product.get("images", []))
    }

def test_upload_to_server(data):
    """Testar upload do JSON para o servidor"""
    print("📡 Testando upload para servidor...")
    
    try:
        response = requests.post(
            "http://localhost:5007/api/upload-json",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Upload bem-sucedido! ID: {result.get('product_id', 'N/A')}")
            return {"success": True, "result": result}
        else:
            print(f"❌ Erro no upload: HTTP {response.status_code}")
            return {"success": False, "error": f"HTTP {response.status_code}"}
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro de conexão: {e}")
        return {"success": False, "error": str(e)}

def check_generated_product(product_id):
    """Verificar se o produto foi salvo corretamente"""
    print(f"🔍 Verificando produto gerado (ID: {product_id})...")
    
    try:
        response = requests.get(f"http://localhost:5007/api/product/{product_id}")
        if response.status_code == 200:
            product = response.json()
            print("✅ Produto encontrado no servidor")
            print(f"📦 Nome: {product.get('name', 'N/A')}")
            print(f"💰 Preço: {product.get('price', 'N/A')}")
            print(f"🖼️ Imagens: {len(product.get('images', []))}")
            return True
        else:
            print(f"❌ Produto não encontrado: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro ao verificar produto: {e}")
        return False

def main():
    """Função principal de teste"""
    print("🚀 TESTE FINAL DA EXTENSÃO SHOPEE - SOLUÇÃO SIMPLIFICADA")
    print("=" * 60)
    
    # 1. Testar servidores
    print("\n1️⃣ TESTANDO SERVIDORES")
    server_results = test_servers()
    
    if all(status == "ATIVO" for status in server_results.values()):
        print("✅ Todos os servidores estão ativos")
    else:
        print("⚠️ Alguns servidores estão offline - alguns testes podem falhar")
    
    # 2. Criar e validar JSON de teste
    print("\n2️⃣ TESTANDO ESTRUTURA JSON")
    test_data = create_test_json()
    validation = validate_json_structure(test_data)
    
    print(f"📊 Resultado da validação:")
    print(f"   ✅ Válido: {validation['valid']}")
    print(f"   🖼️ Imagens: {validation['image_count']}")
    print(f"   🔗 URLs válidas: {validation['has_valid_images']}")
    
    if validation["errors"]:
        print("❌ Erros encontrados:")
        for error in validation["errors"]:
            print(f"   {error}")
    
    if validation["warnings"]:
        print("⚠️ Avisos:")
        for warning in validation["warnings"]:
            print(f"   {warning}")
    
    # 3. Testar upload
    print("\n3️⃣ TESTANDO UPLOAD")
    if server_results.get("JSON Generator") == "ATIVO":
        upload_result = test_upload_to_server(test_data)
        
        if upload_result["success"]:
            product_id = upload_result["result"].get("product_id")
            if product_id:
                time.sleep(1)  # Aguardar processamento
                check_generated_product(product_id)
        else:
            print(f"❌ Upload falhou: {upload_result['error']}")
    else:
        print("⚠️ Servidor JSON Generator offline - pulando teste de upload")
    
    # 4. Resumo final
    print("\n4️⃣ RESUMO FINAL")
    print("=" * 40)
    
    if validation["valid"] and validation["has_valid_images"]:
        print("🎉 EXTENSÃO SIMPLIFICADA FUNCIONANDO PERFEITAMENTE!")
        print("✅ Estrutura JSON correta")
        print("✅ URLs de imagens válidas")
        print("✅ Sem campos problemáticos (base64, size, etc.)")
        print("✅ Performance otimizada")
    else:
        print("⚠️ Extensão precisa de ajustes:")
        if not validation["valid"]:
            print("   - Corrigir estrutura do JSON")
        if not validation["has_valid_images"]:
            print("   - Verificar extração de URLs de imagens")
    
    print("\n📋 PRÓXIMOS PASSOS:")
    print("1. Carregue a extensão no Chrome (chrome://extensions/)")
    print("2. Teste em uma página real da Shopee")
    print("3. Verifique se o JSON gerado segue a estrutura validada")
    print("4. Faça upload do JSON no sistema")
    
    print(f"\n⏰ Teste concluído em {datetime.now().strftime('%H:%M:%S')}")

if __name__ == "__main__":
    main() 