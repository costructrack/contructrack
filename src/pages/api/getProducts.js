import { query } from '../../../lib/db';
import { OPERATION_TYPES, PROPERTY_TYPES, ADVERTISER_TYPES, formatNumber } from '../../utils/utils';
import haversine from 'haversine-distance';

// const [filters, setFilters] = useState({
//       operationType: '1',
//       // propertyTypes: [],
//       minPrice: 0,
//       maxPrice: 1500,
//       minBedrooms: '0',
//       maxBedrooms: '10',
//       minBathrooms: '0',
//       maxBathrooms: '10',
//       minParkings: '0',
//       maxParkings: '10'
// });

export default async function handler(req, res) {
      if (req.method !== 'GET') {
          res.setHeader('Allow', ['GET']);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
      try {
          const filters = req.query;
  
          // Deserialize the interestPoints back into an array of objects
          let interestPoints = [];
          if (filters.interestPoints) {
              interestPoints = JSON.parse(filters.interestPoints);
          }
  
          // Log filters and interest points for debugging
          console.log('Filters received:', filters);
          console.log('Interest Points received:', interestPoints);
  
          // Function to convert meters to degrees of latitude
          const metersToDegreesLatitude = (meters) => meters / 111320;
  
          // Function to convert meters to degrees of longitude, considering the latitude
          const metersToDegreesLongitude = (meters, latitude) => meters / (111320 * Math.cos(latitude * Math.PI / 180));
  
          // Calculate the bounding box considering the radius of each interest point
          let minLat = Infinity;
          let maxLat = -Infinity;
          let minLon = Infinity;
          let maxLon = -Infinity;
  
          interestPoints.forEach(point => {
              const latRadius = metersToDegreesLatitude(point.radius);
              const lonRadius = metersToDegreesLongitude(point.radius, point.Latitude);
  
              const pointMinLat = point.Latitude - latRadius;
              const pointMaxLat = point.Latitude + latRadius;
              const pointMinLon = point.Longitude - lonRadius;
              const pointMaxLon = point.Longitude + lonRadius;
  
              if (pointMinLat < minLat) minLat = pointMinLat;
              if (pointMaxLat > maxLat) maxLat = pointMaxLat;
              if (pointMinLon < minLon) minLon = pointMinLon;
              if (pointMaxLon > maxLon) maxLon = pointMaxLon;
          });
  
          // Convert operationType and propertyTypes to their corresponding values
          const operationTypeValue = OPERATION_TYPES[filters.operationType];
          const propertyTypeValues = filters.propertyTypes ? filters.propertyTypes.map(type => PROPERTY_TYPES[type]) : [];
  
          // Build the base SQL query with the bounding box
          let baseQuery = `
              SELECT * FROM "Product"
              WHERE "Latitude" BETWEEN $1 AND $2
              AND "Longitude" BETWEEN $3 AND $4
              AND "Price" BETWEEN $5 AND $6
              AND "Bedrooms" BETWEEN $7 AND $8
              AND "Bathrooms" BETWEEN $9 AND $10
              AND "Parkings" BETWEEN $11 AND $12
          `;
  
          // Add additional filters for operationType and propertyTypes if provided
          const params = [
              minLat, maxLat, minLon, maxLon,
              filters.minPrice || 0,
              filters.maxPrice || Infinity,
              filters.minBedrooms || 0,
              filters.maxBedrooms || Infinity,
              filters.minBathrooms || 0,
              filters.maxBathrooms || Infinity,
              filters.minParkings || 0,
              filters.maxParkings || Infinity
          ];
  
          if (operationTypeValue) {
              baseQuery += `AND "OperationType" = $13 `;
              params.push(operationTypeValue);
          }
  
          if (propertyTypeValues.length > 0) {
              baseQuery += `AND "PropertyType" = ANY($14) `;
              params.push(propertyTypeValues);
          }
  
          // Execute the base query to get products within the bounding box
          const result = await query(baseQuery, params);
  
          // Further filter results based on the circular radius of each interest point
          const filteredProducts = result.rows.filter(product => {
              return interestPoints.some(point => {
                  const productLocation = { latitude: product.Latitude, longitude: product.Longitude };
                  const interestPointLocation = { latitude: point.Latitude, longitude: point.Longitude };
                  const distance = haversine(productLocation, interestPointLocation);
                  return distance <= point.radius;
              });
          });
  
          res.status(200).json(filteredProducts);
      } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
      }
  }
  