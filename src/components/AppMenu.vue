<script lang="ts" setup>
import { useConfigStore } from '@/store/config'

const { ipcRenderer } = window.require('electron')

const config = useConfigStore()

interface MenuItem {
  id: string
  label?: string
  accelerator?: string
  click?: (label: string | undefined) => void

  // checked?: ComputedRef<boolean>
  checked?: () => boolean
  submenu?: Array<MenuItem>
}

const isDark = useDark()
const toggleDark = useToggle(isDark)

const menus: Array<MenuItem> = [
  {
    id: 'top-window',
    label: 'Window',
    submenu: [
      {
        id: 'window-theme',
        label: 'Theme',
        submenu: [
          {
            id: 'window-theme-dark',
            label: 'Dark',
            click: () => {
              console.log('window-theme-dark')
              if (!isDark.value)
                toggleDark()
            },

            // checked: computed(() => isDark.value),
            checked: () => isDark.value,
          },
          {
            id: 'window-theme-light',
            label: 'Light',
            click: () => {
              console.log('window-theme-light')
              if (isDark.value)
                toggleDark()
            },

            // checked: !isDark.value,
            // checked: computed(() => !isDark.value),
            checked: () => !isDark.value,
          },
        ],
      },
      {
        id: 'reload-window',
        label: 'Reload Window',
        accelerator: 'CommandOrControl+R',
        click: () => {
          console.log('reload-window')
        },
      },
    ],
  },
  {
    id: 'top-view',
    label: 'View',
    submenu: [
      {
        id: 'view-fullscreen',
        label: 'Toggle Full Screen',
        accelerator: config.isMac ? 'Shift+CommandOrControl+F' : 'F11',
        click: () => {
          ipcRenderer.send('win-control', 'fullscreen')
        },
      },
      {
        id: 'view-devtools',
        label: 'Show Developer Tools',
        accelerator: 'CommandOrControl+Shift+I',
        click: () => {
          ipcRenderer.send('win-control', 'devtools')
        },
      },
    ],
  },
]

const nav = ref<InstanceType<typeof HTMLElement> | null>(null)
const menuActive = ref(false)
const selected = ref<MenuItem | null>(null)
const hovered = ref<MenuItem | null>(null)
const hoveredParent = ref<MenuItem | null>(null)

const setSelected = (menu: MenuItem) => {
  console.log('setSelected', menu)
  selected.value = menu
}

const unselect = (menu: MenuItem) => {
  if (!menuActive.value && selected.value?.id === menu.id)
    selected.value = null
}

const setHover = (item: MenuItem, parent: MenuItem | null = null) => {
  hovered.value = item
  hoveredParent.value = parent
}

const setActive = (item: MenuItem) => {
  menuActive.value = !menuActive.value
  selected.value = item
}

const hoverClass = (item: MenuItem) => {
  return {
    hovered: hovered.value?.id === item.id || hoveredParent.value?.id === item.id,
  }
}

const handle = (item: MenuItem) => {
  if (item.click && !item.submenu) {
    item.click(item.label)
    menuActive.value = false
  }
}

