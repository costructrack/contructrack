'use client'
import React, { useMemo, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, CircleF, OverlayView } from '@react-google-maps/api';
import EditInterestPointModal from './EditInterestPointModal'
import FiltersModal from './FiltersModal'

import { Tooltip, Button } from "@nextui-org/react";
import { formatNumber } from '../utils/utils';

const containerStyle = {
  width: '100%',
  height: '500px'
};



const MapComponent = ({ products }) => {

      // Map options
      const mapOptions = useMemo(() => ({
            disableDefaultUI: true,
            clickableIcons: true,
            scrollwheel: true,
      }), []);

      // Location of the user for center of map
      const [location, setLocation] = useState({ lat: -12.0464, lng: -77.0428 });
      const [error, setError] = useState(null);

      const [mapZoom, setMapZoom] = useState(15)

      // Interest points
      const [interestPoints, setInterestPoints] = useState([{ id: 1, Latitude: -12.0464, Longitude: -77.0428, isOpen: false, radius: 1500 }]);
      const [selectedInterestPoint, setSelectedInterestPoint] = useState(1)
      const [isEditInterestPointModalOpen, setIsInterestPointModalOpen] = useState(false)

      // Filters
      const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)

      // Filters modal close
      const handleCloseFiltersModal = () => {
            // submit logic
            setIsFiltersModalOpen(false);
      };


      // Function to toggle the isOpen state or close all
      const handleOpenInterestPoint = (id) => {
            setInterestPoints(prevPoints =>
            prevPoints.map(point => {
                  if (id === undefined) {
                        // Close all interest points if no id is provided
                        return { ...point, isOpen: false };
                  } else if (point.id === id) {
                        // Toggle the isOpen state of the specific interest point
                        return { ...point, isOpen: !point.isOpen };
                  } else {
                        return point;
                  }
            })
            );
      };

      // Function to move a interest point
      const updateInterestPointPosition = (id, newLatitude, newLongitude, newRadius) => {
            setInterestPoints(prevPoints =>
                  prevPoints.map(point =>
                        point.id === id
                              ? { ...point, Latitude: newLatitude, Longitude: newLongitude, radius: newRadius }
                              : point
                  )
            );
      };

      // Function to add a new interest point and returns the id
      const addNewInterestPoint = () => {
            const maxId = interestPoints.reduce((max, point) => Math.max(max, point.id), 0);
            setInterestPoints(prevPoints => {
                  const newInterestPoint = {
                        id: maxId + 1,
                        Latitude: -12.0464,
                        Longitude: -77.0428,
                        isOpen: false,
                        radius: 1500
                  };
                  return [...prevPoints, newInterestPoint];
            });
            return maxId + 1;
      };

      // Function to delete an interest point by id
      const deleteInterestPoint = (id) => {
            setInterestPoints(prevPoints =>
            prevPoints.filter(point => point.id !== id)
            );
      };

      // Handle open/close edit interest point modal
      const handleEditInterestPointModal = (id, value) => {
            setSelectedInterestPoint(id)
            setIsInterestPointModalOpen(value)
            handleOpenInterestPoint()
      }
  

      // Fix offset of interest point position
      const getInterestPixelPositionOffset = () => {
            const size = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
            return { x: -size / 2, y: -size / 2 };
      };

      // Fix offset of regular point position
      const getRegularPixelPositionOffset = () => {
            const size = 1.25 * parseFloat(getComputedStyle(document.documentElement).fontSize);
            return { x: -size / 2, y: -size / 2 };
      };

      // Close all interest points and save zoom when zoom change
      function handleZoomChange() {
            handleOpenInterestPoint()
            setMapZoom(this.getZoom())
      }

       // Get location from user
      // useEffect(() => {
      //       if (navigator.geolocation) {
      //             navigator.geolocation.getCurrentPosition((position) => {
      //                   setLocation({
      //                   lat: position.coords.latitude,
      //                   lng: position.coords.longitude,
      //                   });
      //             },
      //             (error) => {
      //                   setError(error.message);
      //             }
      //             );
      //       } else {
      //             setError("Geolocation is not supported by this browser.");
      //       }
      // }, []);

      return (
            <>
            <LoadScript googleMapsApiKey='AIzaSyDT-_i-4rPlez4HQSIYGHNpDFT0krDeLW8' >
                  <GoogleMap
                        options={mapOptions}
                        mapContainerStyle={containerStyle}
                        center={location}
                        zoom={15}
                        onZoomChanged={handleZoomChange}
                  >
                        {
                              interestPoints && interestPoints.length > 0 && interestPoints?.map((interestPoint, index) => (
                                    <div key={index} >
                                          <OverlayView
                                                position={{ lat: interestPoint?.Latitude, lng: interestPoint?.Longitude }}
                                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                                zIndex={5}
                                                getPixelPositionOffset={getInterestPixelPositionOffset}                                          
                                          >
                                                <div className="relative flex justify-center items-center w-10">
                                                      {interestPoint?.isOpen && (
                                                            <div className="interest-tooltip">
                                                                  <Button onClick={() => handleEditInterestPointModal(interestPoint?.id, true)} size='sm' className='cool-button'>Editar</Button>
                                                                  {interestPoints.length > 1 && <Button onClick={() => deleteInterestPoint(interestPoint?.id)} size='sm' className='cool-button'>Borrar</Button>}
                                                            </div>
                                                      )}
                                                      <button
                                                            onClick={() => handleOpenInterestPoint(interestPoint?.id)}
                                                            type='button'
                                                            className='interest-point'
                                                      ></button>
                                                </div>
                                          </OverlayView>
                                          <Circle
                                                center={{ lat: interestPoint?.Latitude, lng: interestPoint?.Longitude }}
                                                radius={interestPoint?.radius}
                                                options={{
                                                      fillColor: 'green',
                                                      strokeColor: 'green',
                                                      fillOpacity: 0.1,
                                                      strokeOpacity: 0.5,
                                                }}
                                          >
                                          </Circle>
                                          <EditInterestPointModal isOpen={isEditInterestPointModalOpen} handleClose={handleEditInterestPointModal} interestPoints={interestPoints} id={selectedInterestPoint} editInterestPoint={updateInterestPointPosition} />
                                    </div>
                              ))
                        }
                        {
                              products && products.length > 0 && products?.map((product, index) => (
                                    <OverlayView
                                          key={index}
                                          position={{ lat: product?.Latitude, lng: product?.Longitude }}
                                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                          zIndex={2}
                                          getPixelPositionOffset={getRegularPixelPositionOffset}
                                    >
                                          <div className="relative flex justify-center items-center w-5">
                                                {mapZoom >= 15 && (
                                                      <div className="regular-tooltip">
                                                            {formatNumber(product?.Price)}
                                                      </div>
                                                )}
                                                <button
                                                      onClick={() => {}}
                                                      type='button'
                                                      className='regular-point'
                                                ></button>
                                          </div>
                                    </OverlayView>
                              ))
                        }
                        
                        
                       
                  </GoogleMap>
            </LoadScript>
            <div className="absolute w-full top-0 z-10">
                  <div className='container flex items-start gap-2'>
                        <Button onClick={() => setIsFiltersModalOpen(true)} className='cool-button shadow-lg' size='large'>
                              Seleccionar Filtros
                        </Button>
                        <FiltersModal isOpen={isFiltersModalOpen} handleClose={handleCloseFiltersModal}/>
                        <Button onClick={() => handleEditInterestPointModal(addNewInterestPoint(), true)} className='cool-button shadow-lg' size='large'>
                              Agregar casa/trabajo
                        </Button>
                  </div>
            </div>
            </>
      );
};

export default MapComponent;
