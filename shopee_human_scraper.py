#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shopee Human-Like Scraper
Simula comportamento humano completo
"""

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import random
import re
import json

class HumanShopeeExtractor:
    def __init__(self):
        self.driver = None
        self.wait = None

    def _create_human_driver(self):
        """Criar driver com comportamento super humano"""
        if self.driver is None:
            options = uc.ChromeOptions()
            
            # Configurações para parecer humano
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_argument('--disable-extensions')
            options.add_argument('--start-maximized')
            
            # Criar driver
            self.driver = uc.Chrome(options=options)
            self.wait = WebDriverWait(self.driver, 20)
            
            # Scripts anti-detecção
            self.driver.execute_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });
                
                delete navigator.__proto__.webdriver;
                
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5],
                });
                
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['pt-BR', 'pt', 'en-US', 'en'],
                });
                
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                        Promise.resolve({ state: Notification.permission }) :
                        originalQuery(parameters)
                );
            """)
            
            print("✅ Driver humano criado")
            
        return self.driver

    def extract_product_like_human(self, product_url: str) -> dict:
        """Extrair produto simulando comportamento humano completo"""
        try:
            driver = self._create_human_driver()
            
            print("🏠 1. Visitando homepage como humano...")
            self._visit_homepage_naturally()
            
            print("🔍 2. Extraindo nome do produto da URL...")
            product_name = self._extract_product_name_from_url(product_url)
            
            print(f"🎯 3. Pesquisando produto: {product_name}")
            self._search_product_naturally(product_name)
            
            print("📱 4. Navegando para produto...")
            success = self._navigate_to_product(product_url)
            
            if not success:
                print("❌ Não conseguiu navegar para o produto")
                return {}
            
            print("🕵️ 5. Extraindo dados do produto...")
            return self._extract_product_data_human()
            
        except Exception as e:
            print(f"❌ Erro na extração humana: {e}")
            return {}

    def _visit_homepage_naturally(self):
        """Visitar homepage com comportamento natural"""
        driver = self.driver
        
        # Ir para homepage
        driver.get("https://shopee.com.br")
        self._human_delay(3, 5)
        
        # Simular leitura da página
        self._simulate_reading()
        
        # Scroll como humano
        self._human_scroll()

    def _extract_product_name_from_url(self, url: str) -> str:
        """Extrair nome do produto da URL"""
        try:
            # Pegar parte do nome da URL
            parts = url.split('/')
            for part in parts:
                if '-i.' in part:
                    name_part = part.split('-i.')[0]
                    # Converter para nome pesquisável
                    name = name_part.replace('-', ' ')
                    # Pegar primeiras palavras mais importantes
                    words = name.split()[:4]
                    return ' '.join(words)
            return "sapato masculino"
        except:
            return "produto"

    def _search_product_naturally(self, product_name: str):
        """Pesquisar produto como humano"""
        driver = self.driver
        
        try:
            # Encontrar barra de pesquisa
            search_selectors = [
                'input[placeholder*="Pesquisar"]',
                'input[type="search"]',
                'input[class*="search"]',
                '.shopee-searchbar-input input'
            ]
            
            search_box = None
            for selector in search_selectors:
                try:
                    search_box = driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue
            
            if search_box:
                # Clicar como humano
                self._human_click(search_box)
                self._human_delay(1, 2)
                
                # Digitar como humano
                self._human_type(search_box, product_name)
                self._human_delay(1, 2)
                
                # Pressionar Enter
                search_box.send_keys(Keys.RETURN)
                self._human_delay(3, 5)
                
                print(f"✅ Pesquisou por: {product_name}")
            else:
                print("❌ Não encontrou barra de pesquisa")
                
        except Exception as e:
            print(f"❌ Erro na pesquisa: {e}")

    def _navigate_to_product(self, product_url: str) -> bool:
        """Navegar para produto específico"""
        driver = self.driver
        
        try:
            # Ir diretamente para o produto (após pesquisa, é mais natural)
            print(f"🔗 Navegando para: {product_url}")
            driver.get(product_url)
            self._human_delay(5, 8)
            
            # Verificar se chegou no produto (não na página de login)
            current_url = driver.current_url
            page_title = driver.title
            
            if "login" in current_url.lower() or "entrar" in page_title.lower():
                print("❌ Redirecionado para login")
                return False
            
            print("✅ Chegou na página do produto")
            return True
            
        except Exception as e:
            print(f"❌ Erro na navegação: {e}")
            return False

    def _extract_product_data_human(self) -> dict:
        """Extrair dados como humano lendo a página"""
        driver = self.driver
        
        try:
            # Simular leitura da página
            self._simulate_reading()
            
            # Scroll para ver mais conteúdo
            self._human_scroll()
            
            # Extrair dados
            data = {}
            
            # Nome do produto
            data['name'] = self._find_product_name()
            
            # Preços
            prices = self._find_prices()
            data['price'] = prices.get('current', 'R$ 0,00')
            data['originalPrice'] = prices.get('original')
            
            # Imagens
            data['images'] = self._find_images()
            
            # Descrição
            data['description'] = self._find_description()
            
            # Variações
            data['variations'] = self._find_variations()
            
            # Rating e reviews
            rating_data = self._find_rating()
            data['rating'] = rating_data.get('rating')
            data['reviews'] = rating_data.get('reviews')
            
            # Especificações
            data['specifications'] = {}
            data['category'] = 'Produto Shopee'
            data['url'] = driver.current_url
            
            return data
            
        except Exception as e:
            print(f"❌ Erro na extração: {e}")
            return {}

    def _find_product_name(self) -> str:
        """Encontrar nome do produto"""
        selectors = [
            'h1',
            '[data-testid*="title"]',
            '.product-name',
            '[class*="product-title"]',
            '[class*="item-name"]'
        ]
        
        for selector in selectors:
            try:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
                text = element.text.strip()
                if text and len(text) > 10:
                    print(f"📝 Nome encontrado: {text}")
                    return text
            except:
                continue
                
        return "Produto não encontrado"

    def _find_prices(self) -> dict:
        """Encontrar preços"""
        prices = {'current': 'R$ 0,00', 'original': None}
        
        # Buscar elementos de preço
        price_elements = []
        selectors = [
            '[class*="price"]',
            '[data-testid*="price"]',
            '[class*="amount"]'
        ]
        
        for selector in selectors:
            try:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                price_elements.extend(elements)
            except:
                continue
        
        # Extrair preços do texto
        found_prices = []
        for element in price_elements:
            text = element.text.strip()
            if 'R$' in text:
                # Limpar e validar preço
                price_match = re.search(r'R\$\s*[\d.,]+', text)
                if price_match:
                    price = price_match.group()
                    if price not in found_prices:
                        found_prices.append(price)
                        print(f"💰 Preço encontrado: {price}")
        
        if found_prices:
            prices['current'] = found_prices[0]
            if len(found_prices) > 1:
                prices['original'] = found_prices[1]
        
        return prices

    def _find_images(self) -> list:
        """Encontrar imagens do produto"""
        images = []
        
        try:
            img_elements = self.driver.find_elements(By.TAG_NAME, 'img')
            for img in img_elements:
                src = img.get_attribute('src') or img.get_attribute('data-src')
                if src and ('shopee' in src or 'product' in src.lower()):
                    if src not in images:
                        images.append(src)
                        print(f"🖼️ Imagem: {src[:50]}...")
                        
                if len(images) >= 5:
                    break
                    
        except Exception as e:
            print(f"❌ Erro ao buscar imagens: {e}")
        
        return images if images else ["https://via.placeholder.com/400x400?text=Produto+Shopee"]

    def _find_description(self) -> str:
        """Encontrar descrição"""
        selectors = [
            '[class*="description"]',
            '[data-testid*="description"]',
            '.product-detail',
            '[class*="detail"]'
        ]
        
        for selector in selectors:
            try:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
                text = element.text.strip()
                if text and len(text) > 20:
                    return text[:200] + "..."
            except:
                continue
                
        return "Produto da Shopee extraído com comportamento humano"

    def _find_variations(self) -> dict:
        """Encontrar variações de produto"""
        variations = {}
        
        try:
            # Buscar botões de variação
            button_elements = self.driver.find_elements(By.TAG_NAME, 'button')
            
            colors = []
            sizes = []
            
            for button in button_elements:
                text = button.text.strip().lower()
                
                # Detectar cores
                color_words = ['azul', 'vermelho', 'preto', 'branco', 'verde', 'rosa', 'cinza', 'marrom']
                if any(color in text for color in color_words):
                    colors.append(button.text.strip())
                
                # Detectar tamanhos
                size_words = ['p', 'm', 'g', 'gg', '36', '37', '38', '39', '40', '41', '42', '43', '44']
                if any(size in text for size in size_words) or text.isdigit():
                    sizes.append(button.text.strip())
            
            if colors:
                variations['colors'] = list(set(colors))
            if sizes:
                variations['sizes'] = list(set(sizes))
                
        except:
            pass
            
        return variations

    def _find_rating(self) -> dict:
        """Encontrar rating e reviews"""
        rating_data = {}
        
        try:
            # Buscar rating
            text_elements = self.driver.find_elements(By.XPATH, "//*[contains(text(), '.')]")
            for element in text_elements:
                text = element.text.strip()
                # Procurar padrão de rating (ex: 4.8, 4.5, etc)
                if re.match(r'^\d\.\d$', text):
                    try:
                        rating = float(text)
                        if 0 <= rating <= 5:
                            rating_data['rating'] = rating
                            print(f"⭐ Rating: {rating}")
                            break
                    except:
                        continue
                        
        except:
            pass
            
        return rating_data

    # Métodos para simular comportamento humano
    def _human_delay(self, min_sec: float, max_sec: float):
        """Delay aleatório humano"""
        delay = random.uniform(min_sec, max_sec)
        time.sleep(delay)

    def _human_click(self, element):
        """Clicar como humano"""
        # Mover mouse para elemento (simulado)
        self._human_delay(0.2, 0.5)
        element.click()
        self._human_delay(0.1, 0.3)

    def _human_type(self, element, text: str):
        """Digitar como humano"""
        element.clear()
        for char in text:
            element.send_keys(char)
            self._human_delay(0.05, 0.15)

    def _simulate_reading(self):
        """Simular leitura da página"""
        self._human_delay(2, 4)

    def _human_scroll(self):
        """Scroll humano"""
        for _ in range(3):
            scroll_amount = random.randint(200, 500)
            self.driver.execute_script(f"window.scrollBy(0, {scroll_amount});")
            self._human_delay(0.5, 1.5)

    def close(self):
        """Fechar driver"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass


def test_human_extraction():
    """Teste da extração humana"""
    extractor = HumanShopeeExtractor()
    
    try:
        url = "https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326"
        
        print("🤖 Iniciando extração com comportamento humano...")
        result = extractor.extract_product_like_human(url)
        
        print("\n📋 RESULTADO:")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
        # Salvar resultado
        with open('produto_humano.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print("\n💾 Resultado salvo em: produto_humano.json")
        
    finally:
        extractor.close()


if __name__ == "__main__":
    test_human_extraction() 