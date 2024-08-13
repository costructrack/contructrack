import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import MapComponent from '../components/MapComponent'
import FiltersModal from '../components/FiltersModal'

import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";


export default function Agents() {

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
                        <h1>Agentes humanos</h1>
                        <p className='mb-4 text-start text-xs sm:text-base'>La inteligencia artificial es buena, pero aveces necesitamos asesoría de un experto, aquí encontrará los mejores agentes inmobiliarios de su zona, listos para asesorarle de la mejor forma</p>
                        {
                              agents && agents.length > 0 && agents.map((agent, index) => (
                                    <Link className='w-full' href={`/agent/${index}/`}>
                                    <Card isHoverable key={index} className="w-full mb-4">
                                          <CardBody>
                                                <div className="w-full flex flex-col sm:flex-row gap-4 items-start">
                                                      <div className='w-full sm:w-fit flex justify-center'>
                                                            <Image
                                                            alt="Foto de perfil"
                                                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto"
                                                            src={agent?.ProfilePictureURL}
                                                            />
                                                      </div>
                                                      <div className="flex flex-col flex-1 text-center sm:text-left text-sm">
                                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">{agent?.FirstName} {agent?.LastName}</h2>
                                                            <p className="text-gray-600">{agent?.Bio}</p>
                                                      </div>
                                                      <div className="flex flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                                                            <div className="flex items-center">
                                                                  {Array.from({ length: Math.ceil(agent?.Rating) }, (_, i) => (
                                                                        <img
                                                                        key={i}
                                                                        src="/star_filled_icon.png"
                                                                        className="w-4 h-4 sm:w-5 sm:h-5 mr-0.5"
                                                                        alt="Star filled"
                                                                        />
                                                                  ))}
                                                                  {Array.from({ length: Math.floor(5 - agent?.Rating) }, (_, i) => (
                                                                        <img
                                                                        key={i}
                                                                        src="/star_empty_icon.png"
                                                                        className="w-4 h-4 sm:w-5 sm:h-5 mr-0.5"
                                                                        alt="Star empty"
                                                                        />
                                                                  ))}
                                                            </div>
                                                            <div className="text-gray-500 text-xs sm:text-sm mt-1">
                                                            {agent?.ReviewCount} ventas
                                                            </div>
                                                            <Button className="mt-2 cool-button w-full sm:w-auto">Chatear</Button>
                                                      </div>
                                                </div>
                                          </CardBody>
                                    </Card>
                                    </Link>


                              ))
                        }
                  </div>
            </div>
      );
}
