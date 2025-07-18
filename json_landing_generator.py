#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎯 JSON LANDING PAGE GENERATOR
✅ Upload de arquivo JSON com dados do produto
✅ Geração automática de landing page
✅ Processamento de imagens e dados estruturados
"""

from flask import Flask, request, jsonify, render_template_string, Response
from flask_cors import CORS
import json
import base64
import os
import time
import logging
from typing import Dict, List, Optional, Any
import requests
from urllib.parse import urlparse
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class JSONLandingGenerator:
    def __init__(self):
        # Criar pastas necessárias
        self.uploads_dir = "uploads"
        self.images_dir = "product_images"
        self.generated_dir = "generated_pages"
        
        for directory in [self.uploads_dir, self.images_dir, self.generated_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
    
    def process_json_upload(self, json_data: Dict, uploaded_images: List = None) -> Dict:
        """Processar dados JSON e gerar landing page"""
        try:
            logger.info("🎯 Processando dados JSON...")
            
            # Validar estrutura do JSON
            validated_data = self._validate_json_structure(json_data)
            if not validated_data:
                return {"error": "Estrutura JSON inválida"}
            
            # Processar imagens
            processed_images = self._process_product_images(
                validated_data.get('images', []), 
                uploaded_images or []
            )
            
            # Gerar ID único para o produto
            product_id = str(uuid.uuid4())[:8]
            
            # Estruturar dados finais
            final_data = {
                "id": product_id,
                "name": validated_data.get('name', ''),
                "price": self._format_price(validated_data),
                "originalPrice": validated_data.get('originalPrice', ''),
                "discount": validated_data.get('discount', ''),
                "rating": validated_data.get('rating', 0),
                "totalRatings": validated_data.get('totalRatings', 0),
                "sold": validated_data.get('sold', 0),
                "stock": validated_data.get('stock', 0),
                "description": validated_data.get('description', ''),
                "category": validated_data.get('category', 'Produto'),
                "variations": validated_data.get('variations', []),
                "specifications": validated_data.get('specifications', {}),
                "images": processed_images,
                "features": validated_data.get('features', []),
                "benefits": validated_data.get('benefits', []),
                "shipping": validated_data.get('shipping', {}),
                "warranty": validated_data.get('warranty', ''),
                "brand": validated_data.get('brand', ''),
                "model": validated_data.get('model', ''),
                "colors": validated_data.get('colors', []),
                "sizes": validated_data.get('sizes', []),
                "timestamp": time.time()
            }
            
            # Salvar dados processados
            self._save_product_data(product_id, final_data)
            
            logger.info(f"✅ Produto processado com sucesso! ID: {product_id}")
            
            return {
                "success": True,
                "product_id": product_id,
                "data": final_data,
                "message": "Dados processados com sucesso!"
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao processar JSON: {e}")
            return {"error": f"Erro no processamento: {str(e)}"}
    
    def _validate_json_structure(self, data: Dict) -> Optional[Dict]:
        """Validar e normalizar estrutura do JSON"""
        try:
            logger.info(f"🔍 Validando estrutura JSON...")
            logger.info(f"📦 Chaves principais: {list(data.keys())}")
            
            # Detectar se é estrutura da extensão
            if 'product' in data and isinstance(data['product'], dict):
                logger.info("✅ Detectado: estrutura da extensão")
                result = self._normalize_extension_data(data)
                if result:
                    logger.info("✅ Normalização da extensão concluída com sucesso")
                    return result
                else:
                    logger.error("❌ Falha na normalização dos dados da extensão")
                    return None
            
            # Estrutura direta do produto
            logger.info("🔍 Tentando processar como estrutura direta do produto")
            product_name = data.get('name', '')
            if not product_name:
                logger.error(f"❌ Campo obrigatório ausente: name")
                return None
            
            # Normalizar dados
            normalized = {
                'name': str(product_name).strip(),
                'price': self._extract_price(data),
                'originalPrice': self._extract_original_price(data),
                'discount': self._extract_discount(data),
                'rating': float(data.get('rating', 0)),
                'totalRatings': int(data.get('totalRatings', 0)),
                'sold': int(data.get('sold', 0)),
                'stock': int(data.get('stock', 0)),
                'description': str(data.get('description', '')).strip(),
                'category': str(data.get('category', 'Produto')).strip(),
                'variations': self._normalize_variations(data.get('variations', [])),
                'specifications': data.get('specifications', {}),
                'images': data.get('images', []),
                'features': data.get('features', []),
                'benefits': data.get('benefits', []),
                'shipping': data.get('shipping', {}),
                'warranty': str(data.get('warranty', '')).strip(),
                'brand': str(data.get('brand', '')).strip(),
                'model': str(data.get('model', '')).strip(),
                'colors': data.get('colors', []),
                'sizes': data.get('sizes', [])
            }
            
            return normalized
            
        except Exception as e:
            logger.error(f"❌ Erro na validação: {e}")
            return None
    
    def _normalize_extension_data(self, data: Dict) -> Dict:
        """Normalizar dados vindos da extensão"""
        try:
            logger.info("🔄 Iniciando normalização dos dados da extensão...")
            product = data.get('product', {})
            logger.info(f"📦 Produto extraído: {list(product.keys()) if product else 'vazio'}")
            
            # Extrair nome
            name = product.get('name', '').strip()
            
            # Extrair preços
            price_info = product.get('price', {})
            current_price = price_info.get('current', 0)
            original_price = price_info.get('original', 0)
            
            # Formatar preços
            price_formatted = f"R$ {current_price:.2f}" if current_price > 0 else "Consulte o preço"
            original_price_formatted = f"R$ {original_price:.2f}" if original_price > 0 else ""
            
            # Calcular desconto
            discount = 0
            if original_price > 0 and current_price > 0:
                discount = int(((original_price - current_price) / original_price) * 100)
            
            # Extrair outros dados
            rating = float(product.get('rating', 0))
            review_count = product.get('reviewCount', '0')
            sold_count = product.get('soldCount', '0')
            
            # Converter strings para números
            try:
                total_ratings = int(review_count) if review_count.isdigit() else 0
            except:
                total_ratings = 0
                
            try:
                sold = int(sold_count) if sold_count.isdigit() else 0
            except:
                sold = 0
            
            # Imagens - normalizar para array de URLs simples
            raw_images = product.get('images', [])
            images = []
            
            for img in raw_images:
                if isinstance(img, str):
                    # Se já é uma string (URL), adicionar diretamente
                    images.append(img)
                elif isinstance(img, dict):
                    # Se é um objeto, extrair a URL
                    url = img.get('url') or img.get('src') or img.get('link')
                    if url:
                        images.append(url)
                
            # Limitar a máximo 10 imagens
            images = images[:10]
            
            # Log para debug das imagens
            logger.info(f"🖼️ Imagens processadas: {len(images)} URLs encontradas")
            if images:
                logger.info(f"🖼️ Primeira imagem: {images[0][:50]}...")
            else:
                logger.warning("⚠️ Nenhuma imagem encontrada!")
            
            # Descrição
            description = product.get('description', '').strip()
            
            # Variações
            variations = product.get('variations', [])
            
            # Especificações
            specifications = product.get('specifications', {})
            
            # Processar cores e tamanhos das variações
            colors = []
            sizes = []
            
            for variation in variations:
                if variation.get('type') == 'Cor':
                    colors = [opt['value'] for opt in variation.get('options', [])]
                elif variation.get('type') == 'Tamanho':
                    sizes = [opt['value'] for opt in variation.get('options', [])]
            
            # Comentários
            comments = product.get('comments', [])
            
            result = {
                'name': name,
                'price': price_formatted,
                'originalPrice': original_price_formatted,
                'discount': f"{discount}%" if discount > 0 else "",
                'rating': rating,
                'totalRatings': total_ratings,
                'sold': sold,
                'stock': 1000,  # Valor padrão
                'description': description,
                'category': 'Produto da Shopee',
                'variations': self._normalize_variations(variations),
                'specifications': specifications,
                'images': images,
                'features': [],
                'benefits': [],
                'shipping': {'free_shipping': True},
                'warranty': '',
                'brand': '',
                'model': '',
                'colors': colors,
                'sizes': sizes,
                'comments': comments,
                'url': data.get('url', ''),
                'extractedAt': data.get('extractedAt', '')
            }
            
            logger.info("✅ Dados da extensão normalizados com sucesso")
            logger.info(f"📊 Nome do produto: {result['name']}")
            logger.info(f"💰 Preço: {result['price']}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erro ao normalizar dados da extensão: {e}")
            import traceback
            logger.error(f"❌ Traceback: {traceback.format_exc()}")
            return None
    
    def _extract_price(self, data: Dict) -> str:
        """Extrair e formatar preço"""
        price_fields = ['price', 'currentPrice', 'salePrice', 'valor', 'preco']
        
        for field in price_fields:
            if data.get(field):
                price_value = data[field]
                if isinstance(price_value, str):
                    # Extrair números do string
                    import re
                    numbers = re.findall(r'[\d,\.]+', price_value)
                    if numbers:
                        try:
                            return f"R$ {float(numbers[0].replace(',', '.')):.2f}"
                        except:
                            continue
                elif isinstance(price_value, (int, float)):
                    return f"R$ {float(price_value):.2f}"
        
        return "Consulte o preço"
    
    def _extract_original_price(self, data: Dict) -> str:
        """Extrair preço original"""
        original_fields = ['originalPrice', 'oldPrice', 'listPrice', 'precoOriginal']
        
        for field in original_fields:
            if data.get(field):
                price_value = data[field]
                if isinstance(price_value, str):
                    import re
                    numbers = re.findall(r'[\d,\.]+', price_value)
                    if numbers:
                        try:
                            return f"R$ {float(numbers[0].replace(',', '.')):.2f}"
                        except:
                            continue
                elif isinstance(price_value, (int, float)):
                    return f"R$ {float(price_value):.2f}"
        
        return ""
    
    def _extract_discount(self, data: Dict) -> str:
        """Extrair desconto"""
        discount_fields = ['discount', 'desconto', 'percentOff']
        
        for field in discount_fields:
            if data.get(field):
                discount_value = data[field]
                if isinstance(discount_value, str):
                    import re
                    numbers = re.findall(r'\d+', discount_value)
                    if numbers:
                        return f"{numbers[0]}%"
                elif isinstance(discount_value, (int, float)):
                    return f"{int(discount_value)}%"
        
        return ""
    
    def _normalize_variations(self, variations: List) -> List[Dict]:
        """Normalizar variações do produto"""
        normalized_variations = []
        
        for variation in variations:
            if isinstance(variation, dict):
                normalized_variations.append({
                    'name': str(variation.get('name', '')),
                    'price': float(variation.get('price', 0)),
                    'stock': int(variation.get('stock', 0)),
                    'image': variation.get('image', ''),
                    'available': bool(variation.get('available', True))
                })
            elif isinstance(variation, str):
                normalized_variations.append({
                    'name': variation,
                    'price': 0,
                    'stock': 0,
                    'image': '',
                    'available': True
                })
        
        return normalized_variations
    
    def _format_price(self, data: Dict) -> str:
        """Formatar preço para exibição"""
        return data.get('price', 'Consulte o preço')
    
    def _process_product_images(self, image_data: List, uploaded_files: List) -> List[Dict]:
        """Processar imagens do produto"""
        processed_images = []
        
        # Processar imagens do JSON
        for i, img in enumerate(image_data):
            try:
                if isinstance(img, str):
                    # URL de imagem
                    if img.startswith('http'):
                        downloaded_img = self._download_image_from_url(img, f"product_{i+1}")
                        if downloaded_img:
                            processed_images.append(downloaded_img)
                    # Base64
                    elif img.startswith('data:image'):
                        base64_img = self._save_base64_image(img, f"product_{i+1}")
                        if base64_img:
                            processed_images.append(base64_img)
                elif isinstance(img, dict):
                    # Objeto de imagem com metadados
                    if img.get('url'):
                        downloaded_img = self._download_image_from_url(img['url'], f"product_{i+1}")
                        if downloaded_img:
                            downloaded_img.update({
                                'alt': img.get('alt', ''),
                                'title': img.get('title', ''),
                                'is_main': img.get('is_main', False)
                            })
                            processed_images.append(downloaded_img)
                    elif img.get('base64'):
                        base64_img = self._save_base64_image(img['base64'], f"product_{i+1}")
                        if base64_img:
                            base64_img.update({
                                'alt': img.get('alt', ''),
                                'title': img.get('title', ''),
                                'is_main': img.get('is_main', False)
                            })
                            processed_images.append(base64_img)
            except Exception as e:
                logger.warning(f"❌ Erro ao processar imagem {i+1}: {e}")
        
        # Processar arquivos enviados
        for i, uploaded_file in enumerate(uploaded_files):
            try:
                saved_file = self._save_uploaded_image(uploaded_file, f"uploaded_{i+1}")
                if saved_file:
                    processed_images.append(saved_file)
            except Exception as e:
                logger.warning(f"❌ Erro ao processar arquivo enviado {i+1}: {e}")
        
        return processed_images
    
    def _download_image_from_url(self, url: str, filename: str) -> Optional[Dict]:
        """Baixar imagem de URL"""
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                # Determinar extensão
                content_type = response.headers.get('content-type', '')
                if 'jpeg' in content_type or 'jpg' in content_type:
                    ext = 'jpg'
                elif 'png' in content_type:
                    ext = 'png'
                elif 'webp' in content_type:
                    ext = 'webp'
                else:
                    ext = 'jpg'
                
                filename_with_ext = f"{filename}.{ext}"
                filepath = os.path.join(self.images_dir, filename_with_ext)
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                # Converter para base64
                img_base64 = base64.b64encode(response.content).decode('utf-8')
                
                return {
                    'url': url,
                    'local_path': filepath,
                    'filename': filename_with_ext,
                    'base64': f"data:image/{ext};base64,{img_base64}",
                    'size': len(response.content),
                    'type': content_type
                }
        except Exception as e:
            logger.warning(f"❌ Erro ao baixar imagem: {e}")
        
        return None
    
    def _save_base64_image(self, base64_data: str, filename: str) -> Optional[Dict]:
        """Salvar imagem base64"""
        try:
            # Extrair dados do base64
            if ',' in base64_data:
                header, data = base64_data.split(',', 1)
                # Determinar tipo de imagem
                if 'jpeg' in header or 'jpg' in header:
                    ext = 'jpg'
                elif 'png' in header:
                    ext = 'png'
                elif 'webp' in header:
                    ext = 'webp'
                else:
                    ext = 'jpg'
            else:
                data = base64_data
                ext = 'jpg'
            
            # Decodificar base64
            image_data = base64.b64decode(data)
            
            filename_with_ext = f"{filename}.{ext}"
            filepath = os.path.join(self.images_dir, filename_with_ext)
            
            with open(filepath, 'wb') as f:
                f.write(image_data)
            
            return {
                'local_path': filepath,
                'filename': filename_with_ext,
                'base64': base64_data,
                'size': len(image_data),
                'type': f'image/{ext}'
            }
            
        except Exception as e:
            logger.warning(f"❌ Erro ao salvar imagem base64: {e}")
        
        return None
    
    def _save_uploaded_image(self, file_data: bytes, filename: str) -> Optional[Dict]:
        """Salvar arquivo de imagem enviado"""
        try:
            # Detectar tipo de arquivo pelos primeiros bytes
            if file_data.startswith(b'\xff\xd8\xff'):
                ext = 'jpg'
                mime_type = 'image/jpeg'
            elif file_data.startswith(b'\x89PNG'):
                ext = 'png'
                mime_type = 'image/png'
            elif file_data.startswith(b'RIFF') and b'WEBP' in file_data[:12]:
                ext = 'webp'
                mime_type = 'image/webp'
            else:
                ext = 'jpg'
                mime_type = 'image/jpeg'
            
            filename_with_ext = f"{filename}.{ext}"
            filepath = os.path.join(self.images_dir, filename_with_ext)
            
            with open(filepath, 'wb') as f:
                f.write(file_data)
            
            # Converter para base64
            img_base64 = base64.b64encode(file_data).decode('utf-8')
            
            return {
                'local_path': filepath,
                'filename': filename_with_ext,
                'base64': f"data:{mime_type};base64,{img_base64}",
                'size': len(file_data),
                'type': mime_type
            }
            
        except Exception as e:
            logger.warning(f"❌ Erro ao salvar arquivo enviado: {e}")
        
        return None
    
    def _save_product_data(self, product_id: str, data: Dict):
        """Salvar dados do produto"""
        try:
            filepath = os.path.join(self.uploads_dir, f"{product_id}.json")
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"✅ Dados salvos: {filepath}")
        except Exception as e:
            logger.error(f"❌ Erro ao salvar dados: {e}")
    
    def get_product_data(self, product_id: str) -> Optional[Dict]:
        """Recuperar dados do produto"""
        try:
            filepath = os.path.join(self.uploads_dir, f"{product_id}.json")
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f"❌ Erro ao carregar dados: {e}")
        
        return None
    
    def list_products(self) -> List[Dict]:
        """Listar todos os produtos"""
        products = []
        try:
            for filename in os.listdir(self.uploads_dir):
                if filename.endswith('.json'):
                    product_id = filename[:-5]  # Remove .json
                    data = self.get_product_data(product_id)
                    if data:
                        products.append({
                            'id': product_id,
                            'name': data.get('name', ''),
                            'price': data.get('price', ''),
                            'category': data.get('category', ''),
                            'timestamp': data.get('timestamp', 0)
                        })
        except Exception as e:
            logger.error(f"❌ Erro ao listar produtos: {e}")
        
        return sorted(products, key=lambda x: x['timestamp'], reverse=True)

# Instância global
generator = JSONLandingGenerator()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok", 
        "message": "🎯 JSON Landing Page Generator - Ativo!",
        "version": "1.0"
    })

@app.route('/api/upload-json', methods=['POST'])
def upload_json():
    try:
        # Verificar se há dados JSON
        if request.is_json:
            json_data = request.get_json()
        else:
            return jsonify({"error": "Dados JSON são obrigatórios"}), 400
        
        logger.info("🎯 Recebendo upload de JSON...")
        
        # Processar dados
        result = generator.process_json_upload(json_data)
        
        if result.get('success'):
            return jsonify(result)
        else:
            return jsonify(result), 400
    
    except Exception as e:
        logger.error(f"❌ Erro no upload: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/product/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        data = generator.get_product_data(product_id)
        if data:
            return jsonify({"success": True, "data": data})
        else:
            return jsonify({"error": "Produto não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['GET'])
def list_products():
    try:
        products = generator.list_products()
        return jsonify({"success": True, "products": products})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🖼️ PROXY DE IMAGENS - Contornar CORS da Shopee
@app.route('/api/image-proxy', methods=['GET'])
def image_proxy():
    """Proxy para servir imagens da Shopee contornando CORS"""
    try:
        # Obter URL da imagem dos parâmetros
        image_url = request.args.get('url')
        if not image_url:
            return jsonify({"error": "URL da imagem não fornecida"}), 400
        
        # Verificar se é uma URL da Shopee válida
        if 'susercontent.com' not in image_url and 'shopee.com' not in image_url:
            return jsonify({"error": "URL não permitida"}), 403
        
        print(f"🖼️ Proxy de imagem: {image_url[:50]}...")
        
        # Headers para simular navegador real
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://shopee.com.br/',
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site'
        }
        
        # Fazer request da imagem
        response = requests.get(image_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Determinar tipo de conteúdo
            content_type = response.headers.get('content-type', 'image/jpeg')
            
            # Retornar imagem com headers corretos
            return Response(
                response.content,
                mimetype=content_type,
                headers={
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Cache-Control': 'public, max-age=3600'  # Cache por 1 hora
                }
            )
        else:
            print(f"❌ Erro ao buscar imagem: HTTP {response.status_code}")
            return jsonify({"error": f"Erro ao buscar imagem: HTTP {response.status_code}"}), response.status_code
            
    except requests.exceptions.Timeout:
        print("⏰ Timeout ao buscar imagem")
        return jsonify({"error": "Timeout ao buscar imagem"}), 408
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro de rede: {e}")
        return jsonify({"error": f"Erro de rede: {str(e)}"}), 500
        
    except Exception as e:
        print(f"❌ Erro inesperado no proxy: {e}")
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

if __name__ == '__main__':
    print("🎯 JSON LANDING PAGE GENERATOR")
    print("=" * 50)
    print("✅ Upload de arquivo JSON")
    print("✅ Processamento automático de dados")
    print("✅ Geração de landing pages")
    print("📡 Servidor: http://localhost:5007")
    print("🔗 Endpoints:")
    print("   POST /api/upload-json - Upload de dados")
    print("   GET /api/product/<id> - Obter produto")
    print("   GET /api/products - Listar produtos")
    print("   GET /api/image-proxy?url=<url> - Proxy de imagens")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5007, debug=False)