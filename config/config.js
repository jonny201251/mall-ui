export default {
    /*    base: "/mall/",//前端路由的前缀
        publicPath: "/mall/",//css、img等资源的前缀*/
    plugins: [
        ['umi-plugin-react', {
            antd: true,
            dva: {
                hmr: true,
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
                level: 1,
            },
            title: '职业健康商城',
            metas: [{charset: 'utf-8'}]
        }]
    ],
    routes: [
        {
            path: '/',
            component: '../layouts/AdminLayout',
            routes: [
                {path: '/', redirect: '/demo/index'},
                {path: '/demo/index', component: './Demo/Index'},
                {path: '/category/index', component: './Category/Index'},
                {path: '/brand/index', component: './Brand/Index'},
                {path: '/specificationGroup/index', component: './SpecificationGroup/Index'},
                {path: '/specificationParamName/index', component: './SpecificationParamName/Index'},
                {path: '/item/index', component: './Item/Index'},
            ]
        }
    ],
    /*    theme:{
            "primary-color": "#1DA57A"
        },*/
    proxy: {
        '/mall': {
            target: 'http://localhost:8082',
            changeOrigin: true,
        },
    }
    // disableCSSModules: true
}