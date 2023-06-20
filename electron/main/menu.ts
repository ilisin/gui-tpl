import type { MenuItem } from 'electron'
import { Menu, shell } from 'electron'

const template: Array<MenuItem> = [
  {
    label: 'Window',
    submenu: [
      {
        label: 'Theme',
        submenu: [
          {
            label: 'Dark',

            click: () => {
              console.log('Dark')
            },
            checked: true,
          },
          {
            label: 'Light',

            click: () => {
              console.log('light')
            },
            checked: false,
          },
        ],
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://electronjs.org')
        },
      },
    ],
  },
]

export default () => {
  if (process.platform !== 'darwin')
    return
  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
}
