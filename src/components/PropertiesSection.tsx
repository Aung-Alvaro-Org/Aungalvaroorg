import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { PropertyModal } from "./PropertyModal";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Search, Filter } from "lucide-react";

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: "$450,000",
    location: "Downtown, NY",
    beds: 2,
    baths: 2,
    sqft: 1200,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    type: "Apartment",
    featured: true
  },
  {
    id: 2,
    title: "Luxury Family Home",
    price: "$750,000",
    location: "Suburbs, CA",
    beds: 4,
    baths: 3,
    sqft: 2500,
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    type: "House",
    featured: false
  },
  {
    id: 3,
    title: "Cozy Townhouse",
    price: "$325,000",
    location: "Midtown, TX",
    beds: 3,
    baths: 2,
    sqft: 1800,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    type: "Townhouse",
    featured: false
  },
  {
    id: 4,
    title: "Penthouse with City Views",
    price: "$1,200,000",
    location: "Manhattan, NY",
    beds: 3,
    baths: 3,
    sqft: 2200,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    type: "Condo",
    featured: true
  },
  {
    id: 5,
    title: "Charming Cottage",
    price: "$280,000",
    location: "Countryside, VT",
    beds: 2,
    baths: 1,
    sqft: 1000,
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    type: "House",
    featured: false
  },
  {
    id: 6,
    title: "Modern Loft",
    price: "$550,000",
    location: "Arts District, LA",
    beds: 1,
    baths: 1,
    sqft: 900,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    type: "Apartment",
    featured: false
  }
];

export function PropertiesSection() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    priceRange: "all",
    beds: "all"
  });

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    let filtered = mockProperties;
    
    if (newFilters.search) {
      filtered = filtered.filter(prop => 
        prop.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        prop.location.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }
    
    if (newFilters.type && newFilters.type !== "all") {
      filtered = filtered.filter(prop => prop.type === newFilters.type);
    }
    
    if (newFilters.beds && newFilters.beds !== "all") {
      filtered = filtered.filter(prop => prop.beds >= parseInt(newFilters.beds));
    }
    
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setFilters({ search: "", type: "all", priceRange: "all", beds: "all" });
    setFilteredProperties(mockProperties);
  };

  return (
    <section id="properties" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties available for sale
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search properties..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-300k">Under $300K</SelectItem>
                <SelectItem value="300k-600k">$300K - $600K</SelectItem>
                <SelectItem value="600k-1m">$600K - $1M</SelectItem>
                <SelectItem value="1m+">$1M+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.beds} onValueChange={(value) => handleFilterChange("beds", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Bedrooms</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
        
        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No properties found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button size="lg">
            View All Properties
          </Button>
        </div>
      </div>
      
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}