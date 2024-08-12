export const OPERATION_TYPES = {
      1: "Alquilar",
      2: "Comprar",
      // 3: "Temporal",
      // 4: "Proyectos",
      // 5: "Traspaso"
  }
  
export const PROPERTY_TYPES = {
      1: "Departamento",
      2: "Casa",
      3: "Terreno / Lote",
      4: "Local comercial",
      5: "Oficina",
      6: "Casa de playa",
      7: "Cochera",
      8: "Condominio de casas",
      9: "Condominio de edificios",
      10: "Edificios",
      11: "Habitación",
      12: "Hotel",
      13: "Local industrial",
      14: "Lote",
      15: "Otros",
      16: "Proyecto de lotes"
  }
  
export const ADVERTISER_TYPES = {
      1: "Inmobiliaria",
      2: "Dueño directo"
  }
  
export function formatNumber(value) {
      const num = parseFloat(value); // Convert value to a number if it's a string
      if (isNaN(num)) return value.toString(); // If the value is not a number, return it as is
  
      let formatted;
  
      if (num >= 1e9) {
          formatted = (num / 1e9).toFixed(2) + 'B'; // Format for billions
      } else if (num >= 1e6) {
          formatted = (num / 1e6).toFixed(2) + 'M'; // Format for millions
      } else if (num >= 1e3) {
          formatted = (num / 1e3).toFixed(2) + 'K'; // Format for thousands
      } else {
          formatted = num.toFixed(2); // Round to 2 decimals for numbers below 1000
      }
  
      // Remove unnecessary .00 and trailing zeroes
      return formatted.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  }

const filters = {
      operationType: '',
      propertyTypes: [],
      minPrice: 0,
      maxPrice: 0,
      minBedrooms: 0,
      maxBedrooms: 1,
      minBathrooms: 0,
      maxBathrooms: 1,
      minParkings: 0,
      maxParkings: 1
}