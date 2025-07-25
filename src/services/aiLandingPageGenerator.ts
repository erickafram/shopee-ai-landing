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
    await this.delay(1500);
    if (this.useLocalGeneration) {
      return this.generateLocalCopy(productData);
    }
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
    console.log('🏗️ Criando estrutura HTML com novo layout...');
    await this.delay(2000);
    // **A chamada agora é para o novo método de geração de HTML**
    return this.generateShopeeInspiredHTML(productData, copyData);
  }

  // 3. Gerar variações de design (LOCAL e RÁPIDO)
  async generateDesignVariations(productData: ShopeeProduct, copyData: LandingPageCopy): Promise<LandingPageVariation[]> {
    console.log('🎨 Criando variações de design...');
    await this.delay(1000);
    const styles = ['moderno_minimalista', 'bold_impactante', 'elegante_premium'];
    return styles.map(style => ({
          style,
      html: this.generateStyledHTML(productData, copyData, style),
      preview: this.generatePreviewImage(style)
    }));
  }

  // 4. Análise e sugestões de melhoria (LOCAL)
  async analyzeLandingPage(htmlContent: string, productData: ShopeeProduct): Promise<LandingPageAnalysis> {
    console.log('📊 Analisando qualidade da landing page...');
    await this.delay(800);
    return this.generateSmartAnalysis(productData);
  }

  // FUNÇÃO PARA GERAR BENEFÍCIOS INTELIGENTES BASEADOS NA DESCRIÇÃO
  private generateSmartBenefits(productData: ShopeeProduct): string[] {
    const description = (productData.description || '').toLowerCase();
    const name = (productData.name || '').toLowerCase();
    const benefits: string[] = [];
    const fullText = `${description} ${name}`;

    // Detectar tipo de produto
    const isShoe = name.includes('sapato') || name.includes('tenis') || name.includes('sandalia') || name.includes('chinelo') || name.includes('oxford') || name.includes('mocassim');
    const isSocialShoe = isShoe && (fullText.includes('social') || fullText.includes('elegante') || fullText.includes('formal') || fullText.includes('oxford') || fullText.includes('mocassim'));

    // Benefícios específicos para sapatos sociais/elegantes
    if (isSocialShoe) {
      // Benefícios baseados na descrição real
      if (fullText.includes('couro') || fullText.includes('sintético')) {
        benefits.push('👔 Material premium que transmite elegância e sofisticação');
      }

      if (fullText.includes('hidrofóbico') || fullText.includes('água') || fullText.includes('resistente')) {
        benefits.push('💧 Proteção contra água e sujeira - sempre impecável');
      }

      if (fullText.includes('microfibra') || fullText.includes('antibacteriano') || fullText.includes('bactéria')) {
        benefits.push('🦠 Tecnologia antibacteriana que elimina odores');
      }

      if (fullText.includes('eva') || fullText.includes('palmilha') || fullText.includes('conforto')) {
        benefits.push('☁️ Palmilha EVA que se adapta ao seu pé - conforto o dia todo');
      }

      if (fullText.includes('postura') || fullText.includes('imponente') || fullText.includes('confiança')) {
        benefits.push('💪 Postura imponente que aumenta sua confiança profissional');
      }

      if (fullText.includes('pvc') || fullText.includes('resistente') || fullText.includes('durável')) {
        benefits.push('🛡️ Solado ultra-resistente que dura anos');
      }

      // Benefícios adicionais específicos para sapatos sociais
      if (benefits.length < 5) {
        const additionalBenefits = [
          '✨ Design moderno que impressiona em qualquer ambiente',
          '🎯 Perfeito para reuniões, eventos e ocasiões especiais',
          '⚡ Fácil de limpar e manter sempre novo',
          '📏 Tabela de medidas precisa para ajuste perfeito',
          '🏆 Qualidade premium com garantia de satisfação'
        ];

        additionalBenefits.forEach(benefit => {
          if (benefits.length < 5) {
            benefits.push(benefit);
          }
        });
      }
    } else if (isShoe) {
      // Benefícios para outros tipos de calçados
      if (fullText.includes('conforto') || fullText.includes('macio')) {
        benefits.push('😌 Conforto excepcional para uso prolongado');
      }

      if (fullText.includes('design') || fullText.includes('estilo')) {
        benefits.push('✨ Design moderno que combina com qualquer look');
      }

      if (fullText.includes('resistente') || fullText.includes('durável')) {
        benefits.push('💪 Durabilidade superior que resiste ao uso diário');
      }

      if (fullText.includes('leve') || fullText.includes('peso')) {
        benefits.push('⚡ Leveza que você sente a cada passo');
      }

      if (fullText.includes('flexível') || fullText.includes('movimento')) {
        benefits.push('🤸 Flexibilidade total para seus movimentos');
      }
    } else {
      // Benefícios genéricos para outros produtos
      const qualityKeywords = ['premium', 'qualidade', 'alta qualidade', 'superior', 'excelente', 'resistente', 'durável'];
      const comfortKeywords = ['conforto', 'confortável', 'macio', 'ergonômico', 'suave', 'flexível'];
      const designKeywords = ['design', 'estilo', 'elegante', 'moderno', 'bonito', 'atraente'];
      const functionalityKeywords = ['funcional', 'prático', 'útil', 'versátil', 'multifuncional'];
      const technologyKeywords = ['tecnologia', 'avançado', 'inovador', 'inteligente', 'smart'];

      if (this.containsAnyKeyword(fullText, qualityKeywords)) {
        benefits.push('🔥 Qualidade premium que supera expectativas');
      }

      if (this.containsAnyKeyword(fullText, comfortKeywords)) {
        benefits.push('😌 Conforto excepcional para uso prolongado');
      }

      if (this.containsAnyKeyword(fullText, designKeywords)) {
        benefits.push('✨ Design moderno que impressiona');
      }

      if (this.containsAnyKeyword(fullText, functionalityKeywords)) {
        benefits.push('🎯 Funcionalidade que você realmente precisa');
      }

      if (this.containsAnyKeyword(fullText, technologyKeywords)) {
        benefits.push('🚀 Tecnologia avançada de última geração');
      }
    }

    // Benefícios universais baseados em características específicas
    if (fullText.includes('garantia')) {
      benefits.push('✅ Garantia de qualidade e satisfação');
    }

    if (fullText.includes('entrega') || fullText.includes('envio')) {
      benefits.push('🚚 Entrega rápida e segura em todo Brasil');
    }

    // Se ainda não tem benefícios suficientes, adicionar genéricos relevantes
    if (benefits.length === 0) {
      benefits.push(
        '🔥 Qualidade premium que faz a diferença',
        '💪 Durabilidade testada e comprovada',
        '✨ Design moderno e atraente',
        '🎯 Funcionalidade que você precisa',
        '💰 Melhor custo-benefício do mercado'
      );
    }

    // Limitar a 5 benefícios para não sobrecarregar
    return benefits.slice(0, 5);
  }
  
  // Função auxiliar para verificar se o texto contém alguma palavra-chave
  private containsAnyKeyword(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  // GERAÇÃO LOCAL INTELIGENTE (Sem alterações nesta função)
  private generateLocalCopy(productData: ShopeeProduct): LandingPageCopy {
    const productName = productData.name.toLowerCase();
    const hasDiscount = productData.originalPrice && productData.price;
    const isTablet = productName.includes('tablet');
    const isKids = productName.includes('infantil') || productName.includes('kids');
    const isShoe = productName.includes('sapato') || productName.includes('tenis') || productName.includes('sandalia') || productName.includes('chinelo');
    const isClothing = productName.includes('camisa') || productName.includes('blusa') || productName.includes('vestido') || productName.includes('calça') || productName.includes('short');
    const isPhone = productName.includes('celular') || productName.includes('smartphone') || productName.includes('iphone') || productName.includes('samsung');
    const isWatch = productName.includes('relogio') || productName.includes('smartwatch');
    const isBag = productName.includes('bolsa') || productName.includes('mochila') || productName.includes('carteira');
    let headline = productData.name;
    let subheadline = "Produto original da Shopee com garantia e entrega rápida";
    let cta_principal = "COMPRAR AGORA";
    // Gerar benefícios baseados na descrição real do produto
    let beneficios: string[] = this.generateSmartBenefits(productData);

    if (isTablet && isKids) {
      headline = "🚀 Tablet que Transforma Brincadeira em Aprendizado!";
      subheadline = "Seguro, educativo e super divertido para seu filho";
      cta_principal = "QUERO PARA MEU FILHO";
    } else if (isTablet) {
      headline = "💻 Performance Premium na Palma da Sua Mão";
      subheadline = "Trabalhe, estude e se divirta onde quiser";
      cta_principal = "GARANTE O SEU";
    } else if (isShoe) {
      const isSocial = productName.includes('social') || productName.includes('elegante') || productName.includes('formal');
      const isSneaker = productName.includes('tenis') || productName.includes('esportivo') || productName.includes('casual');
      if (isSocial) {
        headline = "👞 Elegância e Conforto que Impressionam!";
        subheadline = "O sapato social perfeito para sua confiança e sucesso profissional";
        cta_principal = "QUERO MEU SAPATO";
      } else if (isSneaker) {
        headline = "👟 Conforto e Estilo para Seus Pés!";
        subheadline = "O tênis perfeito para seu dia a dia com máximo conforto";
        cta_principal = "QUERO MEU TÊNIS";
      } else {
        headline = "👠 Pisada Perfeita, Estilo Garantido!";
        subheadline = "Calçado de qualidade que une conforto e beleza";
        cta_principal = "QUERO AGORA";
      }
    } else if (isClothing) {
      headline = "👕 Vista-se com Estilo e Confiança!";
      subheadline = "Roupa de qualidade que valoriza sua personalidade";
      cta_principal = "QUERO ESSA PEÇA";
    } else if (isPhone) {
      headline = "📱 Tecnologia que Cabe na Sua Mão!";
      subheadline = "Smartphone poderoso para conectar você ao mundo";
      cta_principal = "GARANTIR O MEU";
    } else if (isWatch) {
      headline = "⌚ Tempo e Estilo no Seu Pulso!";
      subheadline = "Relógio que combina funcionalidade e elegância";
      cta_principal = "QUERO NO MEU PULSO";
    } else if (isBag) {
      headline = "👜 Praticidade e Estilo Onde Você For!";
      subheadline = "Bolsa perfeita para organizar sua vida com elegância";
      cta_principal = "QUERO COMIGO";
    }
    return {
      headline,
      subheadline,
      beneficios,
      objecoes: [{
          objecao: "É muito caro para um tablet",
          resposta: `Com ${hasDiscount ? 'mais de 30% de desconto' : 'esse preço promocional'}, você está investindo em qualidade premium que dura anos!`
      }, {
          objecao: "Não sei se é de qualidade",
          resposta: `${productData.rating ? `${productData.rating} estrelas` : 'Milhares'} de avaliações positivas comprovam a excelência do produto!`
      }, {
          objecao: "Demora muito para chegar",
          resposta: "Entrega expressa com rastreamento completo. Você acompanha o envio em tempo real!"
      }],
      cta_principal,
      cta_secundario: "Ver mais detalhes",
      urgencia: hasDiscount ? "⏰ Desconto por TEMPO LIMITADO - Apenas hoje!" : "🔥 Últimas unidades em estoque!",
      garantia: "✅ Garantia de 12 meses + 7 dias para troca sem perguntas",
      prova_social: `${productData.reviews ? `Mais de ${productData.reviews} clientes` : 'Milhares de pessoas'} já aprovaram este produto!`
    };
  }

  // =================================================================
  // NOVA FUNÇÃO PARA GERAR O HTML COM LAYOUT E ESTILO MELHORADOS
  // =================================================================
  private generateShopeeInspiredHTML(productData: ShopeeProduct, copyData: LandingPageCopy): string {
    const discount = this.calculateDiscount(productData.price || '', productData.originalPrice || '');
    const savings = this.calculateSavings(productData.price || '', productData.originalPrice || '');
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productData.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #EE4D2D; /* Cor laranja oficial da Shopee */
            --color-primary-dark: #D73210;
            --color-secondary: #00BFA5; /* Verde para destacar botões/garantia */
            --color-text: #222222; /* Texto mais escuro como na Shopee */
            --color-text-light: #757575; /* Cinza mais claro */
            --color-background: #F5F5F5; /* Fundo cinza claro da Shopee */
            --color-white: #FFFFFF;
            --color-border: #E5E5E5; /* Bordas mais suaves */
            --color-card-bg: #FFFFFF; /* Fundo dos cards */
            --color-discount: #FF424F; /* Cor de desconto da Shopee */
            --font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-md: 0 2px 8px rgba(0,0,0,0.1);
            --shadow-lg: 0 4px 16px rgba(0,0,0,0.15);
            --border-radius: 4px; /* Bordas menos arredondadas como na Shopee */
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: var(--font-family);
            line-height: 1.5;
            color: var(--color-text);
            background-color: var(--color-background);
            font-size: 14px; /* Fonte menor como na Shopee */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0; /* Sem padding para ficar igual à Shopee */
            background-color: var(--color-background);
        }
        
        /* BARRA DE URGÊNCIA */
        .urgency-bar {
            background: var(--color-primary);
            color: var(--color-white);
            padding: 12px 0;
            text-align: center; 
            font-weight: 500;
            font-size: 0.95rem;
        }
        .urgency-bar #countdown { font-weight: 700; margin: 0 5px; }

        /* SEÇÃO PRINCIPAL DO PRODUTO (GRID) - Estilo Shopee */
        .product-section {
            padding-top: 0; /* Remover padding superior */
            background-color: var(--color-background);
        }
        .product-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px; /* Gap menor como na Shopee */
            background-color: var(--color-white);
            padding: 20px; /* Padding menor */
            border-radius: 0; /* Shopee não usa bordas arredondadas */
            box-shadow: none; /* Shopee usa sombras mais sutis */
            border: 1px solid var(--color-border);
            margin: 0 16px; /* Margem lateral */
        }
        @media (min-width: 768px) {
            .product-grid {
                grid-template-columns: 4fr 5fr;
                gap: 24px;
                margin: 0 auto;
                max-width: 1200px;
            }
        }

        /* RESPONSIVO MOBILE */
        @media (max-width: 767px) {
            .container { padding: 16px 12px; }
            
            .product-grid { 
                padding: 16px; 
                gap: 20px; 
            }
            
            .product-title { 
                font-size: 1.25rem; 
            }
            
            .current-price { 
                font-size: 1.8rem; 
            }
            
            .benefits-grid { 
                grid-template-columns: 1fr; 
                gap: 15px; 
            }
            
            .benefit-card { 
                padding: 12px; 
                gap: 12px; 
            }
            
            .benefit-icon { 
                font-size: 1.5rem; 
            }
            
            .testimonials-grid { 
                grid-template-columns: 1fr; 
            }

            /* Descrição mobile */
            .product-description h3 {
                font-size: 1rem;
                margin: 15px 0 8px 0;
            }
            
            .product-description {
            font-size: 0.9rem;
                line-height: 1.6;
            }
            
            .product-description ul {
                padding-left: 15px;
            }
            
            /* Estoque mobile */
            .stock-info {
                font-size: 0.85rem;
                padding: 10px 12px;
            }

                        /* Variações mobile */
            .section-label {
                display: block;
            }
            
            .colors-grid {
            gap: 8px;
        }
        
            .color-choice {
                font-size: 0.8rem;
                padding: 6px 12px;
            }

            /* Quantidade mobile */
            .quantity-controls {
                flex-direction: column;
                align-items: flex-start;
            gap: 12px;
        }
        
            .quantity-input-group {
                order: 1;
            }
            
            .quantity-presets {
                order: 2;
                gap: 6px;
            }
            
            .quantity-preset {
                padding: 5px 10px;
                font-size: 0.8rem;
            }
        }

        /* GALERIA DE IMAGENS */
        .image-gallery .main-image-wrapper {
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            overflow: hidden;
            margin-bottom: 16px;
            position: relative;
        }
        .image-gallery .main-product-image {
            width: 100%;
            height: auto;
            aspect-ratio: 1/1;
            object-fit: cover;
            display: block;
            cursor: zoom-in;
            transition: transform 0.3s ease;
        }
        .main-image-wrapper:hover .main-product-image { transform: scale(1.05); }
        .thumbnails-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 10px;
        }
        .product-thumbnail {
            width: 100%;
            height: auto;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: 6px;
            border: 2px solid var(--color-border);
            cursor: pointer;
            transition: border-color 0.2s ease;
        }
        .product-thumbnail:hover { border-color: var(--color-primary); }
        .product-thumbnail.active { border-color: var(--color-primary); box-shadow: 0 0 5px rgba(238, 77, 45, 0.5); }
        
        /* OFERTAS RELÂMPAGO - Layout igual à Shopee */
        .flash-sale-section {
            margin: 20px 0;
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow-md);
        }
        
        .flash-sale-header {
            background: var(--color-primary); /* Cor sólida como na Shopee */
            color: white;
            padding: 8px 12px; /* Padding menor */
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 12px; /* Fonte menor como na Shopee */
        }

        .flash-sale-title {
            font-size: 12px; /* Fonte menor */
            font-weight: 600; /* Peso menor */
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }
        
        .flash-sale-timer {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.8rem;
        }
        
        .timer-icon {
            font-size: 1rem;
        }
        
        .timer-text {
            font-weight: 500;
        }
        
        .countdown-timer {
            display: flex;
            gap: 4px;
        }
        
        .countdown-number {
            background: rgba(0, 0, 0, 0.3);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: 700;
            font-size: 0.85rem;
            min-width: 24px;
            text-align: center;
        }
        
        .flash-sale-pricing {
            background: linear-gradient(to bottom, #FFF5F5 0%, #FFFFFF 100%);
            padding: 16px;
        }
        
        .price-main {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }
        
        .current-price-flash {
            font-size: 1.75rem; /* Fonte menor como na Shopee */
            font-weight: 600; /* Peso menor */
            color: var(--color-primary);
            line-height: 1;
        }

        .original-price-flash {
            font-size: 0.9rem; /* Fonte menor */
            color: #999999; /* Cor mais clara */
            text-decoration: line-through;
            font-weight: 400;
        }

        .discount-percentage {
            background: var(--color-discount); /* Usar cor específica de desconto */
            color: white;
            padding: 2px 6px; /* Padding menor */
            border-radius: 2px; /* Bordas menos arredondadas */
            font-size: 0.75rem; /* Fonte menor */
            font-weight: 500;
        }
        
        .savings-info {
            color: var(--color-primary);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        /* Responsivo para OFERTAS RELÂMPAGO */
        @media (max-width: 767px) {
            .flash-sale-header {
                padding: 10px 12px;
                flex-direction: column;
                gap: 8px;
                text-align: center;
            }
            
            .flash-sale-title {
                font-size: 0.8rem;
            }
            
            .flash-sale-timer {
                font-size: 0.75rem;
                gap: 6px;
            }
            
            .countdown-number {
                padding: 2px 4px;
                font-size: 0.75rem;
                min-width: 20px;
            }
            
            .current-price-flash {
                font-size: 1.6rem;
            }
            
            .price-main {
                flex-wrap: wrap;
                gap: 8px;
            }
        }
        
        /* INFO DO PRODUTO - Estilo Shopee */
        .product-info .product-title {
            font-size: 1.25rem; /* Fonte similar à Shopee */
            font-weight: 400; /* Peso normal como na Shopee */
            line-height: 1.4;
            margin-bottom: 8px; /* Margem menor */
            color: var(--color-text);
            word-wrap: break-word;
        }
        .product-rating {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            font-size: 0.9rem;
        }
        .product-rating .stars { color: var(--color-primary); font-size: 1.1rem; }
        .product-rating .reviews-count, .product-rating .sold-count { 
            color: var(--color-text-light); 
            border-left: 1px solid var(--color-border);
            padding-left: 12px;
        }
        .product-rating .rating-value { color: var(--color-primary); font-weight: 700; }
        
        /* SEÇÃO DE PREÇO */
        .pricing-section {
            background-color: #fdf5f3;
            padding: 20px;
            border-radius: var(--border-radius);
            margin-bottom: 24px;
        }
        .price-row { display: flex; align-items: baseline; gap: 16px; }
        .current-price {
            font-size: 2.2rem; /* Fonte menor */
            font-weight: 700;
            color: var(--color-primary);
        }
        .original-price {
            font-size: 1.1rem; /* Fonte menor */
            color: var(--color-text-light);
            text-decoration: line-through;
        }
        .discount-badge {
            background-color: var(--color-primary);
            color: var(--color-white);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 700;
        }
        
        /* VARIAÇÕES - Estilo Shopee */
        .variations-section { margin-bottom: 20px; }
        .section-label {
            font-weight: 400; /* Peso menor como na Shopee */
            margin-bottom: 8px; /* Margem menor */
            display: block;
            color: var(--color-text); /* Cor mais escura */
            font-size: 0.85rem; /* Fonte menor */
        }
        .colors-grid { display: flex; flex-wrap: wrap; gap: 8px; /* Gap menor */ }
        .color-choice {
            padding: 8px 16px;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            position: relative;
        }
        .color-choice:hover { border-color: var(--color-primary); background-color: #fdf5f3; }
        .color-choice.selected {
            border-color: var(--color-primary);
            background-color: var(--color-primary);
            color: var(--color-white);
            box-shadow: 0 0 5px rgba(238, 77, 45, 0.5);
        }
        .color-choice.selected::after {
            content: "✓";
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--color-secondary);
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
        }
        
        /* QUANTIDADE */
        .quantity-section {
            margin-bottom: 24px;
        }
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 10px;
        }
        .quantity-input-group {
            display: flex;
            align-items: center;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            overflow: hidden;
        }
        .quantity-btn {
            background: var(--color-background);
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            transition: background 0.2s ease;
        }
        .quantity-btn:hover {
            background: var(--color-primary);
            color: var(--color-white);
        }
        .quantity-input {
            border: none;
            padding: 8px 16px;
            width: 80px;
            text-align: center;
            font-size: 1rem;
            outline: none;
        }
        .quantity-presets {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .quantity-preset {
            padding: 6px 12px;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s ease;
        }
        .quantity-preset:hover {
            border-color: var(--color-primary);
            background: #fdf5f3;
        }
        .quantity-preset.selected {
            border-color: var(--color-primary);
            background: var(--color-primary);
            color: var(--color-white);
        }
        
        /* BOTÕES DE AÇÃO (CTA) - Estilo Shopee */
        .cta-section { display: flex; flex-direction: column; gap: 8px; }
        .main-buy-button {
            background-color: var(--color-primary);
            color: var(--color-white);
            border: none; /* Shopee não usa bordas nos botões principais */
            padding: 12px 20px; /* Padding menor */
            border-radius: 2px; /* Bordas menos arredondadas */
            font-size: 0.9rem; /* Fonte menor */
            font-weight: 500; /* Peso menor */
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: none; /* Shopee não usa uppercase */
            width: 100%;
            box-shadow: 0 1px 3px rgba(238, 77, 45, 0.3);
        }
        .main-buy-button:hover {
            background-color: var(--color-primary-dark);
            box-shadow: 0 2px 6px rgba(238, 77, 45, 0.4);
        }
        
        /* ESTOQUE E GARANTIA */
        .stock-info {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 16px;
            padding: 12px 16px;
            background-color: #e8f5e8;
            border: 1px solid var(--color-secondary);
            border-radius: var(--border-radius);
            color: var(--color-text);
            font-size: 0.9rem;
        }
        .stock-info .icon { color: var(--color-secondary); font-size: 1.2rem; }
        .stock-info strong { color: var(--color-secondary); }
        
        .guarantee-info {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 16px;
            color: var(--color-text-light);
                font-size: 0.9rem;
        }
        .guarantee-info .icon { color: var(--color-secondary); font-size: 1.2rem; }

        /* SEÇÕES DE CONTEÚDO ADICIONAL - Estilo Shopee */
        .content-section {
            background: var(--color-white);
            margin: 16px; /* Margem lateral como na Shopee */
            margin-top: 16px;
            padding: 20px; /* Padding menor */
            border-radius: 0; /* Shopee não usa bordas arredondadas */
            box-shadow: none; /* Shopee usa sombras mais sutis */
            border: 1px solid var(--color-border);
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }
        .section-title {
            font-size: 1.4rem;
            font-weight: 500;
                margin-bottom: 20px; 
            padding-bottom: 10px;
            border-bottom: 1px solid var(--color-border);
        }

        /* BENEFÍCIOS */
        .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .benefit-card {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 16px;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            transition: all 0.2s ease-in-out;
        }
        .benefit-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .benefit-icon { font-size: 1.8rem; line-height: 1; }
        .benefit-text { font-size: 0.95rem; }

        /* DESCRIÇÃO DO PRODUTO */
        .product-description {
            line-height: 1.8;
            color: var(--color-text);
        }
        .product-description h3 {
            color: var(--color-primary);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 20px 0 10px 0;
        }
        .product-description p {
            margin-bottom: 15px;
        }
        .product-description ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        .product-description li {
            margin-bottom: 8px;
            color: var(--color-text);
        }
        .product-description strong {
            color: var(--color-primary);
            font-weight: 600;
        }

        /* SEÇÕES ESPECIAIS DA DESCRIÇÃO */
        .product-intro {
            background: linear-gradient(135deg, var(--color-primary), #667eea);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            text-align: center;
        }
        .product-intro p {
            margin-bottom: 10px;
        }
        .product-intro strong {
            color: white;
            font-size: 1.1rem;
        }

        .feature-list li {
            background: #f8f9fa;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid var(--color-primary);
        }

        .benefits-list li {
            background: linear-gradient(90deg, #e8f5e8, #f0f8f0);
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            border-left: 3px solid #28a745;
        }

        .size-guide {
            background: #fff3cd;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #ffeaa7;
            margin: 20px 0;
        }
        .size-table {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            font-family: monospace;
            font-size: 0.9rem;
        }

        .faq-section {
            margin-top: 20px;
        }
        .faq-item {
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--color-primary);
        }
        .faq-item p:first-child {
            margin-bottom: 8px;
            font-weight: 600;
        }
        .faq-item p:last-child {
            margin-bottom: 0;
            color: #666;
        }

        /* AVALIAÇÕES DO PRODUTO */
        .product-rating-summary {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #fff5f3 0%, #fdf5f3 100%);
            border-radius: var(--border-radius);
            border: 1px solid #ffe6e1;
        }
        .rating-score {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .rating-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--color-primary);
        }
        .rating-stars {
            font-size: 1.5rem;
            color: var(--color-primary);
        }
        .rating-text {
            font-size: 1.2rem;
            color: var(--color-text-light);
        }

        /* DEPOIMENTOS */
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
        .testimonial-card {
            background: #FAFAFA;
            padding: 20px;
            border-radius: var(--border-radius);
            border: 1px solid var(--color-border);
            transition: all 0.3s ease;
        }
        .testimonial-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        /* Comentários específicos da Shopee */
        .shopee-comment {
            background: #fff;
            border: 1px solid #e5e7eb;
            margin-bottom: 16px;
        }
        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .comment-user-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .testimonial-author-name {
            font-weight: 600;
            color: var(--color-text);
            font-size: 0.9rem;
        }
        .comment-meta {
            text-align: right;
            font-size: 0.75rem;
            color: var(--color-text-light);
            line-height: 1.3;
        }
        .comment-date {
            display: block;
            margin-bottom: 2px;
        }
        .comment-variation {
            display: block;
            color: var(--color-primary);
            font-weight: 500;
            font-size: 0.7rem;
        }
        .testimonial-footer {
            margin-top: 8px;
        }
        .verified-purchase {
            color: var(--color-secondary);
            font-size: 0.75rem;
        }
        
        /* Imagens dos comentários */
        .comment-images {
            display: flex;
            gap: 6px;
            margin: 10px 0;
            flex-wrap: wrap;
        }
        .comment-image-container {
            position: relative;
        }
        .comment-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #f8f9fa;
        }
        .comment-image:hover {
            transform: scale(1.1);
            border-color: var(--color-primary);
            box-shadow: 0 2px 8px rgba(238, 77, 45, 0.2);
            z-index: 10;
            position: relative;
        }
        
        /* Modal para imagens */
        .image-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            justify-content: center;
            align-items: center;
        }
        .image-modal.active {
            display: flex;
        }
        .modal-image {
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
        }
        .modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .testimonial-rating { color: var(--color-primary); margin-bottom: 8px; font-size: 1.1rem; }
        .testimonial-text { margin-bottom: 16px; font-style: italic; color: var(--color-text); line-height: 1.5; }
        .testimonial-author { font-weight: 700; color: var(--color-text); }
        .testimonial-author small { font-weight: 400; color: var(--color-secondary); font-size: 0.8rem; display: block; margin-top: 4px; }
        
        /* FOOTER */
        .footer {
            margin-top: 40px;
            padding: 30px 0;
            text-align: center;
            color: var(--color-text-light);
            font-size: 0.85rem;
            border-top: 1px solid var(--color-border);
        }

    </style>
