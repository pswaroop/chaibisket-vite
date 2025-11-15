'use client';

import Link from 'next/link';
import { ShoppingCart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  cartCount: number;
}

const Navbar = ({ cartCount }: NavbarProps) => {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Utensils className="h-6 w-6 text-rose-600" />
          <span className="text-xl font-bold text-gray-900">Chai Bisket</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-700 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => router.push('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-medium text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
