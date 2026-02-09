export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  fixed_location?: string;
  fixed_event_type?: string;
  category?: string;
  organizer?: string;
  organizer_url?: string;
  responsible?: string;
  show_responsible: boolean;
  paid: boolean;
  price?: string;
  map?: string;
  alcohol_meter: number;
  can_participate: boolean;
  membership_required: boolean;
  avec: boolean;
  max_participants?: number;
  registration_starts?: string;
  registration_ends?: string;
  cancellation_starts?: string;
  cancellation_ends?: string;
  template: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  fixed_location?: string;
  fixed_event_type?: string;
  category?: string;
  organizer?: string;
  organizer_url?: string;
  responsible?: string;
  show_responsible?: boolean;
  paid?: boolean;
  price?: string;
  map?: string;
  alcohol_meter?: number;
  can_participate?: boolean;
  membership_required?: boolean;
  avec?: boolean;
  max_participants?: number;
  registration_starts?: string;
  registration_ends?: string;
  cancellation_starts?: string;
  cancellation_ends?: string;
  template?: boolean;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  fixed_location?: string;
  fixed_event_type?: string;
  category?: string;
  organizer?: string;
  organizer_url?: string;
  responsible?: string;
  show_responsible?: boolean;
  paid?: boolean;
  price?: string;
  map?: string;
  alcohol_meter?: number;
  can_participate?: boolean;
  membership_required?: boolean;
  avec?: boolean;
  max_participants?: number;
  registration_starts?: string;
  registration_ends?: string;
  cancellation_starts?: string;
  cancellation_ends?: string;
  template?: boolean;
}
