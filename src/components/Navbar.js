import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Navbar component provides navigation links for the application.
 * The navbar is responsive, showing a dropdown menu on smaller screens.
 */
export default function Navbar() {
      const { data: session } = useSession();
      
      const router = useRouter();
      const currentPath = router.pathname;
      const [isOpen, setIsOpen] = useState(false);
    
      return (
      <nav className="sticky w-full top-0 z-30 ">
            <div className="container mx-auto flex justify-between items-center">
                  <Link href="/home" >
                        <div className="flex font-bold text-xl">CribAI {currentPath == '/events' && <span className='ml-2 text-xl font-bold magic-text'>Eventos</span>}</div>
                  </Link>
                  <div className="hidden lg:flex space-x-4">
                        <Link href="/home" className='special-a'>
                              <span>Inicio</span>
                        </Link>
                        <Link href="/user" className='special-a'>
                              <span>Usuario</span>
                        </Link>
                  </div>
                  <div className="lg:hidden">
                        <button
                              onClick={() => setIsOpen(!isOpen)}
                              className="focus:outline-none"
                        >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                              </svg>
                        </button>
                  </div>
            </div>
            <div className={`lg:hidden ${isOpen ? 'flex-col' : 'hidden'} w-full pop-up-container rounded-lg `}>
                  <Link href="/home" className='hover:bg-transparent' onClick={() => setIsOpen(false)}>
                        <div className="hover:bg-purple-500 p-2">Inicio</div>
                  </Link>
                  <Link href="/user" className='w-full hover:bg-transparent' onClick={() => setIsOpen(false)}>
                  <     div className="hover:bg-purple-500 p-2">Usuario</div>
                  </Link>
            </div>
      </nav>
      );
}

