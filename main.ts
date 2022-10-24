import * as fs from 'fs'
import * as ping from 'ping'
import { getDefaultGateway } from './lib/get_default_gateway'
import { spin } from './lib/spin'

const filename = new Date().toISOString().split('.')[0]
const stream = fs.createWriteStream(`out/${filename}.csv`)

// Ctrl + Cを検知した場合安全にストリームを閉じる
process.on('SIGINT', () => {
  stream.end()
  process.exit()
})

const HOSTS = {
  DEFAULT_GATEWAY: getDefaultGateway(),
  GOOGLE_PUBLIC_DNS: '8.8.8.8',
  // TODO: GCP, AWS
}

// CSVのヘッダを書き込み
stream.write(['UNIXTIME', ...Object.keys(HOSTS).map((hostname) => `${hostname}_RTT`)].join(','))
stream.write('\n')

async function collection() {
  // UNIX秒を取得
  const t = Math.floor(Date.now() / 1000)

  // 各ホストへのpingを非同期で実行し、その結果をPromise.all()で集計
  // NOTE: 非同期実行・非同期書き込みなので、出力されるCSVは必ずしも時系列順になっていない。TIMESTAMPを利用してソートする必要がある。
  const results = await Promise.all(
    Object.values(HOSTS).map(host => ping.promise.probe(host))
  )

  // 結果を書き込み
  stream.write([t, ...results.map(result => {
    const rt = result.time
    return rt === 'unknown' ? -1 : rt
  })].join(','))
  stream.write('\n')
}

// 収集プロセスを1秒に1回走らせる
setInterval(collection, 1000)

setInterval(spin, 200)
