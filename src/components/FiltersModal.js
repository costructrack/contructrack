import React from "react";
import { useState, useRef, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Accordion, AccordionItem, CheckboxGroup, Checkbox, Slider, Image, Input, RadioGroup, Radio} from "@nextui-org/react";
import {OPERATION_TYPES, PROPERTY_TYPES, ADVERTISER_TYPES} from '../utils/utils'

export default function FiltersModal({ isOpen, handleClose, filters, updateFilter }) {

      const handlePriceRangeChange = (priceRange) => {
            updateFilter('minPrice', priceRange[0])
            updateFilter('maxPrice', priceRange[1])
      }

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
                                                <AccordionItem aria-label='xd' title="Tipo de operación" subtitle={OPERATION_TYPES[parseInt(filters?.operationType,10)]} >
                                                      <RadioGroup value={filters?.operationType} onValueChange={(val) => {updateFilter('operationType', val)}} >
                                                            {Object.keys(OPERATION_TYPES).map((operation, index) => (
                                                                  <Radio 
                                                                        key={operation}
                                                                        className='w-full' 
                                                                        value={operation}                                                                       
                                                                  >
                                                                        {OPERATION_TYPES[operation]}
                                                                  </Radio>
                                                            ))}
                                                      </RadioGroup>
                                                </AccordionItem>

                                                {/* <AccordionItem aria-label='xd' title="Tipo de propiedad">
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
                                                                        key={type}
                                                                        className='w-full' 
                                                                        isSelected={false}
                                                                        onValueChange={(e) => {}}
                                                                  >
                                                                        {PROPERTY_TYPES[type]}
                                                                  </Checkbox>
                                                            ))}
                                                      </CheckboxGroup>
                                                </AccordionItem> */}

                                                <AccordionItem aria-label='xd' title="Precio" subtitle={`$${filters?.minPrice} - $${filters?.maxPrice} USD`}>
                                                      <Slider 
                                                            label="Rango de precio"
                                                            step={50} 
                                                            minValue={0} 
                                                            value={[filters?.minPrice, filters?.maxPrice]}
                                                            onChange={(val) => handlePriceRangeChange(val)}
                                                            maxValue={3000} 
                                                            defaultValue={[100, 500]} 
                                                            formatOptions={{style: "currency", currency: "USD"}}
                                                            className=""
                                                      />
                                                </AccordionItem>

                                                <AccordionItem aria-label='xd' title="Espacios" subtitle={`${filters?.minBedrooms}-${filters?.maxBedrooms} Dormitorios, ${filters?.minBathrooms}-${filters?.maxBathrooms} Baños, ${filters?.minParkings}-${filters?.maxParkings} Parqueos`}>
                                                      <div className="flex flex-col gap-4">
                                                            <p>Dormitorios</p>
                                                            <div className="w-full flex flex-row gap-2">
                                                                  <Input
                                                                        label="Mínimo"
                                                                        placeholder="0.00"
                                                                        labelPlacement="inside"
                                                                        type="number"
                                                                        isInvalid={filters?.minBedrooms > filters?.maxBedrooms || filters?.minBedrooms < 0}
                                                                        errorMessage="El número es inválido"
                                                                        value={filters?.minBedrooms}
                                                                        onValueChange={(val) => updateFilter('minBedrooms', val)}
                                                                  />
                                                                  <Input
                                                                        label="Máximo"
                                                                        placeholder="0.00"
                                                                        labelPlacement="inside"
                                                                        type="number"
                                                                        isInvalid={filters?.minBedrooms > filters?.maxBedrooms}
                                                                        errorMessage="El número es inválido"
                                                                        value={filters?.maxBedrooms}
                                                                        onValueChange={(val) => updateFilter('maxBedrooms', val)}
                                                                  />
                                                            </div>
                                                            <p>Baños</p>
                                                            <div className="w-full flex flex-row gap-2">
                                                                  <Input
                                                                        label="Mínimo"
                                                                        placeholder="0.00"
                                                                        labelPlacement="inside"
                                                                        type="number"
                                                                        isInvalid={filters?.minBathrooms > filters?.maxBathrooms || filters?.minBathrooms < 0}
                                                                        errorMessage="El número es inválido"
                                                                        value={filters?.minBathrooms}
                                                                        onValueChange={(val) => updateFilter('minBathrooms', val)}
                                                                  />
                                                                  <Input
                                                                        label="Máximo"
                                                                        placeholder="0.00"
                                                                        labelPlacement="inside"
                                                                        type="number"
                                                                        isInvalid={filters?.minBathrooms > filters?.maxBathrooms}
                                                                        errorMessage="El número es inválido"
                                                                        value={filters?.maxBathrooms}
                                                                        onValueChange={(val) => updateFilter('maxBathrooms', val)}
                                                                  />
                                                            </div>
                                                            <p>Parqueos</p>
                                                            <div className="w-full flex flex-row gap-2">
                                                                  <Input
                                                                        label="Mínimo"
                                                                        placeholder="0.00"
                                                                        labelPlacement="inside"
                                                                        type="number"
                                                                        isInvalid={filters?.minParkings > filters?.maxParkings || filters?.minParkings < 0}
                                                                        errorMessage="El número es inválido"
                                                                        value={filters?.minParkings}
                                                                        onValueChange={(val) => updateFilter('minParkings', val)}
                                                                  />
                                                                  <Input
                                                                        label="Máximo"
                                                                        placeholder="0.00"
                                                                        labelPlacement="inside"
                                                                        type="number"
                                                                        isInvalid={filters?.minParkings > filters?.maxParkings}
                                                                        errorMessage="El número es inválido"
                                                                        value={filters?.maxParkings}
                                                                        onValueChange={(val) => updateFilter('maxParkings', val)}
                                                                  />
                                                            </div>
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
