import i18n from "../locales"

export interface MenuItem {
  name: string
  icon: string
  routerPath: string
  expand: boolean
  openForUsers?: string[]
  children: MenuItem[]
}

export function getMenuList(): MenuItem[] {
  const $t = i18n.global.t

  return [
   
    {
      name: $t("l_Main_page"),
      icon: "dashboard",
      routerPath: "/main",
      expand: false,
      children: [],
    },
    {
      name: $t("l_Appeals"),
      icon: "assignment",
      routerPath: "/appeals",
      expand: false,
      children: [],
    },
    {
      name: $t("l_Users"),
      icon: "people",
      routerPath: "/user/all",
      expand: false,
      children: [],
    },
    {
      name: $t("l_Contacts"),
      icon: "assignment_ind",
      routerPath: "/contacts",
      expand: false,
      children: [],
    },
    {
      name: $t("l_Settings"),
      icon: "settings",
      routerPath: "/settings",
      expand: false,
      children: [],
    },
  ]
}
