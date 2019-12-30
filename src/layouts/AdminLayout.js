import React from 'react'
import {Icon, Layout, ConfigProvider, Menu} from 'antd'
//antd、noform、nowrapper、nolist的样式
import 'antd/dist/antd.less'
import 'nowrapper/dist/antd/index.css'
import 'noform/dist/index.css'
import 'nolist/dist/wrapper/antd.css'

import zhCN from 'antd/es/locale/zh_CN'
import Link from 'umi/link'
import styles from './AdminLayout.less'

const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu

class AdminLayout extends React.Component {
    state = {
        collapsed: false,
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed} width={256}
                           style={{minHeight: '100vh', color: 'white'}}>
                        <div className={styles.logo}/>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['sub1']}
                              defaultOpenKeys={['sub1', 'sub2']}>
                            <SubMenu
                                key="sub1"
                                title={<span><Icon type="credit-card"/><span>商品管理</span></span>}
                            >
                                <Menu.Item key="3"><Link to="/categoryList">商品类目</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/brandList">品牌管理</Link></Menu.Item>
                                <Menu.Item key="8"><Link to="/itemList">商品列表</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="sub2"
                                title={<span><Icon type="tool"/><span>规格参数</span></span>}
                            >
                                <SubMenu
                                    key="sub3"
                                    title={<span>复杂规格</span>}
                                >
                                    <Menu.Item key="5"><Link to="/complexSpecGroupList">规格组</Link></Menu.Item>
                                    <Menu.Item key="6"><Link to="/complexSpecParamList">规格参数</Link></Menu.Item>
                                </SubMenu>
                                <Menu.Item key="7"><Link to="/easySpecParamList">简单规格</Link></Menu.Item>
                                <Menu.Item key="80"><Link to="/ImageRichText">ImageRichText</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff', padding: 0}}>
                            <Icon
                                className={styles.trigger}
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                background: '#fff',
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}

                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        );
    }
}

export default AdminLayout