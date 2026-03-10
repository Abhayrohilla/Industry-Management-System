export interface Industry {
  _id: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  website?: string;
  description?: string;
  createdAt: string;
}

export interface PaginatedIndustries {
  data: Industry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

