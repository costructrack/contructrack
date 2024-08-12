import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import MapComponent from '../components/MapComponent'
import FiltersModal from '../components/FiltersModal'

import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";


export default function Home() {

      const [products, setProducts] = useState(null);

      const [filters, setFilters] = useState({
            operationType: '1',
            // propertyTypes: [],
            minPrice: 0,
            maxPrice: 1500,
            minBedrooms: '0',
            maxBedrooms: '1',
            minBathrooms: '0',
            maxBathrooms: '1',
            minParkings: '0',
            maxParkings: '1'
      });

      // Function for fetching products
      async function fetchProducts() {
            const response = await fetch('/api/getProducts');
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
      }, []);

      useEffect(() => {
            console.log(filters);
      }, [filters]);


      return (
            <>
            <div className='container'>
                  <Input type="text" label="Preguntale a nuestro Agente con IA" placeholder="Quiero alquilar cerca de..." labelPlacement='inside'/>
            </div>
            <div className='relative w-full mb-4'>
                  <MapComponent products={products} filters={filters} updateFilter={updateFilter} />
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
