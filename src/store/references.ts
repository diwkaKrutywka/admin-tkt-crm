import { defineStore } from "pinia";
import type {
  CallType,
  CallSubtype,
  ComplaintStatus,
  ComplaintCategory,
  ComplaintSubcategory,
  Organization,
  callTypeNames,
  complaintCategoryNames,
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
    callTypeNames: [],
    complaintCategoryNames: [],
    loading: false,
    error: null,
  }),

  getters: {},

  actions: {
    setCallTypes(data: CallType[]) {
      this.callTypes = data;
      this.callTypeNames = data.map((item: callTypeNames) => {
        return { name: item.name, id: item.id };
      });
    },
    setCallSubtypes(data: CallSubtype[]) {
      this.callSubtypes = data;
    },
    setComplaintStatuses(data: ComplaintStatus[]) {
      this.complaintStatuses = data;
    },
    setComplaintCategories(data: ComplaintCategory[]) {
      this.complaintCategories = data;
      this.complaintCategoryNames = data.map((item: complaintCategoryNames) => {
        return { name: item.name, id: item.id };
      });
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
