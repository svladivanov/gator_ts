import { Config, readConfig, setUser } from './config.js'

function main() {
  let config: Config = readConfig()
  const user = 'Vlad'

  setUser(user)
  config = readConfig()
  console.log(config)
}

main()
