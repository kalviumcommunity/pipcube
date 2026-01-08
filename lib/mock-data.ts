// Mock data storage for the bus ticket cancellation and refund system
// In a real application, this would be replaced with a database (PostgreSQL)

import type {
  User,
  BusOperator,
  Trip,
  Ticket,
  Cancellation,
  Refund,
} from "@/types/api";

// In-memory storage for users
let users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+0987654321",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    createdAt: new Date().toISOString(),
  },
];

// In-memory storage for bus operators
let operators: BusOperator[] = [
  {
    id: "1",
    name: "Express Bus Lines",
    licenseNumber: "EBL-2024-001",
    contactEmail: "info@expressbus.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "City Transit Co",
    licenseNumber: "CTC-2024-002",
    contactEmail: "contact@citytransit.com",
    createdAt: new Date().toISOString(),
  },
];

// In-memory storage for trips
let trips: Trip[] = [
  {
    id: "1",
    operatorId: "1",
    route: "New York to Boston",
    departureDate: "2024-12-20",
    departureTime: "10:00 AM",
    arrivalDate: "2024-12-20",
    arrivalTime: "02:30 PM",
    price: 45.99,
    availableSeats: 30,
    totalSeats: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    operatorId: "1",
    route: "Boston to New York",
    departureDate: "2024-12-25",
    departureTime: "02:30 PM",
    arrivalDate: "2024-12-25",
    arrivalTime: "07:00 PM",
    price: 45.99,
    availableSeats: 25,
    totalSeats: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    operatorId: "2",
    route: "Chicago to Detroit",
    departureDate: "2024-12-18",
    departureTime: "08:00 AM",
    arrivalDate: "2024-12-18",
    arrivalTime: "12:00 PM",
    price: 32.50,
    availableSeats: 15,
    totalSeats: 35,
    createdAt: new Date().toISOString(),
  },
];

// In-memory storage for tickets
let tickets: Ticket[] = [
  {
    id: "1",
    userId: "1",
    tripId: "1",
    seatNumber: "A12",
    price: 45.99,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "1",
    tripId: "2",
    seatNumber: "B05",
    price: 45.99,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "2",
    tripId: "3",
    seatNumber: "C08",
    price: 32.50,
    status: "cancelled",
    createdAt: new Date().toISOString(),
  },
];

// In-memory storage for cancellations
let cancellations: Cancellation[] = [
  {
    id: "1",
    ticketId: "3",
    userId: "2",
    reason: "Change of plans",
    cancelledBy: "user",
    cancellationPolicy: "Cancellation 24 hours before departure: 80% refund",
    refundEligibility: true,
    refundAmount: 26.0,
    status: "processed",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    processedAt: new Date().toISOString(),
  },
];

// In-memory storage for refunds
let refunds: Refund[] = [
  {
    id: "1",
    cancellationId: "1",
    ticketId: "3",
    userId: "2",
    originalAmount: 32.50,
    refundAmount: 26.0,
    refundPercentage: 80,
    reason: "Change of plans",
    status: "processing",
    expectedCompletionDate: new Date(Date.now() + 604800000).toISOString(), // 7 days
    createdAt: new Date().toISOString(),
  },
];

// Helper functions for users
export const getUsers = (): User[] => {
  return users;
};

export const createUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const newUser: User = {
    ...userData,
    id: (users.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

// Helper functions for trips
export const getTrips = (): Trip[] => {
  return trips;
};

export const getTripById = (id: string): Trip | undefined => {
  return trips.find((trip) => trip.id === id);
};

// Helper functions for tickets
export const getTickets = (): Ticket[] => {
  return tickets;
};

export const createTicket = (
  ticketData: Omit<Ticket, "id" | "createdAt" | "status">
): Ticket => {
  const newTicket: Ticket = {
    ...ticketData,
    id: (tickets.length + 1).toString(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  tickets.push(newTicket);
  
  // Update trip available seats
  const trip = getTripById(ticketData.tripId);
  if (trip) {
    trip.availableSeats -= 1;
  }
  
  return newTicket;
};

export const getTicketById = (id: string): Ticket | undefined => {
  return tickets.find((ticket) => ticket.id === id);
};

export const getTicketsByUserId = (userId: string): Ticket[] => {
  return tickets.filter((ticket) => ticket.userId === userId);
};

// Helper functions for cancellations
export const getCancellations = (): Cancellation[] => {
  return cancellations;
};

export const createCancellation = (
  cancellationData: Omit<Cancellation, "id" | "createdAt" | "status">
): Cancellation => {
  const newCancellation: Cancellation = {
    ...cancellationData,
    id: (cancellations.length + 1).toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  cancellations.push(newCancellation);
  
  // Update ticket status
  const ticket = getTicketById(cancellationData.ticketId);
  if (ticket) {
    ticket.status = "cancelled";
  }
  
  return newCancellation;
};

export const getCancellationById = (id: string): Cancellation | undefined => {
  return cancellations.find((cancellation) => cancellation.id === id);
};

// Helper functions for refunds
export const getRefunds = (): Refund[] => {
  return refunds;
};

export const createRefund = (
  refundData: Omit<Refund, "id" | "createdAt" | "refundPercentage">
): Refund => {
  const refundPercentage = Math.round(
    (refundData.refundAmount / refundData.originalAmount) * 100
  );
  
  const newRefund: Refund = {
    ...refundData,
    id: (refunds.length + 1).toString(),
    refundPercentage,
    status: "processing",
    createdAt: new Date().toISOString(),
    expectedCompletionDate: new Date(Date.now() + 604800000).toISOString(), // 7 days
  };
  refunds.push(newRefund);
  
  return newRefund;
};

// Calculate refund eligibility based on cancellation policy
// This is a simplified version - in production, this would check actual policies
export const calculateRefundEligibility = (
  ticketId: string
): {
  eligible: boolean;
  amount: number;
  policy: string;
} => {
  const ticket = getTicketById(ticketId);
  if (!ticket) {
    return {
      eligible: false,
      amount: 0,
      policy: "Ticket not found",
    };
  }

  // Simplified policy: 24 hours before departure = 80% refund
  // Less than 24 hours = 50% refund
  // Less than 2 hours = 0% refund
  const trip = getTripById(ticket.tripId);
  if (!trip) {
    return {
      eligible: false,
      amount: 0,
      policy: "Trip not found",
    };
  }

  const now = new Date();
  const departureDateTime = new Date(
    `${trip.departureDate} ${trip.departureTime}`
  );
  const hoursUntilDeparture =
    (departureDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilDeparture >= 24) {
    return {
      eligible: true,
      amount: Math.round(ticket.price * 0.8 * 100) / 100,
      policy: "Cancellation 24 hours before departure: 80% refund",
    };
  } else if (hoursUntilDeparture >= 2) {
    return {
      eligible: true,
      amount: Math.round(ticket.price * 0.5 * 100) / 100,
      policy: "Cancellation 2-24 hours before departure: 50% refund",
    };
  } else {
    return {
      eligible: false,
      amount: 0,
      policy: "Cancellation less than 2 hours before departure: No refund",
    };
  }
};
