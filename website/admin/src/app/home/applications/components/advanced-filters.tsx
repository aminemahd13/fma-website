/**
 * Advanced Filters for Admin Document Verification System
 * 
 * This file contains filters to help admins efficiently manage and verify documents.
 * Key improvements:
 * - Image rights documents are no longer required for completion
 * - New filters for rejected documents to identify resubmission needs
 * - Comprehensive status tracking for better verification workflow
 * - Category-based organization for easier navigation
 */

export const advancedFilters = [
  {
    value: "ACCEPTED_NO_DOCUMENTS",
    label: "Accepted/Waitlisted without Documents",
    category: "Registration Status",
    description: "Accepted or waitlisted users who haven't submitted any final registration documents"
  },
  {
    value: "DOCUMENTS_PENDING_VALIDATION",
    label: "Documents Pending Validation",
    category: "Registration Status",
    description: "Accepted or waitlisted users with submitted documents waiting for validation"
  },
  {
    value: "DOCUMENTS_REJECTED",
    label: "Documents Rejected",
    category: "Registration Status",
    description: "Accepted or waitlisted users with rejected documents that need resubmission"
  },
  {
    value: "DOCUMENTS_FULLY_VALIDATED",
    label: "Documents Fully Validated",
    category: "Registration Status",
    description: "Accepted or waitlisted users with all required documents validated"
  },
  {
    value: "HIGH_PRIORITY",
    label: "High Priority Applications",
    category: "Priority Management",
    description: "Accepted or waitlisted applications requiring immediate attention"
  },
  {
    value: "CRITICAL_PRIORITY",
    label: "Critical Priority",
    category: "Priority Management", 
    description: "Accepted or waitlisted applications with critical issues needing urgent action"
  },
  {
    value: "STALE_APPLICATIONS",
    label: "Stale Applications",
    category: "Activity Tracking",
    description: "Accepted or waitlisted applications with no activity for more than 14 days"
  },
  {
    value: "RECENT_ACTIVITY",
    label: "Recent Activity",
    category: "Activity Tracking",
    description: "Accepted or waitlisted applications with activity in the last 3 days"
  },
  {
    value: "LOW_DOCUMENT_PROGRESS",
    label: "Low Document Progress",
    category: "Progress Tracking",
    description: "Accepted or waitlisted applications with less than 50% document completion"
  },
  {
    value: "MULTIPLE_REJECTIONS",
    label: "Multiple Rejections",
    category: "Quality Issues",
    description: "Accepted or waitlisted applications with 2 or more rejected documents"
  },
  {
    value: "MISSING_PARENT_ID",
    label: "Missing Parent ID",
    category: "Missing Documents",
    description: "Accepted or waitlisted users missing parent ID"
  },
  {
    value: "MISSING_BIRTH_CERTIFICATE",
    label: "Missing Birth Certificate",
    category: "Missing Documents",
    description: "Accepted or waitlisted users missing birth certificate"
  },
  {
    value: "MISSING_REGULATIONS",
    label: "Missing Regulations",
    category: "Missing Documents",
    description: "Accepted or waitlisted users missing regulations document"
  },
  {
    value: "MISSING_PARENTAL_AUTH",
    label: "Missing Parental Authorization",
    category: "Missing Documents",
    description: "Accepted or waitlisted users missing parental authorization"
  },
  {
    value: "REJECTED_PARENT_ID",
    label: "Rejected Parent ID",
    category: "Rejected Documents",
    description: "Accepted or waitlisted users with rejected parent ID documents"
  },
  {
    value: "REJECTED_BIRTH_CERTIFICATE",
    label: "Rejected Birth Certificate",
    category: "Rejected Documents",
    description: "Accepted or waitlisted users with rejected birth certificate"
  },
  {
    value: "REJECTED_REGULATIONS",
    label: "Rejected Regulations",
    category: "Rejected Documents",
    description: "Accepted or waitlisted users with rejected regulations document"
  },
  {
    value: "REJECTED_PARENTAL_AUTH",
    label: "Rejected Parental Authorization",
    category: "Rejected Documents",
    description: "Accepted or waitlisted users with rejected parental authorization"
  },
  {
    value: "MISSING_REPORT",
    label: "Missing Report",
    category: "Missing Documents",
    description: "Accepted or waitlisted users missing report submission"
  }
]