// Content Script Avançado com melhor detecção de elementos
console.log('Shopee Scraper Advanced: Iniciando...');

// Seletores atualizados para a Shopee
const SELECTORS = {
  // Nome do produto
  productName: [
    'div[class*="VCNVHn"]',
    'div[class*="product-briefing"] span',
    'h1[class*="product-name"]',
    '[data-sqe="name"]'
  ],
  
  // Preços
  priceContainer: [
    'div[class*="pmmxKx"]',
    'div[class*="product-price"]',
    '[class*="price-container"]'
  ],
  currentPrice: [
    'div[class*="pqTWkA"]',
    'div[class*="Ybrg9j"]',
    '[class*="product-price-current"]'
  ],
  originalPrice: [
    'div[class*="G27FPf"]',
    '[class*="product-price-original"]',
    'div[class*="line-through"]'
  ],
  
  // Avaliações
  rating: [
    'div[class*="OitLRu"]',
    '[class*="product-rating"]',
    '[class*="star-rating"]'
  ],
  reviewCount: [
    'div[class*="OitLRu"] + div',
    '[class*="rating-count"]'
  ],
  
  // Vendas
  soldCount: [
    'div:has(> div:contains("vendidos"))',
    'div[class*="P3CdcB"]',
    '[class*="product-sold-count"]'
  ],
  
  // Imagens
  mainImage: [
    'div[class*="N2IpVA"] div[style*="background-image"]',
    '[class*="product-image-main"]',
    '.product-image img'
  ],
  thumbnails: [
    'div[class*="N2IpVA"] ~ div div[style*="background-image"]',
    '[class*="product-thumbnails"] img',
    '.thumbnail-list img'
  ],
  
  // Variações
  variationContainer: [
    'div[class*="product-variation"]',
    'div:has(> label:contains("Variação"))',
    '[class*="sku-selector"]'
  ],
  
  // Descrição
  description: [
    'div[class*="irIKAp"]',
    '[class*="product-description"]',
    'div[class*="detail-content"]'
  ],
  
  // Loja
  shopName: [
    'div[class*="shop-name"]',
    'a[class*="shop-link"]',
    '[class*="seller-name"]'
  ],
  
  // Comentários
  reviewItem: [
    'div[class*="shopee-product-rating"]',
    '[class*="review-item"]',
    'div[class*="rating-comment"]'
  ]
};

// Função melhorada para encontrar elementos
function findElement(selectors) {
  for (const selector of selectors) {
    try {
      const element = document.querySelector(selector);
      if (element) return element;
    } catch (e) {
      console.warn(`Seletor inválido: ${selector}`);
    }
  }
  return null;
}

// Função para encontrar múltiplos elementos
function findElements(selectors) {
  const elements = [];
  for (const selector of selectors) {
    try {
      const found = document.querySelectorAll(selector);
      elements.push(...found);
    } catch (e) {
      console.warn(`Seletor inválido: ${selector}`);
    }
  }
  return elements;
}

// Função para extrair URL de imagem de background-image
function extractImageUrl(element) {
  if (!element) return null;
  
  // Tentar src primeiro
  if (element.src) return element.src;
  
  // Tentar background-image
  const style = element.getAttribute('style') || element.style.cssText;
  const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
  if (match) return match[1];
  
  // Tentar computedStyle
  const computedStyle = window.getComputedStyle(element);
  const bgImage = computedStyle.backgroundImage;
  const bgMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
  if (bgMatch) return bgMatch[1];
  
  return null;
}

