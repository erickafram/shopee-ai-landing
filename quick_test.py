#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json

def test_quick():
    print("🧪 Teste rápido do sistema...")
    
    url = "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
    
    try:
        response = requests.post(
            "http://localhost:5000/api/extract",
            json={"url": url},
            timeout=15
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                product = data['data']
                print(f"Nome: {product.get('name', 'N/A')}")
                print(f"Preço: {product.get('price', 'N/A')}")
                print(f"É real: {product.get('is_real_data', 'N/A')}")
                print(f"Fonte: {product.get('data_source', 'N/A')}")
                
                real_images = product.get('real_images', [])
                print(f"Imagens reais: {len(real_images)}")
            else:
                print(f"Erro: {data.get('error', 'N/A')}")
        else:
            print("Erro HTTP")
            
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == '__main__':
    test_quick() 