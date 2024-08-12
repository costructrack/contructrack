import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import MapComponent from '../components/MapComponent'
import FiltersModal from '../components/FiltersModal'

import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";


export default function Home() {

      const [products, setProducts] = useState(null);

      const [interestPoints, setInterestPoints] = useState([{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }]);

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

      // Fetch products
      useEffect(() => {
            fetchProducts();
      }, [filters, interestPoints]);

      useEffect(() => {
            console.log(filters);
      }, [filters]);


      return (
            <>
            <div className='container'>
                  <Input type="text" label="Preguntale a nuestro Agente con IA" placeholder="Quiero alquilar cerca de..." labelPlacement='inside'/>
            </div>
            <div className='relative w-full mb-4'>
                  <MapComponent products={products} filters={filters} updateFilter={updateFilter} interestPoints={interestPoints} setInterestPoints={setInterestPoints} />
            </div>
            <div className="container">
                  {
                        products && products.length > 0 && products.map((product, index) => (
                              <Card key={index} className='w-full mb-4'>
                                    <CardHeader>
                                          {product?.Description}
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody>
                                          {product?.Description}
                                    </CardBody>
                                    <Divider/>
                                    <CardFooter>
                                          xd
                                    </CardFooter>
                              </Card>
                        ))
                  }
            </div>
            </>
      );
}
