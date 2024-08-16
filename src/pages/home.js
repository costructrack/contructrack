import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import MapComponent from '../components/MapComponent'
import ProductDetailsModal from '../components/ProductDetailsModal'

//import { VertexAI } from '@google-cloud/vertexai';

import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";


export default function Home() {
      const { data: session } = useSession();

      const [inputValue, setInputValue] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);

      const [threadID, setThreadId] = useState('')

      const [products, setProducts] = useState(null);
      const [selectedProduct, setSelectedProduct] = useState({})
      const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false)

      const [interestPoints, setInterestPoints] = useState([{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }]);

      const handlePromptSubmit = async () => {
            const userPrompt = inputValue;
            setLoading(true); 
            setInputValue(''); 
            try {
                  //const token = session.token //process.env.NEXT_PUBLIC_ACCESS_TOKEN
                  // const payload = {
                  //       anthropic_version: "vertex-2023-10-16",
                  //       messages: [{ role: "user", content: userPrompt }],
                  //       max_tokens: 300,
                  //       stream: false,
                  // };

                  // const res = await fetch(`/api/callAi?userPrompt=${userPrompt}`, {
                  //       method: 'POST',
                  //       headers: {
                  //             'Authorization': `Bearer ${session?.token || null}`,
                  //       },
                  // });
                  // const data = await res.json();

                  // const vertexAI = new VertexAI({project: 'construtruck', location: 'us-east5'});

                  // const generativeModel = vertexAI.getGenerativeModel({
                  //       model: 'claude-3-5-sonnet@20240620',
                  // });
                      
                  // const res = generativeModel.generateContent(userPrompt);
                  // const data = await res.json();

                  // console.log(data)
                  // const textResponse = data.content?.[0]?.text || 'No response received';
                  // setResponse(textResponse);
                  console.log(process.env.NEXT_PUBLIC_OPENAI_KEY)
                  const thread_id = threadID
                  if (thread_id == '') {
                        const threadResponse = await fetch(`https://api.openai.com/v1/threads`, {
                              method: 'POST',
                              headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                                    'OpenAI-Beta': 'assistants=v2',
                              },
                        });
                        const thread_id = threadResponse.id
                        setThreadId(thread_id)
                  }

                  const threadMessageCreate = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                              'OpenAI-Beta': 'assistants=v2',
                        },
                        body: JSON.stringify({
                              "role": "user",
                              "content": `Give me a JSON object with this exact structure: {operationType: '2', minPrice: 0, maxPrice: 150000, minBedrooms: '0', maxBedrooms: '10', minBathrooms: '0', maxBathrooms: '10', minParkings: '0', maxParkings: '10', interestPoints: [{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }] },  this object represents a filter that must answer to a user's request, the filter determines the search filters for an application that searches for places to buy or rent around Lima, Perú. The "interestPoints" must be a list of points with real valid coordinates near Lima, Perú that are acoording to the user's request. This is the user's request: "${userPrompt}". Remember your response must be exacly a JSON object with no text, the JSON object must look like this: {operationType: '2', minPrice: 0, maxPrice: 150000, minBedrooms: '0', maxBedrooms: '10', minBathrooms: '0', maxBathrooms: '10', minParkings: '0', maxParkings: '10', interestPoints: [{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }] }`
                        })
                  });

                  const runCreate = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                              'OpenAI-Beta': 'assistants=v2',
                        },
                        body: JSON.stringify({
                              "assistant_id": `${process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID}`
                          })
                  });

                  const threadMessages = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
                        method: 'GET',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                              'OpenAI-Beta': 'assistants=v2',
                        }
                  });

                  const lastMessage = threadMessages?.data[0]?.content[0]?.text?.value || 'Error en la API de chat gpt'

                  setResponse(lastMessage)
            } catch (error) {
                  setResponse('Error: ' + error.message);
            } finally {
                  setLoading(false);
            }
      };

      const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                  event.preventDefault(); //this is unnecesary
                  handlePromptSubmit();
            }
      };

      const [filters, setFilters] = useState({
            operationType: '2',
            // propertyTypes: [],
            minPrice: 0,
            maxPrice: 150000,
            minBedrooms: '0',
            maxBedrooms: '10',
            minBathrooms: '0',
            maxBathrooms: '10',
            minParkings: '0',
            maxParkings: '10'
      });

      const handleProductDetailsModal = (value, product) => {
            setSelectedProduct(product)
            setIsProductDetailsModalOpen(value)
      }

      // Function for fetching products
      async function fetchProducts() {
            const queryString = new URLSearchParams({
                  ...filters,
                  interestPoints: JSON.stringify(interestPoints)
              }).toString();
            const response = await fetch(`/api/getProducts?${queryString}`, {
                  method: 'GET',
            });
            const products = await response.json();
            localStorage.setItem('products', JSON.stringify(products));
            setProducts(products);
      }

      const updateFilter = (key, value) => {
            setFilters(prevFilters => ({
                ...prevFilters,
                [key]: value
            }));
        };

      // Fetch products when filters or interest points changed
      useEffect(() => {
            fetchProducts();
      }, [filters, interestPoints]);

      useEffect(() => {
            console.log(session);
      }, []);


      return (
            <>
            <div className='container'>
                  <Input 
                        className='mb-3' 
                        value={inputValue} 
                        onValueChange={setInputValue} 
                        type="text" 
                        label="Preguntale a nuestro Agente con IA" 
                        placeholder="Quiero alquilar cerca de..." 
                        labelPlacement='inside'
                        onKeyDown={handleKeyDown}
                  />
                  <p className='text-start'>{response}</p>
                  {
                        loading && <img className='mx-auto h-10' src="/ring_black.svg" alt="Loading..." />
                  }
            </div>
            <div className='relative w-full mb-4'>
                  <MapComponent products={products} filters={filters} updateFilter={updateFilter} interestPoints={interestPoints} setInterestPoints={setInterestPoints} handleProductDetailsModal={handleProductDetailsModal} />
            </div>
            <ProductDetailsModal isOpen={isProductDetailsModalOpen} handleClose={handleProductDetailsModal} product={selectedProduct} />
            <div className="container">
                  <h2 className='text-start mb-2'>{products?.length} resultados</h2>
                  <p className='text-start mb-4 text-xs sm:text-base'>Edita los filtros o pregunta a la inteligencia artificial para encontrar más resultados</p>
                  {
                        products && products.length > 0 && products.map((product, index) => (
                              <div key={index} className='w-full' onClick={() => handleProductDetailsModal(true, product)}>
                              <Card isHoverable   className='w-full mb-4'>
                                    <CardBody>
                                          <div className="w-full flex flex-col sm:flex-row gap-4 items-start">
                                                <div className='w-full sm:w-fit flex justify-center'>
                                                      <Image
                                                            alt="Foto del producto"
                                                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto"
                                                            src='https://storage.googleapis.com/cribai-bucket/cossy_house.jpg'
                                                      />
                                                </div>
                                                <div className="flex flex-col flex-1 text-center sm:text-left text-sm">
                                                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">{product?.Description}</h2>
                                                      <p className="text-gray-600">Tipo de operación: {product?.OperationType}</p>
                                                      <p className="text-gray-600">Tipo de propiedad: {product?.PropertyType}</p>
                                                      <p className="text-gray-600">Dormitorios: {product?.Bedrooms}</p>
                                                      <p className="text-gray-600">Baños: {product?.Bathrooms}</p>
                                                      <p className="text-gray-600">Parqueos: {product?.Parkings}</p>

                                                </div>
                                                <div className="flex flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                                                      <div className="text-gray-500 text-xs sm:text-sm mt-1">
                                                            Precio: {product?.Price}
                                                      </div>
                                                      <Button className="mt-2 cool-button w-full sm:w-auto">Ver</Button>
                                                </div>
                                          </div>
                                    </CardBody>
                              </Card>
                              </div>
                        ))
                  }
            </div>
            <div className='fixed-button'>
                  <Link className='flex gap-2' href='/agents'>
                        <Image
                              alt="Foto de perfil"
                              className="w-10 h-10 rounded-full"
                              src='https://storage.googleapis.com/cribai-bucket/trustable_realtor.jpg'
                        />
                        <Button size='md' className='cool-button'>
                              Chatear con un Agente
                        </Button>
                  </Link>
            </div>
            </>
      );
}
