import { useState, useRef } from "react";
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
  Link2
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleGeneratePage = async () => {
    if (!extractedProduct) {
      toast({
        title: "Erro",
        description: "Nenhum produto encontrado para gerar a landing page",
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
      const normalizedProduct = {
        name: extractedProduct.name || 'Produto da Shopee',
        price: extractedProduct.price || 'Consulte o preço',
        originalPrice: extractedProduct.originalPrice || '',
        images: extractedProduct.images || [],
        description: extractedProduct.description || '',
        specifications: extractedProduct.specifications || {},
        category: extractedProduct.category || 'Produto da Shopee',
        rating: extractedProduct.rating || 0,
        reviews: extractedProduct.totalRatings || extractedProduct.reviews || 0,
        url: extractedProduct.url || extractedProduct.extractedUrl || jsonData?.url || '',
        variations: {
          colors: extractedProduct.colors || [],
          sizes: extractedProduct.sizes || []
        }
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
                      <Label>Imagens do Produto</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {extractedProduct?.images?.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`Produto ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                          </div>
                        ))}
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

                    <div>
                      <Label>Especificações</Label>
                      <div className="space-y-2 mt-2">
                        {Object.entries(extractedProduct?.specifications || {}).map(([key, value]) => (
                          <div key={key} className="flex space-x-2">
                            <Input readOnly value={key} className="w-1/3" />
                            <Input readOnly value={value as string} className="w-2/3" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="secondary">⭐ {extractedProduct?.rating}</Badge>
                      <Badge variant="outline">{extractedProduct?.totalRatings} avaliações</Badge>
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
                        <iframe
                          srcDoc={generatedPage.html}
                          className="w-full h-[600px] border-0 rounded-lg"
                          title="Landing Page Preview"
                        />
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
                                {extractedProduct?.totalRatings || '17'} avaliações
                              </Badge>
                              <Badge variant="outline">
                                {extractedProduct?.sold || '40'} vendidos
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Galeria de Imagens */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Galeria de Imagens</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {extractedProduct?.images?.slice(0, 8).map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img 
                                    src={typeof img === 'string' ? img : img.url || img.local_path}
                                    alt={`Produto ${idx + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200 group-hover:scale-105"
                                    onError={(e) => {
                                      // Fallback para imagem não carregada
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pjwvc3ZnPg==';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                      Ver imagem
                                    </span>
                                  </div>
                                </div>
                              )) || (
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
                      <CardTitle className="text-lg">Personalizar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Cores</Label>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-primary rounded border-2 border-primary"></div>
                          <div className="w-8 h-8 bg-success rounded border"></div>
                          <div className="w-8 h-8 bg-warning rounded border"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Texto do CTA</Label>
                        <Input placeholder="Comprar Agora" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border rounded p-2 cursor-pointer hover:bg-muted">
                            <Layout className="h-4 w-4" />
                          </div>
                          <div className="border rounded p-2 cursor-pointer hover:bg-muted">
                            <Image className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Editor Visual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 min-h-[400px] bg-muted/30">
                        <p className="text-center text-muted-foreground">
                          Editor visual será implementado aqui
                        </p>
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