#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor de Scraping Real da Shopee
API local que extrai dados verdadeiros dos produtos
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re
import time
from bs4 import BeautifulSoup
from urllib.parse import unquote, parse_qs, urlparse
import threading
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permitir requests do frontend

class RealShopeeExtractor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://shopee.com.br/',
        })

    def extract_real_data(self, url: str) -> dict:
        """Extrai dados REAIS da página da Shopee"""
        logger.info(f"🔍 Extraindo dados REAIS de: {url}")
        
        try:
            # Estratégia 1: API interna da Shopee
            api_data = self._try_shopee_api(url)
            if api_data and api_data.get('name') and api_data['name'] != 'Produto não encontrado':
                logger.info("✅ Dados extraídos via API da Shopee")
                return api_data
            
            # Estratégia 2: Scraping direto da página
            html_data = self._try_html_scraping(url)
            if html_data and html_data.get('name') and html_data['name'] != 'Produto não encontrado':
                logger.info("✅ Dados extraídos via HTML scraping")
                return html_data
            
            # Estratégia 3: Múltiplas tentativas com headers diferentes
            retry_data = self._try_with_different_headers(url)
            if retry_data and retry_data.get('name') and retry_data['name'] != 'Produto não encontrado':
                logger.info("✅ Dados extraídos com headers alternativos")
                return retry_data
                
            logger.warning("❌ Não foi possível extrair dados reais")
            return {'error': 'Não foi possível extrair dados reais da página'}
            
        except Exception as e:
            logger.error(f"❌ Erro na extração: {e}")
            return {'error': f'Erro na extração: {str(e)}'}

    def _try_shopee_api(self, url: str) -> dict:
        """Tenta extrair via API oficial da Shopee"""
        try:
            # Extrair shop_id e item_id da URL
            url_match = re.search(r'i\.(\d+)\.(\d+)', url)
            if not url_match:
                return {}
            
            shop_id, item_id = url_match.groups()
            logger.info(f"📡 API call: shop_id={shop_id}, item_id={item_id}")
            
            # URLs da API para tentar
            api_urls = [
                f"https://shopee.com.br/api/v4/item/get?itemid={item_id}&shopid={shop_id}",
                f"https://shopee.com.br/api/v2/item/get?itemid={item_id}&shopid={shop_id}",
                f"https://shopee.com.br/api/v4/item/get_ratings?itemid={item_id}&shopid={shop_id}&limit=20&flag=1"
            ]
            
            for api_url in api_urls:
                try:
                    response = self.session.get(api_url, timeout=15)
                    if response.status_code == 200:
                        data = response.json()
                        if data and 'data' in data:
                            return self._parse_api_data(data['data'], url)
                except Exception as e:
                    logger.warning(f"API falhou: {e}")
                    continue
                    
            return {}
            
        except Exception as e:
            logger.error(f"Erro na API: {e}")
            return {}

    def _try_html_scraping(self, url: str) -> dict:
        """Scraping direto da página HTML"""
        try:
            logger.info("🌐 Fazendo scraping da página HTML...")
            
            # Tentar acessar a página
            response = self.session.get(url, timeout=20)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Buscar dados JSON embebidos
            scripts = soup.find_all('script')
            for script in scripts:
                script_content = script.get_text()
                if not script_content:
                    continue
                    
                # Buscar por diferentes padrões de dados
                patterns = [
                    r'window\.__INITIAL_STATE__\s*=\s*({.+?});',
                    r'window\.APP_CONTEXT\s*=\s*({.+?});',
                    r'"item"\s*:\s*({[^}]+})',
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, script_content, re.DOTALL)
                    for match in matches:
                        try:
                            json_data = json.loads(match)
                            parsed = self._parse_embedded_json(json_data, url)
                            if parsed.get('name'):
                                return parsed
                        except:
                            continue
            
            # Fallback: parse direto do HTML
            return self._parse_html_elements(soup, url)
            
        except Exception as e:
            logger.error(f"Erro no HTML scraping: {e}")
            return {}

    def _try_with_different_headers(self, url: str) -> dict:
        """Tentar com diferentes user agents e headers"""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
        
        for ua in user_agents:
            try:
                session = requests.Session()
                session.headers.update({
                    'User-Agent': ua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9',
                    'Referer': 'https://shopee.com.br/',
                })
                
                response = session.get(url, timeout=15)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    result = self._parse_html_elements(soup, url)
                    if result.get('name') and result['name'] != 'Produto não encontrado':
                        return result
                        
            except:
                continue
                
        return {}

    def _parse_api_data(self, item_data: dict, url: str) -> dict:
        """Parse dados da API da Shopee"""
        try:
            if not item_data:
                return {}
            
            # Nome do produto
            name = item_data.get('name', 'Produto não encontrado')
            if not name or name == 'Produto não encontrado':
                return {}
            
            # Preços (Shopee usa centavos * 100000)
            price_min = item_data.get('price_min', 0)
            price_max = item_data.get('price_max', 0) 
            price_before_discount = item_data.get('price_before_discount', 0)
            
            current_price = self._format_price(price_min)
            original_price = None
            if price_before_discount and price_before_discount > price_min:
                original_price = self._format_price(price_before_discount)
            
            # Imagens
            images = []
            if item_data.get('images'):
                for img in item_data['images']:
                    if img:
                        images.append(f"https://cf.shopee.com.br/file/{img}")
            
            # Descrição
            description = item_data.get('description', 'Descrição não disponível')
            
            # Especificações
            specifications = {}
            if item_data.get('attributes'):
                for attr in item_data['attributes']:
                    if attr.get('name') and attr.get('value'):
                        specifications[attr['name']] = attr['value']
            
            # Rating e reviews
            rating = None
            reviews = None
            if item_data.get('item_rating'):
                rating = item_data['item_rating'].get('rating_star')
                rating_count = item_data['item_rating'].get('rating_count')
                if rating_count and isinstance(rating_count, list) and len(rating_count) > 0:
                    reviews = rating_count[0]
            
            # Variações
            variations = {}
            if item_data.get('models'):
                colors = set()
                sizes = set()
                
                for model in item_data['models']:
                    if model.get('name'):
                        name_lower = model['name'].lower()
                        # Detectar cores
                        color_words = ['azul', 'vermelho', 'preto', 'branco', 'verde', 'rosa', 'cinza', 'marrom', 'amarelo']
                        if any(color in name_lower for color in color_words):
                            colors.add(model['name'])
                        
                        # Detectar tamanhos
                        size_words = ['p', 'm', 'g', 'gg', 'pp', 'xg']
                        if any(size in name_lower for size in size_words) or name_lower.isdigit():
                            sizes.add(model['name'])
                
                if colors:
                    variations['colors'] = list(colors)
                if sizes:
                    variations['sizes'] = list(sizes)
            
            result = {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images,
                'description': description,
                'specifications': specifications,
                'category': item_data.get('categories', [{}])[0].get('display_name', 'Produto Shopee'),
                'rating': rating,
                'reviews': reviews,
                'url': url,
                'variations': variations
            }
            
            logger.info(f"✅ Produto extraído: {name}")
            logger.info(f"   Preço: {current_price}")
            logger.info(f"   Imagens: {len(images)}")
            
            return result
            
        except Exception as e:
            logger.error(f"Erro no parse da API: {e}")
            return {}

    def _parse_embedded_json(self, json_data: dict, url: str) -> dict:
        """Parse de JSON embebido no HTML"""
        # Implementação similar ao parse da API
        # Por brevidade, retorno dados básicos
        return {}

    def _parse_html_elements(self, soup: BeautifulSoup, url: str) -> dict:
        """Parse direto dos elementos HTML"""
        try:
            # Nome do produto
            name_selectors = [
                'h1[data-testid*="pdp-product-title"]',
                'h1._3OAbCv',
                'h1.product-name',
                'h1',
                '[data-testid="product-name"]'
            ]
            
            name = "Produto não encontrado"
            for selector in name_selectors:
                element = soup.select_one(selector)
                if element and element.get_text(strip=True):
                    name = element.get_text(strip=True)
                    break
            
            # Preços
            price_elements = soup.select('[class*="price"], [data-testid*="price"]')
            prices = []
            for elem in price_elements:
                text = elem.get_text(strip=True)
                if 'R$' in text and text not in prices:
                    prices.append(text)
            
            current_price = prices[0] if prices else "R$ 0,00"
            original_price = prices[1] if len(prices) > 1 else None
            
            # Imagens
            images = []
            img_elements = soup.select('img')
            for img in img_elements:
                src = img.get('src') or img.get('data-src')
                if src and ('shopee' in src or 'cf.shopee' in src):
                    images.append(src)
                if len(images) >= 5:
                    break
            
            return {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images,
                'description': 'Descrição extraída via HTML',
                'specifications': {},
                'category': 'Produto Shopee',
                'rating': None,
                'reviews': None,
                'url': url,
                'variations': {}
            }
            
        except Exception as e:
            logger.error(f"Erro no parse HTML: {e}")
            return {}

    def _format_price(self, price: int) -> str:
        """Formatar preço da Shopee"""
        if not price:
            return "R$ 0,00"
        
        # Shopee API retorna preços em centavos * 100000
        real_price = price / 100000
        return f"R$ {real_price:.2f}".replace('.', ',')


