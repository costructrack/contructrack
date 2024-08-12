import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import MapComponent from '../components/MapComponent'
import FiltersModal from '../components/FiltersModal'

import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";


export default function Home() {

      const [products, setProducts] = useState(null);

      const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)

      // Function for fetching products
      async function fetchProducts() {
            const response = await fetch('/api/getProducts');
            const products = await response.json();
            localStorage.setItem('products', JSON.stringify(products));
            setProducts(products);
      }

      // Filters modal close
      const handleCloseFiltersModal = () => {
            // submit logic
            setIsFiltersModalOpen(false);
      };

      // Fetch products
      useEffect(() => {
            fetchProducts();
      }, []);


      return (
            <>
            <div className='container'>
                  <Input type="text" label="Preguntale a nuestro Agente con IA" placeholder="Quiero alquilar cerca de..." labelPlacement='inside'/>
            </div>
            <div className='relative w-full mb-4'>
                  <MapComponent products={products} />
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
