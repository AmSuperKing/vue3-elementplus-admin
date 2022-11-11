import Mock from 'mockjs'
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import type { MockMethod } from 'vite-plugin-mock';

const uuid = Mock.mock({
  id: '@word(30,50)'
})

const apiArr: MockMethod[] = [
  {
    url: '/api/user/login',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = '';
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk;
        });
        req.on('end', () => {
          const body = JSON.parse(reqbody);
          if (body.name === 'admin') {
            reqbody = JSON.stringify({
              code: 200,
              data: {
                userId: uuid.id,
                userName: body.name,
                roles: ['admin'],
                token: `Bearer admin${uuid.id}`
              }
            });
          } else {
            reqbody = JSON.stringify({
              code: 200,
              data: {
                userId: uuid.id,
                userName: body.name,
                roles: ['normal'],
                token: `Bearer noraml${uuid.id}`
              }
            });
          }
          resolve(undefined)
        });
      });
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end(reqbody);
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        message: 'OK',
        data: {
          userName: query.username,
          userNameCn: query.username + '用户'
        },
      }
    },
  },
  {
    url: '/api/user/authMenu',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'OK',
        data: [
          {
            menuId: 'M0001',
            menuName: '系统首页',
            icon: 'HomeFilled',
            menuPath: '/dashboard',
            menuOrder: 1,
            isLeaf: 0,
            menuParentId: 'M0000',
            hasChildren: 0,
            children: []
          },
          {
            menuId: 'M0002',
            menuName: '表单相关',
            icon: 'Document',
            menuPath: '/forms',
            menuOrder: 2,
            isLeaf: 0,
            menuParentId: 'M0000',
            hasChildren: 1,
            children: [
              {
                menuId: 'M000201',
                menuName: '基础表单',
                icon: 'Tickets',
                menuPath: '/forms/basicForm',
                menuOrder: 1,
                isLeaf: 1,
                menuParentId: 'M0002',
                hasChildren: 0,
                children: []
              },
              {
                menuId: 'M000202',
                menuName: '上传组件',
                icon: 'UploadFilled',
                menuPath: '/forms/upload',
                menuOrder: 2,
                isLeaf: 1,
                menuParentId: 'M0002',
                hasChildren: 0,
                children: []
              },
              {
                menuId: 'M000203',
                menuName: '文本编辑器',
                icon: 'Notebook',
                menuPath: '/editor',
                menuOrder: 3,
                isLeaf: 1,
                menuParentId: 'M0002',
                hasChildren: 1,
                children: [
                  {
                    menuId: 'M00020301',
                    menuName: '富文本编辑器',
                    icon: 'Edit',
                    menuPath: '/forms/richTextEditor',
                    menuOrder: 1,
                    isLeaf: 1,
                    menuParentId: 'M000203',
                    hasChildren: 0,
                    children: []
                  },
                  {
                    menuId: 'M00020302',
                    menuName: 'markdown编辑器',
                    icon: 'EditPen',
                    menuPath: '/forms/markdownEditor',
                    menuOrder: 2,
                    isLeaf: 1,
                    menuParentId: 'M000203',
                    hasChildren: 0,
                    children: []
                  }
                ]
              },
            ]
          },
          {
            menuId: 'M0003',
            menuName: '表格相关',
            icon: 'Calendar',
            menuPath: '/table',
            menuOrder: 3,
            isLeaf: 0,
            menuParentId: 'M0000',
            hasChildren: 1,
            children: [
              {
                menuId: 'M000301',
                menuName: '表格1',
                icon: 'Grid',
                menuPath: '/table/table1',
                menuOrder: 1,
                isLeaf: 1,
                menuParentId: 'M00023',
                hasChildren: 0,
                children: []
              },
              {
                menuId: 'M000302',
                menuName: '表格2',
                icon: 'Grid',
                menuPath: '/table/table2',
                menuOrder: 2,
                isLeaf: 1,
                menuParentId: 'M0003',
                hasChildren: 0,
                children: []
              }
            ]
          }
        ]
      }
    },
  },
  {
    url: '/api/getUsers',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'OK',
        data: {
          'list|23': [
            {
              id: '@guid',
              name: '@cname',
              money: '@integer(100, 9999)',
              address: '@province @city @county',
              'state|1': ['成功', '失败'],
              date: '@date(yyyy-MM-dd)',
              thumb: '@image(200x200)'
            },
          ],
          total: 23
        },
      }
    },
  }
]

export function setupProdMockServer() {
  createProdMockServer(apiArr)
}
