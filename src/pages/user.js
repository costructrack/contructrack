import { useState, useRef, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import LoginComponent from '../components/LoginComponent';
import {Image} from "@nextui-org/react";

export default function UserPage() {
      const { data: session } = useSession();
      return (
            <div className="container min-h-80vh">
                  {!session ? (
                        <LoginComponent signIn={signIn}/>
                  ) : (
                        <>
                              <div>
                                    <div >
                                          <div className='flex flex-col items-center'>
                                                <Image
                                                      className='w-50 h-50 m-auto mb-5 rounded-full'
                                                      alt="Imagen de perfil"
                                                      src={session.user.image}
                                                />
                                                <h2>{session.user.name}</h2>
                                                <p className="gray">{session.user.email}</p>

                                                <div className='flex items-center'>
                                                      <button onClick={() => signOut()} className="red-button ml-4">
                                                            Cerrar sesión
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                                    <div>
                              </div>
                              </div>
                        </>
                  )}
            </div>
      );
}
