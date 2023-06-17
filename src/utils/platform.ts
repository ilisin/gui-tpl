const platform = process.platform
const isWindows = platform === 'win32'
const isMac = platform === 'darwin'

export default {
  isWindows,
  isMac,
}
