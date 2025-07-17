import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white">
            <Zap size={24} />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            AIVENDAS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Funcionalidades
          </Link>
          <Link to="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Preços
          </Link>
          <Link to="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
            Depoimentos
          </Link>
          <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Entrar
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-foreground">
              Entrar
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="btn-gradient font-semibold px-6">
              Começar Grátis
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link to="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </Link>
            <Link to="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link to="#testimonials" className="block text-muted-foreground hover:text-foreground transition-colors">
              Depoimentos
            </Link>
            <Link to="/login" className="block text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <div className="pt-4 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/signup" className="block">
                <Button className="btn-gradient w-full font-semibold">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;