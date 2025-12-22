export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Place {
    _id: string;
    owner?: string;
    title: string;
    address: string;
    photos: string[];
    description: string;
    perks: string[];
    extraInfo: string;
    checkIn: number | string;
    checkOut: number | string;
    maxGuest: number;
    price: number;
}

export interface Booking {
    _id: string;
    place: Place;
    user: string;
    checkIn: string;
    checkOut: string;
    name: string;
    phone: string;
    numberOfGuests: number;
    price: number;
}
