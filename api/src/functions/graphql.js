// api/src/functions/graphql.js
import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

export const handler = createGraphQLHandler({
  loggerConfig: { logger },
  directives,
  sdls,
  services,
})