const shortcutText = (item: MenuItem) => {
  if (!item.accelerator)
    return ''
  const meta = config.isMac ? '⌘' : 'Ctrl'

  return item.accelerator.replace('CommandOrControl', meta)

  // if (item.accelerator) {
  //   const acc = item.accelerator
  //     .replace('CmdOrCtrl', '⌘')
  //     .replace('Alt', '⌥')
  //     .replace('Shift', '⇧')
  //     .replace('Plus', '+')
  //     .replace('Minus', '-')
  //     .replace('Right', '→')
  //     .replace('Left', '←')
  //     .replace('Up', '↑')
  //     .replace('Down', '↓')
  //   return acc
  // }
  // return ''
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { }

const menuElements = computed(() => {
  // const els = nav.value?.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>
  if (nav.value)
    return Array.from(nav.value.getElementsByTagName('*'))

  return []
})

const maybeHideMenu = (e: MouseEvent) => {
  if (!menuActive.value)
    return
  const target = e.target
  if (!menuElements.value.includes(target as HTMLElement)) {
    menuActive.value = false
    console.log('out')
  }
  else {
    console.log('in')
  }
}

const getPrevious = (array: Array<MenuItem>, item: MenuItem): MenuItem => {
  const index = array.findIndex(i => i.id === item.id)
  const newIndex = index <= 0 ? array.length - 1 : index - 1

  return array[newIndex]
}

const getNext = (array: Array<MenuItem>, item: MenuItem): MenuItem => {
  const index = array.findIndex(i => i.id === item.id)
  const newIndex = index >= array.length - 1 ? 0 : index + 1

  return array[newIndex]
}

const navigationKeys: Record<string, (e: KeyboardEvent) => void> = {
  ArrowUp: (e: KeyboardEvent) => {
    if (!menuActive.value && !selected.value)
      return
    e.preventDefault()

    const _selected = hoveredParent.value || selected.value
    if (!_selected || !hovered.value)
      return
    hovered.value = getPrevious(_selected.submenu || [], hovered.value)
  },
  ArrowDown: (e: KeyboardEvent) => {
    if (!menuActive.value && !selected.value)
      return
    e.preventDefault()

    const _selected = hoveredParent.value || selected.value
    if (!_selected || !hovered.value)
      return
    hovered.value = getNext(_selected.submenu || [], hovered.value)
  },
  ArrowLeft: (e: KeyboardEvent) => {
    if (!selected.value)
      return
    e.preventDefault()
    if (!hovered.value || !hoveredParent.value) {
      selected.value = getPrevious(menus, selected.value)

      return
    }
    if (hoveredParent.value)
      setHover(hoveredParent.value)
  },
  ArrowRight: (e: KeyboardEvent) => {
    if (!selected.value)
      return
    e.preventDefault()
    if (!hovered.value || !hovered.value.submenu) {
      selected.value = getNext(menus, selected.value)

      return
    }
    if (hovered.value && hovered.value.submenu)
      setHover(hovered.value.submenu[0], hovered.value)
  },
  Escape: (e: KeyboardEvent) => {
    menuActive.value = false
    e.preventDefault()
  },
  Enter: (_: KeyboardEvent) => {
    if (!hovered.value)
      return
    handle(hovered.value)
  },
}

const maybeCaptureKeydown = (e: KeyboardEvent) => {
  if (!menuActive.value)
    return

  e.preventDefault()

  const handler = navigationKeys[e.key]
  if (handler)
    handler(e)
}

const buildHotKeys = () => {
  const hotkeyHandlers: Record<string, (label: string | undefined) => void> = {}

  const magicKeys = useMagicKeys()

  menus.forEach(menu => {
    if (!menu.submenu)
      return
    menu.submenu.forEach(item => {
      if (!item.accelerator)
        return
      const meta = config.isMac ? 'Command' : 'Ctrl'
      const accelerator = item.accelerator.replace('CommandOrControl', meta)

      hotkeyHandlers[accelerator] = item.click || noop
    })
    for (const key in hotkeyHandlers) {
      const hotkey = magicKeys[key]

      watch(hotkey, v => {
        if (v)
          hotkeyHandlers[key](selected.value?.label)
      })
    }
  })
}

onMounted(() => {
  document.addEventListener('click', maybeHideMenu)
  window.addEventListener('keydown', maybeCaptureKeydown, false)
  buildHotKeys()
})
onUnmounted(() => {
  document.removeEventListener('click', maybeHideMenu)
  window.removeEventListener('keydown', maybeCaptureKeydown, false)
})
</script>

<template>
  <nav
    ref="nav"
    class="flyout-nav"
    :class="{ active: menuActive }"
  >
    <!-- TOP MENU, eg File, Edit -->
    <ul class="menu-bar">
      <li
        v-for="menu in menus"
        :key="menu.label"
        class="top-menu-item"
        :class="{ selected: menu.id === selected?.id }"
        @mouseover.prevent="setSelected(menu)"
        @dblclick.stop="noop"
        @mouseleave.prevent="unselect(menu)"
      >
        <a
          :class="{ selected: menu.id === selected?.id }"
          @mousedown.prevent="setActive(menu)"
        ><span class="label">{{ menu.label }}</span></a>
        <!-- FIRST LEVEL MENU, eg New Window, New Tab -->
        <ul>
          <li
            v-for="item in menu.submenu"
            :key="item.id"
            class="menu-item"
            :class="{ 'has-children': !!item.submenu, ...hoverClass(item) }"
          >
            <a
              :class="hoverClass(item)"
              @mousedown.prevent="noop"
              @mouseup.prevent="handle(item)"
              @mouseover.prevent="setHover(item)"
            >
              <span class="label">{{ item.label }}</span>
              <span
                v-if="!!item.submenu"
                class="shortcut"
              ><i-mdi-chevron-right /></span>
              <span
                v-else
                class="shortcut"
              >{{ shortcutText(item) }}</span>
            </a>
            <!-- Second Level Menu, eg Dark Theme, Light Theme -->
            <ul v-if="item.submenu">
              <li
                v-for="subitem in item.submenu"
                :key="subitem.id"
                class="menu-item"
              >
                <a
                  :class="hoverClass(subitem)"
                  @mouseover.prevent="setHover(subitem, item)"
                  @mousedown.prevent="noop"
                  @mouseup.prevent="handle(subitem)"
                >
                  <span class="label">
                    <i-mdi-check
                      v-if="subitem.checked?.()"
                      class="menu-item-check"
                    />
                    <span>{{ subitem.label }}</span>
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
@use "@styles/app-menu.scss" as *;
</style>
