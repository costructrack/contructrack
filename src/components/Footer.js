import Link from 'next/link';

/**
 * Footer component provides navigation links for the application, as well as some external links.
 */
export default function Footer() {
      
      return (
            <footer className="w-full mt-10">
                  <div className="footer-container mx-auto">
                        <div className='flex flex-col lg:flex-row justify-between items-center w-full'>
                              <div className='flex flex-col w-full lg:w-1/3 text-left mb-auto'>
                                    <Link href="/home" >
                                          <div className="font-bold text-4xl mb-8">CribAI</div>
                                    </Link>
                              </div>
                              <div className='flex flex-col w-full lg:w-1/3 text-left mb-auto pb-6'>
                                    <h2 className='gray'>Páginas</h2>
                                    <Link href="/home">
                                          <span>Inicio</span>
                                    </Link>
                                    <Link href="/about">
                                          <span>Nosotros</span>
                                    </Link>
                                    <Link href="/events">
                                          <span>Eventos</span>
                                    </Link>
                                    <Link href="/organizations">
                                          <span>Organizaciones</span>
                                    </Link>
                                    <Link href="/curriculum">
                                          <span>Tu currículum</span>
                                    </Link>
                                    <Link href="/user">
                                          <span>Usuario</span>
                                    </Link>
                              </div>
                              <div className="flex flex-col w-full lg:w-1/3 text-left mb-auto pb-6">
                                    <h2 className='gray'>Redes</h2>
                                    <Link href="https://www.linkedin.com/company/workay-peru/" target='_blank'>
                                          <span>LinkedIn</span>
                                    </Link>
                                    <Link href="https://www.instagram.com/workayperu/" target='_blank'>
                                          <span>Instagram</span>
                                    </Link>
                                    <Link href="https://chat.whatsapp.com/CKtbk6aRLpz0anU97gv00G" target='_blank'>
                                          <span>Comunidad whatsapp</span>
                                    </Link>
                              </div>
                        </div>
                        <div className='flex flex-col lg:flex-row justify-between items-center w-full'>
                              <div className='flex flex-col w-full lg:w-1/3 text-left mb-auto pb-6'>
                                    
                              </div>
                              <div className='flex flex-col w-full lg:w-1/3 text-left mb-auto pb-6'>
                                    <h2 className='gray'>Políticas</h2>
                                    <Link href="/policies/privacy">
                                          <span>Política de privacidad</span>
                                    </Link>
                                    <Link href="/policies/security">
                                          <span>Política de seguridad de datos</span>
                                    </Link>
                                    <Link href="/policies/terms">
                                          <span>Términos y condiciones</span>
                                    </Link>
                                    <Link href="/policies/refunds">
                                          <span>Política de reembolso</span>
                                    </Link>
                              </div>
                              <div className="flex flex-col w-full lg:w-1/3 text-left mb-auto pb-6">
                                    <h2 className='gray'>Contacto</h2>
                                    <Link href="mailto:workayperu@gmail.com" target='_blank'>
                                          <span>Correo</span>
                                    </Link>
                                    <Link href="https://wa.me/51936252032" target='_blank'>
                                          <span>Whatsapp</span>
                                    </Link>
                                    <Link href="https://wa.me/51941398799?text=Hola%20soy%20l%C3%ADder%20de%20una%20organizaci%C3%B3n%20y%20quisiera%20registrarme%20en%20workay.xyz" target='_blank'>
                                          <span>Soy líder de una organización</span>
                                    </Link>
                              </div>
                        </div>
                        
                  </div>
                  
            </footer>
      );
}

