
import { VoteIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t mt-auto">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <VoteIcon className="h-5 w-5 text-election-primary" />
            <span className="text-sm font-medium text-election-primary">
              Election © {new Date().getFullYear()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            A secure and transparent election management system
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
