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

interface LayoutRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutConfigurationIndexRoute: typeof LayoutConfigurationIndexRoute
  LayoutDecryptIndexRoute: typeof LayoutDecryptIndexRoute
  LayoutEncryptIndexRoute: typeof LayoutEncryptIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutConfigurationIndexRoute: LayoutConfigurationIndexRoute,
  LayoutDecryptIndexRoute: LayoutDecryptIndexRoute,
  LayoutEncryptIndexRoute: LayoutEncryptIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/': typeof LayoutIndexRoute
  '/configuration': typeof LayoutConfigurationIndexRoute
  '/decrypt': typeof LayoutDecryptIndexRoute
  '/encrypt': typeof LayoutEncryptIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof LayoutIndexRoute
  '/configuration': typeof LayoutConfigurationIndexRoute
  '/decrypt': typeof LayoutDecryptIndexRoute
  '/encrypt': typeof LayoutEncryptIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/': typeof LayoutIndexRoute
  '/_layout/configuration/': typeof LayoutConfigurationIndexRoute
  '/_layout/decrypt/': typeof LayoutDecryptIndexRoute
  '/_layout/encrypt/': typeof LayoutEncryptIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/' | '/configuration' | '/decrypt' | '/encrypt'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/configuration' | '/decrypt' | '/encrypt'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/'
    | '/_layout/configuration/'
    | '/_layout/decrypt/'
    | '/_layout/encrypt/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

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
