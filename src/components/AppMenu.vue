<script lang="ts" setup>
import { useConfigStore } from '@/store/config'

const config = useConfigStore()

interface MenuItem {
  id?: string
  label?: string
  accelerator?: string
  click?: (label: string | undefined) => void
  checked?: boolean
  submenu?: MenuItem[]
}

const menus: [MenuItem] = [
  {
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

const nav = ref(null)
const menuActive = ref(false)
const selected = ref<MenuItem | null>(null)
const hovered = ref<MenuItem | null>(null)
const hoveredParent = ref<MenuItem | null>(null)

const setSelected = (menu: MenuItem) => {
  console.log('setSelected', menu)
  selected.value = menu
}

const unselect = (menu: MenuItem) => {
  console.log('unselect', menu, selected.value, menuActive.value)
  if (!menuActive.value && selected.value === menu) {
    console.log('unselect')
    selected.value = null
  }
}

const setHover = (item: MenuItem, parent: MenuItem | null = null) => {
  hovered.value = item
  hoveredParent.value = parent
  console.log('setHover', item, parent)
}

const setActive = (item: MenuItem) => {
  console.log('setActive', item)
  menuActive.value = !menuActive.value
  setSelected(item)
  setHover(item)
}

// const hoverClass = computed(() => (item: MenuItem) => {
//   return {
//     hovered: [hovered.value, hoveredParent.value].includes(item),
//   }
// })

const hoverClass = (item: MenuItem) => {
  const result = [hovered.value?.label, hoveredParent.value?.label].includes(item.label)

  console.log('hoverClass', hovered.value, hoveredParent.value, item, result)

  return {
    hovered: [hovered.value?.label, hoveredParent.value?.label].includes(item.label),
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
        :class="{ selected: menu === selected }"
        @mouseover.prevent="setSelected(menu)"
        @dblclick.stop="noop"
        @mouseleave.prevent="unselect(menu)"
      >
        <a
          :class="{ selected: menu === selected }"
          @mousedown.prevent="setActive(menu)"
        ><span class="label">{{ menu.label }}</span></a>
        <!-- FIRST LEVEL MENU, eg New Window, New Tab -->
        <ul>
          <li
            v-for="(item, idx) in menu.submenu"
            :key="item.id || idx"
            class="menu-item"
            :class="{ 'has-children': !!item.submenu, ...hoverClass(item) }"
          >
            <!--
              <li
              v-for="(item, idx) in menu.submenu"
              :key="item.id || idx"
              class="menu-item hovered"
              :class="{ 'has-children': !!item.submenu }"
              >
            -->
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
                :key="subitem.label"
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
