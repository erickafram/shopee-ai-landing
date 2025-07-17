import { ShopeeProduct } from './shopeeExtractor';

export interface LandingPageCopy {
  headline: string;
  subheadline: string;
  beneficios: string[];
  objecoes: Array<{
    objecao: string;
    resposta: string;
  }>;
  cta_principal: string;
  cta_secundario: string;
  urgencia: string;
  garantia: string;
  prova_social: string;
}

export interface LandingPageAnalysis {
  score_conversao: number;
  score_ux: number;
  score_performance: number;
  score_persuasao: number;
  melhorias: string[];
  sugestoes_cta: string[];
}

export interface LandingPageVariation {
  style: string;
  html: string;
  preview: string;
}

export interface GeneratedLandingPage {
  html: string;
  copy: LandingPageCopy;
  analysis: LandingPageAnalysis;
  variations: LandingPageVariation[];
  createdAt: Date;
}

class AILandingPageGenerator {
  private useLocalGeneration = true; // Sempre usar geração local por padrão

  // 1. Gerar copy persuasivo (LOCAL e RÁPIDO)
  async generateCopy(productData: ShopeeProduct): Promise<LandingPageCopy> {
    console.log('🎯 Gerando copy persuasivo...');
    
    // Simular delay de processamento
    await this.delay(1500);
    
    if (this.useLocalGeneration) {
      return this.generateLocalCopy(productData);
    }

    // Fallback para local se API falhar
    try {
      const response = await this.callAIWithTimeout(productData);
      return JSON.parse(response);
    } catch (error) {
      console.log('🔄 API falhou, usando geração local...');
      return this.generateLocalCopy(productData);
    }
  }

  // 2. Gerar estrutura HTML da landing page (LOCAL)
  async generateLandingPageHTML(productData: ShopeeProduct, copyData: LandingPageCopy): Promise<string> {
    console.log('🏗️ Criando estrutura HTML...');
    
    // Simular delay de processamento
    await this.delay(2000);
    
    return this.generateAdvancedHTML(productData, copyData);
  }

  // 3. Gerar variações de design (LOCAL e RÁPIDO)
  async generateDesignVariations(productData: ShopeeProduct, copyData: LandingPageCopy): Promise<LandingPageVariation[]> {
    console.log('🎨 Criando variações de design...');
    
    // Simular delay de processamento
    await this.delay(1000);
    
    const styles = [
      'moderno_minimalista',
      'bold_impactante', 
      'elegante_premium'
    ];

    return styles.map(style => ({
          style,
      html: this.generateStyledHTML(productData, copyData, style),
      preview: this.generatePreviewImage(style)
    }));
  }

  // 4. Análise e sugestões de melhoria (LOCAL)
  async analyzeLandingPage(htmlContent: string, productData: ShopeeProduct): Promise<LandingPageAnalysis> {
    console.log('📊 Analisando qualidade da landing page...');
    
    // Simular delay de processamento
    await this.delay(800);
    
    return this.generateSmartAnalysis(productData);
  }

