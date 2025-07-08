import { DetailedTripPlan, Flight, Companion, Hotel, Restaurant } from '@/types';

// Mock data for trip plan
const mockFlights: Flight[] = [
  {
    from: "New York (JFK)",
    to: "Paris (CDG)",
    date: new Date("2024-03-15"),
    price: 650,
    currency: "USD",
    airline: "Air France",
    flightNumber: "AF007",
    departureTime: "10:30 AM",
    arrivalTime: "11:45 PM"
  },
  {
    from: "Paris (CDG)",
    to: "New York (JFK)",
    date: new Date("2024-03-22"),
    price: 680,
    currency: "USD",
    airline: "Air France",
    flightNumber: "AF008",
    departureTime: "1:20 PM",
    arrivalTime: "4:35 PM"
  }
];

const mockCompanions: Companion[] = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0123",
    relationship: "Friend"
  },
  {
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1-555-0456",
    relationship: "Partner"
  }
];

const mockHotels: Hotel[] = [
  {
    name: "Hotel des Grands Boulevards",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-19"),
    address: "17 Boulevard Poissonnière, 75002 Paris, France",
    price: 180,
    currency: "EUR",
    rating: 4.2,
    amenities: ["Free WiFi", "Breakfast", "Bar", "Concierge"],
    roomType: "Superior Double Room"
  },
  {
    name: "Le Marais Boutique Hotel",
    startDate: new Date("2024-03-19"),
    endDate: new Date("2024-03-22"),
    address: "8 Rue de Jouy, 75004 Paris, France",
    price: 220,
    currency: "EUR",
    rating: 4.5,
    amenities: ["Free WiFi", "Spa", "Restaurant", "Room Service"],
    roomType: "Deluxe Suite"
  }
];

const mockRestaurants: Restaurant[] = [
  {
    name: "Le Comptoir du Relais",
    date: new Date("2024-03-16"),
    startTime: "7:30 PM",
    address: "9 Carrefour de l'Odéon, 75006 Paris, France",
    cuisine: "French Bistro",
    priceRange: "€€€",
    rating: 4.1,
    reservationRequired: true
  },
  {
    name: "L'As du Fallafel",
    date: new Date("2024-03-17"),
    startTime: "12:30 PM",
    address: "34 Rue des Rosiers, 75004 Paris, France",
    cuisine: "Middle Eastern",
    priceRange: "€",
    rating: 4.3,
    reservationRequired: false
  },
  {
    name: "Le Jules Verne",
    date: new Date("2024-03-20"),
    startTime: "8:00 PM",
    address: "Eiffel Tower, 2nd Floor, 75007 Paris, France",
    cuisine: "Fine Dining French",
    priceRange: "€€€€",
    rating: 4.8,
    reservationRequired: true
  }
];

// Mock detailed trip plan
const mockDetailedTripPlan: DetailedTripPlan = {
  id: "trip-plan-001",
  conversationId: "conv-001",
  flights: mockFlights,
  companions: mockCompanions,
  hotels: mockHotels,
  restaurants: mockRestaurants,
  status: "pending",
  createdAt: new Date("2024-02-15"),
  updatedAt: new Date("2024-02-15")
};

// Service functions
export const tripPlanService = {
  // Get trip plan by conversation ID (mock implementation)
  async getTripPlan(conversationId: string): Promise<DetailedTripPlan | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data if conversation ID matches
    if (conversationId === "conv-001") {
      return mockDetailedTripPlan;
    }
    
    return null;
  },

  // Accept trip plan
  async acceptTripPlan(planId: string): Promise<DetailedTripPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update status to accepted
    const updatedPlan = {
      ...mockDetailedTripPlan,
      status: "accepted" as const,
      updatedAt: new Date()
    };
    
    return updatedPlan;
  },

  // Reject trip plan
  async rejectTripPlan(planId: string): Promise<DetailedTripPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update status to rejected
    const updatedPlan = {
      ...mockDetailedTripPlan,
      status: "rejected" as const,
      updatedAt: new Date()
    };
    
    return updatedPlan;
  },

  // Format trip plan for display
  formatTripPlan(plan: DetailedTripPlan): string {
    let formatted = "**Trip Plan**\n\n";
    
    // Flights section
    formatted += "**Flights:**\n";
    plan.flights.forEach(flight => {
      formatted += `From: ${flight.from}\n`;
      formatted += `To: ${flight.to}\n`;
      formatted += `Date: ${flight.date.toLocaleDateString()}\n`;
      formatted += `Price: ${flight.currency} ${flight.price}\n`;
      if (flight.airline) formatted += `Airline: ${flight.airline}\n`;
      if (flight.flightNumber) formatted += `Flight: ${flight.flightNumber}\n`;
      if (flight.departureTime) formatted += `Departure: ${flight.departureTime}\n`;
      if (flight.arrivalTime) formatted += `Arrival: ${flight.arrivalTime}\n`;
      formatted += "\n";
    });
    
    // Companions section
    formatted += "**Companions:**\n";
    plan.companions.forEach(companion => {
      formatted += `Name: ${companion.name}\n`;
      if (companion.email) formatted += `Email: ${companion.email}\n`;
      if (companion.relationship) formatted += `Relationship: ${companion.relationship}\n`;
      formatted += "\n";
    });
    
    // Hotels section
    formatted += "**Hotels:**\n";
    plan.hotels.forEach(hotel => {
      formatted += `Name: ${hotel.name}\n`;
      formatted += `Start Date: ${hotel.startDate.toLocaleDateString()}\n`;
      formatted += `End Date: ${hotel.endDate.toLocaleDateString()}\n`;
      formatted += `Address: ${hotel.address}\n`;
      formatted += `Price: ${hotel.currency} ${hotel.price}/night\n`;
      if (hotel.rating) formatted += `Rating: ${hotel.rating}/5\n`;
      formatted += "\n";
    });
    
    // Restaurants section
    formatted += "**Restaurants:**\n";
    plan.restaurants.forEach(restaurant => {
      formatted += `Name: ${restaurant.name}\n`;
      formatted += `Date: ${restaurant.date.toLocaleDateString()}\n`;
      formatted += `Start time: ${restaurant.startTime}\n`;
      formatted += `Address: ${restaurant.address}\n`;
      if (restaurant.cuisine) formatted += `Cuisine: ${restaurant.cuisine}\n`;
      if (restaurant.priceRange) formatted += `Price Range: ${restaurant.priceRange}\n`;
      if (restaurant.rating) formatted += `Rating: ${restaurant.rating}/5\n`;
      formatted += "\n";
    });
    
    return formatted;
  }
};

export default tripPlanService; 