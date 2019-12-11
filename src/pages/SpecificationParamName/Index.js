import React, {PureComponent} from 'react'
import {Modal, message, Row, Col, Tree, Breadcrumb, Card} from 'antd'
import List, {Table, Pagination} from 'nolist/lib/wrapper/antd'
import {Input, Dialog, Button} from 'nowrapper/lib/antd'
import styles from '../common.less'

import CRUDForm from './CRUDForm'
import request from '../../utils/request'

let globalList
const adminControllerPath = '/mall/specificationParamName'
const adminControllerPath1 = '/mall/specificationGroup'
const adminControllerPath2 = '/mall/category'

class Index extends PureComponent {
    state = {
        treeData: [],
        categoryId: -1
    }
    handleOperator = (type) => {
        if ('create' === type) {
            Dialog.show({
                title: '新增',
                footerAlign: 'label',
                locale: 'zh',
                width: 400,
                enableValidate: true,
                content: <CRUDForm option={{type}}/>,
                onOk: (values, hide) => {
                    hide()
                    request.post(adminControllerPath + '/add', {data: {...values}}).then(res => {
                        if (res && res.code === 1) {
                            message.success("操作成功")
                            globalList.refresh()
                        } else {
                            message.error("操作失败")
                        }
                    })
                }
            })
        } else if ('edit' === type || 'view' === type) {
            if (this.state.record === undefined) {
                message.warning('请先单击一条数据!')
                return
            }
            let title = 'edit' === type ? '编辑' : '浏览'
            request(adminControllerPath + '/getById?id=' + this.state.record.id).then(res => {
                if (res && res.code === 1) {
                    Dialog.show({
                        title: title,
                        footerAlign: 'label',
                        locale: 'zh',
                        width: 400,
                        enableValidate: true,
                        content: <CRUDForm option={{type, record: res.data}}/>,
                        onOk: (values, hide) => {
                            hide()
                            request.post(adminControllerPath + '/edit', {data: {...values}}).then(res => {
                                if (res && res.code === 1) {
                                    message.success("操作成功")
                                    globalList.refresh()
                                } else {
                                    message.error("操作失败")
                                }
                            })
                        }
                    })
                } else {
                    message.error("操作失败")
                }
            })
        } else if ('delete' === type) {
            if (this.state.record === undefined) {
                message.warning('请先单击一条数据!')
                return
            }
            Dialog.show({
                title: '提示',
                footerAlign: 'label',
                locale: 'zh',
                width: 400,
                content: <p>确定要删除<span style={{fontWeight: 'bold'}}>参数组名称=<span
                    style={{color: 'red'}}>{this.state.record.name}</span></span>的数据吗?</p>,
                onOk: (values, hide) => {
                    hide()
                    request(adminControllerPath + '/delete?id=' + this.state.record.id).then(res => {
                        if (res && res.code === 1) {
                            globalList.refresh()
                            message.success("删除成功")
                        } else {
                            Modal.error({
                                title: '错误提示',
                                content: res.msg || "删除失败"
                            })
                        }
                    })
                }
            })
        }
    }

    handleError = (err) => {
        console.log('err', err);
    }

    onMount = (list) => {
        this.list = globalList = list;
    }

    onMount1 = (list1) => {
        this.list1 = list1;
    }

    clickOperation = (type, record) => {
        this.setState({record})
        if ('onDoubleClick' === type) {
            this.handleOperator('edit')
        }
    }

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <Tree.TreeNode title={item.title} key={item.key} dataRef={item} checked={true}>
                    {this.renderTreeNodes(item.children)}
                </Tree.TreeNode>
            )
        }
        return <TreeNode {...item} />
    })

    componentWillMount() {
        console.log(window.location)
        //取出 上级类目
        request.get(adminControllerPath2 + '/tree').then(res => {
            if (res && res.code === 1) {
                this.setState({treeData: res.data})
            }
        })
    }

    onSelect = (selectedKeys, info) => {
        let categoryId = parseInt(selectedKeys[0])
        this.setState({categoryId})//点击分页时，传递的参数
        this.list1.setUrl(adminControllerPath1 + '/list/' + categoryId)
        this.list1.refresh()
    }

    render() {
        return (
            <div>
                <Row>
                    <p>
                        <Breadcrumb style={{fontSize: 18}}>
                            <Breadcrumb.Item>商品分类</Breadcrumb.Item>
                            <Breadcrumb.Item>规格参数组</Breadcrumb.Item>
                        </Breadcrumb>
                    </p>
                    <Col span={5}>
                        <Tree onSelect={this.onSelect}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                    </Col>
                    <Col span={19}>
                        <List url={adminControllerPath1 + '/list/' + this.state.categoryId}
                              onMount={this.onMount1}>
                            <Table onRow={record => {
                                return {
                                    onClick: () => this.clickOperation('onClick', record),
                                }
                            }}>
                                <Table.Column title="参数组名称" dataIndex="name"/>
                            </Table>
                            <Pagination/>
                        </List>
                    </Col>
                </Row>
                <Row>
                    <p>
                        <Breadcrumb style={{fontSize: 18}}>
                            <Breadcrumb.Item>规格参数组</Breadcrumb.Item>
                            <Breadcrumb.Item>规格参数</Breadcrumb.Item>
                        </Breadcrumb>
                    </p>
                    <List url={adminControllerPath + '/list/' + this.state.categoryId} onError={this.handleError}
                          onMount={this.onMount}>
                        <div className={styles.marginBottom10}>
                            <Button icon="plus" type="primary" onClick={() => this.handleOperator('create')}>新增</Button>
                            <Button icon="edit" type="primary" onClick={() => this.handleOperator('edit')}
                                    className={styles.marginLeft20}>编辑</Button>
                            <Button icon="search" type="primary" onClick={() => this.handleOperator('view')}
                                    className={styles.marginLeft20}>浏览</Button>
                            <Button icon="delete" type="primary" onClick={() => this.handleOperator('delete')}
                                    className={styles.marginLeft20}>删除</Button>
                        </div>
                        <Table onRow={record => {
                            return {
                                onClick: () => this.clickOperation('onClick', record),
                                onDoubleClick: () => this.clickOperation('onDoubleClick', record)
                            }
                        }}>
                            <Table.Column title="参数名称" dataIndex="name"/>
                            <Table.Column title="是否为数值" dataIndex="isNumeric"/>
                            <Table.Column title="单位" dataIndex="unit"/>
                            <Table.Column title="是否通用" dataIndex="isGeneric"/>
                            <Table.Column title="排序" dataIndex="sort"
                                          defaultSortOrder={'ascend'} sorter={(a, b) => a.sort - b.sort}/>
                        </Table>
                        <Pagination/>
                    </List>
                </Row>
            </div>
        )
    }
}

export default Index