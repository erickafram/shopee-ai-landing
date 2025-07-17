#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shopee Real Images & Reviews Scraper
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
import base64
from io import BytesIO
from PIL import Image
import os

# Tentar importar selenium com fallback
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, WebDriverException
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("⚠️ Selenium não disponível. Usando apenas métodos HTTP.")

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
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        }
        self.session.headers.update(headers)
    
    def download_image(self, url: str, filename: str) -> str:
        """Baixar imagem e salvar localmente"""
        try:
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
                        for i, img_id in enumerate(item_data['images']):
                            img_url = f"https://cf.shopee.com.br/file/{img_id}"
                            images.append(img_url)
                            
                            # Baixar imagem
                            filename = f"{item_id}_image_{i+1}.jpg"
                            local_path = self.download_image(img_url, filename)
                            if local_path:
                                images[-1] = {
                                    'url': img_url,
                                    'local_path': local_path
                                }
                    
                    # Extrair informações básicas
                    product_data = {
                        'name': item_data.get('name', ''),
                        'price': item_data.get('price', 0) / 100000,  # Shopee usa centavos * 1000
                        'original_price': item_data.get('price_before_discount', 0) / 100000,
                        'rating': item_data.get('item_rating', {}).get('rating_star', 0),
                        'sold': item_data.get('sold', 0),
                        'stock': item_data.get('stock', 0),
                        'images': images,
                        'description': item_data.get('description', ''),
                        'shop_id': shop_id,
                        'item_id': item_id
                    }
                    
                    logger.info(f"✅ Dados extraídos via API com {len(images)} imagens")
                    return product_data
                    
        except Exception as e:
            logger.error(f"❌ Erro na API: {e}")
        
        return None
    
    def extract_with_selenium(self, url: str) -> Dict:
        """Extrair dados usando Selenium com Chrome real"""
        if not SELENIUM_AVAILABLE:
            return None
            
        driver = None
        try:
            # Configurar Chrome options
            chrome_options = Options()
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            chrome_options.add_argument('--disable-extensions')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36')
            
            # Criar driver
            driver = webdriver.Chrome(options=chrome_options)
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            logger.info(f"🌐 Carregando página: {url}")
            driver.get(url)
            
            # Aguardar carregamento
            time.sleep(5)
            
            # Verificar se não foi redirecionado para login
            if "login" in driver.current_url.lower():
                logger.warning("❌ Redirecionado para login")
                return None
            
            product_data = {
                'images': [],
                'reviews': [],
                'name': '',
                'price': '',
                'rating': 0
            }
            
            # Extrair nome do produto
            try:
                name_element = driver.find_element(By.CSS_SELECTOR, '[data-testid="pdp-product-title"], .pdp-product-title, h1')
                product_data['name'] = name_element.text.strip()
                logger.info(f"📝 Nome: {product_data['name']}")
            except:
                pass
            
            # Extrair preço
            try:
                price_element = driver.find_element(By.CSS_SELECTOR, '.notranslate, [class*="price"], .price')
                product_data['price'] = price_element.text.strip()
                logger.info(f"💰 Preço: {product_data['price']}")
            except:
                pass
            
            # Extrair imagens do produto
            try:
                # Tentar diferentes seletores para imagens
                img_selectors = [
                    'img[class*="product"]',
                    '.product-images img',
                    '[data-testid*="image"] img',
                    '.pdp-product-detail img',
                    'img[src*="shopee"]'
                ]
                
                images_found = set()
                for selector in img_selectors:
                    try:
                        images = driver.find_elements(By.CSS_SELECTOR, selector)
                        for img in images:
                            src = img.get_attribute('src')
                            if src and 'shopee' in src and src not in images_found:
                                images_found.add(src)
                                
                                # Baixar imagem
                                filename = f"selenium_{len(product_data['images'])+1}.jpg"
                                local_path = self.download_image(src, filename)
                                
                                product_data['images'].append({
                                    'url': src,
                                    'local_path': local_path
                                })
                    except:
                        continue
                
                logger.info(f"🖼️ Encontradas {len(product_data['images'])} imagens")
                
            except Exception as e:
                logger.error(f"❌ Erro ao extrair imagens: {e}")
            
            # Tentar navegar para comentários
            try:
                # Procurar botão de avaliações/comentários
                review_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'Avaliações') or contains(text(), 'Reviews') or contains(text(), 'Comentários')]")
                if review_buttons:
                    driver.execute_script("arguments[0].click();", review_buttons[0])
                    time.sleep(3)
                
                # Extrair comentários
                review_selectors = [
                    '[class*="review"]',
                    '[class*="comment"]',
                    '[data-testid*="review"]',
                    '.shopee-product-rating'
                ]
                
                for selector in review_selectors:
                    try:
                        reviews = driver.find_elements(By.CSS_SELECTOR, selector)
                        for review in reviews[:10]:  # Limitar a 10 reviews
                            text = review.text.strip()
                            if text and len(text) > 10:
                                product_data['reviews'].append(text)
                    except:
                        continue
                
                logger.info(f"💬 Encontrados {len(product_data['reviews'])} comentários")
                
            except Exception as e:
                logger.error(f"❌ Erro ao extrair comentários: {e}")
            
            return product_data if product_data['images'] or product_data['reviews'] else None
            
        except Exception as e:
            logger.error(f"❌ Erro no Selenium: {e}")
            return None
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass
    
    def extract_real_data(self, url: str) -> Dict:
        """Método principal para extrair dados reais"""
        logger.info(f"🔍 Extraindo dados REAIS de: {url}")
        
        # Estratégia 1: API da Shopee
        logger.info("📡 Tentativa 1: API da Shopee")
        api_data = self.extract_with_api(url)
        if api_data and api_data.get('images'):
            logger.info("✅ Sucesso via API!")
            return api_data
        
        # Estratégia 2: Selenium
        if SELENIUM_AVAILABLE:
            logger.info("🌐 Tentativa 2: Selenium")
            selenium_data = self.extract_with_selenium(url)
            if selenium_data and (selenium_data.get('images') or selenium_data.get('reviews')):
                logger.info("✅ Sucesso via Selenium!")
                return selenium_data
        
        # Estratégia 3: Scraping HTML direto
        logger.info("📄 Tentativa 3: HTML direto")
        html_data = self.extract_with_html(url)
        if html_data:
            logger.info("✅ Sucesso via HTML!")
            return html_data
        
        logger.warning("❌ Não foi possível extrair dados reais")
        return None
    
    def extract_with_html(self, url: str) -> Dict:
        """Extrair dados fazendo parse do HTML diretamente"""
        try:
            response = self.session.get(url, timeout=15)
            if response.status_code != 200:
                return None
            
            html = response.text
            
            # Procurar por dados JSON no HTML
            json_pattern = r'window\.__INITIAL_STATE__\s*=\s*({.+?});'
            match = re.search(json_pattern, html)
            
            if match:
                try:
                    data = json.loads(match.group(1))
                    
                    # Navegar pela estrutura JSON para encontrar dados do produto
                    product_data = {
                        'images': [],
                        'reviews': [],
                        'name': '',
                        'price': ''
                    }
                    
                    # Procurar imagens no JSON
                    def find_images(obj, images_set):
                        if isinstance(obj, dict):
                            for key, value in obj.items():
                                if key in ['images', 'image', 'photos'] and isinstance(value, list):
                                    for img in value:
                                        if isinstance(img, str) and 'shopee' in img:
                                            images_set.add(img)
                                        elif isinstance(img, dict) and 'url' in img:
                                            images_set.add(img['url'])
                                else:
                                    find_images(value, images_set)
                        elif isinstance(obj, list):
                            for item in obj:
                                find_images(item, images_set)
                    
                    images_set = set()
                    find_images(data, images_set)
                    
                    # Baixar imagens encontradas
                    for i, img_url in enumerate(images_set):
                        if img_url.startswith('//'):
                            img_url = 'https:' + img_url
                        elif not img_url.startswith('http'):
                            img_url = 'https://cf.shopee.com.br/file/' + img_url
                        
                        filename = f"html_{i+1}.jpg"
                        local_path = self.download_image(img_url, filename)
                        
                        product_data['images'].append({
                            'url': img_url,
                            'local_path': local_path
                        })
                    
                    if product_data['images']:
                        logger.info(f"🖼️ Encontradas {len(product_data['images'])} imagens via HTML")
                        return product_data
                    
                except Exception as e:
                    logger.error(f"❌ Erro ao processar JSON: {e}")
            
            # Fallback: procurar imagens diretamente no HTML
            img_pattern = r'<img[^>]+src=["\']([^"\']*shopee[^"\']*)["\']'
            img_matches = re.findall(img_pattern, html)
            
            if img_matches:
                product_data = {'images': [], 'reviews': []}
                
                for i, img_url in enumerate(set(img_matches)):
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    
                    filename = f"html_fallback_{i+1}.jpg"
                    local_path = self.download_image(img_url, filename)
                    
                    product_data['images'].append({
                        'url': img_url,
                        'local_path': local_path
                    })
                
                if product_data['images']:
                    logger.info(f"🖼️ Encontradas {len(product_data['images'])} imagens via HTML fallback")
                    return product_data
            
        except Exception as e:
            logger.error(f"❌ Erro no HTML scraping: {e}")
        
        return None

# Instância global do scraper
scraper = ShopeeRealImagesScraper()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Shopee Real Images Scraper ativo"})

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
            }), 500
            
    except Exception as e:
        logger.error(f"❌ Erro no endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🖼️ Iniciando servidor de extração de IMAGENS REAIS...")
    print("📡 Servidor rodando em: http://localhost:5001")
    print("🔗 Endpoint de extração: http://localhost:5001/api/extract-real")
    print("🎯 Recursos: Imagens reais + Comentários reais")
    
    app.run(host='0.0.0.0', port=5001, debug=False) 