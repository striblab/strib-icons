#!/usr/bin/env node

/*!
 * Script to update version number references in the project.
 * Copyright 2024 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/icons/blob/main/LICENSE)
 */
import fs from 'node:fs/promises'

// These are the files we only care about replacing the version
const FILES = [
  'build/font/css.hbs',
  'build/font/scss.hbs',
  'config/_default/hugo.yml'
]

// Blame TC39... https://github.com/benjamingr/RegExp.escape/issues/37
function regExpQuote(string) {
  return string.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&')
}

function regExpQuoteReplacement(string) {
  return string.replace(/\$/g, '$$')
}

async function replaceRecursively(file, oldVersion, newVersion) {
  const originalString = await fs.readFile(file, 'utf8')
  const newString = originalString.replace(
    new RegExp(regExpQuote(oldVersion), 'g'),
    regExpQuoteReplacement(newVersion)
  )

  // No need to move any further if the strings are identical
  if (originalString === newString) {
    return
  }

  console.log(`Found ${oldVersion} in ${file}`)

  await fs.writeFile(file, newString, 'utf8')
}

function showUsage(args) {
  console.error('Command expects two options, the current version number and the new version number')
  console.error('USAGE:   release-version current_version new_version')
  console.error('EXAMPLE: release-version 1.0 2.0')
  console.error('Argument received:', args)
  process.exit(1)
}

async function main(args) {
  let [oldVersion, newVersion] = args

  if (!oldVersion || !newVersion) {
    showUsage(args)
  }

  // Strip any leading `v` from arguments because
  // otherwise we will end up with duplicate `v`s
  [oldVersion, newVersion] = [oldVersion, newVersion].map(arg => {
    return arg.startsWith('v') ? arg.slice(1) : arg
  })

  if (oldVersion === newVersion) {
    showUsage(args)
  }

  try {
    await Promise.all(FILES.map(file => replaceRecursively(file, oldVersion, newVersion)))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main(process.argv.slice(2))
