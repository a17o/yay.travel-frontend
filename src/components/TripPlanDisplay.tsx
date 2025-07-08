import React, { useState } from 'react';
import { DetailedTripPlan } from '@/types';
import { tripPlanService } from '@/services/tripPlanService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, Plane, Users, Building, Utensils, Clock, MapPin, Star, Euro } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TripPlanDisplayProps {
  plan: DetailedTripPlan;
  onPlanUpdated?: (updatedPlan: DetailedTripPlan) => void;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ plan, onPlanUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(plan);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const updatedPlan = await tripPlanService.acceptTripPlan(currentPlan.id);
      setCurrentPlan(updatedPlan);
      onPlanUpdated?.(updatedPlan);
      toast({
        title: "Trip Plan Accepted",
        description: "Your trip plan has been accepted and saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept trip plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const updatedPlan = await tripPlanService.rejectTripPlan(currentPlan.id);
      setCurrentPlan(updatedPlan);
      onPlanUpdated?.(updatedPlan);
      toast({
        title: "Trip Plan Rejected",
        description: "Your trip plan has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject trip plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trip Plan</h1>
        <Badge className={getStatusColor(currentPlan.status)}>
          {currentPlan.status.toUpperCase()}
        </Badge>
      </div>

      {/* Flights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Flights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlan.flights.map((flight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">From:</label>
                  <p>{flight.from}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">To:</label>
                  <p>{flight.to}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Date:</label>
                  <p>{flight.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Price:</label>
                  <p className="text-green-600 font-semibold">
                    {formatCurrency(flight.price, flight.currency)}
                  </p>
                </div>
                {flight.airline && (
                  <div>
                    <label className="font-semibold text-gray-700">Airline:</label>
                    <p>{flight.airline}</p>
                  </div>
                )}
                {flight.flightNumber && (
                  <div>
                    <label className="font-semibold text-gray-700">Flight:</label>
                    <p>{flight.flightNumber}</p>
                  </div>
                )}
              </div>
              {(flight.departureTime || flight.arrivalTime) && (
                <div className="mt-2 flex gap-4">
                  {flight.departureTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Departure: {flight.departureTime}</span>
                    </div>
                  )}
                  {flight.arrivalTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Arrival: {flight.arrivalTime}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Companions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Companions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlan.companions.map((companion, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">Name:</label>
                  <p>{companion.name}</p>
                </div>
                {companion.email && (
                  <div>
                    <label className="font-semibold text-gray-700">Email:</label>
                    <p>{companion.email}</p>
                  </div>
                )}
                {companion.relationship && (
                  <div>
                    <label className="font-semibold text-gray-700">Relationship:</label>
                    <p>{companion.relationship}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hotels Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Hotels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlan.hotels.map((hotel, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  {hotel.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{hotel.rating}/5</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Start Date:</label>
                    <p>{hotel.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">End Date:</label>
                    <p>{hotel.endDate.toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Address:</label>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.address}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Price:</label>
                  <p className="text-green-600 font-semibold">
                    {formatCurrency(hotel.price, hotel.currency)}/night
                  </p>
                </div>
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div>
                    <label className="font-semibold text-gray-700">Amenities:</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {hotel.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Restaurants Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlan.restaurants.map((restaurant, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  {restaurant.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{restaurant.rating}/5</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Date:</label>
                    <p>{restaurant.date.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Start time:</label>
                    <p>{restaurant.startTime}</p>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Address:</label>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.address}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {restaurant.cuisine && (
                    <div>
                      <label className="font-semibold text-gray-700">Cuisine:</label>
                      <p>{restaurant.cuisine}</p>
                    </div>
                  )}
                  {restaurant.priceRange && (
                    <div>
                      <label className="font-semibold text-gray-700">Price Range:</label>
                      <p>{restaurant.priceRange}</p>
                    </div>
                  )}
                  {restaurant.reservationRequired !== undefined && (
                    <div>
                      <label className="font-semibold text-gray-700">Reservation:</label>
                      <p>{restaurant.reservationRequired ? 'Required' : 'Not Required'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {currentPlan.status === 'pending' && (
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept Trip Plan
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
            className="px-8 py-2"
          >
            <X className="w-4 h-4 mr-2" />
            Reject Trip Plan
          </Button>
        </div>
      )}

      {currentPlan.status !== 'pending' && (
        <div className="text-center">
          <p className="text-gray-600">
            This trip plan has been {currentPlan.status} on{' '}
            {currentPlan.updatedAt.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TripPlanDisplay; 