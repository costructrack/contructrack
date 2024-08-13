import React from "react";
import { useState, useRef, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Accordion, AccordionItem, CheckboxGroup, Checkbox, Slider, Image, Input} from "@nextui-org/react";
import {OPERATION_TYPES, PROPERTY_TYPES, ADVERTISER_TYPES} from '../utils/utils'

export default function ProductDetailsModal({ isOpen, handleClose, product }) {

      return (isOpen && (
            <Modal 
                  backdrop="blur" 
                  size='xl'
                  placement='center'
                  isOpen={isOpen}
                  scrollBehavior='inside'
                  onOpenChange={(open) => {
                        if (!open) handleClose(false, {});
                  }}
            >
                  <ModalContent>
                        {(onClose) => (
                              <>
                                    <ModalHeader className="flex flex-col gap-1 mb-0"><h1>{product?.Description}</h1></ModalHeader>
                                    <ModalBody className='y-overflow-no-bar'>
                                          <div className="w-full flex flex-col gap-4 items-start">
                                                <div className='w-full flex justify-center'>
                                                      <Image
                                                      alt="Foto de perfil"
                                                      className="w-24 h-24 mx-auto"
                                                      src='https://storage.googleapis.com/cribai-bucket/cossy_house.jpg'
                                                      />
                                                </div>
                                                <div className="flex flex-col flex-1 text-start text-sm">
                                                      <h2 className="text-lg font-semibold">{product?.Description}</h2>
                                                      <p className="text-gray-600">Tipo de operación: {product?.OperationType}</p>
                                                      <p className="text-gray-600">Tipo de propiedad: {product?.PropertyType}</p>
                                                      <p className="text-gray-600">Dormitorios: {product?.Bedrooms}</p>
                                                      <p className="text-gray-600">Baños: {product?.Bathrooms}</p>
                                                      <p className="text-gray-600">Parqueos: {product?.Parkings}</p>
                                                </div>
                                                <div className="flex flex-col items-start justify-between w-full mt-4">
                                                      <div className="text-gray-500 text-xs mt-1">
                                                            Precio: {product?.Price}
                                                      </div>
                                                </div>
                                          </div>
                                    </ModalBody>
                                    <ModalFooter>
                                          <Button className="cool-button">
                                                Ver más
                                          </Button>
                                    </ModalFooter>
                              </>
                        )}
                  </ModalContent>
            </Modal>
      ));
}
