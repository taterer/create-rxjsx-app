export enum Route {
  home = 'home',
  memory = 'memory',
  todo = 'todo',
}

export const routePathMap: { [key in Route]: string } = {
  home: '',
  memory: 'memory',
  todo: 'todo',
}

export const routeRegExpMap: { [key in Route]: RegExp } = {
  home: /^$/,
  memory: /^memory$/,
  todo: /^todo$/,
}
