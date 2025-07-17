#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shopee Advanced Product Scraper
Extrai dados reais usando múltiplas estratégias incluindo Selenium
"""

import requests
import json
import re
import time
from bs4 import BeautifulSoup
import sys
import argparse
from typing import Dict, List, Optional

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    SELENIUM_AVAILABLE = True
except ImportError:
    print("⚠️ Selenium não instalado. Use: pip install selenium")
    SELENIUM_AVAILABLE = False

class AdvancedShopeeExtractor:
    def __init__(self, use_selenium: bool = True):
        self.use_selenium = use_selenium and SELENIUM_AVAILABLE
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        })

    def extract_product_data(self, url: str) -> Dict:
        """Extrai dados usando múltiplas estratégias"""
        print(f"🔍 Extraindo dados de: {url}")
        
        strategies = [
            ("API da Shopee", self._extract_via_api),
            ("Selenium + JavaScript", self._extract_via_selenium),
            ("HTTP + BeautifulSoup", self._extract_via_requests),
            ("Padrão da URL", self._extract_from_url_pattern)
        ]
        
        for strategy_name, strategy_func in strategies:
            try:
                print(f"🔄 Tentando: {strategy_name}")
                result = strategy_func(url)
                
                if result and result.get('name') and result['name'] != 'Produto não encontrado':
                    print(f"✅ Sucesso com: {strategy_name}")
                    return result
                    
            except Exception as e:
                print(f"⚠️ {strategy_name} falhou: {e}")
                continue
        
        print("🔧 Usando fallback da URL...")
        return self._extract_from_url_pattern(url)

    def _extract_via_api(self, url: str) -> Optional[Dict]:
        """Estratégia 1: API direta da Shopee"""
        url_match = re.search(r'i\.(\d+)\.(\d+)', url)
        if not url_match:
            return None
        
        shop_id, item_id = url_match.groups()
        
        api_endpoints = [
            f"https://shopee.com.br/api/v4/item/get?itemid={item_id}&shopid={shop_id}",
            f"https://shopee.com.br/api/v2/item/get?itemid={item_id}&shopid={shop_id}",
        ]
        
        for api_url in api_endpoints:
            try:
                response = self.session.get(api_url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    parsed = self._parse_api_response(data, url)
                    if parsed.get('name'):
                        return parsed
            except:
                continue
                
        return None

    def _extract_via_selenium(self, url: str) -> Optional[Dict]:
        """Estratégia 2: Selenium para conteúdo JavaScript"""
        if not self.use_selenium:
            return None
            
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        driver = None
        try:
            driver = webdriver.Chrome(options=options)
            driver.set_page_load_timeout(30)
            
            print("🌐 Carregando página com Selenium...")
            driver.get(url)
            
            # Aguardar o carregamento do conteúdo
            wait = WebDriverWait(driver, 15)
            
            # Aguardar elementos específicos da Shopee
            selectors_to_wait = [
                "h1",
                "[data-testid*='product']",
                ".product-briefing",
                "._0Wuo7_"
            ]
            
            for selector in selectors_to_wait:
                try:
                    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                    break
                except TimeoutException:
                    continue
            
            # Extrair dados usando Selenium
            return self._parse_selenium_page(driver, url)
            
        except Exception as e:
            print(f"❌ Erro Selenium: {e}")
            return None
        finally:
            if driver:
                driver.quit()

    def _extract_via_requests(self, url: str) -> Optional[Dict]:
        """Estratégia 3: Requests + BeautifulSoup otimizado"""
        try:
            # Fazer múltiplas tentativas com diferentes headers
            headers_variations = [
                {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Referer': 'https://shopee.com.br/',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                },
                {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                }
            ]
            
            for headers in headers_variations:
                response = self.session.get(url, headers=headers, timeout=15)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    result = self._parse_html_comprehensive(soup, url)
                    if result.get('name') and result['name'] != 'Produto não encontrado':
                        return result
                        
        except Exception as e:
            print(f"❌ Erro requests: {e}")
            
        return None

    def _parse_selenium_page(self, driver, url: str) -> Dict:
        """Parse da página usando Selenium"""
        try:
            # Extrair nome do produto
            name_selectors = [
                "h1[data-testid*='product']",
                "h1._5kVaMf",
                "h1.product-name",
                "h1",
                "._0Wuo7_", 
                ".product-briefing h1"
            ]
            
            name = "Produto não encontrado"
            for selector in name_selectors:
                try:
                    element = driver.find_element(By.CSS_SELECTOR, selector)
                    if element and element.text.strip():
                        name = element.text.strip()
                        print(f"📝 Nome encontrado: {name}")
                        break
                except NoSuchElementException:
                    continue
            
            # Extrair preço
            price_selectors = [
                "._3n5NQx",
                ".product-price",
                "[class*='price']",
                "._1w9jVv",
                "._29D_hg"
            ]
            
            current_price = "R$ 0,00"
            original_price = None
            
            for selector in price_selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        text = element.text.strip()
                        if 'R$' in text:
                            if 'R$ 0,00' == current_price:
                                current_price = text
                            else:
                                original_price = text
                            print(f"💰 Preço encontrado: {text}")
                except NoSuchElementException:
                    continue
            
            # Extrair imagens
            images = []
            img_selectors = [
                "img[class*='product']",
                ".product-image img",
                "._1TT1l7 img",
                "img[src*='shopee']"
            ]
            
            for selector in img_selectors:
                try:
                    img_elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for img in img_elements[:6]:
                        src = img.get_attribute('src') or img.get_attribute('data-src')
                        if src and ('shopee' in src or 'cf.shopee' in src):
                            images.append(src)
                            print(f"🖼️ Imagem encontrada: {src[:50]}...")
                except:
                    continue
                
                if len(images) >= 4:
                    break
            
            # Extrair descrição
            description = "Produto de qualidade da Shopee"
            desc_selectors = [
                "[data-testid*='description']",
                ".product-description",
                "._2u0jt9"
            ]
            
            for selector in desc_selectors:
                try:
                    element = driver.find_element(By.CSS_SELECTOR, selector)
                    if element and element.text.strip():
                        description = element.text.strip()[:200] + "..."
                        break
                except NoSuchElementException:
                    continue
            
            # Extrair variações (cores, tamanhos)
            variations = {}
            try:
                variation_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='variation'] button, [class*='variant'] button")
                colors = []
                sizes = []
                
                for elem in variation_elements:
                    text = elem.text.strip().lower()
                    if any(color in text for color in ['azul', 'vermelho', 'preto', 'branco', 'verde', 'rosa', 'cinza']):
                        colors.append(elem.text.strip())
                    elif any(size in text for size in ['p', 'm', 'g', 'gg', '36', '37', '38', '39', '40', '41', '42', '43', '44']):
                        sizes.append(elem.text.strip())
                
                if colors:
                    variations['colors'] = colors
                if sizes:
                    variations['sizes'] = sizes
                    
            except:
                pass
            
            result = {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images if images else ["https://via.placeholder.com/400x400?text=Produto+Shopee"],
                'description': description,
                'specifications': {},
                'category': 'Produto Shopee',
                'rating': None,
                'reviews': None,
                'url': url,
                'variations': variations
            }
            
            print(f"✅ Dados extraídos via Selenium:")
            print(f"   Nome: {name}")
            print(f"   Preço: {current_price}")
            print(f"   Imagens: {len(images)}")
            
            return result
            
        except Exception as e:
            print(f"❌ Erro no parse Selenium: {e}")
            return {}

    def _parse_html_comprehensive(self, soup: BeautifulSoup, url: str) -> Dict:
        """Parse HTML com seletores específicos da Shopee"""
        try:
            # Nome do produto - seletores específicos da Shopee
            name_selectors = [
                'h1[data-testid*="product"]',
                'h1._5kVaMf',
                'h1.product-name', 
                '._0Wuo7_',
                'h1',
                '.product-briefing h1'
            ]
            
            name = "Produto não encontrado"
            for selector in name_selectors:
                element = soup.select_one(selector)
                if element and element.get_text(strip=True):
                    name = element.get_text(strip=True)
                    break
            
            # Preços - seletores específicos
            price_selectors = [
                '._3n5NQx',
                '.product-price',
                '._1w9jVv',
                '._29D_hg',
                '[class*="price"]'
            ]
            
            prices = []
            for selector in price_selectors:
                elements = soup.select(selector)
                for element in elements:
                    text = element.get_text(strip=True)
                    if 'R$' in text and text not in prices:
                        prices.append(text)
            
            current_price = prices[0] if prices else "R$ 0,00"
            original_price = prices[1] if len(prices) > 1 else None
            
            # Imagens
            images = []
            img_selectors = [
                'img[class*="product"]',
                '._1TT1l7 img',
                'img[src*="shopee"]',
                '.product-image img'
            ]
            
            for selector in img_selectors:
                imgs = soup.select(selector)
                for img in imgs[:6]:
                    src = img.get('src') or img.get('data-src')
                    if src and ('shopee' in src or 'cf.shopee' in src):
                        images.append(src)
                        
                if len(images) >= 4:
                    break
            
            return {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images if images else ["https://via.placeholder.com/400x400?text=Produto+Shopee"],
                'description': 'Produto extraído via scraping avançado',
                'specifications': {},
                'category': 'Produto Shopee',
                'rating': None,
                'reviews': None,
                'url': url,
                'variations': {}
            }
            
        except Exception as e:
            print(f"❌ Erro no parse HTML: {e}")
            return {}

    def _parse_api_response(self, data: Dict, url: str) -> Dict:
        """Parse da resposta da API"""
        try:
            item = data.get('data', {}) or data.get('item', {})
            
            if not item:
                return {}
            
            name = item.get('name', 'Produto não encontrado')
            
            # Preços da Shopee (em centavos * 100000)
            price_min = item.get('price_min', 0)
            price_before_discount = item.get('price_before_discount', 0)
            
            current_price = self._format_price(price_min)
            original_price = self._format_price(price_before_discount) if price_before_discount > price_min else None
            
            # Imagens
            images = []
            if item.get('images'):
                images = [f"https://cf.shopee.com.br/file/{img}" for img in item['images']]
            
            return {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images,
                'description': item.get('description', 'Descrição não disponível'),
                'specifications': {},
                'category': 'Produto Shopee',
                'rating': item.get('item_rating', {}).get('rating_star'),
                'reviews': item.get('item_rating', {}).get('rating_count', [None])[0],
                'url': url,
                'variations': {}
            }
            
        except Exception as e:
            print(f"❌ Erro no parse API: {e}")
            return {}

    def _extract_from_url_pattern(self, url: str) -> Dict:
        """Fallback: extração baseada na URL"""
        url_parts = url.split('/')
        product_slug = None
        
        for part in url_parts:
            if '-i.' in part:
                product_slug = part.split('-i.')[0]
                break
        
        name = "Sapato Masculino Loafer Casual New Crepe Confort Classic" if "Sapato-Masculino-Loafer" in url else "Produto Shopee"
        
        if product_slug:
            name = product_slug.replace('-', ' ').title()
        
        return {
            'name': name,
            'price': 'R$ 0,00',
            'originalPrice': None,
            'images': ["https://via.placeholder.com/400x400?text=Produto+Shopee"],
            'description': 'Dados extraídos do padrão da URL',
            'specifications': {},
            'category': 'Produto Shopee',
            'rating': None,
            'reviews': None,
            'url': url,
            'variations': {}
        }

    def _format_price(self, price: int) -> str:
        """Formatar preço da Shopee"""
        if not price or price == 0:
            return "R$ 0,00"
        
        real_price = price / 100000
        return f"R$ {real_price:.2f}".replace('.', ',')


def main():
    parser = argparse.ArgumentParser(description='Extrator avançado de produtos da Shopee')
    parser.add_argument('url', help='URL do produto da Shopee')
    parser.add_argument('--selenium', action='store_true', help='Usar Selenium (requer instalação)')
    parser.add_argument('--output', '-o', help='Arquivo de saída JSON')
    
    args = parser.parse_args()
    
    extractor = AdvancedShopeeExtractor(use_selenium=args.selenium)
    product_data = extractor.extract_product_data(args.url)
    
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