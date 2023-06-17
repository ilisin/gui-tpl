import platform from '@/utils/platform'

interface ConfigState {
  isWindows: boolean
  isMac: boolean
  title: string
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    isWindows: platform.isWindows,
    isMac: platform.isMac,
    title: 'Game Debugger',
  }),

  // getters: {
  //   isWindows: state => state.isWindows,
  //   isMac: state => state.isMac,
  //   title: state => state.title,
  // },
})
