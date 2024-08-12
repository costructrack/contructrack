import React from "react";
import { useState, useRef, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Accordion, AccordionItem, CheckboxGroup, Checkbox, Slider, Image, Input, RadioGroup, Radio} from "@nextui-org/react";
import {OPERATION_TYPES, PROPERTY_TYPES, ADVERTISER_TYPES} from '../utils/utils'

export default function FiltersModal({ isOpen, handleClose }) {

      

      return (isOpen && (
            <Modal 
                  backdrop="blur" 
                  size='xl'
                  placement='center'
                  isOpen={isOpen}
                  scrollBehavior='inside'
                  onOpenChange={(open) => {
                        if (!open) handleClose();
                  }}
            >
                  <ModalContent>
                        {(onClose) => (
                              <>
                                    <ModalHeader className="flex flex-col gap-1 mb-0">Seleccionar filtros</ModalHeader>
                                    <ModalBody className='y-overflow-no-bar'>
                                          <p>Presione en los filtros para editarlos</p>
                                          <Accordion variant='shadow'>
                                                <AccordionItem aria-label='xd' title="Tipo de operación">
                                                      <RadioGroup label='Seleccione los tipos de operación'>
                                                            {Object.keys(OPERATION_TYPES).map((operation) => (
                                                                  <Radio 
                                                                        className='w-full' 
                                                                        isSelected={false}
                                                                        onValueChange={(e) => {}}
                                                                  >
                                                                        {OPERATION_TYPES[operation]}
                                                                  </Radio>
                                                            ))}
                                                      </RadioGroup>
                                                </AccordionItem>

                                                <AccordionItem aria-label='xd' title="Tipo de propiedad">
                                                      <CheckboxGroup label='Seleccione los tipos de propiedad'>
                                                            <Checkbox 
                                                                  className='w-full' 
                                                                  isSelected={false}
                                                                  onValueChange={(e) => {}}
                                                            >
                                                                  Seleccionar todos
                                                            </Checkbox>
                                                            {Object.keys(PROPERTY_TYPES).map((type) => (
                                                                  <Checkbox 
                                                                        className='w-full' 
                                                                        isSelected={false}
                                                                        onValueChange={(e) => {}}
                                                                  >
                                                                        {PROPERTY_TYPES[type]}
                                                                  </Checkbox>
                                                            ))}
                                                      </CheckboxGroup>
                                                </AccordionItem>

                                                <AccordionItem aria-label='xd' title="Precio">
                                                      <Slider 
                                                            label="Rango de precio"
                                                            step={50} 
                                                            minValue={0} 
                                                            maxValue={1000} 
                                                            defaultValue={[100, 500]} 
                                                            formatOptions={{style: "currency", currency: "USD"}}
                                                            className=""
                                                      />
                                                </AccordionItem>

                                                <AccordionItem aria-label='xd' title="Espacios">
                                                      <div className="flex flex-col gap-4">
                                                            <Input
                                                                  label="Dormitorios"
                                                                  placeholder="0.00"
                                                                  labelPlacement="inside"
                                                                  type="number"
                                                            />
                                                            <Input
                                                                  label="Baños"
                                                                  placeholder="0.00"
                                                                  labelPlacement="inside"
                                                                  type="number"
                                                            />
                                                            <Input
                                                                  label="Parqueos"
                                                                  placeholder="0.00"
                                                                  labelPlacement="inside"
                                                                  type="number"
                                                            />
                                                      </div>
                                                </AccordionItem>
                                          </Accordion>
                                    </ModalBody>
                                    <ModalFooter>
                                          <Button className="cool-button" onPress={handleClose}>
                                                Continuar
                                          </Button>
                                    </ModalFooter>
                              </>
                        )}
                  </ModalContent>
            </Modal>
      ));
}
