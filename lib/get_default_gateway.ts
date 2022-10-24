import { execSync } from 'child_process'

export function getDefaultGateway(): string {
  switch (process.platform) {
    case 'win32':
      return execSync('pwsh -Command (Get-NetRoute "0.0.0.0/0").NextHop').toString()
    case 'darwin':
      return execSync('netstat -rn | grep default').toString().split(/\s/)[1]
    case 'linux':
      const match = (/default via ([\d\.]+)/).exec(execSync('ip route').toString())
      return match ? match[1] : ''
    default:
      return '127.0.0.1'
  }
}