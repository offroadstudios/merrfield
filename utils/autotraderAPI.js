const axios = require('axios');

class AutotraderAPI {
  constructor() {
    this.baseURL = 'https://api.autotrader.co.uk';
    this.sandboxURL = 'https://api-sandbox.autotrader.co.uk';
    this.key = 'OffroadStudio-StockSync-SB-02-09-25';
    this.secret = 'MYQTd6yAWwlirBlh23joDisuGkVdWaQe';
    this.advertiserId = '10042846';
    this.accessToken = null;
    this.tokenExpiry = null;
    this.isSandbox = true; // Using sandbox for testing
  }

  async authenticate() {
    try {
      const authURL = `${this.isSandbox ? this.sandboxURL : this.baseURL}/authenticate`;
      
      // Use form data with key and secret as expected by the API
      const formData = new URLSearchParams();
      formData.append('key', this.key);
      formData.append('secret', this.secret);
      
      const response = await axios.post(authURL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      this.accessToken = response.data.access_token || response.data.token || response.data.accessToken;
      this.tokenExpiry = new Date(Date.now() + ((response.data.expires_in || 3600) * 1000));
      
      console.log('Autotrader API authenticated successfully');
      console.log('Access token:', this.accessToken);
      console.log('Token expires in:', response.data.expires_in || 3600, 'seconds');
      return true;
    } catch (error) {
      console.error('Autotrader API authentication failed:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      return false;
    }
  }

  async ensureAuthenticated() {
    if (!this.accessToken || (this.tokenExpiry && new Date() >= this.tokenExpiry)) {
      console.log('Token expired or missing, re-authenticating...');
      return await this.authenticate();
    }
    return true;
  }

  async getVehicles(page = 1, limit = 20) {
    try {
      const isAuthenticated = await this.ensureAuthenticated();
      if (!isAuthenticated) {
        throw new Error('Failed to authenticate with Autotrader API');
      }

      // Use the correct endpoint format as provided: /stock?advertiserId={{AdvertiserId}}&page=1&pageSize=20
      const endpoint = `${this.isSandbox ? this.sandboxURL : this.baseURL}/stock`;
      
      console.log(`Using correct endpoint: ${endpoint}`);
      console.log(`With parameters: advertiserId=${this.advertiserId}, page=${page}, pageSize=${limit}`);
      
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          advertiserId: this.advertiserId,
          page: page,
          pageSize: limit
        }
      });
      
      console.log(`Success with endpoint: ${endpoint}`);
      console.log(`Successfully fetched data from Autotrader API`);
      console.log('Response data structure:', Object.keys(response.data));
      
      // Handle different response structures
      const vehicles = response.data.vehicles || response.data.results || response.data.data || response.data || [];
      console.log(`Found ${vehicles.length} vehicles from Autotrader API`);
      
      return {
        vehicles: vehicles,
        total: response.data.total || response.data.totalResults || vehicles.length,
        source: 'autotrader_api'
      };
    } catch (error) {
      console.error('Error fetching vehicles from Autotrader API:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      throw error;
    }
  }