// Função para limpar e padronizar preços
function parsePrice(priceText) {
  if (!priceText) return 0;
  
  // Remover R$, pontos e converter vírgula em ponto
  const cleaned = priceText
    .replace(/R\$\s*/gi, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');
  
  return parseFloat(cleaned) || 0;
}

// Função para extrair número de texto (1.2k, 2.5mil, etc)
function parseCount(text) {
  if (!text) return '0';
  
  const match = text.match(/(\d+[.,]?\d*)\s*(k|mil|m)?/i);
  if (!match) return '0';
  
  let number = parseFloat(match[1].replace(',', '.'));
  const suffix = match[2]?.toLowerCase();
  
  if (suffix === 'k' || suffix === 'mil') {
    number *= 1000;
  } else if (suffix === 'm') {
    number *= 1000000;
  }
  
  return number > 1000 ? `${(number/1000).toFixed(1)}k` : number.toString();
}

// Função principal de extração com scroll automático
async function extractProductDataAdvanced() {
  try {
    console.log('Iniciando extração avançada...');
    
    // Scroll para carregar todos os elementos
    await autoScroll();
    
    // Aguardar elementos dinâmicos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const productData = {
      url: window.location.href,
      extractedAt: new Date().toISOString(),
      product: {},
      debug: {} // Informações de debug
    };

    // Nome do produto
    const nameElement = findElement(SELECTORS.productName);
    productData.product.name = nameElement?.textContent.trim() || '';
    productData.debug.nameFound = !!nameElement;

    // Preços
    const currentPriceElement = findElement(SELECTORS.currentPrice);
    const originalPriceElement = findElement(SELECTORS.originalPrice);
    
    productData.product.price = {
      current: parsePrice(currentPriceElement?.textContent),
      original: parsePrice(originalPriceElement?.textContent) || parsePrice(currentPriceElement?.textContent),
      currency: 'BRL',
      discount: 0
    };
    
    // Calcular desconto
    if (productData.product.price.original > productData.product.price.current) {
      productData.product.price.discount = Math.round(
        ((productData.product.price.original - productData.product.price.current) / 
         productData.product.price.original) * 100
      );
    }

    // Avaliação
    const ratingElement = findElement(SELECTORS.rating);
    const ratingText = ratingElement?.textContent || '';
    const ratingMatch = ratingText.match(/(\d+[.,]?\d*)/);
    productData.product.rating = ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : 0;
    
    const reviewElement = findElement(SELECTORS.reviewCount);
    productData.product.reviewCount = parseCount(reviewElement?.textContent || '0');

    // Vendas
    const soldElement = findElement(SELECTORS.soldCount);
    const soldText = soldElement?.textContent || '';
    const soldMatch = soldText.match(/(\d+[.,]?\d*[kKmM]?)\s*vendido/i);
    productData.product.soldCount = soldMatch ? parseCount(soldMatch[1]) : '0';

    // Imagens
    productData.product.images = [];
    
    // Imagem principal
    const mainImageElement = findElement(SELECTORS.mainImage);
    const mainImageUrl = extractImageUrl(mainImageElement);
    if (mainImageUrl) {
      productData.product.images.push(cleanImageUrl(mainImageUrl));
    }
    
    // Thumbnails
    const thumbnailElements = findElements(SELECTORS.thumbnails);
    thumbnailElements.forEach(el => {
      const url = extractImageUrl(el);
      if (url && !productData.product.images.includes(cleanImageUrl(url))) {
        productData.product.images.push(cleanImageUrl(url));
      }
    });

    // Variações - busca mais abrangente
    productData.product.variations = await extractVariations();

    // Descrição
    const descElement = findElement(SELECTORS.description);
    productData.product.description = descElement?.innerText.trim() || '';

    // Especificações - buscar em tabelas ou listas
    productData.product.specifications = extractSpecifications();

    // Informações da loja
    const shopElement = findElement(SELECTORS.shopName);
    productData.shop = {
      name: shopElement?.textContent.trim() || '',
      url: shopElement?.href || ''
    };

    // Comentários - scroll até a seção de comentários
    await scrollToReviews();
    productData.product.comments = await extractComments();

    // Informações adicionais
    productData.product.categories = extractCategories();
    productData.product.shipping = extractShippingInfo();

    console.log('Extração concluída:', productData);
    return productData;

  } catch (error) {
    console.error('Erro na extração avançada:', error);
    return { error: error.message, stack: error.stack };
  }
}

// Função para scroll automático
async function autoScroll() {
  const distance = 100;
  const delay = 100;
  const maxScrolls = 30;
  let scrolls = 0;
  
  while (scrolls < maxScrolls) {
    const beforeHeight = document.body.scrollHeight;
    window.scrollBy(0, distance);
    await new Promise(resolve => setTimeout(resolve, delay));
    const afterHeight = document.body.scrollHeight;
    
    if (beforeHeight === afterHeight) break;
    scrolls++;
  }
  
  // Voltar ao topo
  window.scrollTo(0, 0);
}

