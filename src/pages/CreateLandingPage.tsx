import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Eye, 
  Edit3, 
  Save, 
  Share2, 
  CheckCircle,
  AlertCircle,
  Loader,
  Image,
  Type,
  Palette,
  Layout,
  ExternalLink,
  Copy,
  X,
  Link2,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLandingPageGenerator } from "@/hooks/useLandingPageGenerator";
import { aiLandingPageGenerator } from "@/services/aiLandingPageGenerator";

const CreateLandingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [extractedProduct, setExtractedProduct] = useState<any>(null);
  const [generatedPage, setGeneratedPage] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    primaryColor: '#667eea',
    ctaText: 'COMPRAR AGORA',
    layout: 'modern',
    title: '',
    subtitle: '',
    urgencyText: 'OFERTA POR TEMPO LIMITADO!',
    currentPrice: '',
    originalPrice: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Funções de cálculo corretas
  const calculateSavings = (currentPrice: string, originalPrice: string): string => {
    try {
      // Extrair valores numéricos dos preços
      const current = parseFloat(currentPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
      const original = parseFloat(originalPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
      
      if (isNaN(current) || isNaN(original) || original <= current) {
        return '';
      }
      
      const savings = original - current;
      return `R$ ${savings.toFixed(2).replace('.', ',')}`;
    } catch (error) {
      console.error('Erro ao calcular economia:', error);
      return '';
    }
  };
  
  const calculateDiscountPercentage = (currentPrice: string, originalPrice: string): string => {
    try {
      // Extrair valores numéricos dos preços
      const current = parseFloat(currentPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
      const original = parseFloat(originalPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
      
      if (isNaN(current) || isNaN(original) || original <= current) {
        return '';
      }
      
      const discountPercentage = ((original - current) / original) * 100;
      return `${Math.round(discountPercentage)}% OFF`;
    } catch (error) {
      console.error('Erro ao calcular desconto:', error);
      return '';
    }
  };

  const steps = [
    { id: 1, title: "Upload JSON", description: "Faça upload do arquivo JSON" },
    { id: 2, title: "Dados Processados", description: "Revise as informações" },
    { id: 3, title: "Gerar Landing Page", description: "IA criando sua página" },
    { id: 4, title: "Editor & Preview", description: "Personalize e publique" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo JSON válido",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    processJsonFile(file);
  };

  const processJsonFile = async (file: File) => {
    setUploading(true);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Enviar para o backend
      const response = await fetch('http://localhost:5007/api/upload-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (result.success) {
        setJsonData(data);
        setExtractedProduct(result.data);
        
        // Inicializar TODAS as imagens como selecionadas por padrão
        const totalImages = result.data?.images?.length || 0;
        if (totalImages > 0) {
          const allImageIndices = Array.from({ length: totalImages }, (_, i) => i);
          setSelectedImages(allImageIndices);
          console.log(` Todas as ${totalImages} imagens foram selecionadas automaticamente`);
        }
        
        // Inicializar configurações do editor
        setEditorSettings(prev => ({
          ...prev,
          title: result.data?.name || '',
          subtitle: 'Produto de alta qualidade com o melhor custo-benefício',
          currentPrice: result.data?.price || '',
          originalPrice: result.data?.originalPrice || ''
        }));
        
        // Testar cálculos para debug
        if (result.data?.price && result.data?.originalPrice) {
          const testSavings = calculateSavings(result.data.price, result.data.originalPrice);
          const testDiscount = calculateDiscountPercentage(result.data.price, result.data.originalPrice);
          console.log('🧮 Teste de cálculos:');
          console.log('💰 Preço atual:', result.data.price);
          console.log('💰 Preço original:', result.data.originalPrice);
          console.log('💸 Economia calculada:', testSavings);
          console.log('🔥 Desconto calculado:', testDiscount);
        }
        
        setCurrentStep(2);
        toast({
          title: "Sucesso!",
          description: "Dados do produto processados com sucesso"
        });
      } else {
        throw new Error(result.error || 'Erro ao processar dados');
      }
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo JSON",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Funções para seleção de imagens
  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAllImages = () => {
    if (extractedProduct?.images) {
      setSelectedImages(extractedProduct.images.map((_: any, idx: number) => idx));
    }
  };

  const clearImageSelection = () => {
    setSelectedImages([]);
  };

  // Função para visualizar em página completa
  const openFullPagePreview = async () => {
    console.log('🖼️ Abrindo preview completo...');
    console.log('📋 Estado atual:', {
      hasGeneratedPage: !!generatedPage?.html,
      hasExtractedProduct: !!extractedProduct,
      hasJsonData: !!jsonData,
      productId: currentProductId
    });
    
    if (!generatedPage?.html) {
      toast({
        title: "Erro",
        description: "Nenhuma landing page foi gerada ainda",
        variant: "destructive"
      });
      return;
    }

    if (!extractedProduct) {
      toast({
        title: "Erro",
        description: "Dados do produto não encontrados",
        variant: "destructive"
      });
      return;
    }

    // Sempre usar método direto para evitar erro 404
    console.log('🔄 Usando método direto para abrir preview...');
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(generatedPage.html);
      newWindow.document.close();
      newWindow.document.title = `Landing Page - ${extractedProduct?.name || 'Produto'}`;
      
      toast({
        title: "✅ Página aberta!",
        description: "Landing page aberta em nova aba para visualização completa"
      });
      
      console.log('✅ Preview completo aberto com sucesso!');
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível abrir nova aba. Verifique se popups estão bloqueados.",
        variant: "destructive"
      });
    }
    return;

    // Código de backend removido para evitar erro 404
    // Usando apenas método direto que é mais confiável
  };

  // Estado para armazenar ID do produto atual
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [landingPageUrl, setLandingPageUrl] = useState<string | null>(null);

  // Função auxiliar para obter ID do produto
  const getProductId = () => {
    if (currentProductId) return currentProductId;
    
    // Gerar ID único baseado no produto
    const productName = extractedProduct?.name || 'produto';
    const timestamp = Date.now();
    const id = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}_${timestamp}`;
    setCurrentProductId(id);
    return id;
  };

  // Estado para forçar re-render do preview
  const [previewKey, setPreviewKey] = useState(0);
  
  // Funções do editor
  const updateEditorSetting = (key: string, value: string) => {
    console.log(`🔄 Atualizando configuração: ${key} = ${value}`);
    
    setEditorSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: value
      };
      console.log('📋 Novas configurações do editor:', newSettings);
      
      // Aplicar alterações imediatamente após atualizar o estado
      if (generatedPage) {
        console.log('🔄 Agendando aplicação de alterações com novas configurações...');
        setTimeout(() => {
          console.log('🔧 Aplicando alterações com:', newSettings);
          applyEditorChangesWithNewSettings(newSettings);
        }, 100);
      }
      
      return newSettings;
    });
  };
  
  // Função para aplicar alterações com configurações específicas
  const applyEditorChangesWithNewSettings = async (settings = editorSettings) => {
    if (!extractedProduct || !generatedPage) return;

    try {
      console.log('🔧 Aplicando alterações do editor:', settings);
      
      let updatedHtml = generatedPage.html;
      
      // 1. Aplicar cor principal
      console.log('🎨 Aplicando cor:', settings.primaryColor);
      
      // Substituir variáveis CSS de cor
      updatedHtml = updatedHtml.replace(
        /--color-primary:\s*#[A-Fa-f0-9]{6}/gi,
        `--color-primary: ${settings.primaryColor}`
      );
      updatedHtml = updatedHtml.replace(
        /--color-primary-dark:\s*#[A-Fa-f0-9]{6}/gi,
        `--color-primary-dark: ${settings.primaryColor}`
      );
      
      // Substituir cores específicas
      const specificColors = ['#667eea', '#EE4D2D', '#D73210', '#f97316', '#ec4899', '#ef4444', '#8b5cf6', '#10b981'];
      specificColors.forEach(color => {
        const colorRegex = new RegExp(color.replace('#', '\\#'), 'gi');
        updatedHtml = updatedHtml.replace(colorRegex, settings.primaryColor);
      });
      
      // 2. Aplicar textos
      if (settings.title && settings.title.trim()) {
        const escapedOriginalName = extractedProduct.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const titleRegex = new RegExp(`(<h1[^>]*class="product-title"[^>]*>)${escapedOriginalName}(</h1>)`, 'gi');
        updatedHtml = updatedHtml.replace(titleRegex, `$1${settings.title}$2`);
      }
      
      if (settings.ctaText && settings.ctaText.trim()) {
        const ctaReplacements = [
          /COMPRAR AGORA/gi,
          /QUERO MEU SAPATO/gi,
          /APROVEITAR OFERTA/gi,
          /GARANTIR DESCONTO/gi
        ];
        
        ctaReplacements.forEach(regex => {
          updatedHtml = updatedHtml.replace(regex, settings.ctaText);
        });
      }
      
      // 3. Aplicar preços de forma mais robusta
      const currentPriceToUse = settings.currentPrice || extractedProduct.price || '';
      const originalPriceToUse = settings.originalPrice || extractedProduct.originalPrice || '';
      
      console.log('💰 Aplicando preços:', {
        currentPriceToUse,
        originalPriceToUse,
        extractedCurrentPrice: extractedProduct.price,
        extractedOriginalPrice: extractedProduct.originalPrice
      });
      
      if (currentPriceToUse && currentPriceToUse.trim()) {
        // Substituir preço atual em vários formatos
        const currentPricePatterns = [
          // Preço atual em spans com classes específicas
          /(<span[^>]*class="[^"]*current[^"]*price[^"]*"[^>]*>)[^<]*(<\/span>)/gi,
          /(<span[^>]*class="[^"]*price[^"]*current[^"]*"[^>]*>)[^<]*(<\/span>)/gi,
          // Preço atual em divs
          /(<div[^>]*class="[^"]*current[^"]*price[^"]*"[^>]*>)[^<]*(<\/div>)/gi,
          /(<div[^>]*class="[^"]*price[^"]*current[^"]*"[^>]*>)[^<]*(<\/div>)/gi,
          // Preço em formato R$ XX,XX (primeiro encontrado)
          /(R\$\s*)[\d.,]+/i
        ];
        
        let priceReplaced = false;
        currentPricePatterns.forEach(pattern => {
          if (!priceReplaced && updatedHtml.match(pattern)) {
            if (pattern.source.includes('span') || pattern.source.includes('div')) {
              updatedHtml = updatedHtml.replace(pattern, `$1${currentPriceToUse}$2`);
            } else {
              updatedHtml = updatedHtml.replace(pattern, `$1${currentPriceToUse}`);
            }
            priceReplaced = true;
            console.log('✅ Preço atual substituído:', currentPriceToUse);
          }
        });
        
        // Fallback: substituir preço original do produto se não encontrou padrões
        if (!priceReplaced && extractedProduct.price) {
          const escapedOriginalPrice = extractedProduct.price.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          updatedHtml = updatedHtml.replace(
            new RegExp(escapedOriginalPrice, 'gi'),
            currentPriceToUse
          );
          console.log('✅ Preço atual substituído (fallback):', currentPriceToUse);
        }
      }
      
      if (originalPriceToUse && originalPriceToUse.trim()) {
        // Substituir preço original (riscado) em vários formatos
        const originalPricePatterns = [
          // Preço original riscado
          /(<span[^>]*class="[^"]*line-through[^"]*"[^>]*>)[^<]*(<\/span>)/gi,
          /(<span[^>]*class="[^"]*original[^"]*price[^"]*"[^>]*>)[^<]*(<\/span>)/gi,
          /(<del[^>]*>)[^<]*(<\/del>)/gi,
          /(<s[^>]*>)[^<]*(<\/s>)/gi
        ];
        
        let originalPriceReplaced = false;
        originalPricePatterns.forEach(pattern => {
          if (!originalPriceReplaced && updatedHtml.match(pattern)) {
            updatedHtml = updatedHtml.replace(pattern, `$1${originalPriceToUse}$2`);
            originalPriceReplaced = true;
            console.log('✅ Preço original substituído:', originalPriceToUse);
          }
        });
        
        // Fallback: substituir preço original do produto se não encontrou padrões
        if (!originalPriceReplaced && extractedProduct.originalPrice) {
          const escapedOriginalOriginalPrice = extractedProduct.originalPrice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          updatedHtml = updatedHtml.replace(
            new RegExp(escapedOriginalOriginalPrice, 'gi'),
            originalPriceToUse
          );
          console.log('✅ Preço original substituído (fallback):', originalPriceToUse);
        }
      }
      
      console.log('✅ HTML atualizado, aplicando ao preview...');
      console.log('🖼️ Verificando se imagens estão preservadas:', updatedHtml.includes('<img'));
      
      // Atualizar o estado e forçar re-render
      setGeneratedPage(prev => ({
        ...prev,
        html: updatedHtml
      }));
      
      // Forçar re-render do preview
      setPreviewKey(prev => prev + 1);
      
      console.log('✅ Preview atualizado com sucesso!');
      console.log('📊 Estado atual do editor:', settings);
      
    } catch (error) {
      console.error('❌ Erro ao aplicar alterações:', error);
    }
  };
  
  // Funções duplicadas removidas - usando as definidas no início do arquivo

  const applyEditorChanges = async () => {
    console.log('🔄 Aplicando alterações do editor (função principal)...');
    console.log('📋 Configurações atuais do editor:', editorSettings);
    
    // Usar a nova função com as configurações atuais
    return applyEditorChangesWithNewSettings(editorSettings);
  };
  
  const applyEditorChangesOld = async () => {
    if (!extractedProduct || !generatedPage) return;

    try {
      console.log('🔧 Aplicando alterações do editor:', editorSettings);
      
      // Aplicar as configurações do editor ao HTML gerado
      let updatedHtml = generatedPage.html;
      
      // 1. Substituir TODAS as cores primárias de forma mais robusta
      console.log('🎨 Aplicando cor:', editorSettings.primaryColor);
      
      // Substituir variáveis CSS de cor
      updatedHtml = updatedHtml.replace(
        /--color-primary:\s*#[A-Fa-f0-9]{6}/gi,
        `--color-primary: ${editorSettings.primaryColor}`
      );
      updatedHtml = updatedHtml.replace(
        /--color-primary-dark:\s*#[A-Fa-f0-9]{6}/gi,
        `--color-primary-dark: ${editorSettings.primaryColor}`
      );
      
      // Substituir cores específicas no CSS e HTML
      const specificColors = ['#667eea', '#EE4D2D', '#D73210', '#f97316', '#ec4899', '#ef4444', '#8b5cf6', '#10b981'];
      specificColors.forEach(color => {
        const colorRegex = new RegExp(color.replace('#', '\\#'), 'gi');
        updatedHtml = updatedHtml.replace(colorRegex, editorSettings.primaryColor);
      });
      
      // Substituir cores em estilos inline
      updatedHtml = updatedHtml.replace(
        /background-color:\s*#[A-Fa-f0-9]{6}/gi,
        `background-color: ${editorSettings.primaryColor}`
      );
      updatedHtml = updatedHtml.replace(
        /color:\s*#[A-Fa-f0-9]{6}/gi,
        `color: ${editorSettings.primaryColor}`
      );
      updatedHtml = updatedHtml.replace(
        /border-color:\s*#[A-Fa-f0-9]{6}/gi,
        `border-color: ${editorSettings.primaryColor}`
      );
      
      // 2. Substituir texto do CTA em TODOS os botões
      const ctaReplacements = [
        /COMPRAR AGORA/gi,
        /QUERO MEU SAPATO/gi,
        /APROVEITAR OFERTA/gi,
        /GARANTIR DESCONTO/gi,
        /QUERO PARA MEU FILHO/gi,
        /GARANTE O SEU/gi,
        /QUERO MEU TÊNIS/gi,
        /QUERO AGORA/gi,
        /QUERO ESSA PEÇA/gi,
        /GARANTIR O MEU/gi,
        /QUERO NO MEU PULSO/gi,
        /QUERO COMIGO/gi
      ];
      
      ctaReplacements.forEach(regex => {
        updatedHtml = updatedHtml.replace(regex, editorSettings.ctaText);
      });
      
      // 3. Substituir título principal se fornecido
      if (editorSettings.title && editorSettings.title.trim()) {
        // Escapar caracteres especiais para regex
        const escapedOriginalName = extractedProduct.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const titleRegex = new RegExp(`(<h1[^>]*class="product-title"[^>]*>)${escapedOriginalName}(</h1>)`, 'gi');
        updatedHtml = updatedHtml.replace(titleRegex, `$1${editorSettings.title}$2`);
        
        // Também substituir no title da página
        const pageTitleRegex = new RegExp(`(<title>)${escapedOriginalName}(</title>)`, 'gi');
        updatedHtml = updatedHtml.replace(pageTitleRegex, `$1${editorSettings.title}$2`);
      }
      
      // 4. Substituir subtítulo se fornecido
      if (editorSettings.subtitle && editorSettings.subtitle.trim()) {
        // Procurar por elementos de subtítulo comuns
        const subtitleReplacements = [
          /Produto de alta qualidade com o melhor custo-benefício/gi,
          /Produto original da Shopee com garantia e entrega rápida/gi,
          /Seguro, educativo e super divertido para seu filho/gi,
          /Trabalhe, estude e se divirta onde quiser/gi
        ];
        
        subtitleReplacements.forEach(regex => {
          updatedHtml = updatedHtml.replace(regex, editorSettings.subtitle);
        });
        
        // Substituir em elementos específicos
        updatedHtml = updatedHtml.replace(
          /(<p class="product-subtitle"[^>]*>).*?(<\/p>)/gi,
          `$1${editorSettings.subtitle}$2`
        );
      }
      
      // 5. Substituir texto de urgência
      if (editorSettings.urgencyText && editorSettings.urgencyText.trim()) {
        const urgencyReplacements = [
          /OFERTA POR TEMPO LIMITADO!/gi,
          /⏰ Desconto por TEMPO LIMITADO - Apenas hoje!/gi,
          /🔥 Últimas unidades em estoque!/gi
        ];
        
        urgencyReplacements.forEach(regex => {
          updatedHtml = updatedHtml.replace(regex, editorSettings.urgencyText);
        });
        
        // Substituir na barra de urgência mantendo o countdown
        updatedHtml = updatedHtml.replace(
          /(<div class="urgency-bar"[^>]*>).*?(<span id="countdown">.*?<\/span>.*?<\/div>)/gi,
          `$1${editorSettings.urgencyText} $2`
        );
      }
      
      // 6. Substituir preços de forma mais robusta
      console.log('💰 Aplicando preços:', {
        currentPrice: editorSettings.currentPrice,
        originalPrice: editorSettings.originalPrice,
        extractedCurrentPrice: extractedProduct.price,
        extractedOriginalPrice: extractedProduct.originalPrice
      });
      
      // Substituir preço atual
      const currentPriceToUse = editorSettings.currentPrice || extractedProduct.price || '';
      const originalPriceToUse = editorSettings.originalPrice || extractedProduct.originalPrice || '';
      
      if (currentPriceToUse && currentPriceToUse.trim()) {
        // Encontrar e substituir preços atuais em vários formatos
        const pricePatterns = [
          /R\$\s*[\d.,]+/gi,
          /<span[^>]*class="[^"]*current[^"]*price[^"]*"[^>]*>[^<]*<\/span>/gi,
          /<div[^>]*class="[^"]*price[^"]*"[^>]*>[^<]*<\/div>/gi
        ];
        
        // Substituir o primeiro preço encontrado (que geralmente é o preço atual)
        let priceReplaced = false;
        pricePatterns.forEach(pattern => {
          if (!priceReplaced) {
            const matches = updatedHtml.match(pattern);
            if (matches && matches.length > 0) {
              // Substituir apenas a primeira ocorrência (preço atual)
              updatedHtml = updatedHtml.replace(pattern, (match) => {
                if (!priceReplaced) {
                  priceReplaced = true;
                  if (match.includes('<span') || match.includes('<div')) {
                    return match.replace(/>[^<]*</, `>${currentPriceToUse}<`);
                  } else {
                    return currentPriceToUse;
                  }
                }
                return match;
              });
            }
          }
        });
        
        // Se não encontrou padrões específicos, substituir o preço original do produto
        if (!priceReplaced && extractedProduct.price) {
          const escapedOriginalPrice = extractedProduct.price.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          updatedHtml = updatedHtml.replace(
            new RegExp(escapedOriginalPrice, 'gi'),
            currentPriceToUse
          );
        }
      }
      
      // Substituir preço original (riscado)
      if (originalPriceToUse && originalPriceToUse.trim()) {
        const originalPricePatterns = [
          /<span[^>]*class="[^"]*line-through[^"]*"[^>]*>[^<]*<\/span>/gi,
          /<span[^>]*class="[^"]*original[^"]*price[^"]*"[^>]*>[^<]*<\/span>/gi,
          /<del[^>]*>[^<]*<\/del>/gi
        ];
        
        originalPricePatterns.forEach(pattern => {
          updatedHtml = updatedHtml.replace(pattern, (match) => {
            return match.replace(/>[^<]*</, `>${originalPriceToUse}<`);
          });
        });
        
        // Se não encontrou padrões específicos, substituir o preço original do produto
        if (extractedProduct.originalPrice) {
          const escapedOriginalOriginalPrice = extractedProduct.originalPrice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          updatedHtml = updatedHtml.replace(
            new RegExp(escapedOriginalOriginalPrice, 'gi'),
            originalPriceToUse
          );
        }
      }
      
      // 7. Atualizar economia e desconto se ambos os preços estiverem definidos
      const currentPriceForCalc = editorSettings.currentPrice || extractedProduct.price || '';
      const originalPriceForCalc = editorSettings.originalPrice || extractedProduct.originalPrice || '';
      
      console.log('💰 Calculando economia e desconto:', {
        currentPrice: currentPriceForCalc,
        originalPrice: originalPriceForCalc
      });
      
      if (currentPriceForCalc && originalPriceForCalc) {
        const newSavings = calculateSavings(currentPriceForCalc, originalPriceForCalc);
        const newDiscount = calculateDiscountPercentage(currentPriceForCalc, originalPriceForCalc);
        
        console.log('📊 Resultados dos cálculos:', {
          savings: newSavings,
          discount: newDiscount
        });
        
        if (newSavings) {
          console.log('💸 Aplicando economia:', newSavings);
          
          // Debug: verificar conteúdo HTML antes da substituição
          console.log('🔍 HTML antes da substituição de economia:');
          const economyMatches = updatedHtml.match(/Você economiza[^<>]*R\$[^<>]*/gi);
          console.log('💸 Encontrados textos de economia:', economyMatches);
          
          const discountMatches = updatedHtml.match(/\d+%\s*OFF/gi);
          console.log('🔥 Encontrados textos de desconto:', discountMatches);
          
          // Substituir texto de economia em vários formatos
          const savingsPatterns = [
            // "Você economiza R$ XX,XX"
            /(Você economiza:?\s*)R\$\s*[\d.,]+/gi,
            // "Economiza R$ XX,XX"
            /(Economiza:?\s*)R\$\s*[\d.,]+/gi,
            // Spans com classe savings
            /(<span[^>]*class="[^"]*savings[^"]*"[^>]*>)[^<]*(<\/span>)/gi,
            // Divs com classe savings
            /(<div[^>]*class="[^"]*savings[^"]*"[^>]*>)[^<]*(<\/div>)/gi,
            // Padrão genérico para economia
            /R\$\s*[\d.,]+(?=\s*(?:de\s*economia|economizado))/gi
          ];
          
          savingsPatterns.forEach((pattern, index) => {
            const beforeReplace = updatedHtml;
            const matches = updatedHtml.match(pattern);
            
            if (matches) {
              console.log(`🎯 Padrão ${index + 1} encontrou:`, matches);
            }
            
            if (pattern.source.includes('span') || pattern.source.includes('div')) {
              updatedHtml = updatedHtml.replace(pattern, `$1${newSavings}$2`);
            } else {
              updatedHtml = updatedHtml.replace(pattern, `$1${newSavings}`);
            }
            
            if (beforeReplace !== updatedHtml) {
              console.log(`✅ Economia substituída (padrão ${index + 1}):`, newSavings);
            }
          });
          
          // Debug: verificar conteúdo HTML após substituição
          console.log('🔍 HTML após substituição de economia:');
          const economyMatchesAfter = updatedHtml.match(/Você economiza[^<>]*R\$[^<>]*/gi);
          console.log('💸 Textos de economia após substituição:', economyMatchesAfter);
        }
        
        if (newDiscount) {
          console.log('🔥 Aplicando desconto:', newDiscount);
          
          // Substituir desconto percentual em vários formatos
          const discountPatterns = [
            // "XX% OFF"
            /\d+%\s*OFF/gi,
            // "XX% de desconto"
            /\d+%\s*de\s*desconto/gi,
            // Badges e spans com classe discount
            /(<[^>]*class="[^"]*discount[^"]*"[^>]*>)[^<]*(<\/[^>]*>)/gi,
            // Spans específicos de desconto
            /(<span[^>]*class="[^"]*discount[^"]*"[^>]*>)[^<]*(<\/span>)/gi,
            // Divs de desconto
            /(<div[^>]*class="[^"]*discount[^"]*"[^>]*>)[^<]*(<\/div>)/gi
          ];
          
          discountPatterns.forEach((pattern, index) => {
            const beforeReplace = updatedHtml;
            const matches = updatedHtml.match(pattern);
            
            if (matches) {
              console.log(`🎯 Padrão de desconto ${index + 1} encontrou:`, matches);
            }
            
            if (pattern.source.includes('<')) {
              updatedHtml = updatedHtml.replace(pattern, `$1${newDiscount}$2`);
            } else {
              updatedHtml = updatedHtml.replace(pattern, newDiscount);
            }
            
            if (beforeReplace !== updatedHtml) {
              console.log(`✅ Desconto substituído (padrão ${index + 1}):`, newDiscount);
            }
          });
          
          // Debug: verificar conteúdo HTML após substituição
          console.log('🔍 HTML após substituição de desconto:');
          const discountMatchesAfter = updatedHtml.match(/\d+%\s*OFF/gi);
          console.log('🔥 Textos de desconto após substituição:', discountMatchesAfter);
        }
      }

      setGeneratedPage(prev => ({
        ...prev,
        html: updatedHtml
      }));
      
      console.log('✅ Alterações aplicadas com sucesso!');
      
      // Forçar re-render do iframe
      setTimeout(() => {
        const iframe = document.querySelector('iframe[title="Landing Page Preview"]') as HTMLIFrameElement;
        if (iframe) {
          iframe.srcdoc = updatedHtml;
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Erro ao aplicar alterações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aplicar as alterações",
        variant: "destructive"
      });
    }
  };

  const handleGeneratePage = async () => {
    if (!extractedProduct) {
      toast({
        title: "Erro",
        description: "Nenhum produto encontrado para gerar a landing page",
        variant: "destructive"
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos uma imagem para a landing page",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep(3);
    setGenerating(true);
    
    try {
      // 1. Gerar copy persuasivo
      toast({
        title: "🎯 Gerando conteúdo...",
        description: "Criando textos persuasivos com IA"
      });

      const copyData = await aiLandingPageGenerator.generateCopy(extractedProduct);

      // 2. Gerar HTML da landing page
      toast({
        title: "🎨 Criando design...",
        description: "Gerando estrutura HTML otimizada"
      });

      // Normalizar dados do produto para o formato esperado
      const selectedImagesData = selectedImages.map(idx => extractedProduct.images[idx]).filter(Boolean);
      
      const normalizedProduct = {
        name: extractedProduct.name || 'Produto da Shopee',
        price: extractedProduct.price || 'Consulte o preço',
        originalPrice: extractedProduct.originalPrice || '',
        images: selectedImagesData,
        description: extractedProduct.description || '',
        specifications: extractedProduct.specifications || {},
        category: extractedProduct.category || 'Produto da Shopee',
        rating: extractedProduct.rating || 0,
        reviews: extractedProduct.totalRatings || extractedProduct.reviews || 0,
        url: extractedProduct.url || extractedProduct.extractedUrl || jsonData?.url || '',
        variations: {
          colors: extractedProduct.colors || [],
          sizes: extractedProduct.sizes || []
        },
        comments: extractedProduct.comments || []
      };

      console.log('🔧 Produto normalizado:', normalizedProduct);

      const html = await aiLandingPageGenerator.generateLandingPageHTML(normalizedProduct, copyData);

      // 3. Analisar qualidade
      toast({
        title: "📊 Analisando qualidade...",
        description: "Verificando otimizações de conversão"
      });

      const analysis = await aiLandingPageGenerator.analyzeLandingPage(html, normalizedProduct);

      // 4. Gerar variações de design
      const variations = await aiLandingPageGenerator.generateDesignVariations(normalizedProduct, copyData);

      const landingPage = {
        html,
        copy: copyData,
        analysis,
        variations,
        createdAt: new Date()
      };

      setGeneratedPage(landingPage);
      setGenerating(false);
      setCurrentStep(4);

      toast({
        title: "✅ Landing Page Criada!",
        description: `Score de conversão: ${analysis.score_conversao}%`
      });

    } catch (error) {
      console.error('Erro ao gerar landing page:', error);
      setGenerating(false);
      
      toast({
        title: "Erro na geração",
        description: "Falha ao criar a landing page. Tente novamente.",
        variant: "destructive"
      });
      
      // Voltar para o step anterior
      setCurrentStep(2);
    }
  };

  const handleSave = async () => {
    toast({
      title: "Salvo!",
      description: "Landing page salva com sucesso"
    });
  };

  const handlePublish = async () => {
    const url = `https://landing-${Date.now()}.exemplo.com`;
    setPublishedUrl(url);
    toast({
      title: "Publicado!",
      description: "Landing page publicada com sucesso"
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setJsonData(null);
    setExtractedProduct(null);
    setCurrentStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência"
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Faça upload do arquivo JSON</CardTitle>
              <CardDescription>
                Envie um arquivo JSON com os dados do produto para gerar sua landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!uploadedFile ? (
                <div className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Clique para fazer upload</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ou arraste e solte seu arquivo JSON aqui
                    </p>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Selecionar Arquivo JSON
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">📋 Estrutura do JSON:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Seu arquivo JSON deve conter pelo menos os seguintes campos:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code>name</code> - Nome do produto</li>
                  <li>• <code>price</code> - Preço atual</li>
                  <li>• <code>description</code> - Descrição do produto</li>
                  <li>• <code>images</code> - Array de URLs das imagens</li>
                  <li>• <code>category</code> - Categoria do produto</li>
                </ul>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => window.open('/exemplo_produto.json', '_blank')}
                >
                  Ver exemplo de arquivo JSON →
                </Button>
              </div>

              {uploading && (
                <div className="space-y-4">
                  <Progress value={66} className="w-full" />
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processando dados do produto...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Dados extraídos com sucesso!</span>
                </CardTitle>
                <CardDescription>
                  Revise as informações abaixo e faça ajustes se necessário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <Label>Nome do Produto</Label>
                      <Input readOnly value={extractedProduct?.name || ""} className="mt-1" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Preço</Label>
                        <Input readOnly value={extractedProduct?.price || ""} className="mt-1" />
                      </div>
                      <div>
                        <Label>Preço Original</Label>
                        <Input readOnly value={extractedProduct?.originalPrice || ""} className="mt-1" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Categoria</Label>
                      <Input readOnly value={extractedProduct?.category || ""} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label>Descrição</Label>
                        <textarea 
                          className="w-full min-h-[100px] p-3 border rounded-md" 
                          readOnly
                          value={extractedProduct?.description || ""}
                        />
                    </div>
                  </div>

                  {/* Images & Specs */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>Imagens do Produto</Label>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={selectAllImages}
                          >
                            Selecionar Todas
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={clearImageSelection}
                          >
                            Limpar Seleção
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        Selecione as imagens que deseja usar na landing page ({selectedImages.length} selecionadas)
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {extractedProduct?.images?.map((img, idx) => {
                          // Determinar URL da imagem
                          const imageUrl = typeof img === 'string' ? img : img?.url || img?.local_path;
                          const proxyUrl = imageUrl ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : null;
                          const isSelected = selectedImages.includes(idx);
                          
                          return (
                            <div 
                              key={idx} 
                              className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                                isSelected 
                                  ? 'border-primary ring-2 ring-primary/20' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => toggleImageSelection(idx)}
                            >
                              <img 
                                src={proxyUrl || imageUrl} 
                                alt={`Produto ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                                onError={(e) => {
                                  // Fallback para imagem não carregada
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBTaG9wZWU8L3RleHQ+PC9zdmc+';
                                }}
                              />
                              
                              {/* Checkbox overlay */}
                              <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 bg-white flex items-center justify-center ${
                                isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              
                              {/* Image number */}
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                Foto {idx + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Variações */}
                    {extractedProduct?.variations && (
                      <div>
                        <Label>Variações Disponíveis</Label>
                        <div className="space-y-3 mt-2">
                          {extractedProduct.variations.colors && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Cores:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {extractedProduct.variations.colors.map((color, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-background">
                                    {color}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {extractedProduct.variations.sizes && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Tamanhos:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {extractedProduct.variations.sizes.map((size, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-background">
                                    {size}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quantidade em Estoque */}
                    {extractedProduct?.stockQuantity && (
                      <div>
                        <Label>Quantidade Disponível</Label>
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📦</span>
                            <span className="text-lg font-semibold text-green-700">
                              {extractedProduct.stockQuantity} peças disponíveis
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Especificações</Label>
                      <div className="space-y-2 mt-2">
                        {Object.entries(extractedProduct?.specifications || {}).map(([key, value]) => {
                          // Destacar campos importantes
                          const isImportant = ['Estoque', 'Quantidade', 'Tamanho'].includes(key);
                          return (
                            <div key={key} className="flex space-x-2">
                              <Input 
                                readOnly 
                                value={key} 
                                className={`w-1/3 ${isImportant ? 'font-semibold' : ''}`} 
                              />
                              <Input 
                                readOnly 
                                value={value as string} 
                                className={`w-2/3 ${isImportant ? 'font-semibold text-green-700' : ''}`} 
                              />
                            </div>
                          );
                        })}
                        {/* Adicionar tamanho se for único e não estiver nas especificações */}
                        {extractedProduct?.variations?.sizes?.length === 1 && 
                         extractedProduct.variations.sizes[0] === 'Único' &&
                         !Object.keys(extractedProduct?.specifications || {}).some(key => key.toLowerCase().includes('tamanho')) && (
                          <div className="flex space-x-2">
                            <Input readOnly value="Tamanho" className="w-1/3" />
                            <Input readOnly value="Único" className="w-2/3" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="secondary">⭐ {extractedProduct?.rating}</Badge>
                      <Badge variant="outline">{extractedProduct?.comments?.length || extractedProduct?.totalRatings || 0} avaliações</Badge>
                      {extractedProduct?.stockQuantity && (
                        <Badge variant="default" className="bg-green-600">
                          📦 {extractedProduct.stockQuantity} disponíveis
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button onClick={handleGeneratePage} className="btn-gradient px-8">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Gerar Landing Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                  <Loader className="h-8 w-8 text-white animate-spin" />
                </div>
                
                <h2 className="text-2xl font-bold">IA gerando sua landing page...</h2>
                <p className="text-muted-foreground">
                  Nossa inteligência artificial está criando uma página otimizada para conversão
                </p>
                
                <Progress value={65} className="w-full max-w-md mx-auto" />
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Analisando produto e categoria</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Selecionando template otimizado</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-primary" />
                    <span>Gerando conteúdo persuasivo...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={openFullPagePreview} 
                    disabled={!generatedPage}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visualizar Página Completa
                  </Button>
                  {landingPageUrl && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(landingPageUrl);
                        toast({
                          title: "Link copiado!",
                          description: "URL da landing page copiada para o clipboard"
                        });
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Link
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleSave} disabled={!generatedPage}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button className="btn-gradient" onClick={handlePublish} disabled={!generatedPage}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              </div>

              <TabsContent value="preview" className="space-y-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Preview da Landing Page</CardTitle>
                        <CardDescription>
                          Visualize como sua landing page ficará para os visitantes
                        </CardDescription>
                      </div>
                      
                      {landingPageUrl && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Disponível em URL
                          </Badge>
                        </div>
                      )}
                      {publishedUrl && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Publicada
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(publishedUrl)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar URL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(publishedUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Abrir
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg bg-gradient-to-b from-background to-muted/30 min-h-[500px]">
                      {generatedPage ? (
                        <div className="relative">
                          <div className="absolute top-2 right-2 z-10">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={openFullPagePreview}
                              className="shadow-md"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Tela Cheia
                            </Button>
                          </div>
                          <iframe
                            srcDoc={generatedPage.html}
                            className="w-full h-[600px] border-0 rounded-lg"
                            title="Landing Page Preview"
                          />
                        </div>
                      ) : (
                        <div className="p-8 text-center space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                          {/* Header da Landing Page */}
                          <div className="space-y-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {extractedProduct?.name}
                            </h1>
                            
                            <div className="flex items-center justify-center space-x-3">
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <span>⭐</span>
                                <span>{extractedProduct?.rating || '4.9'}</span>
                              </Badge>
                              <Badge variant="outline">
                                {extractedProduct?.comments?.length || extractedProduct?.totalRatings || '17'} avaliações
                              </Badge>
                              <Badge variant="outline">
                                {extractedProduct?.sold || '40'} vendidos
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Galeria de Imagens Selecionadas */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              Galeria de Imagens ({selectedImages.length} selecionadas)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {selectedImages.map((imgIndex) => {
                                const img = extractedProduct?.images?.[imgIndex];
                                if (!img) return null;
                                // Determinar URL da imagem  
                                const imageUrl = typeof img === 'string' ? img : img?.url || img?.local_path;
                                const proxyUrl = imageUrl ? `http://localhost:5007/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : null;
                                
                                return (
                                  <div key={imgIndex} className="relative group">
                                    <img 
                                      src={proxyUrl || imageUrl}
                                      alt={`Produto ${imgIndex + 1}`}
                                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200 group-hover:scale-105"
                                      onError={(e) => {
                                        // Fallback para imagem não carregada
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbnMgZGEgU2hvcGVlPC90ZXh0Pjwvc3ZnPg==';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                        Ver imagem
                                      </span>
                                    </div>
                                  </div>
                                );
                              }) || (
                                <div className="col-span-full text-center py-8 text-muted-foreground">
                                  <div className="space-y-2">
                                    <Image className="w-12 h-12 mx-auto opacity-50" />
                                    <p>Nenhuma imagem encontrada</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Seção de Preços */}
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                            <div className="text-center space-y-3">
                              <div className="flex items-center justify-center space-x-4">
                                <span className="text-4xl font-bold text-green-600">{extractedProduct?.price}</span>
                                {extractedProduct?.originalPrice && (
                                  <>
                                    <span className="text-xl text-muted-foreground line-through">{extractedProduct.originalPrice}</span>
                                    <Badge variant="destructive" className="text-sm animate-pulse">
                                      {extractedProduct.discount || '-50% OFF'}
                                    </Badge>
                                  </>
                                )}
                              </div>
                              
                              {/* Variações */}
                              {(extractedProduct?.colors?.length > 0 || extractedProduct?.sizes?.length > 0) && (
                                <div className="space-y-3">
                                  {extractedProduct?.colors?.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                      <span className="text-sm text-muted-foreground mr-2">Cores:</span>
                                      {extractedProduct.colors.map((color, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {color}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {extractedProduct?.sizes?.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                      <span className="text-sm text-muted-foreground mr-2">Tamanhos:</span>
                                      {extractedProduct.sizes.map((size, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {size}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-center">
                              <Button className="btn-gradient text-lg px-8 py-3">
                                🔥 Comprar Agora - {extractedProduct?.discount || '50% OFF'}
                              </Button>
                            </div>
                          </div>
                          
                          {/* Descrição */}
                          <div className="max-w-2xl mx-auto text-left">
                            <h3 className="text-lg font-semibold mb-3">Sobre o Produto</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {extractedProduct?.description?.substring(0, 300)}
                              {extractedProduct?.description?.length > 300 && '...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="editor" className="space-y-0">
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">🎨 Personalizar</CardTitle>
                      <CardDescription>
                        Customize sua landing page em tempo real
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Cores da Landing Page */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Cor Principal</Label>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            {[
                              { name: 'Azul', color: '#667eea' },
                              { name: 'Verde', color: '#10b981' },
                              { name: 'Roxo', color: '#8b5cf6' },
                              { name: 'Laranja', color: '#f97316' },
                              { name: 'Rosa', color: '#ec4899' },
                              { name: 'Vermelho', color: '#ef4444' }
                            ].map((colorOption) => (
                              <div
                                key={colorOption.color}
                                className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                                  editorSettings.primaryColor === colorOption.color 
                                    ? 'border-gray-800 scale-110' 
                                    : 'border-gray-300 hover:scale-105'
                                }`}
                                style={{ backgroundColor: colorOption.color }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('🎨 Clicando na cor:', colorOption.color);
                                  updateEditorSetting('primaryColor', colorOption.color);
                                  // Aplicar imediatamente
                                  setTimeout(() => applyEditorChanges(), 100);
                                }}
                                title={colorOption.name}
                              />
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Input
                              type="color"
                              value={editorSettings.primaryColor}
                              onChange={(e) => {
                                console.log('🎨 Mudando cor via picker:', e.target.value);
                                updateEditorSetting('primaryColor', e.target.value);
                                setTimeout(() => applyEditorChanges(), 100);
                              }}
                              className="w-16 h-10 p-1 border rounded"
                            />
                            <Input
                              type="text"
                              value={editorSettings.primaryColor}
                              onChange={(e) => {
                                // Validar se é uma cor hexadecimal válida
                                const hexRegex = /^#[0-9A-Fa-f]{6}$/;
                                if (hexRegex.test(e.target.value) || e.target.value === '') {
                                  console.log('🎨 Mudando cor via texto:', e.target.value);
                                  updateEditorSetting('primaryColor', e.target.value);
                                  if (hexRegex.test(e.target.value)) {
                                    setTimeout(() => applyEditorChanges(), 100);
                                  }
                                }
                              }}
                              placeholder="#667eea"
                              className="flex-1 h-10 text-sm font-mono"
                              maxLength={7}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Preços Editáveis */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Preços do Produto</Label>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Preço Atual</Label>
                            <Input
                              value={editorSettings.currentPrice || extractedProduct?.price || ''}
                              onChange={(e) => updateEditorSetting('currentPrice', e.target.value)}
                              placeholder="R$ 99,90"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Preço Original</Label>
                            <Input
                              value={editorSettings.originalPrice || extractedProduct?.originalPrice || ''}
                              onChange={(e) => updateEditorSetting('originalPrice', e.target.value)}
                              placeholder="R$ 199,90"
                              className="text-sm"
                            />
                          </div>
                          {/* Mostrar economia calculada */}
                          {(editorSettings.currentPrice || extractedProduct?.price) && 
                           (editorSettings.originalPrice || extractedProduct?.originalPrice) && (
                            <div className="bg-green-50 p-2 rounded text-xs space-y-1">
                              <div className="text-green-700 font-medium">
                                💰 Você economiza: {calculateSavings(
                                  editorSettings.currentPrice || extractedProduct?.price || '',
                                  editorSettings.originalPrice || extractedProduct?.originalPrice || ''
                                )}
                              </div>
                              <div className="text-green-600">
                                🔥 Desconto: {calculateDiscountPercentage(
                                  editorSettings.currentPrice || extractedProduct?.price || '',
                                  editorSettings.originalPrice || extractedProduct?.originalPrice || ''
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Textos */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Título Principal</Label>
                        <Input
                          value={editorSettings.title}
                          onChange={(e) => updateEditorSetting('title', e.target.value)}
                          placeholder={extractedProduct?.name || "Digite o título"}
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Subtítulo</Label>
                        <textarea
                          value={editorSettings.subtitle}
                          onChange={(e) => updateEditorSetting('subtitle', e.target.value)}
                          placeholder="Descreva os benefícios do produto"
                          className="w-full p-2 border rounded-md text-sm min-h-[60px] resize-none"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Texto do Botão</Label>
                        <Input
                          value={editorSettings.ctaText}
                          onChange={(e) => updateEditorSetting('ctaText', e.target.value)}
                          placeholder="COMPRAR AGORA"
                          className="text-sm font-bold"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Texto de Urgência</Label>
                        <Input
                          value={editorSettings.urgencyText}
                          onChange={(e) => updateEditorSetting('urgencyText', e.target.value)}
                          placeholder="OFERTA POR TEMPO LIMITADO!"
                          className="text-sm"
                        />
                      </div>
                      
                      {/* Aplicar mudanças */}
                      <Button 
                        onClick={applyEditorChanges} 
                        className="w-full" 
                        disabled={!generatedPage}
                        size="sm"
                      >
                        <Palette className="mr-2 h-4 w-4" />
                        Aplicar Alterações
                      </Button>
                      
                      {/* Reset */}
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditorSettings({
                            primaryColor: '#667eea',
                            ctaText: 'COMPRAR AGORA',
                            layout: 'modern',
                            title: extractedProduct?.name || '',
                            subtitle: 'Produto de alta qualidade com o melhor custo-benefício',
                            urgencyText: 'OFERTA POR TEMPO LIMITADO!',
                            currentPrice: extractedProduct?.price || '',
                            originalPrice: extractedProduct?.originalPrice || ''
                          });
                        }}
                        className="w-full"
                        size="sm"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resetar
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>🖼️ Preview em Tempo Real</CardTitle>
                      <CardDescription>
                        Veja como suas alterações ficam na landing page
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg bg-white min-h-[500px] overflow-hidden">
                        {generatedPage ? (
                          <div className="relative">
                            <iframe
                              key={`preview-${previewKey}`}
                              srcDoc={generatedPage.html}
                              className="w-full h-[500px] border-0"
                              title="Landing Page Preview"
                              onLoad={() => console.log('🖼️ Preview carregado!')}
                            />
                            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              Preview ao vivo
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[500px] bg-gradient-to-br from-blue-50 to-purple-50">
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Palette className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  Gere sua landing page primeiro
                                </h3>
                                <p className="text-gray-500 text-sm">
                                  Volte para a aba "Preview" e clique em "Gerar Landing Page"
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Criar Landing Page</h1>
            </div>
            
            {/* Steps */}
            <div className="hidden md:flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-muted-foreground text-xs">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-border ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CreateLandingPage;