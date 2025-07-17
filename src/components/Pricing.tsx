import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para testar a plataforma",
    icon: Zap,
    features: [
      "2 landing pages",
      "Extração de produtos básica",
      "Templates limitados",
      "Hospedagem no subdomínio",
      "Analytics básico",
      "Suporte por email"
    ],
    limitations: [
      "Marca d'água AIVENDAS",
      "Limite de 1000 visualizações/mês"
    ],
    cta: "Começar Grátis",
    popular: false,
    color: "border-border"
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "/mês",
    description: "Para empreendedores sérios",
    icon: Star,
    features: [
      "Landing pages ilimitadas",
      "Extração avançada com IA",
      "Todos os templates",
      "Domínio personalizado",
      "Analytics completo",
      "A/B Testing",
      "Editor avançado",
      "Suporte prioritário",
      "Integrações (Zapier, etc)"
    ],
    limitations: [],
    cta: "Assinar Pro",
    popular: true,
    color: "border-primary"
  },
  {
    name: "Business",
    price: "R$ 99",
    period: "/mês",
    description: "Para agências e grandes volumes",
    icon: Crown,
    features: [
      "Tudo do plano Pro",
      "Múltiplas marcas/contas",
      "API personalizada",
      "Whitelabel completo",
      "Gerente de conta dedicado",
      "Integração personalizada",
      "Relatórios avançados",
      "SLA 99.9% uptime",
      "Suporte 24/7"
    ],
    limitations: [],
    cta: "Falar com Vendas",
    popular: false,
    color: "border-warning"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success-light text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star size={16} />
            <span>Preços Simples e Transparentes</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Escolha o plano ideal{" "}
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              para seu negócio
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comece grátis e escale conforme seu negócio cresce. Sem surpresas, 
            sem taxas ocultas. Cancele a qualquer momento.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative card-hover ${plan.color} ${plan.popular ? 'ring-2 ring-primary shadow-2xl scale-105' : 'shadow-lg'} bg-card/50 backdrop-blur-sm`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary-hover text-white px-6 py-2 rounded-full text-sm font-semibold">
                    🔥 Mais Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.popular ? 'from-primary to-primary-hover' : 'from-muted to-accent'} flex items-center justify-center mb-4`}>
                  <plan.icon size={32} className={plan.popular ? 'text-white' : 'text-primary'} />
                </div>
                
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check size={16} className="text-success mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start space-x-3">
                        <span className="text-muted-foreground text-xs mt-1">⚠️</span>
                        <span className="text-xs text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-6">
                  <Button 
                    className={`w-full font-semibold py-6 ${plan.popular ? 'btn-gradient' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Dúvidas sobre os planos?</h3>
          <p className="text-muted-foreground mb-6">
            Nossa equipe está pronta para ajudar você a escolher o plano ideal.
          </p>
          <Button variant="outline" className="font-semibold">
            Falar com Especialista
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;