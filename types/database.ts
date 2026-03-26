export type ContentStatus = 'draft' | 'review' | 'published' | 'archived'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship'
export type PriceCategory = 'groceries' | 'fuel' | 'medical' | 'dining'
export type SubmissionStatus = 'new' | 'in_review' | 'approved' | 'rejected'
export type AdminRole = 'super_admin' | 'editor' | 'data_entry' | 'support'
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'
export type ModerationStatus = 'pending' | 'approved' | 'rejected'
export type MessageStatus = 'new' | 'read' | 'replied' | 'responded' | 'closed'

// ─── Reference tables ────────────────────────────────────────────────────────

export interface Area {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  description: string | null
  cover_image_path: string | null
  sort_order: number
  status: ContentStatus
  subcategories?: Subcategory[]
  business_count?: number
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  sort_order: number
  status: ContentStatus
  category?: Category
}

export interface Tag {
  id: string
  name: string
  slug: string
  tag_type: string | null
}

export interface JournalSection {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  sort_order: number
  status: ContentStatus
}

// ─── Directory tables ─────────────────────────────────────────────────────────

export interface Business {
  id: string
  name: string
  slug: string
  category_id: string | null
  subcategory_id: string | null
  area_id: string | null
  address_line: string | null
  road_street: string | null
  building_name: string | null
  door_number: string | null
  contact_name: string | null
  short_description: string | null
  description: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  google_maps_url: string | null
  latitude: number | null
  longitude: number | null
  opening_hours_text: string | null
  price_range: PriceRange | null
  google_rating: number | null
  google_review_count: number | null
  featured: boolean
  verified: boolean
  is_sponsor: boolean
  status: ContentStatus
  verification_status: VerificationStatus
  source_url: string | null
  source_note: string | null
  last_verified_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  // Joined fields
  category?: Category
  subcategory?: Subcategory
  area?: Area
  images?: BusinessImage[]
  hours?: BusinessHour[]
  tags?: Tag[]
  reviews?: Review[]
}

export interface BusinessImage {
  id: string
  business_id: string
  image_path: string
  alt_text: string | null
  caption: string | null
  is_cover: boolean
  sort_order: number
}

export interface BusinessHour {
  id: string
  business_id: string
  day_of_week: number  // 0=Sunday, 6=Saturday
  opens_at: string | null  // HH:MM
  closes_at: string | null
  is_closed: boolean
}

export interface BusinessTag {
  business_id: string
  tag_id: string
}

// ─── Editorial tables ─────────────────────────────────────────────────────────

export interface Article {
  id: string
  section_id: string | null
  title: string
  slug: string
  excerpt: string | null
  body_json: Record<string, unknown> | null
  cover_image_path: string | null
  author_name: string | null
  read_time_minutes: number | null
  featured: boolean
  status: ContentStatus
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  // Joined
  section?: JournalSection
  tags?: Tag[]
  comments?: ArticleComment[]
}

export interface ArticleComment {
  id: string
  article_id: string
  commenter_name: string
  comment: string
  status: ModerationStatus
  created_at: string
}

// ─── Community / moderation tables ───────────────────────────────────────────

export interface Review {
  id: string
  business_id: string
  reviewer_name: string
  rating: number
  comment: string | null
  status: ModerationStatus
  created_at: string
}

export interface AdSlot {
  id: string
  page: string
  tier: 'primary' | 'secondary' | 'tertiary'
  position: number
  advertiser_id: string | null
  ad_title: string | null
  ad_image_path: string | null
  ad_link_url: string | null
  active: boolean
  created_at: string
  advertiser?: Business
}

export interface AdInquiry {
  id: string
  business_name: string
  contact_person: string
  phone: string
  email: string
  message: string | null
  status: 'new' | 'read' | 'replied' | 'closed'
  created_at: string
}

export interface Feedback {
  id: string
  name: string | null
  email: string | null
  message: string
  status: 'new' | 'read' | 'noted'
  created_at: string
}

export interface TalentInquiry {
  id: string
  company_name: string
  role_needed: string
  description: string | null
  contact_name: string
  phone: string
  email: string
  status: 'new' | 'read' | 'replied' | 'closed'
  created_at: string
}

export interface PriceSubmission {
  id: string
  store_name: string
  item_name: string
  price: number
  unit: string | null
  category: string | null
  observed_at: string
  submitted_by_email: string | null
  status: ModerationStatus
  created_at: string
}

// ─── Utility tables ───────────────────────────────────────────────────────────

export interface JobListing {
  id: string
  title: string
  company: string | null
  area_id: string | null
  location_text: string | null
  job_type: JobType | null
  description: string | null
  salary_text: string | null
  deadline: string | null
  contact_email: string | null
  contact_phone: string | null
  status: ContentStatus
  published_at: string | null
  created_at: string
  area?: Area
}

export interface PriceItem {
  id: string
  name: string
  slug: string
  category: PriceCategory | null
  unit: string | null
  status: ContentStatus
  entries?: PriceEntry[]
}

export interface PriceEntry {
  id: string
  price_item_id: string
  business_id: string | null
  store_name_snapshot: string
  amount: number
  currency: string
  observed_at: string
  source_note: string | null
  status: ContentStatus
  business?: Business
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed'
  subscribed_at: string
}

export interface BusinessSubmission {
  id: string
  business_name: string
  category_name: string | null
  subcategory_name: string | null
  location_text: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  description: string | null
  opening_hours_text: string | null
  price_range: string | null
  source_note: string | null
  status: SubmissionStatus
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export interface TravelInquiry {
  id: string
  name: string
  email: string
  phone: string | null
  travel_type: string | null
  travel_dates: string | null
  people_count: number | null
  budget_range: string | null
  message: string | null
  status: MessageStatus
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: MessageStatus
  created_at: string
}

// ─── Admin / platform ─────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string | null
  avatar_path: string | null
  created_at: string
  updated_at: string
}

export interface AdminRoleRecord {
  user_id: string
  role: AdminRole
}

export interface AuditLog {
  id: string
  actor_user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  summary: string | null
  created_at: string
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export interface BusinessFilters {
  category?: string
  subcategory?: string
  area?: string
  search?: string
  price_range?: PriceRange[]
  min_rating?: number
  featured?: boolean
  verified?: boolean
  status?: ContentStatus
  page?: number
  per_page?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}
