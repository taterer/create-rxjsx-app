export enum Route {
  home = 'home',
  rxjsx = 'rxjsx',
}

export const routePathMap: { [key in Route]: string } = {
  home: '',
  rxjsx: 'rxjsx'
}

export const routeRegExpMap: { [key in Route]: RegExp } = {
  home: /^$/,
  rxjsx: /^rxjsx$/,
}