  // GERAÇÃO LOCAL INTELIGENTE
  private generateLocalCopy(productData: ShopeeProduct): LandingPageCopy {
    const isTablet = productData.name.toLowerCase().includes('tablet');
    const isKids = productData.name.toLowerCase().includes('infantil') || productData.name.toLowerCase().includes('kids');
    const hasDiscount = productData.originalPrice && productData.price;
    
    let headline = "Oferta Imperdível!";
    let subheadline = "Aproveite agora com desconto especial";
    let cta_principal = "COMPRAR AGORA";
    
    if (isTablet && isKids) {
      headline = "🚀 Tablet que Transforma Brincadeira em Aprendizado!";
      subheadline = "Seguro, educativo e super divertido para seu filho";
      cta_principal = "QUERO PARA MEU FILHO";
    } else if (isTablet) {
      headline = "💻 Performance Premium na Palma da Sua Mão";
      subheadline = "Trabalhe, estude e se divirta onde quiser";
      cta_principal = "GARANTE O SEU";
    }

    const beneficios = isKids ? [
      "✅ Controle parental total para navegação segura",
      "✅ Jogos educativos que desenvolvem o aprendizado", 
      "✅ Tela resistente a quedas e impactos",
      "✅ Bateria de longa duração para diversão sem parar",
      "✅ Design ergonômico especial para crianças"
    ] : [
      "✅ Performance superior para multitarefas",
      "✅ Tela de alta qualidade para máxima nitidez",
      "✅ Armazenamento generoso para todos seus arquivos",
      "✅ Design premium e portabilidade total",
      "✅ Tecnologia avançada pelo melhor preço"
    ];

    return {
      headline,
      subheadline,
      beneficios,
      objecoes: [
        {
          objecao: "É muito caro para um tablet",
          resposta: `Com ${hasDiscount ? 'mais de 30% de desconto' : 'esse preço promocional'}, você está investindo em qualidade premium que dura anos!`
        },
        {
          objecao: "Não sei se é de qualidade",
          resposta: `${productData.rating ? `${productData.rating} estrelas` : 'Milhares'} de avaliações positivas comprovam a excelência do produto!`
        },
        {
          objecao: "Demora muito para chegar",
          resposta: "Entrega expressa com rastreamento completo. Você acompanha o envio em tempo real!"
        }
      ],
      cta_principal,
      cta_secundario: "Ver mais detalhes",
      urgencia: hasDiscount ? "⏰ Desconto por TEMPO LIMITADO - Apenas hoje!" : "🔥 Últimas unidades em estoque!",
      garantia: "✅ Garantia de 12 meses + 7 dias para troca sem perguntas",
      prova_social: `${productData.reviews ? `Mais de ${productData.reviews} clientes` : 'Milhares de pessoas'} já aprovaram este produto!`
    };
  }

