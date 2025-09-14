const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imagePath: String,
  images: [{
    url: String,
    category: String,
    label: String,
    isThumbnail: { type: Boolean, default: false }
  }],
  year: Number,
  brand: String,
  model: String,
  fuelType: String,
  
  // Autotrader API specific fields
  autotraderId: String,
  category: { 
    type: String, 
    enum: ['cars', 'commercial', 'motorbikes', 'caravans', 'motorhomes'],
    default: 'cars'
  },
  bodyType: {
    type: String,
    enum: ['SUV', 'Hatchback', 'Saloon', 'Estate', 'Coupe', 'Convertible', 'MPV', 'Pickup', 'Van', 'Other'],
    required: true
  },
  
  // Technical Specifications
  mileage: Number,
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'Semi-Automatic', 'CVT', 'Unknown', 'Unlisted']
  },
  doors: Number,
  seats: Number,
  engineSize: String,
  power: String,
  co2Emissions: Number,
  
  // Performance
  topSpeed: Number,
  acceleration: Number, // 0-60 mph time
  mpg: Number, // Miles per gallon
  
  // Financial
  tax: Number, // Annual road tax
  insurance: String, // Insurance group
  
  // Additional Details
  drivetrain: {
    type: String,
    enum: ['FWD', 'RWD', 'AWD', '4WD', 'Front Wheel Drive', 'Rear Wheel Drive', 'All Wheel Drive', 'Four Wheel Drive', 'Unlisted', '']
  },
  cylinders: Number,
  colour: String,
  previousOwners: Number,
  serviceHistory: String,
  motExpiry: Date,
  
  // Status
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'pending'],
    default: 'available'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for better query performance
VehicleSchema.index({ brand: 1, model: 1 });
VehicleSchema.index({ bodyType: 1 });
VehicleSchema.index({ price: 1 });
VehicleSchema.index({ year: 1 });
VehicleSchema.index({ status: 1 });

// Update the updatedAt field before saving
VehicleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
