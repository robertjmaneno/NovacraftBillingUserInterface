import { config } from '../config/environment';
import { 
  InvoiceTemplateDto, 
  InvoiceTemplateResponse, 
  LogoUploadResponse 
} from '../types/invoice-template';

// Force all API calls to use the full backend URL, never a relative path
const API_BASE_URL = config.apiUrl;

if (!API_BASE_URL) {
  console.warn('API_BASE_URL is undefined! Check your environment configuration.');
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  returnUrl?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
    tokenType?: string;
    user?: UserData;
    requiresMfa?: boolean;
    userId?: string;
  };
  otp?: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: number | string; // Backend returns number, frontend might expect string
  address?: string;
  phoneNumber?: string;
  company?: string;
  jobTitle?: string;
  lastLogin?: string;
  status: number | string; // Backend returns number, frontend might expect string
  userType: number | string; // Backend returns number, frontend might expect string
  createdAt: string;
  updatedAt: string;
  age: number;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  lockoutEnd?: string | null;
  accessFailedCount: number;
  mustChangePassword?: boolean;
  lastPasswordChange?: string;
  roles?: string[];
  permissions?: string[];
  avatar?: string;
}

// User Management Interfaces
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
  company?: string;
  jobTitle?: string;
  userType?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
  roleNames?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
  company?: string;
  jobTitle?: string;
  userType?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    items: UserData[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface UserSearchResponse {
  success: boolean;
  data: UserData[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

// Role Management Interfaces
export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  isSystem: boolean;
  roleType: number; // Backend returns number
  createdAt: string;
  updatedAt: string | null; // Backend can return null
  createdBy?: string | null; // Backend can return null
  updatedBy?: string | null; // Backend can return null
  userCount?: number; // Backend includes this
  permissionCount?: number; // Backend includes this
  permissions?: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description?: string;
  roleType?: number;
  permissionIds?: number[]; // Optional - can be included during creation
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  displayName?: string;
  description?: string;
  isActive?: boolean;
  roleType?: string;
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: {
    roles: Role[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

// Permission Management Interfaces
export interface Permission {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  module: string;
  action: string;
  fullName?: string;
  isActive: boolean;
  isSystem: boolean;
  permissionType: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CreatePermissionRequest {
  name: string;
  displayName: string;
  description?: string;
  module: string;
  action: string;
  permissionType?: string;
}

export interface UpdatePermissionRequest {
  displayName?: string;
  description?: string;
  isActive?: boolean;
  permissionType?: string;
}

export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: {
    permissions: Permission[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface PermissionResponse {
  success: boolean;
  message: string;
  data: Permission;
}

// User-Role Assignment Interfaces
export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
  isActive: boolean;
  expiresAt?: string;
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
  expiresAt?: string;
}

export interface UpdateUserRolesRequest {
  userId: string;
  roleIds: string[];
}

// Authentication Interfaces
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
  email?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface MfaVerifyRequest {
  userId: string;
  mfaCode: string;
}

export interface MfaVerifyUnauthenticatedRequest {
  email: string;
  password: string;
  mfaCode: string;
}

export interface MfaVerifyResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    tokenType: string;
    user: UserData;
  };
}

export interface MfaSendCodeRequest {
  userId: string;
}

export interface MfaSendCodeUnauthenticatedRequest {
  email: string;
  password: string;
}

export interface MfaSendCodeResponse {
  success: boolean;
  message: string;
}

export interface EnableMfaRequest {
  userId: string;
  enableMfa: boolean;
}

export interface MfaStatusResponse {
  success: boolean;
  message: string;
  data: {
    enabled: boolean;
  };
}

export interface MfaToggleResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    tokenType: string;
  };
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  success: boolean;
  message: string;
  data: {
    isValid: boolean;
    user?: UserData;
  };
}

// Customer Management Interfaces
export interface Customer {
  id: number;
  firstName?: string | null; // Required for Individual customers
  lastName?: string | null; // Required for Individual customers
  organizationName?: string | null; // Required for Business customers
  phoneNumber: string;
  email: string;
  customerType: number; // 0 = Individual, 1 = Business
  status: number; // 1 = Active, 2 = Inactive, 3 = Suspended, 4 = Pending
  notes?: string | null;
  taxId?: string | null;
  registrationNumber?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  fullName: string;
  displayName: string;
  age: number;
  addresses: CustomerAddress[];
  documents: CustomerDocument[];
}

export interface CustomerAddress {
  id: number;
  customerId: number;
  addressType: number; // 1 = Billing, 2 = Physical, 3 = Shipping
  streetAddress: string;
  city: string;
  district: string;
  postOfficeBox?: string | null;
  country: string;
  postalCode?: string | null;
  state?: string | null;
  additionalInfo?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CustomerDocument {
  id: number;
  customerId: number;
  fileName: string;
  documentType: string;
  description?: string | null;
  documentNumber?: string | null;
  expiryDate?: string | null;
  issueDate?: string | null;
  issuingAuthority?: string | null;
  tags?: string | null;
  fileUrl?: string | null;
  fileSize?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCustomerRequest {
  step1: {
    firstName?: string; // Required for Individual customers
    lastName?: string; // Required for Individual customers
    organizationName?: string; // Required for Business customers
    phoneNumber: string;
    email: string;
    customerType: number; // 0 = Individual, 1 = Business
    taxId?: string;
    registrationNumber?: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    notes?: string;
  };
  
  step2: {
    streetAddress: string;
    city: string;
    district: string;
    postOfficeBox: string;
    country: string;
    postalCode: string;
    state: string;
    additionalInfo: string;
  };
  
  step3: {
    streetAddress: string;
    city: string;
    district: string;
    postOfficeBox: string;
    country: string;
    postalCode: string;
    state: string;
    additionalInfo: string;
  };
}

export interface CreateCustomerWithDocumentsRequest extends CreateCustomerRequest {
  step4: {
    documents: Array<{
      fileName: string;
      documentType: string;
      description?: string;
      documentNumber?: string;
      expiryDate?: string;
      issueDate?: string;
      issuingAuthority?: string;
      tags?: string;
      filePath?: string;
      fileSize?: number;
      fileType?: string;
    }>;
  };
}

export interface UpdateCustomerRequest {
  firstName?: string; // Required for Individual customers
  lastName?: string; // Required for Individual customers
  organizationName?: string; // Required for Business customers
  phoneNumber?: string;
  email?: string;
  customerType?: number;
  status?: number;
  notes?: string;
  taxId?: string;
  registrationNumber?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface AddCustomerAddressRequest {
  addressType: number; // 1 = Billing, 2 = Physical, 3 = Shipping
  streetAddress: string;
  city: string;
  district: string;
  postOfficeBox: string;
  country: string;
  postalCode: string;
  state: string;
  additionalInfo: string;
}

export interface AddCustomerDocumentRequest {
  documentType: string;
  description?: string;
  documentNumber?: string;
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
  tags?: string;
  file?: File;
}

// Service Management Interfaces
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  billingCycle: number; // 1 = One-time, 2 = Monthly, 3 = Quarterly, 4 = Semi-annually, 5 = Annually
  clientCount: number;
  revenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  status: number; // 1 = Active, 2 = Inactive
  category?: string | null;
  serviceCode?: string | null;
  discountPercentage: number;
  isTaxable: boolean;
  termsAndConditions?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  billingCycle: number;
  status?: number;
  category?: string;
  discountPercentage?: number;
  isTaxable?: boolean;
  termsAndConditions?: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  billingCycle?: number;
  status?: number;
  category?: string;
  discountPercentage?: number;
  isTaxable?: boolean;
  termsAndConditions?: string;
}

export interface UpdateRevenueRequest {
  revenue: number;
}

export interface UpdateClientCountRequest {
  clientCount: number;
}

export interface ServiceQueryParams {
  searchTerm?: string;
  category?: string;
  status?: number;
  billingCycle?: number;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface BillingCycle {
  value: number;
  name: string;
}

export interface BillingCycleResponse {
  success: boolean;
  data: BillingCycle[];
}

// Subscription Management Interfaces
export interface Subscription {
  id: number;
  subscriptionCode: string;
  customerId: number;
  customerName?: string;
  serviceId?: number;
  serviceName?: string;
  status?: number;
  startDate?: string;
  endDate?: string | null;
  nextBillingDate?: string | null;
  amount?: number;
  billingCycle?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface SubscriptionListResponse {
  success: boolean;
  message: string;
  data: {
    items: Subscription[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: Subscription;
}

export interface ServiceStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalRevenue: number;
    totalClients: number;
  };
}

export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: {
    items: Service[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface CustomerSearchParams {
  searchTerm?: string;
  customerType?: number;
  status?: number;
  country?: string;
  city?: string;
  district?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface CustomerListResponse {
  success: boolean;
  data: {
    items: Customer[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

// Payment Management Interfaces
export interface Payment {
  paymentId: number;
  invoiceNumber: string;
  customerName: string;
  amount: number; // Amount in MKW
  method: string;
  status: string;
  date: string;
}

export interface PaymentStats {
  totalPayments: number; // In MKW
  completed: number;
  pending: number;
}

export interface PaymentListResponse {
  success: boolean;
  data: Payment[];
}

export interface PaymentResponse {
  success: boolean;
  data: Payment;
}

export interface PaymentStatsResponse {
  success: boolean;
  data: PaymentStats;
}

class ApiService {
  private baseUrl: string;

  // Custom error type for API errors to carry HTTP status and details
  private ApiError = class ApiError extends Error {
    status?: number;
    details?: unknown;
    constructor(message?: string, status?: number, details?: unknown) {
      super(message || 'API Error');
      this.name = 'ApiError';
      this.status = status;
      this.details = details;
    }
  };
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false // Add a flag to skip auth
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Prepare default headers, but don't set Content-Type for FormData
    const defaultHeaders: Record<string, string> = {};
    
    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const requestConfig: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Only add Authorization header if not skipping auth
    if (!skipAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
      
        const { isTokenExpired } = await import('../lib/jwt-utils');
        if (isTokenExpired(token)) {
          console.log('Token is expired, clearing auth data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          
          const Err = this.ApiError;
          throw new Err('Authentication token expired. Please sign in again.', 401);
        }
        requestConfig.headers = {
          ...requestConfig.headers,
          'Authorization': `Bearer ${token}`,
        };
      } else {
        console.log('No auth token found in localStorage');
      }
    }

    try {
      console.log(`Making API request to: ${url}`);
      console.log('Request headers:', requestConfig.headers);
      console.log('Request body:', options.body);
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));

        // Special handling for 403 Forbidden errors
        if (response.status === 403) {
          console.error('🚫 PERMISSION DENIED - This suggests a backend authorization issue');
          console.error('Request URL:', url);
          console.error('Request method:', requestConfig.method);
          console.error('Auth header sent:', requestConfig.headers && 'Authorization' in requestConfig.headers ? 'YES' : 'NO');
          
          // Try to extract more info from error response
          if (errorData.message) {
            console.error('Backend error message:', errorData.message);
          }
          if (errorData.details) {
            console.error('Backend error details:', errorData.details);
          }
        }

        const Err = this.ApiError;

        // Extract a useful message from the payload
        let serverMessage = '';
        if (errorData && typeof errorData === 'object') {
          serverMessage = (errorData.message || errorData.title || '') as string;
        }

        // Map common status codes to user-friendly messages
        switch (response.status) {
          case 400: {
            // Validation errors
            if (errorData && errorData.errors && typeof errorData.errors === 'object') {
              const validationErrors = Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                .join('; ');
              throw new Err(`Validation errors: ${validationErrors}`, 400, errorData.errors);
            }
            throw new Err(serverMessage || 'Bad request. Please check your input and try again.', 400, errorData);
          }
          case 401: {
            // Unauthorized - invalid credentials or expired token
            const message = serverMessage || 'Invalid email or password.';
            // If server indicates lock/suspended, surface that exact message
            if (message.toLowerCase().includes('lock') || message.toLowerCase().includes('suspended') || message.toLowerCase().includes('disabled')) {
              throw new Err(message, 401, errorData);
            }
            // Clear local auth for unauthorized responses
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            throw new Err(message, 401, errorData);
          }
          case 403:
            throw new Err(serverMessage || "You don't have permission to perform this action.", 403, errorData);
          case 404:
            throw new Err(serverMessage || `Resource not found: ${url}`, 404, errorData);
          case 423:
            // Locked
            throw new Err(serverMessage || 'Your account is locked. Contact support.', 423, errorData);
          case 500:
          default:
            throw new Err(serverMessage || 'Server error. Please try again later or contact support.', response.status || 500, errorData);
        }
      }

     
      const contentType = response.headers.get('content-type');
      if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
        
        return { success: true, message: 'Operation completed successfully' } as T;
      }

      const responseData = await response.json();
      console.log('API Response for', url, ':', responseData);
      return responseData;
    } catch (error: unknown) {
      const Err = this.ApiError;

      // If it's already an ApiError, rethrow
      if (error instanceof Err) {
        throw error;
      }

      // If the error is an Error with a useful message, surface that
      const maybeMsg = (error && typeof (error as unknown as { message?: unknown }).message === 'string')
        ? (error as unknown as { message: string }).message
        : '';
      if (maybeMsg && maybeMsg !== 'Failed to fetch') {
        console.error('API error:', maybeMsg);
        throw error;
      }

      // Generic network/connectivity fallback
      throw new Err('Unable to connect to the server. Please try again later.');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  }


  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: CreateUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.request<ForgotPasswordResponse>('/api/Auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    console.log('Reset Password Request Data:', JSON.stringify(data, null, 2));
    console.log('Token being sent:', data.token);
    console.log('Token length:', data.token.length);
    console.log('Token contains spaces:', data.token.includes(' '));
    console.log('Token contains special chars:', /[^A-Za-z0-9+/=]/.test(data.token));
    
    return this.request<ResetPasswordResponse>('/api/Auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return this.request<ChangePasswordResponse>('/api/Auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.request<RefreshTokenResponse>('/api/Auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateToken(data: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    return this.request<ValidateTokenResponse>('/api/Auth/validate-token', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyMfa(data: MfaVerifyRequest): Promise<MfaVerifyResponse> {
    return this.request<MfaVerifyResponse>('/api/Auth/verify-mfa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyMfaUnauthenticated(data: MfaVerifyUnauthenticatedRequest): Promise<MfaVerifyResponse> {
    console.log('API - verifyMfaUnauthenticated called with:', data);
    const response = await this.request<MfaVerifyResponse>('/api/Auth/verify-mfa-unauthenticated', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('API - verifyMfaUnauthenticated response:', response);
    return response;
  }

  async sendMfaCode(data: MfaSendCodeRequest): Promise<MfaSendCodeResponse> {
    return this.request<MfaSendCodeResponse>('/api/Auth/send-mfa-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendMfaCodeUnauthenticated(data: MfaSendCodeUnauthenticatedRequest): Promise<MfaSendCodeResponse> {
    return this.request<MfaSendCodeResponse>('/api/Auth/send-mfa-code-unauthenticated', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleMfa(data: EnableMfaRequest): Promise<MfaToggleResponse> {
    return this.request<MfaToggleResponse>('/api/Auth/enable-mfa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  

  async getMfaStatus(userId: string): Promise<MfaStatusResponse> {
    return this.request<MfaStatusResponse>(`/api/Auth/mfa-status/${userId}`);
  }

  async forcePasswordChangeUnauthenticated(data: { email: string; currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string; data?: { accessToken: string; refreshToken: string; expiresAt: string; tokenType: string; user: UserData } }> {
    return this.request<{ success: boolean; message: string; data?: { accessToken: string; refreshToken: string; expiresAt: string; tokenType: string; user: UserData } }>(`/api/Auth/force-password-change-unauthenticated`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, true); // skipAuth = true
  }

  // User Management endpoints
  async getCurrentProfile(): Promise<UserResponse> {
    try {
      return await this.request<UserResponse>('/api/User/profile');
    } catch (error) {
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async updateCurrentProfile(data: UpdateUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/api/User/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserById(id: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/User/${id}`);
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/User/email/${email}`);
  }

  async getUsers(pageNumber: number = 1, pageSize: number = 10): Promise<UserListResponse> {
    return this.request<UserListResponse>(`/api/User?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getUsersByStatus(status: string, pageNumber: number = 1, pageSize: number = 10): Promise<UserListResponse> {
    return this.request<UserListResponse>(`/api/User/status/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getUsersByType(userType: string, pageNumber: number = 1, pageSize: number = 10): Promise<UserListResponse> {
    return this.request<UserListResponse>(`/api/User/type/${userType}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async searchUsers(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Promise<UserListResponse> {
    const response = await this.request<UserSearchResponse>(`/api/User/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    
  
    return {
      success: response.success,
      message: 'Search completed successfully',
      data: {
        items: response.data || [],
        totalCount: response.data?.length || 0,
        page: pageNumber,
        pageSize: pageSize,
        totalPages: 1, 
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  }

  async getUserCountByStatus(status: string): Promise<{ success: boolean; message: string; data: number }> {
    return this.request<{ success: boolean; message: string; data: number }>(`/api/User/count/status/${status}`);
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/api/User', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/User/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/User/${id}`, {
      method: 'DELETE',
    });
  }

  // User Status Management
  async activateUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/User/${id}/activate`, {
      method: 'POST',
    });
  }

  async deactivateUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/User/${id}/deactivate`, {
      method: 'POST',
    });
  }

  async suspendUser(id: string, reason: string = 'Suspended by administrator'): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/User/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ 
        suspendUserDto: { 
          userId: id,
          reason: reason
        } 
      }),
    });
  }

  async unlockUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/User/${id}/unlock`, {
      method: 'POST',
    });
  }

  async lockUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/User/${id}/lock`, {
      method: 'POST',
    });
  }

  // User Validation
  async validateEmail(email: string): Promise<{ success: boolean; message: string; data: boolean }> {
    return this.request<{ success: boolean; message: string; data: boolean }>(`/api/User/validate/email?email=${encodeURIComponent(email)}`);
  }

  async validatePhone(phoneNumber: string): Promise<{ success: boolean; message: string; data: boolean }> {
    return this.request<{ success: boolean; message: string; data: boolean }>(`/api/User/validate/phone?phoneNumber=${encodeURIComponent(phoneNumber)}`);
  }

  // Role Management endpoints
  async getRoles(pageNumber: number = 1, pageSize: number = 10): Promise<RoleListResponse> {
    const response = await this.request<{items: Role[]}>(`/api/Role?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    
   
    return {
      success: true,
      message: 'Roles retrieved successfully',
      data: {
        roles: response?.items || [],
        totalCount: response?.items?.length || 0,
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalPages: 1, 
      },
    };
  }

  async getActiveRoles(): Promise<RoleListResponse> {
    const response = await this.request<{
      items: Role[];
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    }>('/api/Role');
    
   
    return {
      success: true,
      message: 'Active roles retrieved successfully',
      data: {
        roles: response?.items || [],
        totalCount: response?.totalCount || 0,
        pageNumber: response?.page || 1,
        pageSize: response?.pageSize || 10,
        totalPages: response?.totalPages || 1,
      },
    };
  }

  async getRoleById(id: string): Promise<RoleResponse> {
    return this.request<RoleResponse>(`/api/Role/${id}`);
  }

  async getRoleWithPermissions(id: string): Promise<RoleResponse> {
    return this.request<RoleResponse>(`/api/Role/${id}/with-permissions`);
  }

  async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
    return this.request<RoleResponse>('/api/Role', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<RoleResponse> {
    return this.request<RoleResponse>(`/api/Role/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Role/${id}`, {
      method: 'DELETE',
    });
  }

  // Role-Permission Management
  async getRolePermissions(roleId: string): Promise<PermissionListResponse> {
    return this.request<PermissionListResponse>(`/api/Role/${roleId}/permissions`);
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Role/${roleId}/permissions/${permissionId}`, {
      method: 'POST',
    });
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Role/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE',
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: number[]): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Role/${roleId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify(permissionIds),
    });
  }

  async checkRolePermission(roleId: string, permissionName: string): Promise<{ success: boolean; message: string; data: boolean }> {
    return this.request<{ success: boolean; message: string; data: boolean }>(`/api/Role/${roleId}/permissions/check?permissionName=${encodeURIComponent(permissionName)}`);
  }

  // Permission Management endpoints
  async getPermissions(pageNumber: number = 1, pageSize: number = 10): Promise<PermissionListResponse> {
    return this.request<PermissionListResponse>(`/api/Permission?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getActivePermissions(): Promise<PermissionListResponse> {
    const response = await this.request<{
      items: Permission[];
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    }>('/api/Permission?pageNumber=1&pageSize=1000');
    
  
    return {
      success: true,
      message: 'Active permissions retrieved successfully',
      data: {
        permissions: response?.items || [],
        totalCount: response?.totalCount || 0,
        pageNumber: response?.page || 1,
        pageSize: response?.pageSize || 10,
        totalPages: response?.totalPages || 1,
      },
    };
  }

  async getPermissionById(id: string): Promise<PermissionResponse> {
    return this.request<PermissionResponse>(`/api/Permission/${id}`);
  }

  async getPermissionByName(name: string): Promise<PermissionResponse> {
    return this.request<PermissionResponse>(`/api/Permission/name/${name}`);
  }

  async createPermission(data: CreatePermissionRequest): Promise<PermissionResponse> {
    return this.request<PermissionResponse>('/api/Permission', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePermission(id: string, data: UpdatePermissionRequest): Promise<PermissionResponse> {
    return this.request<PermissionResponse>(`/api/Permission/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePermission(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Permission/${id}`, {
      method: 'DELETE',
    });
  }

  // Permission Filtering
  async getPermissionsByModule(module: string): Promise<PermissionListResponse> {
    return this.request<PermissionListResponse>(`/api/Permission/module/${module}`);
  }

  async getPermissionsByType(permissionType: string): Promise<PermissionListResponse> {
    return this.request<PermissionListResponse>(`/api/Permission/type/${permissionType}`);
  }

  async getAllModules(): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>('/api/Permission/modules');
  }

  async getAllActions(): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>('/api/Permission/actions');
  }

  async getPermissionsByRole(roleId: string): Promise<PermissionListResponse> {
    return this.request<PermissionListResponse>(`/api/Permission/role/${roleId}`);
  }

  async getPermissionsByUser(userId: string): Promise<PermissionListResponse> {
    return this.request<PermissionListResponse>(`/api/Permission/user/${userId}`);
  }

  // User-Role Assignment endpoints
  async assignRoleToUser(data: AssignRoleRequest): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/UserRole', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/UserRole/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRoles(userId: string, roleIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/UserRole/${userId}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roleIds }),
    });
  }

  async getUserRoles(userId: string): Promise<{ success: boolean; message: string; data: Role[] }> {
    return this.request<{ success: boolean; message: string; data: Role[] }>(`/api/UserRole/user/${userId}`);
  }

  async getActiveUserRoles(userId: string): Promise<{ success: boolean; message: string; data: Role[] }> {
    return this.request<{ success: boolean; message: string; data: Role[] }>(`/api/UserRole/user/${userId}/active`);
  }

  async checkUserInRole(userId: string, roleId: string): Promise<{ success: boolean; message: string; data: boolean }> {
    return this.request<{ success: boolean; message: string; data: boolean }>(`/api/UserRole/check/${userId}/role/${roleId}`);
  }

  async checkUserInRoleByName(userId: string, roleName: string): Promise<{ success: boolean; message: string; data: boolean }> {
    return this.request<{ success: boolean; message: string; data: boolean }>(`/api/UserRole/check/${userId}/role-name/${roleName}`);
  }

  async getUserRoleNames(userId: string): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>(`/api/UserRole/user/${userId}/role-names`);
  }

  async getUserRoleIds(userId: string): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>(`/api/UserRole/user/${userId}/role-ids`);
  }

  async getUsersInRole(roleId: string): Promise<UserListResponse> {
    return this.request<UserListResponse>(`/api/UserRole/role/${roleId}/users`);
  }

  async getUserCountInRole(roleId: string): Promise<{ success: boolean; message: string; data: number }> {
    return this.request<{ success: boolean; message: string; data: number }>(`/api/UserRole/role/${roleId}/user-count`);
  }

  // Customer Management endpoints
  async getCustomers(params: CustomerSearchParams = {}): Promise<CustomerListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params.customerType) searchParams.append('customerType', params.customerType.toString());
    if (params.status) searchParams.append('status', params.status.toString());
    if (params.country) searchParams.append('country', params.country);
    if (params.city) searchParams.append('city', params.city);
    if (params.district) searchParams.append('district', params.district);
    if (params.createdFrom) searchParams.append('createdFrom', params.createdFrom);
    if (params.createdTo) searchParams.append('createdTo', params.createdTo);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDescending !== undefined) searchParams.append('sortDescending', params.sortDescending.toString());
    
    const queryString = searchParams.toString();
    return this.request<CustomerListResponse>(`/api/Customer${queryString ? `?${queryString}` : ''}`);
  }

  async getCustomerById(id: number): Promise<CustomerResponse> {
    return this.request<CustomerResponse>(`/api/Customer/${id}`);
  }

  async createCustomer(data: CreateCustomerWithDocumentsRequest): Promise<CustomerResponse> {
   
    const documents = data.step4?.documents || [];
    const customerData = { ...data };
    delete customerData.step4;
    
    // Create customer with JSON data
    const customerResponse = await this.request<CustomerResponse>('/api/Customer', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    
  
    if (customerResponse.success && customerResponse.data && documents.length > 0) {
      const customerId = customerResponse.data.id;
      
      
      for (const doc of documents) {
        if (doc.filePath && doc.documentType) {
          try {
            await this.addCustomerDocument(customerId, {
              documentType: doc.documentType,
              description: doc.description,
              documentNumber: doc.documentNumber,
              expiryDate: doc.expiryDate,
              issueDate: doc.issueDate,
              issuingAuthority: doc.issuingAuthority,
              tags: doc.tags,
              file: undefined, 
            });
          } catch (error) {
            console.warn(`Failed to upload document ${doc.fileName}:`, error);
           
          }
        }
      }
    }
    
    return customerResponse;
  }

  async updateCustomer(id: number, data: UpdateCustomerRequest): Promise<CustomerResponse> {
    return this.request<CustomerResponse>(`/api/Customer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Customer/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer Address Management
  async addCustomerAddress(customerId: number, data: AddCustomerAddressRequest): Promise<{ success: boolean; message: string; data: CustomerAddress }> {
    return this.request<{ success: boolean; message: string; data: CustomerAddress }>(`/api/Customer/${customerId}/address`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Customer Document Management
  async addCustomerDocument(customerId: number, data: AddCustomerDocumentRequest): Promise<{ success: boolean; message: string; data: CustomerDocument }> {
    const formData = new FormData();
    
    formData.append('documentType', data.documentType);
    if (data.description) formData.append('description', data.description);
    if (data.documentNumber) formData.append('documentNumber', data.documentNumber);
    if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
    if (data.issueDate) formData.append('issueDate', data.issueDate);
    if (data.issuingAuthority) formData.append('issuingAuthority', data.issuingAuthority);
    if (data.tags) formData.append('tags', data.tags);
    if (data.file) formData.append('file', data.file);
    
    return this.request<{ success: boolean; message: string; data: CustomerDocument }>(`/api/Customer/${customerId}/document`, {
      method: 'POST',
      body: formData,
    });
  }

  async addMultipleCustomerDocuments(customerId: number, files: File[], documentType: string, description?: string): Promise<{ success: boolean; message: string; data: CustomerDocument[] }> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('documentType', documentType);
    if (description) formData.append('description', description);
    
    return this.request<{ success: boolean; message: string; data: CustomerDocument[] }>(`/api/Customer/${customerId}/documents`, {
      method: 'POST',
      body: formData,
    });
  }

  // Service Management Methods
  async getServices(pageNumber: number = 1, pageSize: number = 10): Promise<ServiceListResponse> {
    return this.request<ServiceListResponse>(`/api/Service?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getServicesWithQuery(params: ServiceQueryParams = {}): Promise<ServiceListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params.category) searchParams.append('category', params.category);
    if (params.status) searchParams.append('status', params.status.toString());
    if (params.billingCycle) searchParams.append('billingCycle', params.billingCycle.toString());
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.pageNumber) searchParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDescending !== undefined) searchParams.append('sortDescending', params.sortDescending.toString());
    
    const queryString = searchParams.toString();
    return this.request<ServiceListResponse>(`/api/Service${queryString ? `?${queryString}` : ''}`);
  }

  async getServiceById(id: number): Promise<{ success: boolean; message: string; data: Service }> {
    return this.request<{ success: boolean; message: string; data: Service }>(`/api/Service/${id}`);
  }

  async getServiceByCode(serviceCode: string): Promise<{ success: boolean; message: string; data: Service }> {
    return this.request<{ success: boolean; message: string; data: Service }>(`/api/Service/code/${serviceCode}`);
  }

  async getServicesByCategory(category: string): Promise<{ success: boolean; message: string; data: Service[] }> {
    return this.request<{ success: boolean; message: string; data: Service[] }>(`/api/Service/category/${category}`);
  }

  async getServicesByStatus(status: number): Promise<{ success: boolean; message: string; data: Service[] }> {
    return this.request<{ success: boolean; message: string; data: Service[] }>(`/api/Service/status/${status}`);
  }

  async getServiceCategories(): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>('/api/Service/categories');
  }

  async getBillingCycles(): Promise<BillingCycleResponse> {
    return this.request<BillingCycleResponse>('/api/Service/billing-cycles');
  }

  async getServiceStats(): Promise<ServiceStatsResponse> {
    return this.request<ServiceStatsResponse>('/api/Service/stats/revenue');
  }

  async getTotalRevenue(): Promise<{ success: boolean; message: string; data: number }> {
    return this.request<{ success: boolean; message: string; data: number }>('/api/Service/stats/revenue');
  }

  async getTotalClients(): Promise<{ success: boolean; message: string; data: number }> {
    return this.request<{ success: boolean; message: string; data: number }>('/api/Service/stats/clients');
  }

  async createService(data: CreateServiceRequest): Promise<{ success: boolean; message: string; data: Service }> {
    return this.request<{ success: boolean; message: string; data: Service }>('/api/Service', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: number, data: UpdateServiceRequest): Promise<{ success: boolean; message: string; data: Service }> {
    return this.request<{ success: boolean; message: string; data: Service }>(`/api/Service/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateServiceRevenue(id: number, data: UpdateRevenueRequest): Promise<{ success: boolean; message: string; data: Service }> {
    return this.request<{ success: boolean; message: string; data: Service }>(`/api/Service/${id}/revenue`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateServiceClientCount(id: number, data: UpdateClientCountRequest): Promise<{ success: boolean; message: string; data: Service }> {
    return this.request<{ success: boolean; message: string; data: Service }>(`/api/Service/${id}/clients`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/Service/${id}`, {
      method: 'DELETE',
    });
  }

  // Subscription Management Methods
  async getSubscriptions(params: Record<string, unknown> = {}): Promise<SubscriptionListResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(String(key), String(value));
      }
    });
    const queryString = searchParams.toString();
    return this.request<SubscriptionListResponse>(`/api/subscription${queryString ? `?${queryString}` : ''}`);
  }

  async getSubscriptionById(id: string | number): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>(`/api/subscription/${id}`);
  }

  async getSubscriptionByCode(subscriptionCode: string): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>(`/api/subscription/code/${subscriptionCode}`);
  }

  async createSubscription(data: Partial<Subscription>): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>('/api/subscription', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createSubscriptionsBulk(data: Partial<Subscription>[]): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/subscription/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubscription(id: string | number, data: Partial<Subscription>): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>(`/api/subscription/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelSubscription(id: string | number, reason: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async pauseSubscription(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription/${id}/pause`, {
      method: 'PUT',
    });
  }

  async resumeSubscription(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription/${id}/resume`, {
      method: 'PUT',
    });
  }

  async renewSubscription(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription/${id}/renew`, {
      method: 'PUT',
    });
  }

  async processSubscriptionBilling(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription/${id}/process-billing`, {
      method: 'PUT',
    });
  }

  async deleteSubscription(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription/${id}`, {
      method: 'DELETE',
    });
  }

  async getSubscriptionsByCustomer(customerId: string | number): Promise<SubscriptionListResponse> {
    return this.request<SubscriptionListResponse>(`/api/subscription/customer/${customerId}`);
  }

  async getSubscriptionsByService(serviceId: string | number): Promise<SubscriptionListResponse> {
    return this.request<SubscriptionListResponse>(`/api/subscription/service/${serviceId}`);
  }

  async getSubscriptionsByStatus(status: string): Promise<SubscriptionListResponse> {
    return this.request<SubscriptionListResponse>(`/api/subscription/status/${status}`);
  }

  async getOverdueSubscriptions(): Promise<SubscriptionListResponse> {
    return this.request<SubscriptionListResponse>('/api/subscription/overdue');
  }

  async getUpcomingBillingSubscriptions(params: { from: string; to: string }): Promise<SubscriptionListResponse> {
    const searchParams = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<SubscriptionListResponse>(`/api/subscription/upcoming-billing?${searchParams}`);
  }

  async getActiveSubscriptions(): Promise<SubscriptionListResponse> {
    return this.request<SubscriptionListResponse>('/api/subscription/active');
  }

  async getActiveSubscriptionCount(): Promise<{ success: boolean; data: number }> {
    return this.request<{ success: boolean; data: number }>(`/api/subscription/stats/count`);
  }

  async getTotalSubscriptionRevenue(): Promise<{ success: boolean; data: number }> {
    return this.request<{ success: boolean; data: number }>(`/api/subscription/stats/revenue`);
  }

  // Invoice Management Methods
  async getInvoiceById(id: string | number): Promise<{ success: boolean; message?: string; data?: unknown }> {
    return this.request<{ success: boolean; message?: string; data?: unknown }>(`/api/invoice/${id}`);
  }

  async getInvoices(params: Record<string, unknown> = {}): Promise<{ success: boolean; message?: string; data?: unknown }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(String(key), String(value));
      }
    });
    const queryString = searchParams.toString();
    return this.request<{ success: boolean; message?: string; data?: unknown }>(`/api/invoice${queryString ? `?${queryString}` : ''}`);
  }

  async sendInvoiceEmail(id: string | number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/invoice/${id}/send-email`, {
      method: 'POST',
    });
  }

  async downloadInvoicePdf(id: string | number): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/invoice/${id}/pdf`, {
      method: 'GET',
      headers: { ...this.getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to download PDF');
    return response.blob();
  }

  async updateInvoiceStatus(id: string | number, status: string | number, reason?: string): Promise<{ success: boolean; message: string }> {
    const body: Record<string, unknown> & { reason?: string } = { status };
    if (reason) body.reason = reason;
    return this.request<{ success: boolean; message: string }>(`/api/invoice/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async createInvoice(data: Record<string, unknown>): Promise<{ success: boolean; message?: string; data?: unknown }> {
    return this.request<{ success: boolean; message?: string; data?: unknown }>('/api/invoice/create-invoice-firsttime', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInvoiceTemplate(): Promise<InvoiceTemplateResponse> {
    return this.request<InvoiceTemplateResponse>(`/api/invoice-template`);
  }

  async updateInvoiceTemplate(template: Partial<InvoiceTemplateDto>): Promise<{ success: boolean; message?: string }> {
    return this.request<{ success: boolean; message?: string }>(`/api/invoice-template`, {
      method: 'PUT',
      body: JSON.stringify(template),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async uploadInvoiceTemplateLogo(file: File): Promise<LogoUploadResponse> {
    const formData = new FormData();
    formData.append('logo', file);

    return this.request<LogoUploadResponse>(`/api/invoice-template/upload-logo`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header for FormData, let browser set it automatically
        // This ensures proper multipart/form-data boundary is set
      },
    });
  }

  getInvoiceTemplatePreviewUrl(sampleData: boolean = true): string {
    return `${this.baseUrl}/api/invoice-template/preview?sampleData=${sampleData}`;
  }

  async downloadInvoiceTemplatePdf(): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/invoice-template/preview-pdf`, {
      method: 'GET',
      headers: { ...this.getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to download template PDF');
    return response.blob();
  }

  getInvoiceTemplateLogoUrl(filename: string): string {
    return `${this.baseUrl}/api/invoice-template/logo/${filename}`;
  }

  // Payment Management Methods
  async getAllPayments(): Promise<PaymentListResponse> {
    return this.request<PaymentListResponse>(`/api/payment`);
  }

  async getPaymentById(id: number | string): Promise<PaymentResponse> {
    return this.request<PaymentResponse>(`/api/payment/${id}`);
  }

  async getPaymentStats(): Promise<PaymentStatsResponse> {
    return this.request<PaymentStatsResponse>(`/api/payment/stats`);
  }

  // REPORTS & ANALYTICS ENDPOINTS
  async getReportTotalRevenue(): Promise<{ success: boolean; data: number }> {
    return this.request<{ success: boolean; data: number }>(`/api/reports/total-revenue`);
  }

  async getReportTotalCustomers(): Promise<{ success: boolean; data: number }> {
    return this.request<{ success: boolean; data: number }>(`/api/reports/total-customers`);
  }

  async getReportOutstandingAmount(): Promise<{ success: boolean; data: number }> {
    return this.request<{ success: boolean; data: number }>(`/api/reports/outstanding-amount`);
  }

  async getReportTopClients(top: number = 5): Promise<{ success: boolean; data: Array<{ customerId: number; customerName: string; invoiceCount: number; totalRevenue: number; averageInvoice: number; revenueGrowthPercent: number }> }> {
    return this.request<{ success: boolean; data: Array<{ customerId: number; customerName: string; invoiceCount: number; totalRevenue: number; averageInvoice: number; revenueGrowthPercent: number }> }>(`/api/reports/top-clients?top=${top}`);
  }

  async getReportInvoiceStatusDistribution(): Promise<{ success: boolean; data: Array<{ status: string; count: number; totalAmount: number; percentage: number }> }> {
    return this.request<{ success: boolean; data: Array<{ status: string; count: number; totalAmount: number; percentage: number }> }>(`/api/reports/invoice-status-distribution`);
  }

  async getReportInvoiceVolumeTrend(months: number = 6): Promise<{ success: boolean; data: Array<{ month: string; invoiceCount: number }> }> {
    return this.request<{ success: boolean; data: Array<{ month: string; invoiceCount: number }> }>(`/api/reports/invoice-volume-trend?months=${months}`);
  }

  async getReportMonthlyRevenueTrend(months: number = 6): Promise<{ success: boolean; data: Array<{ month: string; revenue: number }> }> {
    return this.request<{ success: boolean; data: Array<{ month: string; revenue: number }> }>(`/api/reports/monthly-revenue-trend?months=${months}`);
  }

  async getReportTotalInvoices(): Promise<{ success: boolean; data: number }> {
    return this.request<{ success: boolean; data: number }>(`/api/reports/total-invoices`);
  }
}

export const apiService = new ApiService(API_BASE_URL); 