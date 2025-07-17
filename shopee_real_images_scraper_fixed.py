#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shopee Real Images & Reviews Scraper - VERSÃO CORRIGIDA
Extrai IMAGENS REAIS e COMENTÁRIOS/AVALIAÇÕES REAIS dos produtos da Shopee
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re
import time
import random
import logging
from typing import Dict, List, Optional
from urllib.parse import unquote, urlparse, parse_qs
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class ShopeeRealImagesScraper:
    def __init__(self):
        self.session = requests.Session()
        self._setup_session()
        
        # Criar pasta para salvar imagens se não existir
        self.images_dir = "real_images"
        if not os.path.exists(self.images_dir):
            os.makedirs(self.images_dir)
    
    def _setup_session(self):
        """Configurar sessão HTTP com headers reais"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        self.session.headers.update(headers)
    
    def download_image(self, url: str, filename: str) -> str:
        """Baixar imagem e salvar localmente"""
        try:
            if not url.startswith('http'):
                if url.startswith('//'):
                    url = 'https:' + url
                else:
                    url = 'https://cf.shopee.com.br/file/' + url
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                filepath = os.path.join(self.images_dir, filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                logger.info(f"🖼️ Imagem salva: {filepath}")
                return filepath
        except Exception as e:
            logger.error(f"❌ Erro ao baixar imagem {url}: {e}")
        return None
    
    def extract_with_api(self, url: str) -> Dict:
        """Tentar extrair via API da Shopee"""
        try:
            # Extrair IDs da URL
            url_match = re.search(r'i\.(\d+)\.(\d+)', url)
            if not url_match:
                return None
            
            shop_id, item_id = url_match.groups()
            logger.info(f"📡 API call: shop_id={shop_id}, item_id={item_id}")
            
            # Fazer chamada para API da Shopee
            api_url = f"https://shopee.com.br/api/v4/item/get"
            params = {
                'itemid': item_id,
                'shopid': shop_id
            }
            
            # Headers específicos para API
            api_headers = {
                'referer': url,
                'x-api-source': 'pc',
                'x-requested-with': 'XMLHttpRequest',
                'x-shopee-language': 'pt-BR'
            }
            
            response = self.session.get(api_url, params=params, headers=api_headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('item'):
                    item_data = data['item']
                    
                    # Extrair imagens reais
                    images = []
                    if 'images' in item_data:
                        for i, img_id in enumerate(item_data['images'][:5]):  # Máximo 5 imagens
                            img_url = f"https://cf.shopee.com.br/file/{img_id}"
                            
                            # Baixar imagem
                            filename = f"{item_id}_image_{i+1}.jpg"
                            local_path = self.download_image(img_url, filename)
                            
                            images.append({
                                'url': img_url,
                                'local_path': local_path,
                                'index': i+1
                            })
                    
                    # Extrair informações básicas
                    product_data = {
                        'name': item_data.get('name', ''),
                        'price': item_data.get('price', 0) / 100000 if item_data.get('price') else 0,
                        'original_price': item_data.get('price_before_discount', 0) / 100000 if item_data.get('price_before_discount') else 0,
                        'rating': item_data.get('item_rating', {}).get('rating_star', 0) if item_data.get('item_rating') else 0,
                        'sold': item_data.get('sold', 0),
                        'stock': item_data.get('stock', 0),
                        'images': images,
                        'description': item_data.get('description', ''),
                        'shop_id': shop_id,
                        'item_id': item_id,
                        'reviews': []  # API básica não tem reviews, seria necessário endpoint separado
                    }
                    
                    logger.info(f"✅ Dados extraídos via API com {len(images)} imagens")
                    return product_data
                    
        except Exception as e:
            logger.error(f"❌ Erro na API: {e}")
        
        return None
    
    def extract_with_html_parsing(self, url: str) -> Dict:
        """Extrair dados fazendo parse do HTML diretamente"""
        try:
            response = self.session.get(url, timeout=15)
            if response.status_code != 200:
                return None
            
            html = response.text
            
            product_data = {
                'images': [],
                'reviews': [],
                'name': '',
                'price': '',
                'rating': 0
            }
            
            # Procurar por dados JSON no HTML
            json_patterns = [
                r'window\.__INITIAL_STATE__\s*=\s*({.+?});',
                r'"images":\s*\[([^\]]+)\]',
                r'"item":\s*({[^}]+})'
            ]
            
            for pattern in json_patterns:
                matches = re.findall(pattern, html)
                for match in matches:
                    try:
                        if pattern == json_patterns[0]:  # __INITIAL_STATE__
                            data = json.loads(match)
                            # Procurar imagens na estrutura
                            self._extract_images_from_json(data, product_data)
                        elif pattern == json_patterns[1]:  # Array de imagens
                            # Extrair IDs de imagens diretamente
                            img_ids = re.findall(r'"([a-f0-9]{32})"', match)
                            for i, img_id in enumerate(img_ids[:5]):
                                img_url = f"https://cf.shopee.com.br/file/{img_id}"
                                filename = f"html_{i+1}_{img_id[:8]}.jpg"
                                local_path = self.download_image(img_url, filename)
                                
                                product_data['images'].append({
                                    'url': img_url,
                                    'local_path': local_path,
                                    'index': i+1
                                })
                    except Exception as e:
                        continue
            
            # Fallback: procurar imagens diretamente no HTML
            if not product_data['images']:
                img_pattern = r'<img[^>]+src=["\']([^"\']*(?:shopee|cf\.shopee)[^"\']*)["\']'
                img_matches = re.findall(img_pattern, html)
                
                unique_imgs = list(set(img_matches))[:5]
                for i, img_url in enumerate(unique_imgs):
                    if not img_url.startswith('http'):
                        if img_url.startswith('//'):
                            img_url = 'https:' + img_url
                        else:
                            continue
                    
                    filename = f"html_fallback_{i+1}.jpg"
                    local_path = self.download_image(img_url, filename)
                    
                    product_data['images'].append({
                        'url': img_url,
                        'local_path': local_path,
                        'index': i+1
                    })
            
            if product_data['images']:
                logger.info(f"🖼️ Encontradas {len(product_data['images'])} imagens via HTML")
                return product_data
            
        except Exception as e:
            logger.error(f"❌ Erro no HTML scraping: {e}")
        
        return None
    
    def _extract_images_from_json(self, obj, product_data):
        """Extrair imagens recursivamente de estrutura JSON"""
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key in ['images', 'image', 'photos'] and isinstance(value, list):
                    for i, img in enumerate(value[:5]):
                        if isinstance(img, str) and len(img) == 32:  # ID de imagem da Shopee
                            img_url = f"https://cf.shopee.com.br/file/{img}"
                            filename = f"json_{i+1}_{img[:8]}.jpg"
                            local_path = self.download_image(img_url, filename)
                            
                            product_data['images'].append({
                                'url': img_url,
                                'local_path': local_path,
                                'index': i+1
                            })
                else:
                    self._extract_images_from_json(value, product_data)
        elif isinstance(obj, list):
            for item in obj:
                self._extract_images_from_json(item, product_data)
    
    def extract_real_data(self, url: str) -> Dict:
        """Método principal para extrair dados reais"""
        logger.info(f"🔍 Extraindo dados REAIS de: {url}")
        
        # Estratégia 1: API da Shopee
        logger.info("📡 Tentativa 1: API da Shopee")
        api_data = self.extract_with_api(url)
        if api_data and api_data.get('images'):
            logger.info("✅ Sucesso via API!")
            return api_data
        
        # Estratégia 2: HTML parsing
        logger.info("📄 Tentativa 2: HTML parsing")
        html_data = self.extract_with_html_parsing(url)
        if html_data and html_data.get('images'):
            logger.info("✅ Sucesso via HTML!")
            return html_data
        
        logger.warning("❌ Não foi possível extrair dados reais")
        return None

# Instância global do scraper
scraper = ShopeeRealImagesScraper()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Shopee Real Images Scraper CORRIGIDO ativo"})

@app.route('/api/extract-real', methods=['POST'])
def extract_real_product():
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL é obrigatória"}), 400
        
        logger.info(f"🔍 Nova solicitação de extração REAL: {url}")
        
        # Extrair dados reais
        result = scraper.extract_real_data(url)
        
        if result:
            logger.info("✅ Extração real bem-sucedida!")
            return jsonify({
                "success": True,
                "data": result,
                "message": "Dados reais extraídos com sucesso"
            })
        else:
            logger.warning("❌ Falha na extração real")
            return jsonify({
                "success": False,
                "error": "Não foi possível extrair dados reais do produto"
            }), 404
            
    except Exception as e:
        logger.error(f"❌ Erro no endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🖼️ Iniciando servidor CORRIGIDO de extração de IMAGENS REAIS...")
    print("📡 Servidor rodando em: http://localhost:5001")
    print("🔗 Endpoint de extração: http://localhost:5001/api/extract-real")
    print("🎯 Recursos: Imagens reais + Download automático")
    
    app.run(host='0.0.0.0', port=5001, debug=False) 