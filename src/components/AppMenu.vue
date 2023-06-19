<script lang="ts" setup>
import { useConfigStore } from '@/store/config'

const config = useConfigStore()

interface MenuItem {
  id: string
  label?: string
  accelerator?: string
  click?: (label: string | undefined) => void
  checked?: boolean
  submenu?: MenuItem[]
}

const menus: [MenuItem] = [
  {
    id: 'top-file',
    label: 'File',
    submenu: [
      {
        id: 'new-window',
        label: 'New Window',
        accelerator: 'CommandOrControl+Shift+N',
        click: () => {
          console.log('new-window')
        },
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
    id: 'top-edit',
    label: 'Edit',
    submenu: [
      {
        id: 'edit-undo',
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        click: () => {
          console.log('edit-undo')
        },
      },
      {
        id: 'edit-redo',
        label: 'Redo',
        accelerator: 'CommandOrControl+Y',
        click: () => {
          console.log('edit-redo')
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
  if (menuActive.value) {
    const target = e.target
    if (!menuElements.value.includes(target as HTMLElement)) {
      menuActive.value = false
      console.log('out')
    }
    else {
      console.log('in')
    }
  }
}

onMounted(() => {
  document.addEventListener('click', maybeHideMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', maybeHideMenu)
})

const keys = useMagicKeys()
const shiftCtrlA = keys['Shift+Ctrl+A']
const osLeftA = keys['Command+K']

watch(shiftCtrlA, v => {
  console.log(v)
  if (v)
    console.log('Shift + Ctrl + A have been pressed')
})

watch(osLeftA, v => {
  console.log(v)
  if (v)
    console.log('OSLeft + K have been pressed')
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
              <span class="shortcut">{{ shortcutText(item) }}</span>
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
                    <span
                      v-if="subitem.checked"
                      class="material-icons"
                    >done</span>
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
