import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Checkbox, select} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Image} from "@nextui-org/react";

export default function LoginComponent({ signIn }) {
      const [privacyAccepted, setPrivacyAccepted] = useState(true)
      const [termsAccepted, setTermsAccepted] = useState(false)
      
      return (
            <div className="container">
                  <Card className="max-w-[400px] mx-auto">
                        <CardHeader className="flex gap-3 justify-center">
                              <h1>Iniciar Sesión</h1>
                        </CardHeader>
                        <Divider/>
                        <CardBody className=''>
                              <div className='text-justify max-w-md mx-auto'>
                                    <div className='mb-4'>
                                          <Checkbox 
                                                isSelected={termsAccepted}
                                                onValueChange={setTermsAccepted}
                                          >
                                                He leído y aceptado los <Link className='cool-a' target='_blank' href='/policies/terms'>términos y condiciones</Link>
                                          </Checkbox>
                                    </div>
                                    <button disabled={!(privacyAccepted && termsAccepted)} className={`flex w-full mx-auto items-center ${privacyAccepted && termsAccepted ? 'cool-button' : 'disabled-button'}`} onClick={() => signIn('google')}><img src="/google_icon.png" alt="Hero" className="w-4 h-4 mr-3" /> Iniciar sesión con Google</button>
                              </div>
                        </CardBody>
                  </Card>
            </div>
      )
}
