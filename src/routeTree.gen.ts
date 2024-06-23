/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutEncryptIndexImport } from './routes/_layout/encrypt/index'
import { Route as LayoutDecryptIndexImport } from './routes/_layout/decrypt/index'
import { Route as LayoutConfigurationIndexImport } from './routes/_layout/configuration/index'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutEncryptIndexRoute = LayoutEncryptIndexImport.update({
  path: '/encrypt/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutDecryptIndexRoute = LayoutDecryptIndexImport.update({
  path: '/decrypt/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutConfigurationIndexRoute = LayoutConfigurationIndexImport.update({
  path: '/configuration/',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/configuration/': {
      id: '/_layout/configuration/'
      path: '/configuration'
      fullPath: '/configuration'
      preLoaderRoute: typeof LayoutConfigurationIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/decrypt/': {
      id: '/_layout/decrypt/'
      path: '/decrypt'
      fullPath: '/decrypt'
      preLoaderRoute: typeof LayoutDecryptIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/encrypt/': {
      id: '/_layout/encrypt/'
      path: '/encrypt'
      fullPath: '/encrypt'
      preLoaderRoute: typeof LayoutEncryptIndexImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  LayoutRoute: LayoutRoute.addChildren({
    LayoutIndexRoute,
    LayoutConfigurationIndexRoute,
    LayoutDecryptIndexRoute,
    LayoutEncryptIndexRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/",
        "/_layout/configuration/",
        "/_layout/decrypt/",
        "/_layout/encrypt/"
      ]
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/configuration/": {
      "filePath": "_layout/configuration/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/decrypt/": {
      "filePath": "_layout/decrypt/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/encrypt/": {
      "filePath": "_layout/encrypt/index.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