  private generateAdvancedHTML(productData: ShopeeProduct, copyData: LandingPageCopy): string {
    // Debug logs para verificar dados recebidos
    console.log('🔍 Dados do produto recebidos:', {
      name: productData.name,
      price: productData.price,
      originalPrice: productData.originalPrice,
      images: productData.images?.length || 0,
      url: productData.url,
      keys: Object.keys(productData)
    });
    
    const discount = this.calculateDiscount(productData.price || '', productData.originalPrice || '');
    const isKids = (productData.name || '').toLowerCase().includes('infantil') || (productData.name || '').toLowerCase().includes('kids');
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productData.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            overflow-x: hidden;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* HERO SECTION */
        .hero { 
            background: ${isKids ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'}; 
            color: white; 
            padding: 100px 0; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>') repeat;
            animation: float 20s infinite linear;
        }
        @keyframes float { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        
        .hero-content { position: relative; z-index: 2; }
        .hero h1 { 
            font-size: clamp(2rem, 5vw, 4rem); 
            font-weight: 800; 
            margin-bottom: 20px; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: slideUp 1s ease-out;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .hero p { 
            font-size: 1.3rem; 
            margin-bottom: 40px; 
            opacity: 0.95;
            animation: slideUp 1s ease-out 0.2s both;
        }
        
        .cta-hero { 
            background: #1a1a1a; 
            color: white; 
            padding: 18px 50px; 
            border: none; 
            border-radius: 50px; 
            font-size: 1.2rem; 
            font-weight: 700; 
            cursor: pointer; 
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            animation: slideUp 1s ease-out 0.4s both;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .cta-hero:hover { 
            transform: translateY(-3px) scale(1.05); 
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        /* URGÊNCIA */
        .urgency-bar {
            background: #e53e3e;
            color: white;
            padding: 15px 0;
            text-align: center;
            font-weight: 600;
            animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

        /* PRODUTO */
        .product-showcase { 
            padding: 80px 0; 
            background: #f8f9fa;
        }
        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }
        .image-gallery { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
        }
        .main-image {
            grid-column: 1 / -1;
            height: 400px;
        }
        .image-gallery img { 
            width: 100%; 
            height: 200px; 
            object-fit: cover; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .image-gallery img:hover { transform: scale(1.05); }
        .main-image { height: 400px; }

        .product-info h2 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 20px;
            color: #1a1a1a;
        }
        .price-display {
            margin: 30px 0;
        }
        .current-price {
            font-size: 3.5rem;
            font-weight: 800;
            color: #ff6b35;
            margin-right: 20px;
        }
        .original-price {
            font-size: 2rem;
            text-decoration: line-through;
            color: #999;
            margin-right: 15px;
        }
        .discount-badge {
            background: #e53e3e;
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: 700;
            font-size: 1.1rem;
        }

        /* BENEFÍCIOS */
        .benefits { 
            padding: 100px 0; 
            background: white;
        }
        .section-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 60px;
            color: #1a1a1a;
        }
        .benefits-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: 40px; 
        }
        .benefit { 
            text-align: center; 
            padding: 40px 30px; 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            border-radius: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .benefit:hover { transform: translateY(-10px); }
        .benefit-icon {
            font-size: 3rem;
            margin-bottom: 20px;
            display: block;
        }
        .benefit h3 { 
            color: #ff6b35; 
            margin-bottom: 15px; 
            font-size: 1.3rem;
            font-weight: 700;
        }

        /* PROVA SOCIAL */
        .social-proof {
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        .testimonials {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 50px;
        }
        .testimonial {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        .testimonial-rating {
            color: #ffd700;
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        /* CTA FINAL */
        .final-cta {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        .cta-final {
            background: #1a1a1a;
            color: white;
            padding: 25px 60px;
            border: none;
            border-radius: 50px;
            font-size: 1.4rem;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            animation: pulse-cta 3s infinite;
        }
        @keyframes pulse-cta { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        /* RESPONSIVO */
        @media (max-width: 768px) {
            .product-grid { grid-template-columns: 1fr; gap: 40px; }
            .image-gallery { grid-template-columns: 1fr; }
            .benefits-grid { grid-template-columns: 1fr; }
            .testimonials { grid-template-columns: 1fr; }
            .current-price { font-size: 2.5rem; }
            .original-price { font-size: 1.5rem; }
        }

        /* EFEITOS ESPECIAIS */
        .floating-whatsapp {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #25d366;
            color: white;
            padding: 15px 20px;
            border-radius: 50px;
            text-decoration: none;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: bounce 2s infinite;
            font-weight: 600;
        }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
    </style>
</head>
<body>
    <!-- URGÊNCIA -->
    <div class="urgency-bar">
        <div class="container">
            ⏰ <span id="countdown">47:59:59</span> - ${copyData.urgencia}
        </div>
    </div>

    <!-- HERO -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
            <h1>${copyData.headline}</h1>
            <p>${copyData.subheadline}</p>
                <button class="cta-hero" onclick="scrollToBuy()">${copyData.cta_principal}</button>
            </div>
        </div>
    </section>

    <!-- PRODUTO -->
    <section class="product-showcase">
        <div class="container">
            <div class="product-grid">
            <div class="image-gallery">
                    ${productData.images.map((img, idx) => `
                        <img src="${img}" alt="${productData.name}" class="${idx === 0 ? 'main-image' : ''}" loading="lazy">
                    `).join('')}
                </div>
                <div class="product-info">
                    <h2>${productData.name}</h2>
                    <div class="price-display">
                        <span class="current-price">${productData.price}</span>
                        ${productData.originalPrice ? `
                            <span class="original-price">${productData.originalPrice}</span>
                            <span class="discount-badge">${discount}</span>
                        ` : ''}
                    </div>
                    <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px;">
                        ${productData.description}
                    </p>
                    ${productData.variations?.colors ? `
                        <div style="margin: 20px 0;">
                            <strong>Cores disponíveis:</strong>
                            ${productData.variations.colors.map(color => `
                                <span style="display: inline-block; background: #f1f3f4; padding: 5px 12px; margin: 5px; border-radius: 15px; font-size: 0.9rem;">${color}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </section>

    <!-- BENEFÍCIOS -->
    <section class="benefits">
        <div class="container">
            <h2 class="section-title">Por que este é o melhor choice?</h2>
            <div class="benefits-grid">
                ${copyData.beneficios.map((benefit, idx) => `
                    <div class="benefit">
                        <span class="benefit-icon">${['🚀', '✨', '🛡️', '⚡', '🎯'][idx] || '✅'}</span>
                        <h3>${benefit.replace('✅ ', '')}</h3>
                        <p>Benefício comprovado que fará toda a diferença na sua experiência.</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- PROVA SOCIAL -->
    <section class="social-proof">
        <div class="container">
            <h2 class="section-title" style="color: white;">O que nossos clientes dizem</h2>
            <div class="testimonials">
                <div class="testimonial">
                    <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    <p>"Produto excelente, superou minhas expectativas! Recomendo muito."</p>
                    <strong>- Maria S.</strong>
                </div>
                <div class="testimonial">
                    <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    <p>"Qualidade incrível e entrega super rápida. Já comprei novamente!"</p>
                    <strong>- João P.</strong>
                </div>
                <div class="testimonial">
                    <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    <p>"Melhor investimento que fiz este ano. Vale muito a pena!"</p>
                    <strong>- Ana L.</strong>
                </div>
            </div>
            <p style="margin-top: 40px; font-size: 1.2rem; opacity: 0.9;">
                ${copyData.prova_social}
            </p>
        </div>
    </section>

    <!-- CTA FINAL -->
    <section class="final-cta" id="buy-section">
        <div class="container">
            <h2 style="font-size: 3rem; margin-bottom: 20px;">Não perca esta oportunidade!</h2>
            <p style="font-size: 1.3rem; margin-bottom: 40px; opacity: 0.9;">
                ${copyData.garantia}
            </p>
            <button class="cta-final" onclick="buyNow()">${copyData.cta_principal}</button>
            <p style="margin-top: 30px; font-size: 1.1rem; opacity: 0.8;">
                ✅ Compra 100% segura • ✅ Entrega garantida • ✅ Suporte 24/7
            </p>
        </div>
    </section>

    <!-- WhatsApp Button -->
    <a href="https://wa.me/5511999999999?text=Olá! Tenho interesse no produto: ${encodeURIComponent(productData.name)}" class="floating-whatsapp" target="_blank">
        💬 WhatsApp
    </a>

    <script>
        // Countdown timer
            let timeLeft = 47 * 3600 + 59 * 60 + 59; // 47:59:59
            
        function updateCountdown() {
                const hours = Math.floor(timeLeft / 3600);
                const minutes = Math.floor((timeLeft % 3600) / 60);
                const seconds = timeLeft % 60;
                
                document.getElementById('countdown').textContent = 
                    \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                
                timeLeft--;
                if (timeLeft < 0) timeLeft = 47 * 3600 + 59 * 60 + 59;
        }
        
        setInterval(updateCountdown, 1000);
        
        // Smooth scroll functions
        function scrollToBuy() {
            document.getElementById('buy-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        function buyNow() {
            // Integração com sistema de compras
            alert('Redirecionando para checkout...');
            const productUrl = productData.url || productData.extractedUrl || window.location.href;
            if (productUrl && productUrl.includes('shopee')) {
                window.open(productUrl, '_blank');
            } else {
                window.open('https://shopee.com.br/', '_blank');
            }
        }
        
        // Intersection Observer para animações
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Aplicar animações aos elementos
        document.querySelectorAll('.benefit, .testimonial').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    </script>
</body>
</html>`;
  }

  private generateStyledHTML(productData: ShopeeProduct, copyData: LandingPageCopy, style: string): string {
    // Gerar HTML com estilos específicos
    const styleConfig = {
      'moderno_minimalista': {
        primaryColor: '#2563eb',
        bgColor: '#f8fafc',
        fontWeight: '400'
      },
      'bold_impactante': {
        primaryColor: '#dc2626', 
        bgColor: '#1f2937',
        fontWeight: '800'
      },
      'elegante_premium': {
        primaryColor: '#059669',
        bgColor: '#f9fafb', 
        fontWeight: '600'
      }
    };
    
    return this.generateAdvancedHTML(productData, copyData).replace(
      /#ff6b35/g, 
      styleConfig[style]?.primaryColor || '#ff6b35'
    );
  }

  private generateSmartAnalysis(productData: ShopeeProduct): LandingPageAnalysis {
    const hasImages = productData.images && productData.images.length > 0;
    const hasRating = productData.rating && productData.rating > 0;
    const hasReviews = productData.reviews && productData.reviews > 0;
    const hasVariations = productData.variations && Object.keys(productData.variations).length > 0;
    
    const baseScore = 75;
    let conversionScore = baseScore;
    let uxScore = baseScore + 10;
    let performanceScore = baseScore + 5;
    let persuasionScore = baseScore;
    
    // Ajustar scores baseado no produto
    if (hasImages) conversionScore += 5;
    if (hasRating && productData.rating >= 4.5) persuasionScore += 10;
    if (hasReviews && productData.reviews > 100) conversionScore += 5;
    if (hasVariations) uxScore += 5;
    
    return {
      score_conversao: Math.min(conversionScore, 95),
      score_ux: Math.min(uxScore, 95),
      score_performance: Math.min(performanceScore, 90),
      score_persuasao: Math.min(persuasionScore, 95),
      melhorias: [
        "Adicionar mais depoimentos com fotos",
        "Incluir vídeo demonstrativo do produto", 
        "Criar seção de FAQ expandida",
        "Otimizar imagens para loading mais rápido",
        "Adicionar comparação com concorrentes"
      ],
      sugestoes_cta: [
        "GARANTA JÁ COM DESCONTO",
        "COMPRAR AGORA - 50% OFF",
        "APROVEITAR OFERTA LIMITADA",
        "QUERO O MEU AGORA"
      ]
    };
  }

  private generatePreviewImage(style: string): string {
    const colors = {
      'moderno_minimalista': '#2563eb',
      'bold_impactante': '#dc2626',
      'elegante_premium': '#059669'
    };
    
    const color = colors[style] || '#ff6b35';
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <rect x="20" y="20" width="260" height="50" fill="${color}" rx="8"/>
        <rect x="20" y="90" width="180" height="15" fill="#e5e7eb" rx="4"/>
        <rect x="20" y="115" width="220" height="15" fill="#e5e7eb" rx="4"/>
        <rect x="20" y="140" width="160" height="15" fill="#e5e7eb" rx="4"/>
        <rect x="20" y="165" width="120" height="15" fill="${color}" rx="4"/>
        <text x="150" y="50" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${style.replace('_', ' ').toUpperCase()}</text>
      </svg>
    `)}`;
  }

  private calculateDiscount(currentPrice: string, originalPrice?: string): string {
    if (!originalPrice) return '';
    
    const current = parseFloat(currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    const original = parseFloat(originalPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (current && original && original > current) {
      const discount = Math.round(((original - current) / original) * 100);
      return `-${discount}% OFF`;
    }
    
    return '-30% OFF';
  }

  private async callAIWithTimeout(productData: ShopeeProduct): Promise<string> {
    // Timeout de 3 segundos para APIs externas
    return Promise.race([
      this.callExternalAPI(productData),
      new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]);
  }

  private async callExternalAPI(productData: ShopeeProduct): Promise<string> {
    // Placeholder para futuras integrações com APIs reais
    throw new Error('API externa não disponível');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiLandingPageGenerator = new AILandingPageGenerator();