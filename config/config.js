export default {
    /*    base: "/mall/",//前端路由的前缀
        publicPath: "/mall/",//css、img等资源的前缀*/
    targets: {
        ie: 11
    },
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
                {path: '/', redirect: '/categoryList'},
                {path: '/categoryList', component: './Category/CategoryList'},
                {path: '/brandList', component: './Brand/BrandList'},
                {path: '/complexSpecGroupList', component: './ComplexSpecification/SpecificationGroup/SpecificationGroupList'},
                {path: '/complexSpecParamList', component: './ComplexSpecification/SpecificationParam/SpecificationParamList'},
                {path: '/easySpecParamList', component: './EasySpecification/EasySpecParamList'},
                {path: '/itemList', component: './Item/ItemList'},
                {path: '/itemAdd', component: './Item/ItemAdd/ItemAdd'},
                {path: '/itemEdit', component: './Item/ItemEdit/ItemEdit'},
                {path: '/ImageRichText', component: './ImageRichText/ImageRichText'},
            ]
        }
    ],
        theme:{
            "primary-color": "#1DA57A"
        },
    proxy: {
        '/mall': {
            target: 'http://localhost:8082',
            changeOrigin: true,
        },
    }
    // disableCSSModules: true
}