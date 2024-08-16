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
              console.log(process.env.NEXT_PUBLIC_OPENAI_KEY);
              let thread_id = threadID;
              if (thread_id === '') {
                const threadResponse = await fetch(`https://api.openai.com/v1/threads`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                    'OpenAI-Beta': 'assistants=v2',
                  },
                });
                const threadResponseJson = await threadResponse.json();
                console.log(threadResponseJson);
                thread_id = threadResponseJson.id;
                if (thread_id === undefined) {
                  setResponse('Error con la IA');
                  return;
                }
                console.log(thread_id);
                setThreadId(thread_id);
              }
          
              const threadMessageCreateEndpoint = `https://api.openai.com/v1/threads/${thread_id}/messages`;
              console.log(threadMessageCreateEndpoint);
              const threadMessageCreate = await fetch(threadMessageCreateEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                  'OpenAI-Beta': 'assistants=v2',
                },
                body: JSON.stringify({
                  "role": "user",
                  "content": `Give me a JSON object with this exact structure: {operationType: '2', minPrice: 0, maxPrice: 150000, minBedrooms: '0', maxBedrooms: '10', minBathrooms: '0', maxBathrooms: '10', minParkings: '0', maxParkings: '10', interestPoints: [{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }], message: 'Message for the user' },  this object represents a filter that must answer to a user's request, the filter determines the search filters for an application that searches for places to buy or rent around Lima, Perú. The "operationType" determines the type of operation the user wants, where "1" is rent and "2" is buy. The min and max price, bedrooms, bathrooms, parkings are the caracteristics the user is looking for in the property. The "interestPoints" must be a list of points with real valid coordinates near Lima, Perú that are acoording to the user's request, add a maximum of 5 interest points. The "message" is a explanation of the filters for the user. This is the user's request: "${userPrompt}" make sure your answer follows what the user wants and is also a smart filter to search for properties. Remember your response must be exacly a JSON object with no text, the JSON object must look like this: {operationType: '2', minPrice: 0, maxPrice: 150000, minBedrooms: '0', maxBedrooms: '10', minBathrooms: '0', maxBathrooms: '10', minParkings: '0', maxParkings: '10', interestPoints: [{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }], message: 'Message for the user' }`,
                }),
              });
              console.log(await threadMessageCreate);
          
              const runCreate = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                  'OpenAI-Beta': 'assistants=v2',
                },
                body: JSON.stringify({
                  "assistant_id": `${process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID}`,
                }),
              });
              console.log(await runCreate);
          
              // Add a delay here to wait for the run to complete
              await new Promise(resolve => setTimeout(resolve, 10000)); // Adjust the delay time as needed
          
              // Retry loop to fetch thread messages
            let lastMessage = '';
            const maxRetries = 5;  // Max number of attempts
            let attempt = 0;

            while (attempt < maxRetries) {
                  const threadMessages = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
                  method: 'GET',
                  headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                  'OpenAI-Beta': 'assistants=v2',
                  },
                  });
                  const threadMessagesJson = await threadMessages?.json();
                  console.log(`Attempt ${attempt + 1}:`, threadMessagesJson);

                  lastMessage = threadMessagesJson?.data[0]?.content[0]?.text?.value;

                  if (lastMessage) {
                  break; // Exit loop if a valid message is found
                  }

                  attempt++;
                  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 2 seconds before retrying
            }

            if (!lastMessage) {
                  lastMessage = 'Error: Could not retrieve the message after multiple attempts.';
            }
            lastMessageParsed = JSON.parse(lastMessage)
            setFilters(lastMessageParsed)
              setResponse(lastMessageParsed.message);
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
