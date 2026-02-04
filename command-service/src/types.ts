export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  date: string;
  location?: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}
