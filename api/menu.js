import http from '@/libs/http.request'

export const getTableMenuList = () => {
  return http.get('menu/listAll')
}
