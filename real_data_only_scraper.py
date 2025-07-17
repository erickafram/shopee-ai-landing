#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
REAL DATA ONLY SCRAPER - APENAS DADOS REAIS DA SHOPEE
Não retorna NADA fictício, apenas dados reais extraídos
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re
import time
import logging
from typing import Dict, Optional
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class RealDataOnlyScraper:
    def __init__(self):
        self.session = requests.Session()
        self._setup_session()
        
        if not os.path.exists("real_images"):
            os.makedirs("real_images")
    
    def _setup_session(self):
        """Headers para parecer navegador real"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        self.session.headers.update(headers)
    
    def download_image(self, url: str, filename: str) -> Optional[str]:
        """Baixar imagem real"""
        try:
            if not url.startswith('http'):
                if url.startswith('//'):
                    url = 'https:' + url
                else:
                    url = f'https://cf.shopee.com.br/file/{url}'
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                filepath = os.path.join("real_images", filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                logger.info(f"🖼️ Imagem real baixada: {filepath}")
                return filepath
        except Exception as e:
            logger.error(f"❌ Erro ao baixar imagem: {e}")
        return None
    
    def extract_real_shopee_data(self, url: str) -> Optional[Dict]:
        """Extrair APENAS dados reais via múltiplas estratégias"""
        logger.info(f"🔍 Extraindo APENAS dados REAIS de: {url}")
        
        # Extrair IDs da URL
        match = re.search(r'i\.(\d+)\.(\d+)', url)
        if not match:
            logger.error("❌ URL inválida - não contém IDs do produto")
            return None
        
        shop_id, item_id = match.groups()
        
        # Estratégia 1: API v4 da Shopee
        api_data = self._try_api_v4(shop_id, item_id, url)
        if api_data:
            return api_data
        
        # Estratégia 2: Scraping direto da página
        page_data = self._try_page_scraping(url, item_id)
        if page_data:
            return page_data
        
        # Estratégia 3: API v2 alternativa
        api_v2_data = self._try_api_v2(shop_id, item_id)
        if api_v2_data:
            return api_v2_data
        
        logger.warning("❌ FALHA TOTAL - Nenhuma estratégia conseguiu extrair dados REAIS")
        return None
    
    def _try_api_v4(self, shop_id: str, item_id: str, referer_url: str) -> Optional[Dict]:
        """Tentar API v4 da Shopee"""
        try:
            logger.info("📡 Tentando API v4...")
            
            api_url = "https://shopee.com.br/api/v4/item/get"
            params = {
                'itemid': item_id,
                'shopid': shop_id
            }
            
            headers = {
                'referer': referer_url,
                'x-api-source': 'pc',
                'x-requested-with': 'XMLHttpRequest',
                'x-shopee-language': 'pt-BR',
                'x-csrftoken': 'undefined'
            }
            
            response = self.session.get(api_url, params=params, headers=headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('error') == 0 and data.get('item'):
                    item = data['item']
                    
                    # Extrair dados reais
                    real_data = {
                        'name': item.get('name', ''),
                        'price_min': item.get('price_min', 0) / 100000,
                        'price_max': item.get('price_max', 0) / 100000,
                        'price': item.get('price', 0) / 100000,
                        'price_before_discount': item.get('price_before_discount', 0) / 100000,
                        'discount': item.get('raw_discount', 0),
                        'rating': item.get('item_rating', {}).get('rating_star', 0),
                        'rating_count': [item.get('item_rating', {}).get('rating_count', [0, 0, 0, 0, 0, 0])],
                        'sold': item.get('sold', 0),
                        'stock': item.get('stock', 0),
                        'description': item.get('description', ''),
                        'shop_id': shop_id,
                        'item_id': item_id,
                        'images': [],
                        'reviews': [],
                        'is_real_data': True
                    }
                    
                    # Processar imagens reais
                    if item.get('images'):
                        for i, img_id in enumerate(item['images'][:8]):
                            img_url = f"https://cf.shopee.com.br/file/{img_id}"
                            filename = f"{item_id}_real_{i+1}.jpg"
                            local_path = self.download_image(img_url, filename)
                            
                            real_data['images'].append({
                                'url': img_url,
                                'local_path': local_path,
                                'is_real': True
                            })
                    
                    # Processar modelos/variações
                    if item.get('models'):
                        real_data['variations'] = []
                        for model in item['models']:
                            variation = {
                                'name': model.get('name', ''),
                                'price': model.get('price', 0) / 100000,
                                'stock': model.get('stock', 0)
                            }
                            real_data['variations'].append(variation)
                    
                    logger.info(f"✅ API v4 SUCESSO! {len(real_data['images'])} imagens reais")
                    return real_data
                else:
                    logger.warning(f"❌ API v4 retornou erro: {data.get('error', 'unknown')}")
            else:
                logger.warning(f"❌ API v4 HTTP {response.status_code}")
        
        except Exception as e:
            logger.error(f"❌ Erro na API v4: {e}")
        
        return None
    
    def _try_page_scraping(self, url: str, item_id: str) -> Optional[Dict]:
        """Scraping direto da página"""
        try:
            logger.info("🌐 Tentando scraping da página...")
            
            response = self.session.get(url, timeout=15)
            if response.status_code != 200:
                return None
            
            html = response.text
            
            # Procurar por __INITIAL_STATE__ ou dados JSON na página
            patterns = [
                r'window\.__INITIAL_STATE__\s*=\s*({.+?});',
                r'"item":\s*({[^}]+?"item_rating"[^}]+?})',
                r'"shopeeProductRating"[^{]*({[^}]+})'
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, html, re.DOTALL)
                for match in matches:
                    try:
                        if pattern == patterns[0]:  # __INITIAL_STATE__
                            state = json.loads(match)
                            
                            # Navegar pela estrutura para encontrar dados do item
                            if 'item' in state and 'item' in state['item']:
                                item_data = state['item']['item']
                                
                                real_data = {
                                    'name': item_data.get('name', ''),
                                    'price': item_data.get('price', 0) / 100000,
                                    'price_before_discount': item_data.get('price_before_discount', 0) / 100000,
                                    'rating': item_data.get('item_rating', {}).get('rating_star', 0),
                                    'sold': item_data.get('sold', 0),
                                    'images': [],
                                    'is_real_data': True
                                }
                                
                                # Extrair imagens
                                if item_data.get('images'):
                                    for i, img_id in enumerate(item_data['images'][:8]):
                                        img_url = f"https://cf.shopee.com.br/file/{img_id}"
                                        filename = f"{item_id}_page_{i+1}.jpg"
                                        local_path = self.download_image(img_url, filename)
                                        
                                        real_data['images'].append({
                                            'url': img_url,
                                            'local_path': local_path,
                                            'is_real': True
                                        })
                                
                                if real_data['name']:
                                    logger.info(f"✅ Page scraping SUCESSO! {len(real_data['images'])} imagens")
                                    return real_data
                    
                    except json.JSONDecodeError:
                        continue
            
            logger.warning("❌ Page scraping falhou - dados não encontrados")
        
        except Exception as e:
            logger.error(f"❌ Erro no page scraping: {e}")
        
        return None
    
    def _try_api_v2(self, shop_id: str, item_id: str) -> Optional[Dict]:
        """API v2 alternativa"""
        try:
            logger.info("📡 Tentando API v2...")
            
            api_url = "https://shopee.com.br/api/v2/item/get"
            params = {
                'itemid': item_id,
                'shopid': shop_id
            }
            
            response = self.session.get(api_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('item'):
                    item = data['item']
                    
                    real_data = {
                        'name': item.get('name', ''),
                        'price': item.get('price', 0) / 100000,
                        'images': [],
                        'is_real_data': True
                    }
                    
                    # Processar imagens
                    if item.get('images'):
                        for i, img_id in enumerate(item['images'][:5]):
                            img_url = f"https://cf.shopee.com.br/file/{img_id}"
                            filename = f"{item_id}_v2_{i+1}.jpg"
                            local_path = self.download_image(img_url, filename)
                            
                            real_data['images'].append({
                                'url': img_url,
                                'local_path': local_path,
                                'is_real': True
                            })
                    
                    if real_data['name']:
                        logger.info(f"✅ API v2 SUCESSO! {len(real_data['images'])} imagens")
                        return real_data
        
        except Exception as e:
            logger.error(f"❌ Erro na API v2: {e}")
        
        return None

# Instância global
scraper = RealDataOnlyScraper()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "REAL DATA ONLY - Apenas dados reais!"})

@app.route('/api/extract-real-only', methods=['POST'])
def extract_real_only():
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL obrigatória"}), 400
        
        logger.info(f"🎯 SOLICITAÇÃO REAL ONLY: {url}")
        
        result = scraper.extract_real_shopee_data(url)
        
        if result:
            logger.info("✅ DADOS REAIS EXTRAÍDOS COM SUCESSO!")
            return jsonify({
                "success": True,
                "data": result,
                "message": "APENAS dados reais extraídos - zero ficção"
            })
        else:
            logger.error("❌ FALHA TOTAL - Sem dados reais disponíveis")
            return jsonify({
                "success": False,
                "error": "Não foi possível extrair DADOS REAIS do produto. Shopee pode estar bloqueando ou produto não existe.",
                "message": "Este sistema retorna APENAS dados reais - sem fallback fictício"
            }), 404
    
    except Exception as e:
        logger.error(f"❌ Erro no endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🎯 REAL DATA ONLY SCRAPER")
    print("=" * 50)
    print("🚫 ZERO dados fictícios")
    print("✅ APENAS dados reais da Shopee")
    print("📡 Servidor: http://localhost:5002")
    print("🔗 Endpoint: /api/extract-real-only")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5002, debug=False) 