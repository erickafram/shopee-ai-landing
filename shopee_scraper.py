#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shopee Product Scraper
Extrai dados reais de produtos da Shopee usando web scraping
"""

import requests
import json
import re
import time
from bs4 import BeautifulSoup
from urllib.parse import unquote, parse_qs, urlparse
import sys
import argparse
from typing import Dict, List, Optional

class ShopeeExtractor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none'
        })

    def extract_product_data(self, url: str) -> Dict:
        """Extrai dados completos do produto da Shopee"""
        print(f"🔍 Extraindo dados de: {url}")
        
        try:
            # 1. Tentar extrair via API da Shopee
            api_data = self._extract_via_api(url)
            if api_data and api_data.get('name'):
                print("✅ Dados extraídos via API da Shopee")
                return api_data
            
            # 2. Fallback: scraping da página HTML
            print("🌐 Tentando scraping da página HTML...")
            html_data = self._extract_via_html(url)
            if html_data and html_data.get('name'):
                print("✅ Dados extraídos via HTML scraping")
                return html_data
            
            # 3. Último recurso: dados básicos da URL
            print("🔧 Usando extração básica da URL...")
            return self._extract_from_url_pattern(url)
            
        except Exception as e:
            print(f"❌ Erro na extração: {e}")
            return self._extract_from_url_pattern(url)

    def _extract_via_api(self, url: str) -> Optional[Dict]:
        """Extrai dados via API interna da Shopee"""
        try:
            # Extrair IDs da URL
            url_match = re.search(r'i\.(\d+)\.(\d+)', url)
            if not url_match:
                return None
            
            shop_id, item_id = url_match.groups()
            
            # URL da API da Shopee
            api_url = f"https://shopee.com.br/api/v4/item/get"
            params = {
                'itemid': item_id,
                'shopid': shop_id
            }
            
            print(f"📡 Chamando API: shop_id={shop_id}, item_id={item_id}")
            
            response = self.session.get(api_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_api_response(data, url)
            
        except Exception as e:
            print(f"⚠️ Erro na API: {e}")
            
        return None

    def _extract_via_html(self, url: str) -> Optional[Dict]:
        """Extrai dados fazendo scraping da página HTML"""
        try:
            print("🌐 Acessando página da Shopee...")
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Buscar por dados JSON embebidos na página
            scripts = soup.find_all('script')
            
            for script in scripts:
                script_content = script.get_text()
                if script_content and ('window.__INITIAL_STATE__' in script_content or '"item":' in script_content):
                    try:
                        # Extrair JSON do script
                        
                        # Diferentes padrões de JSON
                        patterns = [
                            r'window\.__INITIAL_STATE__\s*=\s*({.+?});',
                            r'window\.APP_CONTEXT\s*=\s*({.+?});',
                            r'"item"\s*:\s*({.+?})',
                        ]
                        
                        for pattern in patterns:
                            match = re.search(pattern, script_content, re.DOTALL)
                            if match:
                                json_str = match.group(1)
                                try:
                                    json_data = json.loads(json_str)
                                    parsed = self._parse_html_json(json_data, url)
                                    if parsed.get('name'):
                                        return parsed
                                except json.JSONDecodeError:
                                    continue
                                    
                    except Exception as e:
                        continue
            
            # Fallback: extração direta do HTML
            return self._parse_html_direct(soup, url)
            
        except Exception as e:
            print(f"⚠️ Erro no HTML scraping: {e}")
            
        return None

    def _parse_api_response(self, data: Dict, url: str) -> Dict:
        """Parse da resposta da API da Shopee"""
        try:
            item = data.get('data', {}) or data.get('item', {})
            
            if not item:
                return {}
            
            # Informações básicas
            name = item.get('name', 'Produto não encontrado')
            
            # Preços (Shopee usa preços em centavos * 100000)
            price_min = item.get('price_min', 0)
            price_max = item.get('price_max', 0)
            price_before_discount = item.get('price_before_discount', 0)
            
            current_price = self._format_price(price_min)
            original_price = self._format_price(price_before_discount) if price_before_discount > price_min else None
            
            # Imagens
            images = []
            if item.get('images'):
                images = [f"https://cf.shopee.com.br/file/{img}" for img in item['images']]
            
            # Variações (cores, tamanhos, etc.)
            variations = self._extract_variations(item.get('models', []))
            
            # Especificações
            specifications = {}
            if item.get('attributes'):
                for attr in item['attributes']:
                    if attr.get('name') and attr.get('value'):
                        specifications[attr['name']] = attr['value']
            
            # Rating e reviews
            rating_info = item.get('item_rating', {})
            rating = rating_info.get('rating_star')
            reviews_count = None
            if rating_info.get('rating_count'):
                reviews_count = rating_info['rating_count'][0] if isinstance(rating_info['rating_count'], list) else rating_info['rating_count']
            
            # Categoria
            category = "Produto Shopee"
            if item.get('categories') and len(item['categories']) > 0:
                category = item['categories'][0].get('display_name', category)
            
            return {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images,
                'description': item.get('description', 'Descrição não disponível'),
                'specifications': specifications,
                'category': category,
                'rating': rating,
                'reviews': reviews_count,
                'url': url,
                'variations': variations
            }
            
        except Exception as e:
            print(f"⚠️ Erro no parse da API: {e}")
            return {}

    def _parse_html_json(self, data: Dict, url: str) -> Dict:
        """Parse de dados JSON encontrados no HTML"""
        try:
            # Navegar pela estrutura JSON para encontrar dados do produto
            item = None
            
            # Possíveis caminhos para os dados do produto
            paths = [
                ['item'],
                ['data', 'item'],
                ['props', 'pageProps', 'item'],
                ['initialState', 'product', 'item']
            ]
            
            for path in paths:
                current = data
                for key in path:
                    if isinstance(current, dict) and key in current:
                        current = current[key]
                    else:
                        current = None
                        break
                
                if current and isinstance(current, dict) and current.get('name'):
                    item = current
                    break
            
            if item:
                return self._parse_api_response({'data': item}, url)
            
        except Exception as e:
            print(f"⚠️ Erro no parse JSON: {e}")
            
        return {}

    def _parse_html_direct(self, soup: BeautifulSoup, url: str) -> Dict:
        """Parse direto do HTML usando seletores CSS"""
        try:
            print("🔍 Fazendo parse direto do HTML...")
            
            # Nome do produto
            name_selectors = [
                'h1[data-testid="product-name"]',
                'h1.product-name',
                'h1',
                '.product-title h1',
                '[data-testid="product-title"]'
            ]
            
            name = "Produto não encontrado"
            for selector in name_selectors:
                element = soup.select_one(selector)
                if element and element.get_text(strip=True):
                    name = element.get_text(strip=True)
                    break
            
            # Preços
            price_selectors = [
                '[data-testid="product-price"]',
                '.product-price',
                '.current-price',
                '[class*="price"]'
            ]
            
            current_price = "R$ 0,00"
            for selector in price_selectors:
                element = soup.select_one(selector)
                if element:
                    price_text = element.get_text(strip=True)
                    if 'R$' in price_text:
                        current_price = price_text
                        break
            
            # Imagens
            images = []
            img_selectors = [
                'img[data-testid="product-image"]',
                '.product-image img',
                '.gallery img',
                'img[src*="shopee"]'
            ]
            
            for selector in img_selectors:
                imgs = soup.select(selector)
                for img in imgs[:5]:  # Máximo 5 imagens
                    src = img.get('src') or img.get('data-src')
                    if src and 'shopee' in src:
                        images.append(src)
                if images:
                    break
            
            if not images:
                images = ["https://via.placeholder.com/400x400?text=Produto+Shopee"]
            
            return {
                'name': name,
                'price': current_price,
                'originalPrice': None,
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
            print(f"⚠️ Erro no parse direto: {e}")
            return {}

    def _extract_from_url_pattern(self, url: str) -> Dict:
        """Extração baseada no padrão da URL como fallback"""
        print("🔧 Usando extração baseada na URL...")
        
        # Extrair nome do produto da URL
        url_parts = url.split('/')
        product_slug = None
        
        for part in url_parts:
            if '-i.' in part:
                product_slug = part.split('-i.')[0]
                break
        
        if not product_slug:
            for part in url_parts:
                if '-' in part and len(part) > 10:
                    product_slug = part
                    break
        
        name = "Produto Shopee"
        if product_slug:
            name = product_slug.replace('-', ' ').title()
        
        return {
            'name': name,
            'price': 'R$ 0,00',
            'originalPrice': None,
            'images': ["https://via.placeholder.com/400x400?text=Produto+Shopee"],
            'description': 'Para obter informações completas, acesse diretamente o link do produto.',
            'specifications': {
                'Status': 'Dados em extração',
                'Origem': 'Shopee Brasil'
            },
            'category': 'Produto Shopee',
            'rating': None,
            'reviews': None,
            'url': url,
            'variations': {}
        }

    def _extract_variations(self, models: List[Dict]) -> Dict:
        """Extrai variações do produto (cores, tamanhos, etc.)"""
        variations = {}
        
        if not models:
            return variations
        
        colors = set()
        sizes = set()
        
        for model in models:
            if model.get('name'):
                name = model['name'].lower()
                
                # Detectar cores
                color_keywords = ['azul', 'vermelho', 'rosa', 'roxo', 'preto', 'branco', 'verde', 'amarelo', 'cinza', 'marrom']
                for color in color_keywords:
                    if color in name:
                        colors.add(model['name'])
                        break
                
                # Detectar tamanhos
                size_keywords = ['p', 'm', 'g', 'gg', 'pp', 'xg', '36', '37', '38', '39', '40', '41', '42', '43', '44']
                for size in size_keywords:
                    if size in name or name.isdigit():
                        sizes.add(model['name'])
                        break
        
        if colors:
            variations['colors'] = list(colors)
        if sizes:
            variations['sizes'] = list(sizes)
        
        return variations

    def _format_price(self, price: int) -> str:
        """Formatar preço da Shopee para BRL"""
        if not price or price == 0:
            return "R$ 0,00"
        
        # Shopee usa preços em centavos * 100000
        real_price = price / 100000
        
        return f"R$ {real_price:.2f}".replace('.', ',')


def main():
    parser = argparse.ArgumentParser(description='Extrator de produtos da Shopee')
    parser.add_argument('url', help='URL do produto da Shopee')
    parser.add_argument('--output', '-o', help='Arquivo de saída JSON (opcional)')
    
    args = parser.parse_args()
    
    extractor = ShopeeExtractor()
    product_data = extractor.extract_product_data(args.url)
    
    # Output em JSON
    json_output = json.dumps(product_data, ensure_ascii=False, indent=2)
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(json_output)
        print(f"📁 Dados salvos em: {args.output}")
    else:
        print("\n📋 DADOS EXTRAÍDOS:")
        print(json_output)


if __name__ == '__main__':
    main() 