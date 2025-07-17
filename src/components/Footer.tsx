import { Zap, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white">
                <Zap size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                AIVENDAS
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Transforme produtos da Shopee em landing pages profissionais com IA. 
              Mais conversões, menos trabalho.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Produto</h3>
            <div className="space-y-2">
              <Link to="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </Link>
              <Link to="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </Link>
              <Link to="/templates" className="block text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link to="/integrations" className="block text-muted-foreground hover:text-foreground transition-colors">
                Integrações
              </Link>
              <Link to="/api" className="block text-muted-foreground hover:text-foreground transition-colors">
                API
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Empresa</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                Sobre Nós
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/careers" className="block text-muted-foreground hover:text-foreground transition-colors">
                Carreiras
              </Link>
              <Link to="/press" className="block text-muted-foreground hover:text-foreground transition-colors">
                Imprensa
              </Link>
              <Link to="/partners" className="block text-muted-foreground hover:text-foreground transition-colors">
                Parceiros
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Suporte</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail size={16} />
                <span>suporte@aivendas.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone size={16} />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin size={16} />
                <span>São Paulo, SP</span>
              </div>
            </div>
            <div className="space-y-2">
              <Link to="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                Central de Ajuda
              </Link>
              <Link to="/documentation" className="block text-muted-foreground hover:text-foreground transition-colors">
                Documentação
              </Link>
              <Link to="/status" className="block text-muted-foreground hover:text-foreground transition-colors">
                Status do Sistema
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © 2024 AIVENDAS. Todos os direitos reservados.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Termos
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;