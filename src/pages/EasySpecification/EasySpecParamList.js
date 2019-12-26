import React, {PureComponent} from 'react'
import {Breadcrumb, Col, message, Modal, Row, Tree} from 'antd'
import List, {Pagination, Table} from 'nolist/lib/wrapper/antd'
import {Button, Dialog} from 'nowrapper/lib/antd'
import styles from '../common.less'

import EasySpecParamForm from './EasySpecParamForm'
import request from '../../utils/request'

let globalList
const adminControllerPath = '/mall/complexSpecParam'
const adminControllerPath2 = '/mall/category'

class SpecificationParamList extends PureComponent {
    state = {
        treeData: [],
        selectedRowKeys: []
    }
    handleOperator = (type) => {
        if ('create' === type) {
            if (this.state.categoryId && this.state.groupId) {
                Dialog.show({
                    title: '新增',
                    footerAlign: 'label',
                    locale: 'zh',
                    width: 400,
                    enableValidate: true,
                    content: <EasySpecParamForm
                        option={{type, categoryId: this.state.categoryId, groupId: this.state.groupId}}/>,
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
            } else {
                message.warning('请选择-商品类目')
            }
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
                        content: <EasySpecParamForm option={{type, record: res.data}}/>,
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


    onMount = (list2) => {
        this.list2 = globalList = list2;
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
        //取出 上级类目
        request.get(adminControllerPath2 + '/tree').then(res => {
            if (res && res.code === 1) {
                this.setState({treeData: res.data})
            }
        })
    }

    onSelect = selectedKeys => {
        if (selectedKeys.length > 0) {
            let categoryId = parseInt(selectedKeys[0])
            this.setState({categoryId})//点击分页时，传递的参数
            this.list1.setUrl(adminControllerPath + '/list?categoryId=' + categoryId)
            this.list1.refresh()
        } else {
            this.list1.setUrl(adminControllerPath + '/list?categoryId=-1')
            this.list1.refresh()
        }
    }

    onChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys, groupId: selectedRows[0].id})
        //请求规格参数
        this.list2.setUrl(adminControllerPath + '/list?categoryId=' + this.state.categoryId + '&groupId=' + selectedRows[0].id)
        this.list2.refresh()
    }

    render() {
        return (
            <div>
                <Row>
                    <p>
                        <Breadcrumb style={{fontSize: 18}}>
                            <Breadcrumb.Item>商品类目</Breadcrumb.Item>
                            <Breadcrumb.Item>规格参数</Breadcrumb.Item>
                        </Breadcrumb>
                    </p>
                    <Col span={5}>
                        <Tree onSelect={this.onSelect} showLine>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                    </Col>
                    <Col span={19}>
                        <List
                            url={adminControllerPath + '/list?categoryId=' + (this.state.categoryId || -1) + '&groupId=' + (this.state.groupId || -1)}
                            onMount={this.onMount}>
                            <div className={styles.marginBottom10}>
                                <Button icon="plus" type="primary"
                                        onClick={() => this.handleOperator('create')}>新增</Button>
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
                                <Table.Column title="规格参数" dataIndex="name"/>
                                <Table.Column title="是否为数值" dataIndex="digit" render={val => val === 0 ? '否' : '是'}/>
                                <Table.Column title="单位" dataIndex="unit"/>
                                <Table.Column title="是否通用" dataIndex="generic" render={val => val === 0 ? '否' : '是'}/>
                                <Table.Column title="排序" dataIndex="sort"
                                              defaultSortOrder={'ascend'} sorter={(a, b) => a.sort - b.sort}/>
                            </Table>
                            <Pagination/>
                        </List>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default SpecificationParamList