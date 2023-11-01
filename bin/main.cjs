#!/usr/bin/env node

const { execSync } = require('node:child_process')

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.log('failed to execute' + command, error)
    return false
  }
  return true
}

const repoName = process.argv[2]
const runPackage = process.argv[3]

console.log(`
   __    __      _____     ____        ______      ____      _____   _____        _____   ______     _____    _____         ____     ________    _____ 
   \ \  / /     / ____\   (    )      (_   _ \    / __ \    (_   _) (_   _)      / ___/  (   __ \   (  __ \  (_   _)       (    )   (___  ___)  / ___/ 
   () \/ ()    ( (___     / /\ \        ) (_) )  / /  \ \     | |     | |       ( (__     ) (__) )   ) )_) )   | |         / /\ \       ) )    ( (__   
   / _  _ \     \___ \   ( (__) )       \   _/  ( ()  () )    | |     | |        ) __)   (    __/   (  ___/    | |        ( (__) )     ( (      ) __)  
  / / \/ \ \        ) )   )    (        /  _ \  ( ()  () )    | |     | |   __  ( (       ) \ \  _   ) )       | |   __    )    (       ) )    ( (     
 /_/      \_\   ___/ /   /  /\  \      _) (_) )  \ \__/ /    _| |__ __| |___) )  \ \___  ( ( \ \_)) ( (      __| |___) )  /  /\  \     ( (      \ \___ 
(/          \) /____/   /__(  )__\    (______/    \____/    /_____( \________/    \____\  )_) \__/  /__\     \________/  /__(  )__\    /__\      \____\
`)

const gitCheckOutCommand = `git clone https://github.com/hendras1722/nuxt3-with-nuxtui ${repoName}`
const DepsCommand = `cd ${repoName} && npm install`
const runProject = 'cd ' + repoName + ' && npm run dev'

console.log('Cloning the repository with name ' + repoName)

const gitCheckOutCommandResult = runCommand(gitCheckOutCommand)
if (!gitCheckOutCommand) {
  process.exit(0)
  return
}

const installDepsCommand = runCommand(DepsCommand)
if (!installDepsCommand) {
  process.exit(0)
  return
}

if (runPackage === '--run') {
  const runProjectCommand = runCommand(runProject)
  if (!runProjectCommand) {
    process.exit(0)
    return
  }
} else {
  console.log(
    '%cCongratulations, the repository has been cloned',
    'color:green'
  )
  console.log('cd ' + repoName + ' && npm run dev')
}