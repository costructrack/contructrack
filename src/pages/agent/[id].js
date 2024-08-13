import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";


export default function Agents() {
      const router = useRouter();
      const { id } = router.query;

      const [agents, setAgents] = useState([])

      // Function for fetching agents
      async function fetchAgents() {
            const response = await fetch('/api/getAgents');
            const agents = await response.json();
            localStorage.setItem('agents', JSON.stringify(agents));
            setAgents(agents);
      }

      // Fetch agents when load
      useEffect(() => {
            fetchAgents();
      }, []);

      return (
            <div>
                  <div className='container flex flex-col items-start '>
                        <Card className='w-full mb-4'>
                              <CardHeader>
                                    <Link href='/agents'>
                                    <img src='/back_icon.png' className='w-6 h-6 mr-4 hover-transparent' />
                                    </Link>
                                    <h1>{agents[id]?.FirstName} {agents[id]?.LastName}</h1>
                              </CardHeader>
                              <Divider/>
                              <CardBody>
                                    <div className="w-full flex flex-col sm:flex-row gap-4 items-start">
                                          <div className='w-full sm:w-fit flex justify-center'>
                                                <Image
                                                alt="Foto de perfil"
                                                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto"
                                                src={agents[id]?.ProfilePictureURL}
                                                />
                                          </div>
                                          <div className="flex flex-col flex-1 text-center sm:text-left text-sm">
                                                <p className="text-gray-600">{agents[id]?.Bio}</p>
                                                <p className="text-gray-600">Años de experiencia: {agents[id]?.YearsOfExperience}</p>
                                                <p className="text-gray-600">{agents[id]?.Email}</p>
                                                <p className="text-gray-600">{agents[id]?.Phone}</p>

                                          </div>
                                          <div className="flex flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                                                <div className="flex items-center">
                                                      {Array.from({ length: Math.ceil(agents[id]?.Rating) }, (_, i) => (
                                                            <img
                                                            key={i}
                                                            src="/star_filled_icon.png"
                                                            className="w-4 h-4 sm:w-5 sm:h-5 mr-0.5"
                                                            alt="Star filled"
                                                            />
                                                      ))}
                                                      {Array.from({ length: Math.floor(5 - agents[id]?.Rating) }, (_, i) => (
                                                            <img
                                                            key={i}
                                                            src="/star_empty_icon.png"
                                                            className="w-4 h-4 sm:w-5 sm:h-5 mr-0.5"
                                                            alt="Star empty"
                                                            />
                                                      ))}
                                                </div>
                                                <div className="text-gray-500 text-xs sm:text-sm mt-1">
                                                {agents[id]?.ReviewCount} ventas
                                                </div>
                                          </div>
                                    </div>
                              </CardBody>
                              <Divider/>
                              <CardFooter>
                                    <Button className='cool-button'>Chatear</Button>
                              </CardFooter>
                        </Card>
                  </div>
            </div>
      );
}