// Função para scroll até comentários
async function scrollToReviews() {
  const reviewSection = document.querySelector('[class*="product-ratings"]');
  if (reviewSection) {
    reviewSection.scrollIntoView({ behavior: 'smooth' });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Função para limpar URL de imagem
function cleanImageUrl(url) {
  if (!url) return '';
  
  // Remover parâmetros e converter para alta qualidade
  let cleanUrl = url.split('?')[0];
  
  // Se for thumbnail da Shopee, tentar obter versão maior
  if (cleanUrl.includes('_tn')) {
    cleanUrl = cleanUrl.replace('_tn', '');
  }
  
  return cleanUrl;
}

// Função avançada para extrair variações
async function extractVariations() {
  const variations = [];
  
  // Buscar todos os grupos de variação
  const variationGroups = document.querySelectorAll('div:has(> label)');
  
  for (const group of variationGroups) {
    const label = group.querySelector('label');
    if (!label) continue;
    
    const labelText = label.textContent.trim();
    if (!labelText || labelText.length > 50) continue;
    
    const buttons = group.querySelectorAll('button');
    if (buttons.length === 0) continue;
    
    const options = [];
    buttons.forEach(btn => {
      const text = btn.textContent.trim();
      if (text && text !== labelText) {
        options.push({
          value: text,
          selected: btn.getAttribute('aria-checked') === 'true' || 
                   btn.classList.contains('product-variation--selected'),
          disabled: btn.disabled,
          image: extractImageUrl(btn.querySelector('img'))
        });
      }
    });
    
    if (options.length > 0) {
      variations.push({
        type: labelText.replace(':', ''),
        options: options
      });
    }
  }
  
  return variations;
}

// Função para extrair especificações
function extractSpecifications() {
  const specs = {};
  
  // Buscar em diferentes formatos
  const specContainers = document.querySelectorAll(
    '[class*="product-detail"] > div, table tr, dl'
  );
  
  specContainers.forEach(container => {
    const text = container.textContent.trim();
    const colonIndex = text.indexOf(':');
    
    if (colonIndex > 0 && colonIndex < 50) {
      const key = text.substring(0, colonIndex).trim();
      const value = text.substring(colonIndex + 1).trim();
      
      if (key && value && value.length < 200) {
        specs[key] = value;
      }
    }
  });
  
  return specs;
}

// Função para extrair comentários com mais detalhes
async function extractComments() {
  const comments = [];
  const reviewElements = findElements(SELECTORS.reviewItem);
  
  for (let i = 0; i < Math.min(reviewElements.length, 10); i++) {
    const review = reviewElements[i];
    
    const userName = review.querySelector('[class*="user-name"], [class*="author"]')?.textContent.trim() || 'Anônimo';
    const comment = review.querySelector('[class*="content"], [class*="comment"]')?.textContent.trim() || '';
    const date = review.querySelector('[class*="time"], [class*="date"]')?.textContent.trim() || '';
    
    // Contar estrelas
    const stars = review.querySelectorAll('[class*="star"][class*="active"], [class*="star"][class*="full"]').length;
    
    // Buscar variação comprada
    const variation = review.querySelector('[class*="variation"]')?.textContent.trim() || '';
    
    // Buscar imagens do comentário
    const images = [];
    review.querySelectorAll('img[class*="review"], [class*="image"]').forEach(img => {
      const url = extractImageUrl(img);
      if (url) images.push(cleanImageUrl(url));
    });
    
    comments.push({
      user: userName,
      comment: comment,
      rating: stars,
      date: date,
      variation: variation,
      images: images,
      helpful: review.querySelector('[class*="helpful"]')?.textContent.trim() || '0'
    });
  }
  
  return comments;
}

// Função para extrair categorias
function extractCategories() {
  const categories = [];
  const breadcrumbs = document.querySelectorAll('[class*="breadcrumb"] a, nav a');
  
  breadcrumbs.forEach(link => {
    const text = link.textContent.trim();
    if (text && text !== 'Home' && text !== 'Início') {
      categories.push(text);
    }
  });
  
  return categories;
}

// Função para extrair informações de envio
function extractShippingInfo() {
  const shipping = {
    freeShipping: false,
    estimatedDays: '',
    from: ''
  };
  
  // Buscar indicadores de frete grátis
  const freeShippingElement = document.querySelector('[class*="free-shipping"], [class*="frete"]');
  shipping.freeShipping = !!freeShippingElement;
  
  // Buscar origem
  const fromElement = document.querySelector('[class*="ship-from"], [class*="location"]');
  shipping.from = fromElement?.textContent.trim() || '';
  
  return shipping;
}

// Listener atualizado
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    extractProductDataAdvanced().then(data => {
      sendResponse({ success: true, data: data });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  if (request.action === 'ping') {
    sendResponse({ success: true, version: 'advanced' });
  }
});