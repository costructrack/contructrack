import React from "react";
import { useState, useRef, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Accordion, AccordionItem, CheckboxGroup, Checkbox, Slider, Image, Input} from "@nextui-org/react";
import {OPERATION_TYPES, PROPERTY_TYPES, ADVERTISER_TYPES} from '../utils/utils'
import dynamic from 'next/dynamic';

// MapComponent must be imported dynamicly to use 'window'
const MapInputComponent = dynamic(() => import('../components/MapInputComponent'), {
  ssr: false
});

export default function EditInterestPointModal({ isOpen, handleClose, interestPoints, id, editInterestPoint, cleanInterestPoints }) {

      const [lat, setLat] = useState(interestPoints.find(point => point.id === id)?.Latitude);  
      const [lng, setLng] = useState(interestPoints.find(point => point.id === id)?.Longitude);
      const [address, setAdress] = useState('')
      const [radius, setRadius] = useState(interestPoints.find(point => point.id === id)?.radius)

      // Function to get the address from the coordinates
      const getReverseGeocode = async (latitude, longitude) => {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
          
            try {
                  const response = await fetch(apiUrl);
                  if (!response.ok) {
                        throw new Error('Failed to fetch address information');
                  }
                  const data = await response.json();
                  return data;
            } catch (error) {
                  console.error('Error in geocode:', error.message);
                  return 'No se encontró la dirección';
            }
      };

      // Update the addreess any time there is an update on the coordinates
      useEffect(() => {
            getReverseGeocode(lat, lng)
            .then(data => {
                  if (data) {
                        setAdress(data.display_name)
                  }
                  })
            .catch(error => {
                  setAdress('Dirección desconocida')
            });
      }, [lat, lng])

      return (isOpen && (
            <Modal 
                  backdrop="blur" 
                  size='xl'
                  placement='center'
                  isOpen={isOpen}
                  scrollBehavior='inside'
                  onOpenChange={(open) => {
                        if (!open) {cleanInterestPoints(); handleClose(1, false)};
                  }}
            >
                  <ModalContent>
                        {(onClose) => (
                              <>
                                    <ModalHeader className="flex flex-col gap-1 mb-0">Editar casa/trabajo</ModalHeader>
                                    <ModalBody className='y-overflow-no-bar'>
                                          <p>Mueva el mapa y haga click para definir la ubicación</p>
                                          {address && (
                                                <div className='text-start'>
                                                      Dirección: <span className='gray'>{address}</span>
                                                </div>
                                          )}
                                          <div className='my-3'>
                                                <MapInputComponent lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
                                          </div>
                                          
                                          <p>Escoga el radio de busqueda</p>
                                          <Slider 
                                                label="Rango en metros"
                                                step={50} 
                                                minValue={0} 
                                                maxValue={2000} 
                                                value={radius}
                                                onChange={setRadius}
                                                defaultValue={1500} 
                                                className=""
                                          />

                                    </ModalBody>
                                    <ModalFooter>
                                          <Button className="cool-button" onPress={() => {editInterestPoint(id, lat, lng, radius); handleClose(1, false); }}>
                                                Guardar
                                          </Button>
                                    </ModalFooter>
                              </>
                        )}
                  </ModalContent>
            </Modal>
      ));
}
