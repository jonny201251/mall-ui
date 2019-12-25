import React from 'react'
import {Layout, Menu, Icon, LocaleProvider} from 'antd'
import 'antd/dist/antd.css'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
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
            <LocaleProvider locale={zh_CN}>
                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed} width={256}
                           style={{minHeight: '100vh', color: 'white'}}>
                        <div className={styles.logo}/>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['sub1']} defaultOpenKeys={['sub1']}>
                            <SubMenu
                                key="sub1"
                                title={<span><Icon type="credit-card"/><span>商品管理</span></span>}
                            >
                                <Menu.Item key="3"><Link to="/category/index">商品类目</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/brand/index">品牌管理</Link></Menu.Item>
                                <Menu.Item key="5"><Link to="/specificationGroup/index">规格组</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="/specificationParamName/index">规格参数</Link></Menu.Item>
                                <Menu.Item key="7"><Link to="/item/index">商品列表</Link></Menu.Item>
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
            </LocaleProvider>
        );
    }
}

export default AdminLayout