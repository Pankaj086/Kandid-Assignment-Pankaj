import { create } from 'zustand'

interface LeadSidebarState {
  isOpen: boolean
  selectedLeadId: number | null
  openSidebar: (leadId: number) => void
  closeSidebar: () => void
}

export const useLeadSidebarStore = create<LeadSidebarState>((set) => ({
  isOpen: false,
  selectedLeadId: null,
  openSidebar: (leadId: number) => set({ isOpen: true, selectedLeadId: leadId }),
  closeSidebar: () => set({ isOpen: false, selectedLeadId: null }),
}))