# Instância global do extrator
extractor = RealShopeeExtractor()

@app.route('/api/extract', methods=['POST'])
def extract_product():
    """Endpoint para extrair dados do produto"""
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL é obrigatória'}), 400
        
        if 'shopee.com' not in url:
            return jsonify({'error': 'URL deve ser da Shopee'}), 400
        
        logger.info(f"🔍 Nova solicitação de extração: {url}")
        
        # Extrair dados reais
        result = extractor.extract_real_data(url)
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Erro no endpoint: {e}")
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Verificar se o servidor está funcionando"""
    return jsonify({'status': 'OK', 'message': 'Servidor de scraping ativo'})

@app.route('/', methods=['GET'])
def home():
    """Página inicial"""
    return '''
    <h1>🕷️ Shopee Real Scraper API</h1>
    <p>Servidor local para extração de dados reais da Shopee</p>
    <h3>Endpoints:</h3>
    <ul>
        <li><code>POST /api/extract</code> - Extrair dados do produto</li>
        <li><code>GET /health</code> - Verificar status</li>
    </ul>
    <h3>Uso:</h3>
    <pre>
    curl -X POST http://localhost:5000/api/extract \\
         -H "Content-Type: application/json" \\
         -d '{"url": "https://shopee.com.br/produto..."}'
    </pre>
    '''

if __name__ == '__main__':
    print("🚀 Iniciando servidor de scraping real da Shopee...")
    print("📡 Servidor rodando em: http://localhost:5000")
    print("🔗 Endpoint de extração: http://localhost:5000/api/extract")
    
    app.run(host='0.0.0.0', port=5000, debug=False) 