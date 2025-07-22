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
      name: $t("l_Users"),
      icon: "group",
      routerPath: "/user/all",
      expand: false,
      children: [],
    },
    {
      name: $t("l_Clients"),
      icon: "supervisor_account",
      routerPath: "/clients",
      expand: false,
      children: [],
    },
    {
      name: $t("l_Settings"),
      icon: "settings",
      routerPath: "/settings",
      expand: false,
      children: [
        {
          name: $t("l_Profile"),
          icon: "",
          routerPath: "/settings/profile",
          expand: false,
          children: [],
        },
      ],
    },
  ]
}
