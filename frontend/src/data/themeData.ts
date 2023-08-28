enum ThemeType {
  Light = 'light',
  Dark = 'dark'
}

interface ITheme {
  name: string;
  path: string;
}

export interface IThemeGroup {
  type: ThemeType;
  themes: ITheme[];
}

export const themes: IThemeGroup[] = [
  {
    type: ThemeType.Light,
    themes: [
      {
        name: 'Lara light',
        path: '/static/themes/lara-light.css'
      },
      {
        name: 'Bootstrap light',
        path: '/static/themes/bootstrap-light.css'
      },
      {
        name: 'Material light',
        path: '/static/themes/mat-light.css'
      },
      {
        name: 'Nano',
        path: '/static/themes/nano.css'
      }
    ]
  },
  {
    type: ThemeType.Dark,
    themes: [
      {
        name: 'Bootstrap dark',
        path: '/static/themes/bootstrap-dark.css'
      },
      {
        name: 'Material dark',
        path: '/static/themes/mat-dark.css'
      },
      {
        name: 'Viva dark',
        path: '/static/themes/viva-dark.css'
      },
      {
        name: 'Soho dark',
        path: '/static/themes/soho-dark.css'
      }
    ]
  }
];

const getTheme = (themeName: string) => {
  for (const themeGroup of themes) {
    for (const theme of themeGroup.themes) {
      if (theme.name === themeName) {
        return theme;
      }
    }
  }
}

export default themes;
export { getTheme };