export function Footer() {
  return (
    <footer className="bg-brasil-blue-dark text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-xl text-brasil-yellow mb-2">
              BOLÃO DA GALERA ⚽
            </h3>
            <p className="text-sm text-gray-300">
              A melhor plataforma para seus palpites na Copa.
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-300">
            <a href="#" className="hover:text-brasil-yellow transition-colors">Termos</a>
            <a href="#" className="hover:text-brasil-yellow transition-colors">Privacidade</a>
            <a href="#" className="hover:text-brasil-yellow transition-colors">Contato</a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-blue-800 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Bolão da Galera. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
