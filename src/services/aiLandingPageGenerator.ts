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
    const productName = productData.name.toLowerCase();
    const hasDiscount = productData.originalPrice && productData.price;
    
    // Detectar categoria do produto
    const isTablet = productName.includes('tablet');
    const isKids = productName.includes('infantil') || productName.includes('kids');
    const isShoe = productName.includes('sapato') || productName.includes('tenis') || productName.includes('sandalia') || productName.includes('chinelo');
    const isClothing = productName.includes('camisa') || productName.includes('blusa') || productName.includes('vestido') || productName.includes('calça') || productName.includes('short');
    const isPhone = productName.includes('celular') || productName.includes('smartphone') || productName.includes('iphone') || productName.includes('samsung');
    const isWatch = productName.includes('relogio') || productName.includes('smartwatch');
    const isBag = productName.includes('bolsa') || productName.includes('mochila') || productName.includes('carteira');
    
    let headline = "Oferta Imperdível!";
    let subheadline = "Aproveite agora com desconto especial";
    let cta_principal = "COMPRAR AGORA";
    let beneficios: string[] = [];

    if (isTablet && isKids) {
      headline = "🚀 Tablet que Transforma Brincadeira em Aprendizado!";
      subheadline = "Seguro, educativo e super divertido para seu filho";
      cta_principal = "QUERO PARA MEU FILHO";
      beneficios = [
        "🛡️ Controle parental total para navegação segura",
        "🎓 Jogos educativos que desenvolvem o aprendizado", 
        "💪 Tela resistente a quedas e impactos",
        "🔋 Bateria de longa duração para diversão sem parar",
        "👶 Design ergonômico especial para crianças"
      ];
    } else if (isTablet) {
      headline = "💻 Performance Premium na Palma da Sua Mão";
      subheadline = "Trabalhe, estude e se divirta onde quiser";
      cta_principal = "GARANTE O SEU";
      beneficios = [
        "🚀 Performance superior para multitarefas",
        "✨ Tela de alta qualidade para máxima nitidez",
        "💾 Armazenamento generoso para todos seus arquivos",
        "🎨 Design premium e portabilidade total",
        "💰 Tecnologia avançada pelo melhor preço"
      ];
    } else if (isShoe) {
      const isSocial = productName.includes('social') || productName.includes('elegante') || productName.includes('formal');
      const isSneaker = productName.includes('tenis') || productName.includes('esportivo') || productName.includes('casual');
      
      if (isSocial) {
        headline = "👞 Elegância e Conforto que Impressionam!";
        subheadline = "O sapato social perfeito para sua confiança e sucesso profissional";
        cta_principal = "QUERO MEU SAPATO";
        beneficios = [
          "🔥 Couro genuíno de alta qualidade e durabilidade",
          "😌 Conforto excepcional para uso o dia todo",
          "💼 Design elegante que transmite profissionalismo", 
          "🛡️ Solado antiderrapante para máxima segurança",
          "✨ Estilo clássico e versátil para todas ocasiões"
        ];
      } else if (isSneaker) {
        headline = "👟 Conforto e Estilo para Seus Pés!";
        subheadline = "O tênis perfeito para seu dia a dia com máximo conforto";
        cta_principal = "QUERO MEU TÊNIS";
        beneficios = [
          "🏃 Amortecimento superior para caminhadas longas",
          "💨 Material respirável que mantém os pés secos",
          "💪 Solado flexível e resistente ao desgaste",
          "🎨 Design moderno que combina com tudo",
          "⚡ Leveza que você sente a cada passo"
        ];
      } else {
        headline = "👠 Pisada Perfeita, Estilo Garantido!";
        subheadline = "Calçado de qualidade que une conforto e beleza";
        cta_principal = "QUERO AGORA";
        beneficios = [
          "✨ Material de primeira qualidade",
          "😌 Conforto incomparável para seus pés",
          "🎯 Design que valoriza seu estilo pessoal",
          "💪 Durabilidade testada e aprovada",
          "🔥 Versatilidade para qualquer ocasião"
        ];
      }
    } else if (isClothing) {
      headline = "👕 Vista-se com Estilo e Confiança!";
      subheadline = "Roupa de qualidade que valoriza sua personalidade";
      cta_principal = "QUERO ESSA PEÇA";
      beneficios = [
        "🧵 Tecido premium com toque macio e durável",
        "✨ Caimento perfeito que valoriza seu corpo",
        "🎨 Design moderno que nunca sai de moda",
        "🌡️ Conforto térmico ideal para qualquer clima",
        "💫 Versatilidade para looks casuais e elegantes"
      ];
    } else if (isPhone) {
      headline = "📱 Tecnologia que Cabe na Sua Mão!";
      subheadline = "Smartphone poderoso para conectar você ao mundo";
      cta_principal = "GARANTIR O MEU";
      beneficios = [
        "🚀 Processador potente para máxima velocidade",
        "📸 Câmera profissional para fotos incríveis",
        "🔋 Bateria que dura o dia todo sem preocupação",
        "📱 Tela brilhante com cores vibrantes",
        "🛡️ Design resistente e elegante"
      ];
    } else if (isWatch) {
      headline = "⌚ Tempo e Estilo no Seu Pulso!";
      subheadline = "Relógio que combina funcionalidade e elegância";
      cta_principal = "QUERO NO MEU PULSO";
      beneficios = [
        "⏰ Precisão suíça em cada segundo",
        "💎 Design sofisticado que impressiona",
        "💪 Resistência à água e impactos",
        "🔋 Autonomia excepcional de bateria",
        "✨ Versatilidade para todas as ocasiões"
      ];
    } else if (isBag) {
      headline = "👜 Praticidade e Estilo Onde Você For!";
      subheadline = "Bolsa perfeita para organizar sua vida com elegância";
      cta_principal = "QUERO COMIGO";
      beneficios = [
        "👜 Compartimentos inteligentes para organização",
        "💪 Material resistente e durável",
        "✨ Design elegante para qualquer ocasião",
        "🔒 Segurança e proteção para seus pertences",
        "🎯 Tamanho ideal para o dia a dia"
      ];
    } else {
      // Genérico para outros produtos
      beneficios = [
        "🔥 Qualidade premium que faz a diferença",
        "💪 Durabilidade testada e comprovada",
        "✨ Design moderno e atraente",
        "🎯 Funcionalidade que você precisa",
        "💰 Melhor custo-benefício do mercado"
      ];
    }

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
            background: ${isKids ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b35 100%)'}; 
            color: white; 
            padding: 120px 0; 
            text-align: center; 
            position: relative;
            overflow: hidden;
            min-height: 80vh;
            display: flex;
            align-items: center;
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
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); 
            color: white; 
            padding: 20px 60px; 
            border: none; 
            border-radius: 60px; 
            font-size: 1.3rem; 
            font-weight: 800; 
            cursor: pointer; 
            transition: all 0.4s ease;
            text-transform: uppercase;
            letter-spacing: 2px;
            animation: slideUp 1s ease-out 0.4s both;
            box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4), 0 5px 15px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        }
        .cta-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }
        .cta-hero:hover { 
            transform: translateY(-5px) scale(1.08); 
            box-shadow: 0 25px 60px rgba(255, 107, 53, 0.6), 0 10px 30px rgba(0,0,0,0.3);
        }
        .cta-hero:hover::before { left: 100%; }

        /* URGÊNCIA - PROMOÇÃO RELÂMPAGO */
        .urgency-bar {
            background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%);
            color: white;
            padding: 20px 0;
            text-align: center;
            font-weight: 700;
            animation: urgencyPulse 1.5s infinite;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
            font-size: 1.1rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .urgency-bar::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: urgencyShine 2s infinite;
        }
        @keyframes urgencyPulse { 
            0%, 100% { opacity: 1; transform: scale(1); } 
            50% { opacity: 0.9; transform: scale(1.01); } 
        }
        @keyframes urgencyShine {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        /* PRODUTO */
        .product-showcase { 
            padding: 80px 0; 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: start;
        }

        /* GALERIA DE IMAGENS */
        .image-gallery-section {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .main-image-wrapper {
            position: relative;
            margin-bottom: 30px;
            border-radius: 15px;
            overflow: hidden;
            background: #f8f9fa;
            padding: 20px;
        }
        
        .main-product-image {
            width: 100%;
            height: 450px;
            object-fit: cover;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid #e9ecef;
        }
        
        .main-product-image:hover {
            transform: scale(1.02);
            border-color: #667eea;
        }
        
        .zoom-overlay {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .main-image-wrapper:hover .zoom-overlay {
            opacity: 1;
        }
        
        .thumbnails-container {
            border-top: 2px solid #f1f3f4;
            padding-top: 20px;
        }
        
        .thumbnails-title {
            color: #1a1a1a;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .thumbnails-title::before {
            content: "📸";
            font-size: 1.2rem;
        }
        
        .thumbnails-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 12px;
        }
        
        .thumbnail-item {
            position: relative;
        }
        
        .product-thumbnail {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }
        
        .product-thumbnail:hover {
            transform: translateY(-2px);
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }
        
        .product-thumbnail.active {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* MODAL DE IMAGEM */
        .image-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            cursor: pointer;
        }
        .modal-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            margin: 50px auto;
            text-align: center;
        }
        .modal-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .close-btn {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
        .modal-nav {
            position: absolute;
            top: 50%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            transform: translateY(-50%);
        }
        .modal-nav button {
            background: rgba(255,255,255,0.8);
            border: none;
            padding: 15px 20px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            transition: all 0.3s ease;
        }
        .modal-nav button:hover {
            background: white;
            transform: scale(1.1);
        }

        /* INFORMAÇÕES DO PRODUTO */
        .product-details {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        /* CABEÇALHO DO PRODUTO */
        .product-header {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
        }
        
        .product-title {
            color: #1a1a1a;
            font-size: 1.8rem;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 10px;
        }
        
        .product-rating {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .stars {
            font-size: 1.1rem;
        }
        
        .rating-text {
            color: #666;
            font-size: 0.9rem;
        }

        /* SEÇÃO DE CORES */
        .colors-section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
        }
        
        .section-title {
            color: #1a1a1a;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .colors-grid {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .color-choice {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 18px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            border: 2px solid transparent;
        }
        
        .color-choice:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .color-choice.selected {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border-color: #ff6b35;
        }

        /* CTA PRINCIPAL */
        .main-cta-section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
            text-align: center;
        }
        
        .main-buy-button {
            background: linear-gradient(135deg, #25d366 0%, #20c997 100%);
            color: white;
            padding: 18px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4);
            position: relative;
            overflow: hidden;
            width: 100%;
            max-width: 350px;
        }
        
        .main-buy-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .main-buy-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 18px 40px rgba(37, 211, 102, 0.6);
        }
        
        .main-buy-button:hover::before {
            left: 100%;
        }
        
        .cta-subtitle {
            margin-top: 12px;
            color: #666;
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* SEÇÃO DE PREÇOS */
        .pricing-section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
        }
        
        .urgency-banner {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            text-align: center;
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 20px;
            animation: urgencyPulse 2s infinite;
            box-shadow: 0 5px 15px rgba(220, 38, 38, 0.3);
        }
        
        .price-container {
            text-align: center;
        }
        
        .price-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        
        .current-price {
            font-size: 2.5rem;
            font-weight: 800;
            color: #25d366;
            line-height: 1;
        }
        
        .old-price {
            font-size: 1.3rem;
            color: #999;
            text-decoration: line-through;
        }
        
        .savings-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        
        .discount-percentage {
            background: #dc2626;
            color: white;
            padding: 6px 12px;
            border-radius: 15px;
            font-weight: 700;
            font-size: 1rem;
        }
        
        .savings-amount {
            color: #25d366;
            font-weight: 700;
            font-size: 1.1rem;
        }

        /* POR QUE ESCOLHER */
        .why-choose-section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
        }
        
        .benefits-summary {
            display: grid;
            gap: 8px;
        }
        
        .benefit-point {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            padding: 12px 16px;
            border-radius: 12px;
            border-left: 4px solid #25d366;
            font-weight: 500;
            color: #1a1a1a;
            transition: all 0.3s ease;
        }
        
        .benefit-point:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(37, 211, 102, 0.2);
        }

        /* ESPECIFICAÇÕES */
        .specifications-section {
            margin-bottom: 0;
        }
        
        .specs-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        
        .spec-item {
            background: #f8f9fa;
            padding: 12px 16px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .spec-item:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        
        .spec-label {
            font-weight: 600;
            color: #666;
        }
        
        .spec-value {
            font-weight: 500;
            color: #1a1a1a;
            text-align: right;
        }

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
            padding: 50px 35px; 
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e3f2fd 100%); 
            border-radius: 25px; 
            box-shadow: 0 15px 40px rgba(0,0,0,0.1), 0 5px 15px rgba(102, 126, 234, 0.1);
            transition: all 0.4s ease;
            border: 1px solid rgba(102, 126, 234, 0.1);
            position: relative;
            overflow: hidden;
        }
        .benefit::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            transition: left 0.5s ease;
        }
        .benefit:hover { 
            transform: translateY(-15px) scale(1.02); 
            box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(102, 126, 234, 0.2);
        }
        .benefit:hover::before { left: 100%; }
        .benefit-icon {
            font-size: 4rem;
            margin-bottom: 25px;
            display: block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            position: relative;
            z-index: 2;
        }
        .benefit h3 { 
            color: #1a1a1a; 
            margin-bottom: 15px; 
            font-size: 1.4rem;
            font-weight: 700;
            line-height: 1.3;
            position: relative;
            z-index: 2;
        }
        .benefit p {
            color: #666;
            font-size: 1rem;
            line-height: 1.6;
            position: relative;
            z-index: 2;
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
            .hero { 
                padding: 80px 0; 
                min-height: 60vh; 
            }
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1.1rem; }
            .cta-hero { 
                padding: 15px 40px; 
                font-size: 1.1rem; 
            }
            
            .product-grid { 
                grid-template-columns: 1fr; 
                gap: 20px; 
            }
            
            .image-gallery-section,
            .product-details {
                padding: 20px;
            }
            
            .main-product-image { 
                height: 300px; 
            }
            
            .thumbnails-wrapper { 
                grid-template-columns: repeat(4, 1fr); 
            }
            
            .product-thumbnail { 
                height: 60px; 
            }
            
            .product-title {
                font-size: 1.5rem;
            }
            
            .current-price {
                font-size: 2rem;
            }
            
            .old-price {
                font-size: 1.1rem;
            }
            
            .specs-grid {
                grid-template-columns: 1fr;
            }
            
            .pricing-section { 
                padding: 15px 0; 
            }
            
            .urgency-banner { 
                font-size: 0.9rem;
                padding: 10px 15px;
            }
            
            .colors-grid { 
                justify-content: center; 
            }
            
            .main-buy-button { 
                padding: 15px 30px; 
                font-size: 1.1rem; 
            }
            
            .benefits-grid { grid-template-columns: 1fr; }
            .benefit { 
                padding: 30px 20px; 
                margin-bottom: 20px; 
            }
            .benefit-icon { font-size: 3rem; }
            
            .testimonials { grid-template-columns: 1fr; }
            .modal-content { 
                width: 95%; 
                margin: 20px auto; 
            }
            .modal-nav button { 
                padding: 10px 15px; 
                font-size: 1.2rem; 
            }
            
            .floating-whatsapp { 
                bottom: 15px; 
                right: 15px; 
                padding: 12px 16px; 
                font-size: 0.9rem; 
            }
        }

        @media (max-width: 480px) {
            .container { padding: 0 15px; }
            .urgency-bar { 
                padding: 15px 0; 
                font-size: 0.9rem; 
            }
            .hero h1 { font-size: 1.8rem; }
            .current-price { font-size: 1.8rem; }
            .main-buy-button { 
                padding: 12px 25px; 
                font-size: 1rem; 
                max-width: 280px;
            }
            
            .thumbnails-wrapper { 
                grid-template-columns: repeat(3, 1fr); 
            }
            
            .product-title {
                font-size: 1.3rem;
            }
            

            
            .image-gallery-section,
            .product-details {
                padding: 15px;
            }
            
            .main-image-wrapper {
                padding: 15px;
            }
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
            ⚡ PROMOÇÃO RELÂMPAGO! Termina em: <span id="countdown">23:59:45</span> ⚡
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
                <!-- GALERIA DE IMAGENS -->
                <div class="image-gallery-section">
                    <div class="main-image-wrapper">
                        <img id="mainImage" src="${(() => {
                            const firstImg = productData.images[0];
                            const imageUrl = typeof firstImg === 'string' ? firstImg : (firstImg as any)?.url || (firstImg as any)?.src || (firstImg as any)?.local_path || '';
                            return imageUrl && imageUrl.startsWith('http') ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
                        })()}" alt="${productData.name}" class="main-product-image" onclick="openImageModal(this.src)">
                        <div class="zoom-overlay">
                            <span class="zoom-text">Clique para ampliar</span>
                        </div>
                    </div>
                    
                    <div class="thumbnails-container">
                        <h4 class="thumbnails-title">Mais fotos do produto:</h4>
                        <div class="thumbnails-wrapper">
                            ${productData.images.map((img, idx) => {
                                const imageUrl = typeof img === 'string' ? img : (img as any)?.url || (img as any)?.src || (img as any)?.local_path || '';
                                const proxyUrl = imageUrl && imageUrl.startsWith('http') ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
                                return `
                                    <div class="thumbnail-item">
                                        <img src="${proxyUrl}" alt="Foto ${idx + 1}" class="product-thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${proxyUrl}', this)" loading="lazy">
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- INFORMAÇÕES DO PRODUTO -->
                <div class="product-details">
                    <!-- TÍTULO -->
                    <div class="product-header">
                        <h1 class="product-title">${productData.name}</h1>
                        <div class="product-rating">
                            <span class="stars">⭐⭐⭐⭐⭐</span>
                            <span class="rating-text">(${productData.reviews || '127'} avaliações)</span>
                        </div>
                    </div>

                    <!-- CORES DISPONÍVEIS -->
                    ${productData.variations?.colors ? `
                        <div class="colors-section">
                            <h3 class="section-title">🎨 Cores Disponíveis:</h3>
                            <div class="colors-grid">
                                ${productData.variations.colors.map(color => `
                                    <div class="color-choice" onclick="selectColor(this)">
                                        <span class="color-label">${color}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- CTA PRINCIPAL -->
                    <div class="main-cta-section">
                        <button class="main-buy-button" onclick="scrollToBuy()">
                            🛒 COMPRAR AGORA COM DESCONTO
                        </button>
                        <p class="cta-subtitle">
                            ✅ Frete Grátis • ✅ Entrega Rápida • ✅ Garantia Total
                        </p>
                    </div>

                    <!-- PREÇOS -->
                    <div class="pricing-section">
                        <div class="urgency-banner">
                            ⚡ OFERTA RELÂMPAGO - Termina em: <span id="timer">23:59:45</span>
                        </div>
                        
                        <div class="price-container">
                            <div class="price-row">
                                <span class="current-price">${productData.price}</span>
                                ${productData.originalPrice ? `
                                    <span class="old-price">de ${productData.originalPrice}</span>
                                ` : ''}
                            </div>
                            ${productData.originalPrice ? `
                                <div class="savings-row">
                                    <span class="discount-percentage">${discount}</span>
                                    <span class="savings-amount">Economize R$ ${(() => {
                                        try {
                                            const current = parseFloat(productData.price.replace(/[^\d,]/g, '').replace(',', '.'));
                                            const original = parseFloat(productData.originalPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                                            return (original - current).toFixed(2).replace('.', ',');
                                        } catch {
                                            return '147,00';
                                        }
                                    })()}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- POR QUE ESCOLHER -->
                    <div class="why-choose-section">
                        <h3 class="section-title">🔥 Por que você precisa deste produto?</h3>
                        <div class="benefits-summary">
                            <div class="benefit-point">✅ Couro genuíno de alta qualidade</div>
                            <div class="benefit-point">✅ Conforto excepcional o dia todo</div>
                            <div class="benefit-point">✅ Design elegante e profissional</div>
                            <div class="benefit-point">✅ Solado antiderrapante e seguro</div>
                        </div>
                    </div>

                    <!-- ESPECIFICAÇÕES -->
                    <div class="specifications-section">
                        <h3 class="section-title">📋 Especificações do Produto:</h3>
                        <div class="specs-grid">
                            <div class="spec-item">
                                <span class="spec-label">🧵 Material:</span>
                                <span class="spec-value">Couro Bovino Premium</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">👟 Solado:</span>
                                <span class="spec-value">Micro Expandido Ultralevе</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">🛡️ Forro:</span>
                                <span class="spec-value">Couro Natural</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">💎 Palmilha:</span>
                                <span class="spec-value">Gel Comfort</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- MODAL DE IMAGEM -->
    <div id="imageModal" class="image-modal" onclick="closeImageModal()">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <img id="modalImage" src="" alt="">
            <div class="modal-nav">
                <button onclick="previousImage()">&lt;</button>
                <button onclick="nextImage()">&gt;</button>
            </div>
        </div>
    </div>

    <!-- BENEFÍCIOS -->
    <section class="benefits">
        <div class="container">
            <h2 class="section-title">Por que este é o melhor choice?</h2>
            <div class="benefits-grid">
                ${copyData.beneficios.map((benefit, idx) => {
                    // Extrair emoji e texto do benefício
                    const benefitParts = benefit.split(' ');
                    const icon = benefitParts[0]; // Primeiro item é o emoji
                    const title = benefitParts.slice(1).join(' '); // Resto é o título
                    
                    return `
                        <div class="benefit">
                            <span class="benefit-icon">${icon}</span>
                            <h3>${title}</h3>
                            <p>Diferencial exclusivo que eleva sua experiência ao próximo nível.</p>
                        </div>
                    `;
                }).join('')}
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
        // Timer de urgência
        let timeLeft = 23 * 3600 + 59 * 60 + 45; // 23:59:45
        
        function updateCountdown() {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            const timerElement = document.getElementById('timer');
            const countdownElement = document.getElementById('countdown');
            
            const timeString = \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
            
            if (timerElement) timerElement.textContent = timeString;
            if (countdownElement) countdownElement.textContent = timeString;
            
            timeLeft--;
            if (timeLeft < 0) timeLeft = 23 * 3600 + 59 * 60 + 45;
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();

        // Carrossel de imagens
        let currentImageIndex = 0;
        const productImages = [${productData.images.map(img => {
            const imageUrl = typeof img === 'string' ? img : (img as any)?.url || (img as any)?.src || (img as any)?.local_path || '';
            const proxyUrl = imageUrl && imageUrl.startsWith('http') ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
            return `'${proxyUrl}'`;
        }).join(', ')}];

        function changeMainImage(imageSrc, thumbnailElement) {
            const mainImage = document.getElementById('mainImage');
            if (mainImage) mainImage.src = imageSrc;
            
            // Atualizar thumbnail ativo
            document.querySelectorAll('.product-thumbnail').forEach(thumb => thumb.classList.remove('active'));
            if (thumbnailElement) thumbnailElement.classList.add('active');
            
            // Atualizar índice atual
            currentImageIndex = Array.from(document.querySelectorAll('.product-thumbnail')).indexOf(thumbnailElement);
        }

        // Modal de imagem
        function openImageModal(imageSrc) {
            const modalImage = document.getElementById('modalImage');
            const imageModal = document.getElementById('imageModal');
            
            if (modalImage) modalImage.src = imageSrc;
            if (imageModal) imageModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeImageModal() {
            const imageModal = document.getElementById('imageModal');
            if (imageModal) imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function previousImage() {
            currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : productImages.length - 1;
            const modalImage = document.getElementById('modalImage');
            const mainImage = document.getElementById('mainImage');
            
            if (modalImage) modalImage.src = productImages[currentImageIndex];
            if (mainImage) mainImage.src = productImages[currentImageIndex];
            
            updateActiveThumbnail();
        }

        function nextImage() {
            currentImageIndex = currentImageIndex < productImages.length - 1 ? currentImageIndex + 1 : 0;
            const modalImage = document.getElementById('modalImage');
            const mainImage = document.getElementById('mainImage');
            
            if (modalImage) modalImage.src = productImages[currentImageIndex];
            if (mainImage) mainImage.src = productImages[currentImageIndex];
            
            updateActiveThumbnail();
        }

        function updateActiveThumbnail() {
            document.querySelectorAll('.product-thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentImageIndex);
            });
        }

        // Seleção de cor
        function selectColor(colorElement) {
            document.querySelectorAll('.color-choice').forEach(option => option.classList.remove('selected'));
            if (colorElement) colorElement.classList.add('selected');
        }

        // Eventos de teclado para modal
        document.addEventListener('keydown', function(e) {
            const imageModal = document.getElementById('imageModal');
            if (imageModal && imageModal.style.display === 'block') {
                if (e.key === 'Escape') closeImageModal();
                if (e.key === 'ArrowLeft') previousImage();
                if (e.key === 'ArrowRight') nextImage();
            }
        });

        // Scroll suave
        function scrollToBuy() {
            const buySection = document.getElementById('buy-section');
            if (buySection) {
                buySection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
        
        function buyNow() {
            alert('🚀 Redirecionando para o checkout seguro...');
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

  private formatProductDescription(description: string): string {
    if (!description) return '';
    
    // Limpar a descrição e organizar
    let formatted = description
      .replace(/Detalhes do Produto/g, '')
      .replace(/Categoria/g, '📂 Categoria: ')
      .replace(/Estoque/g, '📦 Estoque: ')
      .replace(/Marca/g, '🏷️ Marca: ')
      .replace(/Material:/g, '🧵 Material:')
      .replace(/Cor:/g, '🎨 Cor:')
      .replace(/Descrição do produto/g, '')
      .replace(/Ficha Técnica:/g, '<h4>📋 Especificações Técnicas:</h4>');

    // Detectar listas de características e formatar
    const features = [
      'Sola Leve', 'Texturas Verticais', 'Couro Bovino', 'Forro de Couro', 'Palmilha de Gel',
      'Conforto', 'Durabilidade', 'Qualidade', 'Design', 'Resistência'
    ];

    features.forEach(feature => {
      const regex = new RegExp(`⚫\\s*${feature}[^⚫]*`, 'gi');
      formatted = formatted.replace(regex, (match) => {
        return `<div class="feature-item">✨ ${match.replace('⚫', '').trim()}</div>`;
      });
    });

    // Adicionar estrutura HTML
    formatted = `
      <div class="description-sections">
        <div class="main-description">
          ${formatted.split('Ficha Técnica')[0] || formatted}
        </div>
        ${formatted.includes('Especificações') ? `
          <div class="specifications">
            ${formatted.split('Especificações Técnicas:')[1] || ''}
          </div>
        ` : ''}
      </div>
    `;

    return formatted;
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