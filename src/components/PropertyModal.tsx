import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Bed, Bath, Square, MapPin, Calendar, Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{property.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ImageWithFallback
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
                alt="Interior view"
                className="w-full h-20 object-cover rounded"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"
                alt="Kitchen view"
                className="w-full h-20 object-cover rounded"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400"
                alt="Bathroom view"
                className="w-full h-20 object-cover rounded"
              />
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-bold text-primary">{property.price}</p>
                {property.featured && (
                  <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{property.beds}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{property.baths}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{property.sqft.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Sq Ft</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600">
                This beautiful {property.type.toLowerCase()} offers modern living with stunning views. 
                Features include updated kitchen, spacious bedrooms, and premium finishes throughout. 
                Located in a desirable neighborhood with easy access to schools, shopping, and dining.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Agent
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email Agent
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}