  async getVehicleDetails(vehicleId) {
    try {
      const isAuthenticated = await this.ensureAuthenticated();
      if (!isAuthenticated) {
        throw new Error('Failed to authenticate with Autotrader API');
      }

      const vehicleURL = `${this.isSandbox ? this.sandboxURL : this.baseURL}/stock/vehicles/${vehicleId}`;
      
      const response = await axios.get(vehicleURL, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle details from Autotrader API:', error.response?.data || error.message);
      throw error;
    }
  }

  // Helper method to categorize vehicles by body type
  categorizeVehicle(vehicle) {
    const title = vehicle.title?.toLowerCase() || '';
    const description = vehicle.description?.toLowerCase() || '';
    const bodyType = vehicle.bodyType?.toLowerCase() || '';
    
    // Use bodyType from API if available
    if (bodyType) {
      const bodyTypeMap = {
        'suv': 'SUV',
        '4x4': 'SUV',
        'hatchback': 'Hatchback',
        'saloon': 'Saloon',
        'sedan': 'Saloon',
        'estate': 'Estate',
        'coupe': 'Coupe',
        'convertible': 'Convertible',
        'mpv': 'MPV',
        'pickup': 'Pickup',
        'van': 'Van'
      };
      
      for (const [key, value] of Object.entries(bodyTypeMap)) {
        if (bodyType.includes(key)) {
          return value;
        }
      }
    }
    
    // Fallback to title/description analysis
    if (title.includes('suv') || title.includes('4x4') || description.includes('suv')) {
      return 'SUV';
    } else if (title.includes('hatchback') || description.includes('hatchback')) {
      return 'Hatchback';
    } else if (title.includes('estate') || description.includes('estate')) {
      return 'Estate';
    } else if (title.includes('coupe') || description.includes('coupe')) {
      return 'Coupe';
    } else if (title.includes('convertible') || description.includes('convertible')) {
      return 'Convertible';
    } else if (title.includes('mpv') || description.includes('mpv')) {
      return 'MPV';
    } else if (title.includes('pickup') || description.includes('pickup')) {
      return 'Pickup';
    } else if (title.includes('van') || description.includes('van')) {
      return 'Van';
    } else if (title.includes('saloon') || title.includes('sedan') || description.includes('saloon')) {
      return 'Saloon';
    }
    
    // Default to Saloon if no clear category
    return 'Saloon';
  }

  // Transform Autotrader vehicle data to match our schema
  transformVehicleData(vehicle) {
    // Extract data from the complex Autotrader API structure
    const vehicleData = vehicle.vehicle || vehicle;
    const retailAdverts = vehicle.adverts?.retailAdverts || vehicleData.retailAdverts || {};
    const media = vehicle.media || vehicleData.media || {};
    const images = media.images || [];
    
    // Check if the vehicle should be filtered out based on advertiser advert status
    const advertiserAdvertStatus = retailAdverts.advertiserAdvert?.status;
    if (advertiserAdvertStatus === 'NOT_PUBLISHED') {
      console.log(`Skipping vehicle ${vehicleData.registration || vehicleData.stockId} - Advertiser Advert Status: NOT_PUBLISHED`);
      return null; // Return null to indicate this vehicle should be filtered out
    }
    
    console.log('TransformVehicleData - Media:', JSON.stringify(media, null, 2));
    console.log('TransformVehicleData - Images count:', images.length);
    
    // Process all images and store them
    const processedImages = images.map((img, index) => {
      const category = img.classificationTags?.[0]?.category || 'Unknown';
      const label = img.classificationTags?.[0]?.label || 'Unknown';
      return {
        url: img.href, // Keep the {resize} placeholder as is
        category: category,
        label: label,
        isThumbnail: index === 0 // First image is thumbnail by default
      };
    });
    
    console.log('Processed images:', processedImages.length);
    console.log('First processed image:', processedImages[0]);
    
    // Get the first image URL for backward compatibility
    let firstImage = '/images/default-car.jpg';
    if (processedImages.length > 0) {
      // Use the first exterior image if available, otherwise use the first image
      const exteriorImage = processedImages.find(img => img.category === 'Exterior');
      if (exteriorImage) {
        firstImage = exteriorImage.url; // Keep {resize} placeholder
        // Mark this as thumbnail
        exteriorImage.isThumbnail = true;
        processedImages.forEach(img => {
          if (img !== exteriorImage) img.isThumbnail = false;
        });
      } else {
        firstImage = processedImages[0].url; // Keep {resize} placeholder
      }
    }
    
    // Extract price information
    const price = retailAdverts.suppliedPrice?.amountGBP || retailAdverts.totalPrice?.amountGBP || 0;
    
    // Extract description
    const description = retailAdverts.description2 || retailAdverts.description || vehicleData.description || '';
    
    // Extract attention grabber as additional description
    const attentionGrabber = retailAdverts.attentionGrabber || '';
    const fullDescription = description + (attentionGrabber ? ` Features: ${attentionGrabber}` : '');
    
    return {
      title: vehicleData.title || `${vehicleData.make} ${vehicleData.model}` || 'Vehicle',
      description: fullDescription,
      price: price,
      imagePath: firstImage,
      images: processedImages,
      year: parseInt(vehicleData.yearOfManufacture) || parseInt(vehicleData.year) || new Date().getFullYear(),
      brand: vehicleData.make || 'Unknown',
      model: vehicleData.model || '',
      registration: vehicleData.registration || '',
      fuelType: vehicleData.fuelType || 'Petrol',
      autotraderId: vehicle.metadata?.stockId || vehicleData.stockId || vehicleData.id,
      category: 'cars',
      bodyType: this.categorizeVehicle(vehicleData),
      mileage: vehicleData.odometerReadingMiles || vehicleData.mileage || 0,
      transmission: vehicleData.transmissionType || vehicleData.transmission || 'Unknown',
      doors: vehicleData.doors || 0,
      seats: vehicleData.seats || 0,
      co2Emissions: vehicleData.co2EmissionGPKM || vehicleData.co2Emissions || 0,
      engineSize: vehicleData.badgeEngineSizeLitres?.toString() || vehicleData.engineSize || '',
      power: vehicleData.enginePowerBHP?.toString() || vehicleData.power || '',
      topSpeed: vehicleData.topSpeedMPH || vehicleData.topSpeed || 0,
      acceleration: vehicleData.zeroToSixtyMPHSeconds || vehicleData.acceleration || 0,
      mpg: vehicleData.fuelEconomyWLTPCombinedMPG || vehicleData.fuelEconomyNEDCCombinedMPG || vehicleData.mpg || 0,
      tax: vehicleData.vehicleExciseDutyWithoutSupplementGBP || vehicleData.tax || 0,
      insurance: vehicleData.insuranceGroup || vehicleData.insurance || '',
      drivetrain: vehicleData.drivetrain || '',
      cylinders: vehicleData.cylinders || 0,
      colour: vehicleData.colour || '',
      previousOwners: vehicleData.previousOwners || vehicleData.history?.previousOwners || 0,
      serviceHistory: vehicleData.serviceHistory || '',
      motExpiry: vehicleData.motExpiryDate ? new Date(vehicleData.motExpiryDate) : null,
      status: 'available',
      // Additional Autotrader specific fields
      stockId: vehicleData.stockId,
      registration: vehicleData.registration,
      vatStatus: retailAdverts.vatStatus,
      priceIndicator: retailAdverts.priceIndicatorRating
    };
  }
}

module.exports = AutotraderAPI;