</head>
<body>

    <!-- Barra superior estilo Shopee -->
    <div class="urgency-bar">
        ${copyData.urgencia} <span id="countdown">23:59:45</span>
    </div>

    <!-- Header estilo Shopee -->
    <header style="background: var(--color-white); border-bottom: 1px solid var(--color-border); padding: 12px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="color: var(--color-primary); font-size: 1.5rem; font-weight: 700;">Shopee</div>
                <div style="color: var(--color-text-light); font-size: 0.9rem;">Produto Original</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--color-text-light);">
                <span>🛡️ Compra Garantida</span>
                <span>🚚 Frete Grátis</span>
            </div>
        </div>
    </header>

    <!-- Breadcrumb estilo Shopee -->
    <nav style="background: var(--color-background); padding: 8px 0; border-bottom: 1px solid var(--color-border);">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
            <div style="font-size: 0.8rem; color: var(--color-text-light);">
                <span>Shopee</span>
                <span style="margin: 0 8px;">></span>
                <span>${productData.category || 'Produtos'}</span>
                <span style="margin: 0 8px;">></span>
                <span style="color: var(--color-text);">${productData.name}</span>
            </div>
        </div>
    </nav>

    <main class="container">
        <section class="product-section">
            <div class="product-grid">
                <div class="image-gallery">
                    <div class="main-image-wrapper">
                        <img id="mainImage" src="${(() => {
                            const firstImg = productData.images[0];
                             const imageUrl = typeof firstImg === 'string' ? firstImg : (firstImg as any)?.url || (firstImg as any)?.src || '';
                             return imageUrl.startsWith('http') ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
                         })()}" alt="${productData.name}" class="main-product-image">
                        </div>
                        <div class="thumbnails-wrapper">
                            ${productData.images.map((img, idx) => {
                            const imageUrl = typeof img === 'string' ? img : (img as any)?.url || (img as any)?.src || '';
                            const proxyUrl = imageUrl.startsWith('http') ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
                            return `<img src="${proxyUrl}" alt="Foto ${idx + 1}" class="product-thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${proxyUrl}', this)">`;
                            }).join('')}
                    </div>
                </div>

                <div class="product-info">
                        <h1 class="product-title">${productData.name}</h1>
                        <div class="product-rating">
                        <span class="rating-value">${productData.rating || '4.9'}</span>
                            <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span class="reviews-count">${productData.reviews || '127'} Avaliações</span>
                        <span class="sold-count">${productData.reviews || '500+'} Vendidos</span>
                        </div>

                    <!-- OFERTAS RELÂMPAGO - Layout igual à Shopee -->
                    <div class="flash-sale-section">
                        <div class="flash-sale-header">
                            <span class="flash-sale-title">OFERTAS RELÂMPAGO</span>
                            <div class="flash-sale-timer">
                                <span class="timer-icon">⏰</span>
                                <span class="timer-text">TERMINA EM</span>
                                <div class="countdown-timer">
                                    <span class="countdown-number" id="hours">01</span>
                                    <span class="countdown-number" id="minutes">31</span>
                                    <span class="countdown-number" id="seconds">10</span>
                                </div>
                            </div>
                        </div>
                        <div class="flash-sale-pricing">
                            <div class="price-main">
                                <span class="current-price-flash">${productData.price}</span>
                                ${productData.originalPrice ? `<span class="original-price-flash">${productData.originalPrice}</span>` : ''}
                                ${discount ? `<span class="discount-percentage">${discount}</span>` : ''}
                            </div>
                            ${savings ? `<div class="savings-info">Você economiza ${savings}</div>` : ''}
                        </div>
                    </div>

                    ${productData.variations?.colors && productData.variations.colors.length > 0 ? `
                    <div class="variations-section">
                        <span class="section-label">Cor:</span>
                            <div class="colors-grid">
                                ${productData.variations.colors.map(color => `
                                <div class="color-choice" onclick="selectSingleOption(this, 'color')">${color}</div>
                                `).join('')}
                            </div>
                    </div>` : ''}

                    ${productData.variations?.sizes && productData.variations.sizes.length > 0 ? `
                    <div class="variations-section">
                        <span class="section-label">Tamanho:</span>
                        <div class="colors-grid">
                            ${productData.variations.sizes.map(size => `
                                <div class="color-choice" onclick="selectSingleOption(this, 'size')">${size}</div>
                            `).join('')}
                    </div>
                    </div>` : ''}

                    <div class="quantity-section">
                        <span class="section-label">
                            Quantidade:
                            <span style="font-size: 0.8rem; color: var(--color-text-light);">
                                ${productData.stockQuantity ? `${productData.stockQuantity} disponíveis` : '290 peças disponíveis'}
                            </span>
                        </span>
                        <div class="quantity-controls">
                            <div class="quantity-input-group">
                                <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                                <input type="number" id="quantityInput" class="quantity-input" value="1" min="1" max="${productData.stockQuantity || 290}">
                                <button class="quantity-btn" onclick="increaseQuantity()">+</button>
                        </div>
                            <div class="quantity-presets">
                                <div class="quantity-preset selected" onclick="setQuantity(1, this)">1</div>
                                <div class="quantity-preset" onclick="setQuantity(5, this)">5</div>
                                <div class="quantity-preset" onclick="setQuantity(10, this)">10</div>
                                <div class="quantity-preset" onclick="setQuantity(20, this)">20</div>
                                <div class="quantity-preset" onclick="setQuantity(50, this)">50</div>
                            </div>
                        </div>
                    </div>

                    <div class="cta-section">
                        <button class="main-buy-button" onclick="buyNow()">${copyData.cta_principal}</button>
                    </div>

                                        ${productData.stockQuantity ? `
                    <div class="stock-info">
                        <span class="icon">📦</span>
                        <span><strong>${productData.stockQuantity} peças disponíveis</strong></span>
                    </div>` : ''}

                    <div class="guarantee-info">
                        <span class="icon">🛡️</span>
                        <span>${copyData.garantia}</span>
                            </div>
            </div>
        </div>
    </section>

                ${productData.description ? `
        <section class="content-section">
            <h2 class="section-title">Descrição do Produto</h2>
            <div class="product-description">
                ${this.formatProductDescription(productData.description)}
            </div>
        </section>` : ''}

        <section class="content-section">
            <h2 class="section-title">Por que este produto é perfeito para você?</h2>
            <div class="benefits-grid">
                ${copyData.beneficios.map(beneficio => {
                    const [icon, ...text] = beneficio.split(' ');
                    return `
                    <div class="benefit-card">
                            <span class="benefit-icon">${icon}</span>
                        <span class="benefit-text">${text.join(' ')}</span>
                    </div>`
                }).join('')}
        </div>
    </section>

        <section class="content-section">
            <h2 class="section-title">Avaliações do produto</h2>
            <div class="product-rating-summary">
                <div class="rating-score">
                    <span class="rating-number">4.7</span>
                    <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-text">de 5</span>
                </div>
            </div>
            <div class="testimonials-grid">
                ${this.generateCommentsHTML(productData)}
            </div>
        </section>

    </main>
    
    <footer class="footer">
        © ${new Date().getFullYear()} Sua Loja. Compra 100% segura.
    </footer>

    <script>
        // Funções JS (mantidas, pois são funcionais)
        let timeLeft = 23 * 3600 + 59 * 60 + 45;
        function updateCountdown() {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            const countdownElement = document.getElementById('countdown');
            if(countdownElement) {
            const timeString = \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
              countdownElement.textContent = timeString;
            }
            timeLeft--;
            if (timeLeft < 0) timeLeft = 23 * 3600 + 59 * 60 + 45;
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();

        function changeMainImage(imageSrc, thumbnailElement) {
            const mainImage = document.getElementById('mainImage');
            if (mainImage) mainImage.src = imageSrc;
            
            document.querySelectorAll('.product-thumbnail').forEach(thumb => thumb.classList.remove('active'));
            if (thumbnailElement) thumbnailElement.classList.add('active');
        }

        // CONTADOR DE OFERTAS RELÂMPAGO - Funcionalidade igual à Shopee
        function initFlashSaleTimer() {
            // Definir tempo inicial (1 hora, 31 minutos, 10 segundos)
            let totalSeconds = (1 * 3600) + (31 * 60) + 10;
            
            function updateTimer() {
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                // Atualizar elementos do DOM
                const hoursElement = document.getElementById('hours');
                const minutesElement = document.getElementById('minutes');
                const secondsElement = document.getElementById('seconds');
                
                if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
                if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
                if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
                
                // Decrementar contador
                totalSeconds--;
                
                // Se chegou a zero, reiniciar o timer
                if (totalSeconds < 0) {
                    totalSeconds = (1 * 3600) + (31 * 60) + 10; // Reiniciar com 1h31m10s
                }
            }
            
            // Atualizar imediatamente
            updateTimer();
            
            // Atualizar a cada segundo
            setInterval(updateTimer, 1000);
        }
        
        // Inicializar timer quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            initFlashSaleTimer();
        });

        // Variáveis globais para controlar seleções
        let selectedColor = '';
        let selectedSize = '';
        let selectedQuantity = 1;

        function selectSingleOption(element, type) {
            if (type === 'color') {
                // Remover seleção anterior de todas as cores
                document.querySelectorAll('.variations-section:first-of-type .color-choice').forEach(option => {
                    option.classList.remove('selected');
                });
                // Selecionar a nova cor
                element.classList.add('selected');
                selectedColor = element.textContent;
            } else if (type === 'size') {
                // Remover seleção anterior de todos os tamanhos
                document.querySelectorAll('.variations-section:last-of-type .color-choice').forEach(option => {
                    option.classList.remove('selected');
                });
                // Selecionar o novo tamanho
                element.classList.add('selected');
                selectedSize = element.textContent;
            }
            updateSelectionSummary();
        }

        function increaseQuantity() {
            const input = document.getElementById('quantityInput');
            const currentValue = parseInt(input.value);
            const maxValue = parseInt(input.max);
            if (currentValue < maxValue) {
                input.value = currentValue + 1;
                selectedQuantity = currentValue + 1;
                updateQuantityPresets();
            }
        }

        function decreaseQuantity() {
            const input = document.getElementById('quantityInput');
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                selectedQuantity = currentValue - 1;
                updateQuantityPresets();
            }
        }

        function setQuantity(quantity, element) {
            const input = document.getElementById('quantityInput');
            const maxValue = parseInt(input.max);
            if (quantity <= maxValue) {
                input.value = quantity;
                selectedQuantity = quantity;
                
                // Atualizar visual dos presets
                document.querySelectorAll('.quantity-preset').forEach(preset => preset.classList.remove('selected'));
                element.classList.add('selected');
            }
        }

        function updateQuantityPresets() {
            const currentQuantity = parseInt(document.getElementById('quantityInput').value);
            document.querySelectorAll('.quantity-preset').forEach(preset => {
                preset.classList.remove('selected');
                if (parseInt(preset.textContent) === currentQuantity) {
                    preset.classList.add('selected');
                }
            });
        }

        function updateSelectionSummary() {
            console.log('Seleções atuais:', {
                cor: selectedColor,
                tamanho: selectedSize,
                quantidade: selectedQuantity
            });
        }

        // Atualizar quantidade quando o input mudar
        document.addEventListener('DOMContentLoaded', function() {
            const quantityInput = document.getElementById('quantityInput');
            if (quantityInput) {
                quantityInput.addEventListener('input', function() {
                    selectedQuantity = parseInt(this.value);
                    updateQuantityPresets();
                });
            }
        });
        
        function buyNow() {
            // Verificar se há seleções obrigatórias
            if (!selectedColor && !selectedSize) {
                alert('⚠️ Por favor, selecione pelo menos uma cor ou tamanho antes de continuar.');
                return;
            }

            let summary = '🛒 RESUMO DA COMPRA:\\n\\n';
            summary += '📦 Produto: ${productData.name}\\n';
            if (selectedColor) {
                summary += '🎨 Cor: ' + selectedColor + '\\n';
            }
            if (selectedSize) {
                summary += '📏 Tamanho: ' + selectedSize + '\\n';
            }
            summary += '🔢 Quantidade: ' + selectedQuantity + '\\n';
            summary += '💰 Preço: ${productData.price}\\n\\n';
            summary += '✅ Redirecionando para o checkout seguro...';
            
            alert(summary);
            const productUrl = "${productData.url || 'https://shopee.com.br'}";
            window.open(productUrl, '_blank');
        }
        
        // Função para abrir modal de imagem dos comentários
        function openImageModal(imageSrc) {
            // Criar modal se não existir
            let modal = document.getElementById('imageModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'imageModal';
                modal.className = 'image-modal';
                modal.innerHTML = \`
                    <span class="modal-close" onclick="closeImageModal()">&times;</span>
                    <img class="modal-image" id="modalImage" src="" alt="Imagem do comentário" />
                \`;
                document.body.appendChild(modal);
                
                // Fechar modal ao clicar fora da imagem
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeImageModal();
                    }
                });
            }
            
            // Definir a imagem e mostrar o modal
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imageSrc;
            modal.classList.add('active');
            
            // Prevenir scroll do body
            document.body.style.overflow = 'hidden';
        }
        
        function closeImageModal() {
            const modal = document.getElementById('imageModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
        
        // Fechar modal com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeImageModal();
            }
        });
    </script>
</body>
</html>`;
  }

  // Demais funções da classe (sem alterações)
  private generateStyledHTML(productData: ShopeeProduct, copyData: LandingPageCopy, style: string): string {
    const styleConfig = {
      'moderno_minimalista': {
        primaryColor: '#2563eb',
        bgColor: '#f8fafc'
      },
      'bold_impactante': {
        primaryColor: '#dc2626', 
        bgColor: '#1f2937'
      },
      'elegante_premium': {
        primaryColor: '#059669',
        bgColor: '#f9fafb'
      }
    };
    const selectedStyle = styleConfig[style];
    if (!selectedStyle) {
      return this.generateShopeeInspiredHTML(productData, copyData);
    }
    return this.generateShopeeInspiredHTML(productData, copyData)
      .replace(/#EE4D2D/g, selectedStyle.primaryColor)
      .replace(/#D73210/g, selectedStyle.primaryColor) // Simplificando
      .replace(/#F5F5F5/g, selectedStyle.bgColor);
  }

  private generateSmartAnalysis(productData: ShopeeProduct): LandingPageAnalysis {
    const hasImages = productData.images && productData.images.length > 0;
    const hasRating = productData.rating && productData.rating > 0;
    const hasReviews = productData.reviews && productData.reviews > 0;
    const hasVariations = productData.variations && Object.keys(productData.variations).length > 0;
    let conversionScore = 75,
      uxScore = 85,
      performanceScore = 80,
      persuasionScore = 75;
    if (hasImages) conversionScore += 5;
    if (hasRating && productData.rating >= 4.5) persuasionScore += 10;
    if (hasReviews && productData.reviews > 100) conversionScore += 5;
    if (hasVariations) uxScore += 5;
    return {
      score_conversao: Math.min(conversionScore, 95),
      score_ux: Math.min(uxScore, 95),
      score_performance: Math.min(performanceScore, 90),
      score_persuasao: Math.min(persuasionScore, 95),
      melhorias: ["Adicionar mais depoimentos com fotos", "Incluir vídeo demonstrativo do produto", "Criar seção de FAQ expandida"],
      sugestoes_cta: ["GARANTA JÁ COM DESCONTO", "COMPRAR AGORA - 50% OFF", "APROVEITAR OFERTA LIMITADA"]
    };
  }

  private generatePreviewImage(style: string): string {
    const colors = {
      'moderno_minimalista': '#2563eb',
      'bold_impactante': '#dc2626',
      'elegante_premium': '#059669'
    };
    const color = colors[style] || '#EE4D2D';
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <rect x="20" y="20" width="120" height="120" fill="#e5e7eb" rx="8"/>
        <rect x="160" y="20" width="120" height="15" fill="#e5e7eb" rx="4"/>
        <rect x="160" y="50" width="80" height="25" fill="${color}" rx="4"/>
        <rect x="160" y="90" width="100" height="15" fill="#e5e7eb" rx="4"/>
        <rect x="160" y="115" width="120" height="25" fill="#e5e7eb" rx="4"/>
      </svg>
    `)}`;
  }

  private parsePrice(priceStr: string): number {
    if(!priceStr) return 0;
    // Remove tudo exceto dígitos, vírgulas e pontos
    let cleanPrice = priceStr.replace(/[^\d,.]/g, '');
    
    // Se tem ponto e vírgula, assume formato brasileiro (1.234,56)
    if (cleanPrice.includes('.') && cleanPrice.includes(',')) {
        // Remove pontos (separadores de milhares) e substitui vírgula por ponto
        cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.');
    }
    // Se tem apenas vírgula, assume que é decimal brasileiro (1234,56)
    else if (cleanPrice.includes(',') && !cleanPrice.includes('.')) {
        cleanPrice = cleanPrice.replace(',', '.');
    }
    // Se tem apenas ponto, mantém como está (formato americano)
    
    return parseFloat(cleanPrice) || 0;
}  

  private calculateDiscount(currentPriceStr: string, originalPriceStr?: string): string {
    if (!originalPriceStr) return '';
    const current = this.parsePrice(currentPriceStr);
    const original = this.parsePrice(originalPriceStr);
    if (original > current) {
      const discount = Math.round(((original - current) / original) * 100);
      return `${discount}% OFF`;
    }
    return '';
  }

  private calculateSavings(currentPriceStr: string, originalPriceStr?: string): string {
    if (!originalPriceStr) return '';
    const current = this.parsePrice(currentPriceStr);
    const original = this.parsePrice(originalPriceStr);
     if (original > current) {
        const savings = (original - current).toFixed(2).replace('.', ',');
        return `R$ ${savings}`;
     }
     return '';
  }

  private async callAIWithTimeout(productData: ShopeeProduct): Promise<string> {
    return Promise.race([this.callExternalAPI(productData), new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]);
  }
  private async callExternalAPI(productData: ShopeeProduct): Promise<string> {
    throw new Error('API externa não disponível');
  }
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private formatProductDescription(description: string): string {
    if (!description) return '';

    // Limpar a descrição
    let cleaned = description
      .replace(/\*\*\*\*ATENÇÃO\*\*\*\*[\s\S]*?\*\*\*\*ATENÇÃO\*\*\*\*/g, '')
      .replace(/\*ATENÇÃO[^*]*\*/g, '')
      .replace(/ATENÇÃO!/g, '')
      .trim();

    // Detectar se é um sapato/calçado
    const isShoe = cleaned.toLowerCase().includes('sapato') ||
                   cleaned.toLowerCase().includes('calçado') ||
                   cleaned.toLowerCase().includes('couro') ||
                   cleaned.toLowerCase().includes('palmilha') ||
                   cleaned.toLowerCase().includes('solado');

    if (isShoe) {
      return this.formatShoeDescription(cleaned);
    } else {
      return this.formatGenericDescription(cleaned);
    }
  }

  private formatShoeDescription(description: string): string {
    let html = '';

    // Introdução persuasiva
    html += `<div class="product-intro">
      <p><strong>🎯 Transforme sua presença e confiança com este sapato excepcional!</strong></p>
      <p>Desenvolvido para homens que valorizam elegância, conforto e qualidade premium em cada detalhe.</p>
    </div>`;

    // Extrair características técnicas
    const features = this.extractShoeFeatures(description);

    if (features.length > 0) {
      html += `<h3>🔥 Principais Características e Diferenciais:</h3>
      <ul class="feature-list">`;

      features.forEach(feature => {
        html += `<li><strong>${feature.title}</strong> – ${feature.description}</li>`;
      });

      html += `</ul>`;
    }

    // Seção de benefícios
    html += `<h3>✨ Por que escolher este sapato?</h3>
    <ul class="benefits-list">
      <li><strong>💼 Versatilidade Total:</strong> Perfeito para trabalho, eventos sociais e ocasiões especiais</li>
      <li><strong>☁️ Conforto Incomparável:</strong> Use o dia todo sem desconforto</li>
      <li><strong>🛡️ Durabilidade Superior:</strong> Investimento que dura anos</li>
      <li><strong>👔 Elegância Garantida:</strong> Destaque-se em qualquer ambiente</li>
    </ul>`;

    // Tabela de medidas se mencionada
    if (description.includes('Tabela') || description.includes('medidas') || description.includes('cm')) {
      html += this.extractSizeTable(description);
    }

    // FAQ se mencionado
    if (description.includes('Perguntas') || description.includes('original') || description.includes('garantia')) {
      html += this.extractFAQ(description);
    }

    return html;
  }

  private formatGenericDescription(description: string): string {
    // Formatação genérica para outros produtos
    const lines = description.split('\n').filter(line => line.trim().length > 0);
    let html = '';
    let currentSection = '';

    for (let line of lines) {
      line = line.trim();

      if (line.length > 0) {
        currentSection += (currentSection ? ' ' : '') + line;
      }
    }

    if (currentSection) {
      html += `<p>${currentSection}</p>`;
    }

    return html;
  }

  private extractShoeFeatures(description: string): Array<{title: string, description: string}> {
    const features = [];

    if (description.includes('Couro Sintético Hidrofóbico')) {
      features.push({
        title: '💧 Couro Sintético Hidrofóbico',
        description: 'Maior resistência à água e sujeira, mantendo o sapato limpo por mais tempo e facilitando sua limpeza'
      });
    }

    if (description.includes('Microfibra')) {
      features.push({
        title: '🦠 Forro Interno em Microfibra',
        description: 'Tecnologia antibacteriana que reduz a proliferação de bactérias causadoras de mau cheiro'
      });
    }

    if (description.includes('PVC')) {
      features.push({
        title: '🛡️ Vira em PVC',
        description: 'Altamente resistente ao desgaste e uso intenso'
      });
    }

    if (description.includes('EVA')) {
      features.push({
        title: '☁️ Palmilha em EVA',
        description: 'Se adapta perfeitamente ao pé, com espuma de alta densidade para máximo conforto'
      });
    }

    return features;
  }

  private extractSizeTable(description: string): string {
    if (!description.includes('Tabela')) return '';

    return `<h3>📏 Guia de Tamanhos</h3>
    <div class="size-guide">
      <p><strong>Como medir seu pé:</strong></p>
      <ol>
        <li>Em um papel, desenhe o contorno do pé descalço</li>
        <li>Meça do dedão ao calcanhar</li>
        <li>Compare com a tabela abaixo</li>
      </ol>

      <div class="size-table">
        <p><strong>Tabela de Medidas:</strong></p>
        <p>37 - 25 cm | 38 - 25,5 cm | 39 - 26,0 cm | 40 - 26,5 cm</p>
        <p>41 - 27,0 cm | 42 - 27,5 cm | 43 - 28,0 cm | 44 - 28,5 cm</p>
        <p>45 - 29,0 cm | 46 - 29,5 cm</p>
      </div>
    </div>`;
  }

  private extractFAQ(description: string): string {
    return `<h3>❓ Perguntas Frequentes</h3>
    <div class="faq-section">
      <div class="faq-item">
        <p><strong>🔍 O produto é original?</strong></p>
        <p>Sim, 100% original, enviado na caixa com nota fiscal.</p>
      </div>

      <div class="faq-item">
        <p><strong>📐 O tamanho é grande ou pequeno?</strong></p>
        <p>O tamanho segue o padrão brasileiro. Use nossa tabela de medidas para garantir o ajuste perfeito.</p>
      </div>

      <div class="faq-item">
        <p><strong>✅ O sapato tem garantia?</strong></p>
        <p>Sim, oferecemos garantia de 30 dias. Fabricamos com paixão e experiência há mais de 6 anos no setor calçadista.</p>
      </div>
    </div>`;
  }

  // Gerar HTML dos comentários extraídos da Shopee com imagens
  private generateCommentsHTML(productData: ShopeeProduct): string {
    const comments = productData.comments || [];
    
    // DEBUG: Log para verificar os comentários recebidos
    console.log('🔍 DEBUG - Comentários recebidos no gerador:', comments);
    console.log('🔍 DEBUG - Número de comentários:', comments.length);
    console.log('🔍 DEBUG - Estrutura do productData:', Object.keys(productData));
    
    // Se não há comentários extraídos, usar comentários padrão
    if (comments.length === 0) {
      return `
        <div class="testimonial-card">
          <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-text">"Chegou super rápido e a qualidade é impressionante, muito melhor do que eu esperava. Com certeza comprarei de novo!"</p>
          <div class="testimonial-author">
            Mariana S. <small>Compra Verificada</small>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-text">"O produto é exatamente como na descrição. Confortável e com ótimo acabamento. Atendimento da loja também foi excelente."</p>
          <div class="testimonial-author">
            Ricardo P. <small>Compra Verificada</small>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-text">"Valeu cada centavo. Uso todos os dias e está perfeito. A entrega foi antes do prazo. Recomendo muito!"</p>
          <div class="testimonial-author">
            Julia F. <small>Compra Verificada</small>
          </div>
        </div>
      `;
    }

    // Remover duplicatas baseado no usuário e conteúdo similar
    const uniqueComments = [];
    const seenUsers = new Set();
    
    for (const comment of comments) {
      const userKey = comment.user?.toLowerCase();
      if (!seenUsers.has(userKey) && comment.user && comment.comment) {
        uniqueComments.push(comment);
        seenUsers.add(userKey);
      }
      if (uniqueComments.length >= 6) break; // Limitar a 6 comentários únicos
    }
    
    const firstSixComments = uniqueComments.slice(0, 6);
    
    return firstSixComments.map(comment => {
      // Gerar estrelas baseado no rating
      const stars = '⭐'.repeat(comment.rating || 5);
      
      // Limpar e extrair o texto do comentário (remover metadados da extração)
      let cleanComment = comment.comment || '';
      
      // Estratégia mais avançada de limpeza
      // 1. Remover informações de usuário duplicadas no início
      cleanComment = cleanComment.replace(new RegExp(`^.*?${comment.user}.*?\|`, 'i'), '');
      
      // 2. Extrair texto após variação se houver
      if (cleanComment.includes('Variação:')) {
        const afterVariation = cleanComment.split('Variação:')[1];
        if (afterVariation) {
          // Pegar texto após a primeira vírgula ou espaço da variação
          const parts = afterVariation.split(/[,|]/);
          if (parts.length > 1) {
            cleanComment = parts.slice(1).join(',').trim();
          }
        }
      }
      
      // 3. Remover padrões específicos da Shopee
      cleanComment = cleanComment
        .replace(/^.*?\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s*\|?\s*/, '') // Remove data/hora
        .replace(/^.*?Variação:\s*[^|]*\|?\s*/, '') // Remove variação
        .replace(/Tamanho:\s*[^|]*\|?/g, '') // Remove tamanho
        .replace(/Qualidade:\s*[^|]*\|?/g, '') // Remove qualidade
        .replace(/Parecido com anúncio:\s*[^|]*\|?/g, '') // Remove "parecido com anúncio"
        .replace(/\s*Reportar comentário.*$/i, '') // Remove "Reportar comentário"
        .replace(/\s*\d+:\d+\s*\d+,\d+mil.*$/i, '') // Remove timestamps
        .replace(/^[^a-zA-ZÀ-ÿ]*/, '') // Remove caracteres especiais do início
        .replace(/\s+/g, ' ') // Normalizar espaços
        .trim();
      
      // 4. Extrair apenas a primeira frase significativa (comentário real)
      if (cleanComment.length > 0) {
        // Procurar por padrões de início de comentário real
        const realCommentPatterns = [
          /([A-ZÀ-ÿ][^.!?]*[.!?])/,  // Primeira frase com maiúscula
          /([Oo] produto[^.!?]*[.!?])/,   // Começa com "O produto"
          /([Cc]hegou[^.!?]*[.!?])/,      // Começa com "Chegou"
          /([Mm]uito bom[^.!?]*[.!?])/,   // Começa com "Muito bom"
          /([Ee]xcelente[^.!?]*[.!?])/    // Começa com "Excelente"
        ];
        
        for (const pattern of realCommentPatterns) {
          const match = cleanComment.match(pattern);
          if (match) {
            cleanComment = match[1].trim();
            break;
          }
        }
        
        // Se ainda estiver muito longo, pegar apenas a primeira frase
        if (cleanComment.length > 150) {
          const sentences = cleanComment.split(/[.!?]/);
          if (sentences[0].length > 20) {
            cleanComment = sentences[0].trim() + '.';
          }
        }
      }
      
      // 5. Fallback para comentários genéricos baseados no usuário
      if (!cleanComment || cleanComment.length < 15) {
        const fallbacks = [
          'Produto de excelente qualidade, muito satisfeito com a compra!',
          'Material muito bom, chegou rápido e conforme descrito.',
          'Recomendo! Qualidade surpreendente pelo preço.',
          'Produto chegou perfeito, exatamente como esperado.',
          'Muito bom, comprarei novamente. Recomendo!'
        ];
        const userHash = comment.user ? comment.user.length % fallbacks.length : 0;
        cleanComment = fallbacks[userHash];
      }
      
      // 🎯 NOVA FUNCIONALIDADE: Separar primeira imagem (avatar) das demais (produto)
      const allImages = comment.images && Array.isArray(comment.images) 
        ? comment.images.filter(img => {
            const imgUrl = typeof img === 'string' ? img : img?.url;
            return imgUrl && !imgUrl.includes('rating');
          })
        : [];
      
      // Primeira imagem = Avatar do usuário
      const userAvatar = allImages.length > 0 ? allImages[0] : null;
      const avatarUrl = userAvatar ? (typeof userAvatar === 'string' ? userAvatar : userAvatar.url) : null;
      
      // Demais imagens = Imagens do produto (máximo 4)
      const productImages = allImages.slice(1, 5); // Pegar da 2ª até a 5ª imagem
      
      // DEBUG: Mostrar estrutura completa das imagens
      console.log(`🖼️ DEBUG - Imagens RAW para ${comment.user}:`, comment.images?.length || 0);
      console.log(`👤 DEBUG - Avatar URL para ${comment.user}:`, avatarUrl);
      console.log(`🖼️ DEBUG - Imagens do PRODUTO para ${comment.user}:`, productImages.length);
      
      // Gerar HTML das imagens do produto (não incluir avatar aqui)
      const productImagesHTML = productImages.length > 0 
        ? `
          <div class="comment-images">
            ${productImages.map((image, index) => {
              const imgUrl = typeof image === 'string' ? image : image.url;
              const imgAlt = typeof image === 'string' ? `Produto ${index + 1}` : (image.alt || `Produto ${index + 1}`);
              console.log(`🖼️ Gerando HTML para imagem do produto ${index + 1}:`, imgUrl);
              return `
              <div class="comment-image-container">
                <img src="${imgUrl}" 
                     alt="${imgAlt}" 
                     class="comment-image" 
                     onclick="openImageModal('${imgUrl}')" 
                     loading="lazy" 
                     onerror="console.log('Erro ao carregar imagem:', this.src); this.style.display='none'" />
              </div>
            `;
            }).join('')}
          </div>
        ` : '';
      
      console.log(`🎨 HTML das imagens do produto gerado para ${comment.user}:`, productImagesHTML.length > 0 ? 'SIM' : 'NÃO', productImagesHTML.substring(0, 100) + '...');
      
      // Formatar data
      let formattedDate = 'Recente';
      if (comment.date && comment.date !== 'Recente') {
        try {
          // Tentar diferentes formatos de data
          const dateStr = comment.date.replace(/[^0-9-]/g, '');
          if (dateStr.includes('-')) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString('pt-BR');
            }
          }
        } catch (e) {
          formattedDate = 'Recente';
        }
      }
      
      // Extrair variação de forma mais limpa
      let variationInfo = '';
      if (comment.variation && comment.variation.length > 0) {
        const variation = comment.variation.split(',')[0].trim(); // Pegar apenas a primeira parte
        if (variation && variation.length < 50) {
          variationInfo = `<span class="comment-variation">Variação: ${variation}</span>`;
        }
      }
      
      return `
        <div class="testimonial-card shopee-comment">
          <div class="comment-header">
            <div class="comment-user-info">
              ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar de ${comment.user}" class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 8px; flex-shrink: 0;" />` : ''}
              <div class="user-details">
                <div class="testimonial-author-name">${comment.user}</div>
                <div class="testimonial-rating">${stars}</div>
              </div>
            </div>
            <div class="comment-meta">
              <span class="comment-date">${formattedDate}</span>
              ${variationInfo}
            </div>
          </div>
          <p class="testimonial-text">${cleanComment}</p>
          ${productImagesHTML}
          <div class="testimonial-footer">
            <small class="verified-purchase">Compra Verificada</small>
          </div>
        </div>
      `;
    }).join('');
  }
}

export const aiLandingPageGenerator = new AILandingPageGenerator();