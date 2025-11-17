import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Bed, Bath, Square, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    sqft: number;
    imageUrl: string;
    type: string;
    featured?: boolean;
  };
  onViewDetails: (property: any) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <ImageWithFallback
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
        {property.featured && (
          <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">
            Featured
          </Badge>
        )}
        <Badge className="absolute bottom-4 left-4 bg-white text-gray-900">
          {property.type}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          <p className="text-2xl font-bold text-primary">{property.price}</p>
        </div>
        
        <div className="flex items-center justify-between mb-4 text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.beds} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.baths} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => onViewDetails(property)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}