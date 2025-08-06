import { defineStore } from "pinia";
import type {
  CallType,
  CallSubtype,
  ComplaintStatus,
  ComplaintCategory,
  ComplaintSubcategory,
  Organization,
  ReferencesState,
} from "../interfaces/references/responseDto";

export const useReferencesStore = defineStore("references", {
  state: (): ReferencesState => ({
    callTypes: [],
    callSubtypes: [],
    complaintStatuses: [],
    complaintCategories: [],
    complaintSubcategories: [],
    organizations: [],
    loading: false,
    error: null,
  }),

  getters: {},

  actions: {
    setCallTypes(data: CallType[]) {
      this.callTypes = data;
    },
    setCallSubtypes(data: CallSubtype[]) {
      this.callSubtypes = data;
    },
    setComplaintStatuses(data: ComplaintStatus[]) {
      this.complaintStatuses = data;
    },
    setComplaintCategories(data: ComplaintCategory[]) {
      this.complaintCategories = data;
    },
    setComplaintSubcategories(data: ComplaintSubcategory[]) {
      this.complaintSubcategories = data;
    },
    setOrganizations(data: Organization[]) {
      this.organizations = data;
    },
  },
});

// Экспорт типов для использования в компонентах
export type {};
