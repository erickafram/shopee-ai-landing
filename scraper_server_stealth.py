#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor de Scraping STEALTH da Shopee
Usando undetected-chromedriver para contornar proteções anti-bot
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import requests
import json
import re
import time
import logging
import random
from typing import Dict, List, Optional

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class StealthShopeeExtractor:
    def __init__(self):
        self.driver = None
        self.session = requests.Session()
        self._setup_session()

    def _setup_session(self):
        """Configurar sessão HTTP com headers realistas"""
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
        })

    def _get_stealth_driver(self):
        """Criar driver Chrome stealth com undetected-chromedriver"""
        if self.driver is None:
            try:
                options = uc.ChromeOptions()
                
                # Argumentos para parecer mais humano
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')
                options.add_argument('--disable-blink-features=AutomationControlled')
                options.add_argument('--disable-extensions')
                options.add_argument('--disable-plugins-discovery')
                options.add_argument('--disable-web-security')
                options.add_argument('--allow-running-insecure-content')
                options.add_argument('--disable-features=VizDisplayCompositor')
                
                # Configurações de janela realistas
                options.add_argument('--window-size=1366,768')
                options.add_argument('--start-maximized')
                
                # Headers realistas
                options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
                
                # Criar driver stealth
                self.driver = uc.Chrome(options=options, version_main=120)
                
                # Executar JavaScript para mascarar automação
                self.driver.execute_script("""
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined,
                    });
                    
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5],
                    });
                    
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['pt-BR', 'pt', 'en-US', 'en'],
                    });
                    
                    window.chrome = {
                        runtime: {},
                    };
                """)
                
                logger.info("✅ Driver Chrome stealth criado com sucesso")
                
            except Exception as e:
                logger.error(f"❌ Erro ao criar driver stealth: {e}")
                self.driver = None
                raise
                
        return self.driver

    def extract_real_data(self, url: str) -> dict:
        """Extrai dados REAIS usando múltiplas estratégias stealth"""
        logger.info(f"🕵️ Extraindo dados STEALTH de: {url}")
        
        try:
            # Estratégia 1: Undetected Chrome (mais eficaz)
            data = self._extract_with_stealth_chrome(url)
            if data and data.get('name') and data['name'] != 'Produto não encontrado':
                logger.info("✅ Dados extraídos via Chrome stealth")
                return data
            
            # Estratégia 2: Tentar API com delay humano
            data = self._extract_with_human_simulation(url)
            if data and data.get('name') and data['name'] != 'Produto não encontrado':
                logger.info("✅ Dados extraídos via simulação humana")
                return data
                
            # Estratégia 3: Requests com rotação de headers
            data = self._extract_with_rotating_headers(url)
            if data and data.get('name') and data['name'] != 'Produto não encontrado':
                logger.info("✅ Dados extraídos via headers rotativos")
                return data
                
            logger.warning("❌ Todas as estratégias stealth falharam")
            return {'error': 'Não foi possível extrair dados mesmo com técnicas stealth'}
            
        except Exception as e:
            logger.error(f"❌ Erro crítico na extração stealth: {e}")
            return {'error': f'Erro na extração stealth: {str(e)}'}

    def _extract_with_stealth_chrome(self, url: str) -> dict:
        """Extrair usando Chrome stealth com comportamento humano"""
        driver = None
        try:
            driver = self._get_stealth_driver()
            
            logger.info("🌐 Navegando para a página com Chrome stealth...")
            
            # Navegar para homepage primeiro (comportamento humano)
            driver.get("https://shopee.com.br")
            time.sleep(random.uniform(2, 4))
            
            # Agora navegar para o produto
            driver.get(url)
            
            # Aguardar carregamento com timeout maior
            wait = WebDriverWait(driver, 20)
            
            # Simular comportamento humano - scroll
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight/4);")
            time.sleep(random.uniform(1, 2))
            
            # Aguardar elementos carregarem
            try:
                wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
            except TimeoutException:
                logger.warning("Timeout aguardando h1, continuando...")
            
            # Extrair dados
            return self._parse_page_with_selenium(driver, url)
            
        except Exception as e:
            logger.error(f"❌ Erro no Chrome stealth: {e}")
            return {}
        finally:
            # Não fechar o driver para reutilizar
            pass

    def _extract_with_human_simulation(self, url: str) -> dict:
        """Simular comportamento humano com delays"""
        try:
            # Extrair IDs da URL
            url_match = re.search(r'i\.(\d+)\.(\d+)', url)
            if not url_match:
                return {}
            
            shop_id, item_id = url_match.groups()
            
            # Simular navegação humana - primeiro visitar homepage
            time.sleep(random.uniform(1, 3))
            self.session.get("https://shopee.com.br")
            
            # Aguardar como humano
            time.sleep(random.uniform(2, 5))
            
            # Tentar API com parâmetros variados
            api_urls = [
                f"https://shopee.com.br/api/v4/item/get?itemid={item_id}&shopid={shop_id}",
                f"https://shopee.com.br/api/v2/item/get?itemid={item_id}&shopid={shop_id}&lang=pt",
            ]
            
            for api_url in api_urls:
                try:
                    # Adicionar referrer realista
                    headers = self.session.headers.copy()
                    headers['Referer'] = 'https://shopee.com.br/'
                    
                    response = self.session.get(api_url, headers=headers, timeout=15)
                    if response.status_code == 200:
                        data = response.json()
                        if data and 'data' in data:
                            return self._parse_api_data(data['data'], url)
                except Exception as e:
                    logger.warning(f"API falhou: {e}")
                    continue
                    
                # Delay entre tentativas
                time.sleep(random.uniform(1, 2))
                
            return {}
            
        except Exception as e:
            logger.error(f"❌ Erro na simulação humana: {e}")
            return {}

    def _extract_with_rotating_headers(self, url: str) -> dict:
        """Usar diferentes user agents e headers"""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
        ]
        
        for ua in user_agents:
            try:
                session = requests.Session()
                session.headers.update({
                    'User-Agent': ua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Referer': 'https://shopee.com.br/',
                    'Cache-Control': 'no-cache',
                })
                
                response = session.get(url, timeout=15)
                if response.status_code == 200:
                    return self._parse_html_content(response.text, url)
                    
                time.sleep(random.uniform(1, 2))
                
            except Exception as e:
                logger.warning(f"Header rotation falhou: {e}")
                continue
                
        return {}

    def _parse_page_with_selenium(self, driver, url: str) -> dict:
        """Parse da página usando Selenium com seletores específicos da Shopee"""
        try:
            logger.info("🔍 Fazendo parse da página com Selenium...")
            
            # Aguardar um pouco mais para garantir carregamento
            time.sleep(3)
            
            # Nome do produto - seletores mais específicos da Shopee
            name_selectors = [
                'h1[data-testid="pdp-product-title"]',
                'h1._3OAbCv',
                'h1.product-name',
                'h1',
                '._0Wuo7_',
                '.product-briefing h1',
                '[class*="product-title"]'
            ]
            
            name = "Produto não encontrado"
            for selector in name_selectors:
                try:
                    element = driver.find_element(By.CSS_SELECTOR, selector)
                    if element and element.text.strip():
                        name = element.text.strip()
                        logger.info(f"📝 Nome encontrado: {name}")
                        break
                except NoSuchElementException:
                    continue
            
            # Preços - seletores específicos da Shopee
            current_price = "R$ 0,00"
            original_price = None
            
            price_selectors = [
                '._3n5NQx',
                '.product-price',
                '._1w9jVv',
                '._29D_hg',
                '[class*="price"]',
                '[data-testid*="price"]'
            ]
            
            prices_found = []
            for selector in price_selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        text = element.text.strip()
                        if 'R$' in text and text not in prices_found:
                            prices_found.append(text)
                            logger.info(f"💰 Preço encontrado: {text}")
                except:
                    continue
            
            if prices_found:
                current_price = prices_found[0]
                if len(prices_found) > 1:
                    original_price = prices_found[1]
            
            # Imagens
            images = []
            img_selectors = [
                'img[class*="product"]',
                '._1TT1l7 img',
                'img[src*="shopee"]',
                '.product-image img',
                '[class*="gallery"] img'
            ]
            
            for selector in img_selectors:
                try:
                    img_elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for img in img_elements[:6]:
                        src = img.get_attribute('src') or img.get_attribute('data-src')
                        if src and ('shopee' in src or 'cf.shopee' in src) and src not in images:
                            images.append(src)
                            logger.info(f"🖼️ Imagem encontrada: {src[:50]}...")
                except:
                    continue
                    
                if len(images) >= 5:
                    break
            
            # Descrição
            description = "Produto extraído da Shopee"
            desc_selectors = [
                '[data-testid*="description"]',
                '.product-description',
                '._2u0jt9',
                '[class*="description"]'
            ]
            
            for selector in desc_selectors:
                try:
                    element = driver.find_element(By.CSS_SELECTOR, selector)
                    if element and element.text.strip():
                        description = element.text.strip()[:300] + "..."
                        break
                except:
                    continue
            
            # Rating e reviews
            rating = None
            reviews = None
            
            try:
                rating_elements = driver.find_elements(By.CSS_SELECTOR, '[class*="rating"], [class*="star"]')
                for elem in rating_elements:
                    text = elem.text.strip()
                    if '.' in text and len(text) < 5:
                        try:
                            rating = float(text)
                            break
                        except:
                            continue
            except:
                pass
            
            # Variações (cores, tamanhos)
            variations = {}
            try:
                variation_buttons = driver.find_elements(By.CSS_SELECTOR, '[class*="variation"] button, [class*="variant"] button, [class*="sku"] button')
                colors = []
                sizes = []
                
                for button in variation_buttons:
                    text = button.text.strip().lower()
                    if any(color in text for color in ['azul', 'vermelho', 'preto', 'branco', 'verde', 'rosa', 'cinza', 'marrom']):
                        colors.append(button.text.strip())
                    elif any(size in text for size in ['p', 'm', 'g', 'gg', '36', '37', '38', '39', '40', '41', '42', '43', '44']) or text.isdigit():
                        sizes.append(button.text.strip())
                
                if colors:
                    variations['colors'] = list(set(colors))
                if sizes:
                    variations['sizes'] = list(set(sizes))
                    
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
                'rating': rating,
                'reviews': reviews,
                'url': url,
                'variations': variations
            }
            
            logger.info(f"✅ Dados extraídos via Selenium:")
            logger.info(f"   Nome: {name}")
            logger.info(f"   Preço: {current_price}")
            logger.info(f"   Imagens: {len(images)}")
            logger.info(f"   Variações: {variations}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erro no parse Selenium: {e}")
            return {}

    def _parse_api_data(self, item_data: dict, url: str) -> dict:
        """Parse dados da API da Shopee"""
        try:
            if not item_data:
                return {}
            
            name = item_data.get('name', 'Produto não encontrado')
            if not name or name == 'Produto não encontrado':
                return {}
            
            # Preços
            price_min = item_data.get('price_min', 0)
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
            
            return {
                'name': name,
                'price': current_price,
                'originalPrice': original_price,
                'images': images,
                'description': item_data.get('description', 'Descrição não disponível'),
                'specifications': specifications,
                'category': item_data.get('categories', [{}])[0].get('display_name', 'Produto Shopee'),
                'rating': rating,
                'reviews': reviews,
                'url': url,
                'variations': {}
            }
            
        except Exception as e:
            logger.error(f"❌ Erro no parse da API: {e}")
            return {}

    def _parse_html_content(self, html: str, url: str) -> dict:
        """Parse básico do conteúdo HTML"""
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, 'html.parser')
            
            # Nome
            name = "Produto não encontrado"
            for selector in ['h1', '.product-name', '[class*="title"]']:
                element = soup.select_one(selector)
                if element and element.get_text(strip=True):
                    name = element.get_text(strip=True)
                    break
            
            return {
                'name': name,
                'price': 'R$ 0,00',
                'originalPrice': None,
                'images': ["https://via.placeholder.com/400x400?text=Produto+Shopee"],
                'description': 'Extraído via HTML',
                'specifications': {},
                'category': 'Produto Shopee',
                'rating': None,
                'reviews': None,
                'url': url,
                'variations': {}
            }
            
        except Exception as e:
            logger.error(f"❌ Erro no parse HTML: {e}")
            return {}

    def _format_price(self, price: int) -> str:
        """Formatar preço da Shopee"""
        if not price:
            return "R$ 0,00"
        
        real_price = price / 100000
        return f"R$ {real_price:.2f}".replace('.', ',')

    def close(self):
        """Fechar driver se existir"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None


# Instância global do extrator stealth
stealth_extractor = StealthShopeeExtractor()

@app.route('/api/extract', methods=['POST'])
def extract_product():
    """Endpoint para extrair dados com técnicas stealth"""
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL é obrigatória'}), 400
        
        if 'shopee.com' not in url:
            return jsonify({'error': 'URL deve ser da Shopee'}), 400
        
        logger.info(f"🕵️ Nova solicitação STEALTH: {url}")
        
        # Extrair dados com técnicas stealth
        result = stealth_extractor.extract_real_data(url)
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"❌ Erro no endpoint stealth: {e}")
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Verificar status do servidor stealth"""
    return jsonify({'status': 'OK', 'message': 'Servidor stealth ativo', 'type': 'stealth'})

@app.route('/', methods=['GET'])
def home():
    """Página inicial do servidor stealth"""
    return '''
    <h1>🕵️ Shopee STEALTH Scraper API</h1>
    <p>Servidor stealth com undetected-chromedriver</p>
    <h3>Características:</h3>
    <ul>
        <li>✅ Undetected ChromeDriver</li>
        <li>✅ Comportamento humano simulado</li>
        <li>✅ Headers rotativos</li>
        <li>✅ Delays aleatórios</li>
        <li>✅ Anti-detecção avançada</li>
    </ul>
    '''

if __name__ == '__main__':
    print("🕵️ Iniciando servidor STEALTH de scraping da Shopee...")
    print("📡 Servidor rodando em: http://localhost:5000")
    print("🔧 Usando undetected-chromedriver para anti-detecção")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    finally:
        stealth_extractor.close() 